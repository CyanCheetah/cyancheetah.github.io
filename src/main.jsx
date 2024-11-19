/**
 * @author Sai Tanuj Karavadi
 * @date 11/19/2024
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Use HashRouter instead of BrowserRouter
import './App.css';
import Home from './Home';
import ShowDetails from './ShowDetails.jsx';
import Profile from './Profile.jsx';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

// Rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
