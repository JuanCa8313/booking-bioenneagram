'use client'

import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página No Encontrada | BioEnneagramCoach',
  description: 'Lo sentimos, la página que estás buscando no existe o ha sido movida.',
  robots: {
    index: false,
    follow: false,
  }
}

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Página no encontrada
          </h2>
          <p className="text-gray-600 max-w-md">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido movida o eliminada.
          </p>
        </div>

        <button
          onClick={() => router.push('/book')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agendar Cita
        </button>
      </div>
    </div>
  );
};

export default NotFound;