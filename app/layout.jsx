import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

import pool from "@/lib/db";

export async function generateMetadata() {
  let title = "SmartPersona - สร้าง Resume ออนไลน์";
  let description = "สร้าง Resume และ Portfolio สวยงาม ง่ายดาย และโดนเด่น ด้วย SmartPersona";

  try {
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('site_name', 'site_description')");
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
    
    if (settings.site_name) title = settings.site_name;
    if (settings.site_description) description = settings.site_description;
  } catch (e) {
    console.error("Failed to fetch metadata:", e);
  }

  return {
    title,
    description
  };
}

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
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
              fontFamily: 'var(--font-noto-thai), var(--font-inter), sans-serif',
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
