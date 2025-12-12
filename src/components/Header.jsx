import React from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import './Header.css';

const Header = React.memo(({ connected, lastUpdate }) => {
  return (
    <header style={styles.header} className="enhanced-header">
      <div style={styles.headerLeft}>
        <div className="logo-container">
          <Activity size={32} color="#ffffffff" className="logo-icon" />
        </div>
        <div>
          <h1 style={styles.title}>Battery Charging Station Monitor</h1>
          <p style={styles.subtitle}>Automated Battery Swapping System</p>
        </div>
      </div>

      <div style={styles.headerRight}>
        <div style={styles.connectionStatus} className={connected ? 'status-connected' : 'status-disconnected'}>
          {connected ? (
            <>
              <div className="pulse-indicator pulse-active" />
              <div className="wifi-icon-wrapper">
                <Wifi size={24} color="#ffffff" className="status-icon wifi-icon-connected" strokeWidth={2.5} />
              </div>
              <span style={{...styles.statusText, color: '#ffffff'}}>Connected</span>
            </>
          ) : (
            <>
              <div className="pulse-indicator pulse-inactive" />
              <WifiOff size={24} color="#ffffff" className="status-icon wifi-icon-disconnected" strokeWidth={2.5} />
              <span style={{...styles.statusText, color: '#ffffff'}}>Disconnected</span>
            </>
          )}
        </div>
        <div style={styles.timestamp} className="timestamp-container">
          <span style={styles.timestampLabel}>Last Update:</span>
          <span style={styles.timestampValue} className="timestamp-value-animated">
            {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '--:--:--'}
          </span>
        </div>
      </div>
    </header>
  );
});

const styles = {
  header: {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(5, 150, 105, 0.4)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
  },
  subtitle: {
    margin: '5px 0 0 0',
    fontSize: '14px',
    opacity: 0.9,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    padding: '10px 20px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  statusText: {
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  timestamp: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  timestampLabel: {
    fontSize: '12px',
    opacity: 0.8,
  },
  timestampValue: {
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
};

Header.displayName = 'Header';

export default Header;