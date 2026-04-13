import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Producto } from '../../types/index';
import { mockProductos, mockCategorias } from '../../data/mockData';
import { formatearMoneda } from '../../utils/calculosVenta';

const AdminProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>(mockProductos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Producto>({
    id: 0,
    nombre: '',
    codigo: '',
    marca: '',
    modelo: '',
    proveedor: '',
    unidadMedida: 'Unidad',
    precio: 0,
    iva: 21,
    stock: 0,
    categoriaId: 1,
    esCombo: false,
    productosCombo: []
  });

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setFormData(producto);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: Math.max(...productos.map((p) => p.id), 0) + 1,
      nombre: '',
      codigo: '',
      marca: '',
      modelo: '',
      proveedor: '',
      unidadMedida: 'Unidad',
      precio: 0,
      iva: 21,
      stock: 0,
      categoriaId: 1,
      esCombo: false,
      productosCombo: []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProductos(
        productos.map((p) => (p.id === editingId ? formData : p))
      );
    } else {
      setProductos([...productos, formData]);
    }
    setIsModalOpen(false);
  };

  const getNombreCategoria = (catId: number) => {
    return mockCategorias.find((c) => c.id === catId)?.nombre || 'N/A';
  };

  const toggleProductoCombo = (productoId: number) => {
    if (formData.productosCombo?.includes(productoId)) {
      setFormData({
        ...formData,
        productosCombo: formData.productosCombo?.filter((p) => p !== productoId)
      });
    } else {
      setFormData({
        ...formData,
        productosCombo: [...(formData.productosCombo || []), productoId]
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Productos"
        columns={[
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'marca', label: 'Marca' },
          {
            key: 'precio',
            label: 'Precio',
            render: (precio) => formatearMoneda(precio)
          },
          {
            key: 'iva',
            label: 'IVA',
            render: (iva) => `${iva}%`
          },
          { key: 'stock', label: 'Stock' },
          {
            key: 'categoriaId',
            label: 'Categoría',
            render: (catId) => getNombreCategoria(catId)
          },
          {
            key: 'esCombo',
            label: 'Tipo',
            render: (esCombo) => esCombo ? '📦 Combo' : '📄 Simple'
          }
        ]}
        data={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Producto' : 'Nuevo Producto'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código
            </label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({ ...formData, codigo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Marca
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Modelo
            </label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) =>
                setFormData({ ...formData, modelo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Proveedor
          </label>
          <input
            type="text"
            value={formData.proveedor}
            onChange={(e) =>
              setFormData({ ...formData, proveedor: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={formData.categoriaId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoriaId: parseInt(e.target.value)
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              {mockCategorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unidad de Medida
            </label>
            <input
              type="text"
              value={formData.unidadMedida}
              onChange={(e) =>
                setFormData({ ...formData, unidadMedida: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) =>
                setFormData({ ...formData, precio: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              IVA (%)
            </label>
            <select
              value={formData.iva}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  iva: parseFloat(e.target.value) as 10.5 | 21
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="21">21% - Estándar</option>
              <option value="10.5">10.5% - Informático</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="border-t-2 pt-4">
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.esCombo || false}
              onChange={(e) =>
                setFormData({ ...formData, esCombo: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="font-semibold text-gray-700">
              ¿Es un combo de productos?
            </span>
          </label>

          {formData.esCombo && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Seleccionar productos para el combo:
              </p>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-3 space-y-2 bg-gray-50">
                {productos
                  .filter((p) => p.id !== formData.id && !p.esCombo)
                  .map((producto) => (
                    <label
                      key={producto.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={formData.productosCombo?.includes(
                          producto.id
                        )}
                        onChange={() => toggleProductoCombo(producto.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        {producto.nombre} - {formatearMoneda(producto.precio)}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>
      </FormModal>
    </div>
  );
};

export default AdminProductos;
