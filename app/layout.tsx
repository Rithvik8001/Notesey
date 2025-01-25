import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import Navbar from "@/components/common/navbar";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Notesey - Your AI Study Assistant",
  description: "Making last-minute studying feel like a superpower",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${plusJakarta.variable} ${playfair.variable} font-sans`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
