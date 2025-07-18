import { prisma } from '@/lib/prisma'
import { ShopClientComponent } from './ShopClientComponent'

export async function ShopDataAccess() {
	// Obtener todos los productos disponibles sin caché
	const products = await prisma.product.findMany({
		where: {
			stock: {
				gt: 0
			}
		},
		orderBy: {
			name: 'asc'
		}
	})

	// Categorizar productos
	const categorizedProducts = {
		snacks: products.filter(p => 
			p.name.toLowerCase().includes('popcorn') || 
			p.name.toLowerCase().includes('nachos') ||
			p.name.toLowerCase().includes('caramelos') ||
			p.name.toLowerCase().includes('dulces')
		),
		beverages: products.filter(p => 
			p.name.toLowerCase().includes('coca') || 
			p.name.toLowerCase().includes('agua') ||
			p.name.toLowerCase().includes('bebida') ||
			p.name.toLowerCase().includes('jugo')
		),
		combos: products.filter(p => 
			p.name.toLowerCase().includes('combo')
		),
		special: products.filter(p => 
			!p.name.toLowerCase().includes('popcorn') && 
			!p.name.toLowerCase().includes('nachos') &&
			!p.name.toLowerCase().includes('coca') && 
			!p.name.toLowerCase().includes('agua') &&
			!p.name.toLowerCase().includes('combo') &&
			!p.name.toLowerCase().includes('caramelos') &&
			!p.name.toLowerCase().includes('dulces') &&
			!p.name.toLowerCase().includes('bebida') &&
			!p.name.toLowerCase().includes('jugo')
		)
	}

	return <ShopClientComponent initialProducts={products} categorizedProducts={categorizedProducts} />
} 