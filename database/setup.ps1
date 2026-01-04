# Setup Database Script
$Server = "EDWIN"
$Database = "DB_SieuThi_Hung"
$Files = @("schema.sql", "Base.sql", "Products.sql", "orders.sql", "setup.sql")

Write-Host "Khoi tao database..." -ForegroundColor Cyan

foreach ($File in $Files) {
    Write-Host "Chay $File..." -ForegroundColor Yellow
    sqlcmd -S $Server -d $Database -E -i $File
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Hoan thanh $File" -ForegroundColor Green
    } else {
        Write-Host "Loi $File" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Hoan tat!" -ForegroundColor Green
