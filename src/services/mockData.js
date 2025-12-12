/**
 * Mock data service for demo purposes
 * This simulates real-time data from the Raspberry Pi
 */

// Generate mock data for 3 battery slots
export const generateMockSlotData = () => {
  const slots = [
    {
      slot_number: 1,
      occupied: true,
      battery_id: "BAT_001",
      voltage: (Math.random() * 1.5 + 11.5).toFixed(2),
      current: (Math.random() * 8 + 1).toFixed(2),
      temperature: (Math.random() * 15 + 25).toFixed(1),
      soc_percentage: (Math.random() * 40 + 40).toFixed(1),
      charging_state: "charging",
      power: null
    },
    {
      slot_number: 2,
      occupied: true,
      battery_id: "BAT_002",
      voltage: 12.60,
      current: 0.0,
      temperature: (Math.random() * 5 + 23).toFixed(1),
      soc_percentage: 100.0,
      charging_state: "full",
      power: 0.0
    },
    {
      slot_number: 3,
      occupied: false,
      battery_id: null,
      voltage: null,
      current: null,
      temperature: null,
      soc_percentage: null,
      charging_state: "empty",
      power: null
    }
  ];

  // Calculate power for occupied slots
  slots.forEach(slot => {
    if (slot.occupied && slot.voltage && slot.current) {
      slot.power = (parseFloat(slot.voltage) * parseFloat(slot.current)).toFixed(2);
    }
  });

  return {
    timestamp: new Date().toISOString(),
    station_id: "STATION_001",
    slots: slots,
    alerts: []
  };
};

// Generate historical data for graphs - OPTIMIZED for performance
// Reduced data points: sample every N seconds instead of every second
export const generateHistoricalData = (slotNumber, minutes = 30) => {
  const data = [];
  const now = Date.now();

  // Adaptive sampling: fewer points = better performance
  // 10min: 200 points (3sec intervals)
  // 30min: 360 points (5sec intervals)
  // 60min: 360 points (10sec intervals)
  const interval = minutes <= 10 ? 3000 : minutes <= 30 ? 5000 : 10000;
  const totalPoints = Math.floor((minutes * 60 * 1000) / interval);

  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = new Date(now - i * interval);

    if (slotNumber === 1) {
      // Charging battery - voltage and SoC increasing
      const progress = 1 - (i / totalPoints);
      data.push({
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: parseFloat((11.5 + progress * 1.1).toFixed(2)),
        current: parseFloat((8 - progress * 3).toFixed(2)),
        soc: parseFloat((40 + progress * 50).toFixed(1)),
        temperature: parseFloat((25 + Math.random() * 10 + progress * 5).toFixed(1))
      });
    } else if (slotNumber === 2) {
      // Full battery - stable
      data.push({
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: parseFloat((12.55 + Math.random() * 0.1).toFixed(2)),
        current: parseFloat((0 + Math.random() * 0.1).toFixed(2)),
        soc: parseFloat((99 + Math.random()).toFixed(1)),
        temperature: parseFloat((24 + Math.random() * 2).toFixed(1))
      });
    } else {
      // Empty slot
      data.push({
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: null,
        current: null,
        soc: null,
        temperature: null
      });
    }
  }

  return data;
};

// Simulate real-time updates
export class MockDataStream {
  constructor(callback) {
    this.callback = callback;
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => {
      const data = generateMockSlotData();
      this.callback(data);
    }, 1000); // Update every 1 second
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}