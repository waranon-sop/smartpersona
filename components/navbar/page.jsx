"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import styles from "@/app/styles/navbar.module.css";
import UserMenu from "@/components/create/UserMenu";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userName, setUserName]           = useState("");
  const [scrolled, setScrolled]           = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false); // Close menu on route change
  }, [pathname]);

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
    router.push("/");
    router.refresh();
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>S</div>
          <span className={styles.logoText}>Smart Persona</span>
        </Link>
        <ul className={`${styles.navMenu} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
          <li><Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>หน้าหลัก</Link></li>
          <li><Link href="/browse-resumes" className={`${styles.navLink} ${pathname === "/browse-resumes" ? styles.active : ""}`}>ค้นหา Resume</Link></li>
          <li><Link href={pathname === "/" ? "#features" : "/#features"} className={styles.navLink}>ฟีเจอร์</Link></li>
          <li><Link href={pathname === "/" ? "#about" : "/#about"} className={styles.navLink}>เกี่ยวกับ</Link></li>
          
          {/* Mobile only logout/login buttons */}
          {isLoggedIn ? (
            <li className={styles.mobileOnly}><button onClick={handleLogout} className={styles.navLink}>ออกจากระบบ</button></li>
          ) : (
            <>
              <li className={styles.mobileOnly}><Link href="/auth/login" className={styles.navLink}>เข้าสู่ระบบ</Link></li>
              <li className={styles.mobileOnly}><Link href="/auth/register" className={styles.navLink}>ลงทะเบียน</Link></li>
            </>
          )}
        </ul>
      </div>

      <div className={styles.right}>
        {!isLoadingAuth && (
          <div className={styles.desktopOnly}>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className={styles.userGreeting}>สวัสดี, {userName}</span>
                <UserMenu userName={userName} onLogout={handleLogout} />
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <button className={styles.secondaryBtn} onClick={() => router.push("/auth/login")}>
                  เข้าสู่ระบบ
                </button>
                <button className={styles.primaryBtn} onClick={() => router.push("/auth/register")}>
                  ลงทะเบียน
                </button>
              </div>
            )}
          </div>
        )}
        
        <button 
          className={styles.mobileToggle} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
