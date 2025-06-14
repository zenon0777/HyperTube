import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { toast } from "react-toastify";

interface FormData {
	email: string;
	username: string;
	first_name: string;
	last_name: string;
	password: string;
	password2: string;
	profile_picture: File | null;
}

interface FormErrors {
	email?: string;
	username?: string;
	first_name?: string;
	last_name?: string;
	password?: string;
	password2?: string;
}

export const useRegistrationForm = () => {
	const [step, setStep] = useState(1);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});

	const [formData, setFormData] = useState<FormData>({
		email: "",
		username: "",
		first_name: "",
		last_name: "",
		password: "",
		password2: "",
		profile_picture: null,
	});

	const router = useRouter();

	// Reusable validation functions
	const validators = {
		email: (value: string): string | null => {
			if (!value.trim()) return "Email is required";
			if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
			return null;
		},

		username: (value: string): string | null => {
			if (!value.trim()) return "Username is required";
			if (value.length < 3) return "Username must be at least 3 characters";
			return null;
		},

		required: (value: string, fieldName: string): string | null => {
			return !value.trim() ? `${fieldName} is required` : null;
		},

		password: (password: string): string | null => {
			if (password.length < 8) return "Must be at least 8 chars";
			if (!/[A-Z]/.test(password)) return "Must contain uppercase";
			if (!/[0-9]/.test(password)) return "Must contain number";
			if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Must contain special char";
			return null;
		},

		passwordConfirmation: (password: string, confirmPassword: string): string | null => {
			if (!confirmPassword) return "Please confirm your password";
			if (password !== confirmPassword) return "Passwords don't match";
			return null;
		}
	};

	const validateStep1 = () => {
		const newErrors: FormErrors = {};

		// Validate each field using the validators
		const emailError = validators.email(formData.email);
		if (emailError) newErrors.email = emailError;

		const usernameError = validators.username(formData.username);
		if (usernameError) newErrors.username = usernameError;

		const firstNameError = validators.required(formData.first_name, "First name");
		if (firstNameError) newErrors.first_name = firstNameError;

		const lastNameError = validators.required(formData.last_name, "Last name");
		if (lastNameError) newErrors.last_name = lastNameError;

		const passwordError = validators.password(formData.password);
		if (passwordError) newErrors.password = passwordError;

		const passwordConfirmationError = validators.passwordConfirmation(formData.password, formData.password2);
		if (passwordConfirmationError) newErrors.password2 = passwordConfirmationError;

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = () => {
		if (!formData.profile_picture) {
			toast.error("Please upload a profile picture to complete registration.");
			return false;
		}
		return true;
	};

	// Utility function to parse backend errors
	const parseBackendErrors = (errorResponse: any): FormErrors => {
		const newErrors: FormErrors = {};

		if (errorResponse?.data) {
			Object.entries(errorResponse.data).forEach(([field, error]) => {
				if (field in formData) {
					newErrors[field as keyof FormErrors] = Array.isArray(error) ? error[0] : error;
				}
			});
		}

		return newErrors;
	};

	// Utility function to create FormData for submission
	const createSubmissionData = () => {
		const data = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (value !== null) {
				data.append(key, value);
			}
		});
		return data;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear specific field error when user starts typing
		if (errors[name as keyof FormErrors]) {
			setErrors(prev => ({
				...prev,
				[name]: undefined
			}));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, profile_picture: file }));
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleOAuthLogin = (provider: string) => {
		authService.initiateOAuth(provider);
	};

	// Handle step navigation (Step 1 -> Step 2)
	const handleContinue = () => {
		if (validateStep1()) {
			setStep(2);
		}
	};

	// Handle form submission (only on Step 2)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (step === 1) {
			handleContinue();
			return;
		}

		// Step 2: Final submission
		if (!validateStep2()) {
			return;
		}

		setIsLoading(true);

		try {
			const submissionData = createSubmissionData();
			await authService.register(submissionData);
			toast.success("Account created successfully! Welcome to MovieTube!");
			router.push("/home");
		} catch (error: any) {
			setErrors({});

			const backendErrors = parseBackendErrors(error.response);

			if (Object.keys(backendErrors).length > 0) {
				// Field-specific errors - go back to step 1
				setErrors(backendErrors);
				setStep(1);
				toast.error("Please correct the highlighted fields and try again.");
			} else {
				// General error handling
				const errorMessage = error.response?.data?.message ||
					error.message ||
					"Registration failed. Please check your connection and try again.";
				toast.error(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const goToPreviousStep = () => {
		setStep(1);
	};

	const navigateToLogin = () => {
		router.push("/login");
	};

	return {
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
	};
};
