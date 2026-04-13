import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Sucursal } from '../../types/index';
import { mockSucursales, mockOrganizaciones, mockUsuarios } from '../../data/mockData';

const AdminSucursales: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>(mockSucursales);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Sucursal>({
    id: 0,
    organizacionId: 1,
    nombre: '',
    codigo: '',
    direccion: {
      calle: '',
      numero: '',
      barrio: '',
      localidad: '',
      provincia: ''
    },
    encargadoId: 1
  });

  const handleEdit = (sucursal: Sucursal) => {
    setEditingId(sucursal.id);
    setFormData(sucursal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSucursales(sucursales.filter((s) => s.id !== id));
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: Math.max(...sucursales.map((s) => s.id), 0) + 1,
      organizacionId: 1,
      nombre: '',
      codigo: '',
      direccion: {
        calle: '',
        numero: '',
        barrio: '',
        localidad: '',
        provincia: ''
      },
      encargadoId: 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSucursales(
        sucursales.map((s) => (s.id === editingId ? formData : s))
      );
    } else {
      setSucursales([...sucursales, formData]);
    }
    setIsModalOpen(false);
  };

  const getNombreOrganizacion = (id: number) => {
    return mockOrganizaciones.find((o) => o.id === id)?.nombre || 'N/A';
  };

  const getNombreEncargado = (id: number) => {
    const usuario = mockUsuarios.find((u) => u.id === id);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'N/A';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Sucursales"
        columns={[
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Nombre' },
          {
            key: 'organizacionId',
            label: 'Organización',
            render: (orgId) => getNombreOrganizacion(orgId)
          },
          {
            key: 'direccion',
            label: 'Dirección',
            render: (dir) => `${dir.calle} ${dir.numero}, ${dir.barrio}`
          },
          {
            key: 'encargadoId',
            label: 'Encargado',
            render: (encId) => getNombreEncargado(encId)
          }
        ]}
        data={sucursales}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Sucursal' : 'Nueva Sucursal'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Calle
            </label>
            <input
              type="text"
              value={formData.direccion.calle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, calle: e.target.value }
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número
            </label>
            <input
              type="text"
              value={formData.direccion.numero}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, numero: e.target.value }
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Barrio
            </label>
            <input
              type="text"
              value={formData.direccion.barrio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, barrio: e.target.value }
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Localidad
            </label>
            <input
              type="text"
              value={formData.direccion.localidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  direccion: { ...formData.direccion, localidad: e.target.value }
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Provincia
          </label>
          <input
            type="text"
            value={formData.direccion.provincia}
            onChange={(e) =>
              setFormData({
                ...formData,
                direccion: { ...formData.direccion, provincia: e.target.value }
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Encargado
          </label>
          <select
            value={formData.encargadoId}
            onChange={(e) =>
              setFormData({
                ...formData,
                encargadoId: parseInt(e.target.value)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {mockUsuarios
              .filter((u) => u.roleId === 2)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre} {user.apellido}
                </option>
              ))}
          </select>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminSucursales;
