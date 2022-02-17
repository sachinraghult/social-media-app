import axios from 'axios';

const instance = axios.create({
    // local API endpoint
    baseURL: 'http://localhost:5000/api/'
})

export default instance;