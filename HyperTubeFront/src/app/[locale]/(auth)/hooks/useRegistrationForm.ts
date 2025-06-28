import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authService } from "@/lib/auth";
import { toast } from "react-toastify";

interface RegisterUserData {
	username: string;
	email: string;
	password: string;
	password2: string;
	first_name?: string;
	last_name?: string;
	profile_picture?: File;
	[key: string]: unknown;
}

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
	const router = useRouter();
	const t = useTranslations('Auth.register');
	const tValidation = useTranslations('Auth.validation');
	
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

	// Reusable validation functions
	const validators = {
		email: (value: string): string | null => {
			if (!value.trim()) return tValidation('emailRequired');
			if (!/\S+@\S+\.\S+/.test(value)) return tValidation('emailInvalid');
			return null;
		},

		username: (value: string): string | null => {
			if (!value.trim()) return tValidation('usernameRequired');
			if (value.length < 3) return tValidation('usernameMinLength');
			return null;
		},

		required: (value: string, fieldName: string): string | null => {
			return !value.trim() ? `${fieldName} ${tValidation('fieldRequired')}` : null;
		},

		password: (password: string): string | null => {
			if (password.length < 8) return tValidation('passwordMinLength');
			if (!/[A-Z]/.test(password)) return tValidation('passwordUppercase');
			if (!/[0-9]/.test(password)) return tValidation('passwordNumber');
			if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return tValidation('passwordSpecialChar');
			return null;
		},

		passwordConfirmation: (password: string, confirmPassword: string): string | null => {
			if (!confirmPassword) return tValidation('confirmPasswordRequired');
			if (password !== confirmPassword) return tValidation('passwordsNoMatch');
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

		const firstNameError = validators.required(formData.first_name, t('firstName'));
		if (firstNameError) newErrors.first_name = firstNameError;

		const lastNameError = validators.required(formData.last_name, t('lastName'));
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
			toast.error(t('uploadPhotoRequired'));
			return false;
		}
		return true;
	};

	// Utility function to parse backend errors
	const parseBackendErrors = (errorResponse: { data?: Record<string, string | string[]> }): FormErrors => {
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

	// Utility function to create submission data
	const createSubmissionData = (): RegisterUserData => {
		return {
			username: formData.username,
			email: formData.email,
			password: formData.password,
			password2: formData.password2,
			first_name: formData.first_name,
			last_name: formData.last_name,
			profile_picture: formData.profile_picture || undefined,
		};
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
			toast.success(t('registrationSuccess'));
			router.push("/home");
		} catch (error: unknown) {
			setErrors({});

			const backendErrors = parseBackendErrors((error as { response?: { data?: Record<string, string | string[]>; message?: string } }).response || {});

			if (Object.keys(backendErrors).length > 0) {
				// Field-specific errors - go back to step 1
				setErrors(backendErrors);
				setStep(1);
				toast.error(t('correctFieldsError'));
			} else {
				// General error handling
				const errorResponse = error as { response?: { data?: { message?: string } }; message?: string };
				const errorMessage = errorResponse.response?.data?.message ||
					errorResponse.message ||
					t('connectionError');
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
