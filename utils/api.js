// app/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://129.151.249.132:8080',
});

export default api;
