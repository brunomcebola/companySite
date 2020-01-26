import axios from 'axios';

import settings from '../config'

//criação da ligação a base de dados
const api = axios.create({ baseURL: settings.api_link});

export default api;