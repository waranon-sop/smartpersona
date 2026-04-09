"use client";

import { useState, useRef, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const usernameRef = useRef();
  const router = useRouter();

  // ✅ FIX: ลบ `res` ที่ declare แต่ไม่ได้ใช้ออก

  const validateLogin = () => {
    const e = {};
    if (!username.trim()) e.username = "Please enter your username or email";
    if (!password.trim()) e.password = "Please enter your password";
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
        if (status === 404) setErrors({ username: "Username not found" });
        else if (status === 403) setErrors({ password: "Incorrect password" });
        else setErrors({ form: "Something went wrong." });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#f0f8ff] via-[#e8f4ff] to-white p-4">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Please sign in to your account</p>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username or Email</label>
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
              placeholder="Enter your username or email"
              className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[#0066cc]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1.5">{errors.username}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
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
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[#0066cc]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 pr-16`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0066cc] hover:text-[#0052a3] transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-br from-[#0066cc] to-[#0052a3] text-white font-bold py-3.5 px-4 rounded-lg shadow-[0_4px_15px_rgba(0,102,204,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,102,204,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {"Don't have an account? "}
          <Link href="/auth/register" className="text-[#0066cc] font-semibold hover:underline transition-all">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
