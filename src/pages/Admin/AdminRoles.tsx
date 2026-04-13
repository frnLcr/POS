import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Role } from '../../types/index';
import { mockRoles } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

interface ModuloPermiso {
  modulo: string;
  icon: string;
  permisos: { key: string; label: string }[];
}

const MODULOS: ModuloPermiso[] = [
  {
    modulo: 'Usuarios',
    icon: '👥',
    permisos: [
      { key: 'ver_usuarios',    label: 'Ver usuarios' },
      { key: 'crear_usuario',   label: 'Crear usuarios' },
      { key: 'editar_usuario',  label: 'Editar usuarios' },
      { key: 'borrar_usuario',  label: 'Dar de baja usuarios' }
    ]
  },
  {
    modulo: 'Roles',
    icon: '🔐',
    permisos: [
      { key: 'ver_roles',   label: 'Ver roles' },
      { key: 'crear_rol',   label: 'Crear roles' },
      { key: 'editar_rol',  label: 'Editar roles' },
      { key: 'borrar_rol',  label: 'Eliminar roles' }
    ]
  },
  {
    modulo: 'Organizaciones',
    icon: '🏢',
    permisos: [
      { key: 'ver_organizaciones',    label: 'Ver organizaciones' },
      { key: 'crear_organizacion',    label: 'Crear organizaciones' },
      { key: 'editar_organizacion',   label: 'Editar organizaciones' },
      { key: 'borrar_organizacion',   label: 'Eliminar organizaciones' }
    ]
  },
  {
    modulo: 'Sucursales',
    icon: '🏪',
    permisos: [
      { key: 'ver_sucursales',    label: 'Ver sucursales' },
      { key: 'crear_sucursal',    label: 'Crear sucursales' },
      { key: 'editar_sucursal',   label: 'Editar sucursales' },
      { key: 'borrar_sucursal',   label: 'Eliminar sucursales' }
    ]
  },
  {
    modulo: 'Productos',
    icon: '📦',
    permisos: [
      { key: 'ver_productos',    label: 'Ver productos' },
      { key: 'crear_producto',   label: 'Crear productos' },
      { key: 'editar_producto',  label: 'Editar productos' },
      { key: 'borrar_producto',  label: 'Eliminar productos' }
    ]
  },
  {
    modulo: 'Rubros y Servicios',
    icon: '📋',
    permisos: [
      { key: 'ver_rubros_servicios',    label: 'Ver rubros y servicios' },
      { key: 'editar_rubros_servicios', label: 'Editar rubros y servicios' }
    ]
  },
  {
    modulo: 'Stock',
    icon: '📊',
    permisos: [
      { key: 'ver_stock',    label: 'Ver stock' },
      { key: 'editar_stock', label: 'Ajustar stock' }
    ]
  },
  {
    modulo: 'Vendedores y Reportes',
    icon: '📈',
    permisos: [
      { key: 'ver_vendedores', label: 'Ver vendedores' },
      { key: 'ver_reportes',   label: 'Ver reportes' }
    ]
  },
  {
    modulo: 'Ventas',
    icon: '🛒',
    permisos: [
      { key: 'crear_venta',    label: 'Crear ventas (cajero)' },
      { key: 'ver_mis_ventas', label: 'Ver mis ventas' },
      { key: 'consultar_productos', label: 'Consultar productos' }
    ]
  },
  {
    modulo: 'Créditos',
    icon: '💳',
    permisos: [
      { key: 'solicitar_credito', label: 'Solicitar créditos' },
      { key: 'ver_mis_creditos',  label: 'Ver mis créditos' }
    ]
  }
];

const AdminRoles: React.FC = () => {
  const toast = useToast();
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
    toast.info('Rol eliminado');
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
      toast.success('Rol actualizado correctamente');
    } else {
      setRoles([...roles, formData]);
      toast.success('Rol creado correctamente');
    }
    if (formData.permisos.length === 0) {
      toast.info('El rol fue guardado sin accesos asignados');
    }
    setIsModalOpen(false);
  };

  const togglePermiso = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(key)
        ? prev.permisos.filter((p) => p !== key)
        : [...prev.permisos, key]
    }));
  };

  const toggleModulo = (mod: ModuloPermiso) => {
    const keys = mod.permisos.map((p) => p.key);
    const todosActivos = keys.every((k) => formData.permisos.includes(k));
    setFormData((prev) => ({
      ...prev,
      permisos: todosActivos
        ? prev.permisos.filter((p) => !keys.includes(p))
        : [...new Set([...prev.permisos, ...keys])]
    }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Roles"
        searchPlaceholder="Buscar rol..."
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' },
          {
            key: 'permisos',
            label: 'Accesos',
            render: (permisos: string[]) => (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {permisos.length} accesos
              </span>
            )
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Rol</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Acceso por módulo
            </label>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
              {formData.permisos.length} seleccionados
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {MODULOS.map((mod) => {
              const keys = mod.permisos.map((p) => p.key);
              const activos = keys.filter((k) => formData.permisos.includes(k)).length;
              const todos = activos === keys.length;

              return (
                <div key={mod.modulo} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header del módulo */}
                  <label className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={todos}
                      ref={(el) => { if (el) el.indeterminate = activos > 0 && !todos; }}
                      onChange={() => toggleModulo(mod)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-slate-700 flex-1">
                      {mod.icon} {mod.modulo}
                    </span>
                    <span className="text-xs text-gray-400">
                      {activos}/{keys.length}
                    </span>
                  </label>

                  {/* Permisos individuales */}
                  <div className="grid grid-cols-2 gap-1 p-3 bg-white">
                    {mod.permisos.map((p) => (
                      <label key={p.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
                        <input
                          type="checkbox"
                          checked={formData.permisos.includes(p.key)}
                          onChange={() => togglePermiso(p.key)}
                          className="w-3.5 h-3.5 accent-blue-600"
                        />
                        <span className="text-xs text-gray-600">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminRoles;
