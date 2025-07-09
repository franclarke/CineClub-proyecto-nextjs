'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  className?: string
  label?: string
  href?: string
}

export function BackButton({ className, label = 'Volver', href }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group flex items-center space-x-2 px-4 py-2.5",
        "bg-soft-gray/5 hover:bg-soft-gray/15",
        "text-soft-beige/80 hover:text-sunset-orange",
        "rounded-xl border border-soft-gray/10 hover:border-soft-gray/20",
        "transition-all duration-300 ease-out",
        "hover:transform hover:-translate-x-1",
        "focus:outline-none focus:ring-2 focus:ring-sunset-orange/50 focus:ring-offset-2 focus:ring-offset-deep-night",
        className
      )}
      aria-label={label}
    >
      <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
} 