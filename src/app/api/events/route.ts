import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category') ?? undefined
  const sort = searchParams.get('sort') ?? 'date' // 'date' | 'popular'
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const perPage = 9

  const where = {
    ...(category ? { category } : {}),
  } as const

  // Ordering
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

  return NextResponse.json({
    data: events,
    pagination: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  })
} 
