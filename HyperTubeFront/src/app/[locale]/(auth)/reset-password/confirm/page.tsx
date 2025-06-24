"use client"
import { useState } from 'react';
import { Lock, ArrowRight, Film } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/lib/auth';
import { FormInput } from '../../components/FormInput';

export default function PasswordResetConfirm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const user = params.get('user');
      await authService.resetPassword(token!, formData.password, formData.password2 , user!);
      toast.success('Password has been reset successfully');
      router.push('/login');
    } catch (error: unknown) {
      console.log('Password reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed. Please try again.';
      toast.error(errorMessage);
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
          Set New Password
        </h1>
        <p className="text-gray-400">Enter your new password</p>
      </div>

      <div className="mt-8 backdrop-blur-md bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            value={formData.password}
            Icon={Lock}
            placeholder="Enter new password"
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
            placeholder="Confirm new password"
            onChange={handleChange}
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 overflow-hidden"
          >
            <span className={`flex items-center justify-center gap-2 transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Reset Password
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}