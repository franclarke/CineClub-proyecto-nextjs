'use client'

import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = 'Procesando...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-night/80 backdrop-blur-sm">
      <div className="bg-deep-night/90 border border-soft-gray/20 rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-sunset-orange" />
        <p className="text-soft-beige font-medium">{message}</p>
      </div>
    </div>
  )
} 