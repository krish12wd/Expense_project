import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Check,
  X,
  Download,
  Filter,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  UserRound,
} from "lucide-react";

import "react-toastify/dist/ReactToastify.css";

const OtherRequest = () => {
  const [tab, settab] = useState("Pending");
  const [req, setreq] = useState([]);
  const [softReq, setSoftReq] = useState([]);
  const [loading, setloading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [allemployee, setAllemployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchAllRequests();
    fetchAllEmployeeNames();
  }, [tab]);

  const fetchAllEmployeeNames = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/all-employees/`
      );

      setAllemployee(res.data);
    } catch (error) {
      console.error("Failed to fetch employee names", error);
    }
  };

  const fetchAllRequests = async () => {
    setloading(true);

    const email = localStorage.getItem("email");

    try {
      if (tab === "Soft Policy Exception") {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/hod-soft-policy-requests/`,
          { email }
        );

        setSoftReq(res.data);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/Hod-other-request/`,
          { email }
        );

        setreq(res.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }

    setloading(false);
  };

  const handleAction = async (req_id, action) => {
    const remark = remarks[req_id] || "";

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/hod_update_request/`,
        {
          request_id: req_id,
          action,
          remarks: remark,
        }
      );

      if (res.data.violation) {
        toast.info(
          ({ closeToast }) => (
            <div className="text-sm">
              <strong>⚠ Policy Violation Detected!</strong>

              <p>Policy: {res.data.policy_name}</p>
              <p>Type: {res.data.policy_type}</p>
              <p>Limit: ₹{res.data.limit}</p>
              <p>Spent: ₹{res.data.spent}</p>
              <p>This Expense: ₹{res.data.expense_amount}</p>

              <div className="flex justify-end mt-3 gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg"
                  onClick={async () => {
                    closeToast();

                    await axios.post(
                      `${import.meta.env.VITE_BACKEND_URL}/api/hod_update_request/`,
                      {
                        request_id: req_id,
                        action,
                        remarks: remark,
                        force: true,
                      }
                    );

                    fetchAllRequests();
                  }}
                >
                  Approve Anyway
                </button>

                <button
                  className="bg-gray-600 text-white px-3 py-1.5 rounded-lg"
                  onClick={closeToast}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { autoClose: false }
        );

        return;
      }

      await fetchAllRequests();
    } catch (error) {
      console.log("Update failed", error);
    }
  };

  const status_req = (
    tab === "Soft Policy Exception" ? softReq : req
  ).filter((r) => {
    const status = r.status?.toLowerCase();

    const matchStatus =
      tab === "Approved"
        ? status === "approved" || status === "paid"
        : status === tab.toLowerCase();

    const matchEmployee =
      selectedEmployee === "" ||
      r.raised_by_id === parseInt(selectedEmployee);

    return tab === "Soft Policy Exception"
      ? matchEmployee
      : matchStatus && matchEmployee;
  });

  const tabs = [
    {
      name: "Pending",
      icon: Clock3,
    },
    {
      name: "Approved",
      icon: CheckCircle2,
    },
    {
      name: "Rejected",
      icon: XCircle,
    },
    {
      name: "Soft Policy Exception",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white p-4 sm:p-6 lg:p-8">

      <ToastContainer theme="dark" />

      <div className="max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5 mb-6">

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-400 mb-1">
              Workspace
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Approval Requests
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Review and manage employee expense requests.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText size={15} className="text-purple-400" />
            Expense management
          </div>

        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/10 bg-[#101014] shadow-2xl overflow-hidden">

          {/* Tabs */}
          <div className="p-5 border-b border-white/10">

            <div className="flex flex-wrap gap-2">

              {tabs.map((item) => {
                const Icon = item.icon;
                const active = tab === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => settab(item.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-900/20"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={15} />
                    {item.name}
                  </button>
                );
              })}

            </div>

          </div>

          {/* Filter */}
          <div className="px-5 py-5 border-b border-white/10">

            <div className="flex items-center gap-2 mb-2">
              <Filter size={15} className="text-purple-400" />

              <label className="text-xs font-medium text-gray-400">
                Filter by employee
              </label>
            </div>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full sm:w-80 rounded-xl border border-white/10 bg-[#17171d] px-4 py-3 text-sm text-gray-200 outline-none focus:border-purple-500/60 cursor-pointer"
            >
              <option value="">All Employees</option>

              {allemployee.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.username}
                </option>
              ))}
            </select>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">

              <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mb-4" />

              <p className="text-sm text-gray-500">
                Loading requests...
              </p>

            </div>
          ) : status_req.length === 0 ? (

            /* Empty State */
            <div className="py-20 flex flex-col items-center justify-center text-center px-5">

              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <FileText size={23} className="text-purple-400" />
              </div>

              <h3 className="text-base font-medium text-gray-300">
                No {tab} requests
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                There are no requests matching your current filter.
              </p>

            </div>
          ) : (

            /* Table */
            <div className="overflow-x-auto">

              <table className="min-w-[1100px] w-full text-left">

                <thead>
                  <tr className="border-b border-white/10 bg-[#0d0d11]">

                    <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      Employee
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      Expense Date
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      Created
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      {tab === "Soft Policy Exception"
                        ? "Reason"
                        : "Note"}
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium text-right">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      Proof
                    </th>

                    {(tab === "Pending" ||
                      tab === "Soft Policy Exception") && (
                      <th className="px-5 py-4 text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                        Actions
                      </th>
                    )}

                  </tr>
                </thead>

                <tbody>

                  {status_req.map((data, idx) => (

                    <tr
                      key={idx}
                      className="border-b border-white/5 hover:bg-white/[0.025] transition"
                    >

                      {/* Employee */}
                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <UserRound
                              size={16}
                              className="text-purple-400"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-200">
                              {data.raised_by_name}
                            </p>

                            <p className="text-xs text-gray-600 mt-0.5">
                              ID #{data.raised_by_id}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Expense date */}
                      <td className="px-5 py-5 text-sm text-gray-400">
                        {new Date(
                          data.expense_date
                        ).toLocaleDateString("en-GB")}
                      </td>

                      {/* Created */}
                      <td className="px-5 py-5 text-sm text-gray-400">
                        {data.request_date
                          ? new Date(
                              data.request_date
                            ).toLocaleDateString("en-GB")
                          : "N/A"}
                      </td>

                      {/* Note / Reason */}
                      <td className="px-5 py-5 max-w-xs">

                        <p className="text-sm text-gray-300 truncate">
                          {tab === "Soft Policy Exception"
                            ? data.reason
                            : data.note}
                        </p>

                      </td>

                      {/* Amount */}
                      <td className="px-5 py-5 text-right">

                        <span className="text-sm font-semibold text-gray-200">
                          ₹{data.amount}
                        </span>

                      </td>

                      {/* Proof */}
                      <td className="px-5 py-5">

                        {data.proof ? (
                          <a
                            href={data.proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        ) : (
                          <span className="text-xs text-gray-600">
                            No file
                          </span>
                        )}

                      </td>

                      {/* Actions */}
                      {(tab === "Pending" ||
                        tab === "Soft Policy Exception") && (

                        <td className="px-5 py-5">

                          <div className="flex flex-col gap-2 min-w-[220px]">

                            <input
                              type="text"
                              placeholder="Add remarks..."
                              value={
                                remarks[data.request_id] || ""
                              }
                              onChange={(e) =>
                                setRemarks({
                                  ...remarks,
                                  [data.request_id]:
                                    e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-white/10 bg-[#17171d] px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-purple-500/50"
                            />

                            <div className="flex gap-2">

                              <button
                                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition cursor-pointer"
                                onClick={() =>
                                  handleAction(
                                    data.request_id,
                                    "approve"
                                  )
                                }
                              >
                                <Check size={14} />
                                Approve
                              </button>

                              <button
                                className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-500/20 transition cursor-pointer"
                                onClick={() =>
                                  handleAction(
                                    data.request_id,
                                    "reject"
                                  )
                                }
                              >
                                <X size={14} />
                                Reject
                              </button>

                            </div>

                          </div>

                        </td>
                      )}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OtherRequest;