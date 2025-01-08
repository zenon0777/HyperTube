"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User, LogOut, Edit, Camera, Save, X, ArrowLeft, Mail, UserCircle } from "lucide-react";
import { getUserProfile } from '@/app/store/userSlice';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface FormData {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_picture: File | null;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    profile_picture: null
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || '',
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        password: '',
        profile_picture: null
      });
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataToSend.append(key, value);
      }
    });

    try {
      // Add here the call to the updateProfile
      setIsEditing(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 transition-all duration-300">
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <Alert className="bg-green-500/20 border-green-500/50 text-green-500">
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-200 hover:-translate-x-1"
          >
            <ArrowLeft size={20} className="animate-pulse" />
            Back
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-orange-500/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/20">
                  {previewUrl || user?.profile_picture ? (
                    <img 
                      src={previewUrl || user?.profile_picture} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <User size={40} className="text-gray-400 transition-all duration-300 group-hover:scale-110" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-all duration-200 cursor-pointer transform hover:scale-110 hover:rotate-12">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                  {!isEditing ? (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-orange-500 hover:text-orange-400 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                      <Edit size={16} className="animate-pulse" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-gray-300 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="text-orange-500 hover:text-orange-400 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                      >
                        <Save size={16} />
                        Save
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', name: 'first_name', value: formData.first_name, display: user?.first_name },
                    { label: 'Last Name', name: 'last_name', value: formData.last_name, display: user?.last_name },
                    { label: 'Username', name: 'username', value: formData.username, display: user?.username },
                    { label: 'Email', name: 'email', value: formData.email, display: user?.email, type: 'email' }
                  ].map((field) => (
                    <div key={field.name} className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                      <label className="text-sm text-gray-400">{field.label}</label>
                      <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/70">
                        {isEditing ? (
                          <input
                            type={field.type || 'text'}
                            name={field.name}
                            value={field.value}
                            onChange={handleInputChange}
                            className="bg-transparent text-white w-full outline-none focus:ring-1 focus:ring-orange-500 rounded px-2 transition-all duration-200"
                          />
                        ) : (
                          <span className="text-white">{field.display}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-700">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;