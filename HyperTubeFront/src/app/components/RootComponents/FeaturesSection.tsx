import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeaturesSection = ({
    features,
}: {
    features: Feature[];
}) => {
    const t = useTranslations("Index");
    return (
        <section className="py-20 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        {t("featuresTitle")}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        {t("featuresSubtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature: Feature, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-300"
                        >
                            <div className="text-orange-400 mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;