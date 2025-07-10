import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        // Verificar variables de entorno VAPID
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        const vapidPrivateKey = process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY

        // Obtener número de suscripciones activas
        const subscriptionCount = await prisma.pushSubscription.count()

        const config = {
            vapidConfigured: !!(vapidPublicKey && vapidPrivateKey),
            vapidPublicKeyLength: vapidPublicKey ? vapidPublicKey.length : 0,
            vapidPrivateKeyLength: vapidPrivateKey ? vapidPrivateKey.length : 0,
            activeSubscriptions: subscriptionCount,
            serviceWorkerPath: '/service-worker.js',
            timestamp: new Date().toISOString()
        }

        return NextResponse.json({
            status: 'Push Notifications Configuration',
            config,
            ready: config.vapidConfigured && config.activeSubscriptions > 0
        })

    } catch (error) {
        console.error('Error en endpoint de testing push:', error)
        return NextResponse.json(
            { error: 'Error verificando configuración push' },
            { status: 500 }
        )
    }
} 