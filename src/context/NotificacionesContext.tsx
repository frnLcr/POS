import React, { createContext, useContext, useState } from 'react';
import { Notificacion, NotificacionesContextType } from '../types/index';

const NotificacionesContext = createContext<NotificacionesContextType | null>(null);

const mockNotificacionesIniciales: Notificacion[] = [
  {
    id: 1,
    titulo: '15% OFF en Notebook Dell',
    mensaje: 'Notebook Dell Inspiron 15 con 15% de descuento por tiempo limitado.',
    productoId: 1,
    fecha: new Date().toISOString(),
    leida: false,
    tipo: 'oferta'
  },
  {
    id: 2,
    titulo: '10% OFF en Tablet Samsung',
    mensaje: 'Tablet Samsung Galaxy Tab con 10% de descuento esta semana.',
    productoId: 2,
    fecha: new Date().toISOString(),
    leida: false,
    tipo: 'oferta'
  }
];

export const NotificacionesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(mockNotificacionesIniciales);

  const agregarNotificacion = (n: Omit<Notificacion, 'id' | 'fecha' | 'leida'>) => {
    const nueva: Notificacion = {
      ...n,
      id: Date.now(),
      fecha: new Date().toISOString(),
      leida: false
    };
    setNotificaciones((prev) => [nueva, ...prev]);

    // Enviar browser notification si hay permiso
    if (Notification.permission === 'granted') {
      new Notification(nueva.titulo, { body: nueva.mensaje, icon: '/favicon.ico' });
    }
  };

  const marcarLeida = (id: number) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const marcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <NotificacionesContext.Provider
      value={{ notificaciones, agregarNotificacion, marcarLeida, marcarTodasLeidas, noLeidas }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
};

export const useNotificaciones = () => {
  const ctx = useContext(NotificacionesContext);
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider');
  return ctx;
};
