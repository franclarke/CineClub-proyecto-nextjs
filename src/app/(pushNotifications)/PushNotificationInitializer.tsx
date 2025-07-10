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
            const initializePushNotifications = async () => {
                try {
                    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                    
                    // Pedir permisos de notificación
                    const permission = await Notification.requestPermission()
                    console.log('Permiso de notificaciones:', permission)
                    
                    if (permission === 'granted') {
                        const registration = await navigator.serviceWorker.ready
                        
                        // Verificar si ya existe una suscripción
                        let subscription = await registration.pushManager.getSubscription()
                        
                        if (subscription) {
                            console.log('Suscripción existente encontrada')
                            // Verificar si usa las claves VAPID correctas comparando la applicationServerKey
                            // Si hay dudas, renovar la suscripción
                            try {
                                await subscription.unsubscribe()
                                console.log('Suscripción anterior eliminada para renovar')
                                subscription = null
                            } catch (error) {
                                console.error('Error eliminando suscripción anterior:', error)
                            }
                        }
                        
                        // Crear nueva suscripción si no existe o se eliminó la anterior
                        if (!subscription) {
                            subscription = await registration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey
                            })
                            console.log('Nueva suscripción creada')
                        }
                        
                        // Enviar suscripción al backend
                        const response = await fetch('/api/push/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(subscription)
                        })
                        
                        if (response.ok) {
                            console.log('Suscripción enviada al servidor exitosamente')
                        } else {
                            console.error('Error enviando suscripción al servidor:', response.status)
                        }
                    } else {
                        console.log('Permisos de notificación denegados')
                    }
                } catch (error) {
                    console.error('Error inicializando push notifications:', error)
                }
            }
            
            initializePushNotifications()
        }
    }, [])

    return null
}