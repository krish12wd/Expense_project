import axios from 'axios'
import React, { useEffect, useState } from 'react'

const OtherRequest = () => {

  const [tab, settab] = useState('Approved')
  const [req, setreq] = useState([])
  const [loading, setloading] = useState(true)
  const [remarks, setRemarks] = useState({})

  useEffect(() => {
    const fecthExpense = async () => {
      try {
        const email = localStorage.getItem('email')

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/Comp-other-request/`,
          {
            email: email
          }
        )

        setreq(res.data)
        setloading(false)

      } catch (error) {
        console.log('Error fetching data', error)
        setloading(false)
      }
    }

    fecthExpense()

  }, [])


  const handleAction = async (req_id, action) => {

    const remark = remarks[req_id] || ''

    try {

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Comp_update_request/`,
        {
          request_id: req_id,
          action: action,
          remarks: remark
        }
      )

      setloading(true)

      const email = localStorage.getItem('email')

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Comp-other-request/`,
        { email }
      )

      setreq(res.data)
      setloading(false)

    } catch (error) {
      console.log('Update failed', error)
    }
  }


  const status_req = req.filter((r) => r.status === tab)


  return (

    <div className="w-full max-w-[1200px] mx-auto">

      {/* Header */}

      <div className="mb-7">

        <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
          COMPENSATOR WORKSPACE
        </p>

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-white">
              Approval Requests
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Review approved reimbursements and process payments.
            </p>

          </div>

          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />

            <span className="text-xs text-gray-500">
              Secure account
            </span>

          </div>

        </div>

      </div>


      {/* Main Card */}

      <div className="
        bg-[#111115]
        border border-white/[0.07]
        rounded-2xl
        overflow-hidden
        shadow-2xl
      ">

        {/* Card Header */}

        <div className="px-6 py-5 border-b border-white/[0.07]">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-purple-600/15 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-400"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                Reimbursement Queue
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Process approved expense requests
              </p>
            </div>

          </div>

        </div>


        {/* Tabs */}

        <div className="px-6 py-4 border-b border-white/[0.07]">

          <div className="flex gap-2">

            {['Approved', 'Paid'].map((val) => (

              <button
                key={val}
                onClick={() => settab(val)}
                className={`
                  px-4 py-2
                  rounded-xl
                  text-xs
                  font-medium
                  transition-all
                  ${
                    tab === val
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'bg-[#19191e] text-gray-400 border border-white/[0.06] hover:text-white hover:bg-[#202026]'
                  }
                `}
              >
                {val}
              </button>

            ))}

          </div>

        </div>


        {/* Table */}

        <div className="overflow-x-auto">

          {loading ? (

            <div className="py-20 text-center">

              <div className="w-8 h-8 mx-auto border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />

              <p className="text-xs text-gray-500 mt-4">
                Loading requests...
              </p>

            </div>

          ) : (

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="bg-[#0d0d11] border-b border-white/[0.07]">

                  <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Emp Code
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Emp Name
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Expense Date
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Created
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Note
                  </th>

                  <th className="px-5 py-4 text-right text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    Status
                  </th>

                  {tab === 'Approved' && (
                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                      Actions
                    </th>
                  )}

                </tr>

              </thead>


              <tbody>

                {status_req.length === 0 ? (

                  <tr>

                    <td
                      colSpan={tab === 'Approved' ? 8 : 7}
                      className="py-20 text-center"
                    >

                      <div className="w-12 h-12 mx-auto rounded-xl bg-[#18181d] flex items-center justify-center">

                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="text-gray-600"
                        >
                          <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                          <path d="M14 2v6h6" />
                          <path d="M8 13h8M8 17h6" />
                        </svg>

                      </div>

                      <p className="text-sm text-gray-500 mt-4">
                        No {tab.toLowerCase()} requests found.
                      </p>

                    </td>

                  </tr>

                ) : (

                  status_req.map((data, idx) => (

                    <tr
                      key={idx}
                      className="
                        border-b border-white/[0.05]
                        hover:bg-white/[0.02]
                        transition-colors
                      "
                    >

                      <td className="px-5 py-4 text-sm text-gray-300">
                        {data.raised_by_id}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-white">
                        {data.raised_by_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {new Date(data.expense_date).toLocaleDateString('en-GB')}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-400">
                        {data.request_date
                          ? new Date(data.request_date).toLocaleDateString('en-GB')
                          : 'N/A'}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-400 max-w-[220px]">
                        <div className="truncate">
                          {data.note}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-semibold text-white">
                        ₹{data.amount}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex px-2.5 py-1
                            rounded-lg
                            text-[10px]
                            font-semibold
                            ${
                              data.status === 'Paid'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }
                          `}
                        >
                          {data.status}
                        </span>

                      </td>


                      {tab === 'Approved' && (

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <input
                              type="text"
                              placeholder="Remarks"
                              value={remarks[data.request_id] || ''}
                              onChange={(e) =>
                                setRemarks({
                                  ...remarks,
                                  [data.request_id]: e.target.value
                                })
                              }
                              className="
                                w-[130px]
                                px-3 py-2
                                rounded-lg
                                bg-[#18181d]
                                border border-white/[0.08]
                                text-xs text-white
                                placeholder:text-gray-600
                                focus:outline-none
                                focus:border-purple-500/50
                              "
                            />

                            <button
                              className="
                                px-3 py-2
                                rounded-lg
                                bg-purple-600
                                hover:bg-purple-500
                                text-white
                                text-xs
                                font-semibold
                                transition-all
                                shadow-lg shadow-purple-600/10
                              "
                              onClick={() =>
                                handleAction(data.request_id, 'paid')
                              }
                            >
                              Paid
                            </button>

                          </div>

                        </td>

                      )}

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  )
}

export default OtherRequest