import React, { useState } from 'react';
import { Venta } from '../../types/index';
import { mockProductos, mockClientes } from '../../data/mockData';
import { formatearMoneda } from '../../utils/calculosVenta';

const VendedorMisVentas: React.FC = () => {
  // Ventas simuladas del vendedor
  const [ventas] = useState<Venta[]>([
    {
      id: 1,
      numero: 12345,
      fecha: '2025-04-10',
      clienteId: 1,
      vendedorId: 4,
      sucursalId: 1,
      items: [
        { productoId: 1, cantidad: 1, precioUnitario: 65000, iva: 10.5, subtotal: 71825 }
      ],
      tipoFactura: 'A',
      descuento: 0,
      subtotal: 65000,
      totalIva: 6825,
      totalBruto: 71825,
      metodoPago: 'tarjeta'
    },
    {
      id: 2,
      numero: 12346,
      fecha: '2025-04-12',
      clienteId: 2,
      vendedorId: 4,
      sucursalId: 1,
      items: [
        { productoId: 4, cantidad: 2, precioUnitario: 800, iva: 21, subtotal: 1936 }
      ],
      tipoFactura: 'B',
      descuento: 0,
      subtotal: 1600,
      totalIva: 336,
      totalBruto: 1936,
      metodoPago: 'efectivo'
    }
  ]);

  const [selectedVente, setSelectedVenta] = useState<Venta | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const getNombreCliente = (clienteId: number) => {
    const cliente = mockClientes.find((c) => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A';
  };

  const getNombreProducto = (productoId: number) => {
    return mockProductos.find((p) => p.id === productoId)?.nombre || 'N/A';
  };

  const totalVendido = ventas.reduce((sum, v) => sum + v.totalBruto, 0);
  const cantidadVentas = ventas.length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Mis Ventas</h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">📊 Total de Ventas</p>
          <p className="text-3xl font-bold text-blue-600">{cantidadVentas}</p>
          <p className="text-gray-600 text-xs mt-2">transacciones</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">💰 Total Vendido</p>
          <p className="text-3xl font-bold text-green-600">
            {formatearMoneda(totalVendido)}
          </p>
          <p className="text-gray-600 text-xs mt-2">ingresos brutos</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">🎁 Bono Estimado</p>
          <p className="text-3xl font-bold text-purple-600">
            {formatearMoneda(totalVendido * 0.1)}
          </p>
          <p className="text-gray-600 text-xs mt-2">10% de ventas</p>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Ventas</h2>

        {ventas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay ventas registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    N° Factura
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Método
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {String(venta.numero).padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm">{venta.fecha}</td>
                    <td className="px-6 py-4">{getNombreCliente(venta.clienteId)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-xs">
                        {venta.tipoFactura === 'A' ? 'Factura A' : 'Factura B'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {venta.metodoPago === 'efectivo'
                        ? '💵'
                        : venta.metodoPago === 'tarjeta'
                          ? '💳'
                          : '🏦'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      {formatearMoneda(venta.totalBruto)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedVenta(venta);
                          setMostrarDetalles(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        👁️ Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {mostrarDetalles && selectedVente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">Detalles de Venta</h2>
              <button
                onClick={() => setMostrarDetalles(false)}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">N° Factura</p>
                  <p className="text-lg font-bold text-blue-600">
                    {String(selectedVente.numero).padStart(6, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Fecha</p>
                  <p className="text-lg font-bold">{selectedVente.fecha}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Cliente</p>
                  <p className="text-lg font-bold">
                    {getNombreCliente(selectedVente.clienteId)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Tipo de Factura</p>
                  <p className="text-lg font-bold">
                    {selectedVente.tipoFactura === 'A' ? 'Factura A' : 'Factura B'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-bold text-gray-800 mb-2">Productos:</p>
                <div className="space-y-2">
                  {selectedVente.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                      <span>
                        {item.cantidad}x {getNombreProducto(item.productoId)}
                      </span>
                      <span className="font-semibold">
                        {formatearMoneda(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {formatearMoneda(selectedVente.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IVA:</span>
                  <span className="font-semibold">
                    {formatearMoneda(selectedVente.totalIva)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatearMoneda(selectedVente.totalBruto)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorMisVentas;
