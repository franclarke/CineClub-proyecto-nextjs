import { Event, Reservation, Seat, User, MembershipTier } from '@prisma/client'

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