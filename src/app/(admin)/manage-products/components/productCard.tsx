import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'

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
    const [showModal, setShowModal] = useState(false)

    const handleDelete = () => {
        setShowModal(false)
        if (onDelete) onDelete(product.id)
    }

    return (
        <div className="card-modern overflow-hidden flex flex-col hover-lift w-full max-w-xs mx-auto">
            <div className="relative w-full h-48 bg-soft-gray/10 flex items-center justify-center">
                {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-soft-beige/30 text-4xl">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-soft-beige mb-1">{product.name}</h3>
                <p className="text-soft-beige/70 text-sm mb-2 line-clamp-2">{product.description || 'Sin descripción'}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-sunset-orange font-semibold text-lg">${product.price}</span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-dark-olive/20 text-dark-olive border-dark-olive/30' : 'bg-warm-red/20 text-warm-red border-warm-red/30'}`}>
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
                        <>
                            <Button
                                onClick={() => setShowModal(true)}
                                variant="outline"
                                size="sm"
                                className="flex-1 border-warm-red text-warm-red hover:bg-warm-red/10"
                            >
                                Eliminar
                            </Button>
                            {showModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="card-modern p-6 shadow-soft max-w-md w-full mx-4">
                                        <h4 className="text-lg font-semibold text-soft-beige mb-4">¿Eliminar producto?</h4>
                                        <p className="text-soft-beige/70 mb-6">
                                            ¿Estás seguro de que deseas eliminar <span className="font-bold text-soft-beige">{product.name}</span>?
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                onClick={() => setShowModal(false)}
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                onClick={handleDelete}
                                                variant="outline"
                                                size="sm"
                                                className="border-warm-red text-warm-red hover:bg-warm-red/10"
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}