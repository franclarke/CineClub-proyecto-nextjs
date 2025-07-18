'use client'

import React, { useEffect, useState } from 'react'
import { getAllProducts, addProduct, deleteProduct, getProductById, updateProduct } from '../data-access'
import ProductCard from './productCard'
import { BackButton } from '@/app/components/ui/back-button'
import { Button } from '@/app/components/ui/button'
import { uploadProductImage } from '@/lib/supabase'

interface Product {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    imageUrl?: string
}

// Image Upload Component
interface ImageUploadProps {
    currentImageUrl?: string
    onImageSelect: (file: File | null) => void
    onError: (error: string) => void
    onImageRemove?: () => void
    onRegenerateImage?: () => void
    isGenerating?: boolean
    productName?: string
}

function ImageUpload({ currentImageUrl, onImageSelect, onError, onImageRemove, onRegenerateImage, isGenerating, productName }: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    useEffect(() => {
        setPreviewUrl(currentImageUrl || null)
    }, [currentImageUrl])

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            onError('Solo se permiten archivos JPG, PNG o WebP')
            return
        }

        // Validate file size (max 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024
        if (file.size > maxSizeInBytes) {
            onError('El archivo no puede superar los 5MB')
            return
        }

        setSelectedFile(file)
        onImageSelect(file)
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleRemove = () => {
        setPreviewUrl(null)
        setSelectedFile(null)
        onImageSelect(null)
        // Call the image removal callback if provided
        if (onImageRemove) {
            onImageRemove()
        }
        // Reset the file input
        const fileInput = document.getElementById('image-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <label className="block text-soft-beige/70">Imagen del producto</label>
            </div>
            
            {/* Image Preview or Upload Area */}
            {previewUrl ? (
                <div className="relative inline-block">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-2xl border-2 border-soft-gray/20 shadow-lg"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-warm-red text-soft-beige rounded-full flex items-center justify-center text-sm hover:bg-warm-red/80 transition-colors shadow-lg"
                    >
                        ×
                    </button>
                    <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-soft-beige text-sm font-medium">Cambiar</span>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-gradient-to-br from-sunset-orange/20 to-sunset-orange/10 border-2 border-dashed border-sunset-orange/40 rounded-2xl hover:from-sunset-orange/30 hover:to-sunset-orange/20 hover:border-sunset-orange/60 transition-all duration-300 group"
                    >
                        <svg className="w-8 h-8 text-sunset-orange/70 group-hover:text-sunset-orange mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-soft-beige font-medium group-hover:text-sunset-orange/90 transition-colors">
                            Seleccionar imagen
                        </span>
                        <span className="text-soft-beige/50 text-sm mt-1">
                            o arrastra y suelta aquí
                        </span>
                    </label>
                </div>
            )}
        </div>
    )
}

export default function ProductsDashboard() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' })
    const [editId, setEditId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [addSuccess, setAddSuccess] = useState(false)
    const [editSuccess, setEditSuccess] = useState(false)
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [imageRemoved, setImageRemoved] = useState(false)
    const [generatingImage, setGeneratingImage] = useState(false)
    const [imageGeneratedSuccess, setImageGeneratedSuccess] = useState(false)
    // Estado para loading de descripción
    const [generatingDescription, setGeneratingDescription] = useState(false)

    // Ocultar mensajes de success automáticamente
    useEffect(() => {
        if (deleteSuccess) {
            const timer = setTimeout(() => setDeleteSuccess(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [deleteSuccess])

    useEffect(() => {
        if (addSuccess) {
            const timer = setTimeout(() => setAddSuccess(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [addSuccess])

    useEffect(() => {
        if (editSuccess) {
            const timer = setTimeout(() => setEditSuccess(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [editSuccess])

    useEffect(() => {
        if (imageGeneratedSuccess) {
            const timer = setTimeout(() => setImageGeneratedSuccess(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [imageGeneratedSuccess])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    // Fetch all products
    const fetchProducts = async () => {
        setLoading(true)
        try {
            const data = await getAllProducts()
            setProducts(
                data.map((prod: any) => ({
                    ...prod,
                    description: prod.description ?? undefined,
                    imageUrl: prod.imageUrl ?? undefined,
                }))
            )
        } catch (e) {
            setError('Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Handle add or edit product
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        
        try {
            if (!form.name || !form.price || !form.stock) {
                setError('Completa todos los campos obligatorios')
                return
            }

            let imageUrl: string | undefined = form.imageUrl

            // Determine the final image URL based on the current state
            if (selectedImageFile) {
                // New image file selected - upload it
                const tempId = Date.now().toString()
                const result = await uploadProductImage(selectedImageFile, tempId)
                
                if (result.error) {
                    setError(result.error)
                    return
                }
                
                if (result.url) {
                    imageUrl = result.url
                }
            } else if (imageRemoved || form.imageUrl === '') {
                // Image was explicitly removed or form has empty string
                imageUrl = undefined
            }

            const productData = {
                name: form.name,
                description: form.description || undefined,
                price: Number(form.price),
                stock: Number(form.stock),
                imageUrl: imageUrl
            }

            if (editId) {
                // Editar producto
                await updateProduct(editId, productData)
                setEditSuccess(true)
            } else {
                // Agregar producto
                await addProduct(productData)
                setAddSuccess(true)
            }

            // Reset form
            setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
            setSelectedImageFile(null)
            setImageRemoved(false)
            setEditId(null)
            setShowForm(false)
            fetchProducts()
        } catch (e) {
            setError(editId ? 'Error al actualizar el producto' : 'Error al agregar el producto')
        } finally {
            setSubmitting(false)
        }
    }

    // Handle delete
    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id)
            setDeleteSuccess(true)
            fetchProducts()
            
            // Forzar recarga de la página de la tienda
            try {
                await fetch('/api/products/clear-cache', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            } catch (error) {
                console.error('Error clearing cache:', error)
            }
        } catch (e) {
            setError('Error al eliminar el producto')
        }
    }

    // Handle edit
    const handleEdit = async (id: string) => {
        try {
            const prod = await getProductById(id)
            if (prod) {
                setForm({
                    name: prod.name,
                    description: prod.description || '',
                    price: String(prod.price),
                    stock: String(prod.stock),
                    imageUrl: prod.imageUrl || '',
                })
                setSelectedImageFile(null) // Reset selected file when editing
                setImageRemoved(false) // Reset image removed state when editing
                setEditId(id)
                setShowForm(true)
            }
        } catch (e) {
            setError('Error al cargar el producto')
        }
    }

    // Handle image selection
    const handleImageSelect = (file: File | null) => {
        setSelectedImageFile(file)
        setImageRemoved(false) // Reset image removed state when selecting new file
    }

    // Handle image removal
    const handleImageRemove = () => {
        setImageRemoved(true)
        setSelectedImageFile(null)
        setForm({ ...form, imageUrl: '' })
    }

    // Handle image upload error
    const handleImageError = (errorMessage: string) => {
        setError(errorMessage)
    }

    // Handle AI image generation
    const handleGenerateImage = async () => {
        if (!form.name.trim()) {
            setError('Ingresa el nombre del producto para generar una imagen')
            return
        }

        setGeneratingImage(true)
        setError(null)

        try {
            const response = await fetch('/api/products/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: form.name.trim()
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error generando imagen')
            }

            if (data.success && data.imageData) {
                // Convertir data URL a File para que funcione con el sistema existente
                const response2 = await fetch(data.imageData)
                const blob = await response2.blob()
                const file = new File([blob], `generated-${Date.now()}.png`, { type: 'image/png' })
                
                setSelectedImageFile(file)
                setImageRemoved(false)
                setForm({ ...form, imageUrl: data.imageData })
                setImageGeneratedSuccess(true)
            } else {
                throw new Error('No se pudo generar la imagen')
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error generando imagen con IA')
        } finally {
            setGeneratingImage(false)
        }
    }

    // Handler para generación IA de descripción
    const handleGenerateDescription = async () => {
        if (!form.name.trim()) {
            setError('Ingresa el nombre del producto antes de generar la descripción')
            return
        }
        setGeneratingDescription(true)
        setError(null)
        try {
            const response = await fetch('/api/products/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: form.name.trim() })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Error generando descripción')
            if (data.success && data.description) {
                setForm(prev => ({ ...prev, description: data.description }))
            } else {
                throw new Error('No se pudo generar la descripción')
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error generando descripción con IA')
        } finally {
            setGeneratingDescription(false)
        }
    }

    // Reset form
    const resetForm = () => {
        setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
        setSelectedImageFile(null)
        setImageRemoved(false)
        setEditId(null)
        setShowForm(false)
        setError(null)
        setGeneratingImage(false)
        setImageGeneratedSuccess(false)
        setGeneratingDescription(false) // Reset description generation state
    }

    // Filtrado por nombre
    const filteredProducts = products.filter(prod =>
        prod.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-deep-night pt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton href="/" label="Volver al inicio" />
                </div>
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-display text-3xl sm:text-4xl text-soft-beige mb-2">
                        Administrar Productos
                    </h1>
                    <p className="text-soft-beige/70">
                        Gestiona el catálogo de productos del kiosco
                    </p>
                </div>

                {/* Search and Add Button */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-beige/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <Button
                        onClick={() => {
                            resetForm()
                            setShowForm(true)
                        }}
                        className="flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Agregar Producto
                    </Button>
                </div>

                {/* Mensajes de éxito y error */}
                <div className="relative h-0">
                    {/* Success delete */}
                    <div
                        className={`
                            fixed left-1/2 top-8 z-50 -translate-x-1/2
                            transition-all duration-700
                            ${deleteSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                    >
                        <div className="flex items-center gap-2 bg-warm-red text-soft-beige px-6 py-3 rounded-2xl shadow-soft border border-warm-red/40 font-semibold text-base">
                            <svg className="w-5 h-5 text-soft-beige" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Producto eliminado exitosamente
                        </div>
                    </div>

                    {/* Success add */}
                    <div
                        className={`
                            fixed left-1/2 top-8 z-50 -translate-x-1/2
                            transition-all duration-700
                            ${addSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                    >
                        <div className="flex items-center gap-2 bg-dark-olive text-soft-beige px-6 py-3 rounded-2xl shadow-soft border border-dark-olive/40 font-semibold text-base">
                            <svg className="w-5 h-5 text-soft-beige" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Producto agregado exitosamente
                        </div>
                    </div>

                    {/* Success edit */}
                    <div
                        className={`
                            fixed left-1/2 top-8 z-50 -translate-x-1/2
                            transition-all duration-700
                            ${editSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                    >
                        <div className="flex items-center gap-2 bg-sunset-orange text-soft-beige px-6 py-3 rounded-2xl shadow-soft border border-sunset-orange/40 font-semibold text-base">
                            <svg className="w-5 h-5 text-soft-beige" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Producto editado exitosamente
                        </div>
                    </div>

                    {/* Success image generated */}
                    <div
                        className={`
                            fixed left-1/2 top-8 z-50 -translate-x-1/2
                            transition-all duration-700
                            ${imageGeneratedSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                    >
                        <div className="flex items-center gap-2 bg-sunset-orange text-soft-beige px-6 py-3 rounded-2xl shadow-soft border border-sunset-orange/40 font-semibold text-base">
                            <svg className="w-5 h-5 text-soft-beige" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Imagen generada exitosamente con IA
                        </div>
                    </div>
                    {/* Error */}
                    <div
                        className={`
                            fixed left-1/2 top-8 z-50 -translate-x-1/2
                            transition-all duration-700
                            ${error ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                    >
                        <div className="flex items-center gap-2 bg-warm-red text-soft-beige px-6 py-3 rounded-2xl shadow-soft border border-warm-red/40 font-semibold text-base">
                            <svg className="w-5 h-5 text-soft-beige" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {error}
                        </div>
                    </div>
                </div>

                {/* Modal Form */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <form
                            onSubmit={handleSubmit}
                            className="card-modern p-8 shadow-soft w-full max-w-lg mx-4 space-y-6 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold text-soft-beige mb-4">
                                {editId ? 'Editar producto' : 'Agregar nuevo producto'}
                            </h2>
                            
                            {/* Image Upload */}
                            <ImageUpload
                                currentImageUrl={form.imageUrl}
                                onImageSelect={handleImageSelect}
                                onError={handleImageError}
                                onImageRemove={handleImageRemove}
                                onRegenerateImage={handleGenerateImage}
                                isGenerating={generatingImage}
                                productName={form.name.trim()}
                            />

                            <div>
                                <label className="block text-soft-beige/70 mb-2">Nombre *</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                        placeholder="Nombre del producto"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleGenerateImage}
                                        disabled={!form.name.trim() || generatingImage}
                                        variant="outline"
                                        className="px-4 py-3 border-sunset-orange text-sunset-orange hover:bg-sunset-orange/10 transition-colors"
                                    >
                                        {generatingImage ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin mr-2" />
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                Generar con IA
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {form.name.trim() && (
                                    <p className="text-xs text-soft-beige/50 mt-1">
                                        💡 Ingresa el nombre y usa "Generar con IA" para crear una imagen automáticamente
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-soft-beige/70 mb-2">Descripción</label>
                                <Button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={generatingDescription || !form.name.trim()}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs px-3 py-1 border-sunset-orange text-sunset-orange hover:bg-sunset-orange/10"
                                >
                                    {generatingDescription ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin mr-1" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Generar con IA
                                        </>
                                    )}
                                </Button>
                            </div>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base resize-none"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                placeholder="Descripción del producto (opcional)"
                            />
                            {form.name.trim() && (
                                <p className="text-xs text-soft-beige/50 mt-1">
                                    💡 Usa "Generar con IA" para crear una descripción automática basada en el nombre del producto
                                </p>
                            )}
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-soft-beige/70 mb-2">Precio *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        required
                                        min={0}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-soft-beige/70 mb-2">Stock *</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                        value={form.stock}
                                        onChange={e => setForm({ ...form, stock: e.target.value })}
                                        required
                                        min={0}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-soft-beige border-t-transparent rounded-full animate-spin mr-2" />
                                            {selectedImageFile ? 'Subiendo imagen...' : 'Guardando...'}
                                        </>
                                    ) : (
                                        editId ? 'Guardar cambios' : 'Agregar producto'
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={resetForm}
                                    disabled={submitting}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin mr-3" />
                        <span className="text-soft-beige/70">Cargando productos...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.map(prod => (
                            <ProductCard
                                key={prod.id}
                                product={prod}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center text-soft-beige/70 py-12">
                                <svg className="w-12 h-12 mx-auto mb-4 text-soft-beige/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p>No hay productos cargados.</p>
                                <p className="text-sm text-soft-beige/50 mt-2">
                                    {search ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primer producto'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}