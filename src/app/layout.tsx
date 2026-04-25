import type { Metadata } from "next";
import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "Scholar Flux | Join the Sanctuary",
  description: "A calm space for focused study.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="light"
    >
    <head>
       <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
    </head>
      <body   className={`bg-[#f8f9ff] text-[#0b1c30] w-full h-screen overflow-x-hidden ${inter.variable} ${plusJakarta.variable} font-body`}>
        <ToastProvider>
           {children}
        </ToastProvider>
        </body>
    </html>
  );
}
