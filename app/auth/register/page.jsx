"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // แยก state ต่างหาก
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const validateRegister = () => {
    const e = {};
    if (!username.trim()) e.username = "Please enter a username";
    if (!email.trim()) {
      e.email = "Please enter an email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Please enter a valid email address";
    }
    if (!password.trim()) e.password = "Please enter a password";
    if (!confirmPassword.trim())
      e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
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
        toast.success("Registration successful!");
        router.push("/auth/login");
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 409) setErrors({ form: err.response?.data?.message || "Username or email already exists" });
        else setErrors({ form: "Registration failed. Please try again." });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#f0f8ff] via-[#e8f4ff] to-white p-4">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join us to build your best persona</p>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
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
              placeholder="Choose a username"
              className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[#0066cc]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1.5">{errors.username}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
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
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[#0066cc]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
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
                placeholder="Create a password"
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

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
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
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-[#0066cc]'} focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0066cc] hover:text-[#0052a3] transition-colors"
              >
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-br from-[#0066cc] to-[#0052a3] text-white font-bold py-3.5 px-4 rounded-lg shadow-[0_4px_15px_rgba(0,102,204,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,102,204,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
          >
            {isLoading ? "Please wait..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {"Already have an account? "}
          <Link href="/auth/login" className="text-[#0066cc] font-semibold hover:underline transition-all">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
