import Navigation from "@/app/components/Navigation";
import { DashboardContent } from "./components/dashboard-content";

export default function DashboardPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
			<Navigation />
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">

					<p className="text-gray-300">
						Gestiona eventos, usuarios y configuraciones
					</p>
				</div>
				<DashboardContent />
			</div>
		</div>
	)
}