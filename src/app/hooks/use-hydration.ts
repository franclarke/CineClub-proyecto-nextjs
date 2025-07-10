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

 