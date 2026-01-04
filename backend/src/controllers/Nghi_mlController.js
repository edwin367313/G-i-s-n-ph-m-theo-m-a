"""
Controller cho Machine Learning APIs
"""
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
}

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
