import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"

import {
    UserRound,
    Shield,
    BriefcaseBusiness,
    BadgeCheck,
    KeyRound,
    Phone,
    Mail,
    Camera,
    ShieldCheck
} from "lucide-react"

import "react-toastify/dist/ReactToastify.css"


const ManagerProfile = () => {

    const [newpassword, setnewpassword] = useState("")
    const [confirmpassword, setconfirmpassword] = useState("")
    const [data, setData] = useState(null)
    const [photoUri, setPhotoUri] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)


    useEffect(() => {

        const fetchData = async () => {

            try {

                const email = localStorage.getItem("email")

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/manager/dashboard/`,
                    { email }
                )

                setData(res.data)

                if (res.data.photo) {

                    setPhotoUri(
                        `${import.meta.env.VITE_BACKEND_URL}${res.data.photo}`
                    )

                }

            } catch (error) {

                console.error("Error in Fetching Data", error)

                toast.error("Failed to fetch profile data")

            }

        }

        fetchData()

    }, [])


    const handlePasswordReset = async (e) => {

        e.preventDefault()

        if (newpassword !== confirmpassword) {

            toast.error("Passwords do not match!")

            return
        }

        try {

            const email = localStorage.getItem("email")

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/reset-password/`,
                {
                    email,
                    password: newpassword
                }
            )

            if (res.status === 200) {

                toast.success("Password reset successful!")

                setnewpassword("")
                setconfirmpassword("")

            } else {

                toast.error("Something went wrong")

            }

        } catch (error) {

            console.error("Password reset failed", error)

            toast.error("Something went wrong!")

        }

    }


    const handleFileChange = (e) => {

        const file = e.target.files[0]

        if (!file) return

        setSelectedImage(file)

        setPhotoUri(URL.createObjectURL(file))

        uploadPhoto(file)

    }


    const uploadPhoto = async (file) => {

        try {

            const email = localStorage.getItem("email")

            if (!email) {

                toast.error("Email not found.")

                return

            }

            let formData = new FormData()

            formData.append("photo", file)
            formData.append("email", email)

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload-profile-photo/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (res.status === 200) {

                toast.success("Profile photo updated.")

            } else {

                toast.error(
                    res.data?.error || "Upload failed."
                )

            }

        } catch (err) {

            console.error("Upload failed", err)

            toast.error(
                err.response?.data?.error || "Upload failed."
            )

        }

    }


    return (

        <div className="min-h-screen bg-[#08080b] px-8 py-7">

            <div className="max-w-[1050px] mx-auto">

                {/* HEADER */}

                <div className="flex items-start justify-between mb-8">

                    <div>

                        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
                            Account
                        </p>

                        <h1 className="text-3xl font-bold text-white">
                            Profile
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Manage your account information and security.
                        </p>

                    </div>


                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">

                        <ShieldCheck className="w-4 h-4 text-emerald-400" />

                        Secure account

                    </div>

                </div>


                {/* CONTENT */}

                <div className="grid grid-cols-[240px_1fr] gap-4">

                    {/* LEFT PROFILE */}

                    <div className="bg-[#111115] border border-white/[0.07] rounded-2xl p-5">

                        <div className="flex flex-col items-center">

                            <label className="cursor-pointer relative group">

                                {photoUri || data?.photo ? (

                                    <img
                                        src={
                                            photoUri ||
                                            `${import.meta.env.VITE_BACKEND_URL}${data.photo}`
                                        }
                                        alt="Profile"
                                        className="w-28 h-28 rounded-full object-cover border border-white/10"
                                    />

                                ) : (

                                    <div className="w-28 h-28 rounded-full bg-[#19191f] border border-white/[0.08] flex items-center justify-center">

                                        <UserRound className="w-9 h-9 text-gray-600" />

                                    </div>

                                )}


                                <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center border-4 border-[#111115]">

                                    <Camera className="w-3.5 h-3.5 text-white" />

                                </div>


                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                            </label>


                            <h2 className="text-base font-semibold text-white mt-4">

                                {data ? data.username : "Name Loading.."}

                            </h2>


                            <p className="text-xs text-gray-600 mt-1">

                                {data ? data.email : "Email Loading.."}

                            </p>

                        </div>


                        {/* MANAGER DETAILS */}

                        <div className="mt-6 space-y-2">

                            <div className="bg-[#18181d] border border-white/[0.05] rounded-xl p-3 flex items-center gap-3">

                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">

                                    <UserRound className="w-3.5 h-3.5 text-purple-400" />

                                </div>


                                <div>

                                    <p className="text-[8px] uppercase tracking-wider text-gray-600">
                                        Manager ID
                                    </p>

                                    <p className="text-xs text-gray-300 mt-0.5">
                                        {data ? data.id : "..."}
                                    </p>

                                </div>

                            </div>


                            <div className="bg-[#18181d] border border-white/[0.05] rounded-xl p-3 flex items-center gap-3">

                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">

                                    <Shield className="w-3.5 h-3.5 text-purple-400" />

                                </div>


                                <div>

                                    <p className="text-[8px] uppercase tracking-wider text-gray-600">
                                        Role
                                    </p>

                                    <p className="text-xs text-gray-300 mt-0.5">
                                        {data ? data.role : "..."}
                                    </p>

                                </div>

                            </div>


                            <div className="bg-[#18181d] border border-white/[0.05] rounded-xl p-3 flex items-center gap-3">

                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">

                                    <BriefcaseBusiness className="w-3.5 h-3.5 text-purple-400" />

                                </div>


                                <div>

                                    <p className="text-[8px] uppercase tracking-wider text-gray-600">
                                        Department
                                    </p>

                                    <p className="text-xs text-gray-300 mt-0.5">
                                        {data ? data.department : "..."}
                                    </p>

                                </div>

                            </div>


                            <div className="bg-[#18181d] border border-white/[0.05] rounded-xl p-3 flex items-center gap-3">

                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">

                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />

                                </div>


                                <div>

                                    <p className="text-[8px] uppercase tracking-wider text-gray-600">
                                        Grade
                                    </p>

                                    <p className="text-xs text-gray-300 mt-0.5">
                                        {data ? `${data.grade} Grade` : "..."}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="space-y-4">

                        {/* ACCOUNT INFORMATION */}

                        <div className="bg-[#111115] border border-white/[0.07] rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-5">

                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">

                                    <UserRound className="w-4 h-4 text-purple-400" />

                                </div>


                                <div>

                                    <h2 className="text-base font-semibold text-white">
                                        Account information
                                    </h2>

                                    <p className="text-[10px] text-gray-600 mt-1">
                                        Your registered account details
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-2 gap-3">

                                {/* NAME */}

                                <div className="bg-[#18181d] border border-white/[0.05] rounded-xl p-3">

                                    <div className="flex items-center gap-2 mb-2">

                                        <UserRound className="w-3.5 h-3.5 text-gray-600" />

                                        <span className="text-[10px] text-gray-600">
                                            Name
                                        </span>

                                    </div>

                                    <p className="text-xs text-gray-300">
                                        {data ? data.username : "Loading..."}
                                    </p>

                                </div>


                                {/* EMAIL */}

                                <div className="bg-[#18181d] border border-white/[0.05] rounded-xl p-3">

                                    <div className="flex items-center gap-2 mb-2">

                                        <Mail className="w-3.5 h-3.5 text-gray-600" />

                                        <span className="text-[10px] text-gray-600">
                                            Email address
                                        </span>

                                    </div>

                                    <p className="text-xs text-gray-300">
                                        {data ? data.email : "Loading..."}
                                    </p>

                                </div>


                                {/* PHONE */}

                                <div className="col-span-2 bg-[#18181d] border border-white/[0.05] rounded-xl p-3">

                                    <div className="flex items-center gap-2 mb-2">

                                        <Phone className="w-3.5 h-3.5 text-gray-600" />

                                        <span className="text-[10px] text-gray-600">
                                            Phone number
                                        </span>

                                    </div>

                                    <p className="text-xs text-gray-300">
                                        {data ? data.phone_number : "Loading..."}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* RESET PASSWORD */}

                        <div className="bg-[#111115] border border-white/[0.07] rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-5">

                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">

                                    <KeyRound className="w-4 h-4 text-purple-400" />

                                </div>


                                <div>

                                    <h2 className="text-base font-semibold text-white">
                                        Reset password
                                    </h2>

                                    <p className="text-[10px] text-gray-600 mt-1">
                                        Update your account password
                                    </p>

                                </div>

                            </div>


                            <form
                                onSubmit={handlePasswordReset}
                                className="space-y-4"
                            >

                                {/* NEW PASSWORD */}

                                <div>

                                    <label className="block text-[10px] text-gray-500 mb-2">
                                        New password
                                    </label>


                                    <div className="relative">

                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />

                                        <input
                                            value={newpassword}
                                            onChange={(e) => setnewpassword(e.target.value)}
                                            type="password"
                                            placeholder="Enter your new password"
                                            className="w-full bg-[#18181d] border border-white/[0.06] text-gray-300 placeholder-gray-700 rounded-xl py-3 pl-9 pr-4 text-xs outline-none focus:border-purple-500/40"
                                        />

                                    </div>

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div>

                                    <label className="block text-[10px] text-gray-500 mb-2">
                                        Confirm password
                                    </label>


                                    <div className="relative">

                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />

                                        <input
                                            value={confirmpassword}
                                            onChange={(e) => setconfirmpassword(e.target.value)}
                                            type="password"
                                            placeholder="Confirm your new password"
                                            className="w-full bg-[#18181d] border border-white/[0.06] text-gray-300 placeholder-gray-700 rounded-xl py-3 pl-9 pr-4 text-xs outline-none focus:border-purple-500/40"
                                        />

                                    </div>

                                </div>


                                {/* BUTTON */}

                                <div className="flex items-center justify-between pt-2">

                                    <div className="flex items-center gap-2 text-[10px] text-gray-600">

                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />

                                        Keep your password secure

                                    </div>


                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-xs font-semibold hover:opacity-90 transition-all"
                                    >

                                        Update password

                                        <KeyRound className="w-3.5 h-3.5" />

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ManagerProfile