'use client'

import { useState, useMemo } from 'react'
import { Product } from '@prisma/client'
import { Search, Filter, Package2, Coffee, Cookie, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/app/components/products/ProductCard'

interface ShopClientComponentProps {
	initialProducts: Product[]
	categorizedProducts: {
		snacks: Product[]
		beverages: Product[]
		combos: Product[]
		special: Product[]
	}
}

const categories = [
	{ id: 'all', name: 'Todos', icon: Package2, color: 'from-sunset-orange to-soft-gold' },
	{ id: 'snacks', name: 'Snacks', icon: Cookie, color: 'from-warm-red to-sunset-orange' },
	{ id: 'beverages', name: 'Bebidas', icon: Coffee, color: 'from-deep-blue to-soft-blue' },
	{ id: 'combos', name: 'Combos', icon: Sparkles, color: 'from-soft-gold to-warm-yellow' },
	{ id: 'special', name: 'Especiales', icon: Sparkles, color: 'from-deep-purple to-soft-purple' }
]

export function ShopClientComponent({ initialProducts, categorizedProducts }: ShopClientComponentProps) {
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState<'name' | 'price'>('name')

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

	return (
		<div className="space-y-8">
			{/* Filters and Search */}
			<div className="bg-soft-gray/5 backdrop-blur-sm border border-soft-gray/10 rounded-3xl p-6">
				<div className="space-y-6">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-beige/40" />
						<input
							type="text"
							placeholder="Buscar productos..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3 bg-deep-night/50 border border-soft-gray/20 rounded-2xl text-soft-beige placeholder-soft-beige/40 focus:outline-none focus:border-sunset-orange/50 transition-colors duration-300"
						/>
					</div>

					{/* Categories */}
					<div className="flex flex-wrap gap-3">
						{categories.map((category) => {
							const Icon = category.icon
							return (
								<button
									key={category.id}
									onClick={() => setSelectedCategory(category.id)}
									className={`
										flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300
										${selectedCategory === category.id
											? `bg-gradient-sunset-gold text-deep-night shadow-lg transform scale-105`
											: 'bg-soft-gray/10 text-soft-beige hover:bg-soft-gray/20'
										}
									`}
								>
									<Icon className="w-4 h-4" />
									<span className="font-medium">{category.name}</span>
								</button>
							)
						})}
					</div>

					{/* Sort Options */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2 text-soft-beige/70">
							<Filter className="w-4 h-4" />
							<span className="text-sm">{filteredProducts.length} productos</span>
						</div>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
							className="px-4 py-2 bg-deep-night/50 border border-soft-gray/20 rounded-xl text-soft-beige text-sm focus:outline-none focus:border-sunset-orange/50 transition-colors duration-300"
						>
							<option value="name">Ordenar por nombre</option>
							<option value="price">Ordenar por precio</option>
						</select>
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
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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