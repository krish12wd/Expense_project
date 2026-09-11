import React, { useState } from 'react'
import CreateExpenseRequest from '../components/employee/CreateRequest/CreateExpenseRequest';
import Sidebar from '../components/employee/Sidebar';
import Expense from '../components/employee/MyExpense/Expense';
import EmpProfile from '../components/employee/Profile/EmpProfile'

const EmpDashboard = () => {

    const [section, setsection] = useState('My Expenses')

    const renderSection = () => {
        switch (section) {

            case 'My Expenses':
                return <Expense />

            case 'Create Request':
                return <CreateExpenseRequest setsection={setsection} />

            case 'Profile':
                return <EmpProfile />

            default:
                return <Expense />
        }
    }

    return (
        <div className="flex min-h-screen w-full bg-[#08080b] text-white">

            <div className="shrink-0">
                <Sidebar
                    currentSection={section}
                    onChangeSection={setsection}
                />
            </div>

            <main className="flex-1 min-w-0 min-h-screen bg-[#08080b]">
                {renderSection()}
            </main>

        </div>
    )
}

export default EmpDashboard