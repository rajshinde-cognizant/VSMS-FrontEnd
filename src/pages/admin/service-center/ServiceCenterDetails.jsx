// src/components/service-center/ServiceCenterDetails.jsx
import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import AddMechanicForm from "./AddMechanicForm";
import AddServiceTypeForm from "../service-center/service-types/AddServiceTypeForm";
import AddServiceTypeList from "../service-center/service-types/ServiceTypeList";
import ServiceTypeList from "../service-center/service-types/ServiceTypeList";

const ServiceCenterDetails = ({ serviceCenterId, onClose }) => {
  const [serviceCenter, setServiceCenter] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceTypeRefreshKey, setServiceTypeRefreshKey] = useState(0);
  const [error, setError] = useState("");

  const handleServiceTypeAdded = () => {
    setServiceTypeRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger re-fetch
  };

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
  }, [serviceCenterId]);

  const handleMechanicAdded = () => {
    fetchServiceCenterDetails(); // Refresh mechanics list after adding
  };

  if (loading) return <p>Loading service center details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!serviceCenter) return <p>No service center selected.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Service Center Details: {serviceCenter.name}
        </h2>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>
      {/* Updated display fields */}
      <p>
        <strong>Location:</strong> {serviceCenter.location}
      </p>
      <p>
        <strong>Contact:</strong> {serviceCenter.contact}
      </p>

      <hr className="my-4" />
      <h3 className="text-lg font-semibold mb-3">Service Types</h3>
      <ServiceTypeList refreshTrigger={serviceTypeRefreshKey} />
      <h3 className="text-lg font-semibold mb-3">Mechanics</h3>
      {mechanics.length === 0 ? (
        <p>No mechanics found for this service center.</p>
      ) : (
        <ul className="list-disc pl-5">
          {mechanics.map((mechanic) => (
            <li key={mechanic.id} className="mb-1">
              {/* Updated display field */}
              <strong>{mechanic.name}</strong> - {mechanic.expertise}
            </li>
          ))}
        </ul>
      )}

      <hr className="my-4" />

      <AddMechanicForm
        serviceCenterId={serviceCenter.id}
        onMechanicAdded={handleMechanicAdded}
      />

      <AddServiceTypeForm
        onServiceTypeAdded={handleServiceTypeAdded}
        serviceCenterId={serviceCenter.id}
      />
    </div>
  );
};

export default ServiceCenterDetails;
