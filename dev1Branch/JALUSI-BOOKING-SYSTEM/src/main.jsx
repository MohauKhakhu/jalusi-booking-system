import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


// ********FIREBASE SETUP START********

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBtqtqnf6zScZResqpMhc-YSE8TXvlHB6M",
  authDomain: "jalusi-beauty-app.firebaseapp.com",
  projectId: "jalusi-beauty-app",
  storageBucket: "jalusi-beauty-app.firebasestorage.app",
  messagingSenderId: "454552068837",
  appId: "1:454552068837:web:b5ee0862deb757d3e46a0c"
};


const app = initializeApp(firebaseConfig);

// ********FIREBASE SETUP END********

const root = createRoot(document.getElementById('root'))


root.render(
  <React.StrictMode>
    <Router>
        <App/>
    </Router>
  </React.StrictMode>
)


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
