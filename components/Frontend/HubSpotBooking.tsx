'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { headers } from 'next/headers'
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type LoadingState = 'loading' | 'error' | 'loaded';

const HUBSPOT_MEETING_URL = 'https://meetings.hubspot.com/bioenneagramcoach';
const LOADING_TIMEOUT = 10000; // 10 seconds

const HubSpotBooking = async () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout>();

  const nonce = (await headers()).get('x-nonce')!

  const handleRetry = useCallback(() => {
    setLoadingState('loading');
    if (iframeRef.current) {
      iframeRef.current.src = HUBSPOT_MEETING_URL;
    }
  }, []);

  const handleOpenInNewTab = useCallback(() => {
    window.open(HUBSPOT_MEETING_URL, '_blank', 'noopener,noreferrer');
  }, []);

  const handleLoadError = useCallback(() => {
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
  }, [toast, handleRetry, handleOpenInNewTab]);

  const handleLoad = useCallback(() => {
    setLoadingState('loaded');
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
  }, []);

  useEffect(() => {
    loadingTimerRef.current = setTimeout(() => {
      if (loadingState === 'loading') {
        handleLoadError();
      }
    }, LOADING_TIMEOUT);

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [loadingState, handleLoadError]);

  if (loadingState === 'error') {
    return (
      <Card className="w-full max-w-lg mx-auto p-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-600">
              Error al Cargar el Calendario
            </h2>
            <p className="text-sm text-gray-600">
              No se pudo cargar el calendario de reservas. Por favor, intenta nuevamente.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleRetry}
              variant="default"
              className="min-w-[120px]"
            >
              Reintentar
            </Button>
            <Button
              onClick={handleOpenInNewTab}
              variant="secondary"
              className="min-w-[120px]"
            >
              Abrir en Nueva Pestaña
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full">
      <div className="w-full max-w-4xl mx-auto h-screen min-h-[600px] relative">
        {loadingState === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-600 animate-pulse">
              Cargando calendario...
            </p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={HUBSPOT_MEETING_URL}
          height="100%"
          width="100%"
          title="Agendar Cita"
          onLoad={handleLoad}
          onError={handleLoadError}
          className={`w-full h-full transition-opacity duration-300 ${loadingState === 'loading' ? 'opacity-0' : 'opacity-100'
            }`}
          allow="camera; microphone; autoplay; clipboard-write; encrypted-media"
          nonce={nonce}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default HubSpotBooking;