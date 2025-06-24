"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  AccountCircle,
  ArrowBack,
  Person,
  Badge,
  Email,
  EmailOutlined
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { authService } from "@/lib/auth";

interface UserProfile {
  id: number;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  is_own_profile: boolean;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id as string;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await authService.getUserById(userId);
        setUser(userData);
      } catch (error: unknown) {
        console.error("Error fetching user profile:", error);
        let errorMessage = "Failed to load user profile";
        
        if (error && typeof error === 'object' && 'response' in error) {
          const errorResponse = error as { response?: { data?: { error?: string } } };
          errorMessage = errorResponse.response?.data?.error || errorMessage;
        }
        
        setError(errorMessage);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleViewOwnProfile = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
          <p className="text-gray-400 mb-6">{error || "The user you're looking for doesn't exist."}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-xl transition-all backdrop-blur-sm border border-gray-600/50"
          >
            <ArrowBack className="w-5 h-5" />
            Back
          </motion.button>

          {user.is_own_profile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewOwnProfile}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl transition-all backdrop-blur-sm border border-orange-500/30"
            >
              <AccountCircle className="w-5 h-5" />
              Edit Profile
            </motion.button>
          )}
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="text-center mb-8">
            {/* Profile Picture */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/50 shadow-2xl mx-auto mb-6"
            >                  <Image
                    src={user.profile_picture || "/default-avatar.svg"}
                    alt={`${user.username}'s profile`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
            </motion.div>

            {/* User Name */}
            <h1 className="text-4xl font-bold text-white mb-2">
              {user.username}
            </h1>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium">
              <Badge className="w-4 h-4" />
              {user.is_own_profile ? "Your Profile" : "User Profile"}
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* First Name */}
            {user.first_name && (
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Person className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">First Name</h3>
                  <p className="text-gray-400">{user.first_name}</p>
                </div>
              </div>
            )}

            {/* Last Name */}
            {user.last_name && (
              <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Person className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Last Name</h3>
                  <p className="text-gray-400">{user.last_name}</p>
                </div>
              </div>
            )}

            {/* Email - Only shown for own profile */}
            {user.is_own_profile && user.email && (
              <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Email className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Email Address</h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
            )}

            {/* Privacy Notice for Other Users */}
            {!user.is_own_profile && (
              <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-700/20 rounded-xl border border-gray-600/30">
                <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center">
                  <EmailOutlined className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-gray-400 font-medium">Email Address</h3>
                  <p className="text-gray-500 text-sm">Private - Only visible to the user</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          {!user.first_name && !user.last_name && (
            <div className="text-center mt-8 py-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400"
              >
                <AccountCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {user.is_own_profile 
                    ? "Complete your profile by adding your name and other details."
                    : "This user hasn't completed their profile yet."
                  }
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        {user.is_own_profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewOwnProfile}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              Edit Your Profile
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
