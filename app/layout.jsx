import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // โหลด font เร็วขึ้น ไม่บล็อก render
});

export const metadata = {
  title: "SmartPersona - สร้าง Resume ออนไลน์",
  description: "สร้าง Resume และ Portfolio สวยงาม ง่ายดาย และโดนเด่น ด้วย SmartPersona",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1a1a',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              borderRadius: '12px',
              padding: '16px 24px',
              fontWeight: '500',
              fontFamily: 'var(--font-geist-sans)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }} 
        />
      </body>
    </html>
  );
}
