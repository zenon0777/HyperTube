"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Tv,
  Smartphone,
  Monitor,
  Globe,
  Shield,
  Zap,
  Star,
  Check,
  Film,
  Clock,
} from "lucide-react";
import Footer from "./components/Footer/Footer";
import Header from "./components/header/header";
import PopularMoviesSection from "./components/PopularMoviesSection/PopularMoviesSection";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Free",
      description:
        "No subscription fees, no hidden costs, completely free forever",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Torrent-based technology ensures quick loading and smooth playback",
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: "Unlimited Movies",
      description: "Access thousands of movies and TV shows from every genre",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Download & Watch",
      description: "Save your favorites and watch offline anytime, anywhere",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Access",
      description: "Stream from anywhere in the world with no restrictions",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "4K Quality",
      description: "Enjoy ultra HD streaming on supported devices",
    },
  ];

  const devices = [
    {
      icon: <Tv className="w-12 h-12" />,
      name: "Smart TV",
      desc: "Cast to any TV",
    },
    {
      icon: <Monitor className="w-12 h-12" />,
      name: "Computer",
      desc: "Windows, Mac & Linux",
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      name: "Mobile",
      desc: "iOS & Android",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header router={router} />
      <HeroSection router={router} />
      <InfoSection devices={devices} />
      <FeaturesSection features={features} />
      <PopularMoviesSection />

      <DeviceCompatibilitySection devices={devices} />

      <FinalCTASection router={router} />

      <Footer />
    </div>
  );
}

function HeroSection({ router }: { router: ReturnType<typeof useRouter> }) {
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
              Stream Movies
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Completely Free
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Watch unlimited movies and TV shows without subscription fees.
              <br />
              <span className="text-orange-400 font-semibold">No ads</span>,
              <span className="text-pink-400 font-semibold"> no costs</span>,
              <span className="text-purple-400 font-semibold"> no limits</span>.
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
                text: "Free Forever",
                icon: <Shield className="w-5 h-5" />,
                color: "text-green-400",
              },
              {
                text: "No Ads",
                icon: <Zap className="w-5 h-5" />,
                color: "text-blue-400",
              },
              {
                text: "4K Quality",
                icon: <Star className="w-5 h-5" />,
                color: "text-yellow-400",
              },
              {
                text: "Instant Access",
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
              Ready to watch? Enter your email to get started.
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
              Sign Up Free
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 backdrop-blur-sm"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoSection({
  devices,
}: {
  devices: (typeof HomePage.prototype)["devices"];
}) {
  return (
    <section className="py-20 px-6 bg-slate-950/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            What is <span className="text-orange-500">Z-tube</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Z-tube is a revolutionary streaming platform that provides unlimited
            access to movies and TV shows without any subscription fees. Using
            advanced torrent-based technology, we deliver high-quality content
            directly to your devices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6">How Z-tube Works</h3>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Create Your Free Account",
                  desc: "Sign up with just your email - no credit card required",
                  color: "bg-orange-500",
                },
                {
                  step: "2",
                  title: "Browse Our Library",
                  desc: "Explore thousands of movies and TV shows across all genres",
                  color: "bg-pink-500",
                },
                {
                  step: "3",
                  title: "Start Streaming",
                  desc: "Watch instantly in HD/4K quality on any device",
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
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-pink-500/20 rounded-2xl" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Why Choose Z-tube?</h3>
          <p className="text-gray-300 text-lg">
            Unlike other streaming services, Z-tube is built for everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WhyChooseCard
            icon={<Shield className="w-8 h-8 text-green-400" />}
            title="Completely Free"
            desc="No monthly fees, no hidden costs, no credit card required. Free forever."
            bg="bg-slate-800/50"
            border="border-slate-700/50"
          />
          <WhyChooseCard
            icon={<Zap className="w-8 h-8 text-blue-400" />}
            title="No Advertisements"
            desc="Enjoy uninterrupted streaming without any ads or commercial breaks."
            bg="bg-slate-800/50"
            border="border-slate-700/50"
          />
          <WhyChooseCard
            icon={<Star className="w-8 h-8 text-purple-400" />}
            title="Premium Quality"
            desc="Stream in HD and 4K quality with crystal clear audio and video."
            bg="bg-slate-800/50"
            border="border-slate-700/50"
          />
        </div>
      </div>
    </section>
  );
}

function WhyChooseCard({
  icon,
  title,
  desc,
  bg,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-8 text-center`}>
      <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function FeaturesSection({
  features,
}: {
  features: (typeof HomePage.prototype)["features"];
}) {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Powerful <span className="text-pink-500">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Z-tube comes packed with features that make streaming effortless and
            enjoyable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => (
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

function DeviceCompatibilitySection({
  devices,
}: {
  devices: (typeof HomePage.prototype)["devices"];
}) {
  return (
    <section className="py-20 px-6 bg-slate-950/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Stream on <span className="text-purple-500">Any Device</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch your favorite content on any device, anywhere, anytime
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {devices.map((device: any, index: number) => (
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

function FinalCTASection({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-3xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start <span className="text-orange-500">Streaming</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users already enjoying unlimited free streaming on
            Z-tube
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 shadow-xl"
            >
              Create Free Account
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                icon: <Check className="w-5 h-5" />,
                text: "No credit card required",
              },
              { icon: <Check className="w-5 h-5" />, text: "Instant access" },
              { icon: <Check className="w-5 h-5" />, text: "Cancel anytime" },
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
