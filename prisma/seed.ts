import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Iniciando seed de la base de datos...')

	// Crear tipos de membresía
	const memberships = await Promise.all([
		prisma.membershipTier.upsert({
			where: { name: 'Bronze' },
			update: {},
			create: {
				name: 'Bronze',
				description: 'Membresía básica para disfrutar del cine bajo las estrellas',
				priority: 3,
				price: 15.00,
				benefits: 'Acceso a eventos regulares • Reserva con 7 días de anticipación • Descuento 5% en snacks',
			},
		}),
		prisma.membershipTier.upsert({
			where: { name: 'Silver' },
			update: {},
			create: {
				name: 'Silver',
				description: 'Membresía intermedia con beneficios adicionales',
				priority: 2,
				price: 25.00,
				benefits: 'Acceso prioritario a eventos • Reserva con 14 días de anticipación • Descuento 10% en snacks • Acceso a eventos especiales',
			},
		}),
		prisma.membershipTier.upsert({
			where: { name: 'Gold' },
			update: {},
			create: {
				name: 'Gold',
				description: 'Membresía premium con todos los beneficios',
				priority: 1,
				price: 40.00,
				benefits: 'Acceso VIP a todos los eventos • Reserva con 21 días de anticipación • Bebida gratis por evento • Descuento 15% en snacks • Playlist colaborativa de Spotify • Asientos preferenciales',
			},
		}),
	])

	console.log('✅ Membresías creadas:', memberships.map(m => m.name).join(', '))

	// Crear usuario administrador
	const adminPassword = await bcrypt.hash('admin123', 12)
	const admin = await prisma.user.upsert({
		where: { email: 'admin@puffandchill.com' },
		update: {},
		create: {
			email: 'admin@puffandchill.com',
			password: adminPassword,
			name: 'Administrador',
			membershipId: memberships[2].id, // Gold
			isAdmin: true,
		},
	})

	console.log('✅ Usuario administrador creado:', admin.email)

	// Crear usuarios de prueba
	const userPassword = await bcrypt.hash('user123', 12)
	const users = await Promise.all([
		prisma.user.upsert({
			where: { email: 'carlos@test.com' },
			update: {},
			create: {
				email: 'carlos@test.com',
				password: userPassword,
				name: 'Carlos García',
				membershipId: memberships[0].id, // Bronze
			},
		}),
		prisma.user.upsert({
			where: { email: 'maria@test.com' },
			update: {},
			create: {
				email: 'maria@test.com',
				password: userPassword,
				name: 'María López',
				membershipId: memberships[1].id, // Silver
			},
		}),
		prisma.user.upsert({
			where: { email: 'ana@test.com' },
			update: {},
			create: {
				email: 'ana@test.com',
				password: userPassword,
				name: 'Ana Rodríguez',
				membershipId: memberships[2].id, // Gold
			},
		}),
	])

	console.log('✅ Usuarios de prueba creados:', users.map(u => u.email).join(', '))

	// Crear productos para el kiosco
	const products = await Promise.all([
		prisma.product.upsert({
			where: { name: 'Palomitas Clásicas' },
			update: {},
			create: {
				name: 'Palomitas Clásicas',
				description: 'Palomitas recién hechas con mantequilla',
				price: 8.50,
				stock: 100,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Refresco Cola' },
			update: {},
			create: {
				name: 'Refresco Cola',
				description: 'Bebida refrescante 500ml',
				price: 5.00,
				stock: 50,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Nachos con Queso' },
			update: {},
			create: {
				name: 'Nachos con Queso',
				description: 'Nachos crujientes con salsa de queso',
				price: 12.00,
				stock: 30,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Agua Mineral' },
			update: {},
			create: {
				name: 'Agua Mineral',
				description: 'Agua mineral natural 500ml',
				price: 3.00,
				stock: 80,
			},
		}),
	])

	console.log('✅ Productos creados:', products.map(p => p.name).join(', '))

	// Crear códigos de descuento
	const discounts = await Promise.all([
		prisma.discount.upsert({
			where: { code: 'WELCOME10' },
			update: {},
			create: {
				code: 'WELCOME10',
				description: 'Descuento de bienvenida para nuevos miembros',
				percentage: 10.0,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
			},
		}),
		prisma.discount.upsert({
			where: { code: 'GOLD20' },
			update: {},
			create: {
				code: 'GOLD20',
				description: 'Descuento exclusivo para miembros Gold',
				percentage: 20.0,
				membershipTierId: memberships[2].id, // Solo para Gold
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
			},
		}),
	])

	console.log('✅ Códigos de descuento creados:', discounts.map(d => d.code).join(', '))

	// Crear evento de ejemplo
	const event = await prisma.event.upsert({
		where: { title: 'Noche de Clásicos: Casablanca' },
		update: {},
		create: {
			title: 'Noche de Clásicos: Casablanca',
			description: 'Una noche mágica bajo las estrellas con uno de los clásicos más queridos del cine. Disfruta de Casablanca en un ambiente único con audio silencioso de alta calidad.',
			dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
			location: 'Terraza Principal - Puff & Chill',
			category: 'Drama Clásico',
			imdbId: 'tt0034583', // Casablanca en IMDb
		},
	})

	console.log('✅ Evento creado:', event.title)

	// Crear asientos para el evento
	const seats = []
	const tiers = ['Bronze', 'Silver', 'Gold']
	
	for (let i = 1; i <= 30; i++) {
		const tier = tiers[Math.floor((i - 1) / 10)] // 10 asientos por tier
		seats.push({
			eventId: event.id,
			seatNumber: i,
			tier: tier,
		})
	}

	await prisma.seat.createMany({
		data: seats,
		skipDuplicates: true,
	})

	console.log('✅ Asientos creados: 30 asientos (10 por tier)')

	console.log('🎉 Seed completado exitosamente!')
	console.log('\n📋 Credenciales de prueba:')
	console.log('👤 Admin: admin@puffandchill.com / admin123')
	console.log('👤 Usuario Bronze: carlos@test.com / user123')
	console.log('👤 Usuario Silver: maria@test.com / user123')
	console.log('👤 Usuario Gold: ana@test.com / user123')
}

main()
	.catch((e) => {
		console.error('❌ Error durante el seed:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	}) 