// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import ServiceCenterList from "../../pages/admin/service-center/ServiceCenterList";
import ServiceCenterForm from "../../pages/admin/service-center/ServiceCenterForm";
import AdminBookingList from "./booking/AdminBookingList";
import api from "../../api/axios"; // Import Axios for API calls

const AdminDashboard = () => {
  const [serviceCenterRefreshKey, setServiceCenterRefreshKey] = useState(0);
  const [adminBookingRefreshKey, setAdminBookingRefreshKey] = useState(0);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAddServiceCenterForm, setShowAddServiceCenterForm] =
    useState(false);

  // State for statistics
  const [totalServiceCenters, setTotalServiceCenters] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoadingStats(true);
      setStatsError("");
      try {
        const serviceCenterResponse = await api.get("/service-centers"); // Adjust endpoint as needed
        const customerResponse = await api.get("/users/all"); // Adjust endpoint as needed
        const bookingResponse = await api.get("/bookings"); // Adjust endpoint as needed
        setTotalServiceCenters(serviceCenterResponse.data.length);
        // setActiveServiceCenters(serviceCenterResponse.data.active);
        setTotalCustomers(customerResponse.data.length);
        setBookingCount(bookingResponse.data.length);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setStatsError(
          err.response?.data?.message || "Failed to load statistics."
        );
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStatistics();
  }, [serviceCenterRefreshKey]);

  const handleServiceCenterAdded = () => {
    setServiceCenterRefreshKey((prevKey) => prevKey + 1);
    setShowAddServiceCenterForm(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Admin Dashboard
            </h1>
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Dashboard Statistics
                </h2>
                {loadingStats ? (
                  <p>Loading statistics...</p>
                ) : statsError ? (
                  <p className="text-red-500">{statsError}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-blue-700">
                        Total Service Centers
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {totalServiceCenters}
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-green-700">
                        Active Service Centers
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {totalServiceCenters}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-yellow-700">
                        Total Customers
                      </h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {totalCustomers}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-purple-700">
                        Total Bookings
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {bookingCount}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case "serviceCenters":
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Service Center Management
              </h2>
              {!showAddServiceCenterForm ? (
                <button
                  onClick={() => setShowAddServiceCenterForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                >
                  Add New Service Center
                </button>
              ) : (
                <>
                  <ServiceCenterForm
                    onServiceCenterAdded={handleServiceCenterAdded}
                  />
                  <button
                    onClick={() => setShowAddServiceCenterForm(false)}
                    className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 ease-in-out"
                  >
                    Close Form
                  </button>
                </>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <ServiceCenterList refreshTrigger={serviceCenterRefreshKey} />
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AdminBookingList refreshTrigger={adminBookingRefreshKey} />
          </div>
        );
      default:
        return (
          <div className="text-center p-8 text-gray-600">
            <p className="text-xl">
              Select a section from the sidebar to manage.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white p-6 space-y-4 shadow-lg">
        {/* <h2 className="text-2xl font-bold mb-6 text-center">Admin</h2> */}
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
            onClick={() => setActiveSection("serviceCenters")}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 
              ${
                activeSection === "serviceCenters"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "hover:bg-gray-700"
              }`}
          >
            Manage Service Centers
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
            Manage Bookings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1> */}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
