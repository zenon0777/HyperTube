"use client"
import { useState } from 'react';
import { FormInput } from './FormInput';
import { User, Lock, Film, ArrowRight, Github, Twitter, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/lib/auth';

interface FormInputEvent extends React.ChangeEvent<HTMLInputElement> { }

export const LogInForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const router = useRouter();

	const handleChange = (e: FormInputEvent) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleOAuthLogin = (provider: string) => {
		window.location.href = `http://localhost:8000/auth/${provider}/`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await authService.login(formData);
			router.push('/');
		} catch (error) {
			console.error('Login error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (


		<div className="max-w-md w-full space-y-8 relative">
			<div className="text-center">
				<div className="flex justify-center mb-4">
					<div className="bg-orange-500/10 p-3 rounded-full backdrop-blur-lg">
						<Film size={40} className="text-orange-500" />
					</div>
				</div>
				<h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent mb-2">
					MovieTube
				</h1>
				<p className="text-gray-400">Your gateway to endless entertainment</p>
			</div>

			<div className="mt-8 backdrop-blur-md bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
				<form onSubmit={handleSubmit} className="space-y-6">
					<FormInput
						id="username"
						name="username"
						type="text"
						label="Username"
						value={formData.username}
						Icon={User}
						placeholder="Enter username"
						onChange={handleChange}
					/>

					<FormInput
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						label="Password"
						value={formData.password}
						Icon={Lock}
						placeholder="Enter password"
						onChange={handleChange}
						showPasswordToggle
						showPassword={showPassword}
						onTogglePassword={() => setShowPassword(!showPassword)}
					/>

					<div className="flex items-center justify-center">
						<button
							type="button"
							className="text-sm text-orange-400 hover:text-orange-300 transition-colors duration-200"
						>
							Forgot password?
						</button>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full relative group bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 overflow-hidden"
					>
						<span className={`flex items-center justify-center gap-2 transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
							Sign In
							<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
						</span>
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						)}
					</button>

					<div className="mt-4">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-700" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>					</div>
						</div>

						<button
							type="button"
							onClick={() => handleOAuthLogin('42')}
							className="mt-4 w-full flex items-center justify-center gap-3 bg-gray-700/50 text-white py-3 px-4 rounded-xl hover:bg-gray-700/70 transition-colors"
						>
							<span>Continue with</span>
							<Image
								src="/42.png"
								alt="42 School"
								width={50}
								height={50}
							/>
						</button>

						<div className="grid grid-cols-3 gap-4 mt-4">
							<button
								onClick={() => handleOAuthLogin('github')}
								className="flex items-center justify-center p-3 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition-colors"
							>
								<Github className="w-5 h-5" />
							</button>

							<button
								onClick={() => handleOAuthLogin('google')}
								className="flex items-center justify-center p-3 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition-colors"
							>
								<Chrome className="w-5 h-5" />
							</button>

							<button
								onClick={() => handleOAuthLogin('twitter')}
								className="flex items-center justify-center p-3 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</button>
						</div>
					</div>

					<div className="text-center text-sm pt-4">
						<span className="text-gray-400">Don't have an account? </span>
						<button
							type="button"
							onClick={() => router.push('/register')}
							className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
						>
							Sign up now
						</button>
					</div>
				</form>
			</div>
		</div>

	);
};