"use client"
import { createContext, useContext } from 'react';

// Define el contexto con un valor inicial de null
const NonceContext = createContext<string | null>(null);

// Hook para usar el contexto
export const useNonce = () => {
  const context = useContext(NonceContext);
  if (context === undefined) {
    throw new Error('useNonce debe ser usado dentro de un NonceProvider');
  }
  return context;
};

// Proveedor para el contexto
interface NonceProviderProps {
  nonce: string;
  children: React.ReactNode;
}

export const NonceProvider = ({ nonce, children }: NonceProviderProps) => (
  <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
);