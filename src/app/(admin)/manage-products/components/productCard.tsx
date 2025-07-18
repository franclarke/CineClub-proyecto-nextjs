import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { ConfirmDialog } from '@/app/components/ui/confirm-dialog'

interface ProductCardProps {
    product: {
        id: string
        name: string
        description?: string
        price: number
        stock: number
        imageUrl?: string
    }
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    const handleDelete = () => {
        setShowDeleteDialog(false)
        if (onDelete) onDelete(product.id)
    }

    const handleImageLoad = () => {
        setImageLoading(false)
        setImageError(false)
    }

    const handleImageError = () => {
        setImageLoading(false)
        setImageError(true)
    }

    return (
        <div className="card-modern overflow-hidden flex flex-col hover-lift w-full max-w-xs mx-auto">
            <div className="relative w-full h-48 bg-soft-gray/10 flex items-center justify-center">
                {product.imageUrl ? (
                    <>
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-soft-gray/10">
                                <div className="w-8 h-8 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={`object-cover w-full h-full transition-opacity duration-300 ${
                                imageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-soft-beige/30">
                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">
                            {imageError ? 'Error cargando imagen' : 'Sin imagen'}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-soft-beige mb-1">{product.name}</h3>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-sunset-orange font-semibold text-lg">
                        ${product.price.toFixed(2)}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${
                        product.stock > 0 
                            ? 'bg-dark-olive/20 text-olive border-dark-olive/30' 
                            : 'bg-warm-red/20 text-warm-red border-warm-red/30'
                    }`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                    </span>
                </div>
                
                <div className="flex gap-2 mt-4">
                    {onEdit && (
                        <Button
                            onClick={() => onEdit(product.id)}
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                        >
                            Editar
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            onClick={() => setShowDeleteDialog(true)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-warm-red text-warm-red hover:bg-warm-red/10"
                        >
                            Eliminar
                        </Button>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="¿Eliminar producto?"
                message={`¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    )
}