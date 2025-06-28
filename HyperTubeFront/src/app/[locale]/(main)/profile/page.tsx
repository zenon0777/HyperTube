"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Edit,
  PhotoCamera,
  Lock,
  Visibility,
  VisibilityOff,
  Save,
  AccountCircle,
  Security
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { RootState, AppDispatch } from "@/app/store";
import { getUserProfile } from "@/app/store/userSlice";
import { authService } from "@/lib/auth";

interface PasswordChangeData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

type ActiveTab = 'profile' | 'security';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const t = useTranslations("Profile");
  const tValidation = useTranslations("Auth.validation");
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: ""
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: ""
  });

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
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return t('passwordMinLength');
    if (!/[A-Z]/.test(password)) return t('passwordUppercase');
    if (!/[0-9]/.test(password)) return t('passwordNumber');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return t('passwordSpecialChar');
    return null;
  };

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setProfileImage(user.profile_picture);
      setFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || ""
      });
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("fileTooLarge") || "File size must be less than 5MB");
        return;
      }

      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.onerror = () => {
        toast.error(t("fileReadError") || "Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateProfileForm = (): boolean => {
    const newErrors = {
      username: "",
      email: "",
      first_name: "",
      last_name: ""
    };

    // Validate each field
    const emailError = validators.email(formData.email);
    if (emailError) newErrors.email = emailError;

    const usernameError = validators.username(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const firstNameError = validators.required(formData.first_name, t('firstName'));
    if (firstNameError) newErrors.first_name = firstNameError;

    const lastNameError = validators.required(formData.last_name, t('lastName'));
    if (lastNameError) newErrors.last_name = lastNameError;

    setFormErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error(t("passwordsDontMatch"));
      return;
    }

    const passwordError = validatePassword(passwordData.new_password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      await authService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password2: passwordData.confirm_password
      });

      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: ""
      });

      toast.success(t("passwordChangedSuccess"));
    } catch {
      toast.error(t("failedToChangePassword"));
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    // Validate form before submitting
    if (!validateProfileForm()) {
      toast.error(t("pleaseFixErrors") || "Please fix the errors before saving");
      return;
    }

    try {
      const updateData = new FormData();

      updateData.append('username', formData.username.trim());
      updateData.append('email', formData.email.trim());
      updateData.append('first_name', formData.first_name.trim());
      updateData.append('last_name', formData.last_name.trim());

      if (profileFile) {
        updateData.append('profile_picture', profileFile);
      }
      authService.updateProfile(user.id, updateData);

      setProfileFile(null);

      setTimeout(() => {
        dispatch(getUserProfile());
      }, 100);

      setIsEditing(false);
      toast.success(t("profileUpdatedSuccess"));

    } catch{
      toast.error(t("failedToUpdateProfile"));
    }
  };
  const handleEditProfile = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
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
    return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">{t("errorLoadingProfile")}</h2>
        <p className="text-gray-400">{error}</p>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 sticky top-8">              {/* Profile Summary */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-full overflow-hidden border-3 border-orange-500/50 mx-auto mb-4"
                  >
                    <Image
                      src={profileImage || "/default-avatar.svg"}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {user?.username || "User"}
                </h3>
              </div>
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: t('profileInfo'), icon: AccountCircle },
                  { id: 'security', label: t('security'), icon: Security }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
                >                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-white">{t("profileInformation")}</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditProfile}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isEditing
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
                        }`}
                    >
                      {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      {isEditing ? t('saveChanges') : t('editProfile')}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Profile Picture */}
                    <div className="md:col-span-2 flex justify-center mb-8">
                      <div className="relative">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/50 shadow-2xl"
                        >
                          <Image
                            src={profileImage || "/default-avatar.svg"}
                            alt="Profile Picture"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        {isEditing && (
                          <label
                            htmlFor="profile-upload"
                            className="absolute bottom-2 right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
                          >
                            <PhotoCamera className="w-5 h-5 text-white" />
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
                    </div>
                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t("username")}</label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.username
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
                                }`}
                            />
                            {formErrors.username && (
                              <p className="mt-1 text-sm text-red-400">{formErrors.username}</p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white">
                            {user?.username || t("notSet")}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t("email")}</label>
                        {isEditing ? (
                          <div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.email
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
                                }`}
                            />
                            {formErrors.email && (
                              <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white">
                            {user?.email || t("notSet")}
                          </div>
                        )}
                      </div>
                    </div>                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t("firstName")}</label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.first_name
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
                                }`}
                              placeholder={t("enterFirstName")}
                            />
                            {formErrors.first_name && (
                              <p className="mt-1 text-sm text-red-400">{formErrors.first_name}</p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white">
                            {user?.first_name || t("notSet")}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t("lastName")}</label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formErrors.last_name
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
                                }`}
                              placeholder={t("enterLastName")}
                            />
                            {formErrors.last_name && (
                              <p className="mt-1 text-sm text-red-400">{formErrors.last_name}</p>
                            )}
                          </div>
                        ) : (
                          <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white">
                            {user?.last_name || t("notSet")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
                >                  <div className="flex items-center gap-3 mb-8">
                    <Security className="w-8 h-8 text-orange-500" />
                    <h2 className="text-3xl font-bold text-white">{t("securitySettings")}</h2>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-600/50">
                      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-orange-500" />
                        {t("changePassword")}
                      </h3>                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t("currentPassword")}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.old ? "text" : "password"}
                              name="old_password"
                              value={passwordData.old_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                              placeholder={t("enterCurrentPassword")}
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('old')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword.old ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t("newPassword")}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.new ? "text" : "password"}
                              name="new_password"
                              value={passwordData.new_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                              placeholder={t("enterNewPassword")}
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('new')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword.new ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {t("confirmNewPassword")}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword.confirm ? "text" : "password"}
                              name="confirm_password"
                              value={passwordData.confirm_password}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all pr-12"
                              placeholder={t("confirmNewPasswordPlaceholder")}
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('confirm')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword.confirm ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleChangePassword}
                          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-xl transition-all shadow-lg"
                        >
                          {t("updatePassword")}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}