// Complete React.js Codebase for Medication Management System (Phase 1)
// Directory structure suggestion:
// - src/
//   - components/
//   - pages/
//   - services/
//   - hooks/
//   - App.js
//   - index.js

// For this response, we'll implement core Phase 1 (User Auth, Medication CRUD, One Dashboard)
// CSS will be embedded using modules or simple .css imports

// 1. index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>,
  document.getElementById('root')
);

// 2. App.js
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard">
        {isLoggedIn ? <Dashboard /> : <Redirect to="/login" />}
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};

export default App;

// 3. hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return { isLoggedIn };
};

// 4. services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const loginUser = (data) => api.post('/auth/login', data);
export const signupUser = (data) => api.post('/auth/signup', data);
export const getMedications = () => api.get('/medications');
export const addMedication = (data) => api.post('/medications', data);
export const markMedication = (id) => api.put(`/medications/${id}/mark`);

// 5. pages/Login.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../services/api';
import './Form.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      history.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

// 6. pages/Signup.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { signupUser } from '../services/api';
import './Form.css';

const Signup = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'patient' });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(form);
      history.push('/login');
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="patient">Patient</option>
        <option value="caretaker">Caretaker</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Signup;

// 7. pages/Dashboard.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getMedications, addMedication, markMedication } from '../services/api';

const Dashboard = () => {
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '' });
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery('medications', getMedications);

  const addMutation = useMutation(addMedication, {
    onSuccess: () => queryClient.invalidateQueries('medications'),
  });

  const markMutation = useMutation(markMedication, {
    onSuccess: () => queryClient.invalidateQueries('medications'),
  });

  const handleAdd = (e) => {
    e.preventDefault();
    addMutation.mutate(form);
    setForm({ name: '', dosage: '', frequency: '' });
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <form onSubmit={handleAdd}>
        <input name="name" placeholder="Medication Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input name="dosage" placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} required />
        <input name="frequency" placeholder="Frequency" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} required />
        <button type="submit">Add</button>
      </form>

      {isLoading ? <p>Loading...</p> : (
        <ul>
          {data?.data?.map((med) => (
            <li key={med.id}>
              {med.name} - {med.dosage} - {med.frequency}
              <button onClick={() => markMutation.mutate(med.id)}>Mark Taken</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;

// 8. Form.css (for login/signup)
.form {
  width: 300px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 6px;
}

.form input, .form select {
  padding: 8px;
  border: 1px solid #999;
  border-radius: 4px;
}

.form button {
  background-color: teal;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.form .error {
  color: red;
  font-size: 0.9rem;
}

/* Backend + README instructions will be shared separately */
