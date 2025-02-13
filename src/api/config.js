import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.API_KEY
    }
});

export default api; 