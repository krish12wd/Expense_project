import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'
import LandingPage from './pages/LandingPage'

import EmpDashboard from './pages/EmpDashboard'
import HodDashboard from './pages/HodDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import CompensatorDashboard from './pages/CompensatorDashboard'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import PaidHistory from './components/PaidHistory'
import ProtectedRoute from './ProtectedRoute'
import Unauthorized from './pages/Unauthorized'


const PaidHistoryPage = () => {

  const navigate = useNavigate()

  const role = localStorage.getItem('role')

  const handleBack = () => {
    if (role === 'Manager') {
      navigate('/Manager-Dashboard')
    } else if (role === 'Employee') {
      navigate('/Emp-Dashboard')
    } else if (role === 'Hod') {
      navigate('/Hod-Dashboard')
    } else if (role === 'Compensator') {
      navigate('/Compensator-Dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#07070a] text-white">

      <div className="min-h-screen max-w-[1200px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-7">

          <div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-2">
              ReimburseX
            </p>

            <h1 className="text-3xl font-bold text-white">
              Paid History
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              View your completed expense reimbursements.
            </p>

          </div>

          <button
            onClick={handleBack}
            className="
              flex items-center gap-2
              px-4 py-2.5
              rounded-xl
              bg-[#111115]
              border border-white/[0.08]
              text-gray-400
              hover:text-white
              hover:border-purple-500/40
              hover:bg-[#16161c]
              transition-all
              text-sm
            "
          >
            <span className="text-lg leading-none">←</span>
            Back
          </button>

        </div>


        {/* Main Card */}
        <div
          className="
            bg-[#111115]
            border border-white/[0.07]
            rounded-2xl
            p-5
            shadow-2xl
          "
        >

          <div
            className="
              rounded-xl
              border border-white/[0.06]
              bg-[#0d0d11]
              overflow-hidden

              [&_table]:border
              [&_table]:border-black
              [&_table]:border-collapse

              [&_th]:text-black
              [&_td]:text-black

              [&_th]:border-black
              [&_td]:border-black

              [&_input[type=date]]:text-black
              [&_input[type=date]]:bg-white
              [&_input[type=date]]:[color-scheme:light]
            "
          >

            <PaidHistory />

          </div>

        </div>

      </div>

    </div>
  )
}


const App = () => {

  return (

    <BrowserRouter>

      <Routes>

        {/* UNAUTHORIZED */}
        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* LANDING */}
        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* AUTHENTICATION */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />


        {/* EMPLOYEE */}
        <Route
          path="/Emp-Dashboard"
          element={
            <ProtectedRoute allowedRole={['Employee']}>
              <EmpDashboard />
            </ProtectedRoute>
          }
        />


        {/* HOD */}
        <Route
          path="/Hod-Dashboard"
          element={
            <ProtectedRoute allowedRole={['Hod']}>
              <HodDashboard />
            </ProtectedRoute>
          }
        />


        {/* MANAGER */}
        <Route
          path="/Manager-Dashboard"
          element={
            <ProtectedRoute allowedRole={['Manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />


        {/* COMPENSATOR */}
        <Route
          path="/Compensator-Dashboard"
          element={
            <ProtectedRoute allowedRole={['Compensator']}>
              <CompensatorDashboard />
            </ProtectedRoute>
          }
        />


        {/* PAID HISTORY */}
        <Route
          path="/month-history"
          element={
            <ProtectedRoute
              allowedRole={[
                'Employee',
                'Manager',
                'Hod',
                'Compensator'
              ]}
            >
              <PaidHistoryPage />
            </ProtectedRoute>
          }
        />

      </Routes>


      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

    </BrowserRouter>

  )
}

export default App