# Restart Backend Server
Write-Host "Restarting backend server..." -ForegroundColor Cyan

# Kill existing processes on port 5000
Write-Host "Killing existing processes on port 5000..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "  Killed PID: $($_.OwningProcess)"
}

Start-Sleep -Seconds 2

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Green
Set-Location -Path (Join-Path $PSScriptRoot "backend")
node src/server.js
