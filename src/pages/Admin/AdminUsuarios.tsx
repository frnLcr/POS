import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Usuario } from '../../types/index';
import { mockUsuarios, mockRoles, mockSucursales } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const AdminUsuarios: React.FC = () => {
  const toast = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const roles = mockRoles;

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

  const [bajaModalId, setBajaModalId] = useState<number | null>(null);
  const [bajaForm, setBajaForm] = useState({ fechaBaja: new Date().toISOString().split('T')[0], motivoBaja: '' });

  const getNombreRol = (roleId: number) =>
    roles.find((r) => r.id === roleId)?.nombre || 'N/A';

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
    setBajaForm({ fechaBaja: new Date().toISOString().split('T')[0], motivoBaja: '' });
    setBajaModalId(id);
  };

  const confirmarBaja = () => {
    if (!bajaModalId) return;
    const u = usuarios.find((x) => x.id === bajaModalId);
    setUsuarios(usuarios.map((x) =>
      x.id === bajaModalId
        ? { ...x, fechaBaja: bajaForm.fechaBaja, motivoBaja: bajaForm.motivoBaja || undefined }
        : x
    ));
    toast.info(`${u?.nombre} ${u?.apellido} dado de baja`);
    setBajaModalId(null);
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
      toast.success('Usuario actualizado correctamente');
    } else {
      setUsuarios([...usuarios, usuarioFormData]);
      toast.success('Usuario creado correctamente');
    }
    setIsUsuarioModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-6">
      <CRUDTable
        title="Gestión de Usuarios"
        searchPlaceholder="Buscar por nombre, email, CUIL..."
        columns={[
          {
            key: 'nombre',
            label: 'Nombre Completo',
            render: (_, usuario) => (
              <span className="flex items-center gap-2">
                {usuario.nombre} {usuario.apellido}
                {usuario.fechaBaja && (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Baja
                  </span>
                )}
              </span>
            )
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
          { key: 'fechaCreacion', label: 'Alta' },
          {
            key: 'fechaBaja',
            label: 'Fecha Baja',
            render: (fechaBaja) => fechaBaja
              ? <span className="text-red-600 text-xs font-medium">{fechaBaja}</span>
              : <span className="text-gray-400 text-xs">—</span>
          }
        ]}
        data={usuarios}
        onEdit={handleEditUsuario}
        onDelete={handleDeleteUsuario}
        onAdd={handleAddUsuario}
        skipInternalConfirm
      />

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

        <div className="border-t-2 pt-4 space-y-4">
          <p className="text-sm font-bold text-red-600">Baja del usuario (opcional)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Baja</label>
              <input
                type="date"
                value={usuarioFormData.fechaBaja || ''}
                onChange={(e) =>
                  setUsuarioFormData({ ...usuarioFormData, fechaBaja: e.target.value || undefined })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo de Baja</label>
              <input
                type="text"
                value={usuarioFormData.motivoBaja || ''}
                onChange={(e) =>
                  setUsuarioFormData({ ...usuarioFormData, motivoBaja: e.target.value || undefined })
                }
                placeholder="Ej: Renuncia voluntaria"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-400"
              />
            </div>
          </div>
          {usuarioFormData.fechaBaja && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700">
              Este usuario quedará marcado como dado de baja el {usuarioFormData.fechaBaja}.
            </div>
          )}
        </div>
      </FormModal>

      {/* Modal baja lógica */}
      {bajaModalId !== null && (() => {
        const u = usuarios.find((x) => x.id === bajaModalId);
        return (
          <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Dar de baja usuario</h3>
              <p className="text-sm text-gray-500 mb-5">
                <strong>{u?.nombre} {u?.apellido}</strong> — el registro no se elimina, queda marcado como inactivo.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Baja</label>
                  <input
                    type="date"
                    value={bajaForm.fechaBaja}
                    onChange={(e) => setBajaForm({ ...bajaForm, fechaBaja: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Motivo de Baja</label>
                  <input
                    type="text"
                    value={bajaForm.motivoBaja}
                    onChange={(e) => setBajaForm({ ...bajaForm, motivoBaja: e.target.value })}
                    placeholder="Ej: Renuncia voluntaria, fin de contrato..."
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setBajaModalId(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarBaja}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Confirmar Baja
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminUsuarios;
