import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Organizacion } from '../../types/index';
import { mockOrganizaciones, mockSucursales } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const AdminOrganizaciones: React.FC = () => {
  const toast = useToast();
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>(mockOrganizaciones);
  const [verSucursalesOrgId, setVerSucursalesOrgId] = useState<number | null>(null);
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
      setOrganizaciones(organizaciones.map((org) => (org.id === editingId ? formData : org)));
      toast.success('Organización actualizada correctamente');
    } else {
      setOrganizaciones([...organizaciones, formData]);
      toast.success('Organización creada correctamente');
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
          },
          {
            key: 'id',
            label: 'Sucursales',
            render: (orgId) => {
              const count = mockSucursales.filter((s) => s.organizacionId === orgId).length;
              return (
                <button
                  type="button"
                  onClick={() => setVerSucursalesOrgId(orgId)}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-xs font-semibold px-3 py-1 rounded-full transition"
                >
                  🏪 {count} sucursal{count !== 1 ? 'es' : ''}
                </button>
              );
            }
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

      {/* Modal sucursales de la organización */}
      {verSucursalesOrgId !== null && (() => {
        const org = organizaciones.find((o) => o.id === verSucursalesOrgId);
        const sucursales = mockSucursales.filter((s) => s.organizacionId === verSucursalesOrgId);
        return (
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Sucursales</h3>
                  <p className="text-sm text-slate-500">{org?.nombre}</p>
                </div>
                <button
                  onClick={() => setVerSucursalesOrgId(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {sucursales.length === 0 ? (
                  <p className="text-center text-gray-400 py-6">Esta organización no tiene sucursales registradas</p>
                ) : (
                  <div className="space-y-3">
                    {sucursales.map((s) => (
                      <div key={s.id} className="border border-gray-200 rounded-xl p-4 hover:bg-slate-50 transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-800">{s.nombre}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Código: {s.codigo}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          {s.direccion.calle} {s.direccion.numero}, {s.direccion.barrio}
                        </p>
                        <p className="text-xs text-slate-400">
                          {s.direccion.localidad}, {s.direccion.provincia}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminOrganizaciones;
