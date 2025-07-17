Write-Host "🚀 Iniciando servidor de desarrollo con hot reload..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 La aplicación se abrirá en: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔄 Hot reload activado - Los cambios se aplicarán automáticamente" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para detener el servidor, presiona Ctrl+C" -ForegroundColor Red
Write-Host ""

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor de desarrollo
Write-Host "🔧 Iniciando servidor con Turbo (hot reload optimizado)..." -ForegroundColor Magenta
npm run dev 