import { useEffect, useState } from 'react';
import axios from '../api/axios';

function CaretakerDashboard() {
  const [allMeds, setAllMeds] = useState([]);

  useEffect(() => {
    const fetchAllMeds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/medications/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllMeds(res.data);
      } catch (err) {
        alert('Failed to fetch medications');
      }
    };
    fetchAllMeds();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Patients' Medications</h2>
      {allMeds.length === 0 ? (
        <p>No medications found</p>
      ) : (
        allMeds.map(med => (
          <div
            key={med.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginBottom: 10,
              padding: 10,
              background: '#fff',
            }}
          >
            <strong>Patient:</strong> {med.username} <br />
            <strong>Medication:</strong> {med.name} | {med.dosage} | {med.frequency} <br />
            <strong>Status:</strong>{' '}
            {med.taken_today ? <span style={{ color: 'green' }}>✔ Taken</span> : 'Not taken'}
          </div>
        ))
      )}
    </div>
  );
}

export default CaretakerDashboard;