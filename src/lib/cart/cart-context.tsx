'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { CartState, CartAction, CartContextType, CartItem, ProductCartItem, SeatCartItem, CartConfig } from '@/types/cart'
import { Product, Event, Seat } from '@prisma/client'

// Configuración por defecto del carrito
const defaultConfig: CartConfig = {
	maxProductQuantity: 10,
	seatReservationTimeoutMinutes: 15,
	autoSyncWithServer: true,
	persistToLocalStorage: true
}

// Estado inicial del carrito
const initialState: CartState = {
	items: [],
	isOpen: false,
	isLoading: false,
	totalItems: 0,
	subtotal: 0,
	discount: 0,
	total: 0,
	membershipDiscount: 0
}

// Funciones helper para cálculos
const calculateTotals = (items: CartItem[], membershipDiscount: number = 0) => {
	const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)
	const discount = subtotal * (membershipDiscount / 100)
	const total = subtotal - discount
	const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

	return { subtotal, discount, total, totalItems }
}

const generateCartItemId = (type: 'product' | 'seat', id: string, additionalId?: string): string => {
	return additionalId ? `${type}-${id}-${additionalId}` : `${type}-${id}`
}

// Reducer para manejar las acciones del carrito
function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case 'ADD_PRODUCT': {
			const { product, quantity } = action.payload
			const existingItemIndex = state.items.findIndex(
				item => item.type === 'product' && (item as ProductCartItem).product.id === product.id
			)

			let newItems: CartItem[]
			
			if (existingItemIndex >= 0) {
				// Actualizar cantidad del producto existente
				const existingItem = state.items[existingItemIndex] as ProductCartItem
				const newQuantity = Math.min(existingItem.quantity + quantity, defaultConfig.maxProductQuantity)
				
				newItems = state.items.map((item, index) => 
					index === existingItemIndex 
						? {
							...(item as ProductCartItem),
							quantity: newQuantity,
							totalPrice: product.price * newQuantity
						} as ProductCartItem
						: item
				)
			} else {
				// Agregar nuevo producto
				const newItem: ProductCartItem = {
					id: generateCartItemId('product', product.id),
					type: 'product',
					product,
					quantity: Math.min(quantity, defaultConfig.maxProductQuantity),
					unitPrice: product.price,
					totalPrice: product.price * Math.min(quantity, defaultConfig.maxProductQuantity),
					addedAt: new Date()
				}
				newItems = [...state.items, newItem]
			}

			const totals = calculateTotals(newItems, state.membershipDiscount)
			return { ...state, items: newItems, ...totals }
		}

		case 'ADD_SEAT': {
			const { event, seat, expiresAt } = action.payload
			const seatItemId = generateCartItemId('seat', seat.id, event.id)
			
			// Verificar si ya existe esta reserva
			const existingItem = state.items.find(
				item => item.type === 'seat' && item.id === seatItemId
			)
			
			if (existingItem) {
				return state // No agregar duplicados
			}

			// Calcular precio basado en el tier del seat
			const tierPrices = { 'Puff XXL Estelar': 50, 'Reposera Deluxe': 35, 'Banquito': 25 }
			const seatPrice = tierPrices[seat.tier as keyof typeof tierPrices] || 25

			const newItem: SeatCartItem = {
				id: seatItemId,
				type: 'seat',
				event,
				seat,
				eventId: event.id,
				seatId: seat.id,
				tier: seat.tier,
				seatNumber: seat.seatNumber,
				quantity: 1,
				unitPrice: seatPrice,
				totalPrice: seatPrice,
				addedAt: new Date(),
				expiresAt
			}

			const newItems = [...state.items, newItem]
			const totals = calculateTotals(newItems, state.membershipDiscount)
			return { ...state, items: newItems, ...totals }
		}

		case 'UPDATE_PRODUCT_QUANTITY': {
			const { productId, quantity } = action.payload
			
			if (quantity < 1) {
				// Si la cantidad es menor a 1, remover el item
				const newItems = state.items.filter(
					item => !(item.type === 'product' && (item as ProductCartItem).product.id === productId)
				)
				const totals = calculateTotals(newItems, state.membershipDiscount)
				return { ...state, items: newItems, ...totals }
			}

			const newItems = state.items.map(item => {
				if (item.type === 'product' && (item as ProductCartItem).product.id === productId) {
					const newQuantity = Math.min(quantity, defaultConfig.maxProductQuantity)
					return {
						...item,
						quantity: newQuantity,
						totalPrice: item.unitPrice * newQuantity
					}
				}
				return item
			})

			const totals = calculateTotals(newItems, state.membershipDiscount)
			return { ...state, items: newItems, ...totals }
		}

		case 'REMOVE_ITEM': {
			const { itemId } = action.payload
			const newItems = state.items.filter(item => item.id !== itemId)
			const totals = calculateTotals(newItems, state.membershipDiscount)
			return { ...state, items: newItems, ...totals }
		}

		case 'CLEAR_EXPIRED_SEATS': {
			const now = new Date()
			const newItems = state.items.filter(item => {
				if (item.type === 'seat') {
					const seatItem = item as SeatCartItem
					return !seatItem.expiresAt || seatItem.expiresAt > now
				}
				return true
			})
			
			const totals = calculateTotals(newItems, state.membershipDiscount)
			return { ...state, items: newItems, ...totals }
		}

		case 'CLEAR_CART': {
			return { ...initialState, membershipDiscount: state.membershipDiscount }
		}

		case 'TOGGLE_CART': {
			return { ...state, isOpen: !state.isOpen }
		}

		case 'SET_LOADING': {
			return { ...state, isLoading: action.payload }
		}

		case 'SYNC_WITH_SERVER': {
			const { items, user } = action.payload
			const membershipDiscount = user?.membership?.name === 'Oro' ? 15 : 
				user?.membership?.name === 'Plata' ? 10 : 
				user?.membership?.name === 'Bronce' ? 5 : 0

			const totals = calculateTotals(items, membershipDiscount)
			return { 
				...state, 
				items,
				membershipDiscount,
				...totals 
			}
		}

		default:
			return state
	}
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider
interface CartProviderProps {
	children: React.ReactNode
	config?: Partial<CartConfig>
}

export function CartProvider({ children, config = {} }: CartProviderProps) {
	const [state, dispatch] = useReducer(cartReducer, initialState)
	const cartConfig = { ...defaultConfig, ...config }

	// Métodos de conveniencia
	const addProduct = useCallback((product: Product, quantity: number = 1) => {
		dispatch({ type: 'ADD_PRODUCT', payload: { product, quantity } })
	}, [])

	const addSeat = useCallback((event: Event, seat: Seat, expiresAt?: Date) => {
		dispatch({ type: 'ADD_SEAT', payload: { event, seat, expiresAt } })
	}, [])

	const removeItem = useCallback((itemId: string) => {
		dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
	}, [])

	const updateProductQuantity = useCallback((productId: string, quantity: number) => {
		dispatch({ type: 'UPDATE_PRODUCT_QUANTITY', payload: { productId, quantity } })
	}, [])

	const clearCart = useCallback(() => {
		dispatch({ type: 'CLEAR_CART' })
	}, [])

	const toggleCart = useCallback(() => {
		dispatch({ type: 'TOGGLE_CART' })
	}, [])

	// Utilidades
	const getProductQuantity = useCallback((productId: string): number => {
		const item = state.items.find(
			item => item.type === 'product' && (item as ProductCartItem).product.id === productId
		) as ProductCartItem | undefined
		return item?.quantity || 0
	}, [state.items])

	const hasSeat = useCallback((eventId: string, seatId: string): boolean => {
		return state.items.some(
			item => item.type === 'seat' && 
				(item as SeatCartItem).eventId === eventId && 
				(item as SeatCartItem).seatId === seatId
		)
	}, [state.items])

	const getExpiredSeats = useCallback((): SeatCartItem[] => {
		const now = new Date()
		return state.items.filter(item => {
			if (item.type === 'seat') {
				const seatItem = item as SeatCartItem
				return seatItem.expiresAt && seatItem.expiresAt <= now
			}
			return false
		}) as SeatCartItem[]
	}, [state.items])

	// Efectos
	useEffect(() => {
		// Limpiar seats expirados cada minuto
		const interval = setInterval(() => {
			dispatch({ type: 'CLEAR_EXPIRED_SEATS' })
		}, 60000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		// Persistir en localStorage
		if (cartConfig.persistToLocalStorage) {
			localStorage.setItem('puffchill-cart', JSON.stringify(state.items))
		}
	}, [state.items, cartConfig.persistToLocalStorage])

	// Cargar desde localStorage al inicializar
	useEffect(() => {
		if (cartConfig.persistToLocalStorage) {
			const savedCart = localStorage.getItem('puffchill-cart')
			if (savedCart) {
				try {
					const items = JSON.parse(savedCart) as CartItem[]
					dispatch({ type: 'SYNC_WITH_SERVER', payload: { items } })
				} catch (error) {
					console.error('Error loading cart from localStorage:', error)
				}
			}
		}
	}, [cartConfig.persistToLocalStorage])

	const contextValue: CartContextType = {
		state,
		dispatch,
		addProduct,
		addSeat,
		removeItem,
		updateProductQuantity,
		clearCart,
		toggleCart,
		getProductQuantity,
		hasSeat,
		getExpiredSeats
	}

	return (
		<CartContext.Provider value={contextValue}>
			{children}
		</CartContext.Provider>
	)
}

// Hook para usar el contexto
export function useCart() {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
} 
