'use client'

import { useState, useEffect } from 'react'
import { PlayIcon, X as XIcon, ExternalLinkIcon } from 'lucide-react'

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

interface TrailerData {
  trailer: KinoCheckVideo | null
  videos: KinoCheckVideo[]
  movieInfo: {
    title: string
    kinoCheckUrl: string
  }
}

interface TrailerPlayerProps {
  tmdbId: string | null
  eventTitle: string
}

export function TrailerPlayer({ tmdbId, eventTitle }: TrailerPlayerProps) {
  const [trailerData, setTrailerData] = useState<TrailerData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<KinoCheckVideo | null>(null)

  useEffect(() => {
    if (tmdbId) {
      fetchTrailer()
    }
  }, [tmdbId])

  const fetchTrailer = async () => {
    if (!tmdbId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/movies/trailer?tmdbId=${tmdbId}`)
      const result = await response.json()

      if (result.success) {
        setTrailerData(result.data)
        // Seleccionar el trailer principal o el primer video disponible
        if (result.data.trailer) {
          setSelectedVideo(result.data.trailer)
        } else if (result.data.videos.length > 0) {
          setSelectedVideo(result.data.videos[0])
        }
      } else {
        setError(result.error || 'No se pudo cargar el trailer')
      }
    } catch (err) {
      console.error('Error fetching trailer:', err)
      setError('Error al cargar el trailer')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayTrailer = () => {
    if (selectedVideo) {
      setShowPlayer(true)
    }
  }

  const handleClosePlayer = () => {
    setShowPlayer(false)
  }

  if (!tmdbId) {
    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-display text-2xl text-soft-beige">Trailer</h2>
        <div className="aspect-video bg-deep-night rounded-xl flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-soft-gray/30 rounded-full flex items-center justify-center">
              <PlayIcon className="w-12 h-12 text-soft-gray" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !selectedVideo) {
    return (
      <div className="space-y-4">
        <h2 className="text-display text-2xl text-soft-beige">Trailer</h2>
        <div className="aspect-video bg-deep-night rounded-xl flex items-center justify-center">
          <p className="text-soft-beige/60 text-center">
            {error || 'Trailer no disponible'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-display text-2xl text-soft-beige">Trailer</h2>
          {trailerData?.movieInfo.kinoCheckUrl && (
            <a
              href={trailerData.movieInfo.kinoCheckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-sunset-orange hover:text-sunset-orange/80 transition-colors duration-200"
            >
              <span>Ver en KinoCheck</span>
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Trailer Preview */}
        <div 
          className="aspect-video bg-gradient-to-br from-sunset-orange/20 to-warm-red/20 rounded-xl overflow-hidden cursor-pointer hover:from-sunset-orange/30 hover:to-warm-red/30 transition-all duration-300 relative group"
          onClick={handlePlayTrailer}
        >
          {/* Thumbnail */}
          <div 
            className="w-full h-full bg-cover bg-center flex items-center justify-center"
            style={{ 
              backgroundImage: `url(${selectedVideo.youtube_thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-deep-night/40 group-hover:bg-deep-night/20 transition-all duration-300" />
            
            {/* Play Button */}
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-sunset-orange/90 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sunset-orange group-hover:scale-110 transition-all duration-200">
                <PlayIcon className="w-10 h-10 text-deep-night ml-1" />
              </div>
              <p className="text-soft-beige font-medium">Ver Trailer</p>
              <p className="text-soft-beige/70 text-sm mt-1">
                {parseInt(selectedVideo.views).toLocaleString()} visualizaciones
              </p>
            </div>
          </div>
        </div>

        {/* Multiple Trailers */}
        {trailerData && trailerData.videos.length > 1 && (
          <div className="space-y-2">
            <h3 className="text-soft-beige/80 text-sm font-medium">Otros trailers disponibles:</h3>
            <div className="flex flex-wrap gap-2">
              {trailerData.videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video)
                    setShowPlayer(false)
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                    selectedVideo?.id === video.id
                      ? 'bg-sunset-orange text-deep-night'
                      : 'bg-soft-gray/30 text-soft-beige hover:bg-soft-gray/50'
                  }`}
                >
                  {video.language === 'es' ? '🇪🇸' : '🇺🇸'} {video.categories.join(', ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* YouTube Player Modal */}
      {showPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-deep-night/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            {/* Close Button */}
            <button
              onClick={handleClosePlayer}
              className="absolute -top-12 right-0 text-soft-beige hover:text-sunset-orange transition-colors duration-200 z-10"
            >
              <XIcon className="w-8 h-8" />
            </button>

            {/* YouTube Embed */}
            <div className="aspect-video bg-deep-night rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Info */}
            <div className="mt-4 text-center">
              <h3 className="text-soft-beige font-medium">{selectedVideo.title}</h3>
              <p className="text-soft-beige/70 text-sm mt-1">
                {parseInt(selectedVideo.views).toLocaleString()} visualizaciones • {new Date(selectedVideo.published).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 