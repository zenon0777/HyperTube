"use client";
import { motion } from "framer-motion";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import { Provider } from "react-redux";
import { store } from "./store";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex flex-col overflow-hidden">
      <Provider store={store}>
        <main className="relative max-w-[1500px] mx-auto justify-center">
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute top-0 left-0 w-full lg:px-4 px-0 lg:py-4 py-2 flex justify-between items-center bg-transparent z-50 bg-gray-900 text-white "
          >
            <NavBar />
          </motion.header>
          {children}
        </main>
      </Provider>
      <Footer />
    </main>
  );
}