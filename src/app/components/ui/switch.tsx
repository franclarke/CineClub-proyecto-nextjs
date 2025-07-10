'use client'

import { cn } from "@/lib/utils"

interface SwitchProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({ id, checked, onChange, disabled = false, className }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:ring-offset-2 focus:ring-offset-deep-night disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-sunset-orange" : "bg-soft-gray/30",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
} 