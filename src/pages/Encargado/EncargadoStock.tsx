import React, { useState } from 'react';
import FormModal from '../../components/FormModal';
import { MovimientoStock } from '../../types/index';
import { mockProductos } from '../../data/mockData';
import { formatearMoneda } from '../../utils/calculosVenta';

interface ProductoConStock {
  productoId: number;
  nombre: string;
  stock: number;
  precio: number;
}

const EncargadoStock: React.FC = () => {
  const [stockProductos, setStockProductos] = useState<ProductoConStock[]>(
    mockProductos.map((p) => ({
      productoId: p.id,
      nombre: p.nombre,
      stock: p.stock,
      precio: p.precio
    }))
  );

  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productoId: 1,
    tipo: 'entrada' as 'entrada' | 'salida' | 'ajuste',
    cantidad: 0,
    motivo: ''
  });

  const handleRegistrarMovimiento = (e: React.FormEvent) => {
    e.preventDefault();

    // Actualizar stock
    setStockProductos(
      stockProductos.map((p) => {
        if (p.productoId === formData.productoId) {
          const nuevaCantidad =
            formData.tipo === 'entrada'
              ? p.stock + formData.cantidad
              : formData.tipo === 'salida'
                ? p.stock - formData.cantidad
                : formData.cantidad;
          return { ...p, stock: nuevaCantidad };
        }
        return p;
      })
    );

    // Registrar movimiento
    const nuevoMovimiento: MovimientoStock = {
      id: movimientos.length + 1,
      productoId: formData.productoId,
      tipo: formData.tipo,
      cantidad: formData.cantidad,
      fecha: new Date().toISOString().split('T')[0],
      motivo: formData.motivo,
      usuarioId: 2 // Simulando usuario actual
    };
    setMovimientos([...movimientos, nuevoMovimiento]);

    // Resetear formulario
    setFormData({
      productoId: 1,
      tipo: 'entrada',
      cantidad: 0,
      motivo: ''
    });
    setIsModalOpen(false);
  };

  const getNombreProducto = (productoId: number) => {
    return mockProductos.find((p) => p.id === productoId)?.nombre || 'N/A';
  };

  const getColorStock = (stock: number) => {
    if (stock === 0) return 'text-red-600 font-bold';
    if (stock < 10) return 'text-orange-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Stock Actual</h2>

          <div className="mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              ➕ Registrar Movimiento
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Precio Unitario
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockProductos.map((item) => {
                  const producto = mockProductos.find(
                    (p) => p.id === item.productoId
                  );
                  return (
                    <tr key={item.productoId} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">
                        {producto?.codigo}
                      </td>
                      <td className="px-6 py-4">{item.nombre}</td>
                      <td className={`px-6 py-4 ${getColorStock(item.stock)}`}>
                        {item.stock} {producto?.unidadMedida}
                      </td>
                      <td className="px-6 py-4">
                        {formatearMoneda(item.precio)}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatearMoneda(item.stock * item.precio)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-gray-700 font-semibold">
              Valor Total de Inventario:{' '}
              <span className="text-green-600 text-lg">
                {formatearMoneda(
                  stockProductos.reduce((sum, p) => sum + p.stock * p.precio, 0)
                )}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Histórico de movimientos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📜 Histórico de Movimientos
        </h2>

        {movimientos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay movimientos registrados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Motivo
                  </th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov) => (
                  <tr key={mov.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{mov.fecha}</td>
                    <td className="px-6 py-4">{getNombreProducto(mov.productoId)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded font-semibold text-xs ${
                          mov.tipo === 'entrada'
                            ? 'bg-green-100 text-green-800'
                            : mov.tipo === 'salida'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {mov.tipo === 'entrada'
                          ? '⬆️ Entrada'
                          : mov.tipo === 'salida'
                            ? '⬇️ Salida'
                            : '🔄 Ajuste'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{mov.cantidad}</td>
                    <td className="px-6 py-4 text-gray-600">{mov.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de nuevo movimiento */}
      <FormModal
        isOpen={isModalOpen}
        title="Registrar Movimiento de Stock"
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegistrarMovimiento}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Producto
          </label>
          <select
            value={formData.productoId}
            onChange={(e) =>
              setFormData({
                ...formData,
                productoId: parseInt(e.target.value)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {mockProductos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Movimiento
          </label>
          <select
            value={formData.tipo}
            onChange={(e) =>
              setFormData({
                ...formData,
                tipo: e.target.value as 'entrada' | 'salida' | 'ajuste'
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="entrada">⬆️ Entrada (compra/recepción)</option>
            <option value="salida">⬇️ Salida (venta/devolución)</option>
            <option value="ajuste">🔄 Ajuste</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cantidad
          </label>
          <input
            type="number"
            value={formData.cantidad}
            onChange={(e) =>
              setFormData({
                ...formData,
                cantidad: parseInt(e.target.value)
              })
            }
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Motivo
          </label>
          <textarea
            value={formData.motivo}
            onChange={(e) =>
              setFormData({
                ...formData,
                motivo: e.target.value
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={3}
            placeholder="Ej: Recepción de compra, Devolución del cliente, Ajuste por inventario..."
            required
          />
        </div>
      </FormModal>
    </div>
  );
};

export default EncargadoStock;
