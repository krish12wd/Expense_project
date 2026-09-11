import React from 'react'
import {
    WalletCards,
    FilePlus2,
    ClipboardCheck,
    UserRound,
    LogOut,
    ShieldCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ currentSection, onChangeSection }) => {

    const navigate = useNavigate()

    const sections = [
        {
            name: 'My Expenses',
            icon: WalletCards
        },
        {
            name: 'Create Request',
            icon: FilePlus2
        },
        {
            name: 'Approval Request',
            icon: ClipboardCheck
        },
        {
            name: 'Profile',
            icon: UserRound
        }
    ]

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login', { replace: true })
    }

    return (
        <aside className="w-64 min-h-screen bg-[#0d0d10] border-r border-white/[0.07] flex flex-col">

            {/* BRAND */}
            <div className="px-5 pt-6 pb-7 border-b border-white/[0.06]">

                <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <WalletCards className="w-5 h-5 text-white" />
                    </div>

                    <div>
                        <h1 className="text-white text-sm font-bold leading-tight">
                            Clovia ReimburseX
                        </h1>

                        <p className="text-[9px] text-gray-500 mt-1">
                            Expense Management
                        </p>
                    </div>

                </div>

            </div>

            {/* WORKSPACE */}
            <div className="px-3 pt-7">

                <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gray-600 px-3 mb-4">
                    Workspace
                </p>

                <div className="space-y-1">

                    {sections.map((item) => {

                        const Icon = item.icon
                        const active = currentSection === item.name

                        return (
                            <button
                                key={item.name}
                                onClick={() => onChangeSection(item.name)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                                    active
                                        ? 'bg-gradient-to-r from-purple-600/25 to-fuchsia-500/10 border border-purple-500/20 text-white'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.035]'
                                }`}
                            >

                                <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                        active
                                            ? 'bg-purple-500/20 text-purple-300'
                                            : 'bg-white/[0.04] text-gray-500'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>

                                <span className="flex-1 text-left">
                                    {item.name}
                                </span>

                                {active && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                                )}

                            </button>
                        )
                    })}

                </div>

            </div>

            {/* BOTTOM */}
            <div className="mt-auto px-3 pb-5">

                <div className="border-t border-white/[0.06] pt-4">

                    {/* ACCOUNT */}
                    <div className="rounded-xl bg-[#17171c] border border-white/[0.06] p-3 mb-3">

                        <div className="flex items-center gap-3">

                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                                <UserRound className="w-4 h-4 text-white" />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs font-semibold text-white">
                                    Manager
                                </p>

                                <div className="flex items-center gap-1.5 mt-1">

                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />

                                    <span className="text-[9px] text-gray-500">
                                        Secure account
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* LOGOUT */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >

                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                            <LogOut className="w-4 h-4" />
                        </div>

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </aside>
    )
}

export default Sidebar