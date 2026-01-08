# ===================================================================
# KHỞI ĐỘNG TOÀN BỘ PROJECT - SIÊU THỊ ABC
# ===================================================================
# Script tự động mở 2 terminal windows và khởi động backend + frontend
# ===================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 KHỞI ĐỘNG SIÊU THỊ ABC" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$projectRoot = "c:\tailieuhoc\Kho dữ liệu và khai phá\SIEUTHIABC"

# Kiểm tra thư mục tồn tại
if (-not (Test-Path $projectRoot)) {
    Write-Host "❌ Không tìm thấy thư mục project!" -ForegroundColor Red
    exit 1
}

# Dọn dẹp port nếu đang bị chiếm
Write-Host "`n[1/3] Dọn dẹp ports..." -ForegroundColor Yellow

# Kill port 5000
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    foreach ($conn in $port5000) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  ✅ Đã dừng process trên port 5000" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Kill port 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    foreach ($conn in $port3000) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  ✅ Đã dừng process trên port 3000" -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Khởi động Backend trong terminal mới
Write-Host "`n[2/3] Khởi động Backend Server..." -ForegroundColor Yellow

$backendCmd = @"
cd '$projectRoot\backend'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  🔧 BACKEND SERVER (Port 5000)' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
npm start
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Write-Host "  ✅ Đã mở terminal Backend" -ForegroundColor Green

# Đợi backend khởi động
Write-Host "  ⏳ Đợi backend khởi động (10 giây)..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Khởi động Frontend trong terminal mới
Write-Host "`n[3/3] Khởi động Frontend Dev Server..." -ForegroundColor Yellow

$frontendCmd = @"
cd '$projectRoot\Nam_frontend'
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  🎨 FRONTEND DEV SERVER (Port 3000)' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
Write-Host "  ✅ Đã mở terminal Frontend" -ForegroundColor Green

# Đợi frontend khởi động
Start-Sleep -Seconds 5

# Hoàn thành
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✅ ĐÃ KHỞI ĐỘNG THÀNH CÔNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n📊 Thông tin:" -ForegroundColor Cyan
Write-Host "  - Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White

Write-Host "`n💡 Hướng dẫn:" -ForegroundColor Yellow
Write-Host "  1. Backend đang chạy trong terminal riêng" -ForegroundColor Gray
Write-Host "  2. Frontend đang chạy trong terminal riêng" -ForegroundColor Gray
Write-Host "  3. Mở browser tại: http://localhost:3000" -ForegroundColor Gray
Write-Host "  4. Để dừng: Đóng 2 terminal windows" -ForegroundColor Gray

Write-Host "`n⏳ Đợi 5 giây để mở browser..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Mở browser
Write-Host "`n🌐 Đang mở browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "`n✅ Hoàn tất! Nhấn phím bất kỳ để đóng cửa sổ này..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
