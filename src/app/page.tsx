import { HeroSection } from './components/home/hero-section'
import { FeaturesSection } from './components/home/features-section'
import { MembershipSection } from './components/home/membership-section'
import { ExperienceSection } from './components/home/experience-section'
import { CTASection } from './components/home/cta-section'
import Navigation from './components/Navigation'

export default function Home() {
	return (
		<>
			<Navigation />
			<main className="overflow-hidden">
				<HeroSection />
				<FeaturesSection />
				<ExperienceSection />
				<MembershipSection />
				<CTASection />
			</main>
		</>
	)
}
