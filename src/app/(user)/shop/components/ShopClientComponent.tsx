'use client'

import { useState, useMemo } from 'react'
import { Product } from '@prisma/client'
import { Search, Package2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/app/components/products/ProductCard'
import { useRouter } from 'next/navigation'

interface ShopClientComponentProps {
	initialProducts: Product[]
	categorizedProducts: {
		snacks: Product[]
		beverages: Product[]
		combos: Product[]
		special: Product[]
	}
}

export function ShopClientComponent({ initialProducts, categorizedProducts }: ShopClientComponentProps) {
	const [selectedCategory] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy] = useState<'name' | 'price'>('name')
	const [isRefreshing, setIsRefreshing] = useState(false)
	const router = useRouter()

	// Filtrar y ordenar productos
	const filteredProducts = useMemo(() => {
		let products = selectedCategory === 'all' 
			? initialProducts 
			: categorizedProducts[selectedCategory as keyof typeof categorizedProducts] || []

		// Aplicar búsqueda
		if (searchQuery) {
			products = products.filter(p => 
				p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.description?.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		// Ordenar
		return [...products].sort((a, b) => {
			if (sortBy === 'name') return a.name.localeCompare(b.name)
			return a.price - b.price
		})
	}, [selectedCategory, searchQuery, sortBy, initialProducts, categorizedProducts])

	const handleRefresh = async () => {
		setIsRefreshing(true)
		try {
			// Limpiar caché
			await fetch('/api/products/clear-cache', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			})
			// Recargar la página
			router.refresh()
		} catch (error) {
			console.error('Error refreshing:', error)
		} finally {
			setIsRefreshing(false)
		}
	}

	return (
		<div className="space-y-8">
			{/* Filters and Search */}
			<div className="bg-soft-gray/5 backdrop-blur-sm border border-soft-gray/10 rounded-3xl p-6">
				<div className="space-y-6">
					{/* Search Bar and Refresh Button */}
					<div className="flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-beige/40" />
							<input
								type="text"
								placeholder="Buscar productos..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-deep-night/50 border border-soft-gray/20 rounded-2xl text-soft-beige placeholder-soft-beige/40 focus:outline-none focus:border-sunset-orange/50 transition-colors duration-300"
							/>
						</div>
						<button
							onClick={handleRefresh}
							disabled={isRefreshing}
							className="p-3 bg-sunset-orange/10 border border-sunset-orange/20 rounded-2xl text-sunset-orange hover:bg-sunset-orange/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							title="Refrescar productos"
						>
							<RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Products Grid */}
			<AnimatePresence mode="wait">
				<motion.div
					key={selectedCategory + searchQuery}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</motion.div>
			</AnimatePresence>

			{/* Empty State */}
			{filteredProducts.length === 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-16"
				>
					<Package2 className="w-16 h-16 text-soft-beige/20 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-soft-beige/60 mb-2">
						No se encontraron productos
					</h3>
					<p className="text-soft-beige/40">
						Intenta con otros filtros o términos de búsqueda
					</p>
				</motion.div>
			)}
		</div>
	)
} 