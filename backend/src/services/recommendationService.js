const sql = require('mssql');
const dbConfig = require('../config/database');

/**
 * Lấy sản phẩm hot theo mùa
 * @param {string} season - 'Xuân', 'Hạ', 'Thu', 'Đông'
 * @param {number} limit - Số lượng sản phẩm (default: 20)
 */
const getSeasonalProducts = async (season, limit = 20) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('season', sql.NVarChar, season)
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit) 
          ProductName,
          PurchaseCount,
          CustomerCount,
          PopularityScore,
          LastUpdated
        FROM SeasonalProducts
        WHERE Season = @season
        ORDER BY PopularityScore DESC
      `);
    
    return result.recordset;
  } catch (error) {
    console.error('Error getting seasonal products:', error);
    throw error;
  }
};

/**
 * Lấy gợi ý sản phẩm dựa trên sản phẩm đã chọn
 * @param {string} productName - Tên sản phẩm
 * @param {string} season - Mùa (optional)
 * @param {number} limit - Số lượng gợi ý (default: 5)
 */
const getProductSuggestions = async (productName, season = null, limit = 5) => {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request()
      .input('productName', sql.NVarChar, productName)
      .input('limit', sql.Int, limit);
    
    let query;
    if (season) {
      request.input('season', sql.NVarChar, season);
      query = `
        SELECT TOP (@limit)
          ProductB as SuggestedProduct,
          Confidence,
          Lift,
          Season
        FROM ProductAssociations
        WHERE ProductA = @productName AND Season = @season
        ORDER BY Confidence DESC, Lift DESC
      `;
    } else {
      query = `
        SELECT TOP (@limit)
          ProductB as SuggestedProduct,
          Confidence,
          Lift,
          Season
        FROM ProductAssociations
        WHERE ProductA = @productName
        ORDER BY Confidence DESC, Lift DESC
      `;
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting product suggestions:', error);
    throw error;
  }
};

/**
 * Lấy gợi ý cho giỏ hàng (dựa trên sản phẩm trong giỏ)
 * @param {Array} cartItems - Danh sách sản phẩm trong giỏ
 * @param {string} currentSeason - Mùa hiện tại
 * @param {number} limit - Số lượng gợi ý
 */
const getCartRecommendations = async (cartItems, currentSeason, limit = 5) => {
  try {
    if (!cartItems || cartItems.length === 0) {
      // Nếu giỏ rỗng, trả về sản phẩm hot của mùa
      return await getSeasonalProducts(currentSeason, limit);
    }

    const pool = await sql.connect(dbConfig);
    
    // Lấy tên sản phẩm từ giỏ hàng
    const productNames = cartItems.map(item => item.productName || item.name);
    
    // Tạo danh sách tham số cho IN clause
    const placeholders = productNames.map((_, index) => `@product${index}`).join(',');
    
    const request = pool.request();
    productNames.forEach((name, index) => {
      request.input(`product${index}`, sql.NVarChar, name);
    });
    request.input('season', sql.NVarChar, currentSeason);
    request.input('limit', sql.Int, limit);
    
    // Lấy suggestions cho tất cả sản phẩm trong giỏ
    const result = await request.query(`
      SELECT TOP (@limit)
        ProductB as ProductName,
        AVG(Confidence) as AvgConfidence,
        AVG(Lift) as AvgLift,
        COUNT(*) as MatchCount
      FROM ProductAssociations
      WHERE ProductA IN (${placeholders})
        AND (Season = @season OR Season IS NULL)
        AND ProductB NOT IN (${placeholders})
      GROUP BY ProductB
      ORDER BY AvgConfidence DESC, MatchCount DESC
    `);
    
    return result.recordset;
  } catch (error) {
    console.error('Error getting cart recommendations:', error);
    throw error;
  }
};

/**
 * Lấy báo cáo theo 4 mùa
 */
const getQuarterlyReport = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT 
        Season,
        COUNT(DISTINCT ProductName) as TotalProducts,
        SUM(PurchaseCount) as TotalPurchases,
        SUM(CustomerCount) as TotalCustomers
      FROM SeasonalProducts
      GROUP BY Season
      ORDER BY 
        CASE Season
          WHEN N'Xuân' THEN 1
          WHEN N'Hạ' THEN 2
          WHEN N'Thu' THEN 3
          WHEN N'Đông' THEN 4
        END
    `);
    
    // Lấy top 10 sản phẩm mỗi mùa
    const detailsPromises = ['Xuân', 'Hạ', 'Thu', 'Đông'].map(async (season) => {
      const products = await getSeasonalProducts(season, 10);
      return { season, products };
    });
    
    const details = await Promise.all(detailsPromises);
    
    return {
      summary: result.recordset,
      details: details.reduce((acc, item) => {
        acc[item.season] = item.products;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting quarterly report:', error);
    throw error;
  }
};

/**
 * Xác định mùa hiện tại từ tháng
 */
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 1 && month <= 3) return 'Xuân';
  if (month >= 4 && month <= 6) return 'Hạ';
  if (month >= 7 && month <= 9) return 'Thu';
  return 'Đông';
};

/**
 * Lấy top associations rules
 * @param {string} season - Mùa (optional)
 * @param {number} limit - Số lượng rules
 */
const getTopAssociations = async (season = null, limit = 20) => {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request().input('limit', sql.Int, limit);
    
    let query;
    if (season) {
      request.input('season', sql.NVarChar, season);
      query = `
        SELECT TOP (@limit)
          ProductA,
          ProductB,
          Support,
          Confidence,
          Lift,
          Season,
          LastUpdated
        FROM ProductAssociations
        WHERE Season = @season
        ORDER BY Confidence DESC, Lift DESC
      `;
    } else {
      query = `
        SELECT TOP (@limit)
          ProductA,
          ProductB,
          Support,
          Confidence,
          Lift,
          Season,
          LastUpdated
        FROM ProductAssociations
        WHERE Season IS NULL
        ORDER BY Confidence DESC, Lift DESC
      `;
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error getting top associations:', error);
    throw error;
  }
};

module.exports = {
  getSeasonalProducts,
  getProductSuggestions,
  getCartRecommendations,
  getQuarterlyReport,
  getCurrentSeason,
  getTopAssociations
};
