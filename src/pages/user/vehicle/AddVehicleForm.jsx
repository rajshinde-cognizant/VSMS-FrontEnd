import { useState } from 'react';
import api from '../../../api/axios';
 
const AddVehicleForm = ({ onAdd }) => {
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    regYear: '',
    registrationNumber: ''
  });
 
  const handleChange = (e) => {
setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
await api.post('/vehicles', vehicle);
      alert("Vehicle added!");
      setVehicle({ make: '', model: '', regYear: '', registrationNumber: '' });
      onAdd(); // refresh list
    } catch (err) {
      console.error("Add failed", err);
    }
  };
 
  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-gray-100 p-4 rounded">
      <div className="grid grid-cols-2 gap-2">
        <input name="make" value={vehicle.make} onChange={handleChange} required placeholder="Make" className="p-2 border rounded" />
        <input name="model" value={vehicle.model} onChange={handleChange} required placeholder="Model" className="p-2 border rounded" />
        <input name="regYear" value={vehicle.regYear} onChange={handleChange} required placeholder="regYear" type="number" className="p-2 border rounded" />
        <input name="registrationNumber" value={vehicle.registrationNumber} onChange={handleChange} required placeholder="Plate No" className="p-2 border rounded" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Vehicle
      </button>
    </form>
  );
};
 
export default AddVehicleForm;