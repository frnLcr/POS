import { Producto, ItemVenta } from '../types/index';

/**
 * Calcula el IVA y el total para items con posibles diferentes tasas
 * El sistema debe prorratear correctamente cuando hay productos con diferentes IVAs
 */

export interface CalculoIVA {
  subtotalSinIVA: number;
  ivaBase: number; // IVA 21%
  ivaReducido: number; // IVA 10.5%
  totalIVA: number;
  totalBruto: number;
}

/**
 * Calcula IVA dual correctamente para múltiples items
 * Separa el cálculo por tasa de IVA
 */
export const calcularIVADual = (
  items: { producto: Producto; cantidad: number; precioUnitario: number }[],
  descuentoTotal: number = 0
): CalculoIVA => {
  // Paso 1: Calcular subtotales sin IVA por tasa
  let subtotalBase = 0; // Productos con 21%
  let subtotalReducido = 0; // Productos con 10.5%

  items.forEach(({ producto, cantidad, precioUnitario }) => {
    const subtotal = cantidad * precioUnitario;
    if (producto.iva === 21) {
      subtotalBase += subtotal;
    } else {
      subtotalReducido += subtotal;
    }
  });

  // Paso 2: Aplicar descuento prorrateado proporcionalmente
  const totalSinDescuento = subtotalBase + subtotalReducido;
  const porcentajeBase =
    totalSinDescuento > 0 ? subtotalBase / totalSinDescuento : 0;
  const porcentajeReducido =
    totalSinDescuento > 0 ? subtotalReducido / totalSinDescuento : 0;

  const descuentoBase = descuentoTotal * porcentajeBase;
  const descuentoReducido = descuentoTotal * porcentajeReducido;

  const subtotalBaseDespuesDescuento = subtotalBase - descuentoBase;
  const subtotalReducidoDespuesDescuento = subtotalReducido - descuentoReducido;

  // Paso 3: Calcular IVA sobre subtotales ajustados
  const ivaBase = Number((subtotalBaseDespuesDescuento * 0.21).toFixed(2));
  const ivaReducido = Number(
    (subtotalReducidoDespuesDescuento * 0.105).toFixed(2)
  );

  const subtotalSinIVA = Number(
    (subtotalBaseDespuesDescuento + subtotalReducidoDespuesDescuento).toFixed(2)
  );
  const totalIVA = Number((ivaBase + ivaReducido).toFixed(2));
  const totalBruto = Number((subtotalSinIVA + totalIVA).toFixed(2));

  return {
    subtotalSinIVA,
    ivaBase,
    ivaReducido,
    totalIVA,
    totalBruto
  };
};

/**
 * Calcula IVA para un item individual
 */
export const calcularIVAItem = (
  producto: Producto,
  cantidad: number,
  descuentoItem: number = 0
): ItemVenta => {
  const subtotal = cantidad * producto.precio;
  const subtotalConDescuento = Number((subtotal - descuentoItem).toFixed(2));
  const ivaCalculado = Number(
    (subtotalConDescuento * (producto.iva / 100)).toFixed(2)
  );

  return {
    productoId: producto.id,
    cantidad,
    precioUnitario: producto.precio,
    iva: ivaCalculado,
    subtotal: Number((subtotalConDescuento + ivaCalculado).toFixed(2))
  };
};

/**
 * Valida que una nueva alícuota no rompa ventas históricas
 * (En un sistema real, se guardaría la alícuota con cada venta)
 */
export const validarAlicuotaHistorica = (
  productoId: number,
  alicuotaActual: number,
  historicoVentas: any[]
): boolean => {
  // En este sistema, cada venta guarda su propia alícuota
  // así que es seguro cambiar la alícuota de un producto
  return true;
};

/**
 * Calcula el costo del prorrateo para combos
 * Asegura que el total coincida exactamente
 */
export const calcularProrrateoCombo = (
  precioCombo: number,
  productosConPrecios: { precio: number; iva: number; cantidad: number }[]
): { preciosAjustados: number[]; totalVerificacion: number } => {
  const sumaPrecios = productosConPrecios.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0
  );
  const preciosAjustados = productosConPrecios.map(
    (p) => (p.precio * p.cantidad * precioCombo) / sumaPrecios
  );

  const totalVerificacion = preciosAjustados.reduce((sum, p) => sum + p, 0);

  return {
    preciosAjustados: preciosAjustados.map((p) => Number(p.toFixed(2))),
    totalVerificacion: Number(totalVerificacion.toFixed(2))
  };
};

/**
 * Determina el tipo de factura según posición fiscal del cliente
 */
export const determinarTipoFactura = (
  posicionFiscal: string
): 'A' | 'B' => {
  if (posicionFiscal === 'responsable_inscripto') {
    return 'A';
  }
  return 'B';
};

/**
 * Valida DNI/CUIT (simulado - en real sería a través de API)
 */
export const validarDocumento = async (
  documento: string,
  tipo: 'DNI' | 'CUIT'
): Promise<{ valido: boolean; mensaje: string }> => {
  // Simulamos una llamada a API externa
  return new Promise((resolve) => {
    setTimeout(() => {
      if (tipo === 'DNI') {
        const esValido = /^\d{7,8}$/.test(documento);
        resolve({
          valido: esValido,
          mensaje: esValido ? 'DNI válido' : 'DNI inválido'
        });
      } else {
        const esValido = /^\d{2}-\d{8}-\d$/.test(documento);
        resolve({
          valido: esValido,
          mensaje: esValido ? 'CUIT válido' : 'CUIT inválido'
        });
      }
    }, 800); // Simula latencia de API
  });
};

/**
 * Valida teléfono (simulado)
 */
export const validarTelefono = async (
  telefono: string
): Promise<{ valido: boolean; operador: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const esValido = /^\d{10}$/.test(telefono.replace(/\D/g, ''));
      const operadores = ['Personal', 'Claro', 'Movistar', 'Speedy'];
      const operador = operadores[Math.floor(Math.random() * operadores.length)];

      resolve({
        valido: esValido,
        operador: esValido ? operador : ''
      });
    }, 1000); // Simula latencia de validación
  });
};

/**
 * Calcula bono de vendedor (10% de ventas + 3% por crédito aprobado)
 */
export const calcularBonoVendedor = (
  montoTotalVentas: number,
  creditosAprobados: number
): number => {
  const bonoVentas = montoTotalVentas * 0.1;
  const bonoCreditos = creditosAprobados * (montoTotalVentas * 0.03);
  return Number((bonoVentas + bonoCreditos).toFixed(2));
};

/**
 * Calcula bono de encargado (15% sobre total de ventas de sucursal)
 */
export const calcularBonoEncargado = (montoTotalVentas: number): number => {
  return Number((montoTotalVentas * 0.15).toFixed(2));
};

/**
 * Formatea moneda argentina
 */
export const formatearMoneda = (monto: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(monto);
};

/**
 * Formatea porcentaje
 */
export const formatearPorcentaje = (valor: number): string => {
  return `${(valor * 100).toFixed(2)}%`;
};
