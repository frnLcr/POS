import React, { useState } from 'react';
import { formatearMoneda } from '../../utils/calculosVenta';
import { mockClientes } from '../../data/mockData';

interface VentaResumen {
  id: number;
  numero: number;
  fecha: string;
  clienteId: number;
  vendedor: string;
  tipoFactura: string;
  metodoPago: string;
  total: number;
}

const EncargadoVentas: React.FC = () => {
  const [anioSeleccionado] = useState(2025);

  // Ventas anuales simuladas de la sucursal
  const ventas: VentaResumen[] = [
    { id: 1, numero: 12340, fecha: '2025-01-15', clienteId: 1, vendedor: 'Juan Pérez', tipoFactura: 'A', metodoPago: 'tarjeta', total: 180000 },
    { id: 2, numero: 12341, fecha: '2025-01-22', clienteId: 2, vendedor: 'María García', tipoFactura: 'B', metodoPago: 'efectivo', total: 45000 },
    { id: 3, numero: 12342, fecha: '2025-02-08', clienteId: 3, vendedor: 'Juan Pérez', tipoFactura: 'A', metodoPago: 'transferencia', total: 320000 },
    { id: 4, numero: 12343, fecha: '2025-02-18', clienteId: 1, vendedor: 'María García', tipoFactura: 'B', metodoPago: 'efectivo', total: 12500 },
    { id: 5, numero: 12344, fecha: '2025-03-05', clienteId: 2, vendedor: 'Juan Pérez', tipoFactura: 'A', metodoPago: 'tarjeta', total: 95000 },
    { id: 6, numero: 12345, fecha: '2025-04-10', clienteId: 1, vendedor: 'Juan Pérez', tipoFactura: 'A', metodoPago: 'tarjeta', total: 71825 },
    { id: 7, numero: 12346, fecha: '2025-04-12', clienteId: 2, vendedor: 'María García', tipoFactura: 'B', metodoPago: 'efectivo', total: 1936 }
  ];

  const getNombreCliente = (clienteId: number) => {
    const cliente = mockClientes.find((c) => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A';
  };

  const totalAnual = ventas.reduce((sum, v) => sum + v.total, 0);
  const cantidadVentas = ventas.length;
  const ticketPromedio = cantidadVentas > 0 ? totalAnual / cantidadVentas : 0;
  const bonoEsperado = totalAnual * 0.15;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📈 Ventas {anioSeleccionado}</h1>
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
          Sucursal Central
        </span>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">📊 Total de Ventas</p>
          <p className="text-3xl font-bold text-blue-600">{cantidadVentas}</p>
          <p className="text-gray-500 text-xs mt-2">transacciones en {anioSeleccionado}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">💰 Total Facturado</p>
          <p className="text-3xl font-bold text-green-600">{formatearMoneda(totalAnual)}</p>
          <p className="text-gray-500 text-xs mt-2">ingresos brutos {anioSeleccionado}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">🧾 Ticket Promedio</p>
          <p className="text-3xl font-bold text-indigo-600">{formatearMoneda(ticketPromedio)}</p>
          <p className="text-gray-500 text-xs mt-2">por transacción</p>
        </div>
        <div className="bg-amber-50 rounded-lg shadow-md p-6 border border-amber-300">
          <p className="text-amber-700 text-sm font-semibold mb-2">🎁 Bono Esperado</p>
          <p className="text-3xl font-bold text-amber-600">{formatearMoneda(bonoEsperado)}</p>
          <p className="text-amber-500 text-xs mt-2">15% sobre {formatearMoneda(totalAnual)}</p>
        </div>
      </div>

      {/* Detalle del bono */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-amber-400">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Detalle del Bono Anual</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Total ventas {anioSeleccionado}:</span>
            <span className="text-green-700 font-bold">{formatearMoneda(totalAnual)}</span>
          </div>
          <span className="text-gray-400 hidden md:block">×</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Porcentaje de bono:</span>
            <span className="text-amber-700 font-bold">15%</span>
          </div>
          <span className="text-gray-400 hidden md:block">=</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Bono esperado:</span>
            <span className="text-amber-600 font-bold text-lg">{formatearMoneda(bonoEsperado)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          El bono se calcula sobre el total de ventas anuales de la sucursal al cierre del año {anioSeleccionado}.
        </p>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Detalle de Ventas</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-5 py-3 text-left font-semibold text-gray-700">N° Factura</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">Fecha</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">Cliente</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">Vendedor</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">Tipo</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-700">Método</th>
                <th className="px-5 py-3 text-right font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-mono font-bold text-blue-600">
                    {String(venta.numero).padStart(6, '0')}
                  </td>
                  <td className="px-5 py-4 text-sm">{venta.fecha}</td>
                  <td className="px-5 py-4">{getNombreCliente(venta.clienteId)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{venta.vendedor}</td>
                  <td className="px-5 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-xs">
                      {venta.tipoFactura === 'A' ? 'Factura A' : 'Factura B'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {venta.metodoPago === 'efectivo' ? '💵 Efectivo' : venta.metodoPago === 'tarjeta' ? '💳 Tarjeta' : '🏦 Transferencia'}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-green-600">
                    {formatearMoneda(venta.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-300">
                <td colSpan={6} className="px-5 py-4 font-bold text-gray-700 text-right">
                  Total anual:
                </td>
                <td className="px-5 py-4 text-right font-bold text-green-700 text-lg">
                  {formatearMoneda(totalAnual)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EncargadoVentas;
