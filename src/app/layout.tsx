import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/providers/session-provider";
import { QueryProvider } from "./components/providers/query-provider";
import ConditionalNavigation from "./components/conditional-navigation";
import { CartProvider } from "@/lib/cart/cart-context";
import { GlobalCartSidebar } from "./components/cart/GlobalCartSidebar";
import { FloatingCartButton } from "./components/cart/FloatingCartButton";
import { Toaster } from 'react-hot-toast';
import { RegisterSW } from "./register-sw";


const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: 'swap',
});

const bebasNeue = Bebas_Neue({
	variable: "--font-bebas-neue",
	weight: "400",
	subsets: ["latin"],
	display: 'swap',
});

export const metadata: Metadata = {
	title: "CineClub Puff & Chill | Cine Silencioso Bajo las Estrellas",
	description: "Vive una experiencia cinematográfica única al aire libre. Únete a nuestro club exclusivo y disfruta de películas bajo un cielo estrellado con tecnología de audio silencioso premium.",
	keywords: [
		"cine al aire libre",
		"películas bajo las estrellas",
		"audio silencioso",
		"cine club",
		"experiencia premium",
		"membresía exclusiva",
		"entretenimiento nocturno",
		"cine boutique"
	],
	authors: [{ name: "CineClub Puff & Chill Team" }],
	robots: "index, follow",
	openGraph: {
		type: "website",
		locale: "es_ES",
		url: "https://puffandchill.com",
		title: "CineClub Puff & Chill | Cine Silencioso Bajo las Estrellas",
		description: "Vive una experiencia cinematográfica única al aire libre",
		siteName: "CineClub Puff & Chill",
	},
	twitter: {
		card: "summary_large_image",
		title: "CineClub Puff & Chill",
		description: "Cine silencioso bajo las estrellas",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "dark light",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#F0E3CA" },
		{ media: "(prefers-color-scheme: dark)", color: "#1C1C1E" }
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" className="scroll-smooth">
			<head>
				<link rel="preload" href="/background-image.png" as="image" />
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#ea580c" />
				<link rel="icon" href="/icons/icon-192x192.png" />
			</head>
			<body
				className={`${inter.variable} ${bebasNeue.variable} antialiased min-h-screen`}
				suppressHydrationWarning
			>
				<AuthProvider>
					<QueryProvider>
						<CartProvider
							config={{
								maxProductQuantity: 10,
								seatReservationTimeoutMinutes: 15,
								autoSyncWithServer: true,
								persistToLocalStorage: true
							}}
						>
							<ConditionalNavigation />
							{children}
							<GlobalCartSidebar />
							<FloatingCartButton />
							<div suppressHydrationWarning>
								<Toaster
									position="top-right"
									toastOptions={{
										duration: 4000,
										style: {
											background: '#1C1C1E',
											color: '#F0E3CA',
											border: '1px solid rgba(240, 227, 202, 0.1)',
										},
										success: {
											iconTheme: {
												primary: '#10B981',
												secondary: '#F0E3CA',
											},
										},
										error: {
											iconTheme: {
												primary: '#EF4444',
												secondary: '#F0E3CA',
											},
										},
									}}
								/>
							</div>
						</CartProvider>
					</QueryProvider>
				</AuthProvider>
				<RegisterSW />
			</body>
		</html>
	);
}
