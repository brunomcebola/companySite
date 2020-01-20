import React from 'react';
import Routes from './routes';

import settings from './config'

import './styles.scss';


document.title = settings.title

const App = () => (
  <div className="App">
    <Routes />
  </div>
);

export default App;