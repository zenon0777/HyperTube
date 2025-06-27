import { useTranslations } from "next-intl";
import {
    Smartphone,
    Monitor,
} from "lucide-react";


interface Device {
    icon: React.ReactNode;
    name: string;
    desc: string;
}

const DeviceCompatibilitySection = () => {
    const t = useTranslations("Index");
    return (
        <section className="py-20 px-6 bg-slate-950/50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        {t("devicesTitle")}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        {t("devicesSubtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {[
                        {
                            icon: <Monitor className="w-12 h-12" />,
                            name: t("deviceComputer"),
                            desc: t("deviceComputerDesc"),
                        },
                        {
                            icon: <Smartphone className="w-12 h-12" />,
                            name: t("deviceMobile"),
                            desc: t("deviceMobileDesc"),
                        },
                    ].map((device: Device, index: number) => (
                        <div
                            key={index}
                            className="text-center bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
                        >
                            <div className="text-purple-400 mb-4 flex justify-center">
                                {device.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{device.name}</h3>
                            <p className="text-gray-400">{device.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default DeviceCompatibilitySection