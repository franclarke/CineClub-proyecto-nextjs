// PushNotificationsInitializer.tsx
'use client'

import { useEffect } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function PushNotificationsInitializer() {
    useEffect(() => {
        if (!VAPID_PUBLIC_KEY) {
            console.error('VAPID public key no definida. Verifica tu .env y el nombre de la variable.')
            return
        }
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey
                        }).then(subscription => {
                            // Envía la suscripción a tu backend aquí
                            fetch('/api/push/subscribe', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(subscription)
                            })
                        })
                    })
                }
            })
        }
    }, [])

    return null
}