"use client";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <main className="min-h-screen flex flex-col overflow-hidden">
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
        <Provider store={store}>
          <PersistGate
            loading={
              <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                <p className="ml-4 text-xl">Loading...</p>
              </div>
            }
            persistor={persistor}
          >
            <main className="relative max-w-[1500px] mx-auto justify-center w-dvw px-4">
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
          </PersistGate>
        </Provider>
        <Footer />
      </QueryClientProvider>
    </main>
  );
}
