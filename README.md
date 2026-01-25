# 🍰 Dulce Tentación - Tienda de Pasteles y Dulces Artesanales

Tienda online de pasteles y dulces artesanales desarrollada con Vue 3, TypeScript y PrimeVue. Proyecto académico que simula un comercio electrónico completo con gestión de usuarios, carrito de compras e historial de pedidos.

## 🛠️ Tecnologías Utilizadas

- **Vue.js 3** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción rápida
- **Pinia** - Gestión de estado (carrito de compras)
- **Vue Router** - Navegación entre vistas
- **PrimeVue 4** - Componentes UI
- **PrimeFlex** - Utilidades CSS
- **LocalStorage** - Almacenamiento de usuarios e historial
- **SessionStorage** - Gestión de sesión y carrito de invitados

## 📁 Estructura del Proyecto

```
Proyecto/
├── index.html
├── public/
│   └── assets/
│       └── images/          # Imágenes de productos
├── src/
│   ├── main.ts              # Punto de entrada
│   ├── App.vue              # Componente raíz
│   ├── data/
│   │   └── dataProductsShop.json  # Productos de la tienda
│   ├── stores/
│   │   └── cartStore.ts     # Store Pinia del carrito
│   ├── router/
│   │   └── mainRouter.ts    # Configuración de rutas
│   ├── views/
│   │   ├── ShopView.vue     # Vista principal de la tienda
│   │   ├── CartView.vue     # Carrito de compras
│   │   ├── LoginView.vue    # Inicio de sesión
│   │   ├── RegisterView.vue # Registro de usuarios
│   │   └── PurchasedView.vue # Historial de compras
│   ├── components/
│   │   ├── NavbarComponent.vue       # Barra de navegación
│   │   ├── HeaderComponent.vue       # Cabecera con búsqueda
│   │   ├── FooterComponent.vue       # Pie de página
│   │   └── ProductCardComponent.vue  # Tarjeta de producto
│   └── composables/
│       └── authComposable.ts # Lógica de autenticación
```

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- Node.js (versión 20.19.0 o superior, o 22.12.0+)
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar o acceder al proyecto**
   ```bash
   cd /home/jose/DEW_A3
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - La aplicación estará disponible en: `http://localhost:5173`

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm run lint` | Corrige errores de linting |
| `npm run format` | Formatea el código con Prettier |
| `npm run test:unit` | Ejecuta tests unitarios |
| `npm run test:e2e` | Ejecuta tests end-to-end |

## 📋 Funcionalidades

### 👤 Gestión de Usuarios

- **Registro**: Creación de cuenta con validación de:
  - Nombre de usuario (3-20 caracteres, letras/números)
  - Correo electrónico (formato válido, máx. 100 caracteres)
  - Contraseña (6-12 caracteres, 1 mayúscula, 1 especial)
  - Almacenamiento con hash SHA-256

- **Login**: Autenticación de usuarios registrados
- **Logout**: Cierre de sesión
- **Protección de rutas**: Compras solo visibles para usuarios autenticados

### 🛒 Carrito de Compras

- **Usuarios registrados**: Carrito almacenado en LocalStorage
- **Usuarios no registrados**: Carrito almacenado en SessionStorage
- **Añadir productos**: Contador de clics (1 clic = 1 unidad)
- **Gestión de cantidades**: Incrementar/disminuir/eliminar
- **Cálculo automático**:
  - Subtotal
  - IGIC (7%)
  - Total final

### 📦 Productos

- Catálogo de productos en JSON
- Imágenes de productos
- Stock disponible
- Búsqueda por nombre/descripción
- Cards con información completa

### 📄 Historial de Compras

- Solo disponible para usuarios autenticados
- Almacenamiento en LocalStorage por usuario
- Agrupado por fecha de compra
- Resumen de pedidos, productos y gasto total

## 🎨 Diseño

- **Temática**: Pastelería/Dulces "Dulce Tentación"
- **Colores principales**: Púrpura (#8e44ad), Rosa (#ff69b4)
- **Componentes**: PrimeVue con tema Material
- **Responsive**: Diseño adaptativo para móviles

## 🔒 Almacenamiento

### LocalStorage

| Clave | Descripción |
|-------|-------------|
| `DataUsers` | Base de datos de usuarios registrados |
| `{email}CartStore` | Carrito de usuarios autenticados |
| `{email}HistoryPurchased` | Historial de compras |

### SessionStorage

| Clave | Descripción |
|-------|-------------|
| `ShopSession` | Sesión actual del usuario |
| `GuestCartStore` | Carrito de usuarios no registrados |

## 📝 Notas de Desarrollo

- Los productos se cargan desde `src/data/dataProductsShop.json`
- Las imágenes deben ubicarse en `public/assets/images/`
- Para añadir más productos, editar el JSON con la estructura:
  ```json
  {
    "id": 9,
    "nombreProducto": "Nombre del producto",
    "rutaRelativaImagen": "/assets/images/nombre.jpg",
    "descripcionProducto": "Descripción del producto",
    "stock": 20,
    "precioUnitario": 3.50
  }
  ```

## 📄 Licencia

Este proyecto es académico y de uso educativo.

