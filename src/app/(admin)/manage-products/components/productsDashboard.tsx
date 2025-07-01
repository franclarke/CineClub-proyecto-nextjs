'use client'

import React, { useEffect, useState } from 'react'
import { getAllProducts, addProduct, deleteProduct, getProductById } from '../data-access'
import ProductCard from './productCard'

interface Product {
    id: string
    name: string
    description?: string
    price: number
    stock: number
    imageUrl?: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <div className="max-w-6xl mt-10 mx-auto py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-white">Administrar Productos</h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Buscador */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="h-10 px-10 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 w-full focus:outline-none focus:border-orange-500 transition placeholder-gray-400"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {/* Icono lupa */}
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                    </div>
                    {/* Botón agregar */}
                    <button
                        className="h-10 bg-orange-600 hover:bg-orange-700 text-white px-4 rounded-lg w-full sm:w-auto flex items-center justify-center gap-2 transition font-semibold"
                        onClick={() => {
                            setShowForm(true)
                            setEditId(null)
                            setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
                        }}
                    >
                        {/* Icono + solo en móvil, texto en desktop */}
                        <span >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </span>

                    </button>
                </div>
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
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg border border-green-400/40 font-semibold text-base">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg border border-green-400/40 font-semibold text-base">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-2xl shadow-lg border border-red-400/40 font-semibold text-base">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {error}
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-800 rounded-xl p-8 shadow-2xl w-full max-w-md mx-auto space-y-4 border border-gray-700"
                    >
                        <h2 className="text-xl font-bold text-white mb-2">{editId ? 'Editar producto' : 'Agregar nuevo producto'}</h2>
                        <div>
                            <label className="block text-gray-300 mb-1">Nombre *</label>
                            <input
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Descripción</label>
                            <textarea
                                className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Imagen</label>
                            <div className="flex justify-center">
                                <label
                                    htmlFor="product-image"
                                    className="flex flex-col items-center justify-center w-40 h-40 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 transition group"
                                >
                                    {form.imageUrl ? (
                                        <img
                                            src={form.imageUrl}
                                            alt="Vista previa"
                                            className="object-cover w-full h-full rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-orange-400 transition">
                                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span className="font-semibold">Agregar Imagen</span>
                                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</span>
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
                                <label className="block text-gray-300 mb-1">Precio *</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    required
                                    min={0}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-300 mb-1">Stock *</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700"
                                    value={form.stock}
                                    onChange={e => setForm({ ...form, stock: e.target.value })}
                                    required
                                    min={0}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold"
                                onClick={() => { setAddSuccess(true) }}
                            >
                                {editId ? 'Guardar cambios' : 'Agregar'}

                            </button>
                            <button
                                type="button"
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded w-full font-semibold"
                                onClick={() => {
                                    setShowForm(false)
                                    setEditId(null)

                                    setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' })
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-gray-400">Cargando productos...</div>
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
                        <div className="col-span-full text-center text-gray-400 py-6">
                            No hay productos cargados.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}