"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "@/app/store";
import MovieTitlesBackground from "./components/Background";

export default function ClientAuthLayout({
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
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
			<MovieTitlesBackground />
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute w-96 h-96 -top-48 -left-48 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute w-96 h-96 -bottom-48 -right-48 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
			</div>
            {children}
          </main>
        </Provider>
      </QueryClientProvider>
    </main>
  );
}
