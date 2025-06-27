import { Upload } from "lucide-react";
import Image from "next/image";

interface ProfilePictureUploadProps {
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	previewUrl: string | null;
  }
  
  export const ProfilePictureUpload = ({ onFileChange, previewUrl }: ProfilePictureUploadProps) => {
	return (
	  <div className="space-y-4 text-center">
		<div className="flex flex-col items-center gap-4">
		  {previewUrl ? (
			<div className="relative w-32 h-32 rounded-full overflow-hidden">
			  <Image
				src={previewUrl}
				alt="Profile preview"
				fill
				priority={true}
				className="object-cover"
			  />
			</div>
		  ) : (
			<div className="w-32 h-32 rounded-full bg-gray-700/50 flex items-center justify-center">
			  <Upload size={32} className="text-gray-400" />
			</div>
		  )}
		  <label className="cursor-pointer">
			<span className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
			  {previewUrl ? 'Change Picture' : 'Upload Picture'}
			</span>
			<input
			  type="file"
			  className="hidden"
			  accept="image/*"
			  onChange={onFileChange}
			/>
		  </label>
		</div>
	  </div>
	);
  };