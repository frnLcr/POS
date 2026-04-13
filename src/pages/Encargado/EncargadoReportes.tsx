import React, { useState } from 'react';
import { mockProductos } from '../../data/mockData';
import { formatearMoneda } from '../../utils/calculosVenta';

const EncargadoReportes: React.FC = () => {
  const [filtroMes, setFiltroMes] = useState('2025-04');

  // Datos simulados de ventas
  const ventasSimuladas = [
    { id: 1, productoId: 1, cantidad: 5, fecha: '2025-04-01' },
    { id: 2, productoId: 4, cantidad: 12, fecha: '2025-04-02' },
    { id: 3, productoId: 1, cantidad: 2, fecha: '2025-04-05' },
    { id: 4, productoId: 5, cantidad: 8, fecha: '2025-04-08' },
    { id: 5, productoId: 4, cantidad: 15, fecha: '2025-04-10' }
  ];

  const mediospagosimulados = [
    { metodo: 'Efectivo', cantidad: 15, porcentaje: 45 },
    { metodo: 'Tarjeta de Débito', cantidad: 12, porcentaje: 35 },
    { metodo: 'Transferencia', cantidad: 7, porcentaje: 20 }
  ];

  // Productos más vendidos
  const productosMasVendidos = ventasSimuladas.reduce((acc, venta) => {
    const producto = mockProductos.find((p) => p.id === venta.productoId);
    if (!producto) return acc;

    const existente = acc.find((p) => p.id === producto.id);
    if (existente) {
      existente.cantidadVendida += venta.cantidad;
      existente.ingresoTotal += venta.cantidad * producto.precio;
    } else {
      acc.push({
        id: producto.id,
        nombre: producto.nombre,
        cantidadVendida: venta.cantidad,
        ingresoTotal: venta.cantidad * producto.precio
      });
    }
    return acc;
  }, [] as any[]);

  const productosMasVendidosOrdenados = productosMasVendidos.sort(
    (a, b) => b.cantidadVendida - a.cantidadVendida
  );

  const totalVentasVolumen = ventasSimuladas.reduce((sum, v) => sum + v.cantidad, 0);
  const totalVentasIngresos = productosMasVendidos.reduce(
    (sum, p) => sum + p.ingresoTotal,
    0
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📈 Reportes de Sucursal</h1>

      {/* Selector de período */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Período
        </label>
        <input
          type="month"
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">📊 Volumen de Ventas</p>
          <p className="text-3xl font-bold text-blue-600">{totalVentasVolumen}</p>
          <p className="text-gray-600 text-xs mt-2">unidades vendidas</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">💰 Ingresos Totales</p>
          <p className="text-3xl font-bold text-green-600">
            {formatearMoneda(totalVentasIngresos)}
          </p>
          <p className="text-gray-600 text-xs mt-2">en el período</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">📈 Ticket Promedio</p>
          <p className="text-3xl font-bold text-purple-600">
            {formatearMoneda(totalVentasIngresos / Math.max(ventasSimuladas.length, 1))}
          </p>
          <p className="text-gray-600 text-xs mt-2">por transaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productos Más Vendidos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Productos Más Vendidos</h2>
          {productosMasVendidosOrdenados.length === 0 ? (
            <p className="text-gray-500">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {productosMasVendidosOrdenados.slice(0, 5).map((prod, idx) => (
                <div key={prod.id} className="flex items-center justify-between pb-3 border-b">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {idx + 1}. {prod.nombre}
                    </p>
                    <p className="text-xs text-gray-600">
                      {prod.cantidadVendida} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatearMoneda(prod.ingresoTotal)}
                    </p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (prod.cantidadVendida / productosMasVendidosOrdenados[0].cantidadVendida) * 100
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medios de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💳 Métodos de Pago</h2>
          <div className="space-y-4">
            {mediospagosimulados.map((metodo) => (
              <div key={metodo.metodo}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">{metodo.metodo}</span>
                  <span className="text-sm font-bold text-gray-800">
                    {metodo.cantidad} ({metodo.porcentaje}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${metodo.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncargadoReportes;
