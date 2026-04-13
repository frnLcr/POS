import React from 'react';
import { mockUsuarios } from '../../data/mockData';

const EncargadoVendedores: React.FC = () => {
  const vendedores = mockUsuarios.filter((u) => u.roleId === 4);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">👔 Gestión de Vendedores</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendedores.map((vendedor) => (
            <div key={vendedor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {vendedor.nombre} {vendedor.apellido}
                  </h3>
                  <p className="text-sm text-gray-600">{vendedor.email}</p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  Activo
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4 pb-4 border-b">
                <p>
                  <strong>CUIL:</strong> {vendedor.cuil}
                </p>
                <p>
                  <strong>Teléfono:</strong> {vendedor.telefono}
                </p>
                <p>
                  <strong>Posición Fiscal:</strong> {vendedor.posicionFiscal.replace(/_/g, ' ')}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Estadísticas del Mes</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-600">
                    Ventas: <span className="text-green-600">$0,00</span>
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    Comisión: <span className="text-green-600">$0,00</span>
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    Créditos: <span className="text-orange-600">0</span>
                  </p>
                </div>
              </div>

              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded transition">
                Ver Detalle
              </button>
            </div>
          ))}
        </div>

        {vendedores.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No hay vendedores asignados a esta sucursal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncargadoVendedores;
