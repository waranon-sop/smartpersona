"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [siteName, setSiteName] = useState("Smart Persona");
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.site_name) setSiteName(data.site_name);
      })
      .catch((err) => console.error("Failed to fetch site name:", err));

    fetch("/api/stats/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalUsers) setTotalUsers(data.totalUsers);
      })
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  const usernameRef = useRef();
  const router = useRouter();

  const validateLogin = () => {
    const e = {};
    if (!username.trim()) e.username = "กรุณากรอกชื่อผู้ใช้หรืออีเมล";
    if (!password.trim()) e.password = "กรุณากรอกรหัสผ่าน";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_val = validateLogin();
    if (Object.keys(e_val).length > 0) {
      setErrors(e_val);
      usernameRef.current?.focus();
      return;
    }
    setErrors({});
    setIsLoading(true);
    axios
      .post("/api/auth/login", { username, password })
      .then((res) => {
        const role = res.data?.role;
        if (role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/create/dashboard");
        }
      })
      .catch((err) => {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message;
        if (status === 404) setErrors({ username: "ไม่พบชื่อผู้ใช้หรืออีเมลนี้ในระบบ" });
        else if (status === 403) {
          const msg = serverMessage && serverMessage !== "Invalid password"
            ? serverMessage
            : "รหัสผ่านไม่ถูกต้อง";
          setErrors({ form: msg });
        }
        else setErrors({ form: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง" });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left Side: Brand/Visual (Desktop Only) ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gray-50 p-12 items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/40 via-indigo-100/40 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />

        <div className="relative z-10 max-w-lg text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white shadow-xl shadow-indigo-100 flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-500">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl">
              {siteName.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            สร้าง Resume ที่ดึงดูดใจ <br/>
            <span className="text-indigo-600">ด้วยเทมเพลตระดับ Elite</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            แพลตฟอร์มสร้างเรซูเม่ออนไลน์ที่ดีที่สุด ใช้งานฟรี 100% บันทึกข้อมูลอัตโนมัติ ส่งให้ HR ได้อย่างมั่นใจ
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-4 text-sm font-bold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> {totalUsers}+ ผู้ใช้งาน</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 7 เทมเพลตฟรี</span>
          </div>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative">
        
        {/* Mobile-only background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 lg:hidden -z-10" />

        <div className="w-full max-w-sm mx-auto">
          {/* Logo & Brand */}
          <Link href="/" className="inline-flex items-center gap-3 no-underline mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
              {siteName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">{siteName}</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">ยินดีต้อนรับกลับ 👋</h1>
            <p className="text-gray-500 text-sm font-medium">เข้าสู่ระบบเพื่อจัดการและสร้าง Resume ของคุณ</p>
          </div>

          {errors.form && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span className="font-medium">{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อผู้ใช้ หรือ อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  ref={usernameRef}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  disabled={isLoading}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50/50 ${errors.username ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm font-medium`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.username}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-700">รหัสผ่าน</label>
                <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">ลืมรหัสผ่าน?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-gray-50/50 ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm font-medium`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3.5 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 hover:shadow-indigo-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>กำลังเข้าสู่ระบบ...</>
              ) : (
                <>
                  เข้าสู่ระบบ <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            ยังไม่มีบัญชีผู้ใช้?{" "}
            <Link href="/auth/register" className="text-indigo-600 font-bold hover:text-indigo-800 transition-all">
              สมัครสมาชิกเลย
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
