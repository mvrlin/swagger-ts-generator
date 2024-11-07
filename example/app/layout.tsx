import { TRPCProvider } from "@/app/_trpc";

export const metadata = {
  title: "Lajit",
  description: "Lajit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
