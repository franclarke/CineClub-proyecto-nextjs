'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para manejar la hidratación y evitar diferencias entre servidor y cliente
 * Útil para componentes que dependen de valores que pueden cambiar entre servidor y cliente
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook para obtener la fecha actual de forma segura en hidratación
 * @returns Date actual o null si no está hidratado
 */
export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated) {
      setCurrentDate(new Date())
      // Actualizar cada minuto
      const interval = setInterval(() => {
        setCurrentDate(new Date())
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [isHydrated])

  return currentDate
}

/**
 * Hook para verificar si una fecha es pasada de forma segura
 * @param dateString - Fecha a verificar
 * @returns boolean o null si no está hidratado
 */
export function useIsPastDate(dateString: string) {
  const currentDate = useCurrentDate()
  
  if (!currentDate) return null
  
  return new Date(dateString) < currentDate
}

/**
 * Hook para formatear fechas de forma consistente
 * @param dateString - Fecha a formatear
 * @returns Objeto con formatos de fecha o null si no está hidratado
 */
export function useDateFormatter(dateString: string) {
  const isHydrated = useHydration()
  
  if (!isHydrated) return null
  
  const date = new Date(dateString)
  
  return {
    isValid: !isNaN(date.getTime()),
    toLocaleDateString: (options?: Intl.DateTimeFormatOptions) => 
      date.toLocaleDateString('es-ES', options),
    toLocaleTimeString: (options?: Intl.DateTimeFormatOptions) => 
      date.toLocaleTimeString('es-ES', options),
    valueOf: () => date.valueOf()
  }
} 