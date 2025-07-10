import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import path from 'path'
import { supabase, isSupabaseReady } from '../src/lib/supabase'

const prisma = new PrismaClient()

// URLs específicas de Supabase para cada imagen de producto
const SUPABASE_IMAGE_URLS = {
	'rolls-jamon-rucula.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/rolls-jamon-rucula.png',
	'queso-brie-panecitos.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/queso-brie-panecitos.png',
	'papas-rusticas-dips.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/papas-rusticas-dips.png',
	'nachos-guacamole.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/nachos-guacamole.png',
	'mini-empanadas-gourmet.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/mini-empanadas-gourmet.png',
	'palomitas-clasicas.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/palomitas-clasicas.png',
	'mix-frutos-secos.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/mix-frutos-secos.png',
	'cookies-gourmet.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/cookies-gourmet.png',
	'brownie.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/brownie.png',
	'chocolate-artesanal.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/chocolate-artesanal.png',
	'cappuccino.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/cappuccino.png',
	'cafe-americano.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/cafe-americano.png',
	'chocolate-caliente.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/chocolate-caliente.png',
	'limonada-casera.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/limonada-casera.png',
	'jugos-prensados.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/jugos-prensados.png',
	'vino-copa-individual.png': 'https://bhfyafljqkwkqbmemnzn.supabase.co/storage/v1/object/public/products/vino-copa-individual.png',
}

// Función auxiliar para obtener la URL de imagen de Supabase
function getSupabaseImageUrl(imageName: string): string {
	const supabaseUrl = SUPABASE_IMAGE_URLS[imageName as keyof typeof SUPABASE_IMAGE_URLS]
	
	if (supabaseUrl) {
		console.log(`✅ Usando URL de Supabase para ${imageName}`)
		return supabaseUrl
	}
	
	console.warn(`⚠️  URL de Supabase no encontrada para ${imageName}, usando URL local`)
	return `/products/${imageName}`
}

async function main() {
	console.log('🌱 Iniciando seed de la base de datos...')

	// Crear tipos de membresía
	const memberships = await Promise.all([
		prisma.membershipTier.upsert({
			where: { name: 'Banquito' },
			update: {},
			create: {
				name: 'Banquito',
				description: 'Membresía básica para disfrutar del cine bajo las estrellas',
				priority: 3,
				price: 14999.00,
				benefits: 'Acceso a eventos regulares • Reserva con 7 días de anticipación • Descuento 5% en snacks',
				imageUrl: '/memberships/membresia-banquito.png',
			},
		}),
		prisma.membershipTier.upsert({
			where: { name: 'Reposera Deluxe' },
			update: {},
			create: {
				name: 'Reposera Deluxe',
				description: 'Membresía intermedia con beneficios adicionales',
				priority: 2,
				price: 24999.00,
				benefits: 'Acceso prioritario a eventos • Reserva con 14 días de anticipación • Descuento 10% en snacks • Acceso a eventos especiales',
				imageUrl: '/memberships/membresia-reposera-deluxe.png',
			},
		}),
		prisma.membershipTier.upsert({
			where: { name: 'Puff XXL Estelar' },
			update: {},
			create: {
				name: 'Puff XXL Estelar',
				description: 'Membresía premium con todos los beneficios',
				priority: 1,
				price: 39999.00,
				benefits: 'Acceso VIP a todos los eventos • Reserva con 21 días de anticipación • Bebida gratis por evento • Descuento 15% en snacks • Playlist colaborativa de Spotify • Asientos preferenciales',
				imageUrl: '/memberships/membresia-puff-xxl-estelar.png',
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
			membershipId: memberships[2].id, // Puff XXL Estelar
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
				membershipId: memberships[0].id, // Banquito
			},
		}),
		prisma.user.upsert({
			where: { email: 'maria@test.com' },
			update: {},
			create: {
				email: 'maria@test.com',
				password: userPassword,
				name: 'María López',
				membershipId: memberships[1].id, // Reposera Deluxe
			},
		}),
		prisma.user.upsert({
			where: { email: 'ana@test.com' },
			update: {},
			create: {
				email: 'ana@test.com',
				password: userPassword,
				name: 'Ana Rodríguez',
				membershipId: memberships[2].id, // Puff XXL Estelar
			},
		}),
	])

	console.log('✅ Usuarios de prueba creados:', users.map(u => u.email).join(', '))

	// Crear productos para el kiosco - MENÚ PUFF & CHILL
	console.log('📸 Configurando URLs de imágenes de Supabase para productos...')
	
	// Definir productos con sus imágenes
	const productData = [
		{
			name: 'Rolls de jamón crudo con rúcula y crema de queso',
			description: 'Delicados rollitos fríos rellenos de jamón crudo, rúcula fresca y una suave crema de queso.',
			price: 3000,
			stock: 50,
			imageName: 'rolls-jamon-rucula.png',
		},
		{
			name: 'Queso brie tibio con panecitos',
			description: 'Brie fundido suavemente, acompañado con panecillos crujientes. Un toque gourmet ideal para compartir.',
			price: 3500,
			stock: 40,
			imageName: 'queso-brie-panecitos.png',
		},
		{
			name: 'Papas rústicas con especias y dips caseros',
			description: 'Papas doradas con condimentos especiales, acompañadas de dips caseros para sumergir.',
			price: 2500,
			stock: 60,
			imageName: 'papas-rusticas-dips.png',
		},
		{
			name: 'Nachos con Guacamole',
			description: 'Crujientes nachos de maíz servidos con guacamole fresco y sabroso.',
			price: 2500,
			stock: 70,
			imageName: 'nachos-guacamole.png',
		},
		{
			name: 'Mini empanadas gourmet',
			description: 'Empanaditas caseras rellenas con sabores únicos: carne braseada, verdura y más.',
			price: 2800,
			stock: 45,
			imageName: 'mini-empanadas-gourmet.png',
		},
		{
			name: 'Palomitas clásicas',
			description: 'Las infaltables del cine: livianas, crocantes y recién hechas.',
			price: 1200,
			stock: 100,
			imageName: 'palomitas-clasicas.png',
		},
		{
			name: 'Mix de frutos secos',
			description: 'Combinación natural de almendras, nueces, pasas y castañas. Energía y sabor en un solo puñado.',
			price: 1800,
			stock: 80,
			imageName: 'mix-frutos-secos.png',
		},
		{
			name: 'Cookies gourmet',
			description: 'Galletas artesanales con chips de chocolate, crocantes por fuera y suaves por dentro.',
			price: 1800,
			stock: 65,
			imageName: 'cookies-gourmet.png',
		},
		{
			name: 'Brownie',
			description: 'Porción de brownie casero, húmedo y con intenso sabor a chocolate.',
			price: 1600,
			stock: 55,
			imageName: 'brownie.png',
		},
		{
			name: 'Barra de chocolate artesanal',
			description: 'Chocolate de elaboración local, con cacao seleccionado y textura suave.',
			price: 2200,
			stock: 40,
			imageName: 'chocolate-artesanal.png',
		},
		{
			name: 'Cappuccino',
			description: 'Café suave con leche espumosa y un toque de cacao. Reconfortante y elegante.',
			price: 2000,
			stock: 90,
			imageName: 'cappuccino.png',
		},
		{
			name: 'Café Americano',
			description: 'Clásico café filtrado, ideal para disfrutar sin apuros.',
			price: 1800,
			stock: 95,
			imageName: 'cafe-americano.png',
		},
		{
			name: 'Chocolate caliente',
			description: 'Bebida cremosa de chocolate espeso, perfecta para noches frescas.',
			price: 2200,
			stock: 70,
			imageName: 'chocolate-caliente.png',
		},
		{
			name: 'Limonada casera',
			description: 'Refrescante limonada natural, endulzada suavemente con un toque de menta.',
			price: 1800,
			stock: 85,
			imageName: 'limonada-casera.png',
		},
		{
			name: 'Jugo exprimido',
			description: 'Jugo de frutas frescas exprimido al momento: naranja, manzana o combinados.',
			price: 2000,
			stock: 75,
			imageName: 'jugos-prensados.png',
		},
		{
			name: 'Botellita de vino tinto con copa individual',
			description: 'Vino tinto suave en botella individual, con copa incluida para disfrutar con estilo.',
			price: 3800,
			stock: 30,
			imageName: 'vino-copa-individual.png',
		},
	]

	// Crear productos con URLs de Supabase
	const products = []
	for (const product of productData) {
		console.log(`📸 Configurando ${product.imageName}...`)
		
		// Obtener URL de Supabase
		const imageUrl = getSupabaseImageUrl(product.imageName)
		
		// Crear producto con la URL de Supabase
		const createdProduct = await prisma.product.upsert({
			where: { name: product.name },
			update: {},
			create: {
				name: product.name,
				description: product.description,
				price: product.price,
				stock: product.stock,
				imageUrl: imageUrl,
			},
		})
		
		products.push(createdProduct)
		console.log(`✅ ${product.name} - ${imageUrl}`)
	}

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
			where: { code: 'PUFFXXL20' },
			update: {},
			create: {
				code: 'PUFFXXL20',
				description: 'Descuento exclusivo para miembros Puff XXL Estelar',
				percentage: 20.0,
				membershipTierId: memberships[2].id, // Solo para Puff XXL Estelar
				validFrom: new Date(),
				validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
			},
		}),
		prisma.discount.upsert({
			where: { code: 'REPOSERA15' },
			update: {},
			create: {
				code: 'REPOSERA15',
				description: 'Descuento especial para miembros Reposera Deluxe',
				percentage: 15.0,
				membershipTierId: memberships[1].id, // Solo para Reposera Deluxe
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
			where: { code: 'BANQUITO5' },
			update: {},
			create: {
				code: 'BANQUITO5',
				description: 'Descuento para miembros Banquito',
				percentage: 5.0,
				membershipTierId: memberships[0].id, // Solo para Banquito
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
			where: { title: 'Noche de Clásicos: Inception' },
			update: {},
			create: {
				title: 'Noche de Clásicos: Inception',
				description: 'Una experiencia mental única con Christopher Nolan. Sumérgete en el mundo de los sueños con esta obra maestra del cine.',
				dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
				location: 'Terraza Principal - Puff & Chill',
				category: 'Ciencia Ficción',
				imdbId: 'tt1375666',
				tmdbId: '27205',
				imageUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', // Inception
			},
		}),
		prisma.event.upsert({
			where: { title: 'Ciencia Ficción: Blade Runner 2049' },
			update: {},
			create: {
				title: 'Ciencia Ficción: Blade Runner 2049',
				description: 'Una experiencia visual impresionante en el futuro distópico. Blade Runner 2049 te transportará a un mundo cyberpunk bajo las estrellas.',
				dateTime: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // En 28 días
				location: 'Terraza Principal - Puff & Chill',
				category: 'Ciencia Ficción',
				imdbId: 'tt1856101',
				tmdbId: '335984',
				imageUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', // Blade Runner 2049
			},
		}),
		prisma.event.upsert({
			where: { title: 'Superhéroes: Spider-Man: No Way Home' },
			update: {},
			create: {
				title: 'Superhéroes: Spider-Man: No Way Home',
				description: 'La película más épica del multiverso Spider-Man. Una noche llena de acción y nostalgia bajo el cielo nocturno.',
				dateTime: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // En 35 días
				location: 'Terraza Norte - Puff & Chill',
				category: 'Superhéroes',
				imdbId: 'tt10872600',
				tmdbId: '634649',
				imageUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', // Spider-Man: No Way Home
			},
		}),
		prisma.event.upsert({
			where: { title: 'Terror Moderno: Get Out' },
			update: {},
			create: {
				title: 'Terror Moderno: Get Out',
				description: 'Horror psicológico y social de Jordan Peele. Una experiencia aterradora que te hará reflexionar sobre temas profundos.',
				dateTime: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // En 42 días
				location: 'Jardín Secreto - Puff & Chill',
				category: 'Terror Moderno',
				imdbId: 'tt5052448',
				tmdbId: '419430',
				imageUrl: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg', // Get Out
			},
		}),
		prisma.event.upsert({
			where: { title: 'Acción Épica: Avengers: Endgame' },
			update: {},
			create: {
				title: 'Acción Épica: Avengers: Endgame',
				description: 'La batalla final del universo cinematográfico de Marvel. Una experiencia épica que cierra una década de aventuras superheroicas.',
				dateTime: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000), // En 56 días
				location: 'Terraza Principal - Puff & Chill',
				category: 'Acción Épica',
				imdbId: 'tt4154796',
				tmdbId: '299534',
				imageUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', // Avengers: Endgame
			},
		}),
		prisma.event.upsert({
			where: { title: 'Drama: The Shawshank Redemption' },
			update: {},
			create: {
				title: 'Drama: The Shawshank Redemption',
				description: 'Una historia atemporal sobre esperanza y redención. Considerada una de las mejores películas de todos los tiempos.',
				dateTime: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000), // En 63 días
				location: 'Terraza Norte - Puff & Chill',
				category: 'Drama',
				imdbId: 'tt0111161',
				tmdbId: '278',
				imageUrl: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', // The Shawshank Redemption
			},
		}),
		prisma.event.upsert({
			where: { title: 'Thriller: Joker' },
			update: {},
			create: {
				title: 'Thriller: Joker',
				description: 'La transformación de Arthur Fleck en el icónico villano. Una experiencia psicológicamente intensa con la actuación ganadora del Oscar de Joaquin Phoenix.',
				dateTime: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000), // En 70 días
				location: 'Jardín Sur - Puff & Chill',
				category: 'Thriller Psicológico',
				imdbId: 'tt7286456',
				tmdbId: '475557',
				imageUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', // Joker
			},
		}),
		prisma.event.upsert({
			where: { title: 'Drama Musical: La La Land' },
			update: {},
			create: {
				title: 'Drama Musical: La La Land',
				description: 'Romance, música y sueños en Los Ángeles. Una experiencia mágica que combina perfectamente con una noche bajo las estrellas.',
				dateTime: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000), // En 77 días
				location: 'Jardín Central - Puff & Chill',
				category: 'Drama Musical',
				imdbId: 'tt3783958',
				tmdbId: '313369',
				imageUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', // La La Land
			},
		}),
		prisma.event.upsert({
			where: { title: 'Animación: El Viaje de Chihiro' },
			update: {},
			create: {
				title: 'Animación: El Viaje de Chihiro',
				description: 'Una noche familiar con la obra maestra de Studio Ghibli. Magia, aventura y hermosos paisajes bajo el cielo nocturno.',
				dateTime: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000), // En 42 días
				location: 'Terraza Norte - Puff & Chill',
				category: 'Animación Familiar',
				imdbId: 'tt0245429',
				tmdbId: '129',
				imageUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', // Spirited Away
			},
		}),
	])

	console.log('✅ Eventos creados:', events.length, 'eventos')

	// Crear asientos para todos los eventos con distribución de anfiteatro
	let totalSeats = 0
	for (const event of events) {
		const seats = []
		let seatNumber = 1
		
		// Distribución anfiteatro:
		// Puff XXL Estelar: 6 asientos (fila frontal - más cerca de la pantalla)
		// Reposera Deluxe: 10 asientos (fila media)  
		// Banquito: 14 asientos (fila trasera - más lejos de la pantalla)
		
		// Asientos Puff XXL Estelar (1-6) - Fila frontal VIP
		for (let i = 1; i <= 6; i++) {
			seats.push({
				eventId: event.id,
				seatNumber: seatNumber++,
				tier: 'Puff XXL Estelar',
			})
		}
		
		// Asientos Reposera Deluxe (7-16) - Fila media
		for (let i = 1; i <= 10; i++) {
			seats.push({
				eventId: event.id,
				seatNumber: seatNumber++,
				tier: 'Reposera Deluxe',
			})
		}
		
		// Asientos Banquito (17-30) - Fila trasera
		for (let i = 1; i <= 14; i++) {
			seats.push({
				eventId: event.id,
				seatNumber: seatNumber++,
				tier: 'Banquito',
			})
		}

		await prisma.seat.createMany({
			data: seats,
			skipDuplicates: true,
		})
		totalSeats += seats.length
	}

	console.log('✅ Asientos creados:', totalSeats, 'asientos total')
	console.log('🎭 Distribución anfiteatro: Puff XXL Estelar (6), Reposera Deluxe (10), Banquito (14) por evento')

	// Crear algunas reservas de ejemplo
	const inceptionEvent = events.find(e => e.title.includes('Inception'))
	const bladeRunnerEvent = events.find(e => e.title.includes('Blade Runner'))
	
	if (inceptionEvent && bladeRunnerEvent) {
		// Obtener asientos disponibles para cada evento
		const inceptionSeats = await prisma.seat.findMany({
			where: { 
				eventId: inceptionEvent.id,
				isReserved: false
			},
			take: 3
		})
		
		const bladeRunnerSeats = await prisma.seat.findMany({
			where: { 
				eventId: bladeRunnerEvent.id,
				isReserved: false
			},
			take: 2
		})

		let reservationsCreated = 0

		// Reservas para Inception (solo si hay asientos disponibles)
		if (inceptionSeats.length >= 3) {
			const inceptionReservations = await Promise.all([
				prisma.reservation.create({
					data: {
						userId: users[0].id, // Carlos
						eventId: inceptionEvent.id,
						seatId: inceptionSeats[0].id,
						status: 'confirmed',
					}
				}),
				prisma.reservation.create({
					data: {
						userId: users[1].id, // María
						eventId: inceptionEvent.id,
						seatId: inceptionSeats[1].id,
						status: 'confirmed',
					}
				}),
				prisma.reservation.create({
					data: {
						userId: users[2].id, // Ana
						eventId: inceptionEvent.id,
						seatId: inceptionSeats[2].id,
						status: 'pending',
					}
				}),
			])
			reservationsCreated += inceptionReservations.length

			// Marcar asientos de Inception como reservados
			await prisma.seat.updateMany({
				where: {
					id: {
						in: inceptionSeats.slice(0, 3).map(s => s.id)
					}
				},
				data: { isReserved: true }
			})
		}

		// Reservas para Blade Runner (solo si hay asientos disponibles)
		if (bladeRunnerSeats.length >= 2) {
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
			reservationsCreated += bladeRunnerReservations.length

			// Marcar asientos de Blade Runner como reservados
			await prisma.seat.updateMany({
				where: {
					id: {
						in: bladeRunnerSeats.slice(0, 2).map(s => s.id)
					}
				},
				data: { isReserved: true }
			})
		}

		console.log('✅ Reservas creadas:', reservationsCreated, 'reservas')
	}

	// Crear órdenes de ejemplo con items
	const sampleProducts = products // Tomar todos los productos para las órdenes

	const orders = await Promise.all([
		// Orden 1 - Carlos
		prisma.order.create({
			data: {
				userId: users[0].id,
				status: 'paid',
				totalAmount: 4200, // $1200 x 2 + $1800 x 1
				items: {
					create: [
						{
							productId: sampleProducts[5].id, // Palomitas clásicas
							quantity: 2,
							price: 1200,
						},
						{
							productId: sampleProducts[14].id, // Limonada casera
							quantity: 1,
							price: 1800,
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
				totalAmount: 6300, // $2500 + $1800 + $2000
				items: {
					create: [
						{
							productId: sampleProducts[3].id, // Nachos con Guacamole
							quantity: 1,
							price: 2500,
						},
						{
							productId: sampleProducts[8].id, // Cookies gourmet
							quantity: 1,
							price: 1800,
						},
						{
							productId: sampleProducts[15].id, // Jugo exprimido
							quantity: 1,
							price: 2000,
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
				totalAmount: 8000, // $2800 + $2200 + $3000
				items: {
					create: [
						{
							productId: sampleProducts[4].id, // Mini empanadas gourmet
							quantity: 1,
							price: 2800,
						},
						{
							productId: sampleProducts[10].id, // Barra de chocolate artesanal
							quantity: 1,
							price: 2200,
						},
						{
							productId: sampleProducts[0].id, // Rolls de jamón crudo
							quantity: 1,
							price: 3000,
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
				totalAmount: 4000, // $2000 + $2000
				items: {
					create: [
						{
							productId: sampleProducts[11].id, // Cappuccino
							quantity: 1,
							price: 2000,
						},
						{
							productId: sampleProducts[15].id, // Jugo exprimido
							quantity: 1,
							price: 2000,
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
		where: { id: sampleProducts[5].id }, // Palomitas clásicas
		data: { stock: { decrement: 2 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[14].id }, // Limonada casera
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[3].id }, // Nachos con Guacamole
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[8].id }, // Cookies gourmet
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[15].id }, // Jugo exprimido
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[4].id }, // Mini empanadas gourmet
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[10].id }, // Barra de chocolate artesanal
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[0].id }, // Rolls de jamón crudo
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[11].id }, // Cappuccino
		data: { stock: { decrement: 1 } }
	})
	await prisma.product.update({
		where: { id: sampleProducts[15].id }, // Jugo exprimido (segunda compra)
		data: { stock: { decrement: 1 } }
	})

	console.log('✅ Stock de productos actualizado')

	console.log('🎉 Seed completado exitosamente!')
	console.log('\n📊 Resumen de datos creados:')
	console.log(`💳 Pagos: ${payments.length}`)
	console.log(`🎭 Distribución de asientos por evento:`)
	console.log(`   • Puff XXL Estelar: 6 asientos (fila frontal VIP)`)
	console.log(`   • Reposera Deluxe: 10 asientos (fila media)`)
	console.log(`   • Banquito: 14 asientos (fila trasera)`)
	console.log(`   • Total: 30 asientos por evento`)
	console.log(`📸 Imágenes de productos: ${products.length} imágenes desde Supabase`)

	console.log('\n📋 Credenciales de prueba:')
	console.log('👤 Admin: admin@puffandchill.com / admin123')
	console.log('👤 Usuario Banquito: carlos@test.com / user123')
	console.log('👤 Usuario Reposera Deluxe: maria@test.com / user123')
	console.log('👤 Usuario Puff XXL Estelar: ana@test.com / user123')
}

main()
	.catch((e) => {
		console.error('❌ Error durante el seed:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})