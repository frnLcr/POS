import { Role, Usuario, Organizacion, Sucursal, Producto, Categoria, Cliente, Credito } from '../types/index';

// Roles
export const mockRoles: Role[] = [
  {
    id: 1,
    nombre: 'Admin',
    descripcion: 'Administrador del sistema',
    permisos: ['ver_usuarios', 'crear_usuario', 'editar_usuario', 'borrar_usuario', 'ver_roles', 'crear_rol', 'editar_rol', 'borrar_rol', 'ver_organizaciones', 'crear_organizacion', 'editar_organizacion', 'borrar_organizacion', 'ver_sucursales', 'crear_sucursal', 'editar_sucursal', 'borrar_sucursal', 'ver_productos', 'crear_producto', 'editar_producto', 'borrar_producto', 'ver_rubros_servicios', 'editar_rubros_servicios']
  },
  {
    id: 2,
    nombre: 'Encargado',
    descripcion: 'Encargado de sucursal',
    permisos: ['ver_stock', 'editar_stock', 'ver_vendedores', 'ver_reportes']
  },
  {
    id: 3,
    nombre: 'Cajero',
    descripcion: 'Cajero de punto de venta',
    permisos: ['crear_venta', 'ver_mis_ventas', 'consultar_productos']
  },
  {
    id: 4,
    nombre: 'Vendedor',
    descripcion: 'Vendedor de créditos y seguimiento comercial',
    permisos: ['solicitar_credito', 'ver_mis_creditos', 'ver_mis_ventas']
  }
];

// Usuarios
export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Admin',
    email: 'admin@nn.com',
    password: 'admin123',
    roleId: 1,
    organizacionId: 1,
    sucursalId: 1,
    fechaCreacion: '2025-01-01',
    cuil: '20-12345678-9',
    telefono: '3794123456',
    posicionFiscal: 'inscripto'
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellido: 'Encargado',
    email: 'encargado@nn.com',
    password: 'encargado123',
    roleId: 2,
    sucursalId: 1,
    organizacionId: 1,
    fechaCreacion: '2025-01-05',
    cuil: '20-87654321-0',
    telefono: '3794654321',
    posicionFiscal: 'inscripto'
  },
  {
    id: 3,
    nombre: 'Sofía',
    apellido: 'Cajero',
    email: 'cajero@nn.com',
    password: 'cajero123',
    roleId: 3,
    sucursalId: 1,
    organizacionId: 1,
    fechaCreacion: '2025-01-09',
    cuil: '27-10101010-1',
    telefono: '3794000001',
    posicionFiscal: 'monotributista'
  },
  {
    id: 4,
    nombre: 'María',
    apellido: 'Vendedor',
    email: 'vendedor@nn.com',
    password: 'vendedor123',
    roleId: 4,
    sucursalId: 1,
    organizacionId: 1,
    fechaCreacion: '2025-01-10',
    cuil: '27-11223344-5',
    telefono: '3794567890',
    posicionFiscal: 'monotributista'
  },
  {
    id: 5,
    nombre: 'Pedro',
    apellido: 'Vendedor',
    email: 'vendedor2@nn.com',
    password: 'vendedor123',
    roleId: 4,
    sucursalId: 2,
    organizacionId: 1,
    fechaCreacion: '2025-01-15',
    cuil: '27-22334455-6',
    telefono: '3794789012',
    posicionFiscal: 'monotributista'
  }
];

// Organizaciones
export const mockOrganizaciones: Organizacion[] = [
  {
    id: 1,
    cuit: '20-12345678-9',
    codigo: 'NN001',
    nombre: 'N&N Principal',
    logo: 'https://via.placeholder.com/150',
    servicios: ['punto_de_venta', 'creditos_sola_firma'],
    rubros: ['electrodomésticos', 'tecnología', 'herramientas', 'neumáticos', 'iluminación']
  },
  {
    id: 2,
    cuit: '20-98765432-1',
    codigo: 'NN002',
    nombre: 'N&N Sucursal NEA',
    logo: 'https://via.placeholder.com/150',
    servicios: ['punto_de_venta'],
    rubros: ['jardín', 'telefonía']
  }
];

// Sucursales
export const mockSucursales: Sucursal[] = [
  {
    id: 1,
    organizacionId: 1,
    nombre: 'Sucursal Centro',
    codigo: 'SC001',
    direccion: {
      calle: 'Av. Libertad',
      numero: '1234',
      barrio: 'Centro',
      localidad: 'Corrientes',
      provincia: 'Corrientes'
    },
    encargadoId: 2
  },
  {
    id: 2,
    organizacionId: 1,
    nombre: 'Sucursal Zona Norte',
    codigo: 'SN001',
    direccion: {
      calle: 'Ruta 12',
      numero: '5678',
      barrio: 'San Benito',
      localidad: 'Corrientes',
      provincia: 'Corrientes'
    },
    encargadoId: 2
  },
  {
    id: 3,
    organizacionId: 2,
    nombre: 'Sucursal Misiones',
    codigo: 'SM001',
    direccion: {
      calle: 'Av. Gobernador Roque Sáenz Peña',
      numero: '999',
      barrio: 'Centro',
      localidad: 'Oberá',
      provincia: 'Misiones'
    },
    encargadoId: 2
  }
];

// Categorías
export const mockCategorias: Categoria[] = [
  {
    id: 1,
    codigo: 'ELEC',
    nombre: 'Electrodomésticos',
    descripcion: 'Electrodomésticos para el hogar'
  },
  {
    id: 2,
    codigo: 'INFO',
    nombre: 'Informática',
    descripcion: 'Productos informáticos con IVA reducido'
  },
  {
    id: 3,
    codigo: 'HERR',
    nombre: 'Herramientas',
    descripcion: 'Herramientas y útiles'
  },
  {
    id: 4,
    codigo: 'ILUM',
    nombre: 'Iluminación',
    descripcion: 'Productos de iluminación'
  },
  {
    id: 5,
    codigo: 'JARD',
    nombre: 'Jardín',
    descripcion: 'Artículos para el jardín'
  }
];

// Productos
export const mockProductos: Producto[] = [
  {
    id: 1,
    nombre: 'Notebook Dell',
    codigo: 'NOTEB001',
    codigoBarra: '7790000000011',
    marca: 'Dell',
    modelo: 'Inspiron 15',
    proveedor: 'Tech Distribuidora',
    unidadMedida: 'Unidad',
    precio: 65000,
    iva: 10.5,
    stock: 12,
    categoriaId: 2,
    descuento: 15
  },
  {
    id: 2,
    nombre: 'Tablet Samsung',
    codigo: 'TAB001',
    codigoBarra: '7790000000012',
    marca: 'Samsung',
    modelo: 'Galaxy Tab',
    proveedor: 'Tech Distribuidora',
    unidadMedida: 'Unidad',
    precio: 35000,
    iva: 10.5,
    stock: 8,
    categoriaId: 2,
    descuento: 10
  },
  {
    id: 3,
    nombre: 'Funda Protectora',
    codigo: 'FUND001',
    codigoBarra: '7790000000013',
    marca: 'Genérica',
    modelo: 'Universal',
    proveedor: 'Distribuidor Local',
    unidadMedida: 'Unidad',
    precio: 1500,
    iva: 21,
    stock: 50,
    categoriaId: 2
  },
  {
    id: 4,
    nombre: 'Lámpara LED',
    codigo: 'LAMP001',
    codigoBarra: '7790000000014',
    marca: 'Philips',
    modelo: 'LED 60W',
    proveedor: 'Iluminación Plus',
    unidadMedida: 'Unidad',
    precio: 800,
    iva: 21,
    stock: 30,
    categoriaId: 4
  },
  {
    id: 5,
    nombre: 'Martillo Profesional',
    codigo: 'MART001',
    codigoBarra: '7790000000015',
    marca: 'Stanley',
    modelo: 'Pro',
    proveedor: 'Herrajes Distribuidor',
    unidadMedida: 'Unidad',
    precio: 450,
    iva: 21,
    stock: 25,
    categoriaId: 3
  },
  {
    id: 6,
    nombre: 'Discos Duros Externos 1TB',
    codigo: 'DISCO001',
    codigoBarra: '7790000000016',
    marca: 'Seagate',
    modelo: 'Backup Plus',
    proveedor: 'Tech Distribuidora',
    unidadMedida: 'Unidad',
    precio: 5500,
    iva: 10.5,
    stock: 15,
    categoriaId: 2
  },
  {
    id: 7,
    nombre: 'Refrigerador Inverter',
    codigo: 'REFR001',
    codigoBarra: '7790000000017',
    marca: 'LG',
    modelo: 'Side by Side',
    proveedor: 'Electrodomésticos SA',
    unidadMedida: 'Unidad',
    precio: 45000,
    iva: 21,
    stock: 5,
    categoriaId: 1
  },
  {
    id: 8,
    nombre: 'Combo: Notebook + Funda + Mouse',
    codigo: 'COMBO001',
    codigoBarra: '7790000000018',
    marca: 'Combo',
    modelo: 'Pack Oferta',
    proveedor: 'N&N',
    unidadMedida: 'Unidad',
    precio: 70000,
    iva: 10.5,
    stock: 5,
    categoriaId: 2,
    esCombo: true,
    productosCombo: [1, 3, 9]
  },
  {
    id: 9,
    nombre: 'Mouse Inalámbrico',
    codigo: 'MOUSE001',
    codigoBarra: '7790000000019',
    marca: 'Logitech',
    modelo: 'M170',
    proveedor: 'Tech Distribuidora',
    unidadMedida: 'Unidad',
    precio: 1200,
    iva: 21,
    stock: 40,
    categoriaId: 2
  }
];

// Clientes
export const mockClientes: Cliente[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'García',
    dni: '12345678',
    cuit: '20-12345678-9',
    email: 'juan@example.com',
    telefono: '3794123456',
    posicionFiscal: 'responsable_inscripto',
    domicilio: 'Calle Falsa 123, Corrientes'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'López',
    dni: '87654321',
    email: 'maria@example.com',
    telefono: '3794654321',
    posicionFiscal: 'monotributista',
    domicilio: 'Av. Principal 456, Corrientes'
  },
  {
    id: 3,
    nombre: 'Pedro',
    apellido: 'Rodríguez',
    dni: '11223344',
    email: 'pedro@example.com',
    posicionFiscal: 'consumidor_final',
    domicilio: 'San Juan 789, Corrientes'
  }
];

// Créditos disponibles
export const mockCreditos: Credito[] = [
  {
    id: 1,
    codigo: 'CRED001',
    nombre: 'Crédito Personal Básico',
    organizacionId: 1,
    fechaDesde: '2025-01-01',
    fechaHasta: '2025-12-31',
    edadMinima: 21,
    edadMaxima: 75,
    tasaInteres: 15.5
  },
  {
    id: 2,
    codigo: 'CRED002',
    nombre: 'Crédito Preferencial',
    organizacionId: 1,
    fechaDesde: '2025-01-01',
    fechaHasta: '2025-12-31',
    edadMinima: 25,
    edadMaxima: 65,
    tasaInteres: 12.0
  }
];
