'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

const HubSpotBooking = () => {
  const [loadingState, setLoadingState] = useState<'loading' | 'error' | 'loaded'>('loading');
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoadError = () => {
    setLoadingState('error');
    toast({
      variant: 'destructive',
      title: 'Error al Cargar el Calendario',
      description: 'No se pudo cargar correctamente el calendario de reservas.',
      action: (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Reintentar
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            Abrir en Nueva Pestaña
          </Button>
        </div>
      ),
    });
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      // Si después de 10 segundos no ha cargado, mostrar error
      if (loadingState === 'loading') {
        handleLoadError();
      }
    }, 10000);

    return () => clearTimeout(loadingTimer);
  }, [loadingState]);

  const handleRetry = () => {
    setLoadingState('loading');
  };

  const handleOpenInNewTab = () => {
    window.open('https://meetings.hubspot.com/bioenneagramcoach', '_blank');
  };

  if (loadingState === 'error') {
    return (
      <div className="w-full max-w-lg mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Error al Cargar el Calendario
          </h2>
          <p className="mb-4 text-red-700">
            No se pudo cargar el calendario de reservas. Por favor, intenta nuevamente.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleRetry} variant="default">
              Reintentar
            </Button>
            <Button onClick={handleOpenInNewTab} variant="secondary">
              Abrir en Nueva Pestaña
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto h-screen min-h-screen relative">
        {loadingState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <p>Cargando calendario...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="https://meetings.hubspot.com/bioenneagramcoach"
          height="100%"
          width="100%"
          title="Agendar Cita"
          onLoad={() => setLoadingState('loaded')}
          onError={handleLoadError}
          className={loadingState === 'loading' ? 'opacity-50' : 'opacity-100'}
        />
      </div>
      <Toaster />
    </>
  );
};

export default HubSpotBooking;