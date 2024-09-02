import axios from 'axios';
import https from 'https';

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Only for local development
});

export default axiosInstance;