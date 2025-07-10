// src/components/service-center/ServiceCenterList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import ServiceCenterDetails from './ServiceCenterDetails';

const ServiceCenterList = ({ refreshTrigger }) => {
  const [serviceCenters, setServiceCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedServiceCenterId, setSelectedServiceCenterId] = useState(null);

  const fetchServiceCenters = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/service-centers');
      setServiceCenters(response.data);
    } catch (err) {
      console.error('Error fetching service centers:', err);
      if (err.response && err.response.status === 401) {
        setError('Authentication required to list service centers. Please log in.');
      } else {
        setError('Failed to load service centers.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCenters();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleViewDetails = (id) => {
    setSelectedServiceCenterId(id);
  };

  const handleCloseDetails = () => {
    setSelectedServiceCenterId(null);
  };

  if (loading) return <p>Loading service centers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Service Centers</h2>
      {serviceCenters.length === 0 ? (
        <p>No service centers found.</p>
      ) : (
        <ul className="space-y-3">
          {serviceCenters.map((center) => (
            <li key={center.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium">{center.name}</p>
                {/* Updated display field */}
                <p className="text-sm text-gray-600">{center.location}</p>
              </div>
              <button
                onClick={() => handleViewDetails(center.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
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
