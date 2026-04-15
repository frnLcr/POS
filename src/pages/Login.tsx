import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsuarios } from '../data/mockData';

interface RoleCredentials {
  icon: string;
  label: string;
  email: string;
  password: string;
  buttonColor: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const roleCredentials: Record<string, RoleCredentials> = {
    admin: {
      icon: '👤',
      label: 'Administrador',
      email: 'admin@nn.com',
      password: 'admin123',
      buttonColor: 'bg-rose-600 hover:bg-rose-700'
    },
    encargado: {
      icon: '👨‍💼',
      label: 'Encargado de Sucursal',
      email: 'encargado@nn.com',
      password: 'encargado123',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    cajero: {
      icon: '🧾',
      label: 'Cajero',
      email: 'cajero@nn.com',
      password: 'cajero123',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
    },
    vendedor: {
      icon: '💼',
      label: 'Vendedor',
      email: 'vendedor@nn.com',
      password: 'vendedor123',
      buttonColor: 'bg-cyan-700 hover:bg-cyan-800'
    }
  };

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (roleKey: string) => {
    const creds = roleCredentials[roleKey];
    setSelectedRole(roleKey);
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const usuario = mockUsuarios.find((u) => u.email === email && u.password === password);
    if (usuario) {
      login(usuario);
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  if (selectedRole) {
    const creds = roleCredentials[selectedRole];
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d4ed8,_#0f172a_55%)] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-slate-800 mb-1 tracking-tight">N&N</h1>
            <p className="text-slate-600">Punto de Venta Multisucursal</p>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-center text-slate-700 font-semibold">
              <span className="text-2xl">{creds.icon}</span> {creds.label}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario / Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full ${creds.buttonColor} text-white font-semibold py-2.5 px-4 rounded-lg transition shadow-sm`}
            >
              Iniciar Sesión
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setSelectedRole(null);
              setEmail('');
              setPassword('');
            }}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Atrás
          </button>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <strong>Credenciales precargadas:</strong> Los campos ya tienen el usuario y contraseña por defecto
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => handleRoleSelect('admin')}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>👤</span>
            <p className="text-sm font-semibold">Administrador</p>
          </button>

          {/* Encargado */}
          <button
            type="button"
            onClick={() => handleRoleSelect('encargado')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>👨‍💼</span>
            <p className="text-sm font-semibold">Encargado de Sucursal</p>
          </button>

          {/* Cajero */}
          <button
            type="button"
            onClick={() => handleRoleSelect('cajero')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>🧾</span>
            <p className="text-sm font-semibold">Cajero</p>
          </button>

          {/* Vendedor */}
          <button
            type="button"
            onClick={() => handleRoleSelect('vendedor')}
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💼</span>
            <p className="text-sm font-semibold">Vendedor</p>
          </button>
        </div>

        <div className="mt-8 p-4 bg-slate-100 border border-slate-200 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> Haz click en cualquier rol para ingresar credenciales
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
