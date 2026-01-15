import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Momentum Matrix | Habit & Project Dashboard",
  description:
    "Interactive habit and project tracker with spreadsheet-style inputs, instant analytics, and beautiful charts across daily, weekly, monthly, and yearly horizons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-950`}>
        {children}
      </body>
    </html>
  );
}
