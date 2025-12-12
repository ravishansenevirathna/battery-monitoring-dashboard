import React from 'react';
import { Battery, BatteryCharging, BatteryFull, BatteryWarning, Zap, Thermometer, Activity } from 'lucide-react';
import './BatteryCard.css';

const BatteryCard = React.memo(({ slot, isSelected = false, onSelect }) => {
  const getStatusIcon = () => {
    if (!slot.occupied) {
      return <Battery size={32} color="#9ca3af" />;
    }
    switch (slot.charging_state) {
      case 'charging':
        return <BatteryCharging size={32} color="#f59e0b" />;
      case 'full':
        return <BatteryFull size={32} color="#10b981" />;
      case 'idle':
        return <Battery size={32} color="#3b82f6" />;
      default:
        return <BatteryWarning size={32} color="#ef4444" />;
    }
  };

  const getStatusColor = () => {
    if (!slot.occupied) return '#9ca3af';
    switch (slot.charging_state) {
      case 'charging': return '#f59e0b';
      case 'full': return '#10b981';
      case 'idle': return '#3b82f6';
      default: return '#ef4444';
    }
  };

  const getStatusText = () => {
    if (!slot.occupied) return 'Empty (In Rover)';
    switch (slot.charging_state) {
      case 'charging': return 'Charging';
      case 'full': return 'Fully Charged';
      case 'idle': return 'Idle';
      case 'discharging': return 'Discharging';
      default: return 'Unknown';
    }
  };

  const getSoCColor = (soc) => {
    if (soc >= 80) return '#10b981';
    if (soc >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(slot.slot_number);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        ...styles.card,
        borderTop: `4px solid ${getStatusColor()}`,
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected
          ? '0 12px 48px rgba(5, 150, 105, 0.4), 0 0 0 4px rgba(16, 185, 129, 0.6)'
          : '0 8px 32px rgba(0,0,0,0.2)',
      }}
      className={`battery-card ${slot.charging_state === 'charging' ? 'card-charging' : ''} ${slot.charging_state === 'full' ? 'card-full' : ''} ${isSelected ? 'card-selected' : ''}`}
    >
      <div style={styles.cardHeader}>
        <div style={styles.slotTitle}>
          <div className={`icon-wrapper ${slot.charging_state === 'charging' ? 'icon-pulse' : ''}`}>
            {getStatusIcon()}
          </div>
          <div>
            <h3 style={styles.slotNumber}>Slot {slot.slot_number}</h3>
            <p style={{...styles.status, color: getStatusColor()}} className="status-badge">
              {getStatusText()}
            </p>
          </div>
        </div>
        {slot.occupied && slot.battery_id && (
          <span style={styles.batteryId} className="battery-id-badge">{slot.battery_id}</span>
        )}
      </div>

      {slot.occupied ? (
        <>
          {/* State of Charge with Liquid Fill */}
          <div style={styles.socSection}>
            <div style={styles.socHeader}>
              <span style={styles.label}>State of Charge</span>
              <span
                style={{...styles.socValue, color: getSoCColor(parseFloat(slot.soc_percentage))}}
                className="soc-value-animated"
              >
                {slot.soc_percentage}%
              </span>
            </div>
            <div style={styles.progressBar} className="progress-bar-container">
              <div
                style={{
                  ...styles.progressFill,
                  width: `${slot.soc_percentage}%`,
                  background: getSoCColor(parseFloat(slot.soc_percentage))
                }}
                className="progress-fill-liquid"
              />
            </div>
          </div>

          {/* Metrics Grid with Enhanced Animations */}
          <div style={styles.metricsGrid}>
            <div style={styles.metric} className="metric-card metric-hover">
              <div style={styles.metricIcon} className="metric-icon-wrapper metric-voltage">
                <Zap size={20} color="#059669" />
              </div>
              <div>
                <p style={styles.metricLabel}>Voltage</p>
                <p style={styles.metricValue} className="metric-value-animated">{slot.voltage} V</p>
              </div>
            </div>

            <div style={styles.metric} className="metric-card metric-hover">
              <div style={styles.metricIcon} className="metric-icon-wrapper metric-current">
                <Activity size={20} color="#10b981" />
              </div>
              <div>
                <p style={styles.metricLabel}>Current</p>
                <p style={styles.metricValue} className="metric-value-animated">{slot.current} A</p>
              </div>
            </div>

            <div style={styles.metric} className="metric-card metric-hover">
              <div style={styles.metricIcon} className="metric-icon-wrapper metric-temperature">
                <Thermometer size={20} color="#ef4444" />
              </div>
              <div>
                <p style={styles.metricLabel}>Temperature</p>
                <p style={styles.metricValue} className="metric-value-animated">{slot.temperature} °C</p>
              </div>
            </div>

            <div style={styles.metric} className="metric-card metric-hover">
              <div style={styles.metricIcon} className="metric-icon-wrapper metric-power">
                <Zap size={20} color="#34d399" />
              </div>
              <div>
                <p style={styles.metricLabel}>Power</p>
                <p style={styles.metricValue} className="metric-value-animated">{slot.power} W</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.emptyState} className="empty-state-animated">
          <div className="empty-icon-wrapper">
            <Battery size={64} color="#d1d5db" />
          </div>
          <p style={styles.emptyText}>Battery slot is empty</p>
          <p style={styles.emptySubtext}>Battery is currently in use by the rover</p>
        </div>
      )}
    </div>
  );
});

const styles = {
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  slotTitle: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  slotNumber: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
  },
  status: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    fontWeight: '500',
  },
  batteryId: {
    background: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
  },
  socSection: {
    marginBottom: '20px',
  },
  socHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  label: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  socValue: {
    fontSize: '24px',
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: '12px',
    background: '#f3f4f6',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s ease-in-out',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  metric: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px',
  },
  metricIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280',
  },
  metricValue: {
    margin: '4px 0 0 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  emptyText: {
    margin: '16px 0 4px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6b7280',
  },
  emptySubtext: {
    margin: 0,
    fontSize: '14px',
    color: '#9ca3af',
  },
};

BatteryCard.displayName = 'BatteryCard';

export default BatteryCard;