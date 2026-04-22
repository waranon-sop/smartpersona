"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const router = useRouter();

  const validateRegister = () => {
    const e = {};
    if (!username.trim()) e.username = "กรุณากรอกชื่อผู้ใช้";
    if (!email.trim()) {
      e.email = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!password.trim()) e.password = "กรุณากรอกรหัสผ่าน";
    else if (password.length < 6) e.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    
    if (!confirmPassword.trim())
      e.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    else if (password !== confirmPassword)
      e.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_val = validateRegister();
    if (Object.keys(e_val).length > 0) {
      setErrors(e_val);
      return;
    }
    setErrors({});
    setIsLoading(true);

    axios
      .post("/api/users/register", { username, email, password })
      .then(() => {
        toast.success("สมัครสมาชิกสำเร็จ!");
        router.push("/auth/login");
      })
      .catch((err) => {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        if (status === 503) setErrors({ form: msg || "ระบบอยู่ในโหมดปรับปรุง ไม่สามารถสมัครสมาชิกได้ในขณะนี้" });
        else if (status === 409) setErrors({ form: msg || "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว" });
        else if (status === 400) setErrors({ form: msg || "กรุณาตรวจสอบข้อมูลอีกครั้ง" });
        else if (status === 403) setErrors({ form: msg || "การสมัครสมาชิกถูกระงับชั่วคราว" });
        else setErrors({ form: "การสมัครสมาชิกล้มเหลว กรุณาลองใหม่อีกครั้ง" });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left Side: Brand/Visual (Desktop Only) ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-50 p-12 items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-200/40 via-purple-200/40 to-transparent rounded-full blur-3xl -translate-y-1/4 -translate-x-1/4" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/40 to-transparent rounded-full blur-3xl translate-y-1/4 translate-x-1/4" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />

        <div className="relative z-10 max-w-lg text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white shadow-xl shadow-indigo-200 flex items-center justify-center -rotate-3 hover:-rotate-6 transition-transform duration-500">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-bl from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl">
              {siteName.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            เริ่มต้นสร้าง <br/>
            <span className="text-indigo-600">โปรไฟล์มืออาชีพของคุณ</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            เข้าร่วมกับผู้ใช้งานกว่า {totalUsers}+ คน ที่ใช้ {siteName} ในการสร้างเรซูเม่ที่โดดเด่นและได้งานในฝัน
          </p>
          
          <div className="mt-12 flex flex-col gap-4 text-sm font-bold text-gray-600 text-left max-w-xs mx-auto">
            <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm backdrop-blur-sm">
              <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">✓</span>
              <span>ใช้งานฟรีทุกฟีเจอร์</span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm backdrop-blur-sm">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">✓</span>
              <span>เทมเพลตระดับมืออาชีพ</span>
            </div>
            <div className="flex items-center gap-3 bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm backdrop-blur-sm">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">✓</span>
              <span>ส่งออก PDF ได้ทันที</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative overflow-y-auto py-12">
        
        {/* Mobile-only background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 lg:hidden -z-10" />

        <div className="w-full max-w-sm mx-auto">
          {/* Logo & Brand (Mobile only) */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-3 no-underline mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
              {siteName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">{siteName}</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">สมัครสมาชิก 🚀</h1>
            <p className="text-gray-500 text-sm font-medium">สร้างบัญชีเพื่อเริ่มต้นสร้าง Resume ของคุณ</p>
          </div>

          {errors.form && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span className="font-medium">{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ชื่อผู้ใช้</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  disabled={isLoading}
                  placeholder="ตั้งชื่อผู้ใช้ของคุณ"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50/50 ${errors.username ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm font-medium`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  disabled={isLoading}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50/50 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm font-medium`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  disabled={isLoading}
                  placeholder="สร้างรหัสผ่าน"
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  disabled={isLoading}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-gray-50/50 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full px-3.5 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] font-bold mt-1.5">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 hover:shadow-indigo-600/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>กำลังสมัครสมาชิก...</>
              ) : (
                <>
                  สมัครสมาชิก <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            มีบัญชีผู้ใช้อยู่แล้ว?{" "}
            <Link href="/auth/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-all">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
