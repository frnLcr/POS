// Tipos principales del sistema

export type RoleType = 'admin' | 'encargado' | 'vendedor' | 'cajero';

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  roleId: number;
  sucursalId?: number;
  organizacionId?: number;
  fechaCreacion: string;
  fechaBaja?: string;
  motivoBaja?: string;
  cuil: string;
  telefono: string;
  posicionFiscal: 'monotributista' | 'inscripto' | 'consumidor_final';
}

export interface Organizacion {
  id: number;
  cuit: string;
  codigo: string;
  nombre: string;
  logo: string;
  servicios: string[];
  rubros: string[];
}

export interface Sucursal {
  id: number;
  organizacionId: number;
  nombre: string;
  codigo: string;
  direccion: {
    calle: string;
    numero: string;
    barrio: string;
    localidad: string;
    provincia: string;
  };
  encargadoId: number;
}

export interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  codigoBarra?: string;
  marca: string;
  modelo: string;
  proveedor: string;
  unidadMedida: string;
  precio: number;
  iva: 10.5 | 21;
  stock: number;
  categoriaId: number;
  esCombo?: boolean;
  productosCombo?: number[];
  descuento?: number; // porcentaje 0-100
}

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  productoId?: number;
  fecha: string;
  tipo: 'oferta' | 'nuevo_producto' | 'stock' | 'general';
}

export interface NotificacionesContextType {
  notificaciones: Notificacion[];
  agregarNotificacion: (n: Omit<Notificacion, 'id' | 'fecha'>) => void;
}

export interface Categoria {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  cuitCuil: string;
  razonSocial?: string;
  email?: string;
  telefono?: string;
  posicionFiscal: 'responsable_inscripto' | 'monotributista' | 'consumidor_final';
  suscriptoNewsletter?: boolean;
}

export interface ItemVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  iva: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  numero: number;
  fecha: string;
  clienteId: number;
  vendedorId: number;
  sucursalId: number;
  items: ItemVenta[];
  tipoFactura: 'A' | 'B';
  descuento: number;
  subtotal: number;
  totalIva: number;
  totalBruto: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
}

export interface NotaCredito {
  id: number;
  ventaId: number;
  numero: number;
  fecha: string;
  motivo: string;
  items?: ItemVenta[];
  montoTotal: number;
}

export interface SolicitudCredito {
  id: number;
  clienteId: number;
  vendedorId: number;
  sucursalId: number;
  monto: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  montoAprobado?: number;
  fechaSolicitud: string;
  motivo?: string;
}

export interface Credito {
  id: number;
  codigo: string;
  nombre: string;
  organizacionId: number;
  fechaDesde: string;
  fechaHasta: string;
  edadMinima: number;
  edadMaxima: number;
  tasaInteres: number;
}

export interface Rubro {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  creditoId: number;
}

export interface MovimientoStock {
  id: number;
  productoId: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  fecha: string;
  motivo: string;
  usuarioId: number;
}

export interface AuthContextType {
  usuario: Usuario | null;
  role: RoleType | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}
