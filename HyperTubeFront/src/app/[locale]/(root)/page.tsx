'use client';

import { useRouter } from "next/navigation";
import {
    Download,
    Globe,
    Shield,
    Zap,
    Star,
    Film,
} from "lucide-react";
import Footer from "@/app/components/Footer/Footer";
import Header from "@/app/components/header/header";
import { useTranslations } from "next-intl";
import HeroSection from "@/app/components/RootComponents/HeroSection";
import FeaturesSection from "@/app/components/RootComponents/FeaturesSection";
import InfoSection from "@/app/components/RootComponents/InfoSection";
import DeviceCompatibilitySection from "@/app/components/RootComponents/DeviceCompatibilitySection";
import FinalCTASection from "@/app/components/RootComponents/FinalCTASection";
import PopularMoviesSection from "@/app/components/PopularMoviesSection/PopularMoviesSection";

export default function HomePage() {
    const router = useRouter();
    const t = useTranslations("Index");

    const features = [

        {
            icon: <Shield className="w-8 h-8" />,
            title: t("featureCompletelyFree"),
            description: t("featureCompletelyFreeDesc"),
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: t("featureNoAds"),
            description: t("featureNoAdsDesc"),
        },
        {
            icon: <Film className="w-8 h-8" />,
            title: t("featurePremiumQuality"),
            description: t("featurePremiumQualityDesc"),
        },
        {
            icon: <Download className="w-8 h-8" />,
            title: t("featureDownloadWatch"),
            description: t("featureDownloadWatchDesc"),
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: t("featureGlobalAccess"),
            description: t("featureGlobalAccessDesc"),
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: t("feature4KQuality"),
            description: t("feature4KQualityDesc"),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <Header router={router} />
            <HeroSection router={router} />
            <InfoSection />
            <FeaturesSection features={features} />
            <PopularMoviesSection />

            <DeviceCompatibilitySection />

            <FinalCTASection router={router} />

            <Footer />
        </div>
    );
}