import { NextRequest, NextResponse } from 'next/server'

interface KinoCheckVideo {
  id: string
  youtube_video_id: string
  youtube_channel_id: string
  youtube_thumbnail: string
  title: string
  url: string
  thumbnail: string
  language: string
  categories: string[]
  published: string
  views: string
}

interface KinoCheckMovieResponse {
  id: string
  tmdb_id: number
  imdb_id: string | null
  language: string
  title: string
  url: string
  trailer: KinoCheckVideo | null
  videos: KinoCheckVideo[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tmdbId = searchParams.get('tmdbId')
    
    if (!tmdbId) {
      return NextResponse.json(
        { error: 'tmdbId parameter is required' },
        { status: 400 }
      )
    }

    // Llamada a KinoCheck API - primero sin idioma específico
    const kinoCheckUrl = `https://api.kinocheck.com/movies?tmdb_id=${tmdbId}&categories=Trailer`
    
    const response = await fetch(kinoCheckUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Si tienes API key, descomenta estas líneas:
        // 'X-Api-Key': process.env.KINOCHECK_API_KEY || '',
        // 'X-Api-Host': 'api.kinocheck.com'
      },
      cache: 'force-cache', // Cache por 1 hora
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      // Si no encuentra sin idioma, intenta con alemán (idioma soportado)
      const fallbackResponse = await fetch(
        `https://api.kinocheck.com/movies?tmdb_id=${tmdbId}&language=de&categories=Trailer`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'force-cache',
          next: { revalidate: 3600 }
        }
      )

      if (!fallbackResponse.ok) {
        // Último intento con inglés
        const englishResponse = await fetch(
          `https://api.kinocheck.com/movies?tmdb_id=${tmdbId}&language=en&categories=Trailer`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            cache: 'force-cache',
            next: { revalidate: 3600 }
          }
        )

        if (!englishResponse.ok) {
          return NextResponse.json(
            { error: 'Movie not found in KinoCheck API' },
            { status: 404 }
          )
        }

        const englishData: KinoCheckMovieResponse = await englishResponse.json()
        
        return NextResponse.json({
          success: true,
          data: {
            trailer: englishData.trailer,
            videos: englishData.videos.filter(video => 
              video.categories.includes('Trailer')
            ),
            movieInfo: {
              title: englishData.title,
              kinoCheckUrl: englishData.url
            }
          }
        })
      }

      const fallbackData: KinoCheckMovieResponse = await fallbackResponse.json()
      
      return NextResponse.json({
        success: true,
        data: {
          trailer: fallbackData.trailer,
          videos: fallbackData.videos.filter(video => 
            video.categories.includes('Trailer')
          ),
          movieInfo: {
            title: fallbackData.title,
            kinoCheckUrl: fallbackData.url
          }
        }
      })
    }

    const data: KinoCheckMovieResponse = await response.json()
    
    return NextResponse.json({
      success: true,
      data: {
        trailer: data.trailer,
        videos: data.videos.filter(video => 
          video.categories.includes('Trailer')
        ),
        movieInfo: {
          title: data.title,
          kinoCheckUrl: data.url
        }
      }
    })

  } catch (error) {
    console.error('Error fetching trailer from KinoCheck:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
