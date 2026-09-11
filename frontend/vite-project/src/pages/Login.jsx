import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login/`,
        data
      );

      if (res.status == 200) {
        const role = res.data.role;
        localStorage.setItem("tempPhone", res.data.phone_number);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);

        if (role == "Hod") {
          navigate("/HoD-Dashboard");
        } else if (role == "Manager") {
          navigate("/Manager-Dashboard");
        } else if (role == "Compensator") {
          navigate("/Compensator-Dashboard");
        } else {
          navigate("/Emp-Dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen max-w-7xl mx-auto px-6 lg:px-12 flex flex-col">
        {/* Header */}
        <header className="h-20 flex items-center justify-between border-b border-white/5">
          <a href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Receipt size={21} />
            </div>

            <div>
              <h1 className="font-semibold text-lg tracking-tight">
                Clovia ReimburseX
              </h1>
              <p className="text-[11px] text-neutral-500">
                Expense Management
              </p>
            </div>
          </a>

          <a
            href="/register"
            className="text-sm text-neutral-400 hover:text-white transition"
          >
            Create account
          </a>
        </header>

        {/* Main */}
        <main className="flex-1 grid lg:grid-cols-2 gap-16 items-center py-12 lg:py-16">
          {/* Left */}
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-neutral-400 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Smart Expense Management Platform
              </div>

              <h2 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08]">
                Expenses,
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
                  simplified.
                </span>
              </h2>

              <p className="mt-7 text-lg leading-8 text-neutral-400 max-w-lg">
                Manage employee expenses, streamline approvals and simplify
                reimbursements from one centralized platform.
              </p>

              <div className="mt-9 space-y-4">
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Centralized expense tracking
                </div>

                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Structured approval workflows
                </div>

                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Faster reimbursement management
                </div>
              </div>
            </div>
          </section>

          {/* Login Card */}
          <section className="w-full max-w-md mx-auto">
            <div className="border border-white/10 bg-[#111116]/90 backdrop-blur-xl rounded-2xl p-7 sm:p-9 shadow-2xl shadow-black/40">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                  <LockKeyhole className="text-violet-400" size={22} />
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h2>

                <p className="text-sm text-neutral-500 mt-2">
                  Sign in to continue to your workspace.
                </p>
              </div>

              <form className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm text-neutral-300 block mb-2"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                    />

                    <input
                      onChange={(e) => setemail(e.target.value)}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full h-12 pl-11 pr-4 bg-[#191920] border border-white/10 rounded-xl text-white text-sm outline-none placeholder:text-neutral-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm text-neutral-300 block mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
                    />

                    <input
                      onChange={(e) => setpassword(e.target.value)}
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="w-full h-12 pl-11 pr-4 bg-[#191920] border border-white/10 rounded-xl text-white text-sm outline-none placeholder:text-neutral-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition"
                    />
                  </div>
                </div>

                {/* Login */}
                <button
                  onClick={handleSubmit}
                  className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-600/20 cursor-pointer"
                >
                  Sign in
                  <ArrowRight size={17} />
                </button>
              </form>

              <div className="mt-7 pt-6 border-t border-white/10 text-center">
                <span className="text-sm text-neutral-500">
                  New to Clovia ReimburseX?{" "}
                </span>

                <a
                  href="/register"
                  className="text-sm font-medium text-violet-400 hover:text-fuchsia-400 transition"
                >
                  Create an account
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 mt-6 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Secure access
              </span>
              <span>•</span>
              <span>Expense management</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;