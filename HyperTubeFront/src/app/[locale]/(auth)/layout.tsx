import ClientAuthLayout from "./ClientAuthLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAuthLayout>{children}</ClientAuthLayout>;
}
