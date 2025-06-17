"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Badge, Calendar, Clock, MapPin, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/app/components/ui/glass-card"
import { Button } from "@/app/components/ui/button"

// Define variants for the EventCard
const eventCardVariants = cva("relative overflow-hidden group", {
  variants: {
    variant: {
      default: [
        "transition-base hover:shadow-glow",
      ],
      premium: [
        "premium-border shadow-premium hover:shadow-premium/80",
      ],
      featured: [
        "shadow-soft hover:shadow-glow",
      ],
    },
    size: {
      default: "max-w-md",
      sm: "max-w-sm", 
      lg: "max-w-lg",
      full: "w-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface EventCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof eventCardVariants> {
  event: {
    id: number
    title: string
    description: string | null
    dateTime: Date
    location: string | null
    category: string | null
    imdbId: string | null
    spotifyUri: string | null
  }
  onBook?: () => void
}

export function EventCard({
  className,
  variant,
  size,
  event,
  onBook,
  ...props
}: EventCardProps) {
  // Determine the variant based on special criteria
  const cardVariant = event.category === 'Premium' 
    ? "premium" 
    : event.category === 'Featured'
      ? "featured" 
      : variant;

  // Format date for display
  const formattedDate = event.dateTime.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  const formattedTime = event.dateTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isPremium = event.category === 'Premium';

  return (
    <GlassCard
      variant={isPremium ? "premium" : "default"}
      className={cn(
        eventCardVariants({ variant: cardVariant, size }),
        className,
        "animate-fade-in"
      )}
      {...props}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
        <div className="w-full h-full bg-gradient-to-br from-sunset-orange/20 to-warm-red/20 flex items-center justify-center">
          <div className="text-4xl opacity-60">🎬</div>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-4 left-4">
            <Badge 
              className={cn(
                "text-subtitle uppercase tracking-wider",
                isPremium && "badge-premium"
              )}
            >
              {event.category}
            </Badge>
          </div>
        )}
        
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 right-4">
            <div className="badge-premium flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span className="text-subtitle">Premium</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "var(--spacing-lg)" }}>
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-display text-lg font-bold leading-tight tracking-tight text-soft-beige">
            {event.title}
          </h3>
          
          {/* Description */}
          {event.description && (
            <p className="text-responsive text-soft-gray line-clamp-2">
              {event.description}
            </p>
          )}
          
          {/* Event Details */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-soft-gray">
              <Calendar className="w-4 h-4 text-sunset-orange" />
              <span className="text-responsive">{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-soft-gray">
              <Clock className="w-4 h-4 text-sunset-orange" />
              <span className="text-responsive">{formattedTime}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2 text-soft-gray">
                <MapPin className="w-4 h-4 text-sunset-orange" />
                <span className="text-responsive">{event.location}</span>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={onBook} 
            variant={isPremium ? "premium" : "primary"}
            className="w-full transition-base"
            style={{ marginTop: "var(--spacing-md)" }}
          >
            Reservar Entradas
          </Button>
        </div>
      </div>
    </GlassCard>
  )
} 