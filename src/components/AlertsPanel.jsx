import React, { useState, useMemo } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell, X, Clock } from 'lucide-react';
import './AlertsPanel.css';

const AlertsPanel = React.memo(({ alerts = [] }) => {
  const [filter, setFilter] = useState('all'); // all, critical, warning, info, success
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Mock alerts for demo with more realistic data
  const demoAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'High Temperature Alert',
      message: 'Battery Slot 3 temperature exceeded safe threshold (45°C)',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      source: 'Temperature Monitor',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Battery Detected',
      message: 'Rover ROV-005 battery level below 20%',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: 'Rover Monitor',
    },
    {
      id: 3,
      type: 'info',
      title: 'Charging Initiated',
      message: 'Battery Slot 1 charging cycle started',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      source: 'Charging System',
    },
    {
      id: 4,
      type: 'success',
      title: 'Charging Complete',
      message: 'Battery Slot 2 fully charged and ready for deployment',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      source: 'Charging System',
    },
    {
      id: 5,
      type: 'info',
      title: 'System Update',
      message: 'Firmware update available for battery management system',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      source: 'System',
    },
  ];

  const displayAlerts = alerts.length > 0 ? alerts : demoAlerts;

  // Filter and sort alerts
  const filteredAlerts = useMemo(() => {
    return displayAlerts
      .filter(alert => !dismissedAlerts.has(alert.id))
      .filter(alert => filter === 'all' || alert.type === filter)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [displayAlerts, filter, dismissedAlerts]);

  // Count alerts by type
  const alertCounts = useMemo(() => {
    const active = displayAlerts.filter(alert => !dismissedAlerts.has(alert.id));
    return {
      total: active.length,
      critical: active.filter(a => a.type === 'critical').length,
      warning: active.filter(a => a.type === 'warning').length,
      info: active.filter(a => a.type === 'info').length,
      success: active.filter(a => a.type === 'success').length,
    };
  }, [displayAlerts, dismissedAlerts]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <XCircle size={22} />;
      case 'warning':
        return <AlertTriangle size={22} />;
      case 'info':
        return <Info size={22} />;
      case 'success':
        return <CheckCircle size={22} />;
      default:
        return <Info size={22} />;
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleClearAll = () => {
    const allAlertIds = displayAlerts.map(a => a.id);
    setDismissedAlerts(new Set(allAlertIds));
  };

  return (
    <div className="alerts-panel-container">
      {/* Header with Filters */}
      <div className="alerts-panel-header">
        <div className="alerts-header-top">
          <div className="alerts-title-section">
            <Bell className="alerts-bell-icon" size={24} />
            <div>
              <h3 className="alerts-title">System Alerts & Events</h3>
              <p className="alerts-subtitle">Real-time system notifications and status updates</p>
            </div>
          </div>
          {alertCounts.total > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear All
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="alerts-filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span>All</span>
            <span className="filter-count">{alertCounts.total}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            <span>Critical</span>
            {alertCounts.critical > 0 && (
              <span className="filter-count critical">{alertCounts.critical}</span>
            )}
          </button>
          <button
            className={`filter-tab ${filter === 'warning' ? 'active' : ''}`}
            onClick={() => setFilter('warning')}
          >
            <span>Warnings</span>
            {alertCounts.warning > 0 && (
              <span className="filter-count warning">{alertCounts.warning}</span>
            )}
          </button>
          <button
            className={`filter-tab ${filter === 'info' ? 'active' : ''}`}
            onClick={() => setFilter('info')}
          >
            <span>Info</span>
            {alertCounts.info > 0 && (
              <span className="filter-count info">{alertCounts.info}</span>
            )}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list-wrapper">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts-empty-state">
            <div className="empty-state-icon">
              <CheckCircle size={64} />
            </div>
            <h4 className="empty-state-title">
              {dismissedAlerts.size > 0 ? 'All alerts dismissed' : 'No alerts'}
            </h4>
            <p className="empty-state-message">
              {dismissedAlerts.size > 0
                ? 'You\'ve cleared all notifications. Great job staying on top of things!'
                : 'All systems are operating normally. No action required.'}
            </p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`alert-card alert-${alert.type}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`alert-icon-container alert-icon-${alert.type}`}>
                  {getAlertIcon(alert.type)}
                </div>

                <div className="alert-content">
                  <div className="alert-header-row">
                    <h4 className="alert-title">{alert.title}</h4>
                    <button
                      className="alert-dismiss-btn"
                      onClick={() => handleDismiss(alert.id)}
                      aria-label="Dismiss alert"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="alert-message">{alert.message}</p>

                  <div className="alert-footer">
                    <div className="alert-meta">
                      <Clock size={14} />
                      <span className="alert-time">{getRelativeTime(alert.timestamp)}</span>
                      <span className="alert-separator">•</span>
                      <span className="alert-source">{alert.source}</span>
                    </div>
                    <div className={`alert-type-badge alert-type-${alert.type}`}>
                      {alert.type}
                    </div>
                  </div>
                </div>

                <div className={`alert-indicator alert-indicator-${alert.type}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

AlertsPanel.displayName = 'AlertsPanel';

export default AlertsPanel;
