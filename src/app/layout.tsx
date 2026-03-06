import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BodhiLeaves from "@/components/ui/BodhiLeaves";

export const metadata: Metadata = {
  title: "Sarasavi Viharaya — Buddhist Temple of University of Jaffna",
  description: "Sarasavi Viharaya, the Buddhist Temple at the University of Jaffna's Kilinochchi premises. A sacred place of spiritual peace, cultural harmony, and student dedication.",
  keywords: ["Sarasavi Viharaya", "Buddhist Temple", "University of Jaffna", "Kilinochchi", "Buddhist Society"],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Sarasavi Viharaya — Buddhist Temple of University of Jaffna",
    description: "A sacred place of spiritual peace and cultural harmony, built with the dedication of university students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bodhi-pattern" />
        <BodhiLeaves />
        <Header />
        <main style={{ position: 'relative', zIndex: 2, paddingTop: '80px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
