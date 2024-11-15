'use server'

import { referralSchema } from '@/lib/validations/referralSchema'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createReferral(formData: FormData) {
  try {
    // Convierte FormData a un objeto simple
    const data = Object.fromEntries(formData.entries());
    const parsed = referralSchema.safeParse({
      ...data,
      termsAccepted: data.termsAccepted === null ? false : true,
    });

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    // Extrae los datos validados
    const validatedData = parsed.data;

    const referral = await prisma.referrals.create({
      data: {
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        termsAccepted: validatedData.termsAccepted,
        status: 'PENDING',
        ...(validatedData.referrerEmail ? { referrerEmail: validatedData.referrerEmail } : {}),
        ...(validatedData.referrerPhone ? { referrerPhone: validatedData.referrerPhone } : {}),
      },
    });

    // Revalida el cache de la página destino
    revalidatePath('/book');
    return { success: true, data: referral };
  } catch (error) {
    console.error('Error creating referral:', error);
    return {
      success: false,
      errors: {
        global: 'Error al guardar la información. Por favor intenta de nuevo.',
      },
    };
  }
}