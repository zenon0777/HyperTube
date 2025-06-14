import React from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

function Header({ router }: { router: ReturnType<typeof useRouter> }) {
  const t = useTranslations("Index");
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <div className="relative">
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-xl shadow-lg">
              Z
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl blur-lg opacity-50" />
          </div>
          <span className="text-white">Tube</span>
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            {t("free")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => router.push("/login")}
            className="text-gray-300 hover:text-white transition-colors font-medium"
          >
            {t("signIn")}
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-bold transition-all duration-200 shadow-lg"
          >
            {t("signUp")}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
