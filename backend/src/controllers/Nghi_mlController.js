/**
 * Controller cho Machine Learning APIs
 */
const { spawn } = require('child_process');
const path = require('path');

class MLController {
  /**
   * Bước 1: Phân tích giỏ hàng (Market Basket Analysis)
   */
  async marketBasketAnalysis(req, res) {
    try {
      const { minSupport = 0.01, minConfidence = 0.3, limit = 10 } = req.query;
      
      const result = await runPythonScript('Nghi_apriori.py', [
        '--min-support', minSupport,
        '--min-confidence', minConfidence,
        '--limit', limit
      ]);
      
      res.json({
        success: true,
        data: result,
        message: 'Phân tích giỏ hàng thành công'
      });
    } catch (error) {
      console.error('Market Basket Analysis Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi phân tích giỏ hàng',
        error: error.message
      });
    }
  }

  /**
   * Bước 2: Phân khúc khách hàng (K-Means)
   */
  async customerSegmentation(req, res) {
    try {
      const { nClusters = 3 } = req.body;
      
      const result = await runPythonScript('Nghi_kmeans.py', [
        '--n-clusters', nClusters
      ]);
      
      res.json({
        success: true,
        data: result,
        message: 'Phân khúc khách hàng thành công'
      });
    } catch (error) {
      console.error('Customer Segmentation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi phân khúc khách hàng',
        error: error.message
      });
    }
  }

  /**
   * Bước 3 & 4: Huấn luyện Decision Tree
   */
  async trainDecisionTree(req, res) {
    try {
      const { maxDepth = 5 } = req.body;
      
      const result = await runPythonScript('Nghi_decisiontree.py', [
        '--max-depth', maxDepth
      ]);
      
      res.json({
        success: true,
        data: result,
        message: 'Huấn luyện Decision Tree thành công'
      });
    } catch (error) {
      console.error('Decision Tree Training Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi huấn luyện Decision Tree',
        error: error.message
      });
    }
  }

  /**
   * Bước 5: Dự đoán loại khách hàng mới
   */
  async predictCustomerType(req, res) {
    try {
      const { recency, frequency, monetary, accountAge, hasPhone, hasAddress } = req.body;
      
      // Validate input
      if (recency === undefined || frequency === undefined || monetary === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: recency, frequency, monetary'
        });
      }
      
      const features = {
        recency,
        frequency,
        monetary,
        account_age_years: accountAge || 0,
        has_phone: hasPhone ? 1 : 0,
        has_address: hasAddress ? 1 : 0,
        rfm_score: calculateRFMScore(recency, frequency, monetary)
      };
      
      const result = await runPythonScript('predict.py', [
        JSON.stringify(features)
      ]);
      
      res.json({
        success: true,
        data: result,
        message: 'Dự đoán thành công'
      });
    } catch (error) {
      console.error('Prediction Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi dự đoán',
        error: error.message
      });
    }
  }

  /**
   * Chạy toàn bộ pipeline ML
   */
  async runFullPipeline(req, res) {
    try {
      console.log('🚀 Bắt đầu chạy pipeline ML...');
      
      // Bước 1: Apriori
      console.log('📦 Bước 1: Phân tích giỏ hàng...');
      const aprioriResult = await runPythonScript('Nghi_apriori.py');
      
      // Bước 2: K-Means
      console.log('👥 Bước 2: Phân khúc khách hàng...');
      const kmeansResult = await runPythonScript('Nghi_kmeans.py');
      
      // Bước 3: Decision Tree
      console.log('🌳 Bước 3: Huấn luyện Decision Tree...');
      const dtResult = await runPythonScript('Nghi_decisiontree.py');
      
      res.json({
        success: true,
        data: {
          marketBasket: aprioriResult,
          segmentation: kmeansResult,
          classification: dtResult
        },
        message: 'Hoàn thành pipeline ML'
      });
    } catch (error) {
      console.error('Pipeline Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi chạy pipeline ML',
        error: error.message
      });
    }
  }

  /**
   * Lấy các itemsets liên quan đến 1 sản phẩm
   */
  async getProductAssociations(req, res) {
    try {
      const { productId } = req.params;
      // Giảm ngưỡng để có nhiều kết quả hơn: 800 itemsets_2, 200 itemsets_3
      const { minSupport = 0.005, minConfidence = 0.1, minLift = 1.0, month, year } = req.query;
      
      console.log('🔗 getProductAssociations called with:', { productId, month, year });
      
      const pool = await require('../config/database').getPool();
      
      // Lấy tên sản phẩm
      const productResult = await pool.request()
        .input('id', require('mssql').Int, productId)
        .query('SELECT name FROM Products WHERE id = @id');
      
      if (!productResult.recordset[0]) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }
      
      const productName = productResult.recordset[0].name;
      
      // Chạy Apriori với product name
      const pythonPath = path.join(__dirname, '../ml/Nghi_apriori.py');
      const venvPython = path.join(process.cwd(), '..', '.venv', 'Scripts', 'python.exe');
      
      const args = [
        pythonPath,
        productName,
        minSupport.toString(),
        minConfidence.toString()
      ];
      
      // Thêm month/year nếu có
      if (month && year) {
        args.push(month.toString());
        args.push(year.toString());
        console.log('📅 Calling Python with date filter:', { month, year, args });
      } else {
        console.log('⚠️ Calling Python without date filter');
      }
      
      return new Promise((resolve, reject) => {
        const pythonProcess = spawn(venvPython, args);
        
        let outputData = '';
        let errorData = '';
        
        pythonProcess.stdout.on('data', (data) => {
          outputData += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          errorData += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error('Python Error:', errorData);
            return res.status(500).json({
              success: false,
              message: 'Lỗi khi phân tích Apriori',
              error: errorData
            });
          }
          
          try {
            const result = JSON.parse(outputData);
            
            res.json({
              success: true,
              data: {
                productName,
                itemsets_2: result.itemsets_2 || [],
                itemsets_3: result.itemsets_3 || []
              }
            });
            resolve();
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw output:', outputData);
            res.status(500).json({
              success: false,
              message: 'Lỗi khi parse kết quả Python',
              error: parseError.message
            });
            reject(parseError);
          }
        });
      });
    } catch (error) {
      console.error('Product Associations Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy product associations',
        error: error.message
      });
    }
  }

  /**
   * Lấy danh sách customer segments
   */
  async getCustomerSegments(req, res) {
    try {
      const { month, year } = req.query;
      console.log('📊 getCustomerSegments called with:', { month, year });
      const pool = await require('../config/database').getPool();
      
      // Thêm date filter nếu có
      let dateFilter = '';
      if (month && year) {
        dateFilter = ` AND MONTH(o.created_at) = ${month} AND YEAR(o.created_at) = ${year}`;
        console.log('🔍 Date filter applied:', dateFilter);
      } else {
        console.log('⚠️ No date filter - showing all data');
      }
      
      // Query với subquery để tính RFM trước
      const result = await pool.request().query(`
        WITH CustomerRFM AS (
          SELECT 
            u.id,
            u.full_name,
            DATEDIFF(day, MAX(o.created_at), GETDATE()) as recency,
            COUNT(DISTINCT o.id) as frequency,
            ISNULL(SUM(o.total_amount), 0) as monetary
          FROM Users u
          LEFT JOIN Orders o ON u.id = o.user_id AND o.status IN (N'Đã giao', N'Đá giao', 'DELIVERED')${dateFilter}
          WHERE u.role = 'customer'
          GROUP BY u.id, u.full_name
        ),
        CustomerSegments AS (
          SELECT 
            *,
            CASE 
              WHEN recency <= 30 AND frequency >= 5 THEN N'VIP'
              WHEN recency <= 90 AND frequency >= 2 THEN N'Thường xuyên'
              ELSE N'Vãng lai'
            END as segment
          FROM CustomerRFM
        )
        SELECT 
          segment,
          COUNT(*) as customer_count,
          AVG(CAST(recency as FLOAT)) as avg_recency,
          AVG(CAST(frequency as FLOAT)) as avg_frequency,
          AVG(monetary) as avg_monetary,
          SUM(monetary) as total_revenue
        FROM CustomerSegments
        GROUP BY segment
        ORDER BY 
          CASE segment
            WHEN N'VIP' THEN 1
            WHEN N'Thường xuyên' THEN 2
            WHEN N'Vãng lai' THEN 3
          END
      `);
      
      res.json({
        success: true,
        data: result.recordset
      });
    } catch (error) {
      console.error('Customer Segments Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy customer segments',
        error: error.message
      });
    }
  }

  /**
   * Lấy danh sách khách hàng trong 1 segment
   */
  async getSegmentCustomers(req, res) {
    try {
      const { segmentId } = req.params;
      const { month, year } = req.query;
      const segmentName = decodeURIComponent(segmentId);
      const pool = await require('../config/database').getPool();
      
      // Thêm date filter nếu có
      let dateFilter = '';
      if (month && year) {
        dateFilter = ` AND MONTH(o.created_at) = ${month} AND YEAR(o.created_at) = ${year}`;
      }
      
      const result = await pool.request()
        .input('segment', require('mssql').NVarChar, segmentName)
        .query(`
        SELECT 
          u.id as user_id,
          u.full_name,
          u.email,
          u.phone,
          DATEDIFF(day, MAX(o.created_at), GETDATE()) as recency,
          COUNT(DISTINCT o.id) as frequency,
          SUM(o.total_amount) as monetary,
          CASE 
            WHEN DATEDIFF(day, MAX(o.created_at), GETDATE()) <= 30 AND COUNT(DISTINCT o.id) >= 5 THEN N'VIP'
            WHEN DATEDIFF(day, MAX(o.created_at), GETDATE()) <= 90 AND COUNT(DISTINCT o.id) >= 2 THEN N'Thường xuyên'
            ELSE N'Vãng lai'
          END as segment
        FROM Users u
        LEFT JOIN Orders o ON u.id = o.user_id AND o.status IN (N'Đã giao', N'Đá giao', 'DELIVERED')${dateFilter}
        WHERE u.role = 'customer'
        GROUP BY u.id, u.full_name, u.email, u.phone
        HAVING CASE 
          WHEN DATEDIFF(day, MAX(o.created_at), GETDATE()) <= 30 AND COUNT(DISTINCT o.id) >= 5 THEN N'VIP'
          WHEN DATEDIFF(day, MAX(o.created_at), GETDATE()) <= 90 AND COUNT(DISTINCT o.id) >= 2 THEN N'Thường xuyên'
          ELSE N'Vãng lai'
        END = @segment
        ORDER BY monetary DESC
      `);
      
      res.json({
        success: true,
        data: result.recordset
      });
    } catch (error) {
      console.error('Segment Customers Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy segment customers',
        error: error.message
      });
    }
  }

  /**
   * Lấy lịch sử mua hàng của khách
   */
  async getCustomerPurchaseHistory(req, res) {
    try {
      const { customerId } = req.params;
      const pool = await require('../config/database').getPool();
      
      // Get customer info
      const customerResult = await pool.request()
        .input('id', require('mssql').Int, customerId)
        .query('SELECT id, full_name, email, phone FROM Users WHERE id = @id');
      
      if (!customerResult.recordset[0]) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy khách hàng'
        });
      }
      
      // Get purchase history grouped by category
      const historyResult = await pool.request()
        .input('userId', require('mssql').Int, customerId)
        .query(`
          SELECT 
            c.name as category_name,
            COUNT(DISTINCT oi.product_id) as product_count,
            SUM(oi.quantity) as total_quantity,
            SUM(oi.total_price) as total_spent
          FROM Orders o
          JOIN OrderItems oi ON o.id = oi.order_id
          JOIN Products p ON oi.product_id = p.id
          JOIN Categories c ON p.category_id = c.id
          WHERE o.user_id = @userId AND o.status IN (N'Đã giao', N'Đá giao', 'DELIVERED')
          GROUP BY c.name
          ORDER BY total_spent DESC
        `);
      
      // Get top products
      const topProductsResult = await pool.request()
        .input('userId', require('mssql').Int, customerId)
        .query(`
          SELECT TOP 10
            p.name as product_name,
            COUNT(DISTINCT o.id) as order_count,
            SUM(oi.quantity) as total_quantity,
            SUM(oi.total_price) as total_spent
          FROM Orders o
          JOIN OrderItems oi ON o.id = oi.order_id
          JOIN Products p ON oi.product_id = p.id
          WHERE o.user_id = @userId AND o.status IN (N'Đã giao', N'Đá giao', 'DELIVERED')
          GROUP BY p.name
          ORDER BY order_count DESC, total_spent DESC
        `);
      
      res.json({
        success: true,
        data: {
          customer: customerResult.recordset[0],
          categories: historyResult.recordset,
          top_products: topProductsResult.recordset
        }
      });
    } catch (error) {
      console.error('Customer Purchase History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy purchase history',
        error: error.message
      });
    }
  }
};

/**
 * Helper function: Chạy Python script
 */
function runPythonScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'ml', scriptName);
    const pythonPath = process.env.PYTHON_PATH || 'python';
    
    const pythonProcess = spawn(pythonPath, [scriptPath, ...args]);
    
    let outputData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          // Tìm JSON output trong kết quả
          const jsonMatch = outputData.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            resolve(JSON.parse(jsonMatch[0]));
          } else {
            resolve({ output: outputData });
          }
        } catch (e) {
          resolve({ output: outputData });
        }
      } else {
        reject(new Error(errorData || `Python script exited with code ${code}`));
      }
    });
  });
}

/**
 * Helper function: Tính RFM Score
 */
function calculateRFMScore(recency, frequency, monetary) {
  // Normalize (giả sử max values)
  const maxRecency = 365;
  const maxFrequency = 50;
  const maxMonetary = 10000000;
  
  return (
    ((maxRecency - recency) / maxRecency) * 0.3 +
    (frequency / maxFrequency) * 0.3 +
    (monetary / maxMonetary) * 0.4
  );
}

module.exports = new MLController();
