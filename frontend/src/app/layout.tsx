import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Operation Theta",
  description: "KTP Mission Control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}