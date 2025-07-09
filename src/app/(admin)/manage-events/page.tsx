"use client"
import { Suspense, useState } from 'react'
import EventsList from './EventsList'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { Plus, Trash2 } from 'lucide-react'
import { BackButton } from '@/app/components/ui/back-button'

export default function EventsPage() {
    const [deleteMode, setDeleteMode] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 pt-8">
            <div className="container mx-auto px-2 sm:px-4 py-8">
                <div className="text-center mb-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-4 text-left">
                            <BackButton href="/" label="Volver al inicio" />
                        </div>
                        
                        {/* Header del admin */}
                        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex items-center gap-3 justify-center">
                                <Home className="h-7 w-7 text-orange-500" />
                                <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
                                    Gestionar Eventos
                                </h1>
                            </div>
                            <div className="flex gap-2 justify-end w-full sm:w-auto">
                                <Link href="/manage-events/new" className="flex-1 sm:flex-initial">
                                    <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded transition shadow hidden xs:inline-block">
                                        Añadir Nuevo Evento
                                    </button>
                                    <button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 transition shadow xs:hidden flex items-center justify-center" title="Añadir Nuevo Evento">
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </Link>
                                {/* Botón de tacho de basura */}
                                <button
                                    className={`bg-orange-600 hover:bg-orange-700 text-white rounded-full p-2 transition shadow flex items-center justify-center ${deleteMode ? 'ring-2 ring-orange-400' : ''}`}
                                    title="Eliminar Evento"
                                    onClick={() => setDeleteMode(!deleteMode)}
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Contenido de eventos */}
                <Suspense fallback={<div className="text-white">Cargando eventos...</div>}>
                    <EventsList deleteMode={deleteMode} />
                </Suspense>
            </div>
        </div>
    )
}
