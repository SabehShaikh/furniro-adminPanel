import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
  display: "swap",
  variable: "--font-poppins", 
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard with Next.js 14 and Sanity.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}
