import React, { useState } from 'react';
import { SolicitudCredito } from '../../types/index';
import { mockClientes } from '../../data/mockData';
import { formatearMoneda } from '../../utils/calculosVenta';

const VendedorMisCreditos: React.FC = () => {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudCredito | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Créditos simulados del vendedor
  const [creditos] = useState<(SolicitudCredito & { numeroContrato?: string })[]>([
    {
      id: 1,
      clienteId: 1,
      vendedorId: 4,
      sucursalId: 1,
      monto: 50000,
      estado: 'aprobado',
      montoAprobado: 50000,
      fechaSolicitud: '2025-04-05',
      numeroContrato: 'CTR-2025-0001'
    },
    {
      id: 2,
      clienteId: 2,
      vendedorId: 4,
      sucursalId: 1,
      monto: 30000,
      estado: 'pendiente',
      fechaSolicitud: '2025-04-12'
    },
    {
      id: 3,
      clienteId: 3,
      vendedorId: 4,
      sucursalId: 1,
      monto: 25000,
      estado: 'rechazado',
      fechaSolicitud: '2025-04-08'
    }
  ]);

  const getNombreCliente = (clienteId: number) => {
    const cliente = mockClientes.find((c) => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'N/A';
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '⏳';
      case 'aprobado':
        return '✅';
      case 'rechazado':
        return '❌';
      default:
        return '❓';
    }
  };

  const estadisticas = {
    totalSolicitado: creditos.reduce((sum, c) => sum + c.monto, 0),
    totalAprobado: creditos
      .filter((c) => c.estado === 'aprobado')
      .reduce((sum, c) => sum + (c.montoAprobado || 0), 0),
    aprobados: creditos.filter((c) => c.estado === 'aprobado').length,
    pendientes: creditos.filter((c) => c.estado === 'pendiente').length,
    rechazados: creditos.filter((c) => c.estado === 'rechazado').length
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📄 Mis Créditos</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-xs font-semibold mb-1">Total Solicitado</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatearMoneda(estadisticas.totalSolicitado)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-xs font-semibold mb-1">Total Aprobado</p>
          <p className="text-2xl font-bold text-green-600">
            {formatearMoneda(estadisticas.totalAprobado)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-xs font-semibold mb-1">Aprobados</p>
          <p className="text-2xl font-bold text-green-600">
            {estadisticas.aprobados}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-xs font-semibold mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {estadisticas.pendientes}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-xs font-semibold mb-1">Rechazados</p>
          <p className="text-2xl font-bold text-red-600">
            {estadisticas.rechazados}
          </p>
        </div>
      </div>

      {/* Tabla de Créditos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Créditos</h2>

        {creditos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay créditos solicitados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Aprobado
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {creditos.map((credito) => (
                  <tr key={credito.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">{credito.fechaSolicitud}</td>
                    <td className="px-6 py-4">
                      {getNombreCliente(credito.clienteId)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatearMoneda(credito.monto)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${getColorEstado(
                          credito.estado
                        )}`}
                      >
                        {getIconoEstado(credito.estado)} {credito.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {credito.montoAprobado
                        ? formatearMoneda(credito.montoAprobado)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSolicitudSeleccionada(credito);
                          setMostrarDetalles(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        👁️ Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detalles */}
      {mostrarDetalles && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Detalles del Crédito</h2>
              <button
                onClick={() => setMostrarDetalles(false)}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">Cliente</p>
                <p className="text-lg font-bold">
                  {getNombreCliente(solicitudSeleccionada.clienteId)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold">Fecha Solicitud</p>
                <p className="text-lg font-bold">
                  {solicitudSeleccionada.fechaSolicitud}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Solicitado</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatearMoneda(solicitudSeleccionada.monto)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Aprobado</p>
                  <p className="text-lg font-bold text-green-600">
                    {solicitudSeleccionada.montoAprobado
                      ? formatearMoneda(solicitudSeleccionada.montoAprobado)
                      : '-'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold">Estado</p>
                <p className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${getColorEstado(solicitudSeleccionada.estado)}`}>
                  {getIconoEstado(solicitudSeleccionada.estado)}{' '}
                  {solicitudSeleccionada.estado.toUpperCase()}
                </p>
              </div>

              {(solicitudSeleccionada as any).numeroContrato && (
                <div>
                  <p className="text-xs text-gray-600 font-semibold">
                    N° Contrato
                  </p>
                  <p className="text-lg font-mono font-bold text-purple-600">
                    {(solicitudSeleccionada as any).numeroContrato}
                  </p>
                </div>
              )}

              {solicitudSeleccionada.estado === 'aprobado' && (
                <div className="bg-green-50 border border-green-300 rounded p-4">
                  <p className="text-sm font-semibold text-green-800">
                    ✅ Crédito aprobado y disponible
                  </p>
                </div>
              )}

              {solicitudSeleccionada.estado === 'pendiente' && (
                <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                  <p className="text-sm font-semibold text-yellow-800">
                    ⏳ Pendiente de validación
                  </p>
                </div>
              )}

              {solicitudSeleccionada.estado === 'rechazado' && (
                <div className="bg-red-50 border border-red-300 rounded p-4">
                  <p className="text-sm font-semibold text-red-800">
                    ❌ Crédito rechazado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendedorMisCreditos;
