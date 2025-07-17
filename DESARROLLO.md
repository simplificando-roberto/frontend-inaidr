# 🚀 Guía de Desarrollo con Hot Reload

## ⚡ Inicio Rápido

### Opción 1: Comando directo
```bash
npm run dev
```

### Opción 2: Script de Windows (recomendado)
```batch
# Para Command Prompt
dev.bat

# Para PowerShell
.\dev.ps1
```

### Opción 3: Con Turbopack (experimental)
```bash
npm run dev:turbo
```

> **Nota**: Turbopack puede tener problemas de compatibilidad con algunas configuraciones. Si experimentas problemas, usa `npm run dev` (modo normal).

## 🔄 Hot Reload Configurado

La aplicación ahora incluye:

### ✅ **Características del Hot Reload**
- **Recarga automática** cuando modificas archivos
- **Turbo Mode** activado por defecto para mayor velocidad
- **Polling optimizado** para detectar cambios más rápido
- **SWC compiler** para compilación ultra-rápida

### 📁 **Archivos que disparan recarga automática**
- `src/**/*.tsx` - Componentes React
- `src/**/*.ts` - Archivos TypeScript
- `src/**/*.js` - Archivos JavaScript
- `src/**/*.css` - Archivos CSS
- `src/**/*.json` - Archivos de configuración

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo normal (recomendado) |
| `npm run dev:turbo` | Desarrollo con Turbopack (experimental) |
| `npm run dev:normal` | Desarrollo sin Turbo |
| `npm run dev:fast` | Desarrollo con Turbopack en puerto 3000 |
| `npm run build` | Compilar para producción |
| `npm run start` | Iniciar versión de producción |

## 🔧 Configuración Aplicada

### Next.js Config
- **Turbo Mode**: Compilación ultra-rápida
- **Watch Options**: Polling cada 1000ms
- **SWC Minify**: Optimización automática

### Webpack Config
- **Hot Reload**: Activado automáticamente
- **Polling**: 1000ms para detectar cambios
- **Aggregate Timeout**: 300ms para batch de cambios

## 📍 Acceder a la Aplicación

Una vez iniciado el servidor:
- **URL**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboards
- **Outbound**: http://localhost:3000/dashboard/outbound

## 🐛 Solución de Problemas

### Si el hot reload no funciona:
1. Detén el servidor (`Ctrl+C`)
2. Ejecuta: `npm run dev:normal`
3. Si persiste, borra `node_modules` y ejecuta `npm install`

### Si Turbopack da problemas:
1. Usa el modo normal: `npm run dev`
2. Turbopack es experimental y puede tener incompatibilidades
3. El hot reload funciona perfectamente sin Turbopack

### Si hay problemas de puerto:
```bash
# Cambiar puerto
npm run dev -- --port 3001
```

### Si hay problemas de cache:
```bash
# Limpiar cache de Next.js
npx next clean
npm run dev
```

## 💡 Consejos para Desarrollo

1. **Guarda archivos frecuentemente** - Los cambios se aplican al guardar
2. **Mantén la consola abierta** - Verás errores en tiempo real
3. **Usa el navegador** - Los errores también aparecen en pantalla
4. **Habilita sourcemaps** - Para debugging fácil

## 🎯 Flujo de Desarrollo Recomendado

1. Inicia el servidor: `npm run dev`
2. Abre http://localhost:3000
3. Modifica archivos en `src/`
4. **¡Los cambios aparecen automáticamente!**
5. Revisa la consola para errores
6. Continúa desarrollando sin reiniciar

---

¡El hot reload está **100% funcional**! 🎉 