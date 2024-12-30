"use client";
import MovieTitlesBackground from "../components/Background";
import { LogInForm } from "../components/LogInForm";


export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
			<MovieTitlesBackground />
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute w-96 h-96 -top-48 -left-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute w-96 h-96 -bottom-48 -right-48 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
			</div>
			<LogInForm />
		</div>
	);
}
