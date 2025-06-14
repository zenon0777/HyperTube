'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    // The pathname includes the current locale, so we need to remove it
    const newPath = `/${newLocale}${pathname.substring(3)}`;
    router.replace(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 w-full text-white bg-orange-500 rounded-md hover:bg-orange-500/50 transition-colors"
      >
        <span>{locale.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 hover:bg-orange-500/50 transition-colors">
          <ul className="py-1">
            <li>
              <button
                onClick={() => handleLanguageChange('en')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-orange-500/50 transition-colors"
              >
                English
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLanguageChange('fr')}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-orange-500/50 transition-colors"
              >
                Français
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
