import axios from 'axios';

// Configuration object to hold the base URL
const config = {
    // baseURL: 'https://wnh5c088-8000.asse.devtunnels.ms',
    // baseURL: 'https://g2hsmmkf-8000.asse.devtunnels.ms'
    baseURL: 'http://192.168.1.14:8000'
    // baseURL: 'http://localhost:8000' // default value
};

const instance = axios.create({
    baseURL: config.baseURL
});

export default instance;
export const backLink = config.baseURL;