import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  Icon: LucideIcon;
  required?: boolean;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const FormInput = ({
  id,
  name,
  type,
  label,
  value,
  Icon,
  required = true,
  placeholder,
  onChange,
  showPasswordToggle,
  showPassword,
  onTogglePassword
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative group">
        <Icon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200 group-hover:bg-gray-700/70"
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-orange-300 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
      </div>
    </div>
  );
};