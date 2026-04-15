import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { usuario, role } = useAuth();
  const navigate = useNavigate();

  const getDashboardContent = () => {
    if (role === 'admin') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Panel Administrativo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Organizaciones"
              icon="🏢"
              description="Gestionar organizaciones del sistema"
              color="bg-blue-500"
              onClick={() => navigate('/admin/organizaciones')}
            />
            <DashboardCard
              title="Sucursales"
              icon="🏪"
              description="Administrar sucursales"
              color="bg-green-500"
              onClick={() => navigate('/admin/sucursales')}
            />
            <DashboardCard
              title="Usuarios"
              icon="👥"
              description="Gestionar usuarios y roles"
              color="bg-purple-500"
              onClick={() => navigate('/admin/usuarios')}
            />
            <DashboardCard
              title="Productos"
              icon="📦"
              description="Catálogo de productos"
              color="bg-orange-500"
              onClick={() => navigate('/admin/productos')}
            />
            <DashboardCard
              title="Rubros y Servicios"
              icon="📋"
              description="Configurar rubros y servicios"
              color="bg-red-500"
              onClick={() => navigate('/admin/rubros-servicios')}
            />
            <DashboardCard
              title="Créditos"
              icon="💳"
              description="Gestionar líneas de crédito"
              color="bg-indigo-500"
              onClick={() => navigate('/admin/creditos')}
            />
            <DashboardCard
              title="Categorías"
              icon="🏷️"
              description="Gestionar categorías de productos"
              color="bg-pink-500"
              onClick={() => navigate('/admin/categorias')}
            />
            <DashboardCard
              title="Roles y Permisos"
              icon="🔐"
              description="Administrar roles y permisos del sistema"
              color="bg-slate-600"
              onClick={() => navigate('/admin/roles')}
            />
            <DashboardCard
              title="Notificaciones"
              icon="🔔"
              description="Gestionar y enviar notificaciones"
              color="bg-yellow-500"
              onClick={() => navigate('/admin/notificaciones')}
            />
            <DashboardCard
              title="Clientes"
              icon="👤"
              description="Gestionar clientes del sistema"
              color="bg-teal-500"
              onClick={() => navigate('/clientes')}
            />
          </div>
        </div>
      );
    }

    if (role === 'encargado') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Panel del Encargado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Gestionar Stock"
              icon="📊"
              description="Control de inventario"
              color="bg-blue-500"
              onClick={() => navigate('/encargado/stock')}
            />
            <DashboardCard
              title="Vendedores"
              icon="👔"
              description="Gestionar vendedores de sucursal"
              color="bg-green-500"
              onClick={() => navigate('/encargado/vendedores')}
            />
            <DashboardCard
              title="Reportes"
              icon="📈"
              description="Analizar ventas y movimientos"
              color="bg-purple-500"
              onClick={() => navigate('/encargado/reportes')}
            />
            <DashboardCard
              title="Ventas"
              icon="💵"
              description="Ver ventas de la sucursal"
              color="bg-orange-500"
              onClick={() => navigate('/encargado/ventas')}
            />
            <DashboardCard
              title="Notificaciones"
              icon="🔔"
              description="Gestionar y enviar notificaciones"
              color="bg-yellow-500"
              onClick={() => navigate('/admin/notificaciones')}
            />
            <DashboardCard
              title="Clientes"
              icon="👤"
              description="Gestionar clientes del sistema"
              color="bg-teal-500"
              onClick={() => navigate('/clientes')}
            />
          </div>
        </div>
      );
    }

    if (role === 'cajero') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Panel del Cajero</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Nueva Venta"
              icon="🛒"
              description="Registrar ventas en el punto de venta"
              color="bg-green-500"
              onClick={() => navigate('/vendedor/ventas')}
            />
            <DashboardCard
              title="Mis Ventas"
              icon="📋"
              description="Historial de ventas realizadas"
              color="bg-blue-500"
              onClick={() => navigate('/vendedor/mis-ventas')}
            />
            <DashboardCard
              title="Consulta Productos"
              icon="🔎"
              description="Consultar stock y precios por código"
              color="bg-indigo-500"
              onClick={() => navigate('/vendedor/ventas')}
            />
          </div>
        </div>
      );
    }

    if (role === 'vendedor') {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Panel del Vendedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Nueva Venta"
              icon="🛒"
              description="Registrar una nueva venta"
              color="bg-green-500"
              onClick={() => navigate('/vendedor/ventas')}
            />
            <DashboardCard
              title="Mis Ventas"
              icon="📋"
              description="Historial de ventas realizadas"
              color="bg-blue-500"
              onClick={() => navigate('/vendedor/mis-ventas')}
            />
            <DashboardCard
              title="Solicitar Crédito"
              icon="💰"
              description="Solicitar crédito para cliente"
              color="bg-orange-500"
              onClick={() => navigate('/vendedor/solicitar-credito')}
            />
            <DashboardCard
              title="Mis Créditos"
              icon="📄"
              description="Ver estado de créditos"
              color="bg-purple-500"
              onClick={() => navigate('/vendedor/mis-creditos')}
            />
            <DashboardCard
              title="Clientes"
              icon="👤"
              description="Gestionar clientes del sistema"
              color="bg-teal-500"
              onClick={() => navigate('/clientes')}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 text-lg">
          Bienvenido, <span className="font-bold text-blue-600">{usuario?.nombre} {usuario?.apellido}</span>
        </p>
      </div>
      {getDashboardContent()}
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  icon: string;
  description: string;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  description,
  color,
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 text-left w-full"
    >
      <div className={`${color} rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
};

export default Dashboard;
