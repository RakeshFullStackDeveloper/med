import { useEffect, useState } from 'react';
import axios from '../api/axios';
import MedicationList from './MedicationList';

function PatientDashboard() {
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    const res = await axios.get('/medications', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMedications(res.data);
  };

  const handleAdd = async e => {
    e.preventDefault();
    await axios.post(
      '/medications',
      { name, dosage, frequency },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setName('');
    setDosage('');
    setFrequency('');
    fetchMeds();
  };

  const markAsTaken = async id => {
    await axios.put(`/medications/${id}/take`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMeds();
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <form onSubmit={handleAdd}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Dosage" required />
        <input value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="Frequency" required />
        <button type="submit">Add Medication</button>
      </form>

      <MedicationList medications={medications} markAsTaken={markAsTaken} />
    </div>
  );
}

export default PatientDashboard;