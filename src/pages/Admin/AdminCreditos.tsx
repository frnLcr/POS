import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Credito } from '../../types/index';
import { mockCreditos, mockOrganizaciones } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const AdminCreditos: React.FC = () => {
  const toast = useToast();
  const [creditos, setCreditos] = useState<Credito[]>(mockCreditos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Credito>({
    id: 0,
    codigo: '',
    nombre: '',
    organizacionId: 1,
    fechaDesde: '',
    fechaHasta: '',
    edadMinima: 0,
    edadMaxima: 0,
    tasaInteres: 0
  });

  const handleEdit = (credito: Credito) => {
    setEditingId(credito.id);
    setFormData(credito);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCreditos(creditos.filter((c) => c.id !== id));
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: Math.max(...creditos.map((c) => c.id), 0) + 1,
      codigo: '',
      nombre: '',
      organizacionId: 1,
      fechaDesde: '',
      fechaHasta: '',
      edadMinima: 0,
      edadMaxima: 0,
      tasaInteres: 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCreditos(creditos.map((c) => (c.id === editingId ? formData : c)));
      toast.success('Línea de crédito actualizada correctamente');
    } else {
      setCreditos([...creditos, formData]);
      toast.success('Línea de crédito creada correctamente');
    }
    setIsModalOpen(false);
  };

  const getNombreOrganizacion = (orgId: number) => {
    return mockOrganizaciones.find((o) => o.id === orgId)?.nombre || 'N/A';
  };

  const estaVigente = (fechaDesde: string, fechaHasta: string) => {
    const hoy = new Date().toISOString().split('T')[0];
    return fechaDesde <= hoy && hoy <= fechaHasta;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Líneas de Crédito"
        columns={[
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Nombre' },
          {
            key: 'organizacionId',
            label: 'Organización',
            render: (orgId) => getNombreOrganizacion(orgId)
          },
          {
            key: 'fechaDesde',
            label: 'Vigencia',
            render: (_, credito) =>
              `${credito.fechaDesde} - ${credito.fechaHasta} ${
                estaVigente(credito.fechaDesde, credito.fechaHasta)
                  ? '✅'
                  : '❌'
              }`
          },
          {
            key: 'tasaInteres',
            label: 'Tasa (%)',
            render: (tasa) => `${tasa}%`
          },
          {
            key: 'edadMinima',
            label: 'Edad',
            render: (_, credito) =>
              `${credito.edadMinima} - ${credito.edadMaxima} años`
          }
        ]}
        data={creditos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Línea de Crédito' : 'Nueva Línea de Crédito'}
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Organización
          </label>
          <select
            value={formData.organizacionId}
            onChange={(e) =>
              setFormData({
                ...formData,
                organizacionId: parseInt(e.target.value)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {mockOrganizaciones.map((org) => (
              <option key={org.id} value={org.id}>
                {org.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={formData.fechaDesde}
              onChange={(e) =>
                setFormData({ ...formData, fechaDesde: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={formData.fechaHasta}
              onChange={(e) =>
                setFormData({ ...formData, fechaHasta: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Edad Mínima
            </label>
            <input
              type="number"
              value={formData.edadMinima}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  edadMinima: parseInt(e.target.value)
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Edad Máxima
            </label>
            <input
              type="number"
              value={formData.edadMaxima}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  edadMaxima: parseInt(e.target.value)
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tasa de Interés (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.tasaInteres}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tasaInteres: parseFloat(e.target.value)
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminCreditos;
