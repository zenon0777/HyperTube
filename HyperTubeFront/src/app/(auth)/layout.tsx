
import ClientLayout from "./ClientLayout";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout children={children} />
  );
}
