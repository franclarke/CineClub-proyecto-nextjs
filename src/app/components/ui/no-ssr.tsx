'use client'

import { useHydration } from '@/app/hooks/use-hydration'
import { ReactNode } from 'react'

interface NoSSRProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que solo renderiza su contenido en el cliente
 * Útil para evitar errores de hidratación con componentes que dependen del cliente
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const isHydrated = useHydration()
  
  if (!isHydrated) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 