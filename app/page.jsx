"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar/page";
import styles from "./styles/home.module.css";

// ---------- animated counter ----------
function Counter({ to, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(to / 60);
      const t = setInterval(() => {
        start += step;
        if (start >= to) { setCount(to); clearInterval(t); }
        else setCount(start);
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const handleCTA = async () => {
    try {
      const res = await fetch("/api/auth/verify");
      if (res.ok) {
        const d = await res.json();
        window.location.href = d.role === "Admin" ? "/admin" : "/create/dashboard";
      } else {
        window.location.href = "/auth/login";
      }
    } catch {
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        {/* Blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>✨</span>
            <span>สร้าง Resume ฟรี — ไม่มีค่าใช้จ่าย</span>
          </div>

          <h1 className={styles.heroTitle}>
            ตัวคุณในเวอร์ชัน<br />
            <span className={styles.gradientText}>ที่ดีที่สุด</span>
          </h1>

          <p className={styles.heroSub}>
            สร้าง Resume สวยงามในไม่กี่นาที เลือกเทมเพลตที่ใช่ กรอกข้อมูล แล้วดาวน์โหลดเป็น PDF ได้เลย
          </p>

          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={handleCTA}>
              <span>เริ่มสร้างเลย</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="#features" className={styles.btnGhost}>ดูฟีเจอร์ทั้งหมด</a>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong><Counter to={500} suffix="+" /></strong>
              <span>ผู้ใช้งาน</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong><Counter to={7} /></strong>
              <span>เทมเพลต</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <strong>100%</strong>
              <span>ฟรี</span>
            </div>
          </div>
        </div>

        {/* Resume mockup */}
        <div className={styles.heroVisual}>
          <div className={styles.mockupCard}>
            <div className={styles.mockupHeader}>
              <div className={styles.mockupAvatar} />
              <div style={{flex:1}}>
                <div className={`${styles.mockupLine} ${styles.w60}`} style={{height:14,marginBottom:6}} />
                <div className={`${styles.mockupLine} ${styles.w40}`} style={{height:10}} />
              </div>
            </div>
            <div className={styles.mockupSection}>
              <div className={`${styles.mockupLabel}`}>EXPERIENCE</div>
              <div className={`${styles.mockupLine} ${styles.w80}`} />
              <div className={`${styles.mockupLine} ${styles.w60}`} />
              <div className={`${styles.mockupLine} ${styles.w70}`} />
            </div>
            <div className={styles.mockupSection}>
              <div className={styles.mockupLabel}>EDUCATION</div>
              <div className={`${styles.mockupLine} ${styles.w70}`} />
              <div className={`${styles.mockupLine} ${styles.w50}`} />
            </div>
            <div className={styles.mockupSection}>
              <div className={styles.mockupLabel}>SKILLS</div>
              <div className={styles.mockupTags}>
                {["React","Next.js","Design","UI/UX"].map(t => (
                  <span key={t} className={styles.mockupTag}>{t}</span>
                ))}
              </div>
            </div>
            <div className={styles.mockupBadge}>✓ Ready to Download</div>
          </div>
          {/* floating chips */}
          <div className={`${styles.chip} ${styles.chip1}`}>📄 PDF Export</div>
          <div className={`${styles.chip} ${styles.chip2}`}>🎨 7 Templates</div>
          <div className={`${styles.chip} ${styles.chip3}`}>⚡ Save Auto</div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className={styles.steps} id="features">
        <div className={styles.sectionHead}>
          <div className={styles.pill}>วิธีการใช้งาน</div>
          <h2 className={styles.sectionTitle}>3 ขั้นตอน สร้าง Resume ใน 5 นาที</h2>
        </div>

        <div className={styles.stepsGrid}>
          {[
            { n:"01", icon:"🎨", title: "เลือกเทมเพลต", desc: "เลือกดีไซน์ที่เหมาะกับคุณ ทั้งแบบ Classic และ Modern" },
            { n:"02", icon:"✏️", title: "กรอกข้อมูล", desc: "บันทึกประวัติการทำงาน การศึกษา และทักษะของคุณ" },
            { n:"03", icon:"📥", title: "ดาวน์โหลด PDF", desc: "Export เป็น PDF คุณภาพสูงพร้อมส่งให้ HR ได้เลย" },
          ].map((s) => (
            <div key={s.n} className={styles.stepCard}>
              <div className={styles.stepNum}>{s.n}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className={styles.features} id="about">
        <div className={styles.sectionHead}>
          <div className={styles.pill}>ฟีเจอร์</div>
          <h2 className={styles.sectionTitle}>ทุกอย่างที่คุณต้องการ</h2>
        </div>

        <div className={styles.featureGrid}>
          {[
            { icon:"💼", title: "ประสบการณ์หลายอัน", desc: "เพิ่มได้ไม่จำกัด พร้อมช่วงเวลาและรายละเอียด", color:"#dbeafe" },
            { icon:"🎓", title: "การศึกษาหลายอัน", desc: "บันทึกได้หลายสถาบัน พร้อม GPA", color:"#dcfce7" },
            { icon:"🖼️", title: "รูปโปรไฟล์", desc: "อัปโหลดรูปภาพประจำตัวพร้อมแสดงใน Resume", color:"#fef3c7" },
            { icon:"💾", title: "บันทึกอัตโนมัติ", desc: "ข้อมูลถูกบันทึกลงระบบ เปิดเครื่องไหนก็ได้พร้อมกัน", color:"#ede9fe" },
            { icon:"📱", title: "Responsive Design", desc: "ใช้งานได้ทั้ง PC และมือถือ", color:"#fce7f3" },
            { icon:"🔒", title: "ข้อมูลปลอดภัย", desc: "ระบบ JWT Authentication ป้องกันข้อมูลส่วนตัว", color:"#ecfdf5" },
          ].map((f) => (
            <div key={f.title} className={styles.featCard}>
              <div className={styles.featIconWrap} style={{background: f.color}}>
                <span className={styles.featIconEmoji}>{f.icon}</span>
              </div>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={styles.cta}>
        <div className={styles.ctaBlob} />
        <h2 className={styles.ctaTitle}>พร้อมสร้าง Resume ที่โดดเด่นแล้วใช่ไหม?</h2>
        <p className={styles.ctaSub}>เริ่มต้นได้เลยฟรี ไม่ต้องใช้บัตรเครดิต</p>
        <button className={styles.ctaBtn} onClick={handleCTA}>
          สร้าง Resume ของฉัน →
        </button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <div className={styles.footerLogoIcon}>S</div>
          <span>Smart Persona</span>
        </div>
        <p className={styles.footerText}>© {new Date().getFullYear()} Smart Persona · Resume Builder ฟรีสำหรับทุกคน</p>
      </footer>
    </div>
  );
}
