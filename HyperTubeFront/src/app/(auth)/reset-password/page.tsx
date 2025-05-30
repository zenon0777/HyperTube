"use client"
import { useState } from 'react';
import { Mail, ArrowRight, Film } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/lib/auth';
import { FormInput } from '../components/FormInput';

interface FormInputEvent extends React.ChangeEvent<HTMLInputElement> {}

export const PasswordResetRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      toast.success('Password reset link has been sent to your email');
      router.push('/login');
    } catch (error: any) {
      console.log('Password reset request error:', error);
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
          Reset Password
        </h1>
        <p className="text-gray-400">Enter your email to receive a reset link</p>
      </div>

      <div className="mt-8 backdrop-blur-md bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            Icon={Mail}
            placeholder="Enter your email"
            onChange={(e: FormInputEvent) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 overflow-hidden"
          >
            <span className={`flex items-center justify-center gap-2 transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Send Reset Link
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>

          <div className="text-center text-sm pt-4">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequest;