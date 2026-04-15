import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Servicio } from '../../types/index';
import { mockServicios, mockCreditos } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const emptyServicio: Servicio = { id: 0, nombre: '', descripcion: '', creditoId: 0 };

const AdminServicios: React.FC = () => {
  const toast = useToast();
  const [servicios, setServicios] = useState<Servicio[]>(mockServicios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [servicioForm, setServicioForm] = useState<Servicio>({
    ...emptyServicio,
    creditoId: mockCreditos[0]?.id ?? 0
  });

  const getNombreCredito = (creditoId: number) =>
    mockCreditos.find((c) => c.id === creditoId)?.nombre ?? 'Sin asignar';

  const handleAdd = () => {
    setEditingId(null);
    setServicioForm({
      ...emptyServicio,
      id: Math.max(...servicios.map((s) => s.id), 0) + 1,
      creditoId: mockCreditos[0]?.id ?? 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingId(servicio.id);
    setServicioForm(servicio);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setServicios(servicios.filter((s) => s.id !== id));
    toast.info('Servicio eliminado');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setServicios(servicios.map((s) => (s.id === editingId ? servicioForm : s)));
      toast.success('Servicio actualizado correctamente');
    } else {
      setServicios([...servicios, servicioForm]);
      toast.success('Servicio creado correctamente');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Servicios"
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' },
          {
            key: 'creditoId',
            label: 'Línea de Crédito',
            render: (creditoId) => getNombreCredito(creditoId)
          }
        ]}
        data={servicios}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar servicio..."
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={servicioForm.nombre}
            onChange={(e) => setServicioForm({ ...servicioForm, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            value={servicioForm.descripcion}
            onChange={(e) => setServicioForm({ ...servicioForm, descripcion: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Línea de Crédito asociada
          </label>
          <select
            value={servicioForm.creditoId}
            onChange={(e) =>
              setServicioForm({ ...servicioForm, creditoId: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value={0} disabled>
              Seleccionar línea de crédito...
            </option>
            {mockCreditos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.codigo} — {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminServicios;
