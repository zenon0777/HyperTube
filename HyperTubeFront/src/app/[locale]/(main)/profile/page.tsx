"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Edit, 
  Settings, 
  Person, 
  Email, 
  PhotoCamera,
  Movie,
  Favorite,
  History,
  Star,
  Download
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { RootState } from "@/app/store";
import { getUserProfile } from "@/app/store/userSlice";
import { authService } from "@/lib/auth"; 

interface UserStats {
  watchedMovies: number;
  favoriteMovies: number;
  totalWatchTime: string;
  downloadedMovies: number;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    watchedMovies: 42,
    favoriteMovies: 18,
    totalWatchTime: "156h 32m",
    downloadedMovies: 24
  });

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile() as any);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user?.profile_picture) {
      setProfileImage(user.profile_picture);
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      // Here you would typically upload to your backend
      toast.success("Profile picture updated!");
    }
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error loading profile</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-900 text-white"
    >
      {/* Header with Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-4 right-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-all"
          >
            <Edit className="w-4 h-4" />
            {isEditing ? "Save" : "Edit Profile"}
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg"
              >
                {/* <Image
                  src={profileImage || "/default-avatar.png"}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                /> */}
              </motion.div>
              {isEditing && (
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
                >
                  <PhotoCamera className="w-4 h-4 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold mb-2"
              >
                {user?.username || "Username"}
              </motion.h1>
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4"
              >
                <Email className="w-4 h-4" />
                <span>{user?.email || "email@example.com"}</span>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center md:justify-start gap-2 text-gray-400"
              >
                <Person className="w-4 h-4" />
                <span>Member since 2024</span>
              </motion.div>
            </div>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <Movie className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.watchedMovies}</div>
            <div className="text-sm text-gray-400">Watched</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <Favorite className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.favoriteMovies}</div>
            <div className="text-sm text-gray-400">Favorites</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <History className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.totalWatchTime}</div>
            <div className="text-sm text-gray-400">Watch Time</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{userStats.downloadedMovies}</div>
            <div className="text-sm text-gray-400">Downloads</div>
          </div>
        </motion.div>

        {/* Activity Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-orange-500" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="font-medium">Movie Title {item}</div>
                    <div className="text-sm text-gray-400">Watched 2 hours ago</div>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Favorite Movies */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Favorite className="w-5 h-5 text-red-500" />
              Favorite Movies
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-[2/3] bg-gray-700 rounded-lg cursor-pointer overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 opacity-50"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Preferences */}
        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-xl p-6 mt-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Preferences</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Favorite Genres</h3>
              <div className="flex flex-wrap gap-2">
                {["Action", "Drama", "Comedy", "Sci-Fi"].map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-400 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Streaming Quality</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">1080p HD</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}