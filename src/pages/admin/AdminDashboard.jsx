// src/pages/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import ServiceCenterList from "./service-center/ServiceCenterList";
import ServiceCenterForm from "./service-center/ServiceCenterForm";
import AdminCreateBookingForm from './booking/AdminCreateBookingForm'; // Added import for booking form
import AdminBookingList from './booking/AdminBookingList';             // Added import for booking list

const AdminDashboard = () => {
  // State to trigger re-fetching data when a new item is added
  const [serviceCenterRefreshKey, setServiceCenterRefreshKey] = useState(0);
  const [adminBookingRefreshKey, setAdminBookingRefreshKey] = useState(0); // Added state for booking refresh

  const handleServiceCenterAdded = () => {
    setServiceCenterRefreshKey(prevKey => prevKey + 1); // Increment key to trigger re-fetch
  };

  const handleAdminBookingCreated = () => { // Added handler for booking creation
    setAdminBookingRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="p-5 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Welcome, admin! You can manage service centers, mechanics, and services here.</p>

      {/* Service Center Management Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Service Center & Related Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Service Center Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <ServiceCenterForm onServiceCenterAdded={handleServiceCenterAdded} />
          </div>
          {/* Service Center List (which also handles details, mechanics, service types) */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <ServiceCenterList refreshTrigger={serviceCenterRefreshKey} />
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-400" /> {/* Separator */}

      {/* Booking Management Section (Admin) */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">All Bookings Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Booking Form (for Admin) */}
          {/* <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <AdminCreateBookingForm onBookingCreated={handleAdminBookingCreated} />
          </div> */}
          {/* Admin Booking List */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <AdminBookingList refreshTrigger={adminBookingRefreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
