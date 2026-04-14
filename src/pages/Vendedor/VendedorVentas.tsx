import React, { useEffect, useState } from 'react';
import { Cliente, Venta } from '../../types/index';
import { mockProductos, mockClientes, mockUsuarios } from '../../data/mockData';
import {
  calcularIVADual,
  formatearMoneda,
  determinarTipoFactura
} from '../../utils/calculosVenta';

const vendedores = mockUsuarios.filter((u) => u.roleId === 4);

const emptyAltaForm: Omit<Cliente, 'id'> = {
  nombre: '',
  apellido: '',
  cuitCuil: '',
  razonSocial: '',
  email: '',
  telefono: '',
  posicionFiscal: 'consumidor_final',
  suscriptoNewsletter: false
};

interface CarritoItem {
  producto: typeof mockProductos[0];
  cantidad: number;
  descuento: number; // por item
}

const VendedorVentas: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [documentoBusqueda, setDocumentoBusqueda] = useState('');
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [codigoBarraInput, setCodigoBarraInput] = useState('');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [procesandoVenta, setProcesandoVenta] = useState(false);
  const [segundosProcesando, setSegundosProcesando] = useState(0);
  const [ventaPendiente, setVentaPendiente] = useState<Venta | null>(null);
  const [cargandoValidacion, setCargandoValidacion] = useState(false);
  const [ventaCompletada, setVentaCompletada] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState(0);
  const [mostrarConfirmAlta, setMostrarConfirmAlta] = useState(false);
  const [mostrarFormAlta, setMostrarFormAlta] = useState(false);
  const [altaForm, setAltaForm] = useState<Omit<Cliente, 'id'>>(emptyAltaForm);
  const [vendedorId, setVendedorId] = useState<number | null>(null);

  useEffect(() => {
    if (!procesandoVenta || segundosProcesando <= 0) return;

    const timer = setTimeout(() => {
      setSegundosProcesando((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [procesandoVenta, segundosProcesando]);

  useEffect(() => {
    if (!procesandoVenta || segundosProcesando !== 0 || !ventaPendiente) return;

    setProcesandoVenta(false);
    setNumeroFactura(ventaPendiente.numero);
    setVentaCompletada(true);

    setTimeout(() => {
      setCarrito([]);
      setClienteEncontrado(null);
      setDocumentoBusqueda('');
      setDescuentoGeneral(0);
      setVentaCompletada(false);
      setVentaPendiente(null);
      setVendedorId(null);
    }, 3000);
  }, [procesandoVenta, segundosProcesando, ventaPendiente]);

  const buscarCliente = async () => {
    if (!documentoBusqueda.trim()) return;
    setCargandoValidacion(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cliente = clientes.find((c) => c.cuitCuil === documentoBusqueda.trim());

    if (cliente) {
      setClienteEncontrado(cliente);
    } else {
      setAltaForm({ ...emptyAltaForm, cuitCuil: documentoBusqueda.trim() });
      setMostrarConfirmAlta(true);
    }
    setCargandoValidacion(false);
  };

  const handleAltaCliente = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoCliente: Cliente = {
      ...altaForm,
      id: Math.max(...clientes.map((c) => c.id), 0) + 1,
      razonSocial: altaForm.posicionFiscal === 'consumidor_final' ? undefined : altaForm.razonSocial
    };
    setClientes([...clientes, nuevoCliente]);
    setClienteEncontrado(nuevoCliente);
    setMostrarFormAlta(false);
  };

  const precioConDescuento = (producto: typeof mockProductos[0]) => {
    if (!producto.descuento) return producto.precio;
    return producto.precio * (1 - producto.descuento / 100);
  };

  const agregarAlCarrito = (producto: typeof mockProductos[0]) => {
    const existente = carrito.find((item) => item.producto.id === producto.id);
    const descuentoProducto = producto.descuento
      ? producto.precio * (producto.descuento / 100)
      : 0;
    if (existente) {
      setCarrito(
        carrito.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { producto, cantidad: 1, descuento: descuentoProducto }]);
    }
  };

  const eliminarDelCarrito = (productoId: number) => {
    setCarrito(carrito.filter((item) => item.producto.id !== productoId));
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      setCarrito(
        carrito.map((item) =>
          item.producto.id === productoId
            ? { ...item, cantidad }
            : item
        )
      );
    }
  };

  const buscarPorCodigo = () => {
    const codigoNormalizado = codigoBarraInput.trim().toLowerCase();
    if (!codigoNormalizado) return;

    const producto = mockProductos.find(
      (p) =>
        p.codigo.toLowerCase() === codigoNormalizado ||
        p.codigoBarra === codigoNormalizado
    );

    if (!producto) {
      alert('No se encontró producto con ese código');
      return;
    }

    if (!clienteEncontrado) {
      alert('Primero debes seleccionar cliente para agregar al carrito');
      return;
    }

    agregarAlCarrito(producto);
    setCodigoBarraInput('');
  };

  const calcularTotales = () => {
    const items = carrito.map((item) => ({
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio
    }));

    const descuentoTotal =
      (carrito.reduce((sum, item) => sum + item.descuento * item.cantidad, 0)) +
      descuentoGeneral;

    return calcularIVADual(items, descuentoTotal);
  };

  const finalizarVenta = async () => {
    if (!clienteEncontrado || carrito.length === 0) {
      alert('Selecciona cliente y productos');
      return;
    }

    if (!vendedorId) {
      alert('Debes indicar el vendedor que realizó la venta');
      return;
    }

    if (procesandoVenta) {
      alert('Espera que termine el proceso de la venta');
      return;
    }

    const tipoFactura = determinarTipoFactura(clienteEncontrado.posicionFiscal);
    const totales = calcularTotales();

    const nuevaVenta: Venta = {
      id: Math.random(),
      numero: Math.floor(Math.random() * 99999),
      fecha: new Date().toISOString().split('T')[0],
      clienteId: clienteEncontrado.id,
      vendedorId: vendedorId,
      sucursalId: 1, // Sucursal actual simulada
      items: carrito.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
        iva: item.producto.iva,
        subtotal: item.cantidad * item.producto.precio
      })),
      tipoFactura,
      descuento: descuentoGeneral,
      subtotal: totales.subtotalSinIVA,
      totalIva: totales.totalIVA,
      totalBruto: totales.totalBruto,
      metodoPago
    };

    setVentaPendiente(nuevaVenta);
    setProcesandoVenta(true);
    setSegundosProcesando(5);
  };

  const totales = calcularTotales();
  const tipoFactura = clienteEncontrado
    ? determinarTipoFactura(clienteEncontrado.posicionFiscal)
    : null;

  const productosFiltrados = mockProductos.filter((producto) => {
    const termino = busquedaProducto.trim().toLowerCase();
    if (!termino) return true;

    return (
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo.toLowerCase().includes(termino) ||
      producto.codigoBarra?.includes(termino) ||
      producto.marca.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Modal: cliente no encontrado → confirmar alta */}
      {mostrarConfirmAlta && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-8 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Cliente no encontrado</h2>
            <p className="text-slate-500 text-sm mb-1">
              El CUIT/CUIL <strong>{documentoBusqueda}</strong> no figura en el sistema.
            </p>
            <p className="text-slate-600 text-sm mb-6">¿Desea dar de alta un nuevo cliente?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarConfirmAlta(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setMostrarConfirmAlta(false); setMostrarFormAlta(true); }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Dar de Alta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: formulario alta de cliente */}
      {mostrarFormAlta && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Alta de Cliente</h2>
            <form onSubmit={handleAltaCliente} className="space-y-4">

              {/* CUIT/CUIL - readonly, pre-cargado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">CUIT / CUIL</label>
                <input
                  type="text"
                  value={altaForm.cuitCuil}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Posición Fiscal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Condición frente al IVA</label>
                <select
                  value={altaForm.posicionFiscal}
                  onChange={(e) => {
                    const pf = e.target.value as Cliente['posicionFiscal'];
                    setAltaForm({ ...altaForm, posicionFiscal: pf, razonSocial: pf === 'consumidor_final' ? '' : altaForm.razonSocial });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="consumidor_final">Consumidor Final</option>
                  <option value="monotributista">Monotributista</option>
                  <option value="responsable_inscripto">Responsable Inscripto</option>
                </select>
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={altaForm.nombre}
                    onChange={(e) => setAltaForm({ ...altaForm, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={altaForm.apellido}
                    onChange={(e) => setAltaForm({ ...altaForm, apellido: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                    placeholder="Apellido"
                  />
                </div>
              </div>

              {/* Razón Social — solo habilitada para no-consumidor final */}
              <div>
                <label className={`block text-sm font-semibold mb-1 ${altaForm.posicionFiscal === 'consumidor_final' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Razón Social
                  {altaForm.posicionFiscal === 'consumidor_final' && (
                    <span className="ml-2 text-xs font-normal text-gray-400">(no aplica para Consumidor Final)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={altaForm.razonSocial ?? ''}
                  onChange={(e) => setAltaForm({ ...altaForm, razonSocial: e.target.value })}
                  disabled={altaForm.posicionFiscal === 'consumidor_final'}
                  className={`w-full px-4 py-2 border rounded transition ${
                    altaForm.posicionFiscal === 'consumidor_final'
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 focus:outline-none focus:border-blue-500'
                  }`}
                  placeholder={altaForm.posicionFiscal === 'consumidor_final' ? '—' : 'Razón Social'}
                />
              </div>

              {/* Email y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={altaForm.email ?? ''}
                    onChange={(e) => setAltaForm({ ...altaForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={altaForm.telefono ?? ''}
                    onChange={(e) => setAltaForm({ ...altaForm, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Teléfono"
                  />
                </div>
              </div>

              {/* Newsletter */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={altaForm.suscriptoNewsletter ?? false}
                  onChange={(e) => setAltaForm({ ...altaForm, suscriptoNewsletter: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">Suscripto a newsletter</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarFormAlta(false)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold py-2.5 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Registrar y Continuar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {procesandoVenta && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-8 text-center">
            <div className="mx-auto mb-5 h-14 w-14 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Procesando venta</h2>
            <p className="text-slate-600 mb-4">
              {metodoPago === 'efectivo'
                ? 'Validando pago en efectivo'
                : metodoPago === 'tarjeta'
                  ? 'Autorizando pago con tarjeta'
                  : 'Confirmando transferencia'}
            </p>
            <p className="text-sm font-semibold text-blue-700">
              Espere {segundosProcesando}s
            </p>
          </div>
        </div>
      )}

      {ventaCompletada ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <p className="text-4xl mb-4">✅</p>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              ¡Venta Completada!
            </h2>
            <p className="text-gray-700 mb-4">
              N° de Factura: <strong>{numeroFactura}</strong>
            </p>
            <p className="text-gray-600">Redirigiendo...</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Izquierdo: Búsqueda de Cliente y Productos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Búsqueda de Cliente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Buscar Cliente</h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={documentoBusqueda}
                onChange={(e) => setDocumentoBusqueda(e.target.value)}
                placeholder="DNI o CUIT..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={buscarCliente}
                disabled={cargandoValidacion}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold px-6 py-2 rounded transition"
              >
                {cargandoValidacion ? '⏳' : '🔎'}
              </button>
            </div>

            {clienteEncontrado && (
              <div className="bg-green-50 border border-green-300 rounded p-4">
                <p className="font-semibold text-gray-800 mb-2">
                  {clienteEncontrado.nombre} {clienteEncontrado.apellido}
                </p>
                <p className="text-sm text-gray-700">
                  {clienteEncontrado.posicionFiscal.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Tipo de Factura: <strong>{tipoFactura}</strong>
                </p>
                <button
                  onClick={() => {
                    setClienteEncontrado(null);
                    setCarrito([]);
                  }}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Cambiar Cliente
                </button>
              </div>
            )}
          </div>

          {/* POS - Búsqueda por código de barras */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🧾 Punto de Venta</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                value={codigoBarraInput}
                onChange={(e) => setCodigoBarraInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    buscarPorCodigo();
                  }
                }}
                placeholder="Escanear o ingresar código de barras / código"
                className="md:col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={buscarPorCodigo}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded transition"
              >
                Agregar por código
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-sm text-gray-700">
              Para agregar por código necesitas cliente seleccionado. La consulta de productos funciona siempre.
            </div>
          </div>

          {/* Listado / Consulta de Productos */}
          <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Consulta de Productos (POS)</h2>

              <input
                type="text"
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
                placeholder="Buscar por nombre, marca, código o código de barras"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="border border-gray-200 rounded p-4 hover:border-blue-500 transition"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-800 text-sm flex-1">
                        {producto.nombre}
                      </p>
                      {(producto.descuento ?? 0) > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full ml-2 shrink-0">
                          {producto.descuento}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {producto.marca} {producto.modelo}
                    </p>
                    <div className="mb-2">
                      {(producto.descuento ?? 0) > 0 ? (
                        <>
                          <p className="text-xs text-gray-400 line-through">
                            {formatearMoneda(producto.precio)}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatearMoneda(precioConDescuento(producto))}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-green-600">
                          {formatearMoneda(producto.precio)}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Código: {producto.codigo} | Barra: {producto.codigoBarra || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Stock: {producto.stock} | IVA: {producto.iva}%
                    </p>
                    <button
                      type="button"
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.stock === 0 || !clienteEncontrado}
                      className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 rounded transition text-sm"
                    >
                      {producto.stock === 0
                        ? 'Sin Stock'
                        : !clienteEncontrado
                          ? 'Seleccione cliente para agregar'
                          : '🛒 Agregar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Panel Derecho: Carrito y Totales */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🛒 Carrito</h2>

            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Carrito vacío</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {carrito.map((item) => (
                    <div
                      key={item.producto.id}
                      className="border border-gray-200 rounded p-3"
                    >
                      <p className="font-semibold text-sm text-gray-800">
                        {item.producto.nombre}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {formatearMoneda(item.producto.precio)} c/u
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) =>
                            actualizarCantidad(
                              item.producto.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-12 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
                        >
                          +
                        </button>
                        <span className="text-sm font-bold text-green-600 ml-auto">
                          {formatearMoneda(item.cantidad * item.producto.precio)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => eliminarDelCarrito(item.producto.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold"
                      >
                        🗑️ Quitar
                      </button>
                    </div>
                  ))}
                </div>

                {/* Vendedor que realizó la venta */}
                <div className="mb-4 pb-4 border-b">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Vendedor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={vendedorId ?? ''}
                    onChange={(e) => setVendedorId(e.target.value ? Number(e.target.value) : null)}
                    className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-blue-500 ${
                      !vendedorId ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">— Seleccionar vendedor —</option>
                    {vendedores.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nombre} {v.apellido}
                      </option>
                    ))}
                  </select>
                  {!vendedorId && (
                    <p className="text-xs text-amber-600 mt-1">Requerido para registrar la venta</p>
                  )}
                </div>

                {/* Descuento General */}
                <div className="mb-4 pb-4 border-b">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Descuento General ($)
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    value={descuentoGeneral}
                    onChange={(e) => setDescuentoGeneral(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Método de Pago */}
                <div className="mb-4 pb-4 border-b">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value as 'efectivo' | 'tarjeta' | 'transferencia')}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="transferencia">🏦 Transferencia</option>
                  </select>

                  <div className="mt-3 text-xs rounded p-3 border border-slate-200 bg-slate-50">
                    <p className="text-slate-600">
                      Selecciona el método. La simulación de cobro aparece al finalizar la venta.
                    </p>
                  </div>
                </div>

                {/* Resumen de IVA */}
                <div className="text-xs text-gray-700 space-y-1 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatearMoneda(totales.subtotalSinIVA)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA 21%:</span>
                    <span className="font-semibold">{formatearMoneda(totales.ivaBase)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA 10.5%:</span>
                    <span className="font-semibold">{formatearMoneda(totales.ivaReducido)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Descuento:</span>
                    <span className="font-semibold">-{formatearMoneda(descuentoGeneral)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <p className="text-xs text-gray-600 mb-1">T O T A L</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatearMoneda(totales.totalBruto)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={finalizarVenta}
                  disabled={procesandoVenta}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-bold py-3 rounded transition"
                >
                  ✅ Finalizar Venta
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorVentas;
