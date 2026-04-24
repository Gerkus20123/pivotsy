import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "../hooks/auth"

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const font = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Pivotsy - dev",
  description: "The future of professional networking and job hunting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", font.variable, jetbrainsMono.variable, "font-sans", inter.variable)}
    >
      <body className={cn("min-h-full flex flex-col font-montserrat", font.className)}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
