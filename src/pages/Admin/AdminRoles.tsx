import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Role } from '../../types/index';
import { mockRoles } from '../../data/mockData';

const permisosPosibles = [
  'ver_usuarios',
  'crear_usuario',
  'editar_usuario',
  'borrar_usuario',
  'ver_roles',
  'crear_rol',
  'editar_rol',
  'borrar_rol',
  'ver_organizaciones',
  'crear_organizacion',
  'editar_organizacion',
  'borrar_organizacion',
  'ver_sucursales',
  'crear_sucursal',
  'editar_sucursal',
  'borrar_sucursal',
  'ver_productos',
  'crear_producto',
  'editar_producto',
  'borrar_producto',
  'ver_rubros_servicios',
  'editar_rubros_servicios',
  'ver_stock',
  'editar_stock',
  'ver_vendedores',
  'ver_reportes',
  'crear_venta',
  'ver_mis_ventas',
  'solicitar_credito',
  'ver_mis_creditos'
];

const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Role>({
    id: 0,
    nombre: '',
    descripcion: '',
    permisos: []
  });

  const handleEdit = (rol: Role) => {
    setEditingId(rol.id);
    setFormData(rol);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      id: Math.max(...roles.map((r) => r.id), 0) + 1,
      nombre: '',
      descripcion: '',
      permisos: []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRoles(roles.map((r) => (r.id === editingId ? formData : r)));
    } else {
      setRoles([...roles, formData]);
    }
    setIsModalOpen(false);
  };

  const togglePermiso = (permiso: string) => {
    if (formData.permisos.includes(permiso)) {
      setFormData({
        ...formData,
        permisos: formData.permisos.filter((p) => p !== permiso)
      });
    } else {
      setFormData({
        ...formData,
        permisos: [...formData.permisos, permiso]
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Roles y Permisos"
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' },
          {
            key: 'permisos',
            label: 'Permisos',
            render: (permisos) => `${permisos.length} permisos asignados`
          }
        ]}
        data={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Rol' : 'Nuevo Rol'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del Rol
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
            Descripción
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Asignar Permisos
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
            {permisosPosibles.map((permiso) => (
              <label
                key={permiso}
                className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={formData.permisos.includes(permiso)}
                  onChange={() => togglePermiso(permiso)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{permiso}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
          <p className="font-semibold mb-1">Permisos seleccionados: {formData.permisos.length}</p>
          <div className="flex flex-wrap gap-2">
            {formData.permisos.map((p) => (
              <span key={p} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminRoles;
