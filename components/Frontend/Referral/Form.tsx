import React, { useState } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { createReferral } from '@/app/actions/referral';

interface ReferralFormProps {
  onSuccess?: () => void;
}

// Esquema de validación usando Zod
const referralSchema = z.object({
  clientName: z.string().min(1, 'El nombre completo es obligatorio'),
  clientEmail: z.string().email('El correo no es válido'),
  referrerEmail: z.string().email('El correo no es válido').optional(),
  referrerPhone: z.string().optional(),
});

// Tipo para los errores basado en el esquema de Zod
type ReferralErrors = Partial<Record<keyof z.infer<typeof referralSchema> | 'global', string>>;

export default function ReferralForm({ onSuccess }: ReferralFormProps) {
  const [errors, setErrors] = useState<ReferralErrors>({});
  const [success, setSuccess] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    // Extrayendo los valores para validarlos con Zod
    const data = {
      clientName: formData.get('clientName') as string,
      clientEmail: formData.get('clientEmail') as string,
      referrerEmail: formData.get('referrerEmail') as string,
      referrerPhone: formData.get('referrerPhone') as string,
    };

    // Validación con Zod
    const parseResult = referralSchema.safeParse(data);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      setErrors({
        clientName: fieldErrors.clientName?.[0],
        clientEmail: fieldErrors.clientEmail?.[0],
        referrerEmail: fieldErrors.referrerEmail?.[0],
        referrerPhone: fieldErrors.referrerPhone?.[0],
      });
      return;
    }

    // Llamada a la función asincrónica
    const result = await createReferral(formData);
    if (!result.success) {
      setErrors({ global: result.errors!.global || 'Error al procesar la solicitud' });
      return;
    }

    // Mostrar diálogo de términos y condiciones
    setShowTermsDialog(true);
  }

  async function handleTermsAccept() {
    setShowTermsDialog(false);

    // Llamada a la función asincrónica
    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
    const result = await createReferral(formData);
    if (!result.success) {
      setErrors({ global: result.errors!.global || 'Error al procesar la solicitud' });
      return;
    }

    setSuccess(true);
    setErrors({});
    onSuccess?.();
  }

  if (success) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6">
          <Alert className="bg-green-50">
            <AlertDescription>
              ¡Gracias! Tu información ha sido registrada exitosamente.
              El calendario de citas aparecerá a continuación.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Información de Referido</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Tu Nombre Completo *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  placeholder="Ej: Juan Pérez"
                  className={errors.clientName ? 'border-red-500' : ''}
                />
                {errors.clientName && (
                  <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="clientEmail">Tu Correo Electrónico *</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  placeholder="Ej: cliente@email.com"
                  className={errors.clientEmail ? 'border-red-500' : ''}
                />
                {errors.clientEmail && (
                  <p className="text-sm text-red-500 mt-1">{errors.clientEmail}</p>
                )}
              </div>

              <div>
                <Label htmlFor="referrerEmail">Correo de quien te refirió</Label>
                <Input
                  id="referrerEmail"
                  name="referrerEmail"
                  type="email"
                  placeholder="Ej: referidor@email.com"
                  className={errors.referrerEmail ? 'border-red-500' : ''}
                />
                {errors.referrerEmail && (
                  <p className="text-sm text-red-500 mt-1">{errors.referrerEmail}</p>
                )}
              </div>

              <div>
                <Label htmlFor="referrerPhone">Teléfono de quien te refirió</Label>
                <Input
                  id="referrerPhone"
                  name="referrerPhone"
                  type="tel"
                  placeholder="Ej: +1234567890"
                  className={errors.referrerPhone ? 'border-red-500' : ''}
                />
                {errors.referrerPhone && (
                  <p className="text-sm text-red-500 mt-1">{errors.referrerPhone}</p>
                )}
              </div>
            </div>

            {errors.global && (
              <Alert variant="destructive">
                <AlertDescription>{errors.global}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">Enviar información</Button>
          </form>
        </CardContent>
      </Card>
      {/* Terms and Conditions Dialog */}
      <AlertDialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Términos y Condiciones del Plan de Referidos</AlertDialogTitle>
          <AlertDialogDescription>
            Al enviar esta información, aceptas los términos y condiciones del plan de referidos. Puedes revisar los detalles en el siguiente documento:
          </AlertDialogDescription>
          <div className="space-y-2">
            <p>
              <a href="/referral-terms.pdf" className="text-blue-500 hover:underline">
                Documento de Términos y Condiciones
              </a>
            </p>
            <p>
              <a href="/referral-rewards.pdf" className="text-blue-500 hover:underline">
                Tabla de Reconocimientos y Ganancias
              </a>
            </p>
          </div>
          <AlertDialogAction>
            <Button onClick={handleTermsAccept}>Aceptar y Enviar</Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}