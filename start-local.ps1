# Запуск всех микросервисов с профилем local
# Использование: ./start-local.ps1
# Остановка: закрой открытые окна или ./stop-local.ps1

$root = $PSScriptRoot
$hubDir = Join-Path $root "KFU_hub"

$services = @(
    @{ name = "kfu-hub-gateway";       port = 8080 },
    @{ name = "kfu-hub-auth";          port = 8081 },
    @{ name = "kfu-hub-dataset";       port = 8082 },
    @{ name = "kfu-hub-ai-gateway";    port = 8083 },
    @{ name = "kfu-hub-integration";   port = 8084 },
    @{ name = "kfu-hub-projects";      port = 8085 },
    @{ name = "kfu-hub-notifications"; port = 8086 },
    @{ name = "kfu-hub-audit";         port = 8087 }
)

Write-Host ""
Write-Host "=== KFU Hub Med — запуск сервисов (профиль: local) ===" -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $services) {
    $jar = Join-Path $hubDir "$($svc.name)\target\$($svc.name)-0.1.0-SNAPSHOT.jar"

    if (-not (Test-Path $jar)) {
        Write-Host "  [ПРОПУСК] $($svc.name) — jar не найден. Запусти: mvn clean install -DskipTests" -ForegroundColor Yellow
        continue
    }

    $title  = "$($svc.name) [:$($svc.port)]"
    $cmd    = "java -jar `"$jar`" --spring.profiles.active=local"

    Start-Process powershell -ArgumentList `
        "-NoExit", `
        "-Command", `
        "`$host.UI.RawUI.WindowTitle = '$title'; Write-Host 'Запуск $title...' -ForegroundColor Green; $cmd"

    Write-Host "  [OK] Запущен $($svc.name) -> http://localhost:$($svc.port)/actuator/health" -ForegroundColor Green
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Все сервисы запускаются. Проверь health:" -ForegroundColor Cyan
foreach ($svc in $services) {
    Write-Host "  http://localhost:$($svc.port)/actuator/health"
}
Write-Host ""
Write-Host "Фронтенд: cd KFU_Hub_frontend && npm run dev" -ForegroundColor Cyan
