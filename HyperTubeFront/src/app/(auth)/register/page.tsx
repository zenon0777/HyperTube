"use client";
import { User, Mail, Lock, Film, ArrowRight } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { ProfilePictureUpload } from "../components/ProfilePictureUpload";
import { SocialLoginButtons } from "../components/SocialLoginButtons";
import { useRegistrationForm } from "../hooks/useRegistrationForm";

export default function RegisterPage() {
	const {
		// State
		step,
		formData,
		errors,
		isLoading,
		previewUrl,
		showPassword,
		showConfirmPassword,
		
		// Actions
		handleChange,
		handleFileChange,
		handleOAuthLogin,
		handleSubmit,
		goToPreviousStep,
		navigateToLogin,
		setShowPassword,
		setShowConfirmPassword,
	} = useRegistrationForm();

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
			<div className="mt-8 backdrop-blur-sm bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-700/50">		  {/* Step indicator */}
				<div className="flex items-center justify-center mb-8">
					<div className="flex items-center space-x-3">
						<div
							className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 1
								? "bg-orange-500 shadow-lg shadow-orange-500/30"
								: "bg-gray-600"
								}`}
						/>
						<div className={`h-0.5 w-12 transition-all duration-300 ${step === 2 ? "bg-orange-500" : "bg-gray-600"}`}/>
						<div
							className={`w-3 h-3 rounded-full transition-all duration-300 ${step === 2
								? "bg-orange-500 shadow-lg shadow-orange-500/30"
								: "bg-gray-600"
								}`}
						/>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{step === 1 ? (
						<>				<FormInput
							id="username"
							name="username"
							type="text"
							label="Username"
							value={formData.username}
							Icon={User}
							placeholder="Choose a username"
							onChange={handleChange}
							error={errors.username}
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
									error={errors.first_name}
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
									error={errors.last_name}
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
								error={errors.email}
							/>
							<FormInput
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								label="Password"
								value={formData.password}
								Icon={Lock}
								placeholder="Create a password"
								onChange={handleChange}
								showPasswordToggle
								showPassword={showPassword}
								onTogglePassword={() => setShowPassword(!showPassword)}
								error={errors.password}
							/>

							<FormInput
								id="password2"
								name="password2"
								type={showConfirmPassword ? "text" : "password"}
								label="Confirm Password"
								value={formData.password2}
								Icon={Lock}
								placeholder="Confirm your password"
								onChange={handleChange}
								showPasswordToggle
								showPassword={showConfirmPassword}
								onTogglePassword={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								error={errors.password2}
							/>
						</>) : (<>
							<div className="text-center mb-4">
								<h3 className="text-lg font-medium text-gray-200 mb-2">
									Profile Picture
								</h3>
								<p className="text-sm text-gray-400">
									Please upload a profile picture to complete your registration.
								</p>
							</div>

							{/* Show error summary if there are validation errors */}
							{Object.keys(errors).length > 0 && (
								<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 bg-red-500 rounded-full"></div>
										<h4 className="text-red-400 font-medium">Please fix the following errors:</h4>
									</div>
									<ul className="text-sm text-red-300 space-y-1">
										{Object.entries(errors).map(([field, error]) => (
											<li key={field}>• {error}</li>
										))}
									</ul>									<button
										type="button"
										onClick={goToPreviousStep}
										className="mt-3 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-lg transition-colors duration-200"
									>
										Fix Errors →
									</button>
								</div>
							)}
							<ProfilePictureUpload
								onFileChange={handleFileChange}
								previewUrl={previewUrl}
							/>							<div className="flex justify-center">
								<button
									type="button"
									onClick={goToPreviousStep}
									className="w-full relative group bg-gray-700/50 text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-700/70 transition-all duration-200 overflow-hidden"
								>
									<span className="flex items-center justify-center gap-2 transition-all duration-200">
										<ArrowRight
											size={20}
											className="rotate-180 group-hover:-translate-x-1 transition-transform duration-200"
										/>
										Previous Step
									</span>
								</button>
							</div>
						</>
					)}
					<button
						type="submit"
						disabled={isLoading || (step === 2 && !formData.profile_picture)}
						className="w-full relative group bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span
							className={`flex items-center justify-center gap-2 transition-all duration-200 ${isLoading ? "opacity-0" : "opacity-100"
								}`}
						>
							{step === 1 ? "Continue" : "Create Account"}
							<ArrowRight
								size={20}
								className="group-hover:translate-x-1 transition-transform duration-200"
							/>
						</span>
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						)}			</button>

					{/* OAuth Login - Show only on step 1 */}
					{step === 1 && <SocialLoginButtons onOAuthLogin={handleOAuthLogin} />}					{/* Sign In Link */}
					<div className="text-center text-sm pt-4">
						<span className="text-gray-400">Already have an account? </span>
						<button
							type="button"
							onClick={navigateToLogin}
							className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}