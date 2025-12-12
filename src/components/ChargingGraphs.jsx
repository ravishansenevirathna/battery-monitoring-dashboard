import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Zap, Thermometer, Activity, BatteryCharging } from 'lucide-react';
import { generateHistoricalData } from '../services/mockData';
import './ChargingGraphs.css';

const ChargingGraphs = React.memo(({ selectedSlot = 1, timeRange = 30 }) => {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    // Load initial historical data
    const data = generateHistoricalData(selectedSlot, timeRange);
    setHistoricalData(data);

    // Simulate real-time updates - reduced frequency from 1s to 3s for better performance
    const interval = setInterval(() => {
      const newData = generateHistoricalData(selectedSlot, timeRange);
      setHistoricalData(newData);
    }, 3000); // Update every 3 seconds instead of 1 second

    return () => clearInterval(interval);
  }, [selectedSlot, timeRange]);

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

  return (
    <div className="charging-graphs-container">
      <div style={styles.chartsGrid} className="charts-grid">
        {/* Voltage vs Time Card */}
        <div style={styles.chartCard} className="chart-card chart-voltage">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#dcfce7'}}>
                <Zap size={24} color="#059669" />
              </div>
              <h3 style={styles.cardTitle}>Voltage</h3>
            </div>
            <div style={{...styles.badge, background: '#dcfce7', color: '#059669'}}>
              Slot {selectedSlot}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
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
                  domain={[10, 13]}
                  label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  stroke="#059669"
                  strokeWidth={3}
                  fill="url(#colorVoltage)"
                  name="Voltage"
                  unit="V"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current vs Time Card */}
        <div style={styles.chartCard} className="chart-card chart-current">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#d1fae5'}}>
                <Activity size={24} color="#10b981" />
              </div>
              <h3 style={styles.cardTitle}>Current</h3>
            </div>
            <div style={{...styles.badge, background: '#d1fae5', color: '#10b981'}}>
              Slot {selectedSlot}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  domain={[0, 10]}
                  label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  name="Current"
                  unit="A"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SoC vs Time Card */}
        <div style={styles.chartCard} className="chart-card chart-soc">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#a7f3d0'}}>
                <BatteryCharging size={24} color="#34d399" />
              </div>
              <h3 style={styles.cardTitle}>State of Charge</h3>
            </div>
            <div style={{...styles.badge, background: '#a7f3d0', color: '#047857'}}>
              Slot {selectedSlot}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  domain={[0, 100]}
                  label={{ value: 'SoC (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="soc"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={false}
                  name="SoC"
                  unit="%"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature vs Time Card */}
        <div style={styles.chartCard} className="chart-card chart-temperature">
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleSection}>
              <div style={{...styles.iconWrapper, background: '#fee2e2'}}>
                <Thermometer size={24} color="#ef4444" />
              </div>
              <h3 style={styles.cardTitle}>Temperature</h3>
            </div>
            <div style={{...styles.badge, background: '#fee2e2', color: '#dc2626'}}>
              Slot {selectedSlot}
            </div>
          </div>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  domain={[20, 50]}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature"
                  unit="°C"
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
    cursor: 'pointer',
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

export default ChargingGraphs;