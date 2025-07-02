import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ClientComponent } from './client-component'
import { ImdbData } from '@/types/imdb'

interface DataAccessProps {
  id: string
}

export async function DataAccess({ id }: DataAccessProps) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      seats: true,
      reservations: true,
    },
  })

  if (!event) {
    return notFound()
  }

  // Fetch IMDb synopsis if available (cached 24 h)
  let imdbData: ImdbData | null = null
  if (event.imdbId) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?i=${event.imdbId}&apikey=${process.env.IMDB_API_KEY}`, {
        next: { revalidate: 60 * 60 * 24 },
      })
      const fetchedImdbData = await res.json()
      if (fetchedImdbData && !fetchedImdbData.Error) {
        imdbData = fetchedImdbData as ImdbData
      } else {
        // Optionally log imdb.Error here if needed
        // console.warn(`OMDb API error for ${event.imdbId}: ${fetchedImdbData.Error}`)
      }
    } catch (err) {
      console.error('Failed to fetch IMDb data:', err) // Log the actual error
    }
  }

  // group seats per tier
  const tiersMap = event.seats.reduce<Record<string, { total: number; reserved: number }>>((acc, seat) => {
    const tier = seat.tier || 'General'
    acc[tier] = acc[tier] || { total: 0, reserved: 0 }
    acc[tier].total += 1
    if (seat.isReserved) acc[tier].reserved += 1
    return acc
  }, {})

  return (
    <ClientComponent event={event} imdb={imdbData} tiers={tiersMap} />
  )
} 