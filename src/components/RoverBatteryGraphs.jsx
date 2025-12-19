import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Battery, Thermometer, TrendingDown, Gauge } from 'lucide-react';
import './RoverBatteryGraphs.css';

const RoverBatteryGraphs = React.memo(({ roverData = [] }) => {
  const [selectedRoverId, setSelectedRoverId] = useState('');
  const [historicalBuffer, setHistoricalBuffer] = useState([]);
  const previousDataRef = useRef(null);
  const BUFFER_SIZE = 24; // Keep last 24 data points (~2 minutes at 5-second intervals)

  // Initialize selected rover (first active or first rover)
  useEffect(() => {
    if (roverData.length > 0 && !selectedRoverId) {
      const firstActive = roverData.find(r => r.status === 'active');
      const defaultRover = firstActive || roverData[0];
      setSelectedRoverId(defaultRover.id);
    }
  }, [roverData, selectedRoverId]);

  // Update historical buffer when rover data changes
  useEffect(() => {
    if (!selectedRoverId || roverData.length === 0) return;

    const selectedRover = roverData.find(r => r.id === selectedRoverId);
    if (!selectedRover) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Calculate drain rate (% per minute)
    let drainRate = 0;
    if (previousDataRef.current && previousDataRef.current.id === selectedRoverId) {
      const timeDelta = now - previousDataRef.current.timestamp;
      const batteryDelta = previousDataRef.current.battery - selectedRover.batteryLevel;
      drainRate = (batteryDelta / (timeDelta / 60000)); // % per minute
    }

    const newDataPoint = {
      timestamp: now.getTime(),
      time: timeString,
      battery: parseFloat(selectedRover.batteryLevel.toFixed(1)),
      temperature: parseFloat(selectedRover.temperature),
      speed: parseFloat(selectedRover.speed),
      drainRate: parseFloat(drainRate.toFixed(2))
    };

    // Update buffer with circular array logic (keep last BUFFER_SIZE points)
    setHistoricalBuffer(prevBuffer => {
      const newBuffer = [...prevBuffer, newDataPoint];
      return newBuffer.slice(-BUFFER_SIZE);
    });

    // Store current data for next drain rate calculation
    previousDataRef.current = {
      id: selectedRoverId,
      timestamp: now,
      battery: selectedRover.batteryLevel
    };
  }, [roverData, selectedRoverId]);

  // Clear buffer when rover selection changes
  const handleRoverChange = (event) => {
    setSelectedRoverId(event.target.value);
    setHistoricalBuffer([]);
    previousDataRef.current = null;
  };

  // Get currently selected rover
  const selectedRover = useMemo(() => {
    return roverData.find(r => r.id === selectedRoverId);
  }, [roverData, selectedRoverId]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip} className="custom-tooltip">
          <p style={styles.tooltipLabel} className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{...styles.tooltipValue, color: entry.color}} className="tooltip-value">
              <span className="tooltip-dot" style={{background: entry.color}}></span>
              {entry.name}: <strong>{entry.value}</strong> {entry.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (roverData.length === 0) {
    return (
      <div className="rover-battery-graphs-container">
        <div className="loading-message">Loading rover data...</div>
      </div>
    );
  }

  return (
    <div className="rover-battery-graphs-container">
      {/* Rover Selector */}
      <div className="rover-selector-section">
        <label htmlFor="rover-select" className="rover-selector-label">
          <Gauge size={20} />
          Select Rover to Monitor:
        </label>
        <select
          id="rover-select"
          value={selectedRoverId}
          onChange={handleRoverChange}
          className="rover-selector"
        >
          {roverData.map(rover => (
            <option key={rover.id} value={rover.id}>
              {rover.id} - {rover.name} ({rover.status})
            </option>
          ))}
        </select>
        {selectedRover && (
          <div className="rover-info-badge">
            Battery: {selectedRover.batteryLevel.toFixed(1)}% |
            Temp: {selectedRover.temperature}°C
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div style={styles.chartsGrid} className="charts-grid">

        {/* Battery Level Chart */}
        <div style={styles.chartCard} className="chart-card chart-battery">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#dcfce7'}}>
                <Battery size={24} color="#10b981" />
              </div>
              <h3 style={styles.cardTitle}>Battery Level</h3>
            </div>
            <div style={{...styles.badge, background: '#dcfce7', color: '#059669'}}>
              {selectedRover ? `${selectedRover.batteryLevel.toFixed(1)}%` : '--'}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={historicalBuffer} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="chart-grid" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  label={{ value: 'Battery (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="battery"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorBattery)"
                  name="Battery"
                  unit="%"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Chart */}
        <div style={styles.chartCard} className="chart-card chart-temperature">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#fee2e2'}}>
                <Thermometer size={24} color="#ef4444" />
              </div>
              <h3 style={styles.cardTitle}>Temperature</h3>
            </div>
            <div style={{...styles.badge, background: '#fee2e2', color: '#dc2626'}}>
              {selectedRover ? `${selectedRover.temperature}°C` : '--'}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={historicalBuffer} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  domain={[0, 60]}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="url(#colorTemperature)"
                  name="Temperature"
                  unit="°C"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Battery Drain Rate Chart */}
        <div style={styles.chartCard} className="chart-card chart-drain">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#f3e8ff'}}>
                <TrendingDown size={24} color="#8b5cf6" />
              </div>
              <h3 style={styles.cardTitle}>Battery Drain Rate</h3>
            </div>
            <div style={{...styles.badge, background: '#f3e8ff', color: '#7c3aed'}}>
              {historicalBuffer.length > 0 ?
                `${historicalBuffer[historicalBuffer.length - 1].drainRate.toFixed(2)}%/min` :
                '--'
              }
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={historicalBuffer} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  domain={[-5, 5]}
                  label={{ value: 'Drain Rate (%/min)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="drainRate"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                  name="Drain Rate"
                  unit="%/min"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed vs Battery Chart */}
        <div style={styles.chartCard} className="chart-card chart-speed">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#dbeafe'}}>
                <Gauge size={24} color="#3b82f6" />
              </div>
              <h3 style={styles.cardTitle}>Speed vs Battery</h3>
            </div>
            <div style={{...styles.badge, background: '#dbeafe', color: '#1d4ed8'}}>
              {selectedRover ? `${selectedRover.speed} km/h` : '--'}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={historicalBuffer} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  stroke="#3b82f6"
                  tick={{ fontSize: 12 }}
                  domain={[0, 50]}
                  label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10b981"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  label={{ value: 'Battery (%)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="speed"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  name="Speed"
                  unit=" km/h"
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="battery"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Battery"
                  unit="%"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
});

const styles = {
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  chartCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    padding: '24px',
    transition: 'all 0.3s ease',
    minHeight: '380px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexShrink: 0,
  },
  chartWrapper: {
    flex: 1,
    minHeight: '280px',
    display: 'flex',
    alignItems: 'center',
  },
  cardTitleSection: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
  },
  badge: {
    padding: '6px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
  },
  tooltip: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  tooltipLabel: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '600',
  },
  tooltipValue: {
    margin: '4px 0',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default RoverBatteryGraphs;
