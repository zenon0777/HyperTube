import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

function FinalCTASection({ router }: { router: ReturnType<typeof useRouter> }) {
    const t = useTranslations("Index");
    return (
        <section className="py-20 px-6">
            <div className="container mx-auto">
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-3xl p-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        {t("finalCTATitle")}
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        {t("finalCTASubtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={() => router.push("/register")}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 shadow-xl"
                        >
                            {t("createFreeAccount")}
                        </button>
                        <button
                            onClick={() => router.push("/login")}
                            className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200"
                        >
                            {t("signIn")}
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            {
                                icon: <Check className="w-5 h-5" />,
                                text: t("benefitNoCard"),
                            },
                            { icon: <Check className="w-5 h-5" />, text: t("benefitInstantAccess") },
                            { icon: <Check className="w-5 h-5" />, text: t("benefitCancelAnytime") },
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-gray-300"
                            >
                                <span className="text-green-400">{benefit.icon}</span>
                                <span>{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


export default FinalCTASection