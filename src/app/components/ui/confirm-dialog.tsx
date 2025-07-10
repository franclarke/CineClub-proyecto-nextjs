'use client'

import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from './button'
import { GlassCard } from './glass-card'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    loading?: boolean
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'warning',
    loading = false
}: ConfirmDialogProps) {
    // Manejar escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !loading) {
                onClose()
            }
        }
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose, loading])

    if (!isOpen) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !loading) {
            onClose()
        }
    }

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconColor: 'text-warm-red',
                    borderColor: 'border-warm-red/30',
                    confirmButton: 'bg-warm-red hover:bg-warm-red/90 text-white'
                }
            case 'warning':
                return {
                    iconColor: 'text-sunset-orange',
                    borderColor: 'border-sunset-orange/30',
                    confirmButton: 'bg-sunset-orange hover:bg-sunset-orange/90 text-white'
                }
            default:
                return {
                    iconColor: 'text-soft-beige',
                    borderColor: 'border-soft-beige/30',
                    confirmButton: 'bg-soft-beige hover:bg-soft-beige/90 text-deep-night'
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
        >
            <GlassCard 
                className={`w-full max-w-md mx-4 p-6 border ${styles.borderColor} animate-scale-in`}
            >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-soft-gray/10 flex items-center justify-center ${styles.iconColor}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-soft-beige mb-2">
                            {title}
                        </h3>
                        <p className="text-soft-beige/70 leading-relaxed">
                            {message}
                        </p>
                    </div>
                    {!loading && (
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-1 text-soft-beige/50 hover:text-soft-beige transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        disabled={loading}
                        className="min-w-[100px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        loading={loading}
                        className={`min-w-[100px] ${styles.confirmButton}`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
} 