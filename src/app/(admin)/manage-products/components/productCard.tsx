import React, { useState } from 'react'

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
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition w-full max-w-xs mx-auto">
            <div className="relative w-full h-48 bg-gray-900 flex items-center justify-center">
                {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 text-4xl">
                        <span>🛒</span>
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description || 'Sin descripción'}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-orange-400 font-semibold text-lg">${product.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                    </span>
                </div>
                <div className="flex gap-2 mt-4">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(product.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded transition"
                        >
                            Editar
                        </button>
                    )}
                    {onDelete && (
                        <>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded transition"
                            >
                                Eliminar
                            </button>
                            {showModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
                                        <h4 className="text-lg font-semibold text-white mb-4">¿Eliminar producto?</h4>
                                        <p className="text-gray-300 mb-6">
                                            ¿Estás seguro de que deseas eliminar <span className="font-bold">{product.name}</span>?
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Eliminar
                                            </button>
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