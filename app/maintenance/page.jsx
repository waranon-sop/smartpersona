"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Clock, ArrowRight } from "lucide-react";

export default function MaintenancePage() {
  const [siteName, setSiteName] = useState("SmartPersona");
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Fetch site name
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.site_name) setSiteName(data.site_name);
      })
      .catch(() => {});

    // Animated dots
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Auto-check if maintenance is lifted every 30 seconds
    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/settings/maintenance");
        const data = await res.json();
        if (!data.maintenance) {
          window.location.href = "/";
        }
      } catch {}
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #faf5ff 100%)",
        fontFamily: "var(--font-noto-thai), var(--font-inter), sans-serif",
        padding: "24px",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "fixed",
          top: "-200px",
          right: "-200px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-200px",
          left: "-200px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 32px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(99,102,241,0.25)",
          }}
        >
          <ShieldAlert size={36} color="white" />
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "48px 40px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "900",
              color: "#1e293b",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            ระบบกำลังปรับปรุง
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#64748b",
              margin: "0 0 32px",
              lineHeight: "1.7",
              fontWeight: "500",
            }}
          >
            {siteName} อยู่ในระหว่างการบำรุงรักษาระบบ
            <br />
            กรุณากลับมาใหม่ในอีกสักครู่
          </p>

          {/* Status indicator */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "linear-gradient(135deg, #fef3c7, #fef9c3)",
              border: "1px solid #fde68a",
              padding: "12px 24px",
              borderRadius: "14px",
              marginBottom: "28px",
            }}
          >
            <Clock size={18} color="#d97706" />
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#92400e",
              }}
            >
              กำลังดำเนินการ{dots}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "linear-gradient(to right, transparent, #e2e8f0, transparent)",
              margin: "0 0 24px",
            }}
          />

          {/* Admin access link */}
          <p
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              margin: 0,
              fontWeight: "500",
            }}
          >
            ผู้ดูแลระบบ?{" "}
            <a
              href="/auth/login"
              style={{
                color: "#6366f1",
                fontWeight: "700",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              เข้าสู่ระบบที่นี่
              <ArrowRight size={14} />
            </a>
          </p>
        </div>

        {/* Auto-refresh notice */}
        <p
          style={{
            fontSize: "11px",
            color: "#cbd5e1",
            marginTop: "20px",
            fontWeight: "600",
          }}
        >
          หน้านี้จะตรวจสอบสถานะอัตโนมัติทุก 30 วินาที
        </p>
      </div>
    </div>
  );
}
