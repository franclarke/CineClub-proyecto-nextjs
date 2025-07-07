'use client'

import { useEffect } from 'react'

const PUBLIC_VAPID_KEY = "BGNkkWZ0j0I7bxE63z0UEQJlhF0GhVud-3Ix42zJuyAX1wZp3d1NPWyJNo56mze0jUVSm5CQOryCiSQ_qdfQiZk"

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushManager() {
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                        }).then(subscription => {
                            // Aquí deberías enviar la suscripción a tu backend
                            fetch('/api/push/subscribe', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(subscription),
                            });
                        });
                    });
                }
            });
        }
    }, []);
    return null;
}