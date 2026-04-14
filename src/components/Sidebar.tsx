import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  // Admin
  {
    label: 'Organizaciones',
    path: '/admin/organizaciones',
    icon: '🏢',
    roles: ['admin']
  },
  {
    label: 'Sucursales',
    path: '/admin/sucursales',
    icon: '🏪',
    roles: ['admin']
  },
  {
    label: 'Usuarios',
    path: '/admin/usuarios',
    icon: '👥',
    roles: ['admin']
  },
  {
    label: 'Rubros y Servicios',
    path: '/admin/rubros-servicios',
    icon: '📋',
    roles: ['admin']
  },
  {
    label: 'Productos',
    path: '/admin/productos',
    icon: '📦',
    roles: ['admin']
  },
  {
    label: 'Créditos',
    path: '/admin/creditos',
    icon: '💳',
    roles: ['admin']
  },
  {
    label: 'Categorías',
    path: '/admin/categorias',
    icon: '🏷️',
    roles: ['admin']
  },
  {
    label: 'Roles y Permisos',
    path: '/admin/roles',
    icon: '🔐',
    roles: ['admin']
  },
  {
    label: 'Notificaciones',
    path: '/admin/notificaciones',
    icon: '🔔',
    roles: ['admin', 'encargado']
  },

  // Encargado
  {
    label: 'Gestionar Stock',
    path: '/encargado/stock',
    icon: '📊',
    roles: ['encargado']
  },
  {
    label: 'Gestionar Vendedores',
    path: '/encargado/vendedores',
    icon: '👔',
    roles: ['encargado']
  },
  {
    label: 'Reportes',
    path: '/encargado/reportes',
    icon: '📈',
    roles: ['encargado']
  },

  // Encargado
  {
    label: 'Ventas',
    path: '/encargado/ventas',
    icon: '📈',
    roles: ['encargado']
  },

  // Cajero
  {
    label: 'Nueva Venta',
    path: '/vendedor/ventas',
    icon: '🛒',
    roles: ['cajero']
  },

  // Vendedor
  {
    label: 'Mis Ventas',
    path: '/vendedor/mis-ventas',
    icon: '📋',
    roles: ['vendedor']
  },

  // Clientes (admin + encargado + vendedor + cajero)
  {
    label: 'Clientes',
    path: '/clientes',
    icon: '👤',
    roles: ['admin', 'encargado', 'vendedor', 'cajero']
  },

  // Vendedor
  {
    label: 'Solicitar Crédito',
    path: '/vendedor/solicitar-credito',
    icon: '💰',
    roles: ['vendedor']
  },
  {
    label: 'Mis Créditos',
    path: '/vendedor/mis-creditos',
    icon: '📄',
    roles: ['vendedor']
  }
];

const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();

  const filteredItems = menuItems.filter((item) =>
    role && item.roles.includes(role)
  );

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen shadow-2xl border-r border-slate-700/60">
      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-2.5 rounded-xl bg-slate-700/30 hover:bg-slate-700/60 transition mb-4 font-semibold"
        >
          📊 Dashboard
        </Link>

        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 rounded-xl transition ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-slate-100 hover:bg-slate-700/60'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
