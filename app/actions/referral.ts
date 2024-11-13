'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createReferral(formData: FormData) {
  const clientName = formData.get('clientName') as string
  const referrerEmail = formData.get('referrerEmail') as string
  const referrerPhone = formData.get('referrerPhone') as string

  // Validaciones
  if (!clientName?.trim()) {
    return {
      success: false,
      errors: { clientName: 'El nombre es requerido' }
    }
  }

  if (!referrerEmail && !referrerPhone) {
    return {
      success: false,
      errors: {
        referrerEmail: 'Debes proporcionar al menos un método de contacto',
        referrerPhone: 'Debes proporcionar al menos un método de contacto'
      }
    }
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        clientName,
        referrerEmail: referrerEmail || null,
        referrerPhone: referrerPhone || null,
        status: 'PENDING',
      },
    })

    revalidatePath('/book')
    return { success: true, data: referral }
  } catch (error) {
    console.error('Error creating referral:', error)
    return {
      success: false,
      errors: {
        global: 'Error al guardar la información. Por favor intenta de nuevo.'
      }
    }
  }
}