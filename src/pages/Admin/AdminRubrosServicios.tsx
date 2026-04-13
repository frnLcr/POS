import React, { useState } from 'react';
import CRUDTable from '../../components/CRUDTable';
import FormModal from '../../components/FormModal';
import { Rubro, Servicio } from '../../types/index';
import { mockRubros, mockServicios, mockCreditos } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const emptyRubro: Rubro = { id: 0, nombre: '', descripcion: '' };
const emptyServicio: Servicio = { id: 0, nombre: '', descripcion: '', creditoId: 0 };

const AdminRubrosServicios: React.FC = () => {
  const toast = useToast();
  const [vistaActiva, setVistaActiva] = useState<'rubros' | 'servicios'>('rubros');

  // ── Rubros ──────────────────────────────────────────────────
  const [rubros, setRubros] = useState<Rubro[]>(mockRubros);
  const [isRubroModalOpen, setIsRubroModalOpen] = useState(false);
  const [editingRubroId, setEditingRubroId] = useState<number | null>(null);
  const [rubroForm, setRubroForm] = useState<Rubro>(emptyRubro);

  const handleAddRubro = () => {
    setEditingRubroId(null);
    setRubroForm({ ...emptyRubro, id: Math.max(...rubros.map((r) => r.id), 0) + 1 });
    setIsRubroModalOpen(true);
  };

  const handleEditRubro = (rubro: Rubro) => {
    setEditingRubroId(rubro.id);
    setRubroForm(rubro);
    setIsRubroModalOpen(true);
  };

  const handleDeleteRubro = (id: number) => {
    setRubros(rubros.filter((r) => r.id !== id));
    toast.info('Rubro eliminado');
  };

  const handleSubmitRubro = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRubroId) {
      setRubros(rubros.map((r) => (r.id === editingRubroId ? rubroForm : r)));
      toast.success('Rubro actualizado correctamente');
    } else {
      setRubros([...rubros, rubroForm]);
      toast.success('Rubro creado correctamente');
    }
    setIsRubroModalOpen(false);
  };

  // ── Servicios ────────────────────────────────────────────────
  const [servicios, setServicios] = useState<Servicio[]>(mockServicios);
  const [isServicioModalOpen, setIsServicioModalOpen] = useState(false);
  const [editingServicioId, setEditingServicioId] = useState<number | null>(null);
  const [servicioForm, setServicioForm] = useState<Servicio>({
    ...emptyServicio,
    creditoId: mockCreditos[0]?.id ?? 0
  });

  const handleAddServicio = () => {
    setEditingServicioId(null);
    setServicioForm({
      ...emptyServicio,
      id: Math.max(...servicios.map((s) => s.id), 0) + 1,
      creditoId: mockCreditos[0]?.id ?? 0
    });
    setIsServicioModalOpen(true);
  };

  const handleEditServicio = (servicio: Servicio) => {
    setEditingServicioId(servicio.id);
    setServicioForm(servicio);
    setIsServicioModalOpen(true);
  };

  const handleDeleteServicio = (id: number) => {
    setServicios(servicios.filter((s) => s.id !== id));
    toast.info('Servicio eliminado');
  };

  const handleSubmitServicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServicioId) {
      setServicios(servicios.map((s) => (s.id === editingServicioId ? servicioForm : s)));
      toast.success('Servicio actualizado correctamente');
    } else {
      setServicios([...servicios, servicioForm]);
      toast.success('Servicio creado correctamente');
    }
    setIsServicioModalOpen(false);
  };

  const getNombreCredito = (creditoId: number) =>
    mockCreditos.find((c) => c.id === creditoId)?.nombre ?? 'Sin asignar';

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setVistaActiva('rubros')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
            vistaActiva === 'rubros'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Rubros
        </button>
        <button
          onClick={() => setVistaActiva('servicios')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
            vistaActiva === 'servicios'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Servicios
        </button>
      </div>

      {/* ── Tab: Rubros ── */}
      {vistaActiva === 'rubros' && (
        <>
          <CRUDTable
            title="Gestión de Rubros"
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'descripcion', label: 'Descripción' }
            ]}
            data={rubros}
            onAdd={handleAddRubro}
            onEdit={handleEditRubro}
            onDelete={handleDeleteRubro}
            searchPlaceholder="Buscar rubro..."
          />

          <FormModal
            isOpen={isRubroModalOpen}
            title={editingRubroId ? 'Editar Rubro' : 'Nuevo Rubro'}
            onClose={() => setIsRubroModalOpen(false)}
            onSubmit={handleSubmitRubro}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={rubroForm.nombre}
                onChange={(e) => setRubroForm({ ...rubroForm, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea
                value={rubroForm.descripcion}
                onChange={(e) => setRubroForm({ ...rubroForm, descripcion: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </FormModal>
        </>
      )}

      {/* ── Tab: Servicios ── */}
      {vistaActiva === 'servicios' && (
        <>
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
            onAdd={handleAddServicio}
            onEdit={handleEditServicio}
            onDelete={handleDeleteServicio}
            searchPlaceholder="Buscar servicio..."
          />

          <FormModal
            isOpen={isServicioModalOpen}
            title={editingServicioId ? 'Editar Servicio' : 'Nuevo Servicio'}
            onClose={() => setIsServicioModalOpen(false)}
            onSubmit={handleSubmitServicio}
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
        </>
      )}
    </div>
  );
};

export default AdminRubrosServicios;
