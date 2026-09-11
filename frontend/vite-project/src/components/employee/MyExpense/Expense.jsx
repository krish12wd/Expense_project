import axios from 'axios'
import React, { useEffect, useState } from 'react'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
    WalletCards,
    Clock3,
    CircleX,
    ArrowUpRight,
    ReceiptText
} from 'lucide-react';

dayjs.extend(relativeTime);

const Expense = () => {

    const [data, setData] = useState(null);
    const [history, sethistory] = useState([])
    const [pending, setpending] = useState(0)
    const [rejected, setrejected] = useState(0);
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        const fetchData = async () => {

            try {

                const email = localStorage.getItem('email')

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/manager/dashboard/`,
                    { email: email }
                )

                setData(res.data)

                const histres = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/expense-history/`,
                    {
                        email: email
                    }
                )

                sethistory(histres.data)

                let pending = 0;
                let rejected = 0;

                histres.data.forEach(exp => {

                    if (
                        exp.status === "Pending" ||
                        exp.status === "Waiting for HoD" ||
                        exp.status === "Waiting for Manager (L1)" ||
                        exp.status === "Approved by Manager (L1), Waiting for HoD" ||
                        exp.status === "Approved by HoD, Waiting for Payment"
                    ) {
                        pending += exp.amount;
                    }

                    else if (exp.status === "Rejected") {
                        rejected += exp.amount;
                    }

                });

                setpending(pending)
                setrejected(rejected)

            } catch (error) {

                console.log("Error in Fetching Data", error);

            }
        }

        fetchData()

    }, [])

    const statusSoftPolicy = (status) => {

        if (status === "Pending") {
            return "Waiting for HoD";
        }

        return status;
    };

    const getPrettyTime = (dateString) => {

        const inputDate = dayjs(dateString);
        const today = dayjs();
        const diffInDays = today.diff(inputDate, 'day');

        if (diffInDays > 7) {
            return inputDate.format('D MMM YYYY');
        }

        return inputDate.fromNow();
    };

    const filterHistory = statusFilter
        ? history.filter(
            item => item.status === statusFilter &&
                item.status !== "Cancelled"
        )
        : history.filter(
            item => item.status !== "Cancelled"
        );

    return (

        <div className="min-h-screen bg-[#08080b] px-8 py-7">

            <div className="max-w-[1050px] mx-auto">

                {/* HEADER */}
                <div className="flex items-start justify-between mb-8">

                    <div>

                        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
                            Employee Workspace
                        </p>

                        <h1 className="text-3xl font-bold text-white">
                            Welcome, {data ? data.username : "user"}!
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Manage your expenses and reimbursement requests.
                        </p>

                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Secure account
                    </div>

                </div>

                {/* TOP CARDS */}

                <div className="grid grid-cols-2 gap-4 mb-5">

                    {/* PAID HISTORY - CENTER */}
                    <div className="col-span-2 flex justify-center">

                        <div className="w-full max-w-[600px] bg-[#111115] border border-white/[0.07] rounded-2xl p-5 hover:border-purple-500/20 transition-all">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <WalletCards className="w-5 h-5 text-purple-400" />
                                    </div>

                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-600">
                                            Reimbursements
                                        </p>

                                        <h3 className="text-base font-semibold text-white mt-1">
                                            Paid History
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-1">
                                            View your completed reimbursements
                                        </p>
                                    </div>

                                </div>

                                <button
                                    onClick={() => window.location.href = "/month-history"}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
                                >
                                    View History
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* WAITING */}

                    <div className="bg-[#111115] border border-white/[0.07] rounded-2xl p-5">

                        <div className="flex items-center justify-between mb-5">

                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <Clock3 className="w-5 h-5 text-yellow-400" />
                            </div>

                            <span className="text-[9px] uppercase tracking-widest text-gray-600">
                                Pending
                            </span>

                        </div>

                        <p className="text-2xl font-bold text-white">
                            ₹{pending}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Waiting for approval/payment
                        </p>

                    </div>

                    {/* REJECTED */}

                    <div className="bg-[#111115] border border-white/[0.07] rounded-2xl p-5">

                        <div className="flex items-center justify-between mb-5">

                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <CircleX className="w-5 h-5 text-red-400" />
                            </div>

                            <span className="text-[9px] uppercase tracking-widest text-gray-600">
                                Rejected
                            </span>

                        </div>

                        <p className="text-2xl font-bold text-white">
                            ₹{rejected}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                            Total rejected amount
                        </p>

                    </div>

                </div>

                {/* HISTORY */}

                <div className="bg-[#111115] border border-white/[0.07] rounded-2xl overflow-hidden">

                    {/* TABLE HEADER */}

                    <div className="px-6 py-5 border-b border-white/[0.07] flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <ReceiptText className="w-4 h-4 text-purple-400" />
                            </div>

                            <div>

                                <h2 className="text-base font-semibold text-white">
                                    Reimbursement History
                                </h2>

                                <p className="text-xs text-gray-600 mt-1">
                                    Track your submitted expenses
                                </p>

                            </div>

                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#18181d] border border-white/[0.08] text-gray-400 px-3 py-2 rounded-lg text-xs outline-none focus:border-purple-500/40"
                        >
                            <option value="">All Statuses</option>

                            <option value="Approved by HoD, Waiting for Payment">
                                Approved by HoD
                            </option>

                            <option value="Approved by Manager (L1), Waiting for HoD">
                                Approved by Manager
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Rejected">
                                Rejected
                            </option>

                            <option value="Paid">
                                Paid
                            </option>

                        </select>

                    </div>

                    {/* TABLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-white/[0.06]">

                                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-widest text-gray-600 font-semibold">
                                        Expense Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-widest text-gray-600 font-semibold">
                                        Created
                                    </th>

                                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-widest text-gray-600 font-semibold">
                                        Note
                                    </th>

                                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-widest text-gray-600 font-semibold">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 text-left text-[9px] uppercase tracking-widest text-gray-600 font-semibold">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filterHistory.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="py-14 text-center"
                                        >

                                            <div className="flex flex-col items-center">

                                                <ReceiptText className="w-8 h-8 text-gray-700 mb-3" />

                                                <p className="text-sm text-gray-600">
                                                    No records found.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    filterHistory.map((data, id) => (

                                        <tr
                                            key={id}
                                            className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-all"
                                        >

                                            <td className="px-6 py-4 text-xs text-gray-400">
                                                {new Date(data.expense_date).toLocaleDateString('en-GB')}
                                            </td>

                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {data.request_date
                                                    ? getPrettyTime(data.request_date)
                                                    : 'N/A'}
                                            </td>

                                            <td className="px-6 py-4 text-xs text-gray-400 max-w-[220px]">
                                                {data.note}
                                            </td>

                                            <td className="px-6 py-4 text-xs font-semibold text-gray-200">
                                                ₹{data.amount}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                                                        data.status === 'Approved by HoD, Waiting for Payment' ||
                                                        data.status === 'Approved by Manager (L1), Waiting for HoD'
                                                            ? 'text-emerald-400 bg-emerald-400/10'
                                                            :
                                                        data.status === 'Waiting for Manager (L1)'
                                                            ? 'text-yellow-400 bg-yellow-400/10'
                                                            :
                                                        data.status === 'Paid'
                                                            ? 'text-blue-400 bg-blue-400/10'
                                                            :
                                                        statusSoftPolicy(data.status) === 'Waiting for HoD'
                                                            ? 'text-yellow-400 bg-yellow-400/10'
                                                            :
                                                        'text-red-400 bg-red-400/10'
                                                    }`}
                                                >
                                                    {statusSoftPolicy(data.status)}
                                                </span>

                                                {data.status === 'Rejected' && data.reason && (

                                                    <div className="text-[10px] mt-2 text-gray-600 italic">
                                                        Reason: {data.reason}
                                                    </div>

                                                )}

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Expense