'use client'
import { useState } from 'react'
import { deleteEvent } from './data-access'

interface DeleteAlertProps {
    eventId: string
    eventName: string
    onClose: () => void
    onDeleted?: () => void
}

export default function DeleteAlert({ eventId, eventName, onClose, onDeleted }: DeleteAlertProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        setLoading(true)
        setError(null)
        const result = await deleteEvent(eventId)
        setLoading(false)
        if (result.success) {
            if (onDeleted) onDeleted()
            onClose()
        } else {
            setError(result.error || 'Error al eliminar el evento')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-sm w-full shadow-lg">
                <h2 className="text-lg font-bold text-white mb-2">Eliminar evento</h2>
                <p className="text-gray-300 mb-4">
                    ¿Seguro que deseas eliminar el evento <span className="text-orange-400 font-semibold">{eventName}</span>?
                </p>
                {error && <div className="text-red-400 mb-2">{error}</div>}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
