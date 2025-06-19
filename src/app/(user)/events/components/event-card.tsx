import Link from 'next/link'
import { Event } from '@prisma/client'
import Image from 'next/image'

interface EventCardProps {
  event: Event & { _count?: { reservations?: number } }
}

export function EventCard({ event }: EventCardProps) {
  const { title, description, dateTime, category, id, _count } = event
  const date = new Date(dateTime)
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  const slug = id // using id as slug for now

  return (
    <Link
      href={`/events/${slug}`}
      className="group bg-soft-gray/30 backdrop-blur-sm border border-soft-gray/20 rounded-xl overflow-hidden shadow-soft hover:shadow-glow transition-shadow"
    >
      <div className="relative aspect-video w-full bg-deep-night">
        {/* Placeholder image or event poster later */}
        <Image
          src="/placeholder-poster.jpg"
          alt={title}
          fill
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <span className="absolute top-2 right-2 bg-sunset-orange text-deep-night text-xs font-semibold px-2 py-1 rounded-md">
          {category ?? 'Evento'}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-display text-lg text-sunset-orange leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-soft-beige/80 text-sm line-clamp-3 min-h-[3.8rem]">
          {description}
        </p>
        <div className="flex justify-between items-center text-xs text-soft-gray mt-2">
          <span>{formattedDate}</span>
          {_count?.reservations !== undefined && (
            <span>{_count.reservations} reservas</span>
          )}
        </div>
      </div>
    </Link>
  )
} 