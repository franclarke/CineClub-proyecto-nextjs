import Link from 'next/link'
import { Event } from '@prisma/client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import DeleteAlert from './deleteAlert'
import { useRouter } from 'next/navigation'

interface EventCardProps {
  event: Event & { _count?: { reservations?: number } }
  deleteMode?: boolean
  onDeleted?: (id: string) => void
}

export function EventCard({ event, deleteMode, onDeleted }: EventCardProps) {
  const { title, description, dateTime, category, id, _count } = event
  const date = new Date(dateTime)
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  const slug = id // using id as slug for now

  const [showDelete, setShowDelete] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  return (
    <div className="relative">
      <Link
        href={`/events/${slug}`}
        className="group bg-soft-gray/30 backdrop-blur-sm border border-soft-gray/20 rounded-xl overflow-hidden shadow-soft hover:shadow-glow transition-shadow block"
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
      {deleteMode && (
        <button
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition z-10"
          title="Eliminar este evento"
          onClick={(e) => {
            e.preventDefault()
            setShowDelete(true)
          }}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      {showDelete && (
        <DeleteAlert
          eventId={id}
          eventName={title}
          onClose={() => setShowDelete(false)}
          onDeleted={() => {
            setShowDelete(false)
            if (onDeleted) onDeleted(id)
          }}
        />
      )}

    </div>
  )
}