"use client"

import * as React from "react"
import Link from "next/link"
import { Star, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"

export function HeroSection({
  className,
}: {
  className?: string
}) {
  return (
    <section
      className={cn(
        "gradient-hero relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-night/50 to-deep-night" />
        <div className="absolute top-0 left-1/4 h-96 w-96 bg-sunset-orange/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 bg-soft-gold/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-soft-beige/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container relative z-10 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 badge-premium text-sm">
            <Sparkles className="w-4 h-4" />
            Cinema bajo las estrellas
          </div>

          {/* Main Title */}
          <h1 className="text-display text-6xl md:text-8xl font-bold text-soft-beige leading-tight tracking-tight">
            CineClub{" "}
            <span className="gradient-sunset bg-clip-text text-transparent">
              Puff & Chill
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-subtitle text-xl md:text-2xl text-soft-gray max-w-2xl mx-auto">
            Disfruta de películas clásicas bajo un cielo estrellado. 
            Una experiencia única de cine silente con membresías exclusivas.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-responsive text-soft-beige/80">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-soft-gold" />
              Cine al aire libre
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-soft-gold" />
              Membresías premium
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-soft-gold" />
              Experiencias únicas
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button
              variant="premium"
              size="lg"
              className="shadow-premium hover:shadow-premium/80 transition-base group"
              asChild
            >
              <Link href="/memberships">
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Obtener Membresía Premium
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="shadow-glow hover:shadow-glow/80 transition-base"
              asChild
            >
              <Link href="/events">
                Ver Próximos Eventos
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <GlassCard variant="subtle" className="text-center" style={{ padding: "var(--spacing-lg)" }}>
            <div className="text-display text-3xl font-bold text-soft-gold">50+</div>
            <div className="text-responsive text-soft-gray">Películas Clásicas</div>
          </GlassCard>
          
          <GlassCard variant="premium" className="text-center" style={{ padding: "var(--spacing-lg)" }}>
            <div className="text-display text-3xl font-bold text-soft-beige">3</div>
            <div className="text-responsive text-soft-gray">Niveles de Membresía</div>
          </GlassCard>
          
          <GlassCard variant="subtle" className="text-center" style={{ padding: "var(--spacing-lg)" }}>
            <div className="text-display text-3xl font-bold text-sunset-orange">100%</div>
            <div className="text-responsive text-soft-gray">Experiencia Premium</div>
          </GlassCard>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-soft-beige/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-soft-beige/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
} 