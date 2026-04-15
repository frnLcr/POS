import React, { useState } from 'react';
import { useNotificaciones } from '../../context/NotificacionesContext';
import { mockProductos } from '../../data/mockData';
import { Notificacion } from '../../types/index';

const tiposNotificacion: { value: Notificacion['tipo']; label: string }[] = [
  { value: 'oferta', label: 'Oferta / Descuento' },
  { value: 'nuevo_producto', label: 'Nuevo Producto' },
  { value: 'stock', label: 'Reposición de Stock' },
  { value: 'general', label: 'General' }
];

const AdminNotificaciones: React.FC = () => {
  const { notificaciones, agregarNotificacion } = useNotificaciones();

  const [form, setForm] = useState({
    titulo: '',
    mensaje: '',
    tipo: 'oferta' as Notificacion['tipo'],
    productoId: '' as string | number,
    comboId: '' as string | number
  });
  const [enviado, setEnviado] = useState(false);

  // Separar productos y combos
  const productos = mockProductos.filter((p) => !p.esCombo);
  const combos = mockProductos.filter((p) => p.esCombo);

  const handleProductoChange = (productoId: number | '') => {
    if (productoId === '') {
      setForm((f) => ({ ...f, productoId: '', comboId: '' }));
      return;
    }
    const p = mockProductos.find((p) => p.id === productoId);
    if (!p) return;
    setForm((f) => ({
      ...f,
      productoId,
      comboId: '',
      titulo: f.titulo || `${p.nombre} — ${p.descuento ? p.descuento + '% OFF' : 'Novedad'}`,
      mensaje: f.mensaje || `${p.nombre} de ${p.marca}. Precio: $${p.precio.toLocaleString('es-AR')}${p.descuento ? ` con ${p.descuento}% de descuento.` : '.'}`
    }));
  };

  const handleComboChange = (comboId: number | '') => {
    if (comboId === '') {
      setForm((f) => ({ ...f, comboId: '', productoId: '' }));
      return;
    }
    const c = mockProductos.find((p) => p.id === comboId);
    if (!c) return;
    setForm((f) => ({
      ...f,
      comboId,
      productoId: '',
      titulo: f.titulo || `${c.nombre} — ${c.descuento ? c.descuento + '% OFF' : 'Oferta Especial'}`,
      mensaje: f.mensaje || `${c.nombre}. Precio: $${c.precio.toLocaleString('es-AR')}${c.descuento ? ` con ${c.descuento}% de descuento.` : '.'}`
    }));
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    agregarNotificacion({
      titulo: form.titulo,
      mensaje: form.mensaje,
      tipo: form.tipo,
      productoId: form.productoId !== '' ? Number(form.productoId) : undefined,
      comboId: form.comboId !== '' ? Number(form.comboId) : undefined
    });
    setForm({ titulo: '', mensaje: '', tipo: 'oferta', productoId: '', comboId: '' });
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  const formatFecha = (iso: string) => {
    return new Date(iso).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const badgeColor: Record<Notificacion['tipo'], string> = {
    oferta: 'bg-green-100 text-green-800',
    nuevo_producto: 'bg-blue-100 text-blue-800',
    stock: 'bg-yellow-100 text-yellow-800',
    general: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black text-slate-800 mb-6">Gestión de Notificaciones</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4">Nueva Notificación</h2>

          {enviado && (
            <div className="mb-4 bg-green-50 border border-green-300 text-green-700 rounded p-3 text-sm font-semibold">
              ✅ Notificación enviada correctamente
            </div>
          )}

          <form onSubmit={handleEnviar} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as Notificacion['tipo'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {tiposNotificacion.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Producto (opcional)
              </label>
              <select
                value={form.productoId}
                onChange={(e) => handleProductoChange(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">— Sin producto —</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.descuento ? `(${p.descuento}% OFF)` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Combo (opcional)
              </label>
              <select
                value={form.comboId}
                onChange={(e) => handleComboChange(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">— Sin combo —</option>
                {combos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} {c.descuento ? `(${c.descuento}% OFF)` : ''} - ${c.precio.toLocaleString('es-AR')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ej: 15% OFF en Notebook Dell"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Detalle de la notificación..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded transition"
            >
              Enviar Notificación
            </button>
          </form>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4">Historial</h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notificaciones.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Sin notificaciones</p>
            ) : (
              notificaciones.map((n) => {
                const productoAsociado = n.productoId ? mockProductos.find((p) => p.id === n.productoId) : null;
                const comboAsociado = n.comboId ? mockProductos.find((c) => c.id === n.comboId) : null;
                
                return (
                  <div
                    key={n.id}
                    className="rounded-lg p-4 border border-gray-200 bg-white"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor[n.tipo]}`}>
                        {tiposNotificacion.find((t) => t.value === n.tipo)?.label}
                      </span>
                      {productoAsociado && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">
                          🛍️ Producto
                        </span>
                      )}
                      {comboAsociado && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                          📦 Combo
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm text-gray-800">{n.titulo}</p>
                    {(productoAsociado || comboAsociado) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {productoAsociado ? `Producto: ${productoAsociado.nombre}` : `Combo: ${comboAsociado?.nombre}`}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">{n.mensaje}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatFecha(n.fecha)}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificaciones;
