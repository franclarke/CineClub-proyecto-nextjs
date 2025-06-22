"use server"

import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { ClientComponent } from './client-component'
// import types only if needed later

interface DataAccessProps {
  searchParams: Record<string, string | string[] | undefined>
}

/**
 * Server Component that fetches events list applying filters from `searchParams`.
 * It passes the fetched data down to a Client Component that handles interactive
 * filtering/pagination via TanStack React Query.
 */
export async function DataAccess({ searchParams }: DataAccessProps) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'date'
  const pageParam = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const perPage = 9

  const where = {
    ...(category ? { category } : {}),
  } as const

  const orderBy =
    sort === 'popular'
      ? {
        reservations: {
          _count: 'desc' as const,
        },
      }
      : { dateTime: 'asc' as const }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    }),
    prisma.event.count({ where }),
  ])

  return (
    <Suspense>
      <ClientComponent
        initialEvents={events}
        total={total}
        initialPage={page}
        perPage={perPage}
        initialFilters={{ category, sort }}
      />
    </Suspense>
  )
}

/**
 * Elimina un evento por su ID.
 * @param eventId - ID del evento a eliminar
 * @returns Un objeto con success y el evento eliminado, o un error
 */
export async function deleteEvent(eventId: string) {
  try {
    // 1. Elimina reservas relacionadas a los asientos de este evento
    await prisma.reservation.deleteMany({
      where: {
        seat: {
          eventId: eventId,
        },
      },
    })
    // 2. Elimina asientos relacionados a este evento
    await prisma.seat.deleteMany({
      where: { eventId },
    })
    // 3. Elimina el evento
    const event = await prisma.event.delete({
      where: { id: eventId },
    })
    return { success: true, event }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Obtiene todos los eventos de la base de datos.
 */
export async function fetchAllEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { dateTime: 'asc' },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    })
    return events
  } catch {
    return []
  }
}
