// src/components/service-center/ServiceCenterList.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import ServiceCenterDetails from "./ServiceCenterDetails";

const ServiceCenterList = ({ refreshTrigger }) => {
  const [serviceCenters, setServiceCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedServiceCenterId, setSelectedServiceCenterId] = useState(null);

  const fetchServiceCenters = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/service-centers");
      setServiceCenters(response.data);
    } catch (err) {
      console.error("Error fetching service centers:", err);
      if (err.response && err.response.status === 401) {
        setError(
          "Authentication required to list service centers. Please log in."
        );
      } else {
        setError("Failed to load service centers.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCenters();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleManageCenter = (id) => {
    // Renamed handler
    setSelectedServiceCenterId(id);
  };

  const handleCloseDetails = () => {
    setSelectedServiceCenterId(null);
    fetchServiceCenters(); // Refresh list after closing details (in case of updates)
  };

  if (loading) return <p>Loading service centers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Service Centers</h2>
      {serviceCenters.length === 0 ? (
        <p className="text-gray-600">No service centers found.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Location</th>
              <th className="px-6 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceCenters.map((center, index) => (
              <tr
                key={center.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="px-6 py-4 text-gray-800">{center.name}</td>
                <td className="px-6 py-4 text-gray-600">{center.location}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleManageCenter(center.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto"
                  >
                    Manage Center
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedServiceCenterId && (
        <ServiceCenterDetails
          serviceCenterId={selectedServiceCenterId}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default ServiceCenterList;
