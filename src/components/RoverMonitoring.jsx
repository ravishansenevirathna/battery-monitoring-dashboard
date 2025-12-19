import React, { useState, useEffect, useMemo } from 'react';
import { Navigation, Battery, MapPin, Clock, Gauge, Thermometer, Activity, AlertTriangle } from 'lucide-react';
import SectionHeader from './SectionHeader';
import RoverBatteryGraphs from './RoverBatteryGraphs';
import './RoverMonitoring.css';

const RoverMonitoring = () => {
  const [roverData, setRoverData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data generator for rovers
  useEffect(() => {
    const generateRoverData = () => {
      const statuses = ['active', 'idle', 'charging', 'maintenance'];
      const locations = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Charging Bay'];

      return Array.from({ length: 12 }, (_, i) => ({
        id: `ROV-${String(i + 1).padStart(3, '0')}`,
        name: `Rover ${i + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        batteryLevel: Math.floor(Math.random() * 100),
        location: locations[Math.floor(Math.random() * locations.length)],
        speed: Math.floor(Math.random() * 50),
        temperature: (20 + Math.random() * 15).toFixed(1),
        distance: (Math.random() * 500).toFixed(1),
        lastUpdate: new Date(Date.now() - Math.random() * 300000),
        missionStatus: Math.random() > 0.3 ? 'Operational' : 'Warning',
      }));
    };

    setRoverData(generateRoverData());

    // Update data every 5 seconds
    const interval = setInterval(() => {
      setRoverData(prevData =>
        prevData.map(rover => ({
          ...rover,
          batteryLevel: Math.max(0, Math.min(100, rover.batteryLevel + (Math.random() - 0.5) * 5)),
          speed: Math.max(0, Math.floor(Math.random() * 50)),
          temperature: (20 + Math.random() * 15).toFixed(1),
          lastUpdate: new Date(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortableData = [...roverData];

    if (filterStatus !== 'all') {
      sortableData = sortableData.filter(rover => rover.status === filterStatus);
    }

    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableData;
  }, [roverData, sortConfig, filterStatus]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'idle': return '#f59e0b';
      case 'charging': return '#3b82f6';
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getBatteryColor = (level) => {
    if (level > 60) return '#10b981';
    if (level > 30) return '#f59e0b';
    return '#ef4444';
  };

  // Calculate active rovers count
  const activeRoversCount = useMemo(() => {
    return roverData.filter(r => r.status === 'active').length;
  }, [roverData]);

  return (
    <div className="rover-monitoring">
      <SectionHeader
        icon={Navigation}
        title="Rover Monitoring Overview"
        description="Real-time autonomous rover tracking and fleet management system"
        badge={roverData.length > 0 ? `${activeRoversCount}/${roverData.length} Active` : 'Loading...'}
        badgeColor="#10b981"
        iconColor="#10b981"
      />

      <RoverBatteryGraphs roverData={roverData} />

      <div className="rover-header">
        {/* Filter Buttons */}
        <div className="rover-filters">
          <button
            className={filterStatus === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('all')}
          >
            All Rovers
          </button>
          <button
            className={filterStatus === 'active' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </button>
          <button
            className={filterStatus === 'charging' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('charging')}
          >
            Charging
          </button>
          <button
            className={filterStatus === 'idle' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('idle')}
          >
            Idle
          </button>
          <button
            className={filterStatus === 'maintenance' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilterStatus('maintenance')}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Rover Statistics Cards */}
      <div className="rover-stats">
        <div className="stat-card">
          <Activity className="stat-icon" style={{ color: '#10b981' }} />
          <div className="stat-info">
            <span className="stat-label">Active Rovers</span>
            <span className="stat-value">
              {roverData.filter(r => r.status === 'active').length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <Battery className="stat-icon" style={{ color: '#3b82f6' }} />
          <div className="stat-info">
            <span className="stat-label">Charging</span>
            <span className="stat-value">
              {roverData.filter(r => r.status === 'charging').length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <Gauge className="stat-icon" style={{ color: '#f59e0b' }} />
          <div className="stat-info">
            <span className="stat-label">Idle</span>
            <span className="stat-value">
              {roverData.filter(r => r.status === 'idle').length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <AlertTriangle className="stat-icon" style={{ color: '#ef4444' }} />
          <div className="stat-info">
            <span className="stat-label">Maintenance</span>
            <span className="stat-value">
              {roverData.filter(r => r.status === 'maintenance').length}
            </span>
          </div>
        </div>
      </div>

      {/* Rover Data Table */}
      <div className="rover-table-container">
        <table className="rover-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')}>
                Rover ID
                {sortConfig.key === 'id' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('name')}>
                Name
                {sortConfig.key === 'name' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('status')}>
                Status
                {sortConfig.key === 'status' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('batteryLevel')}>
                Battery
                {sortConfig.key === 'batteryLevel' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('location')}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Location
                {sortConfig.key === 'location' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('speed')}>
                <Gauge size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Speed (km/h)
                {sortConfig.key === 'speed' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('temperature')}>
                <Thermometer size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Temp (°C)
                {sortConfig.key === 'temperature' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th onClick={() => requestSort('distance')}>
                Distance (km)
                {sortConfig.key === 'distance' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
              <th>Mission</th>
              <th onClick={() => requestSort('lastUpdate')}>
                <Clock size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Last Update
                {sortConfig.key === 'lastUpdate' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((rover) => (
              <tr key={rover.id} className="rover-row">
                <td className="rover-id">{rover.id}</td>
                <td>{rover.name}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(rover.status) }}
                  >
                    {rover.status}
                  </span>
                </td>
                <td>
                  <div className="battery-cell">
                    <div className="battery-bar-container">
                      <div
                        className="battery-bar-fill"
                        style={{
                          width: `${rover.batteryLevel}%`,
                          backgroundColor: getBatteryColor(rover.batteryLevel),
                        }}
                      />
                    </div>
                    <span style={{ color: getBatteryColor(rover.batteryLevel) }}>
                      {rover.batteryLevel.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td>{rover.location}</td>
                <td>{rover.speed}</td>
                <td>{rover.temperature}</td>
                <td>{rover.distance}</td>
                <td>
                  <span className={`mission-status ${rover.missionStatus.toLowerCase()}`}>
                    {rover.missionStatus}
                  </span>
                </td>
                <td className="last-update-cell">
                  {rover.lastUpdate.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoverMonitoring;
