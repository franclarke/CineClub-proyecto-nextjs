import { Suspense } from 'react'
import { getAllEvents } from './data-access'
import { EventCard } from '@/app/events/components/event-card'

async function EventsContent() {
    const events = await getAllEvents()
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    )
}

export default function EventsList() {
    return (
        <Suspense fallback={<div className="text-white">Cargando eventos...</div>}>
            <EventsContent />
        </Suspense>
    )
}