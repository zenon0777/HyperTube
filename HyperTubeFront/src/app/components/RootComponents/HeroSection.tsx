import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Shield,
    Zap,
    Star,
    Clock,
} from "lucide-react";

const HeroSection = ({ router }: { router: ReturnType<typeof useRouter> }) => {
    const t = useTranslations("Index");

    return (
        <section className="relative pt-24 pb-16 px-6">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="/imdb_top_250.jpeg"
                    alt="Movie Collage"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-slate-900/90 z-10" />
            </div>

            <div className="container mx-auto relative z-20">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            {t.rich("title", {
                                br: () => <br />,
                                gradient: (chunks) => (
                                    <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                            {t("heroSubtitle")}
                            <br />
                            <span className="text-orange-400 font-semibold">{t("benefitNoAds")}</span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                    >
                        {[
                            {
                                text: t("benefitFree"),
                                icon: <Shield className="w-5 h-5" />,
                                color: "text-green-400",
                            },
                            {
                                text: t("benefitNoAds"),
                                icon: <Zap className="w-5 h-5" />,
                                color: "text-blue-400",
                            },
                            {
                                text: t("benefit4K"),
                                icon: <Star className="w-5 h-5" />,
                                color: "text-yellow-400",
                            },
                            {
                                text: t("benefitInstant"),
                                icon: <Clock className="w-5 h-5" />,
                                color: "text-purple-400",
                            },
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3"
                            >
                                <span className={benefit.color}>{benefit.icon}</span>
                                <span className="text-gray-200 font-medium text-sm">
                                    {benefit.text}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-8"
                    >
                        <p className="text-lg mb-6">
                            {t("callToAction")}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => router.push("/register")}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl"
                        >
                            {t("signUpFree")}
                        </button>
                        <button
                            onClick={() => router.push("/login")}
                            className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 backdrop-blur-sm"
                        >
                            {t("signIn")}
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;