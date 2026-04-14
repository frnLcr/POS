import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Producto } from '../../types/index';
import { mockProductos } from '../../data/mockData';
import { formatearMoneda } from '../../utils/calculosVenta';
import { useToast } from '../../context/ToastContext';
import { useCategorias } from '../../context/CategoriasContext';

const AdminProductos: React.FC = () => {
  const toast = useToast();
  const { categorias } = useCategorias();
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
    productosCombo: [],
    descuento: 0
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
      categoriaId: 0,
      esCombo: false,
      productosCombo: [],
      descuento: 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoriaId || formData.categoriaId === 0) {
      toast.error('Debe seleccionar una categoría para el producto');
      return;
    }
    if (editingId) {
      setProductos(productos.map((p) => (p.id === editingId ? formData : p)));
      toast.success('Producto actualizado correctamente');
    } else {
      setProductos([...productos, formData]);
      toast.success('Producto creado correctamente');
    }
    setIsModalOpen(false);
  };

  const getNombreCategoria = (catId: number) => {
    return categorias.find((c) => c.id === catId)?.nombre || 'N/A';
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
            key: 'descuento',
            label: 'Descuento',
            render: (d, item) => item.esCombo && d ? (
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">{d}% OFF</span>
            ) : <span className="text-gray-400 text-xs">—</span>
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
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoriaId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoriaId: parseInt(e.target.value)
                })
              }
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                formData.categoriaId === 0 ? 'border-red-400 text-gray-400' : 'border-gray-300 text-gray-900'
              }`}
              required
            >
              <option value={0} disabled>— Seleccionar categoría —</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {formData.categoriaId === 0 && (
              <p className="text-red-500 text-xs mt-1">Debe seleccionar una categoría</p>
            )}
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
                setFormData({ ...formData, esCombo: e.target.checked, descuento: e.target.checked ? (formData.descuento ?? 0) : 0 })
              }
              className="w-4 h-4"
            />
            <span className="font-semibold text-gray-700">
              ¿Es un combo de productos?
            </span>
          </label>

          {formData.esCombo && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descuento del combo (%) — 0 = sin descuento
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.descuento ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, descuento: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {(formData.descuento ?? 0) > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    Precio final del combo: {formatearMoneda(formData.precio * (1 - (formData.descuento ?? 0) / 100))}
                  </p>
                )}
              </div>
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
            </div>
          )}
        </div>
      </FormModal>
    </div>
  );
};

export default AdminProductos;
