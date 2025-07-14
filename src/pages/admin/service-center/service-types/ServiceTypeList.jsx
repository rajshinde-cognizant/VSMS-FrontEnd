// src/components/service-center/service-types/ServiceTypeList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../../api/axios';

const ServiceTypeList = ({ refreshTrigger, serviceCenterId }) => { // Added serviceCenterId prop
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServiceTypes = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (serviceCenterId) {
        // Fetch service types for a specific service center
        response = await api.get(`/service-centers/${serviceCenterId}/service-types`);
      } else {
        // Fallback to fetching all service types if no serviceCenterId is provided (e.g., for a global list)
        response = await api.get('/service-centers/service-types');
      }
      setServiceTypes(response.data);
    } catch (err) {
      console.error('Error fetching service types:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to list service types. Please log in.');
      } else {
        setError('Failed to load service types.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, [refreshTrigger, serviceCenterId]); // Re-fetch when refreshTrigger or serviceCenterId changes

  if (loading) return <p>Loading service types...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6">
      {/* <h2 className="text-xl font-semibold mb-4">Available Service Types</h2> */}
      {serviceTypes.length === 0 ? (
        <p>No service types found for this service center.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-6 py-3 text-left font-medium">Description</th>
              <th className="px-6 py-3 text-left font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {serviceTypes.map((type, index) => (
              <tr
                key={type.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <td className="px-6 py-4 text-gray-800">{type.description}</td>
                <td className="px-6 py-4 text-gray-600">
                  ${type.price ? type.price.toFixed(2) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceTypeList;
