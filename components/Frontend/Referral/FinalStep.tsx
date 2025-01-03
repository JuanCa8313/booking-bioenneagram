'use client';
import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
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
                Queremos informarte con mucho cariño que, a partir de este año, para poder agendar tu cita con nosotros, será necesario realizar un depósito del 50% del valor de la sesión. Este paso lo podrás completar fácilmente escribiéndonos por el chat de {' '}<a
                  href="https://api.whatsapp.com/send?phone=573004481819&text=Hola%20%F0%9F%91%8B%2C%20deseo%20pagar%20una%20consulta%20que%20ya%20agend%C3%A9."
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >WhatsApp</a>{' '} una vez que elijas tu espacio.
                <br /><br />
                Esta medida nos permite organizar mejor nuestra agenda y asegurarte un servicio de calidad. Estamos aquí para acompañarte en tu proceso de transformación y desarrollo personal.
                <br /><br />
                ¡Gracias por tu confianza! 💙<br />
                Equipo BioEnneagram Coach
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
