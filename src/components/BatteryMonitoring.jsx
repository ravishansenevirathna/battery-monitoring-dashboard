import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BatteryCard from './BatteryCard';
import ChargingGraphs from './ChargingGraphs';
import AlertsPanel from './AlertsPanel';
import SectionHeader from './SectionHeader';
import { Battery, LineChart } from 'lucide-react';
import { subscribeToLatestBatteryData } from '../services/firestoreService';
import { MockDataStream } from '../services/mockData';
import './BatteryMonitoring.css';

const BatteryMonitoring = () => {
  const [batteryData, setBatteryData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(1); // Track selected slot for graphs
  const [timeRange, setTimeRange] = useState(30); // Time range for graphs in minutes

  useEffect(() => {
    // Use Firestore for real-time data
    // To use mock data instead, set USE_MOCK_DATA to true
    const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

    if (USE_MOCK_DATA) {
      // Fallback to mock data if Firebase is not configured
      const dataStream = new MockDataStream((data) => {
        setBatteryData(data);
      });
      dataStream.start();
      return () => dataStream.stop();
    } else {
      // Subscribe to real-time Firestore data
      const unsubscribe = subscribeToLatestBatteryData(
        (data) => {
          setBatteryData(data);
        },
        (error) => {
          console.error('Firestore error, falling back to mock data:', error);
          // Fallback to mock data on error
          const dataStream = new MockDataStream((data) => {
            setBatteryData(data);
          });
          dataStream.start();
        }
      );

      // Cleanup subscription on unmount
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  // Memoize alerts to prevent unnecessary re-renders
  const alerts = useMemo(() => batteryData?.alerts || [], [batteryData?.alerts]);

  // Handler for battery card click
  const handleSlotSelect = useCallback((slotNumber) => {
    setSelectedSlot(slotNumber);
  }, []);

  // Calculate active batteries count
  const activeBatteriesCount = useMemo(() => {
    if (!batteryData) return 0;
    return batteryData.slots.filter(slot =>
      slot.state === 'charging' || slot.state === 'full'
    ).length;
  }, [batteryData]);

  return (
    <div className="battery-monitoring">
      <main className="battery-main">
        {/* Battery Cards Section */}
        <section className="battery-section">
          <SectionHeader
            icon={Battery}
            title="Battery Slots Overview"
            description="Real-time monitoring of all battery charging stations and swapping slots"
            badge={batteryData ? `${activeBatteriesCount}/${batteryData.slots.length} Active` : 'Loading...'}
            badgeColor="#10b981"
            iconColor="#10b981"
          />
          <div className="cards-grid">
            {batteryData && batteryData.slots.map((slot) => (
              <BatteryCard
                key={slot.slot_number}
                slot={slot}
                isSelected={selectedSlot === slot.slot_number}
                onSelect={handleSlotSelect}
              />
            ))}
          </div>
        </section>

        {/* Charging Graphs Section */}
        <section className="battery-section">
          <SectionHeader
            icon={LineChart}
            title="Battery Slot Graphs"
            description="Real-time performance analytics and charging metrics visualization"
            badge={`Slot ${selectedSlot}`}
            badgeColor="#3b82f6"
            iconColor="#3b82f6"
            actions={
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '2px solid #3b82f6',
                  background: 'white',
                  color: '#1e40af',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#eff6ff';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value={10}>10 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
              </select>
            }
          />
          <ChargingGraphs selectedSlot={selectedSlot} timeRange={timeRange} />
        </section>

        {/* Alerts Section */}
        <section className="battery-section">
          <AlertsPanel alerts={alerts} />
        </section>
      </main>

      <footer className="battery-footer">
        <p>© 2025 Automated Battery Swapping System | Station ID: STATION_001</p>
      </footer>
    </div>
  );
};

export default BatteryMonitoring;
