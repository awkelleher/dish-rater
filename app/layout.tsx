import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DishRate - Rate dishes, not restaurants",
  description: "Discover the best dishes at every restaurant in NYC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
