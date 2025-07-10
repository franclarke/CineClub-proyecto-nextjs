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
        <div className="min-h-screen bg-deep-night pt-24">
            <div className="container mx-auto px-2 sm:px-4 py-8">
                <div className="text-center mb-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-4 text-left">
                            <BackButton href="/" label="Volver al inicio" />
                        </div>
                        
                        {/* Header del admin */}
                        <div className="card-modern p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex items-center gap-3 justify-center">
                                <Home className="h-7 w-7 text-sunset-orange" />
                                <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-soft-beige text-center sm:text-left">
                                    Gestionar Eventos
                                </h1>
                            </div>
                            <div className="flex gap-2 justify-end w-full sm:w-auto">
                                <Link href="/manage-events/new" className="flex-1 sm:flex-initial">
                                    <button className="w-full sm:w-auto btn-primary py-2 px-5 rounded transition-base shadow-soft hidden xs:inline-block">
                                        Añadir Nuevo Evento
                                    </button>
                                    <button className="btn-primary rounded-full p-2 transition-base shadow-soft xs:hidden flex items-center justify-center" title="Añadir Nuevo Evento">
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </Link>
                                {/* Botón de tacho de basura */}
                                <button
                                    className={`btn-primary rounded-full p-2 transition-base shadow-soft flex items-center justify-center ${deleteMode ? 'ring-2 ring-sunset-orange' : ''}`}
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
                <Suspense fallback={<div className="text-soft-beige">Cargando eventos...</div>}>
                    <EventsList deleteMode={deleteMode} />
                </Suspense>
            </div>
        </div>
    )
}
