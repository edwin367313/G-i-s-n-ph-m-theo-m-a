const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Database configuration
const config = {
    server: 'localhost',
    database: 'order',
    user: 'sa',
    password: process.env.DB_PASSWORD || '123456',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

async function importCSVtoDatabase() {
    const csvFilePath = path.join(__dirname, '..', 'Groceries_dataset.csv');
    const results = [];
    
    console.log('📖 Reading CSV file...');
    
    // Read CSV file
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                console.log(`✅ Read ${results.length} records from CSV`);
                
                try {
                    // Connect to database
                    console.log('🔌 Connecting to database...');
                    const pool = await sql.connect(config);
                    console.log('✅ Connected to database');
                    
                    // Insert data in batches
                    const batchSize = 1000;
                    let inserted = 0;
                    
                    for (let i = 0; i < results.length; i += batchSize) {
                        const batch = results.slice(i, i + batchSize);
                        
                        for (const row of batch) {
                            // Parse date from dd/mm/yyyy or d/m/yyyy format
                            const dateParts = row.Date.split('/');
                            const day = parseInt(dateParts[0]);
                            const month = parseInt(dateParts[1]);
                            const year = parseInt(dateParts[2]);
                            const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            
                            await pool.request()
                                .input('member_number', sql.Int, parseInt(row.Member_number))
                                .input('date', sql.Date, dateStr)
                                .input('itemDescription', sql.NVarChar, row.itemDescription)
                                .query(`
                                    INSERT INTO Groceries (Member_number, Date, itemDescription)
                                    VALUES (@member_number, @date, @itemDescription)
                                `);
                            
                            inserted++;
                        }
                        
                        console.log(`⏳ Inserted ${inserted}/${results.length} records...`);
                    }
                    
                    console.log(`✅ Successfully imported ${inserted} records!`);
                    
                    // Get statistics
                    const result = await pool.request().query(`
                        SELECT 
                            COUNT(*) as total_records,
                            COUNT(DISTINCT Member_number) as unique_members,
                            COUNT(DISTINCT itemDescription) as unique_items,
                            MIN(Date) as earliest_date,
                            MAX(Date) as latest_date
                        FROM Groceries
                    `);
                    
                    console.log('\n📊 Database Statistics:');
                    console.log(result.recordset[0]);
                    
                    await pool.close();
                    resolve();
                } catch (error) {
                    console.error('❌ Error:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('❌ Error reading CSV:', error);
                reject(error);
            });
    });
}

// Run import
importCSVtoDatabase()
    .then(() => {
        console.log('\n✅ Import completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Import failed:', error);
        process.exit(1);
    });
