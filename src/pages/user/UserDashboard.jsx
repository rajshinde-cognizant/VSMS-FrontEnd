// src/pages/user/UserDashboard.jsx
import React, { useState } from 'react';
import UserProfile from '../user/UserProfile';
import BookingServiceForm from './booking/BookingServiceForm'; // User-specific booking creation form
import BookingList from './booking/BookingList';             // User-specific booking list
import AddVehicleForm from './vehicle/AddVehicleForm';       // Existing component (assuming you have this)
import VehicleList from './vehicle/VehicleList';     
// import AdminCreateBookingForm from './booking/AdminCreateBookingForm';         // Existing component (assuming you have this)

const UserDashboard = () => {
  const [bookingRefreshKey, setBookingRefreshKey] = useState(0);
  const [vehicleRefreshKey, setVehicleRefreshKey] = useState(0); // Assuming you have this for vehicles
    

  const handleBookingCreated = () => {
    setBookingRefreshKey(prevKey => prevKey + 1);
  };

  const handleVehicleAdded = () => {
    setVehicleRefreshKey(prevKey => prevKey + 1);
  };

  // const handleAdminBookingCreated = () => { // Added handler for booking creation
  //   setAdminBookingRefreshKey(prevKey => prevKey + 1);
  // };

  return (
    <div className="p-5 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Welcome, user! Here you can manage your vehicles and bookings.</p>
      <UserProfile/>
      {/* Your Vehicles Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Your Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            {/* Assuming AddVehicleForm takes onVehicleAdded prop */}
            <AddVehicleForm onVehicleAdded={handleVehicleAdded} />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            {/* Assuming VehicleList takes refreshTrigger prop */}
            <VehicleList refreshTrigger={vehicleRefreshKey} />
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-400" />

      {/* Your Bookings Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Your Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <BookingServiceForm onBookingCreated={handleBookingCreated} /> {/* User booking creation form */}
            {/* <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <AdminCreateBookingForm onBookingCreated={handleAdminBookingCreated} />
          </div> */}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
             <BookingList refreshTrigger={bookingRefreshKey} /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
