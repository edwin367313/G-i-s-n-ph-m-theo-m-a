# Script cài đặt Docker Desktop cho Windows
# Chạy PowerShell as Administrator

Write-Host "`n=== CÀI ĐẶT DOCKER DESKTOP CHO WINDOWS ===`n" -ForegroundColor Green

# Download Docker Desktop
$dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$installerPath = "$env:TEMP\DockerDesktopInstaller.exe"

Write-Host "Đang tải Docker Desktop..." -ForegroundColor Cyan
try {
    # Download installer
    Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✓ Tải xuống thành công!`n" -ForegroundColor Green
    
    Write-Host "Đang cài đặt Docker Desktop..." -ForegroundColor Cyan
    Write-Host "Lưu ý: Quá trình cài đặt sẽ yêu cầu restart máy!`n" -ForegroundColor Yellow
    
    # Install Docker Desktop
    Start-Process -FilePath $installerPath -ArgumentList "install --quiet" -Wait
    
    Write-Host "`n✓ Cài đặt Docker Desktop hoàn tất!`n" -ForegroundColor Green
    Write-Host "📋 CÁC BƯỚC TIẾP THEO:" -ForegroundColor Yellow
    Write-Host "1. Restart máy tính" -ForegroundColor White
    Write-Host "2. Mở Docker Desktop và đợi khởi động (khoảng 1-2 phút)" -ForegroundColor White
    Write-Host "3. Chạy lại: docker compose up -d`n" -ForegroundColor White
    
    # Cleanup
    Remove-Item $installerPath -Force
    
} catch {
    Write-Host "`n❌ Lỗi khi tải/cài đặt Docker Desktop!" -ForegroundColor Red
    Write-Host "Lỗi: $_`n" -ForegroundColor Red
    
    Write-Host "📋 CÁCH CÀI ĐẶT THỦ CÔNG:" -ForegroundColor Yellow
    Write-Host "1. Truy cập: https://www.docker.com/products/docker-desktop/" -ForegroundColor White
    Write-Host "2. Tải Docker Desktop for Windows" -ForegroundColor White
    Write-Host "3. Chạy installer và làm theo hướng dẫn" -ForegroundColor White
    Write-Host "4. Restart máy tính" -ForegroundColor White
    Write-Host "5. Mở Docker Desktop và đợi khởi động`n" -ForegroundColor White
}

Write-Host "Nhấn phím bất kỳ để tiếp tục..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
