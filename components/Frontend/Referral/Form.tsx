"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { referralSchema, type ReferralErrors } from '@/lib/validations/referralSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { createReferral } from '@/app/actions/referral';

interface ReferralFormProps {
  onSuccess?: () => void;
  onSkip?: () => void;
}

export default function ReferralForm({ onSuccess, onSkip }: ReferralFormProps) {
  const [errors, setErrors] = useState<ReferralErrors>({});
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para indicar envío
  const [, setIsFormValid] = useState(false); // Estado para habilitar/deshabilitar el botón
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const validateForm = async () => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());
        const parseResult = referralSchema.safeParse({ ...data, termsAccepted });
        setIsFormValid(parseResult.success);
      }
    };

    validateForm();
  }, [termsAccepted]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      // Validación en el cliente
      const data = Object.fromEntries(formData.entries());
      const parseResult = referralSchema.safeParse({ ...data, termsAccepted });

      if (!parseResult.success) {
        const fieldErrors = parseResult.error.flatten().fieldErrors;
        setErrors({
          clientName: fieldErrors.clientName?.[0],
          clientEmail: fieldErrors.clientEmail?.[0],
          referrerEmail: fieldErrors.referrerEmail?.[0],
          referrerPhone: fieldErrors.referrerPhone?.[0],
          termsAccepted: fieldErrors.termsAccepted?.[0],
        });
        setIsSubmitting(false);
        return;
      }

      // Enviar al server action
      const result = await createReferral(formData);

      if (result.success) {
        setSuccess(true);
        setErrors({});
        onSuccess?.();
      } else {
        const generalError =
          Object.values(result.errors || {})
            .flat()
            .find((error) => error) || 'Error al procesar la solicitud';

        setErrors({ global: generalError });
      }
    }

    setIsSubmitting(false);
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
          <form onSubmit={onSubmit} className="space-y-6" ref={formRef}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">* Tu Nombre Completo *</Label>
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
                <Label htmlFor="clientEmail">* Tu Correo Electrónico *</Label>
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

              <div className="flex flex-col items-start space-x-2">
                <div className='flex items-start space-x-2'>
                  <Checkbox
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(!!checked)} // Convertimos a booleano explícito
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="termsAccepted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      * Acepto los{' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsDialog(true);
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        términos y condiciones
                      </a>
                      {' '}*
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Conoce la {' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsDialog(true);
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        tabla de reconocimientos y ganancias
                      </a>
                    </p>
                  </div>
                </div>

                {errors.termsAccepted && (
                  <p className="text-sm text-red-500 mt-1">{errors.termsAccepted}</p>
                )}
              </div>
            </div>

            {errors.global && (
              <Alert variant="destructive">
                <AlertDescription>{errors.global}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0 sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                className="w-8/12"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar información'}
              </Button>
              <Button
                type="button"
                className="w-8/12 bg-gray-300 hover:bg-gray-400"
                onClick={() => onSkip?.()}
              >
                Ir al calendario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Términos y Condiciones del Plan de Referidos</AlertDialogTitle>
          <AlertDialogDescription>
            Al enviar esta información, aceptas los términos y condiciones del plan de referidos. Puedes revisar los detalles a continuación:
          </AlertDialogDescription>
          <div className="space-y-2">
            <p>
              [Contenido de los Términos y Condiciones]
            </p>
          </div>
          <AlertDialogAction>
            <Button onClick={() => { setTermsAccepted(true); setShowTermsDialog(false); }}>Aceptar</Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}