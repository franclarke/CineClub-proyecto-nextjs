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
				priority: 1,
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
				priority: 3,
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

	// Crear productos para el kiosco - AMPLIADO
	const products = await Promise.all([
		// Snacks
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
			where: { name: 'Palomitas Caramelo' },
			update: {},
			create: {
				name: 'Palomitas Caramelo',
				description: 'Palomitas dulces con caramelo artesanal',
				price: 10.00,
				stock: 75,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Nachos con Queso' },
			update: {},
			create: {
				name: 'Nachos con Queso',
				description: 'Nachos crujientes con salsa de queso',
				price: 12.00,
				stock: 50,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Nachos con Guacamole' },
			update: {},
			create: {
				name: 'Nachos con Guacamole',
				description: 'Nachos crujientes con guacamole fresco',
				price: 14.00,
				stock: 40,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Mix de Frutos Secos' },
			update: {},
			create: {
				name: 'Mix de Frutos Secos',
				description: 'Mezcla premium de almendras, nueces y arándanos',
				price: 9.50,
				stock: 60,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Chocolate Artesanal' },
			update: {},
			create: {
				name: 'Chocolate Artesanal',
				description: 'Tableta de chocolate 70% cacao',
				price: 7.00,
				stock: 35,
			},
		}),
		// Bebidas Frías
		prisma.product.upsert({
			where: { name: 'Refresco Cola' },
			update: {},
			create: {
				name: 'Refresco Cola',
				description: 'Bebida refrescante 500ml',
				price: 5.00,
				stock: 80,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Refresco Naranja' },
			update: {},
			create: {
				name: 'Refresco Naranja',
				description: 'Bebida refrescante sabor naranja 500ml',
				price: 5.00,
				stock: 70,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Agua Mineral' },
			update: {},
			create: {
				name: 'Agua Mineral',
				description: 'Agua mineral natural 500ml',
				price: 3.00,
				stock: 120,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Agua Saborizada Limón' },
			update: {},
			create: {
				name: 'Agua Saborizada Limón',
				description: 'Agua saborizada natural sabor limón 500ml',
				price: 4.50,
				stock: 85,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Jugo Natural Naranja' },
			update: {},
			create: {
				name: 'Jugo Natural Naranja',
				description: 'Jugo de naranja recién exprimido 400ml',
				price: 8.00,
				stock: 45,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Smoothie de Frutas' },
			update: {},
			create: {
				name: 'Smoothie de Frutas',
				description: 'Batido natural de frutas mixtas 350ml',
				price: 12.50,
				stock: 30,
			},
		}),
		// Bebidas Calientes
		prisma.product.upsert({
			where: { name: 'Café Americano' },
			update: {},
			create: {
				name: 'Café Americano',
				description: 'Café americano recién molido',
				price: 6.00,
				stock: 90,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Cappuccino' },
			update: {},
			create: {
				name: 'Cappuccino',
				description: 'Cappuccino con leche espumada',
				price: 8.50,
				stock: 65,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Té Chai Latte' },
			update: {},
			create: {
				name: 'Té Chai Latte',
				description: 'Té chai especiado con leche cremosa',
				price: 9.00,
				stock: 40,
			},
		}),
		prisma.product.upsert({
			where: { name: 'Chocolate Caliente' },
			update: {},
			create: {
				name: 'Chocolate Caliente',
				description: 'Chocolate caliente artesanal con marshmallows',
				price: 10.00,
				stock: 50,
			},
		}),
	])

	console.log('✅ Productos creados:', products.length, 'productos')

	// Crear códigos de descuento - AMPLIADO
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
		prisma.discount.upsert({
			where: { code: 'SILVER15' },
			update: {},
			create: {
				code: 'SILVER15',
				description: 'Descuento especial para miembros Silver',
				percentage: 15.0,
				membershipTierId: memberships[1].id, // Solo para Silver
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días
			},
		}),
		prisma.discount.upsert({
			where: { code: 'WEEKEND25' },
			update: {},
			create: {
				code: 'WEEKEND25',
				description: 'Descuento especial de fin de semana',
				percentage: 25.0,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
			},
		}),
		prisma.discount.upsert({
			where: { code: 'BRONZE5' },
			update: {},
			create: {
				code: 'BRONZE5',
				description: 'Descuento para miembros Bronze',
				percentage: 5.0,
				membershipTierId: memberships[0].id, // Solo para Bronze
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
			},
		}),
		prisma.discount.upsert({
			where: { code: 'FIRSTBUY' },
			update: {},
			create: {
				code: 'FIRSTBUY',
				description: 'Descuento para primera compra',
				percentage: 12.0,
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
			},
		}),
	])

	console.log('✅ Códigos de descuento creados:', discounts.map(d => d.code).join(', '))

	// Crear eventos - AMPLIADO
	const events = await Promise.all([
		prisma.event.upsert({
			where: { title: 'Noche de Clásicos: Casablanca' },
			update: {},
			create: {
				title: 'Noche de Clásicos: Casablanca',
				description: 'Una noche mágica bajo las estrellas con uno de los clásicos más queridos del cine. Disfruta de Casablanca en un ambiente único con audio silencioso de alta calidad.',
				dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
				location: 'Terraza Principal - Puff & Chill',
				category: 'Drama Clásico',
				imdbId: 'tt0034583', // Casablanca en IMDb
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Ciencia Ficción: Blade Runner 2049' },
			update: {},
			create: {
				title: 'Ciencia Ficción: Blade Runner 2049',
				description: 'Sumérgete en el futuro distópico de Blade Runner 2049. Una experiencia visual y sonora que te transportará a otro mundo bajo el cielo estrellado.',
				dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // En 14 días
				location: 'Terraza Norte - Puff & Chill',
				category: 'Ciencia Ficción',
				imdbId: 'tt1856101',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Comedia Romántica: La La Land' },
			update: {},
			create: {
				title: 'Comedia Romántica: La La Land',
				description: 'Una noche de romance y música con La La Land. Déjate envolver por la magia de Los Ángeles y sus sueños bajo las estrellas.',
				dateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // En 21 días
				location: 'Jardín Sur - Puff & Chill',
				category: 'Musical Romance',
				imdbId: 'tt3783958',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Thriller Psicológico: El Cisne Negro' },
			update: {},
			create: {
				title: 'Thriller Psicológico: El Cisne Negro',
				description: 'Una experiencia intensa con Natalie Portman en Black Swan. Perfecta para una noche de suspense bajo la luna llena.',
				dateTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // En 28 días
				location: 'Terraza Principal - Puff & Chill',
				category: 'Thriller Psicológico',
				imdbId: 'tt0947798',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Animación: El Viaje de Chihiro' },
			update: {},
			create: {
				title: 'Animación: El Viaje de Chihiro',
				description: 'Una noche familiar con la obra maestra de Studio Ghibli. Magia, aventura y hermosos paisajes bajo el cielo nocturno.',
				dateTime: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // En 35 días
				location: 'Jardín Central - Puff & Chill',
				category: 'Animación Familiar',
				imdbId: 'tt0245429',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Terror Clásico: El Exorcista' },
			update: {},
			create: {
				title: 'Terror Clásico: El Exorcista',
				description: 'Una noche de terror clásico con El Exorcista. Solo para valientes que quieran vivir una experiencia escalofriante bajo las estrellas.',
				dateTime: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // En 42 días
				location: 'Terraza Norte - Puff & Chill',
				category: 'Terror Clásico',
				imdbId: 'tt0070047',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Acción: Mad Max Fury Road' },
			update: {},
			create: {
				title: 'Acción: Mad Max Fury Road',
				description: 'Adrenalina pura con Mad Max: Fury Road. Una experiencia explosiva de acción en el desierto bajo el cielo estrellado.',
				dateTime: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000), // En 49 días
				location: 'Terraza Principal - Puff & Chill',
				category: 'Acción',
				imdbId: 'tt1392190',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
		prisma.event.upsert({
			where: { title: 'Drama Histórico: 1917' },
			update: {},
			create: {
				title: 'Drama Histórico: 1917',
				description: 'Una obra maestra cinematográfica sobre la Primera Guerra Mundial. Una experiencia emotiva e inmersiva bajo las estrellas.',
				dateTime: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // En 56 días
				location: 'Jardín Sur - Puff & Chill',
				category: 'Drama Bélico',
				imdbId: 'tt8579674',
				spotifyUri: 'spotify:playlist:37i9dQZF1DX0XUsuxWHRQd',
			},
		}),
	])

	console.log('✅ Eventos creados:', events.length, 'eventos')

	// Crear asientos para todos los eventos
	let totalSeats = 0
	for (const event of events) {
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
		totalSeats += seats.length
	}

	console.log('✅ Asientos creados:', totalSeats, 'asientos total')

	// Crear algunas reservas de ejemplo
	const casablancaEvent = events.find(e => e.title.includes('Casablanca'))
	const bladeRunnerEvent = events.find(e => e.title.includes('Blade Runner'))
	
	if (casablancaEvent && bladeRunnerEvent) {
		const casablancaSeats = await prisma.seat.findMany({
			where: { eventId: casablancaEvent.id },
			take: 5
		})
		
		const bladeRunnerSeats = await prisma.seat.findMany({
			where: { eventId: bladeRunnerEvent.id },
			take: 3
		})

		// Reservas para Casablanca
		const casablancaReservations = await Promise.all([
			prisma.reservation.create({
				data: {
					userId: users[0].id, // Carlos
					eventId: casablancaEvent.id,
					seatId: casablancaSeats[0].id,
					status: 'confirmed',
				}
			}),
			prisma.reservation.create({
				data: {
					userId: users[1].id, // María
					eventId: casablancaEvent.id,
					seatId: casablancaSeats[1].id,
					status: 'confirmed',
				}
			}),
			prisma.reservation.create({
				data: {
					userId: users[2].id, // Ana
					eventId: casablancaEvent.id,
					seatId: casablancaSeats[2].id,
					status: 'pending',
				}
			}),
		])

		// Reservas para Blade Runner
		const bladeRunnerReservations = await Promise.all([
			prisma.reservation.create({
				data: {
					userId: users[1].id, // María
					eventId: bladeRunnerEvent.id,
					seatId: bladeRunnerSeats[0].id,
					status: 'confirmed',
				}
			}),
			prisma.reservation.create({
				data: {
					userId: users[2].id, // Ana
					eventId: bladeRunnerEvent.id,
					seatId: bladeRunnerSeats[1].id,
					status: 'pending',
				}
			}),
		])

		console.log('✅ Reservas creadas:', casablancaReservations.length + bladeRunnerReservations.length, 'reservas')

		// Marcar asientos como reservados
		await prisma.seat.updateMany({
			where: {
				id: {
					in: [...casablancaSeats.slice(0, 3), ...bladeRunnerSeats.slice(0, 2)].map(s => s.id)
				}
			},
			data: { isReserved: true }
		})
	}

	// Crear órdenes de ejemplo con items
	const sampleProducts = products.slice(0, 16) // Tomar todos los productos para las órdenes

	const orders = await Promise.all([
		// Orden 1 - Carlos
		prisma.order.create({
			data: {
				userId: users[0].id,
				status: 'paid',
				totalAmount: 25.50,
				items: {
					create: [
						{
							productId: sampleProducts[0].id, // Palomitas Clásicas
							quantity: 2,
							price: 8.50,
						},
						{
							productId: sampleProducts[6].id, // Refresco Cola
							quantity: 2,
							price: 5.00,
						},
					]
				}
			}
		}),
		// Orden 2 - María
		prisma.order.create({
			data: {
				userId: users[1].id,
				status: 'paid',
				totalAmount: 34.50,
				items: {
					create: [
						{
							productId: sampleProducts[2].id, // Nachos con Queso
							quantity: 1,
							price: 12.00,
						},
						{
							productId: sampleProducts[10].id, // Jugo Natural Naranja
							quantity: 2,
							price: 8.00,
						},
						{
							productId: sampleProducts[5].id, // Chocolate Artesanal
							quantity: 1,
							price: 7.00,
						},
					]
				}
			}
		}),
		// Orden 3 - Ana
		prisma.order.create({
			data: {
				userId: users[2].id,
				status: 'pending',
				totalAmount: 42.00,
				items: {
					create: [
						{
							productId: sampleProducts[1].id, // Palomitas Caramelo
							quantity: 1,
							price: 10.00,
						},
						{
							productId: sampleProducts[11].id, // Smoothie de Frutas
							quantity: 2,
							price: 12.50,
						},
						{
							productId: sampleProducts[4].id, // Mix de Frutos Secos
							quantity: 1,
							price: 9.50,
						},
					]
				}
			}
		}),
		// Orden 4 - Carlos (segunda orden)
		prisma.order.create({
			data: {
				userId: users[0].id,
				status: 'paid',
				totalAmount: 28.00,
				items: {
					create: [
						{
							productId: sampleProducts[3].id, // Nachos con Guacamole
							quantity: 1,
							price: 14.00,
						},
						{
							productId: sampleProducts[12].id, // Café Americano
							quantity: 1,
							price: 6.00,
						},
						{
							productId: sampleProducts[8].id, // Agua Mineral
							quantity: 2,
							price: 3.00,
						},
					]
				}
			}
		}),
	])

	console.log('✅ Órdenes creadas:', orders.length, 'órdenes')

	// Crear pagos para las órdenes pagadas
	const paidOrders = orders.filter(order => order.status === 'paid')
	const payments = await Promise.all(
		paidOrders.map((order, index) => 
			prisma.payment.create({
				data: {
					orderId: order.id,
					amount: order.totalAmount,
					status: 'paid',
					paymentDate: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000), // Pagos en días pasados
					provider: 'Mercado Pago',
					providerRef: `MP_${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
				}
			})
		)
	)

	console.log('✅ Pagos creados:', payments.length, 'pagos')

	// Actualizar stock de productos vendidos
	await prisma.product.update({
		where: { id: sampleProducts[0].id }, // Palomitas Clásicas
		data: { stock: { decrement: 2 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[6].id }, // Refresco Cola
		data: { stock: { decrement: 2 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[2].id }, // Nachos con Queso
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[10].id }, // Jugo Natural Naranja
		data: { stock: { decrement: 2 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[5].id }, // Chocolate Artesanal
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[3].id }, // Nachos con Guacamole
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[12].id }, // Café Americano
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[8].id }, // Agua Mineral
		data: { stock: { decrement: 2 } }
	})

	console.log('✅ Stock de productos actualizado')

	console.log('🎉 Seed completado exitosamente!')
	console.log('\n📊 Resumen de datos creados:')
	console.log(`👥 Usuarios: ${users.length + 1} (incluyendo admin)`)
	console.log(`🎭 Membresías: ${memberships.length}`)
	console.log(`🎬 Eventos: ${events.length}`)
	console.log(`🪑 Asientos: ${totalSeats}`)
	console.log(`🍿 Productos: ${products.length}`)
	console.log(`🏷️ Descuentos: ${discounts.length}`)
	console.log(`📋 Órdenes: ${orders.length}`)
	console.log(`💳 Pagos: ${payments.length}`)
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