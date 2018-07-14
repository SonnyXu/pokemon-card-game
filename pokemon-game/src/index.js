import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Game from './Game.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();
