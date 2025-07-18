import { Github, Chrome } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const DiscordIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

interface SocialLoginButtonsProps {
    onOAuthLogin: (provider: string) => void;
}

export function SocialLoginButtons({ onOAuthLogin }: SocialLoginButtonsProps) {
    const t = useTranslations('Auth.common');
    
    return (
        <div className="mt-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-800 px-2 text-gray-400">{t('or')} {t('continueWith').toLowerCase()}</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onOAuthLogin('42')}
                className="mt-4 w-full flex items-center justify-center gap-3 bg-gray-700/50 text-white py-3 px-4 rounded-xl hover:bg-gray-700/70 transition-colors"
            >
                <span>{t('continueWith')}</span>
                <Image
                    src="/42.png"
                    alt="42 School"
                    width={50}
                    height={50}
                    className="object-contain w-auto h-auto"
                />
            </button>

            <div className="grid grid-cols-3 gap-4 mt-4">
                <button
                    type="button"
                    onClick={() => onOAuthLogin('github')}
                    className="flex items-center justify-center p-3 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition-colors"
                    title={`${t('continueWith')} GitHub`}
                >
                    <Github className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={() => onOAuthLogin('google')}
                    className="flex items-center justify-center p-3 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition-colors"
                    title={`${t('continueWith')} Google`}
                >
                    <Chrome className="w-5 h-5" />
                </button>                <button
                    type="button"
                    onClick={() => onOAuthLogin('discord')}
                    className="flex items-center justify-center p-3 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700/70 transition-colors"
                    title={`${t('continueWith')} Discord`}
                >
                    <DiscordIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
