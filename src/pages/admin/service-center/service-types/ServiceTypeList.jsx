// src/components/service-center/service-types/ServiceTypeList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../../api/axios';

const ServiceTypeList = ({ refreshTrigger }) => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServiceTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/service-centers/service-types'); // Your backend endpoint
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
  }, [refreshTrigger]);

  if (loading) return <p>Loading service types...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Service Types</h2>
      {serviceTypes.length === 0 ? (
        <p>No service types found.</p>
      ) : (
        <ul className="space-y-3">
          {serviceTypes.map((type) => (
            <li key={type.id} className="border p-4 rounded-md">
              <p className="font-medium">{type.description}</p> {/* Display description */}
              <p className="text-sm text-gray-600">Price: ${type.price ? type.price.toFixed(2) : 'N/A'}</p> {/* Display price */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceTypeList;
