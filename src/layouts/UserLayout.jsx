// src/components/layout/UserLayout.jsx
import React, { useState } from 'react';
import UserSidebar from '../components/UserSideBar'; // Import the UserSidebar component

const UserLayout = ({ children }) => {
  // State to manage which section is currently active in the sidebar
  // 'profile' is set as the default active section when the user dashboard loads
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* UserSidebar component is rendered on the left */}
      {/* It receives the function to update the active section and the current active section */}
      <UserSidebar onNavigate={setActiveSection} activeSection={activeSection} />

      {/* This div represents the main content area of the user dashboard */}
      {/* It takes up all available flexible space (`flex-1`) */}
      {/* Provides consistent padding and hides horizontal overflow */}
      <div className="flex-1 p-8 overflow-x-hidden">
        {/*
          React.Children.map and React.cloneElement are used here to
          inject the 'activeSection' and 'setActiveSection' props
          directly into the 'UserDashboard' component (which will be the 'children' prop
          passed by your router in App.js).
          This allows UserDashboard to know which section to display.
        */}
        {React.Children.map(children, child =>
          React.cloneElement(child, { activeSection, setActiveSection })
        )}
      </div>
    </div>
  );
};

export default UserLayout;