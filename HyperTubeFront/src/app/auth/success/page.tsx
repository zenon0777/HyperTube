"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { getUserProfile } from '@/app/store/userSlice';
import { toast } from 'react-toastify';

export default function OAuthSuccessPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const handleOAuthSuccess = async () => {
            try {

                await dispatch(getUserProfile()).unwrap();
                
                toast.success('Login successful!');
                

                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || '/home';
                router.push(redirect);
                
            } catch (error) {
                toast.error('Authentication failed');
                router.push('/login');
            }
        };

        handleOAuthSuccess();
    }, [dispatch, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-white mt-4">Completing authentication...</p>
            </div>
        </div>
    );
}
