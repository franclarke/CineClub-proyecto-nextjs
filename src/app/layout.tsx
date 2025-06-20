import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/providers/session-provider";
import { QueryProvider } from "./components/providers/query-provider";
import ConditionalNavigation from "./components/conditional-navigation";

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
			</head>
			<body
				className={`${inter.variable} ${bebasNeue.variable} antialiased min-h-screen`}
			>
				<AuthProvider>
					<QueryProvider>
						<ConditionalNavigation />
						{children}
					</QueryProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
