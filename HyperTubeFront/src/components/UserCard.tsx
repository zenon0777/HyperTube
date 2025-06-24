"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserCardProps {
  user: {
    id: string | number;
    username: string;
    profile_picture?: string | null;
    first_name?: string;
    last_name?: string;
  };
  size?: "sm" | "md" | "lg";
  showFullName?: boolean;
  className?: string;
  clickable?: boolean;
}

export default function UserCard({ 
  user, 
  size = "md", 
  showFullName = false, 
  className = "",
  clickable = true 
}: UserCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (clickable && user.id) {
      router.push(`/user/${user.id}`);
    }
  };

  const sizeClasses = {
    sm: {
      container: "flex items-center gap-2",
      avatar: "w-8 h-8",
      text: "text-sm"
    },
    md: {
      container: "flex items-center gap-3",
      avatar: "w-10 h-10",
      text: "text-base"
    },
    lg: {
      container: "flex items-center gap-4",
      avatar: "w-12 h-12",
      text: "text-lg"
    }
  };

  const displayName = showFullName && user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.username;

  const content = (
    <>      <div className={`${sizeClasses[size].avatar} rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0`}>
        {user.profile_picture ? (
          <Image
            src={user.profile_picture}
            alt={`${user.username}'s profile`}
            width={size === "sm" ? 32 : size === "md" ? 40 : 48}
            height={size === "sm" ? 32 : size === "md" ? 40 : 48}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/default-avatar.svg"
            alt="Default avatar"
            width={size === "sm" ? 32 : size === "md" ? 40 : 48}
            height={size === "sm" ? 32 : size === "md" ? 40 : 48}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p className={`${sizeClasses[size].text} font-medium text-white truncate`}>
          {displayName}
        </p>
        {showFullName && user.first_name && user.last_name && (
          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
        )}
      </div>
    </>
  );

  if (!clickable) {
    return (
      <div className={`${sizeClasses[size].container} ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`${sizeClasses[size].container} ${className} hover:bg-gray-700/30 rounded-lg p-2 -m-2 transition-all duration-200 cursor-pointer`}
    >
      {content}
    </motion.button>
  );
}

// Alternative compact version for use in lists
export function UserAvatar({ 
  user, 
  size = "md", 
  className = "",
  clickable = true 
}: Pick<UserCardProps, "user" | "size" | "className" | "clickable">) {
  const router = useRouter();

  const handleClick = () => {
    if (clickable && user.id) {
      router.push(`/user/${user.id}`);
    }
  };

  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const content = (    <div className={`${sizeMap[size]} rounded-full overflow-hidden bg-gray-700 flex items-center justify-center ${className}`}>
      {user.profile_picture ? (
        <Image
          src={user.profile_picture}
          alt={`${user.username}'s profile`}
          width={size === "sm" ? 32 : size === "md" ? 40 : 48}
          height={size === "sm" ? 32 : size === "md" ? 40 : 48}
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src="/default-avatar.svg"
          alt="Default avatar"
          width={size === "sm" ? 32 : size === "md" ? 40 : 48}
          height={size === "sm" ? 32 : size === "md" ? 40 : 48}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );

  if (!clickable) {
    return content;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="hover:opacity-80 transition-opacity cursor-pointer"
      title={`View ${user.username}'s profile`}
    >
      {content}
    </motion.button>
  );
}
