'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Event } from '@prisma/client'
import { EventCard } from './event-card'
import { Button } from '@/app/components/ui/button'
import { ApiResponse, PaginationData } from '@/types/api'

interface ClientComponentProps {
  initialEvents: (Event & { _count: { reservations: number } })[]
  total: number
  initialPage: number
  perPage: number
  initialFilters: {
    category?: string
    sort: string
  }
}

// Utility to build query string from params
function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) q.set(k, String(v))
  })
  return q.toString()
}

export function ClientComponent({
  initialEvents,
  total,
  initialPage,
  perPage,
  initialFilters,
}: ClientComponentProps) {
  const router = useRouter()

  // Local UI state mirrors searchParams
  const [category, setCategory] = useState(initialFilters.category ?? '')
  const [sort, setSort] = useState(initialFilters.sort)
  const [page, setPage] = useState(initialPage)

  const { data } = useQuery({
    queryKey: ['events', { category, sort, page }],
    queryFn: async () => {
      const qs = buildQuery({ category: category || undefined, sort, page })
      const res = await fetch(`/api/events?${qs}`)
      if (!res.ok) throw new Error('Failed to fetch events')
      return (await res.json()) as ApiResponse<(Event & { _count: { reservations: number } })[]>
    },
    initialData: { data: initialEvents, pagination: { total, page: initialPage, perPage, totalPages: Math.ceil(total / perPage) } },
  })

  const events = data.data
  const pagination: PaginationData = data.pagination ?? { total, page, perPage, totalPages: Math.ceil(total / perPage) }
  const totalPages = pagination.totalPages

  // Sync state with URL searchParams (for SSR navigation/back/forward)
  const updateUrl = (newState: { category?: string; sort?: string; page?: number }) => {
    const nextParams = {
      category: (newState.category ?? category) || undefined,
      sort: newState.sort ?? sort,
      page: newState.page ?? page,
    }
    router.push(`/events?${buildQuery(nextParams)}`)
  }
  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1">
          <label className="block text-soft-beige mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
              updateUrl({ category: e.target.value, page: 1 })
            }}
            className="bg-deep-night border border-soft-gray text-soft-beige px-4 py-2 rounded-md w-full"
          >
            <option value="">Todas</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Action">Action</option>
            {/* More categories... */}
          </select>
        </div>
        <div>
          <label className="block text-soft-beige mb-1">Ordenar por</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              updateUrl({ sort: e.target.value })
            }}
            className="bg-deep-night border border-soft-gray text-soft-beige px-4 py-2 rounded-md"
          >
            <option value="date">Fecha</option>
            <option value="popular">Popularidad</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {events.length === 0 ? (
        <p className="text-soft-gray text-center mt-16">No se encontraron eventos.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => {
              const next = page - 1
              setPage(next)
              updateUrl({ page: next })
            }}
          >
            Anterior
          </Button>
          <span className="text-soft-beige/80 self-center">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => {
              const next = page + 1
              setPage(next)
              updateUrl({ page: next })
            }}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
} 
