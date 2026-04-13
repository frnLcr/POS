import React, { ReactNode } from 'react';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitButtonText?: string;
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitButtonText = 'Guardar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-6 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none hover:text-blue-100 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5 bg-slate-50/70">
          {children}

          <div className="flex gap-3 justify-end pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2.5 px-6 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
