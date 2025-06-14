"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "@/app/store";
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
          <main className="relative max-w-[1500px] mx-auto justify-center w-dvw px-4">
            {children}
          </main>
        </Provider>
      </QueryClientProvider>
    </main>
  );
}
