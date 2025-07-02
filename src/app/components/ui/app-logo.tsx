import Link from 'next/link'
import Image from 'next/image'

export function AppLogo() {
	return (
		<Link href="/" aria-label="Puff & Chill Home">
			<Image
				src="/logo.png" 
				alt="Puff & Chill Logo"
				width={80}
				height={80}
				className="h-20 w-auto"
				priority
			/>
		</Link>
	)
} 
