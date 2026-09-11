import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Camera,
  CheckCircle2,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const HodProfile = () => {
  const [newpassword, setnewpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [data, setData] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/Hod/dashboard/`,
          { email }
        );

        setData(res.data);

        if (res.data.photo) {
          setPhotoUri(`${import.meta.env.VITE_BACKEND_URL}${res.data.photo}`);
        }
      } catch (error) {
        console.error("Error in Fetching Data", error);
        toast.error("Failed to fetch profile data");
      }
    };

    fetchData();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newpassword !== confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const email = localStorage.getItem("email");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reset-password/`,
        {
          email,
          password: newpassword,
        }
      );

      if (res.status === 200) {
        toast.success("Password reset successful!");
        setnewpassword("");
        setconfirmpassword("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Password reset failed", error);
      toast.error("Something went wrong!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPhotoUri(URL.createObjectURL(file));
    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    try {
      const email = localStorage.getItem("email");

      if (!email) {
        toast.error("Email not found.");
        return;
      }

      let formData = new FormData();
      formData.append("photo", file);
      formData.append("email", email);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload-profile-photo/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success("Profile photo updated.");
      } else {
        toast.error(res.data?.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error(err.response?.data?.error || "Upload failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-400 mb-1">
              Account
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Profile
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your account information and security.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={15} className="text-emerald-400" />
            Secure account
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">

        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-[#101014] p-6 shadow-2xl">

          <div className="flex flex-col items-center text-center">

            {/* Profile Image */}
            <label className="relative cursor-pointer group mb-5">

              {data?.photo ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${data.photo}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#202027] group-hover:border-purple-500 transition"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#19191f] border-4 border-[#27272f] flex items-center justify-center">
                  <UserRound size={48} className="text-gray-500" />
                </div>
              )}

              {/* Camera button */}
              <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 flex items-center justify-center border-4 border-[#101014] shadow-lg">
                <Camera size={17} />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <h2 className="text-xl font-semibold">
              {data ? data.username : "Name Loading.."}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {data ? data.email : "Email Loading.."}
            </p>
          </div>

          {/* User details */}
          <div className="mt-7 space-y-2">

            <div className="flex items-center gap-3 rounded-xl bg-[#17171d] border border-white/5 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <UserRound size={16} className="text-purple-400" />
              </div>

              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                  Employee ID
                </p>
                <p className="text-sm text-gray-200">
                  {data ? data.id : "Loading.."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#17171d] border border-white/5 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <ShieldCheck size={16} className="text-purple-400" />
              </div>

              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                  Role
                </p>
                <p className="text-sm text-gray-200">
                  {data ? data.role : "Loading.."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#17171d] border border-white/5 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BriefcaseBusiness size={16} className="text-purple-400" />
              </div>

              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                  Department
                </p>
                <p className="text-sm text-gray-200">
                  {data ? data.department : "Loading.."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#17171d] border border-white/5 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>

              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                  Grade
                </p>
                <p className="text-sm text-gray-200">
                  {data ? `${data.grade} Grade` : "Loading..."}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-5">

          {/* Account Information */}
          <div className="rounded-2xl border border-white/10 bg-[#101014] p-6 sm:p-7 shadow-2xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <UserRound size={19} className="text-purple-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Account information
                </h2>
                <p className="text-xs text-gray-500">
                  Your registered account details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <div className="rounded-xl border border-white/10 bg-[#17171d] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserRound size={15} className="text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Name
                  </span>
                </div>

                <p className="text-sm text-gray-200">
                  {data ? data.username : "Name Loading.."}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-white/10 bg-[#17171d] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={15} className="text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Email address
                  </span>
                </div>

                <p className="text-sm text-gray-200 break-all">
                  {data ? data.email : "Email Loading.."}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-white/10 bg-[#17171d] p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={15} className="text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Phone number
                  </span>
                </div>

                <p className="text-sm text-gray-200">
                  {data ? data.phone_number : "Phone number Loading.."}
                </p>
              </div>

            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-white/10 bg-[#101014] p-6 sm:p-7 shadow-2xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <KeyRound size={19} className="text-purple-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Reset password
                </h2>
                <p className="text-xs text-gray-500">
                  Update your account password
                </p>
              </div>
            </div>

            <form className="space-y-4">

              {/* New password */}
              <div>
                <label
                  htmlFor="inp1"
                  className="block text-xs font-medium text-gray-400 mb-2"
                >
                  New password
                </label>

                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    value={newpassword}
                    onChange={(e) => setnewpassword(e.target.value)}
                    type="password"
                    id="inp1"
                    placeholder="Enter your new password"
                    className="w-full rounded-xl border border-white/10 bg-[#17171d] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="inp2"
                  className="block text-xs font-medium text-gray-400 mb-2"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    value={confirmpassword}
                    onChange={(e) => setconfirmpassword(e.target.value)}
                    type="password"
                    id="inp2"
                    placeholder="Confirm your new password"
                    className="w-full rounded-xl border border-white/10 bg-[#17171d] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  Keep your password secure
                </div>

                <button
                  onClick={handlePasswordReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 hover:opacity-90 transition cursor-pointer"
                >
                  Update password
                  <KeyRound size={16} />
                </button>

              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HodProfile;