import { Event, Reservation, Seat, User, MembershipTier, Product, OrderItem } from '@prisma/client'

export interface PaginationData {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination: PaginationData;
}

export type EventWithCount = Event & {
	_count: {
		reservations: number
	}
}

export type ReservationWithDetails = Reservation & {
	seat: Seat
	event: EventWithCount
	user: User & {
		membership: MembershipTier
	}
}

export type EventWithReservations = {
	event: EventWithCount
	reservations: ReservationWithDetails[]
}

export type ReservationsByEvent = Record<string, EventWithReservations>

export type CartItem = OrderItem & {
	product: Product
}

export interface CheckoutData {
	reservation: Reservation & {
		seat: Seat
		event: Event
		expiresAt: Date
	}
	event: Event
	seat: Seat
	cartItems: CartItem[]
	availableProducts: Product[]
	membershipDiscount: number
	total: number
} 
