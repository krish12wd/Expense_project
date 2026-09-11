import React, { useState } from 'react'
import ManagerProfile from '../components/manager/Profile/ManagerProfile'
import OtherRequest from '../components/manager/OtherRequest/OtherRequest'
import CreateExpenseRequest from '../components/manager/CreateRequest/CreateExpenseRequest'
import Sidebar from '../components/manager/Sidebar'
import Expense from '../components/manager/MyExpense/Expense'

const ManagerDashboard = () => {

    const [section, setsection] = useState('My Expenses')

    const renderSection = () => {
        switch (section) {

            case 'My Expenses':
                return <Expense />

            case 'Create Request':
                return <CreateExpenseRequest setsection={setsection} />

            case 'Approval Request':
                return <OtherRequest />

            case 'Profile':
                return <ManagerProfile />

            default:
                return <Expense />
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-[#07070a] text-white">

            <div className="shrink-0">
                <Sidebar
                    currentSection={section}
                    onChangeSection={setsection}
                />
            </div>

            <main className="flex-1 min-w-0 min-h-screen bg-[#07070a]">
                {renderSection()}
            </main>

        </div>
    )
}

export default ManagerDashboard