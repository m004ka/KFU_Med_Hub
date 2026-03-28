# Остановка всех java-процессов на портах 8080-8087
Write-Host "Останавливаем сервисы на портах 8080-8087..." -ForegroundColor Yellow

8080..8087 | ForEach-Object {
    $port = $_
    $result = netstat -ano | Select-String ":$port\s" | Where-Object { $_ -match "LISTENING" }
    if ($result) {
        $pid = ($result -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  Остановлен процесс на порту $port (PID $pid)" -ForegroundColor Green
        }
    }
}

Write-Host "Готово." -ForegroundColor Cyan
