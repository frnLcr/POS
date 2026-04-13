import React, { useState } from 'react';
import FormModal from '../../components/FormModal';
import { SolicitudCredito } from '../../types/index';
import { mockClientes, mockCreditos } from '../../data/mockData';
import { formatearMoneda, validarTelefono } from '../../utils/calculosVenta';

const VendedorSolicitarCredito: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudCredito[]>([
    {
      id: 1,
      clienteId: 1,
      vendedorId: 4,
      sucursalId: 1,
      monto: 50000,
      estado: 'aprobado',
      montoAprobado: 50000,
      fechaSolicitud: '2025-04-05'
    },
    {
      id: 2,
      clienteId: 2,
      vendedorId: 4,
      sucursalId: 1,
      monto: 30000,
      estado: 'pendiente',
      fechaSolicitud: '2025-04-12'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validandoTelefono, setValidandoTelefono] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: 1,
    creditoId: 1,
    monto: 10000,
    motivo: ''
  });

  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simular validación de teléfono
    setValidandoTelefono(true);
    const cliente = mockClientes.find((c) => c.id === formData.clienteId);

    if (cliente?.telefono) {
      const resultado = await validarTelefono(cliente.telefono);
      setValidandoTelefono(false);

      if (resultado.valido) {
        const nuevaSolicitud: SolicitudCredito = {
          id: solicitudes.length + 1,
          clienteId: formData.clienteId,
          vendedorId: 4, // Usuario actual simulado
          sucursalId: 1,
          monto: formData.monto,
          estado: 'pendiente',
          fechaSolicitud: new Date().toISOString().split('T')[0]
        };

        setSolicitudes([...solicitudes, nuevaSolicitud]);
        setIsModalOpen(false);
        alert('Solicitud enviada. Operador: ' + resultado.operador);
      } else {
        alert('No se pudo validar el teléfono del cliente');
      }
    }
  };

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

  const totalSolicitado = solicitudes.reduce((sum, s) => sum + s.monto, 0);
  const aprobados = solicitudes.filter((s) => s.estado === 'aprobado').length;
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💰 Solicitar Crédito</h1>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">📊 Total Solicitado</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatearMoneda(totalSolicitado)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">✅ Aprobados</p>
          <p className="text-2xl font-bold text-green-600">{aprobados}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">⏳ Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{pendientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-semibold mb-2">🎁 Bonificación</p>
          <p className="text-2xl font-bold text-purple-600">
            {formatearMoneda(aprobados * (totalSolicitado * 0.03))}
          </p>
          <p className="text-xs text-gray-600 mt-1">3% por crédito</p>
        </div>
      </div>

      {/* Botón Nueva Solicitud */}
      <div className="mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition duration-200"
        >
          ➕ Nueva Solicitud
        </button>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Solicitudes</h2>

        {solicitudes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay solicitudes</p>
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
                    Monto Solicitado
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Monto Aprobado
                  </th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{solicitud.fechaSolicitud}</td>
                    <td className="px-6 py-4">
                      {getNombreCliente(solicitud.clienteId)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatearMoneda(solicitud.monto)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${getColorEstado(
                          solicitud.estado
                        )}`}
                      >
                        {solicitud.estado === 'pendiente'
                          ? '⏳ Pendiente'
                          : solicitud.estado === 'aprobado'
                            ? '✅ Aprobado'
                            : '❌ Rechazado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {solicitud.montoAprobado
                        ? formatearMoneda(solicitud.montoAprobado)
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Nueva Solicitud */}
      <FormModal
        isOpen={isModalOpen}
        title="Nueva Solicitud de Crédito"
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSolicitar}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cliente
          </label>
          <select
            value={formData.clienteId}
            onChange={(e) =>
              setFormData({
                ...formData,
                clienteId: parseInt(e.target.value)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {mockClientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Crédito
          </label>
          <select
            value={formData.creditoId}
            onChange={(e) =>
              setFormData({
                ...formData,
                creditoId: parseInt(e.target.value)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {mockCreditos.map((credito) => (
              <option key={credito.id} value={credito.id}>
                {credito.nombre} ({credito.tasaInteres}% TNA)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monto Solicitado ($)
          </label>
          <input
            type="number"
            step="1000"
            min="1000"
            value={formData.monto}
            onChange={(e) =>
              setFormData({
                ...formData,
                monto: parseFloat(e.target.value)
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Motivo
          </label>
          <textarea
            value={formData.motivo}
            onChange={(e) =>
              setFormData({
                ...formData,
                motivo: e.target.value
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows={3}
            required
          />
        </div>

        {validandoTelefono && (
          <div className="bg-blue-50 p-4 rounded text-center">
            <p className="text-blue-600 font-semibold">
              ⏳ Validando teléfono del cliente...
            </p>
          </div>
        )}
      </FormModal>
    </div>
  );
};

export default VendedorSolicitarCredito;
