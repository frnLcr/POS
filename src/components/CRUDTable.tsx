import React, { useState } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface CRUDTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const CRUDTable: React.FC<CRUDTableProps> = ({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg ring-1 ring-slate-200 p-6 md:p-7">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition shadow-sm"
        >
          ➕ Nuevo
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay registros disponibles
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-blue-50/40 transition">
                  {columns.map((col) => (
                    <td key={`${item.id}-${col.key}`} className="px-6 py-4 text-slate-700">
                      {col.render
                        ? col.render(item[col.key], item)
                        : String(item[col.key])}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label="Editar"
                      title="Editar"
                      className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(item.id)}
                      aria-label="Eliminar"
                      title="Eliminar"
                      className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition"
                    >
                      🗑️
                    </button>
                    </div>

                    {/* Confirmación de eliminación */}
                    {confirmDelete === item.id && (
                      <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
                          <p className="mb-5 font-semibold text-slate-800">
                            ¿Estás seguro de que deseas eliminar este registro?
                          </p>
                          <div className="flex gap-4 justify-end">
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(null)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(item.id);
                                setConfirmDelete(null);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CRUDTable;
