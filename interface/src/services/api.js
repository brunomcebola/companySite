import axios from 'axios';

//criação da ligação a base de dados
const api = axios.create({ baseURL: 'http://localhost:3001/'});

export default api;