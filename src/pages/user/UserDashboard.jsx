// src/pages/user/UserDashboard.jsx
import React, { useState, useContext, useEffect } from "react";
import UserProfile from "../user/UserProfile";
import BookingServiceForm from "./booking/BookingServiceForm";
import BookingList from "./booking/BookingList";
import AddVehicleForm from "./vehicle/AddVehicleForm";
import VehicleList from "./vehicle/VehicleList";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import api from "../../api/axios"; // Import the axios instance

// New DashboardOverview Component
// Now fetches and displays dynamic user statistics
const DashboardOverview = ({ user, setActiveSection }) => {
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      setLoadingStats(true);
      setStatsError("");
      if (!user || !user.id) {
        setStatsError("User not logged in to fetch stats.");
        setLoadingStats(false);
        return;
      }

      try {
        // Fetch user details
        const userResponse = await api.get(`/users/search?email=${user.id}`);
        setUserDetails(userResponse.data);
        // Fetch vehicles
        const vehiclesResponse = await api.get(
          `/vehicles/getAll?email=${user.id}`
        );
        setTotalVehicles(vehiclesResponse.data.length);
        console.log(user);
        // Fetch bookings
        const bookingsResponse = await api.get(
          `/bookings/user/search?email=${user.id}`
        );
        const allBookings = bookingsResponse.data;

        const pending = allBookings.filter(
          (booking) => booking.status === "PENDING"
        ).length;
        const completed = allBookings.filter(
          (booking) => booking.status === "COMPLETED"
        ).length;

        setPendingBookings(pending);
        setCompletedBookings(completed);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setStatsError(
          err.response?.data?.message || "Failed to load user statistics."
        );
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [user]); // Re-fetch stats if user changes

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl text-gray-800 animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">
        Welcome to Your Dashboard, {userDetails?.name || "Guest"}!
      </h2>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        User Statistics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Vehicles Registered */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Total Vehicles Registered
          </h3>
          {loadingStats ? (
            <p className="text-gray-600">Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">{statsError}</p>
          ) : (
            <p className="text-2xl font-bold text-blue-600">{totalVehicles}</p>
          )}
        </div>

        {/* Bookings Pending */}
        <div className="bg-orange-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            Bookings Pending
          </h3>
          {loadingStats ? (
            <p className="text-gray-600">Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">{statsError}</p>
          ) : (
            <p className="text-2xl font-bold text-orange-600">
              {pendingBookings}
            </p>
          )}
        </div>

        {/* Bookings Completed */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Bookings Completed
          </h3>
          {loadingStats ? (
            <p className="text-gray-600">Loading...</p>
          ) : statsError ? (
            <p className="text-red-500">{statsError}</p>
          ) : (
            <p className="text-2xl font-bold text-green-600">
              {completedBookings}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const [bookingRefreshKey, setBookingRefreshKey] = useState(0);
  const [vehicleRefreshKey, setVehicleRefreshKey] = useState(0);

  // State to manage which section is active in the sidebar
  const [activeSection, setActiveSection] = useState("dashboard"); // Default to dashboard

  const handleBookingCreated = () => {
    setBookingRefreshKey((prevKey) => prevKey + 1);
  };

  const handleVehicleAdded = () => {
    setVehicleRefreshKey((prevKey) => prevKey + 1);
  };

  // Helper function to render active content based on state
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          // Pass setActiveSection to DashboardOverview
          <DashboardOverview user={user} setActiveSection={setActiveSection} />
        );
      case "profile":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <UserProfile />
          </div>
        );
      case "vehicles":
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <AddVehicleForm onAdd={handleVehicleAdded} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <VehicleList refreshTrigger={vehicleRefreshKey} />
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <BookingServiceForm onBookingCreated={handleBookingCreated} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <BookingList refreshTrigger={bookingRefreshKey} />
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center p-8 text-gray-600">
            <p className="text-xl">
              Select a section from the sidebar to manage your account.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white p-6">
        {/* <h2 className="text-2xl font-bold mb-6 text-center">User Panel</h2> */}
        {/* Removed user details from here */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 
              ${
                activeSection === "dashboard"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-700"
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 
              ${
                activeSection === "profile"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-700"
              }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveSection("vehicles")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 
              ${
                activeSection === "vehicles"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-700"
              }`}
          >
            My Vehicles
          </button>
          <button
            onClick={() => setActiveSection("bookings")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 
              ${
                activeSection === "bookings"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-700"
              }`}
          >
            My Bookings
          </button>
          {/* Add more user specific navigation items here if needed */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">User Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Welcome, user! Use the sidebar to manage your account, vehicles, and bookings.</p> */}

        {renderContent()}
      </main>
    </div>
  );
};

export default UserDashboard;
