'use client'

import React, { useEffect, useState } from 'react'
import { getAllProducts, addProduct, deleteProduct, getProductById } from '../data-access'
import ProductCard from './productCard'
import { BackButton } from '@/app/components/ui/back-button'
import { Button } from '@/app/components/ui/button'

interface Product {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    imageUrl?: string
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

    // Ocultar mensaje de success automáticamente
    useEffect(() => {
        if (deleteSuccess) {
            const timer = setTimeout(() => setDeleteSuccess(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [deleteSuccess])

    useEffect(() => {
        if (addSuccess) {
            const timer = setTimeout(() => setAddSuccess(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [addSuccess])

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        try {
            if (!form.name || !form.price || !form.stock) {
                setError('Completa todos los campos obligatorios')
                return
            }
            if (editId) {
                // Editar producto
                // await updateProduct(editId, { ...form, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl })
                setError('Función de edición no implementada')
            } else {
                await addProduct({
                    name: form.name,
                    description: form.description,
                    price: Number(form.price),
                    stock: Number(form.stock),

                })
            }
            setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
            setEditId(null)
            setShowForm(false)
            fetchProducts()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            setError('Error al guardar el producto')
        }
    }

    // Handle delete
    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id)
            setDeleteSuccess(true)
            fetchProducts()
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                    imageUrl: '',
                })
                setEditId(id)
                setShowForm(true)
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            setError('Error al cargar el producto')
        }
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
                            setShowForm(true)
                            setEditId(null)
                            setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
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
                        <div className="flex items-center gap-2 bg-dark-olive text-soft-beige px-6 py-3 rounded-2xl shadow-soft border border-dark-olive/40 font-semibold text-base">
                            <svg className="w-5 h-5 text-soft-beige" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Producto eliminado correctamente
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
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Producto agregado correctamente
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <form
                            onSubmit={handleSubmit}
                            className="card-modern p-8 shadow-soft w-full max-w-md mx-4 space-y-4"
                        >
                            <h2 className="text-xl font-bold text-soft-beige mb-2">
                                {editId ? 'Editar producto' : 'Agregar nuevo producto'}
                            </h2>
                            <div>
                                <label className="block text-soft-beige/70 mb-2">Nombre *</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-soft-beige/70 mb-2">Descripción</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base resize-none"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-soft-beige/70 mb-2">Imagen</label>
                                <div className="flex justify-center">
                                    <label
                                        htmlFor="product-image"
                                        className="flex flex-col items-center justify-center w-40 h-40 bg-soft-gray/10 border-2 border-dashed border-soft-gray/30 rounded-xl cursor-pointer hover:border-sunset-orange transition-base group"
                                    >
                                        {form.imageUrl ? (
                                            <img
                                                src={form.imageUrl}
                                                alt="Vista previa"
                                                className="object-cover w-full h-full rounded-xl"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-soft-beige/50 group-hover:text-sunset-orange transition-base">
                                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                                <span className="font-semibold">Agregar Imagen</span>
                                                <span className="text-xs text-soft-beige/40 mt-1">PNG, JPG, JPEG</span>
                                            </div>
                                        )}
                                        <input
                                            id="product-image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setForm(prev => ({
                                                            ...prev,
                                                            imageUrl: reader.result as string
                                                        }))
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-soft-beige/70 mb-2">Precio *</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        required
                                        min={0}
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
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    onClick={() => { setAddSuccess(true) }}
                                >
                                    {editId ? 'Guardar cambios' : 'Agregar'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditId(null)
                                        setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
                                    }}
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
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}