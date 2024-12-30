"use client";
import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Film, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormInput } from './FormInput';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { authService } from '@/lib/auth';

interface FormData {
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	password: string;
	password2: string;
	profile_picture: File | null;
}

export const RegisterForm = () => {
	const [step, setStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const [formData, setFormData] = useState<FormData>({
		email: '',
		username: '',
		first_name: '',
		last_name: '',
		password: '',
		password2: '',
		profile_picture: null,
	});

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData(prev => ({ ...prev, profile_picture: file }));
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const isFirstStepComplete = () => {
		return formData.email &&
			formData.username &&
			formData.first_name &&
			formData.last_name &&
			formData.password &&
			formData.password === formData.password2;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (step === 1 && isFirstStepComplete()) {
			setStep(2);
			return;
		}

		if (step === 2 && !formData.profile_picture) {
			return;
		}

		setIsLoading(true);
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== null) {
				data.append(key, value);
			}
		});

		try {
			await authService.register(data);
			router.push('/');
		} catch (error) {
			console.error('Registration failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md w-full space-y-8 relative">
			{/* Logo and Header */}
			<div className="text-center">
				<div className="flex justify-center mb-4">
					<div className="bg-orange-500/10 p-3 rounded-full">
						<Film size={40} className="text-orange-500" />
					</div>
				</div>
				<h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent mb-2">
					Join MovieTube
				</h1>
			</div>

			<div className="mt-8 backdrop-blur-sm bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
				<form onSubmit={handleSubmit} className="space-y-6">
					{step === 1 ? (
						<>
							<FormInput
								id="username"
								name="username"
								type="text"
								label="Username"
								value={formData.username}
								Icon={User}
								placeholder="Choose a username"
								onChange={handleChange}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormInput
									id="first_name"
									name="first_name"
									type="text"
									label="First Name"
									value={formData.first_name}
									Icon={User}
									placeholder="First name"
									onChange={handleChange}
								/>

								<FormInput
									id="last_name"
									name="last_name"
									type="text"
									label="Last Name"
									value={formData.last_name}
									Icon={User}
									placeholder="Last name"
									onChange={handleChange}
								/>
							</div>

							<FormInput
								id="email"
								name="email"
								type="email"
								label="Email Address"
								value={formData.email}
								Icon={Mail}
								placeholder="Enter your email"
								onChange={handleChange}
							/>

							<FormInput
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								label="Password"
								value={formData.password}
								Icon={Lock}
								placeholder="Create a password"
								onChange={handleChange}
								showPasswordToggle
								showPassword={showPassword}
								onTogglePassword={() => setShowPassword(!showPassword)}
							/>

							<FormInput
								id="password2"
								name="password2"
								type={showConfirmPassword ? 'text' : 'password'}
								label="Confirm Password"
								value={formData.password2}
								Icon={Lock}
								placeholder="Confirm your password"
								onChange={handleChange}
								showPasswordToggle
								showPassword={showConfirmPassword}
								onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
							/>
						</>
					) : (
						<ProfilePictureUpload
							onFileChange={handleFileChange}
							previewUrl={previewUrl}
						/>
					)}

					<button
						type="submit"
						disabled={isLoading || (step === 1 && !isFirstStepComplete())}
						className="w-full relative group bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className={`flex items-center justify-center gap-2 transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
							{step === 1 ? 'Next' : 'Create Account'}
							<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
						</span>
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						)}
					</button>

					{/* Sign In Link */}
					<div className="text-center text-sm pt-4">
						<span className="text-gray-400">Already have an account? </span>
						<button
							type="button"
							onClick={() => router.push('/login')}
							className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};