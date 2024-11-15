
import { z } from 'zod';

export const referralSchema = z.object({
  clientName: z.string().min(1, 'El nombre completo es obligatorio'),
  clientEmail: z.string().email('El correo no es válido'),
  referrerEmail: z.string().email('El correo no es válido').optional(),
  referrerPhone: z.string().optional(),
  termsAccepted: z.boolean().refine((value) => value, {
    message: 'Debes aceptar los términos y condiciones', // Este mensaje se muestra si no se acepta
  }),
});


export type ReferralErrors = Partial<Record<keyof z.infer<typeof referralSchema> | 'global', string>>;