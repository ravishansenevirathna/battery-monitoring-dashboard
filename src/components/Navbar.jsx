import React from 'react';
import { NavLink } from 'react-router-dom';
import { Battery, Navigation, Activity, Wifi } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ connected, lastUpdate }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Battery className="logo-icon" />
          <div className="logo-text">
            <h1>Battery Station Monitor</h1>
            <span className="logo-subtitle">Automated Swapping System</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <Activity size={20} />
            <span>Battery Monitoring</span>
          </NavLink>

          <NavLink
            to="/rover-monitoring"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <Navigation size={20} />
            <span>Rover Monitoring</span>
          </NavLink>
        </div>

        {/* Status Section */}
        <div className="navbar-status">
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            <Wifi size={18} />
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {lastUpdate && (
            <div className="last-update">
              <span><b>Last Update:</b> {new Date(lastUpdate).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
