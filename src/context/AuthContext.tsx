import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, AuthContextType, RoleType } from '../types/index';
import { mockRoles } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [role, setRole] = useState<RoleType | null>(null);

  const login = (usuarioData: Usuario) => {
    setUsuario(usuarioData);
    const rolData = mockRoles.find((r) => r.id === usuarioData.roleId);
    if (rolData?.nombre === 'Admin') {
      setRole('admin');
    } else if (rolData?.nombre === 'Encargado') {
      setRole('encargado');
    } else if (rolData?.nombre === 'Cajero') {
      setRole('cajero');
    } else if (rolData?.nombre === 'Vendedor') {
      setRole('vendedor');
    }
  };

  const logout = () => {
    setUsuario(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
