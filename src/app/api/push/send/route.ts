import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Configurar VAPID details
webpush.setVapidDetails(
    'mailto:puffandchill@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!
)

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

        // Obtener datos de la notificación
        const { title, body } = await req.json()

        if (!title || !body) {
            return NextResponse.json(
                { error: 'Título y mensaje son requeridos' }, 
                { status: 400 }
            )
        }

        // Obtener todas las suscripciones
        const subscriptions = await prisma.pushSubscription.findMany()

        if (subscriptions.length === 0) {
            return NextResponse.json(
                { message: 'No hay usuarios suscritos a notificaciones push' },
                { status: 200 }
            )
        }

        // Preparar payload de la notificación
        const payload = JSON.stringify({
            title,
            body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: {
                url: '/events' // Redirigir a eventos al hacer click
            }
        })

        // Enviar notificaciones a todas las suscripciones
        const sendPromises = subscriptions.map(async (subscription) => {
            try {
                await webpush.sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: subscription.keys as { p256dh: string; auth: string }
                    },
                    payload
                )
                return { success: true, endpoint: subscription.endpoint }
            } catch (error) {
                
                // Si la suscripción es inválida (410 o 403), la eliminamos
                if ((error as any)?.statusCode === 410 || (error as any)?.statusCode === 403) {
                    try {
                        await prisma.pushSubscription.delete({
                            where: { id: subscription.id }
                        })
                    } catch (deleteError) {
                    }
                }
                
                return { success: false, endpoint: subscription.endpoint, error: (error as Error).message }
            }
        })

        const results = await Promise.all(sendPromises)
        const successCount = results.filter(r => r.success).length
        const failedCount = results.filter(r => !r.success).length

        return NextResponse.json({
            message: `Notificación enviada exitosamente`,
            details: {
                total: subscriptions.length,
                success: successCount,
                failed: failedCount
            }
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
} 
