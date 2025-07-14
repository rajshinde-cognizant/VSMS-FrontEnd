// src/components/layout/UserSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

const UserSidebar = ({ onNavigate, activeSection }) => {
  const navItems = [
    { name: 'Profile', id: 'profile', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
    )},
    { name: 'Vehicles', id: 'vehicles', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-14a2 2 0 01-2-2V5z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15v4a2 2 0 002 2h8a2 2 0 002-2v-4"></path>
      </svg>
    )},
    { name: 'Bookings', id: 'bookings', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    )},
    // Add more user-specific navigation items as needed
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-6 shadow-lg rounded-r-xl"> {/* Added rounded-r-xl, shadow-lg */}
      <div className="text-2xl font-extrabold mb-8 text-center text-blue-300"> {/* Increased font size, bolder, blue tint */}
        My Dashboard
      </div>
      <nav className="space-y-3"> {/* Increased spacing between nav items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center w-full px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200
              ${activeSection === item.id
                ? 'bg-blue-600 text-white shadow-md' // Active state
                : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive state
              }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default UserSidebar;