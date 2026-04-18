"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import styles from "@/app/styles/navbar.module.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userName, setUserName]           = useState("");
  const [scrolled, setScrolled]           = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify");
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUserName(data.name || "");
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    window.location.href = "/";
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>S</div>
          <span className={styles.logoText}>Smart Persona</span>
        </Link>
        <ul className={styles.navMenu}>
          <li><Link href="/" className={`${styles.navLink} ${styles.active}`}>หน้าหลัก</Link></li>
          <li><Link href="/browse-resumes" className={styles.navLink}>ค้นหา Resume</Link></li>
          <li><Link href="#features" className={styles.navLink}>ฟีเจอร์</Link></li>
          <li><Link href="#about" className={styles.navLink}>เกี่ยวกับ</Link></li>
        </ul>
      </div>

      <div className={styles.right}>
        {!isLoadingAuth && (
          <>
            {isLoggedIn && userName && (
              <span className={styles.userGreeting}>สวัสดี, {userName}</span>
            )}
            {isLoggedIn ? (
              <button className={styles.secondaryBtn} onClick={handleLogout}>ออกจากระบบ</button>
            ) : (
              <>
                <button className={styles.secondaryBtn} onClick={() => window.location.href = "/auth/login"}>
                  เข้าสู่ระบบ
                </button>
                <button className={styles.primaryBtn} onClick={() => window.location.href = "/auth/register"}>
                  ลงทะเบียน
                </button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
