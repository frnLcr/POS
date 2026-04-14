import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificacionesProvider } from './context/NotificacionesContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Admin Pages
import AdminOrganizaciones from './pages/Admin/AdminOrganizaciones';
import AdminSucursales from './pages/Admin/AdminSucursales';
import AdminUsuarios from './pages/Admin/AdminUsuarios';
import AdminRubrosServicios from './pages/Admin/AdminRubrosServicios';
import AdminProductos from './pages/Admin/AdminProductos';
import AdminCreditos from './pages/Admin/AdminCreditos';
import AdminNotificaciones from './pages/Admin/AdminNotificaciones';
import AdminRoles from './pages/Admin/AdminRoles';

import GestionClientes from './pages/GestionClientes';

// Encargado Pages
import EncargadoStock from './pages/Encargado/EncargadoStock';
import EncargadoVendedores from './pages/Encargado/EncargadoVendedores';
import EncargadoReportes from './pages/Encargado/EncargadoReportes';

// Vendedor Pages
import VendedorVentas from './pages/Vendedor/VendedorVentas';
import VendedorMisVentas from './pages/Vendedor/VendedorMisVentas';
import VendedorSolicitarCredito from './pages/Vendedor/VendedorSolicitarCredito';
import VendedorMisCreditos from './pages/Vendedor/VendedorMisCreditos';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requiredRoles }) => {
  const { usuario, role } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRoles && (!role || !requiredRoles.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificacionesProvider>
        <ToastProvider>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/organizaciones"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminOrganizaciones />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/sucursales"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminSucursales />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminUsuarios />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/rubros-servicios"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminRubrosServicios />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminProductos />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/admin/creditos"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminCreditos />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Encargado Routes */}
          <Route
            path="/encargado/stock"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="encargado">
                  <EncargadoStock />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/encargado/vendedores"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="encargado">
                  <EncargadoVendedores />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/encargado/reportes"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="encargado">
                  <EncargadoReportes />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Vendedor Routes */}
          <Route
            path="/vendedor/ventas"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="cajero">
                  <VendedorVentas />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/vendedor/mis-ventas"
            element={
              <AppLayout>
                <ProtectedRoute requiredRoles={["vendedor", "cajero"]}>
                  <VendedorMisVentas />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/vendedor/solicitar-credito"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="vendedor">
                  <VendedorSolicitarCredito />
                </ProtectedRoute>
              </AppLayout>
            }
          />
          <Route
            path="/vendedor/mis-creditos"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="vendedor">
                  <VendedorMisCreditos />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Admin - Roles */}
          <Route
            path="/admin/roles"
            element={
              <AppLayout>
                <ProtectedRoute requiredRole="admin">
                  <AdminRoles />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Admin/Encargado - Notificaciones */}
          <Route
            path="/admin/notificaciones"
            element={
              <AppLayout>
                <ProtectedRoute requiredRoles={['admin', 'encargado']}>
                  <AdminNotificaciones />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Clientes - admin y vendedor */}
          <Route
            path="/clientes"
            element={
              <AppLayout>
                <ProtectedRoute requiredRoles={['admin', 'encargado', 'vendedor', 'cajero']}>
                  <GestionClientes />
                </ProtectedRoute>
              </AppLayout>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </ToastProvider>
        </NotificacionesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
