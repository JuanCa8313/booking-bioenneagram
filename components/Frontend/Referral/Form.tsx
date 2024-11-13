import React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createReferral } from '@/app/actions/referral'

interface ReferralFormProps {
  onSuccess?: () => void;
}

export default function ReferralForm({ onSuccess }: ReferralFormProps) {
  const [errors, setErrors] = useState<any>({})
  const [success, setSuccess] = useState(false)

  async function onSubmit(formData: FormData) {
    const result = await createReferral(formData)

    if (!result.success) {
      setErrors(result.errors)
      return
    }

    setSuccess(true)
    setErrors({})
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
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Información de Referido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Tu Nombre Completo *</Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="Ej: Juan Pérez"
                className={errors.clientName ? "border-red-500" : ""}
              />
              {errors.clientName && (
                <p className="text-sm text-red-500 mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="referrerEmail">
                Correo de quien te refirió
              </Label>
              <Input
                id="referrerEmail"
                name="referrerEmail"
                type="email"
                placeholder="Ej: referidor@email.com"
                className={errors.referrerEmail ? "border-red-500" : ""}
              />
              {errors.referrerEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.referrerEmail}</p>
              )}
            </div>

            <div>
              <Label htmlFor="referrerPhone">
                Teléfono de quien te refirió
              </Label>
              <Input
                id="referrerPhone"
                name="referrerPhone"
                type="tel"
                placeholder="Ej: +1234567890"
                className={errors.referrerPhone ? "border-red-500" : ""}
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

          <Button type="submit" className="w-full">
            Enviar información
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}