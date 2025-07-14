// src/components/service-center/ServiceCenterDetails.jsx
import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import AddMechanicForm from "./AddMechanicForm";
import AddServiceTypeForm from "../service-center/service-types/AddServiceTypeForm";
import ServiceTypeList from "../service-center/service-types/ServiceTypeList"; // Ensure this is imported for displaying list

const ServiceCenterDetails = ({ serviceCenterId, onClose }) => {
  const [serviceCenter, setServiceCenter] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceTypeRefreshKey, setServiceTypeRefreshKey] = useState(0);
  const [mechanicRefreshKey, setMechanicRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const [showAddMechanicForm, setShowAddMechanicForm] = useState(false);
  const [showAddServiceTypeForm, setShowAddServiceTypeForm] = useState(false);

  const fetchServiceCenterDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const centerResponse = await api.get(
        `/service-centers/${serviceCenterId}`
      );
      setServiceCenter(centerResponse.data);

      const mechanicsResponse = await api.get(
        `/service-centers/${serviceCenterId}/mechanics`
      );
      setMechanics(mechanicsResponse.data);
    } catch (err) {
      console.error("Error fetching service center details:", err);
      if (err.response && err.response.status === 401) {
        setError("Authentication required to view details. Please log in.");
      } else {
        setError("Failed to load service center details.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceCenterId) {
      fetchServiceCenterDetails();
    }
  }, [serviceCenterId, mechanicRefreshKey]);

  const handleMechanicAdded = () => {
    setMechanicRefreshKey((prevKey) => prevKey + 1);
    setShowAddMechanicForm(false);
  };

  const handleServiceTypeAdded = () => {
    setServiceTypeRefreshKey((prevKey) => prevKey + 1);
    setShowAddServiceTypeForm(false);
  };

  if (loading)
    return (
      <p className="text-center text-gray-600">
        Loading service center details...
      </p>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!serviceCenter)
    return (
      <p className="text-center text-gray-600">No service center selected.</p>
    );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-blue-200">
          <h2 className="text-2xl font-bold text-blue-700">
            Managing: {serviceCenter.name}
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
          >
            Close
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto pr-2">
          {/* Service Center Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              Information
            </h3>
            <p className="text-gray-700">
              <strong>Location:</strong> {serviceCenter.location}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong> {serviceCenter.contact}
            </p>
          </div>

          {/* Service Types Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-blue-700">
                Service Types
              </h3>
              {!showAddServiceTypeForm ? (
                <button
                  onClick={() => setShowAddServiceTypeForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                >
                  Add Service Type
                </button>
              ) : (
                <button
                  onClick={() => setShowAddServiceTypeForm(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 ease-in-out"
                >
                  Close Form
                </button>
              )}
            </div>
            {showAddServiceTypeForm && (
              <div className="mt-4 mb-6">
                <AddServiceTypeForm
                  onServiceTypeAdded={handleServiceTypeAdded}
                  serviceCenterId={serviceCenter.id}
                />
              </div>
            )}
            <ServiceTypeList
              refreshTrigger={serviceTypeRefreshKey}
              serviceCenterId={serviceCenter.id}
            />
          </div>

          {/* Mechanics Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-blue-700">Mechanics</h3>
              {!showAddMechanicForm ? (
                <button
                  onClick={() => setShowAddMechanicForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out"
                >
                  Add Mechanic
                </button>
              ) : (
                <button
                  onClick={() => setShowAddMechanicForm(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 ease-in-out"
                >
                  Close Form
                </button>
              )}
            </div>
            {showAddMechanicForm && (
              <div className="mt-4 mb-6">
                <AddMechanicForm
                  serviceCenterId={serviceCenter.id}
                  onMechanicAdded={handleMechanicAdded}
                />
              </div>
            )}
            {mechanics.length === 0 ? (
              <p className="text-gray-600">
                No mechanics found for this service center.
              </p>
            ) : (
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-3 text-left font-medium">Name</th>
                    <th className="px-6 py-3 text-left font-medium">
                      Expertise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mechanics.map((mechanic, index) => (
                    <tr
                      key={mechanic.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-200 transition-colors`}
                    >
                      <td className="px-6 py-4 text-gray-800">
                        {mechanic.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {mechanic.expertise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterDetails;
