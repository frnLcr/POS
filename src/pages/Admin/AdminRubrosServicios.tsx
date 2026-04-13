import React, { useState } from 'react';
import { Organizacion } from '../../types/index';
import { mockOrganizaciones } from '../../data/mockData';

const AdminRubrosServicios: React.FC = () => {
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>(mockOrganizaciones);
  const [selectedOrgId, setSelectedOrgId] = useState<number>(1);
  const [newRubro, setNewRubro] = useState('');
  const [newServicio, setNewServicio] = useState('');

  const selectedOrg = organizaciones.find((o) => o.id === selectedOrgId);

  const addRubro = () => {
    if (newRubro.trim()) {
      setOrganizaciones(
        organizaciones.map((org) =>
          org.id === selectedOrgId
            ? { ...org, rubros: [...org.rubros, newRubro] }
            : org
        )
      );
      setNewRubro('');
    }
  };

  const addServicio = () => {
    if (newServicio.trim()) {
      setOrganizaciones(
        organizaciones.map((org) =>
          org.id === selectedOrgId
            ? { ...org, servicios: [...org.servicios, newServicio] }
            : org
        )
      );
      setNewServicio('');
    }
  };

  const removeRubro = (rubro: string) => {
    setOrganizaciones(
      organizaciones.map((org) =>
        org.id === selectedOrgId
          ? { ...org, rubros: org.rubros.filter((r) => r !== rubro) }
          : org
      )
    );
  };

  const removeServicio = (servicio: string) => {
    setOrganizaciones(
      organizaciones.map((org) =>
        org.id === selectedOrgId
          ? { ...org, servicios: org.servicios.filter((s) => s !== servicio) }
          : org
      )
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Gestión de Rubros y Servicios
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Seleccionar Organización
          </label>
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(parseInt(e.target.value))}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {organizaciones.map((org) => (
              <option key={org.id} value={org.id}>
                {org.nombre}
              </option>
            ))}
          </select>
        </div>

        {selectedOrg && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rubros */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Rubros</h3>

              <div className="mb-6 p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  Rubros disponibles para <strong>{selectedOrg.nombre}</strong>:
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {selectedOrg.rubros.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay rubros registrados</p>
                ) : (
                  selectedOrg.rubros.map((rubro) => (
                    <div
                      key={rubro}
                      className="flex justify-between items-center bg-gray-100 p-3 rounded"
                    >
                      <span className="text-gray-800">{rubro}</span>
                      <button
                        onClick={() => removeRubro(rubro)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        🗑️ Quitar
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRubro}
                  onChange={(e) => setNewRubro(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRubro()}
                  placeholder="Nuevo rubro..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addRubro}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded transition"
                >
                  ➕ Agregar
                </button>
              </div>
            </div>

            {/* Servicios */}
            <div className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 Servicios</h3>

              <div className="mb-6 p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  Servicios disponibles para <strong>{selectedOrg.nombre}</strong>:
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {selectedOrg.servicios.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay servicios registrados</p>
                ) : (
                  selectedOrg.servicios.map((servicio) => (
                    <div
                      key={servicio}
                      className="flex justify-between items-center bg-gray-100 p-3 rounded"
                    >
                      <span className="text-gray-800">{servicio}</span>
                      <button
                        onClick={() => removeServicio(servicio)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        🗑️ Quitar
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServicio}
                  onChange={(e) => setNewServicio(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addServicio()}
                  placeholder="Nuevo servicio..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addServicio}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded transition"
                >
                  ➕ Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRubrosServicios;
