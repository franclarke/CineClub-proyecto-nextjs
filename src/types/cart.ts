import { Product, Event, Seat, MembershipTier } from '@prisma/client'

// Tipo base para elementos del carrito
export interface BaseCartItem {
	id: string
	type: 'product' | 'seat'
	quantity: number
	unitPrice: number
	totalPrice: number
	addedAt: Date
}

// Item de producto en el carrito
export interface ProductCartItem extends BaseCartItem {
	type: 'product'
	product: Product
	quantity: number // Cantidad de este producto
}

// Item de seat/reserva en el carrito
export interface SeatCartItem extends BaseCartItem {
	type: 'seat'
	quantity: 1 // Los seats siempre tienen cantidad 1
	event: Event
	seat: Seat
	eventId: string
	seatId: string
	tier: string
	seatNumber: number
	expiresAt?: Date // Para reservas temporales
}

// Unión de todos los tipos de items del carrito
export type CartItem = ProductCartItem | SeatCartItem

// Estado completo del carrito
export interface CartState {
	items: CartItem[]
	isOpen: boolean
	isLoading: boolean
	totalItems: number
	subtotal: number
	discount: number
	total: number
	membershipDiscount: number
}

// Acciones del carrito
export type CartAction = 
	| { type: 'ADD_PRODUCT'; payload: { product: Product; quantity: number } }
	| { type: 'ADD_SEAT'; payload: { event: Event; seat: Seat; expiresAt?: Date } }
	| { type: 'UPDATE_PRODUCT_QUANTITY'; payload: { productId: string; quantity: number } }
	| { type: 'REMOVE_ITEM'; payload: { itemId: string } }
	| { type: 'CLEAR_EXPIRED_SEATS' }
	| { type: 'CLEAR_CART' }
	| { type: 'TOGGLE_CART' }
	| { type: 'SET_LOADING'; payload: boolean }
	| { type: 'SYNC_WITH_SERVER'; payload: { items: CartItem[]; user?: { membership: MembershipTier } } }

// Contexto del carrito
export interface CartContextType {
	state: CartState
	dispatch: React.Dispatch<CartAction>
	// Métodos de conveniencia
	addProduct: (product: Product, quantity?: number) => void
	addSeat: (event: Event, seat: Seat, expiresAt?: Date) => void
	removeItem: (itemId: string) => void
	updateProductQuantity: (productId: string, quantity: number) => void
	clearCart: () => void
	toggleCart: () => void
	// Utilidades
	getProductQuantity: (productId: string) => number
	hasSeat: (eventId: string, seatId: string) => boolean
	getExpiredSeats: () => SeatCartItem[]
}

// Opciones de configuración del carrito
export interface CartConfig {
	maxProductQuantity: number
	seatReservationTimeoutMinutes: number
	autoSyncWithServer: boolean
	persistToLocalStorage: boolean
} 
