// app/api/vwo-proxy/route.ts
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch('https://app.vwo.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Agrega aquí otros headers necesarios
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    return NextResponse.json(
      data,
      {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*', // En producción, usa tu dominio específico
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  } catch (error) {
    console.error('Error en el proxy de VWO:', error)
    return NextResponse.json(
      { error: 'Error al conectar con VWO' },
      { status: 500 }
    )
  }
}

// Manejador para las peticiones OPTIONS (necesario para CORS)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}