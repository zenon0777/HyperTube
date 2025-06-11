"use client"
import { useState } from 'react';
import { User, Lock, Film, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { getUserProfile } from '@/app/store/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { toast } from 'react-toastify';
import { FormInput } from '../components/FormInput';
import { SocialLoginButtons } from '../components/SocialLoginButtons';

interface FormInputEvent extends React.ChangeEvent<HTMLInputElement> { }

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		username: '',
		password: '',
	});

	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	
	const handleChange = (e: FormInputEvent) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};
	const handleOAuthLogin = (provider: string) => {
		authService.initiateOAuth(provider);
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await authService.login(formData);
			await dispatch(getUserProfile()).unwrap();
			router.push('/home');
		} catch (error : any) {
			console.log('Login error:', error);
			toast.error(error.message);
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
							
							onClick={() => router.push('/reset-password')}
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
					</button>					<SocialLoginButtons onOAuthLogin={handleOAuthLogin} />

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
}
