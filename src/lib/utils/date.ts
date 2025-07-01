import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Formatea una fecha de manera consistente entre servidor y cliente
 * @param date - Fecha a formatear (string ISO o Date)
 * @param formatStr - Formato de date-fns
 * @returns Fecha formateada
 */
export function formatDate(date: string | Date, formatStr: string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

/**
 * Obtiene el día del mes
 * @param date - Fecha (string ISO o Date)
 * @returns Día del mes
 */
export function getDay(date: string | Date): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj.getDate()
}

/**
 * Formatea fecha corta (ej: "15 ene")
 * @param date - Fecha (string ISO o Date)
 * @returns Fecha formateada
 */
export function formatShortDate(date: string | Date): string {
  return formatDate(date, 'd MMM')
}

/**
 * Formatea hora (ej: "20:30")
 * @param date - Fecha (string ISO o Date)
 * @returns Hora formateada
 */
export function formatTime(date: string | Date): string {
  return formatDate(date, 'HH:mm')
}

/**
 * Formatea día de la semana corto en mayúsculas (ej: "VIE")
 * @param date - Fecha (string ISO o Date)
 * @returns Día de la semana
 */
export function formatWeekdayShort(date: string | Date): string {
  return formatDate(date, 'EEE').toUpperCase()
}

/**
 * Formatea fecha completa (ej: "viernes, 15 de enero de 2024")
 * @param date - Fecha (string ISO o Date)
 * @returns Fecha completa formateada
 */
export function formatFullDate(date: string | Date): string {
  return formatDate(date, "EEEE, d 'de' MMMM 'de' yyyy")
}

/**
 * Formatea mes corto (ej: "ene")
 * @param date - Fecha (string ISO o Date)
 * @returns Mes corto
 */
export function formatMonthShort(date: string | Date): string {
  return formatDate(date, 'MMM')
}

/**
 * Compara si una fecha es pasada
 * @param date - Fecha a comparar
 * @returns true si la fecha es pasada
 */
export function isPastDate(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  return dateObj < now
} 