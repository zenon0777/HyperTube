import { useTranslations } from "next-intl";
import Image from "next/image";
import {
    Shield,
    Zap,
    Star,
} from "lucide-react";
import WhyChooseCard from "./WhyChooseCard";

function InfoSection() {
    const t = useTranslations("Index");
    return (
        <section className="py-20 px-6 bg-slate-950/50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        {t("infoTitle")}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        {t("infoDescription")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h3 className="text-3xl font-bold mb-6">{t("howItWorks")}</h3>
                        <div className="space-y-4">
                            {[
                                {
                                    step: "1",
                                    title: t("step1Title"),
                                    desc: t("step1Desc"),
                                    color: "bg-orange-500",
                                },
                                {
                                    step: "2",
                                    title: t("step2Title"),
                                    desc: t("step2Desc"),
                                    color: "bg-pink-500",
                                },
                                {
                                    step: "3",
                                    title: t("step3Title"),
                                    desc: t("step3Desc"),
                                    color: "bg-purple-500",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div
                                        className={`text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ${item.color}`}
                                    >
                                        {item.step}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">{item.title}</h4>
                                        <p className="text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <Image
                            src="/imk.jpeg"
                            alt="Z-tube Interface"
                            width={600}
                            height={400}
                            className="rounded-2xl shadow-2xl w-auto h-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-pink-500/20 rounded-2xl" />
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">{t("whyChoose")}</h3>
                    <p className="text-gray-300 text-lg">
                        {t("whyChooseSubtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <WhyChooseCard
                        icon={<Shield className="w-8 h-8 text-green-400" />}
                        title={t("featureCompletelyFree")}
                        desc={t("featureCompletelyFreeDesc")}
                        bg="bg-slate-800/50"
                        border="border-slate-700/50"
                    />
                    <WhyChooseCard
                        icon={<Zap className="w-8 h-8 text-blue-400" />}
                        title={t("featureNoAds")}
                        desc={t("featureNoAdsDesc")}
                        bg="bg-slate-800/50"
                        border="border-slate-700/50"
                    />
                    <WhyChooseCard
                        icon={<Star className="w-8 h-8 text-purple-400" />}
                        title={t("featurePremiumQuality")}
                        desc={t("featurePremiumQualityDesc")}
                        bg="bg-slate-800/50"
                        border="border-slate-700/50"
                    />
                </div>
            </div>
        </section>
    );
}

export default InfoSection;