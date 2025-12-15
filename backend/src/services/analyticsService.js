const { query } = require('../config/database');

// =============================================
// 1. LINEAR REGRESSION - Dự đoán doanh thu
// =============================================
const analyzeRevenueTrend = async (startDate, endDate, predictDays = 30) => {
    try {
        // Lấy dữ liệu doanh thu theo ngày
        const sql = `
            SELECT 
                CAST(created_at AS DATE) as date,
                SUM(total) as revenue,
                COUNT(*) as order_count
            FROM Orders
            WHERE order_status = 'delivered'
                ${startDate ? `AND created_at >= @startDate` : ''}
                ${endDate ? `AND created_at <= @endDate` : ''}
            GROUP BY CAST(created_at AS DATE)
            ORDER BY date
        `;
        
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        const data = await query(sql, params);
        
        if (data.length < 2) {
            return {
                historical: data,
                prediction: [],
                trend: 'insufficient_data',
                r_squared: 0
            };
        }
        
        // Chuẩn bị dữ liệu cho Linear Regression
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        data.forEach((item, index) => {
            const x = index;
            const y = parseFloat(item.revenue);
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        });
        
        // Tính hệ số a và b cho y = ax + b
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Tính R-squared
        const yMean = sumY / n;
        let ssTotal = 0, ssResidual = 0;
        
        data.forEach((item, index) => {
            const y = parseFloat(item.revenue);
            const yPred = slope * index + intercept;
            ssTotal += Math.pow(y - yMean, 2);
            ssResidual += Math.pow(y - yPred, 2);
        });
        
        const rSquared = 1 - (ssResidual / ssTotal);
        
        // Dự đoán cho các ngày tiếp theo
        const predictions = [];
        const lastDate = new Date(data[data.length - 1].date);
        
        for (let i = 1; i <= predictDays; i++) {
            const predictedRevenue = slope * (n + i - 1) + intercept;
            const futureDate = new Date(lastDate);
            futureDate.setDate(futureDate.getDate() + i);
            
            predictions.push({
                date: futureDate.toISOString().split('T')[0],
                predicted_revenue: Math.max(0, predictedRevenue),
                confidence: rSquared
            });
        }
        
        // Xác định xu hướng
        let trend = 'stable';
        if (slope > 1000000) trend = 'increasing';
        else if (slope < -1000000) trend = 'decreasing';
        
        return {
            historical: data.map((item, index) => ({
                ...item,
                predicted: slope * index + intercept
            })),
            prediction: predictions,
            trend: trend,
            slope: slope,
            intercept: intercept,
            r_squared: rSquared,
            average_daily_revenue: sumY / n,
            total_revenue: sumY
        };
    } catch (error) {
        console.error('Revenue trend analysis error:', error);
        throw error;
    }
};

// =============================================
// 2. K-MEANS - Phân cụm sản phẩm theo tên
// =============================================
const clusterProductsByName = async (k = 5) => {
    try {
        // Lấy dữ liệu sản phẩm với thông tin bán hàng
        const sql = `
            SELECT 
                p.id,
                p.name,
                p.price,
                p.discount_percent,
                COALESCE(SUM(oi.quantity), 0) as total_sold,
                COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
                COALESCE(COUNT(DISTINCT oi.order_id), 0) as order_count
            FROM Products p
            LEFT JOIN OrderItems oi ON p.id = oi.product_id
            GROUP BY p.id, p.name, p.price, p.discount_percent
        `;
        
        const products = await query(sql);
        
        if (products.length === 0) {
            return { clusters: [], summary: {} };
        }
        
        // Trích xuất từ khóa từ tên sản phẩm
        const extractKeywords = (name) => {
            const keywords = [];
            const lowercaseName = name.toLowerCase();
            
            // Danh mục thực phẩm
            const categories = {
                'rau': ['rau', 'cải', 'salad', 'xà lách'],
                'củ': ['củ', 'khoai', 'cà rốt', 'su hào'],
                'quả': ['quả', 'trái', 'táo', 'cam', 'chuối', 'xoài', 'dưa'],
                'thịt': ['thịt', 'heo', 'bò', 'gà', 'vịt'],
                'cá': ['cá', 'hải sản', 'tôm', 'mực', 'nghêu'],
                'sữa': ['sữa', 'bơ', 'phô mai', 'yaourt', 'yogurt'],
                'đồ uống': ['nước', 'coca', 'pepsi', 'trà', 'cà phê', 'sting', 'revive'],
                'mì': ['mì', 'miến', 'bún', 'hảo hảo', 'omachi'],
                'gia vị': ['muối', 'đường', 'hạt nêm', 'mắm', 'tương', 'ớt', 'tiêu'],
                'bánh': ['bánh', 'kẹo', 'snack'],
                'dầu': ['dầu', 'mỡ']
            };
            
            for (const [category, words] of Object.entries(categories)) {
                for (const word of words) {
                    if (lowercaseName.includes(word)) {
                        keywords.push(category);
                        break;
                    }
                }
            }
            
            return keywords.length > 0 ? keywords : ['khác'];
        };
        
        // Gán nhãn cho sản phẩm dựa trên từ khóa
        const productsWithKeywords = products.map(p => ({
            ...p,
            keywords: extractKeywords(p.name),
            price_range: p.price < 50000 ? 'low' : p.price < 200000 ? 'medium' : 'high',
            performance: p.total_sold > 100 ? 'hot' : p.total_sold > 20 ? 'normal' : 'slow'
        }));
        
        // K-Means clustering
        // Khởi tạo centroids ngẫu nhiên
        const centroids = [];
        const usedIndices = new Set();
        
        while (centroids.length < Math.min(k, productsWithKeywords.length)) {
            const randomIndex = Math.floor(Math.random() * productsWithKeywords.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                centroids.push({
                    price: productsWithKeywords[randomIndex].price,
                    total_sold: productsWithKeywords[randomIndex].total_sold,
                    keywords: productsWithKeywords[randomIndex].keywords[0]
                });
            }
        }
        
        // Lặp K-Means (10 iterations)
        for (let iter = 0; iter < 10; iter++) {
            // Gán sản phẩm vào cluster gần nhất
            const clusters = Array(centroids.length).fill(null).map(() => []);
            
            productsWithKeywords.forEach(product => {
                let minDist = Infinity;
                let bestCluster = 0;
                
                centroids.forEach((centroid, idx) => {
                    // Khoảng cách Euclidean với normalization
                    const priceNorm = (product.price - 50000) / 500000;
                    const soldNorm = (product.total_sold) / 1000;
                    const centroidPriceNorm = (centroid.price - 50000) / 500000;
                    const centroidSoldNorm = (centroid.total_sold) / 1000;
                    
                    const priceDist = Math.pow(priceNorm - centroidPriceNorm, 2);
                    const soldDist = Math.pow(soldNorm - centroidSoldNorm, 2);
                    const keywordMatch = product.keywords.includes(centroid.keywords) ? 0 : 1;
                    
                    const dist = Math.sqrt(priceDist + soldDist) + keywordMatch * 0.5;
                    
                    if (dist < minDist) {
                        minDist = dist;
                        bestCluster = idx;
                    }
                });
                
                clusters[bestCluster].push(product);
            });
            
            // Cập nhật centroids
            clusters.forEach((cluster, idx) => {
                if (cluster.length > 0) {
                    const avgPrice = cluster.reduce((sum, p) => sum + p.price, 0) / cluster.length;
                    const avgSold = cluster.reduce((sum, p) => sum + p.total_sold, 0) / cluster.length;
                    
                    // Tìm keyword phổ biến nhất
                    const keywordCount = {};
                    cluster.forEach(p => {
                        p.keywords.forEach(kw => {
                            keywordCount[kw] = (keywordCount[kw] || 0) + 1;
                        });
                    });
                    const mostCommonKeyword = Object.keys(keywordCount).reduce((a, b) => 
                        keywordCount[a] > keywordCount[b] ? a : b
                    );
                    
                    centroids[idx] = {
                        price: avgPrice,
                        total_sold: avgSold,
                        keywords: mostCommonKeyword
                    };
                }
            });
        }
        
        // Tạo kết quả final
        const finalClusters = centroids.map((centroid, idx) => {
            const clusterProducts = productsWithKeywords.filter(product => {
                let minDist = Infinity;
                let bestCluster = 0;
                
                centroids.forEach((c, i) => {
                    const priceNorm = (product.price - 50000) / 500000;
                    const soldNorm = (product.total_sold) / 1000;
                    const centroidPriceNorm = (c.price - 50000) / 500000;
                    const centroidSoldNorm = (c.total_sold) / 1000;
                    
                    const priceDist = Math.pow(priceNorm - centroidPriceNorm, 2);
                    const soldDist = Math.pow(soldNorm - centroidSoldNorm, 2);
                    const keywordMatch = product.keywords.includes(c.keywords) ? 0 : 1;
                    
                    const dist = Math.sqrt(priceDist + soldDist) + keywordMatch * 0.5;
                    
                    if (dist < minDist) {
                        minDist = dist;
                        bestCluster = i;
                    }
                });
                
                return bestCluster === idx;
            });
            
            return {
                cluster_id: idx + 1,
                cluster_name: `${centroid.keywords.toUpperCase()} - ${centroid.price < 50000 ? 'Giá rẻ' : centroid.price < 200000 ? 'Trung bình' : 'Cao cấp'}`,
                centroid: centroid,
                product_count: clusterProducts.length,
                products: clusterProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    total_sold: p.total_sold,
                    total_revenue: p.total_revenue,
                    keywords: p.keywords
                })),
                avg_price: clusterProducts.reduce((sum, p) => sum + p.price, 0) / clusterProducts.length,
                total_revenue: clusterProducts.reduce((sum, p) => sum + parseFloat(p.total_revenue), 0)
            };
        }).filter(c => c.product_count > 0);
        
        return {
            clusters: finalClusters,
            summary: {
                total_products: products.length,
                k: finalClusters.length,
                total_revenue: products.reduce((sum, p) => sum + parseFloat(p.total_revenue), 0)
            }
        };
    } catch (error) {
        console.error('Product clustering error:', error);
        throw error;
    }
};

// =============================================
// 3. DECISION TREE - Phân loại khách hàng
// =============================================
const segmentCustomers = async () => {
    try {
        // Lấy dữ liệu khách hàng với lịch sử mua hàng
        const sql = `
            SELECT 
                u.id,
                u.full_name,
                u.email,
                COALESCE(COUNT(DISTINCT o.id), 0) as total_orders,
                COALESCE(SUM(o.total), 0) as total_spent,
                COALESCE(AVG(o.total), 0) as avg_order_value,
                COALESCE(MAX(o.created_at), u.created_at) as last_order_date,
                DATEDIFF(day, COALESCE(MAX(o.created_at), u.created_at), GETDATE()) as days_since_last_order
            FROM Users u
            LEFT JOIN Orders o ON u.id = o.user_id AND o.order_status = 'delivered'
            WHERE u.role = 'customer'
            GROUP BY u.id, u.full_name, u.email, u.created_at
        `;
        
        const customers = await query(sql);
        
        if (customers.length === 0) {
            return { segments: [], summary: {} };
        }
        
        // Decision Tree Classification
        const classifyCustomer = (customer) => {
            const totalSpent = parseFloat(customer.total_spent);
            const totalOrders = customer.total_orders;
            const daysSinceLastOrder = customer.days_since_last_order;
            const avgOrderValue = parseFloat(customer.avg_order_value);
            
            // Node 1: Phân loại theo tổng chi tiêu
            if (totalSpent >= 10000000) { // >= 10 triệu
                // High Value Customers
                if (daysSinceLastOrder <= 30) {
                    return {
                        segment: 'VIP',
                        tier: 1,
                        description: 'Khách hàng VIP - Chi tiêu cao, mua gần đây',
                        action: 'Ưu đãi đặc biệt, chăm sóc cá nhân hóa'
                    };
                } else {
                    return {
                        segment: 'At Risk VIP',
                        tier: 2,
                        description: 'Khách VIP có nguy cơ rời bỏ',
                        action: 'Chương trình giữ chân, ưu đãi hấp dẫn'
                    };
                }
            } else if (totalSpent >= 3000000) { // 3-10 triệu
                // Medium Value Customers
                if (totalOrders >= 10 && daysSinceLastOrder <= 60) {
                    return {
                        segment: 'Loyal',
                        tier: 2,
                        description: 'Khách hàng trung thành',
                        action: 'Thưởng điểm, khuyến mãi định kỳ'
                    };
                } else if (daysSinceLastOrder <= 90) {
                    return {
                        segment: 'Regular',
                        tier: 3,
                        description: 'Khách hàng thường xuyên',
                        action: 'Khuyến khích mua thêm, cross-sell'
                    };
                } else {
                    return {
                        segment: 'Hibernating',
                        tier: 4,
                        description: 'Khách hàng ngủ đông',
                        action: 'Email marketing, ưu đãi comeback'
                    };
                }
            } else if (totalSpent > 0) {
                // Low Value Customers
                if (totalOrders <= 2 && daysSinceLastOrder <= 180) {
                    return {
                        segment: 'New',
                        tier: 3,
                        description: 'Khách hàng mới',
                        action: 'Ưu đãi khách hàng mới, giới thiệu sản phẩm'
                    };
                } else if (daysSinceLastOrder > 180) {
                    return {
                        segment: 'Lost',
                        tier: 5,
                        description: 'Khách hàng đã mất',
                        action: 'Chiến dịch win-back mạnh'
                    };
                } else {
                    return {
                        segment: 'Occasional',
                        tier: 4,
                        description: 'Khách hàng thỉnh thoảng',
                        action: 'Khuyến mãi theo mùa, sản phẩm phù hợp'
                    };
                }
            } else {
                // No Purchase
                return {
                    segment: 'Potential',
                    tier: 5,
                    description: 'Khách hàng tiềm năng',
                    action: 'Ưu đãi đơn đầu tiên, email onboarding'
                };
            }
        };
        
        // Phân loại từng khách hàng
        const classified = customers.map(customer => ({
            ...customer,
            classification: classifyCustomer(customer)
        }));
        
        // Tổng hợp theo segment
        const segments = {};
        classified.forEach(customer => {
            const segmentName = customer.classification.segment;
            if (!segments[segmentName]) {
                segments[segmentName] = {
                    segment: segmentName,
                    tier: customer.classification.tier,
                    description: customer.classification.description,
                    action: customer.classification.action,
                    customers: [],
                    count: 0,
                    total_revenue: 0,
                    avg_order_value: 0
                };
            }
            
            segments[segmentName].customers.push({
                id: customer.id,
                full_name: customer.full_name,
                email: customer.email,
                total_orders: customer.total_orders,
                total_spent: customer.total_spent,
                days_since_last_order: customer.days_since_last_order
            });
            segments[segmentName].count++;
            segments[segmentName].total_revenue += parseFloat(customer.total_spent);
        });
        
        // Tính avg_order_value cho mỗi segment
        Object.values(segments).forEach(segment => {
            const totalOrders = segment.customers.reduce((sum, c) => sum + c.total_orders, 0);
            segment.avg_order_value = totalOrders > 0 ? segment.total_revenue / totalOrders : 0;
        });
        
        // Sắp xếp theo tier
        const sortedSegments = Object.values(segments).sort((a, b) => a.tier - b.tier);
        
        return {
            segments: sortedSegments,
            summary: {
                total_customers: customers.length,
                total_revenue: customers.reduce((sum, c) => sum + parseFloat(c.total_spent), 0),
                avg_customer_value: customers.reduce((sum, c) => sum + parseFloat(c.total_spent), 0) / customers.length
            }
        };
    } catch (error) {
        console.error('Customer segmentation error:', error);
        throw error;
    }
};

// =============================================
// DASHBOARD STATISTICS
// =============================================
const getDashboardStatistics = async () => {
    try {
        // Tổng doanh thu
        const revenueSql = `
            SELECT 
                SUM(total) as total_revenue,
                COUNT(*) as total_orders,
                AVG(total) as avg_order_value
            FROM Orders
            WHERE order_status = 'delivered'
        `;
        const revenueStats = await query(revenueSql);
        
        // Tổng sản phẩm
        const productSql = `SELECT COUNT(*) as total_products FROM Products`;
        const productStats = await query(productSql);
        
        // Tổng khách hàng
        const customerSql = `SELECT COUNT(*) as total_customers FROM Users WHERE role = 'customer'`;
        const customerStats = await query(customerSql);
        
        // Doanh thu 7 ngày gần nhất
        const recentRevenueSql = `
            SELECT 
                SUM(total) as recent_revenue,
                COUNT(*) as recent_orders
            FROM Orders
            WHERE order_status = 'delivered'
                AND created_at >= DATEADD(day, -7, GETDATE())
        `;
        const recentStats = await query(recentRevenueSql);
        
        return {
            total_revenue: revenueStats[0]?.total_revenue || 0,
            total_orders: revenueStats[0]?.total_orders || 0,
            avg_order_value: revenueStats[0]?.avg_order_value || 0,
            total_products: productStats[0]?.total_products || 0,
            total_customers: customerStats[0]?.total_customers || 0,
            recent_revenue: recentStats[0]?.recent_revenue || 0,
            recent_orders: recentStats[0]?.recent_orders || 0
        };
    } catch (error) {
        console.error('Dashboard statistics error:', error);
        throw error;
    }
};

// Top sản phẩm bán chạy
const getTopSellingProducts = async (limit = 10, days = 30) => {
    try {
        const sql = `
            SELECT TOP ${limit}
                p.id,
                p.name,
                p.price,
                p.images,
                SUM(oi.quantity) as total_sold,
                SUM(oi.quantity * oi.price) as total_revenue,
                COUNT(DISTINCT oi.order_id) as order_count
            FROM Products p
            INNER JOIN OrderItems oi ON p.id = oi.product_id
            INNER JOIN Orders o ON oi.order_id = o.id
            WHERE o.order_status = 'delivered'
                AND o.created_at >= DATEADD(day, -${days}, GETDATE())
            GROUP BY p.id, p.name, p.price, p.images
            ORDER BY total_sold DESC
        `;
        
        return await query(sql);
    } catch (error) {
        console.error('Top selling products error:', error);
        throw error;
    }
};

// Doanh thu theo tháng
const getMonthlyRevenueData = async (months = 12) => {
    try {
        const sql = `
            SELECT 
                FORMAT(created_at, 'yyyy-MM') as month,
                SUM(total) as revenue,
                COUNT(*) as order_count
            FROM Orders
            WHERE order_status = 'delivered'
                AND created_at >= DATEADD(month, -${months}, GETDATE())
            GROUP BY FORMAT(created_at, 'yyyy-MM')
            ORDER BY month
        `;
        
        return await query(sql);
    } catch (error) {
        console.error('Monthly revenue error:', error);
        throw error;
    }
};

module.exports = {
    analyzeRevenueTrend,
    clusterProductsByName,
    segmentCustomers,
    getDashboardStatistics,
    getTopSellingProducts,
    getMonthlyRevenueData
};
