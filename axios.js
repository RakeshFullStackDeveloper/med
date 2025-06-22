import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://medication-manager-blx6.onrender.com',
});

export default instance;