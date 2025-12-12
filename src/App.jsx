import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BatteryMonitoring from './components/BatteryMonitoring';
import RoverMonitoring from './components/RoverMonitoring';
import './App.css';

function App() {
  const [connected, setConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Background images array - memoized to prevent recreation
  const backgroundImages = useMemo(() => [
    '/images/h-co-It1LgT8CM4w-unsplash.jpg'
  ], []);

  // Update connection status and timestamp
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setLastUpdate(new Date());
      setConnected(true);
    }, 2000);

    return () => clearInterval(updateInterval);
  }, []);

  // Rotate background images every 10 seconds
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000);

    return () => clearInterval(bgInterval);
  }, [backgroundImages.length]);

  // Memoize background style to prevent unnecessary recalculations
  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
  }), [backgroundImages, currentBgIndex]);

  return (
    <Router>
      <div className="App">
        {/* Dynamic Background with Overlay */}
        <div className="background-container" style={backgroundStyle}>
          <div className="background-overlay"></div>
        </div>

        {/* Content */}
        <div className="app-content">
          {/* Navigation Bar */}
          <Navbar connected={connected} lastUpdate={lastUpdate} />

          {/* Routes */}
          <Routes>
            <Route path="/" element={<BatteryMonitoring />} />
            <Route path="/rover-monitoring" element={<RoverMonitoring />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
