import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { usuario, logout, role } = useAuth();
  const navigate = useNavigate();

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
