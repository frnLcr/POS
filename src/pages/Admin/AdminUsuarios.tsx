import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Usuario, Role } from '../../types/index';
import { mockUsuarios, mockRoles, mockSucursales } from '../../data/mockData';

const AdminUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [vistaActiva, setVistaActiva] = useState<'usuarios' | 'roles'>('usuarios');

  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [editingUsuarioId, setEditingUsuarioId] = useState<number | null>(null);
  const [usuarioFormData, setUsuarioFormData] = useState<Usuario>({
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    roleId: 1,
    sucursalId: 1,
    organizacionId: 1,
    fechaCreacion: new Date().toISOString().split('T')[0],
    cuil: '',
    telefono: '',
    posicionFiscal: 'monotributista'
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [roleFormData, setRoleFormData] = useState<Role>({
    id: 0,
    nombre: '',
    descripcion: '',
    permisos: []
  });

  const permisosPosibles = [
    'ver_usuarios',
    'crear_usuario',
    'editar_usuario',
    'borrar_usuario',
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
    'ver_stock',
    'editar_stock',
    'ver_vendedores',
    'ver_reportes',
    'crear_venta',
    'ver_mis_ventas',
    'solicitar_credito',
    'ver_mis_creditos',
    'consultar_productos'
  ];

  const getNombreRol = (roleId: number) => {
    return roles.find((r) => r.id === roleId)?.nombre || 'N/A';
  };

  const getNombreSucursal = (sucursalId?: number) => {
    if (!sucursalId) return 'N/A';
    return mockSucursales.find((s) => s.id === sucursalId)?.nombre || 'N/A';
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuarioId(usuario.id);
    setUsuarioFormData(usuario);
    setIsUsuarioModalOpen(true);
  };

  const handleDeleteUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const handleAddUsuario = () => {
    setEditingUsuarioId(null);
    setUsuarioFormData({
      id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      roleId: roles[0]?.id || 1,
      sucursalId: 1,
      organizacionId: 1,
      fechaCreacion: new Date().toISOString().split('T')[0],
      cuil: '',
      telefono: '',
      posicionFiscal: 'monotributista'
    });
    setIsUsuarioModalOpen(true);
  };

  const handleSubmitUsuario = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUsuarioId) {
      setUsuarios(usuarios.map((u) => (u.id === editingUsuarioId ? usuarioFormData : u)));
    } else {
      setUsuarios([...usuarios, usuarioFormData]);
    }

    setIsUsuarioModalOpen(false);
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleFormData(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (id: number) => {
    if (usuarios.some((u) => u.roleId === id)) {
      alert('No se puede eliminar un rol que está asignado a usuarios');
      return;
    }

    setRoles(roles.filter((r) => r.id !== id));
  };

  const handleAddRole = () => {
    setEditingRoleId(null);
    setRoleFormData({
      id: Math.max(...roles.map((r) => r.id), 0) + 1,
      nombre: '',
      descripcion: '',
      permisos: []
    });
    setIsRoleModalOpen(true);
  };

  const handleSubmitRole = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRoleId) {
      setRoles(roles.map((r) => (r.id === editingRoleId ? roleFormData : r)));
    } else {
      setRoles([...roles, roleFormData]);
    }

    setIsRoleModalOpen(false);
  };

  const togglePermiso = (permiso: string) => {
    if (roleFormData.permisos.includes(permiso)) {
      setRoleFormData({
        ...roleFormData,
        permisos: roleFormData.permisos.filter((p) => p !== permiso)
      });
      return;
    }

    setRoleFormData({
      ...roleFormData,
      permisos: [...roleFormData.permisos, permiso]
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      <div className="bg-white rounded-lg shadow-md p-2 inline-flex gap-2">
        <button
          type="button"
          onClick={() => setVistaActiva('usuarios')}
          className={`px-4 py-2 rounded font-semibold ${
            vistaActiva === 'usuarios' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Usuarios
        </button>
        <button
          type="button"
          onClick={() => setVistaActiva('roles')}
          className={`px-4 py-2 rounded font-semibold ${
            vistaActiva === 'roles' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Roles
        </button>
      </div>

      {vistaActiva === 'usuarios' ? (
        <CRUDTable
          title="Gestión de Usuarios"
          columns={[
            {
              key: 'nombre',
              label: 'Nombre Completo',
              render: (_, usuario) => `${usuario.nombre} ${usuario.apellido}`
            },
            { key: 'email', label: 'Email' },
            {
              key: 'roleId',
              label: 'Rol',
              render: (roleId) => getNombreRol(roleId)
            },
            {
              key: 'sucursalId',
              label: 'Sucursal',
              render: (sucursalId) => getNombreSucursal(sucursalId)
            },
            { key: 'cuil', label: 'CUIL' },
            { key: 'fechaCreacion', label: 'Fecha Creación' }
          ]}
          data={usuarios}
          onEdit={handleEditUsuario}
          onDelete={handleDeleteUsuario}
          onAdd={handleAddUsuario}
        />
      ) : (
        <CRUDTable
          title="Gestión de Roles"
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
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onAdd={handleAddRole}
        />
      )}

      <FormModal
        isOpen={isUsuarioModalOpen}
        title={editingUsuarioId ? 'Editar Usuario' : 'Nuevo Usuario'}
        onClose={() => setIsUsuarioModalOpen(false)}
        onSubmit={handleSubmitUsuario}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={usuarioFormData.nombre}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
            <input
              type="text"
              value={usuarioFormData.apellido}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, apellido: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={usuarioFormData.email}
            onChange={(e) => setUsuarioFormData({ ...usuarioFormData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            value={usuarioFormData.password}
            onChange={(e) => setUsuarioFormData({ ...usuarioFormData, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
          <select
            value={usuarioFormData.roleId}
            onChange={(e) => setUsuarioFormData({ ...usuarioFormData, roleId: parseInt(e.target.value, 10) })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre} - {rol.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sucursal</label>
          <select
            value={usuarioFormData.sucursalId || ''}
            onChange={(e) =>
              setUsuarioFormData({
                ...usuarioFormData,
                sucursalId: parseInt(e.target.value, 10)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {mockSucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CUIL</label>
            <input
              type="text"
              value={usuarioFormData.cuil}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, cuil: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={usuarioFormData.telefono}
              onChange={(e) => setUsuarioFormData({ ...usuarioFormData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Posición Fiscal</label>
          <select
            value={usuarioFormData.posicionFiscal}
            onChange={(e) =>
              setUsuarioFormData({
                ...usuarioFormData,
                posicionFiscal: e.target.value as Usuario['posicionFiscal']
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="monotributista">Monotributista</option>
            <option value="inscripto">Responsable Inscripto</option>
            <option value="consumidor_final">Consumidor Final</option>
          </select>
        </div>
      </FormModal>

      <FormModal
        isOpen={isRoleModalOpen}
        title={editingRoleId ? 'Editar Rol' : 'Nuevo Rol'}
        onClose={() => setIsRoleModalOpen(false)}
        onSubmit={handleSubmitRole}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del rol</label>
          <input
            type="text"
            value={roleFormData.nombre}
            onChange={(e) => setRoleFormData({ ...roleFormData, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea
            value={roleFormData.descripcion}
            onChange={(e) => setRoleFormData({ ...roleFormData, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Permisos</label>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
            {permisosPosibles.map((permiso) => (
              <label key={permiso} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                <input
                  type="checkbox"
                  checked={roleFormData.permisos.includes(permiso)}
                  onChange={() => togglePermiso(permiso)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{permiso}</span>
              </label>
            ))}
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminUsuarios;
