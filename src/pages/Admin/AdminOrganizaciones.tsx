import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Organizacion } from '../../types/index';
import { mockOrganizaciones } from '../../data/mockData';

const AdminOrganizaciones: React.FC = () => {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>(mockOrganizaciones);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Organizacion>({
    id: 0,
    cuit: '',
    codigo: '',
    nombre: '',
    logo: '',
    servicios: [],
    rubros: []
  });

  const handleEdit = (org: Organizacion) => {
    setEditingId(org.id);
    setFormData(org);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setOrganizaciones(organizaciones.filter((org) => org.id !== id));
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: Math.max(...organizaciones.map((o) => o.id), 0) + 1,
      cuit: '',
      codigo: '',
      nombre: '',
      logo: '',
      servicios: [],
      rubros: []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setOrganizaciones(
        organizaciones.map((org) => (org.id === editingId ? formData : org))
      );
    } else {
      setOrganizaciones([...organizaciones, formData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Organizaciones"
        columns={[
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'cuit', label: 'CUIT' },
          {
            key: 'servicios',
            label: 'Servicios',
            render: (servicios) => servicios.join(', ')
          },
          {
            key: 'rubros',
            label: 'Rubros',
            render: (rubros) => rubros.join(', ')
          }
        ]}
        data={organizaciones}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Organización' : 'Nueva Organización'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CUIT
          </label>
          <input
            type="text"
            value={formData.cuit}
            onChange={(e) =>
              setFormData({ ...formData, cuit: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) =>
              setFormData({ ...formData, logo: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Servicios (separados por coma)
          </label>
          <textarea
            value={formData.servicios.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                servicios: e.target.value.split(',').map((s) => s.trim())
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Rubros (separados por coma)
          </label>
          <textarea
            value={formData.rubros.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                rubros: e.target.value.split(',').map((s) => s.trim())
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={2}
          />
        </div>
      </FormModal>
    </div>
  );
};

export default AdminOrganizaciones;
