import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Categoria } from '../../types/index';
import { useCategorias } from '../../context/CategoriasContext';
import { useToast } from '../../context/ToastContext';

const emptyForm = (): Omit<Categoria, 'id'> => ({
  codigo: '',
  nombre: '',
  descripcion: ''
});

const AdminCategorias: React.FC = () => {
  const toast = useToast();
  const { categorias, agregarCategoria, editarCategoria, eliminarCategoria } = useCategorias();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Categoria, 'id'>>(emptyForm());

  const handleAdd = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Categoria) => {
    setEditingId(cat.id);
    setFormData({ codigo: cat.codigo, nombre: cat.nombre, descripcion: cat.descripcion });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    eliminarCategoria(id);
    toast.success('Categoría eliminada');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      editarCategoria({ id: editingId, ...formData });
      toast.success('Categoría actualizada correctamente');
    } else {
      agregarCategoria(formData);
      toast.success('Categoría creada correctamente');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestionar Categorías"
        columns={[
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' }
        ]}
        data={categorias}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar categoría..."
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId !== null ? 'Editar Categoría' : 'Nueva Categoría'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Ej: ELEC"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Ej: Electrodomésticos"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Descripción de la categoría..."
          />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminCategorias;
