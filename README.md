# N&N Sistema Punto de Venta

Sistema web completo de punto de venta para **Grupo N&N**, desarrollado con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Autenticación por Roles**: Admin, Encargado, Vendedor/Cajero
- **Gestión Administrativa**: Organizaciones, Sucursales, Usuarios, Roles, Productos
- **Módulo de Ventas Avanzado**:
  - Cálculo automático de IVA dual (21% y 10.5% para informáticos)
  - Combos/promociones con prorrateo correcto
  - Descuentos inteligentes
  - Factura A y B según posición fiscal
- **Gestión de Stock**: Entrada, salida, ajuste y histórico
- **Sistema de Créditos**: Solicitud, validación y seguimiento
- **Reportes**: Productos más vendidos, métodos de pago
- **Bonificaciones**: Cálculo automático de bonos

## 🚀 Inicio Rápido

```bash
cd nn-punto-venta
npm install
npm start
```

El sitio se abrirá en http://localhost:3000

## 🌐 Despliegue en Vercel

Este proyecto ya incluye la configuración mínima para desplegar como SPA en Vercel.

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Deja la configuración por defecto:
  - Framework: Create React App
  - Build command: `npm run build`
  - Output directory: `build`

Si navegas directamente a una ruta interna, Vercel redirige a `index.html` gracias a [vercel.json](vercel.json).

## 👥 Usuarios de Demo

| Rol | Email | Contraseña | Nombre |
|-----|-------|-----------|--------|
| Admin | admin@nn.com | admin123 | Juan Admin |
| Encargado | encargado@nn.com | encargado123 | Carlos Encargado |
| Vendedor | vendedor@nn.com | vendedor123 | María Vendedor |
| Vendedor | vendedor2@nn.com | vendedor123 | Pedro Vendedor |

Simplemente haz clic en el botón del usuario en la pantalla de login.

## 📂 Estructura

```
src/
├── components/       # CRUDTable, FormModal, Navbar, Sidebar
├── context/         # AuthContext
├── data/            # mockData.ts
├── pages/           # Admin, Encargado, Vendedor
├── types/           # Tipos TypeScript
├── utils/           # Cálculos de IVA
├── App.tsx          # Rutas
└── index.tsx        # Entry point
```

## 🎯 Módulos

### Admin
- Organizaciones, Sucursales, Usuarios
- Roles con permisos granulares
- Rubros y Servicios
- Productos y Combos
- Líneas de Crédito

### Encargado
- Gestión de Stock
- Histórico de movimientos
- Lista de Vendedores
- Reportes de sucursal

### Vendedor
- Nueva Venta (IVA dual, combos, descuentos)
- Mis Ventas
- Solicitar Crédito
- Mis Créditos

## 💡 Técnico

- React 18 + TypeScript
- Tailwind CSS
- React Router v6
- Context API
- Datos hardcodeados para demo

## 🎓 Propósito

Presentación académica de Ingeniería de Software demostrando:
- Arquitectura escalable
- Type safety
- Gestión de roles
- Cálculos financieros
- Componentes reutilizables

---

**Nota**: Sistema con datos simulados para presentación.
