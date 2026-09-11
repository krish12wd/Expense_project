import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CheckCircle2,
  MailCheck,
  Receipt,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtp = () => {
  const [otp, setotp] = useState(["", "", "", "", "", ""]);

  const handleChange = (idx, val) => {
    const newotp = [...otp];
    newotp[idx] = val;
    setotp(newotp);
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const otpval = otp.join("");
    console.log("OTP to send:", otpval);
    const email = localStorage.getItem("email");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp/`,
        {
          otp: otpval,
          email: email,
        }
      );

      if (res.status === 200) {
        toast.success("OTP Verified Successfully!");
        navigate("/login");
      } else {
        toast.error("Verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen max-w-7xl mx-auto px-6 lg:px-12 flex flex-col">
        {/* Header */}
        <header className="h-20 flex items-center border-b border-white/5">
          <a href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Receipt size={21} />
            </div>

            <div>
              <h1 className="font-semibold text-lg">
                Clovia ReimburseX
              </h1>
              <p className="text-[11px] text-neutral-500">
                Expense Management
              </p>
            </div>
          </a>
        </header>

        {/* OTP */}
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="border border-white/10 bg-[#111116]/90 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <MailCheck
                    size={25}
                    className="text-violet-400"
                  />
                </div>

                <h2 className="text-3xl font-bold tracking-tight">
                  Verify your email
                </h2>

                <p className="text-sm text-neutral-500 mt-3 leading-6">
                  Enter the 6-digit verification code sent to
                  your email address.
                </p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-3 my-9">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    onChange={(e) =>
                      handleChange(idx, e.target.value)
                    }
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold bg-[#191920] border border-white/10 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition"
                    type="text"
                    value={digit}
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-600/20 cursor-pointer"
              >
                <CheckCircle2 size={18} />
                Verify email
              </button>

              <button
                onClick={() => navigate("/register")}
                className="w-full mt-4 h-11 rounded-xl text-sm text-neutral-500 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back to registration
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyOtp;