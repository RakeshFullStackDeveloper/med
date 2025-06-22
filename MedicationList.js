function MedicationList({ medications, markAsTaken }) {
  return (
    <div>
      <h3>Your Medications</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
  {medications.map(med => (
    <li
      key={med.id}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      <strong>{med.name}</strong> - {med.dosage} - {med.frequency}
      {med.taken_today ? (
        <span style={{ color: 'green', marginLeft: '10px' }}>✔ Taken</span>
      ) : (
        <button onClick={() => markAsTaken(med.id)} style={{ marginLeft: '10px' }}>
          Mark as Taken
        </button>
      )}
    </li>
  ))}
</ul>
    </div>
  );
}

export default MedicationList;