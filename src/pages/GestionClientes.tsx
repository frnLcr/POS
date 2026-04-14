import React, { useState } from 'react';
import CRUDTable from '../components/CRUDTable';
import FormModal from '../components/FormModal';
import { Cliente } from '../types/index';
import { mockClientes } from '../data/mockData';
import { useToast } from '../context/ToastContext';

const emptyCliente: Cliente = {
  id: 0,
  nombre: '',
  apellido: '',
  cuitCuil: '',
  razonSocial: '',
  email: '',
  telefono: '',
  posicionFiscal: 'consumidor_final',
  suscriptoNewsletter: false
};

const GestionClientes: React.FC = () => {
  const toast = useToast();
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Cliente>(emptyCliente);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyCliente, id: Math.max(...clientes.map((c) => c.id), 0) + 1 });
    setIsModalOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id);
    setFormData(cliente);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setClientes(clientes.filter((c) => c.id !== id));
    toast.info('Cliente eliminado');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Cliente = {
      ...formData,
      razonSocial: formData.posicionFiscal === 'consumidor_final' ? undefined : formData.razonSocial
    };
    if (editingId) {
      setClientes(clientes.map((c) => (c.id === editingId ? data : c)));
      toast.success('Cliente actualizado correctamente');
    } else {
      setClientes([...clientes, data]);
      toast.success('Cliente creado correctamente');
    }
    setIsModalOpen(false);
  };

  const posicionFiscalLabel: Record<Cliente['posicionFiscal'], string> = {
    responsable_inscripto: 'Resp. Inscripto',
    monotributista: 'Monotributista',
    consumidor_final: 'Consumidor Final'
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <CRUDTable
        title="Gestión de Clientes"
        columns={[
          { key: 'nombre', label: 'Nombre', render: (_, c) => `${c.nombre} ${c.apellido}` },
          { key: 'cuitCuil', label: 'CUIT / CUIL' },
          { key: 'razonSocial', label: 'Razón Social', render: (v) => v || '—' },
          { key: 'email', label: 'Email', render: (v) => v || '—' },
          { key: 'telefono', label: 'Teléfono', render: (v) => v || '—' },
          {
            key: 'posicionFiscal',
            label: 'Pos. Fiscal',
            render: (v) => posicionFiscalLabel[v as Cliente['posicionFiscal']]
          }
        ]}
        data={clientes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar cliente..."
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        {/* CUIT / CUIL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">CUIT / CUIL</label>
          <input
            type="text"
            value={formData.cuitCuil}
            onChange={(e) => setFormData({ ...formData, cuitCuil: e.target.value })}
            placeholder="20-12345678-9"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Condición frente al IVA */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Condición frente al IVA</label>
          <select
            value={formData.posicionFiscal}
            onChange={(e) => {
              const pf = e.target.value as Cliente['posicionFiscal'];
              setFormData({ ...formData, posicionFiscal: pf, razonSocial: pf === 'consumidor_final' ? '' : formData.razonSocial });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="consumidor_final">Consumidor Final</option>
            <option value="monotributista">Monotributista</option>
            <option value="responsable_inscripto">Responsable Inscripto</option>
          </select>
        </div>

        {/* Nombre / Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
            <input
              type="text"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Razón Social — bloqueada para consumidor final */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${formData.posicionFiscal === 'consumidor_final' ? 'text-gray-400' : 'text-gray-700'}`}>
            Razón Social
            {formData.posicionFiscal === 'consumidor_final' && (
              <span className="ml-2 text-xs font-normal text-gray-400">(no aplica para Consumidor Final)</span>
            )}
          </label>
          <input
            type="text"
            value={formData.razonSocial ?? ''}
            onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
            disabled={formData.posicionFiscal === 'consumidor_final'}
            className={`w-full px-4 py-2 border rounded transition ${
              formData.posicionFiscal === 'consumidor_final'
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 focus:outline-none focus:border-blue-500'
            }`}
            placeholder={formData.posicionFiscal === 'consumidor_final' ? '—' : 'Razón Social'}
          />
        </div>

        {/* Email / Teléfono */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email ?? ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono ?? ''}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Newsletter */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.suscriptoNewsletter ?? false}
            onChange={(e) => setFormData({ ...formData, suscriptoNewsletter: e.target.checked })}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm font-semibold text-gray-700">Suscripto a newsletter</span>
        </label>
      </FormModal>
    </div>
  );
};

export default GestionClientes;
