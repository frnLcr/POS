import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotificaciones } from '../context/NotificacionesContext';

const Navbar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas } = useNotificaciones();
  const [campanaAbierta, setCampanaAbierta] = useState(false);

  const getNombreRol = (roleId?: number) => {
    if (roleId === 1) return 'Administrador';
    if (roleId === 2) return 'Encargado';
    if (roleId === 3) return 'Cajero';
    if (roleId === 4) return 'Vendedor';
    return 'Sin rol';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white shadow-xl border-b border-slate-700">
      <div className="px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight">N&N</h1>
          <span className="text-slate-300 text-sm md:text-base">Sistema Punto de Venta</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Campana de notificaciones */}
          <div className="relative">
            <button
              onClick={() => setCampanaAbierta(!campanaAbierta)}
              className="relative p-2 rounded-lg hover:bg-slate-700 transition"
              title="Notificaciones"
            >
              <span className="text-xl">🔔</span>
              {noLeidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {noLeidas > 9 ? '9+' : noLeidas}
                </span>
              )}
            </button>

            {campanaAbierta && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 text-gray-800">
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <p className="font-bold text-sm">Notificaciones</p>
                  {noLeidas > 0 && (
                    <button
                      onClick={marcarTodasLeidas}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y">
                  {notificaciones.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">Sin notificaciones</p>
                  ) : (
                    notificaciones.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 ${n.leida ? 'bg-white' : 'bg-blue-50'}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-xs text-gray-800">{n.titulo}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.mensaje}</p>
                          </div>
                          {!n.leida && (
                            <button
                              onClick={() => marcarLeida(n.id)}
                              className="text-xs text-gray-400 hover:text-blue-600 shrink-0 mt-0.5"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t text-center">
                  <button
                    onClick={() => { navigate('/admin/notificaciones'); setCampanaAbierta(false); }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Ver todas las notificaciones →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-right hidden md:block">
            <p className="font-semibold text-white">{usuario?.nombre} {usuario?.apellido}</p>
            <p className="text-blue-200 text-xs uppercase tracking-wide">
              {getNombreRol(usuario?.roleId)}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
