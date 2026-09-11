import React from 'react'
import { 
  WalletCards,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ currentSection, onChangeSection }) => {

  const navigate = useNavigate()

  const sections = [
    {
      name: 'Approval Request',
      icon: WalletCards
    },
    {
      name: 'Profile',
      icon: User
    }
  ]

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-[230px] min-h-screen bg-[#0d0d11] border-r border-white/[0.07] flex flex-col">

      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/[0.07]">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
            <WalletCards size={19} className="text-white" />
          </div>

          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              Clovia ReimburseX
            </h1>

            <p className="text-[9px] text-gray-500 mt-0.5">
              Expense Management
            </p>
          </div>

        </div>

      </div>


      {/* Workspace */}
      <div className="px-3 pt-7">

        <p className="px-3 mb-3 text-[9px] uppercase tracking-[0.25em] text-gray-600 font-semibold">
          Workspace
        </p>

        <div className="space-y-1.5">

          {sections.map((item) => {

            const Icon = item.icon
            const active = currentSection === item.name

            return (
              <button
                key={item.name}
                onClick={() => onChangeSection(item.name)}
                className={`
                  w-full flex items-center gap-3
                  px-3 py-3
                  rounded-xl
                  text-left
                  transition-all duration-200
                  ${
                    active
                      ? 'bg-purple-600/15 border border-purple-500/30 text-white shadow-lg shadow-purple-900/10'
                      : 'text-gray-400 border border-transparent hover:bg-white/[0.04] hover:text-gray-200'
                  }
                `}
              >

                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${
                      active
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'bg-[#17171c] text-gray-500'
                    }
                  `}
                >
                  <Icon size={17} />
                </div>

                <span className="text-xs font-medium">
                  {item.name}
                </span>

                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                )}

              </button>
            )
          })}

        </div>

      </div>


      {/* Bottom Account */}
      <div className="mt-auto px-3 pb-5">

        <div className="border-t border-white/[0.07] pt-4">

          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#15151a] border border-white/[0.05]">

            <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
              <User size={16} className="text-purple-400" />
            </div>

            <div className="min-w-0">

              <p className="text-xs font-semibold text-white">
                Compensator
              </p>

              <div className="flex items-center gap-1.5 mt-1">

                <ShieldCheck size={10} className="text-emerald-400" />

                <span className="text-[9px] text-gray-500">
                  Secure account
                </span>

              </div>

            </div>

          </div>


          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              w-full
              mt-2
              flex items-center gap-3
              px-3 py-3
              rounded-xl
              text-gray-500
              hover:text-white
              hover:bg-white/[0.04]
              transition-all
            "
          >

            <div className="w-8 h-8 rounded-lg bg-[#17171c] flex items-center justify-center">
              <LogOut size={16} />
            </div>

            <span className="text-xs font-medium">
              Logout
            </span>

          </button>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar