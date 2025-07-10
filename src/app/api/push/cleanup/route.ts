import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        // Verificar autenticación y rol de admin
        const session = await getServerSession(authOptions)
        
        if (!session?.user) {
            return NextResponse.json(
                { error: 'No autorizado' }, 
                { status: 401 }
            )
        }

        // Obtener usuario de la base de datos para verificar si es admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        })

        if (!user?.isAdmin) {
            return NextResponse.json(
                { error: 'Acceso denegado. Se requieren permisos de administrador.' }, 
                { status: 403 }
            )
        }

        // Obtener todas las suscripciones
        const subscriptions = await prisma.pushSubscription.findMany()
        
        // Eliminar todas las suscripciones existentes para empezar limpio
        const deletedCount = await prisma.pushSubscription.deleteMany({})

        return NextResponse.json({
            message: 'Todas las suscripciones push han sido eliminadas',
            details: {
                deleted: deletedCount.count,
                reason: 'Las suscripciones anteriores usaban claves VAPID incorrectas'
            }
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
} 
