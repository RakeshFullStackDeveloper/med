import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDashboard from './PatientDashboard';
import CaretakerDashboard from './CaretakerDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !user) {
      navigate('/');
    }
  }, [navigate, token, user]);

  if (!user) return null;

  if (user.role === 'patient') {
    return <PatientDashboard />;
  } else if (user.role === 'caretaker') {
    return <CaretakerDashboard />;
  } else {
    return <h3>Unknown role</h3>;
  }
}

export default Dashboard;