'use client'

import { Event } from '@prisma/client'
import { Button } from '../../../components/ui/button'
import Image from 'next/image'
import { ImdbData } from '@/types/imdb'

interface ClientProps {
  event: Event
  imdb: ImdbData | null
  tiers: Record<string, { total: number; reserved: number }>
}

export function ClientComponent({ event, imdb, tiers }: ClientProps) {
  const poster = imdb?.Poster && imdb.Poster !== 'N/A' ? imdb.Poster : '/placeholder-poster.jpg'
  const synopsis = imdb?.Plot && imdb.Plot !== 'N/A' ? imdb.Plot : event.description

  return (
    <section className="max-w-5xl mx-auto bg-soft-gray/30 backdrop-blur-sm border border-soft-gray/20 rounded-xl overflow-hidden shadow-soft">
      <div className="grid md:grid-cols-2">
        {/* Poster */}
        <div className="relative h-80 md:h-auto">
          <Image src={poster} alt={event.title} fill className="object-cover" />
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          <h1 className="text-display text-3xl text-sunset-orange leading-tight">
            {event.title}
          </h1>
          <p className="text-soft-beige/80 leading-relaxed">
            {synopsis}
          </p>

          <div className="space-y-1 text-sm text-soft-gray">
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(event.dateTime).toLocaleString('es-ES', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
            <p>
              <strong>Lugar:</strong> {event.location}
            </p>
            {event.category && (
              <p>
                <strong>Categoría:</strong> {event.category}
              </p>
            )}
          </div>

          {/* Seats info */}
          <div className="space-y-2">
            <h2 className="text-soft-beige font-semibold">Disponibilidad por tier</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(tiers).map(([tier, info]) => (
                <li key={tier} className="flex justify-between">
                  <span>{tier}</span>
                  <span>
                    {info.total - info.reserved}/{info.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full mt-4" disabled>
            Reservar asiento (Próximamente)
          </Button>
        </div>
      </div>
    </section>
  )
} 