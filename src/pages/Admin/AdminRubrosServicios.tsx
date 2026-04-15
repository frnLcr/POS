import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Rubro } from '../../types/index';
import { mockRubros } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const emptyRubro: Rubro = { id: 0, nombre: '', descripcion: '' };

const AdminRubros: React.FC = () => {
  const toast = useToast();
  const [rubros, setRubros] = useState<Rubro[]>(mockRubros);
  const [isRubroModalOpen, setIsRubroModalOpen] = useState(false);
  const [editingRubroId, setEditingRubroId] = useState<number | null>(null);
  const [rubroForm, setRubroForm] = useState<Rubro>(emptyRubro);

  const handleAdd = () => {
    setEditingRubroId(null);
    setRubroForm({ ...emptyRubro, id: Math.max(...rubros.map((r) => r.id), 0) + 1 });
    setIsRubroModalOpen(true);
  };

  const handleEdit = (rubro: Rubro) => {
    setEditingRubroId(rubro.id);
    setRubroForm(rubro);
    setIsRubroModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setRubros(rubros.filter((r) => r.id !== id));
    toast.info('Rubro eliminado');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRubroId) {
      setRubros(rubros.map((r) => (r.id === editingRubroId ? rubroForm : r)));
      toast.success('Rubro actualizado correctamente');
    } else {
      setRubros([...rubros, rubroForm]);
      toast.success('Rubro creado correctamente');
    }
    setIsRubroModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Rubros"
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' }
        ]}
        data={rubros}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar rubro..."
      />

      <FormModal
        isOpen={isRubroModalOpen}
        title={editingRubroId ? 'Editar Rubro' : 'Nuevo Rubro'}
        onClose={() => setIsRubroModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={rubroForm.nombre}
            onChange={(e) => setRubroForm({ ...rubroForm, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            value={rubroForm.descripcion}
            onChange={(e) => setRubroForm({ ...rubroForm, descripcion: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminRubros;
