import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Camera,
  BriefcaseBusiness,
} from "lucide-react";

import "react-toastify/dist/ReactToastify.css";

const CompensatorProfile = () => {

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
          `${import.meta.env.VITE_BACKEND_URL}/api/manager/dashboard/`,
          { email }
        );

        setData(res.data);

        if (res.data.photo) {
          setPhotoUri(
            `${import.meta.env.VITE_BACKEND_URL}${res.data.photo}`
          );
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {

        toast.success("Profile photo updated.");

      } else {

        toast.error(
          res.data?.error || "Upload failed."
        );

      }

    } catch (err) {

      console.error("Upload failed", err);

      toast.error(
        err.response?.data?.error || "Upload failed."
      );

    }

  };


  return (

    <div className="w-full max-w-[1250px] mx-auto">

      {/* Header */}

      <div className="mb-7">

        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
          ACCOUNT SETTINGS
        </p>

        <h1 className="text-3xl font-bold text-white">
          Your Profile
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Manage your personal information and account security.
        </p>

      </div>


      {/* Profile Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-5">


        {/* Left Profile Card */}

        <div className="
          bg-[#111115]
          border border-white/[0.07]
          rounded-2xl
          p-6
          min-h-[600px]
          flex flex-col items-center
        ">

          <label className="relative cursor-pointer group">

            {photoUri || data?.photo ? (

              <img
                src={
                  photoUri ||
                  `${import.meta.env.VITE_BACKEND_URL}${data.photo}`
                }
                alt="Profile"
                className="
                  w-32 h-32
                  rounded-full
                  object-cover
                  border-2
                  border-white/[0.08]
                  group-hover:border-purple-500/50
                  transition-all
                "
              />

            ) : (

              <div className="
                w-32 h-32
                rounded-full
                bg-[#19191e]
                border border-white/[0.08]
                flex items-center justify-center
              ">

                <User
                  size={42}
                  className="text-gray-600"
                />

              </div>

            )}


            {/* Camera */}

            <div className="
              absolute
              bottom-1
              right-1
              w-9 h-9
              rounded-full
              bg-white
              flex items-center justify-center
              shadow-lg
            ">

              <Camera
                size={17}
                className="text-black"
              />

            </div>


            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>


          <h2 className="mt-5 text-xl font-bold text-white">
            {data ? data.username : "Loading..."}
          </h2>


          <p className="text-xs text-gray-500 mt-1">
            Employee ID: {data ? data.id : "..."}
          </p>


          <div className="mt-6 w-full space-y-3">

            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">

              <Shield
                size={15}
                className="text-purple-400"
              />

              {data ? data.role : "Loading..."}

            </div>


            <div className="text-center text-sm text-gray-500">
              {data ? data.department : "Loading..."}
            </div>


            <div className="flex justify-center">

              <span className="
                px-3 py-1
                rounded-full
                bg-[#1b1b20]
                border border-white/[0.08]
                text-[11px]
                text-gray-400
              ">
                {data ? `${data.grade} Grade` : "Loading..."}
              </span>

            </div>

          </div>

        </div>


        {/* Right Card */}

        <div className="
          bg-[#111115]
          border border-white/[0.07]
          rounded-2xl
          overflow-hidden
        ">


          {/* Personal Information Header */}

          <div className="px-6 py-5 border-b border-white/[0.07]">

            <div className="flex items-center gap-3">

              <div className="
                w-9 h-9
                rounded-xl
                bg-purple-600/15
                flex items-center justify-center
              ">

                <User
                  size={17}
                  className="text-purple-400"
                />

              </div>


              <div>

                <h2 className="text-base font-semibold text-white">
                  Personal Information
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Your registered account details
                </p>

              </div>

            </div>

          </div>


          {/* Personal Details */}

          <div className="p-6 space-y-5">


            {/* Name */}

            <div>

              <label className="
                flex items-center gap-2
                text-[10px]
                uppercase
                tracking-wider
                text-gray-500
                font-semibold
                mb-2
              ">

                <User size={13} />
                Name

              </label>

              <div className="
                w-full
                px-4 py-3
                rounded-lg
                bg-[#19191e]
                border border-white/[0.07]
                text-sm
                text-gray-200
              ">

                {data ? data.username : "Loading..."}

              </div>

            </div>


            {/* Email */}

            <div>

              <label className="
                flex items-center gap-2
                text-[10px]
                uppercase
                tracking-wider
                text-gray-500
                font-semibold
                mb-2
              ">

                <Mail size={13} />
                Email Address

              </label>

              <div className="
                w-full
                px-4 py-3
                rounded-lg
                bg-[#19191e]
                border border-white/[0.07]
                text-sm
                text-gray-200
              ">

                {data ? data.email : "Loading..."}

              </div>

            </div>


            {/* Phone */}

            <div>

              <label className="
                flex items-center gap-2
                text-[10px]
                uppercase
                tracking-wider
                text-gray-500
                font-semibold
                mb-2
              ">

                <Phone size={13} />
                Phone Number

              </label>

              <div className="
                w-full
                px-4 py-3
                rounded-lg
                bg-[#19191e]
                border border-white/[0.07]
                text-sm
                text-gray-200
              ">

                {data ? data.phone_number : "Loading..."}

              </div>

            </div>


            {/* Divider */}

            <div className="border-t border-white/[0.07] pt-6">


              <div className="flex items-center gap-3 mb-5">

                <div className="
                  w-9 h-9
                  rounded-xl
                  bg-[#19191e]
                  flex items-center justify-center
                ">

                  <Lock
                    size={17}
                    className="text-gray-400"
                  />

                </div>


                <div>

                  <h2 className="text-base font-semibold text-white">
                    Reset Password
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your account password
                  </p>

                </div>

              </div>


              <form
                className="space-y-5"
                onSubmit={handlePasswordReset}
              >


                {/* New Password */}

                <div>

                  <label
                    htmlFor="inp1"
                    className="
                      block
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-gray-500
                      font-semibold
                      mb-2
                    "
                  >
                    New Password
                  </label>

                  <input
                    value={newpassword}
                    onChange={(e) =>
                      setnewpassword(e.target.value)
                    }
                    type="password"
                    id="inp1"
                    className="
                      w-full
                      px-4 py-3
                      rounded-lg
                      bg-[#19191e]
                      border border-white/[0.08]
                      text-sm text-white
                      placeholder:text-gray-600
                      focus:outline-none
                      focus:border-purple-500/50
                      focus:ring-1
                      focus:ring-purple-500/20
                      transition-all
                    "
                  />

                </div>


                {/* Confirm Password */}

                <div>

                  <label
                    htmlFor="inp2"
                    className="
                      block
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-gray-500
                      font-semibold
                      mb-2
                    "
                  >
                    Confirm Password
                  </label>

                  <input
                    value={confirmpassword}
                    onChange={(e) =>
                      setconfirmpassword(e.target.value)
                    }
                    type="password"
                    id="inp2"
                    className="
                      w-full
                      px-4 py-3
                      rounded-lg
                      bg-[#19191e]
                      border border-white/[0.08]
                      text-sm text-white
                      placeholder:text-gray-600
                      focus:outline-none
                      focus:border-purple-500/50
                      focus:ring-1
                      focus:ring-purple-500/20
                      transition-all
                    "
                  />

                </div>


                <button
                  type="submit"
                  className="
                    px-5 py-2.5
                    rounded-lg
                    bg-purple-600
                    hover:bg-purple-500
                    text-white
                    text-xs
                    font-semibold
                    transition-all
                    shadow-lg
                    shadow-purple-600/20
                  "
                >
                  Reset Password
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>

  )
}

export default CompensatorProfile