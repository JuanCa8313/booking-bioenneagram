'use client';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import HubSpotBooking from '../HubSpotBooking';
import { usePageTracking } from '@/hooks/usePageTracking';
import type { FinalStepProps } from '@/types';

export const FinalStep = ({ title }: FinalStepProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Llamada a usePageTracking directamente dentro del componente
  usePageTracking('Bioenneagram Final Step Calendar', {
    path: isDialogOpen ? '/book/final-step/prior-payment-alert' : '/book/final-step',
  });

  const handleAccept = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <>
        {title && (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">{title}</CardTitle>
            </CardHeader>
          </Card>
        )}
        <HubSpotBooking />
      </>
      {isDialogOpen && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>‼️ Importante ‼️</AlertDialogTitle>
              <AlertDialogDescription>
                Recuerda que debes de escribirnos al {' '}<a
                  href="https://api.whatsapp.com/send?phone=573004481819&text=Hola%20%F0%9F%91%8B%2C%20deseo%20pagar%20una%20consulta%20que%20ya%20agend%C3%A9."
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >WhatsApp</a>{' '} ya que debes de pagar al menos el 50% de la consulta para que pueda ser aprobada. Si no se realiza el pago, faltando un día para la cita, esta será cancelada automáticamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleAccept}>Acepto</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
