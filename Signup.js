import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    try {
      await axios.post('/auth/signup', { username, password, role });
      alert('Signup successful! Please login.');
      navigate('/');
    } catch (err) {
      alert('Signup failed. Username might already exist.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="patient">Patient</option>
        <option value="caretaker">Caretaker</option>
      </select>
      <button type="submit">Signup</button>
      <p onClick={() => navigate('/')}>Already have an account? Login</p>
    </form>
  );
}

export default Signup;