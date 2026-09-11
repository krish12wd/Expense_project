import axios from 'axios'
import React, { useState } from 'react'
import { toast } from "react-toastify"

import {
    ReceiptText,
    CalendarDays,
    IndianRupee,
    Upload
} from "lucide-react"

import "react-toastify/dist/ReactToastify.css"

const CreateExpenseRequest = ({ setsection }) => {

    const email = localStorage.getItem('email')

    const [date, setDate] = useState('')
    const [note, setNote] = useState('')
    const [amount, setamount] = useState('')
    const [proof, setproof] = useState(null)
    const [reason, setReason] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [lastExpenseId, setLastExpenseId] = useState(null)

    const today = (() => {

        const currentDate = new Date()

        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')

        return `${year}-${month}-${day}`

    })()


    const handleDateChange = (e) => {

        const selectedDate = e.target.value

        if (selectedDate && selectedDate > today) {

            toast.error("Future date cannot be selected.")

            setDate('')

            return
        }

        setDate(selectedDate)
    }


    const resetForm = () => {

        setDate('')
        setNote('')
        setamount('')
        setproof(null)
        setReason('')

    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        if (date && date > today) {

            toast.error("Future date cannot be selected.")

            return
        }

        try {

            const policyCheck = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/check-policy/`,
                {
                    email: email,
                    amount: parseInt(amount)
                }
            )

            const status = policyCheck.data.status

            if (status === 'allowed') {

                await submitExpense()

            }

            else if (status === 'soft_violation') {

                setShowModal(true)

            }

            else if (status === 'hard_violation') {

                toast.info(
                    "This expense violates a hard policy. You are not allowed to create this expense."
                )

            }

        } catch (error) {

            toast.error("Submission failed.")

            console.log(error)

        }
    }


    const submitExpense = async () => {

        const formData = new FormData()

        formData.append('email', email)
        formData.append('date', date)
        formData.append('note', note)
        formData.append('amount', amount)
        formData.append('proof', proof)

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/expenses/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (res.status === 201) {

                const expenseId = res.data.expense_id

                setLastExpenseId(expenseId)

                toast.success(
                    <div>

                        Expense submitted successfully!

                        <button
                            onClick={() => undoLastRequest(expenseId)}
                            className="ml-3 underline text-blue-300"
                        >
                            Undo
                        </button>

                    </div>,
                    {
                        autoClose: 5000
                    }
                )

                setTimeout(() => {
                    setsection("My Expenses")
                }, 2000)

                resetForm()

            }

            else {

                toast.error("Something went wrong")

            }

        } catch (err) {

            toast.error("Failed to submit expense")

            console.log(err)

        }
    }


    const undoLastRequest = async (expenseId) => {

        try {

            console.log(
                "Sending undo request with expense_id:",
                expenseId
            )

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/undo-expense/`,
                {
                    expense_id: expenseId
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            toast.info("Expense request undone")

            setLastExpenseId(null)

        } catch (err) {

            toast.error("Failed to undo request")

            console.log(err)

        }
    }


    const submitHODApproval = async () => {

        if (!reason.trim()) {

            toast.error("Reason is required")

            return
        }

        const formData = new FormData()

        formData.append('email', email)
        formData.append('date', date)
        formData.append('note', note)
        formData.append('amount', amount)
        formData.append('reason_for_hod', reason.trim())
        formData.append('proof', proof)

        try {

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/request-hod-policy-approval/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (res.status === 200) {

                toast.success(
                    "Request sent to HOD for approval. Redirecting ..."
                )

                setTimeout(() => {
                    setsection("My Expenses")
                }, 5000)

                resetForm()

                setShowModal(false)

            }

            else {

                toast.error(
                    "Failed to send request to HOD."
                )

            }

        } catch (err) {

            console.log(err)

            toast.error("Failed to send request.")

        }
    }


    return (

        <div className="min-h-screen bg-[#08080b] px-8 py-7">

            <div className="max-w-[1050px] mx-auto">

                {/* HEADER */}

                <div className="mb-8">

                    <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
                        Manager Workspace
                    </p>

                    <h1 className="text-3xl font-bold text-white">
                        Create Expense Request
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Submit a new expense claim for reimbursement.
                    </p>

                </div>


                {/* FORM CARD */}

                <div className="bg-[#111115] border border-white/[0.07] rounded-2xl overflow-hidden">

                    <div className="px-6 py-5 border-b border-white/[0.07] flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">

                            <ReceiptText className="w-5 h-5 text-purple-400" />

                        </div>


                        <div>

                            <h2 className="text-base font-semibold text-white">
                                New Expense
                            </h2>

                            <p className="text-xs text-gray-600 mt-1">
                                Enter your expense details below.
                            </p>

                        </div>

                    </div>


                    <form
                        className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >

                        {/* EMAIL */}

                        <div>

                            <label className="block text-xs font-medium text-gray-500 mb-2">
                                Your Email
                            </label>

                            <div className="px-4 py-3 rounded-xl bg-[#18181d] border border-white/[0.06] text-gray-500 text-sm">
                                {email}
                            </div>

                        </div>


                        {/* DATE */}

                        <div>

                            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">

                                <CalendarDays className="w-3.5 h-3.5 text-purple-400" />

                                Date of Expense

                            </label>


                            <input
                                value={date}
                                onChange={handleDateChange}
                                className="
                                    w-full
                                    px-4 py-3
                                    bg-[#18181d]
                                    border border-white/[0.07]
                                    text-gray-300
                                    rounded-xl
                                    text-sm
                                    outline-none
                                    focus:border-purple-500/40
                                    [&::-webkit-calendar-picker-indicator]:invert
                                    [&::-webkit-calendar-picker-indicator]:opacity-100
                                "
                                type="date"
                                required
                                max={today}
                            />

                        </div>


                        {/* NOTE */}

                        <div>

                            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">

                                <ReceiptText className="w-3.5 h-3.5" />

                                Note / Description

                            </label>


                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Describe what this expense was for..."
                                className="w-full px-4 py-3 bg-[#18181d] border border-white/[0.07] text-gray-300 placeholder-gray-700 rounded-xl text-sm outline-none focus:border-purple-500/40 resize-none"
                                rows="5"
                                required
                            />

                        </div>


                        {/* AMOUNT */}

                        <div>

                            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">

                                <IndianRupee className="w-3.5 h-3.5" />

                                Amount (INR)

                            </label>


                            <input
                                value={amount}
                                onChange={(e) => setamount(e.target.value)}
                                placeholder="e.g., 1200"
                                className="w-full px-4 py-3 bg-[#18181d] border border-white/[0.07] text-gray-300 placeholder-gray-700 rounded-xl text-sm outline-none focus:border-purple-500/40"
                                type="number"
                                required
                            />

                        </div>


                        {/* PROOF */}

                        <div className="md:col-span-2">

                            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">

                                <Upload className="w-3.5 h-3.5" />

                                Upload Expense Proof

                            </label>


                            <input
                                onChange={(e) => setproof(e.target.files[0])}
                                className="w-full px-4 py-3 bg-[#18181d] border border-white/[0.07] text-gray-400 rounded-xl text-sm"
                                type="file"
                                accept="application/pdf,image/png,image/jpeg"
                                required
                            />


                            <p className="text-[10px] text-gray-600 mt-2">
                                Acceptable formats: PDF, JPG, PNG
                            </p>

                        </div>


                        {/* SUBMIT */}

                        <div className="md:col-span-2 flex justify-end pt-2">

                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-500/10"
                            >
                                Submit Expense
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* MODAL */}

            {showModal && (

                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                    <div className="bg-[#111115] border border-white/[0.08] w-full max-w-md p-6 rounded-2xl shadow-2xl">

                        <div className="flex items-center gap-3 mb-4">

                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                                <ReceiptText className="w-5 h-5 text-yellow-400" />

                            </div>


                            <div>

                                <h2 className="text-lg font-semibold text-white">
                                    Policy Violation
                                </h2>

                                <p className="text-xs text-gray-600 mt-1">
                                    HOD approval required
                                </p>

                            </div>

                        </div>


                        <p className="text-sm text-gray-400 mb-4">

                            This expense exceeds soft policy limits.
                            Please enter a reason for HOD approval:

                        </p>


                        <textarea
                            className="w-full bg-[#18181d] border border-white/[0.07] text-white placeholder-gray-700 rounded-xl p-3 text-sm outline-none focus:border-purple-500/40 resize-none"
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Write your reason here..."
                        />


                        <div className="flex justify-end gap-3 mt-5">

                            <button
                                className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-gray-400 text-sm hover:text-white transition-all"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>


                            <button
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-sm font-semibold hover:opacity-90 transition-all"
                                onClick={submitHODApproval}
                            >
                                Submit
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}

export default CreateExpenseRequest