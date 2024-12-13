import { motion } from "framer-motion";
import Image from "next/image";
import { AiOutlineGithub } from "react-icons/ai";

export default function Footer() {
  const footerLinks = [
    {
      title: "Quick Links",
      items: [
        { label: "Home", href: "#" },
        { label: "Movies", href: "#movies" },
        { label: "TV Shows", href: "#tvshows" },
        { label: "Upcoming", href: "#upcoming" },
      ],
    },
    {
      title: "Movies",
      items: [
        { label: "Action", href: "?movies=action" },
        { label: "Comedy", href: "?movies=comedy" },
        { label: "Drama", href: "?movies=drama" },
        { label: "Sci-Fi", href: "?movies=scifi" },
      ],
    },
    {
      title: "TV Shows",
      items: [
        { label: "Action", href: "?tv=action" },
        { label: "Comedy", href: "?tv=comedy" },
        { label: "Drama", href: "?tv=drama" },
        { label: "Sci-Fi", href: "?tv=scifi" },
      ],
    },
  ];

  const socialLinks = [{ icon: AiOutlineGithub, href: "#", color: "#1877F2" }];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-black text-white py-8 sm:py-12"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/imdb_top_250.jpeg"
          alt="Footer Background"
          width={1920}
          height={1080}
          quality={90}
          className="opacity-50 object-cover w-full h-full"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50 z-10"></div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Z-Tube Description */}
          <div className="col-span-1">
            <motion.h3
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="text-2xl font-bold mb-4 text-orange-500"
            >
              Z-Tube
            </motion.h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Experience seamless torrent streaming like never before. Your
              gateway to the latest blockbuster movies and trending TV shows.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <social.icon size={24} style={{ color: social.color }} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <h3 className="text-xl font-semibold mb-4 text-orange-500">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <motion.a
                      href={item.href}
                      whileHover={{
                        x: 5,
                        color: "#FB9722",
                        transition: { duration: 0.2 },
                      }}
                      className="text-gray-300 text-sm hover:text-orange-500 transition-colors"
                    >
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-orange-500">
              Contact
            </h3>
            <div className="text-gray-300 text-sm">
              <p>abderrahmane.daifi@protonmail.com</p>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t border-gray-800 mt-8 pt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            © 2024 Z-Tube. All rights reserved.
            <span className="ml-2 text-orange-500">
              Powered by Zenøn The Stoiç Developer
            </span>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
