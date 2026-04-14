import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Categoria } from '../types/index';
import { mockCategorias } from '../data/mockData';

interface CategoriasContextType {
  categorias: Categoria[];
  agregarCategoria: (c: Omit<Categoria, 'id'>) => void;
  editarCategoria: (c: Categoria) => void;
  eliminarCategoria: (id: number) => void;
}

const CategoriasContext = createContext<CategoriasContextType | undefined>(undefined);

export const CategoriasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias);

  const agregarCategoria = (c: Omit<Categoria, 'id'>) => {
    const newId = Math.max(...categorias.map((x) => x.id), 0) + 1;
    setCategorias((prev) => [...prev, { ...c, id: newId }]);
  };

  const editarCategoria = (c: Categoria) => {
    setCategorias((prev) => prev.map((x) => (x.id === c.id ? c : x)));
  };

  const eliminarCategoria = (id: number) => {
    setCategorias((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <CategoriasContext.Provider value={{ categorias, agregarCategoria, editarCategoria, eliminarCategoria }}>
      {children}
    </CategoriasContext.Provider>
  );
};

export const useCategorias = () => {
  const ctx = useContext(CategoriasContext);
  if (!ctx) throw new Error('useCategorias must be used within CategoriasProvider');
  return ctx;
};
