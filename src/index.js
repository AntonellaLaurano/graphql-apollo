import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from './client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
       <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
