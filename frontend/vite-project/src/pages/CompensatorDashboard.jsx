import React, { useState } from 'react'
import CompensatorProfile from '../components/compensator/Profile/CompensatorProfile'
import OtherRequest from '../components/compensator/OtherRequest/OtherRequest'
import Sidebar from '../components/compensator/Sidebar'

const CompensatorDashboard = () => {

    const [section, setsection] = useState('Approval Request')

    const renderSection = () => {
        switch (section) {
            case 'Approval Request':
                return <OtherRequest />

            case 'Profile':
                return <CompensatorProfile />

            default:
                return <OtherRequest />
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
                <div className="min-h-screen p-6 md:p-8 lg:p-10">
                    {renderSection()}
                </div>
            </main>

        </div>
    )
}

export default CompensatorDashboard