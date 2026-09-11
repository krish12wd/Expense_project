import React from "react";
import {
  ClipboardCheck,
  UserRound,
  ReceiptText,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ currentSection, onChangeSection }) => {
  const navigate = useNavigate();

  const sections = [
    {
      name: "Approval Request",
      icon: ClipboardCheck,
    },
    {
      name: "Profile",
      icon: UserRound,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0d0d11] border-r border-white/10 text-white flex flex-col">

      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <ReceiptText size={20} />
          </div>

          <div>
            <h1 className="font-semibold text-[15px] tracking-tight">
              Clovia ReimburseX
            </h1>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Expense Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pt-7 flex-1">
        <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.18em] text-gray-600 font-semibold">
          Workspace
        </p>

        <nav className="space-y-1.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = currentSection === section.name;

            return (
              <button
                key={section.name}
                onClick={() => onChangeSection(section.name)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-purple-600/20 to-fuchsia-500/10 text-white border border-purple-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    active
                      ? "bg-purple-500/15 text-purple-400"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <span>{section.name}</span>

                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-500/50" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User + Logout */}
      <div className="p-4 space-y-2">
        <div className="rounded-xl border border-white/10 bg-[#15151a] p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center">
              <UserRound size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                HOD
              </p>

              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={11} className="text-emerald-400" />
                <p className="text-[10px] text-gray-500">
                  Secure account
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-400 border border-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/10 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <LogOut size={17} />
          </div>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;