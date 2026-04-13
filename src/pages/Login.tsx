import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsuarios, mockRoles } from '../data/mockData';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginByRole = (roleName: string) => {
    const role = mockRoles.find((r) => r.nombre.toLowerCase() === roleName.toLowerCase());
    const usuario = mockUsuarios.find((u) => u.roleId === role?.id);
    if (usuario) {
      login(usuario);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d4ed8,_#0f172a_55%)] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-white/30">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-slate-800 mb-1 tracking-tight">N&N</h1>
          <p className="text-slate-600">Punto de Venta Multisucursal</p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-700 font-semibold mb-6">
            Selecciona el rol para iniciar sesión:
          </p>

          {/* Admin */}
          <button
            type="button"
            onClick={() => handleLoginByRole('Admin')}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>👤</span>
            <p className="text-sm font-semibold">Administrador</p>
          </button>

          {/* Encargado */}
          <button
            type="button"
            onClick={() => handleLoginByRole('Encargado')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>👨‍💼</span>
            <p className="text-sm font-semibold">Encargado de Sucursal</p>
          </button>

          {/* Cajero */}
          <button
            type="button"
            onClick={() => handleLoginByRole('Cajero')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>🧾</span>
            <p className="text-sm font-semibold">Cajero</p>
          </button>

          {/* Vendedor */}
          <button
            type="button"
            onClick={() => handleLoginByRole('Vendedor')}
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💼</span>
            <p className="text-sm font-semibold">Vendedor</p>
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-100 border border-slate-200 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> Haz click en cualquier usuario para iniciar sesión
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
