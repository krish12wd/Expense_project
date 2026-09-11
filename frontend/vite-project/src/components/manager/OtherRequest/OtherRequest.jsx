import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react'

import 'react-toastify/dist/ReactToastify.css'


const OtherRequest = () => {

  const [tab, settab] = useState('Pending')
  const [req, setreq] = useState([])
  const [loading, setloading] = useState(true)
  const [remarks, setRemarks] = useState({})


  useEffect(() => {
    fetchRequests()
  }, [])


  const fetchRequests = async () => {

    setloading(true)

    try {

      const email = localStorage.getItem('email')

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/manager-other-request/`,
        {
          email: email
        }
      )

      setreq(res.data)

    } catch (error) {

      console.log('Error fetching data', error)

    }

    setloading(false)
  }


  const forceAction = async (req_id, action, remark) => {

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/update_request/`,
      {
        request_id: req_id,
        action,
        remarks: remark,
        force: true
      }
    )

    fetchRequests()
  }


  const handleAction = async (req_id, action) => {

    const remark = remarks[req_id] || ''

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/update_request/`,
        {
          request_id: req_id,
          action,
          remarks: remark
        }
      )


      if (res.data.violation) {

        toast.info(
          ({ closeToast }) => (

            <div className="text-sm">

              <strong>⚠️ Policy Violation</strong>

              <p>
                <b>Policy:</b> {res.data.policy_name}
              </p>

              <p>
                <b>Type:</b> {res.data.policy_type}
              </p>

              <p>
                <b>Limit:</b> {res.data.limit}
              </p>

              <p>
                <b>Spent:</b> {res.data.spent}
              </p>

              <p>
                <b>This Expense:</b> {res.data.expense_amount}
              </p>


              <div className="flex justify-end gap-2 mt-3">

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  onClick={async () => {
                    closeToast()
                    await forceAction(req_id, action, remark)
                  }}
                >
                  Approve Anyway
                </button>

                <button
                  className="bg-gray-500 text-white px-3 py-1 rounded-lg"
                  onClick={closeToast}
                >
                  Cancel
                </button>

              </div>

            </div>
          ),
          {
            autoClose: false
          }
        )

        return
      }


      await forceAction(req_id, action, remark)

    } catch (error) {

      console.log('Update failed', error)

    }
  }


  const status_req = req.filter(
    (r) => r.status === tab
  )


  return (

    <div className="min-h-screen bg-[#07070a] px-8 py-7">

      <ToastContainer />


      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="mb-7">

          <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
            Manager Workspace
          </p>

          <h1 className="text-3xl font-bold text-white">
            Approval Requests
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Review and manage employee reimbursement requests.
          </p>

        </div>


        {/* CARD */}
        <div className="
          bg-[#111115]
          border border-white/[0.07]
          rounded-2xl
          overflow-hidden
        ">


          {/* CARD HEADER */}
          <div className="
            px-6 py-5
            border-b border-white/[0.07]
          ">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">

                <ClipboardCheck className="w-5 h-5 text-purple-400" />

              </div>

              <div>

                <h2 className="text-base font-semibold text-white">
                  Other Requests
                </h2>

                <p className="text-xs text-gray-600 mt-1">
                  Review employee expenses
                </p>

              </div>

            </div>


            {/* TABS */}
            <div className="flex gap-2 mt-6">

              {['Pending', 'Approved', 'Rejected'].map((val) => (

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
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/[0.05] text-gray-500 hover:text-gray-300 hover:bg-white/[0.08]'
                    }
                  `}
                >
                  {val}
                </button>

              ))}

            </div>

          </div>


          {/* TABLE */}
          {loading ? (

            <div className="py-16 text-center">

              <p className="text-sm text-gray-600">
                Loading requests...
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead>

                  <tr className="border-b border-white/[0.06]">

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Emp Code
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Emp Name
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Expense Date
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Created Date
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Note
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                      Proof
                    </th>

                    {tab === 'Pending' && (

                      <th className="px-5 py-4 text-left text-[9px] uppercase tracking-widest text-gray-500">
                        Remarks & Actions
                      </th>

                    )}

                  </tr>

                </thead>


                <tbody>

                  {status_req.length === 0 ? (

                    <tr>

                      <td
                        colSpan={tab === 'Pending' ? 8 : 7}
                        className="py-14 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <FileText className="w-8 h-8 text-gray-700 mb-3" />

                          <p className="text-sm text-gray-600">
                            No requests found.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    status_req.map((data, idx) => (

                      <tr
                        key={idx}
                        className="
                          border-b border-white/[0.04]
                          hover:bg-white/[0.015]
                          transition-all
                        "
                      >

                        <td className="px-5 py-4 text-xs text-gray-400">
                          {data.raised_by_id}
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-300 font-medium">
                          {data.raised_by_name}
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-400">
                          {new Date(data.expense_date).toLocaleDateString('en-GB')}
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-500">
                          {data.request_date
                            ? new Date(data.request_date).toLocaleDateString('en-GB')
                            : 'N/A'}
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-400 max-w-[200px]">
                          {data.note}
                        </td>

                        <td className="px-5 py-4 text-xs font-semibold text-gray-200">
                          ₹{data.amount}
                        </td>

                        <td className="px-5 py-4">

                          {data.proof ? (

                            <a
                              href={data.proof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                inline-flex items-center gap-1.5
                                text-purple-400
                                hover:text-purple-300
                                text-xs
                              "
                              download
                            >
                              View Proof
                            </a>

                          ) : (

                            <span className="text-gray-600 text-xs italic">
                              No file
                            </span>

                          )}

                        </td>


                        {tab === 'Pending' && (

                          <td className="px-5 py-4 min-w-[210px]">

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
                                w-full
                                bg-[#18181d]
                                border border-white/[0.08]
                                rounded-lg
                                px-3 py-2
                                text-xs text-white
                                placeholder:text-gray-600
                                outline-none
                                focus:border-purple-500/40
                              "
                            />


                            <div className="flex gap-2 mt-2">

                              <button
                                className="
                                  flex items-center gap-1
                                  bg-emerald-500/10
                                  text-emerald-400
                                  border border-emerald-500/20
                                  px-3 py-1.5
                                  rounded-lg
                                  text-[11px]
                                  font-semibold
                                  hover:bg-emerald-500/20
                                "
                                onClick={() =>
                                  handleAction(
                                    data.request_id,
                                    'approve'
                                  )
                                }
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>


                              <button
                                className="
                                  flex items-center gap-1
                                  bg-red-500/10
                                  text-red-400
                                  border border-red-500/20
                                  px-3 py-1.5
                                  rounded-lg
                                  text-[11px]
                                  font-semibold
                                  hover:bg-red-500/20
                                "
                                onClick={() =>
                                  handleAction(
                                    data.request_id,
                                    'reject'
                                  )
                                }
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>

                            </div>

                          </td>

                        )}

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default OtherRequest