//metadata
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMS-SYS",
  description: "Your Own School Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
