import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Ajusta la ruta según tu proyecto

export async function POST(req: NextRequest) {
    try {
        const subscription = await req.json()
        // Extrae los datos relevantes
        const { endpoint, keys } = subscription

        // Si tienes usuario logueado, puedes asociar el userId aquí
        // const userId = ...;

        // Guarda en la base de datos
        await prisma.pushSubscription.create({
            data: {
                endpoint,
                keys,
                // userId, // Descomenta si quieres asociar a un usuario
            },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
}