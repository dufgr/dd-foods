import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./_context/cart";
import AuthProvider from "./_providers/auth";
import { Toaster } from "@/app/_components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "DD Foods | Peça de restaurantes da sua região",
  description:
    "Encontre restaurantes, descubra pratos e acompanhe seus pedidos com o DD Foods.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
};

// Mantem providers, idioma, metadata e largura comum em todas as rotas.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <AuthProvider>
          <CartProvider>
            <main className="mx-auto w-full min-w-0 max-w-[1280px]">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
