import { z } from 'zod';

export const referralSchema = z.object({
  clientName: z.string().min(1, 'El nombre completo es obligatorio'),
  clientEmail: z.string().email('El correo no es válido'),
  referrerName: z.string().min(1, 'El nombre completo es obligatorio'),
  referrerEmail: z.union([z.string().email('El correo del referido no es válido'), z.string().length(0)]),
  referrerPhone: z.string().optional(),
  termsAccepted: z.boolean().refine((value) => value, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).superRefine((data, ctx) => {
  if (!data.referrerEmail && !data.referrerPhone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debes proporcionar al menos un método de contacto del referido (correo o teléfono)',
      path: [],
    });
  }
});

export type ReferralErrors = Partial<Record<keyof z.infer<typeof referralSchema> | 'global', string>>;