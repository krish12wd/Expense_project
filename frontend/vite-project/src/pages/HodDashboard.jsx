import React, { useState } from "react";
import Sidebar from "../components/Hod/Sidebar";
import OtherRequest from "../components/Hod/OtherRequest/OtherRequest";
import HodProfile from "../components/Hod/Profile/Profile";

const HodDashboard = () => {
  const [section, setsection] = useState("Profile");

  const renderSection = () => {
    switch (section) {
      case "Approval Request":
        return <OtherRequest />;

      case "Profile":
        return <HodProfile />;

      default:
        return <HodProfile />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#07070a] text-white">
      
      <div className="shrink-0">
        <Sidebar
          currentSection={section}
          onChangeSection={setsection}
        />
      </div>

      <div className="flex-1 min-w-0 min-h-screen bg-[#07070a]">
        {renderSection()}
      </div>

    </div>
  );
};

export default HodDashboard;