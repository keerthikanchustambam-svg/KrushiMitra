import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Crops from './pages/Crops';
import Weather from './pages/Weather';
import Market from './pages/Market';
import Seeds from './pages/Seeds';
import SellCrops from './pages/SellCrops';
import StartFarming from './pages/StartFarming';
import Schemes from './pages/Schemes';
import Chatbot from './components/Chatbot';

import ProtectedRoute from './components/ProtectedRoute';

import { requestNotificationPermission } from './utils/notificationHelper';

function App() {
  React.useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crops" element={<ProtectedRoute><Crops /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
        <Route path="/seeds" element={<ProtectedRoute><Seeds /></ProtectedRoute>} />
        <Route path="/sell" element={<ProtectedRoute><SellCrops /></ProtectedRoute>} />
        <Route path="/start-farming" element={<ProtectedRoute><StartFarming /></ProtectedRoute>} />
        <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;