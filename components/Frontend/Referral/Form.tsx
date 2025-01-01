"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { referralSchema, type ReferralErrors } from '@/lib/validations/referralSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { createReferral } from '@/app/actions/referral';
import { Analytics, segmentAnalytics } from '@/lib/segment-analytics';

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
  const [showRewardsDialog, setShowRewardsDialog] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      segmentAnalytics.page('Book Page', {
        content_name: 'Bioenneagram Referral Form',
        title: 'Bioenneagram Referral Form',
        page_title: 'Bioenneagram Referral Form',
        page_path: '/book/referral-form',
        path: '/book/referral-form',
      });
    }
  }, []);

  const startTime = useRef(Date.now());

  const handleFieldInteraction = (
    fieldName: string,
    fieldType: string,
    action: 'focus' | 'blur' | 'click',
    value?: string
  ) => {
    Analytics.forms.trackInteraction({
      formName: 'ReferralForm',
      fieldName,
      fieldType,
      action,
      value
    });
  };

  useEffect(() => {
    const validateForm = async () => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());
        const parseResult = referralSchema.safeParse({ ...data, termsAccepted });
        setIsFormValid(parseResult.success);

        // Analytics.forms.trackValidation({
        //   formName: 'ReferralForm',
        //   isValid: parseResult.success,
        //   // errors: parseResult.success ? undefined : parseResult.error.flatten().fieldErrors
        // });

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

      Analytics.forms.trackSubmission({
        formName: 'ReferralForm',
        formData: data,
        success: false // Se actualizará después
      });

      if (!parseResult.success) {
        const issues = parseResult.error.issues;
        const newErrors: ReferralErrors = {};

        issues.forEach((issue) => {
          const field = issue.path[0] as keyof ReferralErrors || 'global';
          newErrors[field] = issue.message;
        });

        setErrors(newErrors);
        setIsSubmitting(false);

        Analytics.forms.trackError({
          formName: 'ReferralForm',
          errorType: 'validation',
          errorMessage: 'Validation failed',
          fieldName: Object.keys(parseResult.error.flatten().fieldErrors)[0]
        });
        return;
      }

      // Enviar al server action
      const result = await createReferral(formData);

      if (result.success) {

        Analytics.forms.trackSubmission({
          formName: 'ReferralForm',
          formData: data,
          success: true
        });

        Analytics.forms.trackCompletion({
          formName: 'ReferralForm',
          timeToComplete: Date.now() - startTime.current,
          completionMethod: 'submit'
        });

        setSuccess(true);
        setErrors({});
        onSuccess?.();
      } else {
        const generalError =
          Object.values(result.errors || {})
            .flat()
            .find((error) => error) || 'Error al procesar la solicitud';

        Analytics.forms.trackError({
          formName: 'ReferralForm',
          errorType: 'server',
          errorMessage: generalError
        });

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
                  onFocus={() => handleFieldInteraction('clientName', 'text', 'focus')}
                  onBlur={() => handleFieldInteraction('clientName', 'text', 'blur')}
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
                  onFocus={() => handleFieldInteraction('clientEmail', 'text', 'focus')}
                  onBlur={() => handleFieldInteraction('clientEmail', 'text', 'blur')}
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
                  onFocus={() => handleFieldInteraction('referrerEmail', 'text', 'focus')}
                  onBlur={() => handleFieldInteraction('referrerEmail', 'text', 'blur')}
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
                  onFocus={() => handleFieldInteraction('referrerPhone', 'text', 'focus')}
                  onBlur={() => handleFieldInteraction('referrerPhone', 'text', 'blur')}
                  placeholder="Ej: (+57) 312 456 7890"
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
                          handleFieldInteraction('termsDialog', 'link', 'click')
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
                          handleFieldInteraction('rewardsDialog', 'link', 'click')
                          setShowRewardsDialog(true);
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

      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent>
          <DialogTitle>Términos y Condiciones del Plan de Referidos</DialogTitle>
          <DialogDescription className="mb-4">
            Al enviar esta información, aceptas los términos y condiciones del plan de referidos. Puedes revisar los detalles a continuación:
          </DialogDescription>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Requisitos de Elegibilidad:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>La persona que te recomendó BioEnneagram debió de haber estado por lo menos 1 vez en terapia.</li>
                <li>Este debe ser tu primer contacto con BioEnneagram, no puedes haber tenido relación con algún otro producto de BioEnneagram, por ejemplo:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Cursos</li>
                    <li>Talleres</li>
                    <li>Retiros</li>
                    <li>Terapias</li>
                    <li>Otros productos</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setTermsAccepted(true);
                setShowTermsDialog(false);
              }}
              className="w-full"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showRewardsDialog} onOpenChange={setShowRewardsDialog}>
        <DialogContent>
          <DialogTitle>Tabla de Reconocimientos y Ganancias</DialogTitle>
          <DialogDescription className="mb-4">
            Descubre cómo nuestro programa de referidos puede beneficiarte.
          </DialogDescription>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Programa de Referidos BioEnneagram</h3>
                <p className="text-sm mb-4">
                  Ayúdanos a crecer y recibe beneficios por cada referido que se una a nuestra comunidad.
                </p>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="font-medium text-blue-700">Descuentos para Referidos en Español</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>10% de descuento en tu próxima sesión por cada referido aprobado</li>
                      <li>Descuentos acumulables hasta un máximo del 50%</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <h4 className="font-medium text-blue-700">Beneficios para Referidos en Inglés</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>15% de descuento en tu próxima sesión por cada referido aprobado</li>
                      <li>Descuentos especiales para referidos que paguen en dólares</li>
                      <li>Descuentos acumulables hasta un máximo del 75%</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-700">Seguimiento de Referidos</h4>
                    <p className="text-sm">
                      Para consultar el estado de tus referidos (aprobados, pendientes o cancelados),
                      contáctanos directamente por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 italic">
                * Los descuentos son aplicables únicamente a sesiones futuras.
                * El programa de referidos está sujeto a cambios sin previo aviso.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowRewardsDialog(false)}
              className="w-full"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}