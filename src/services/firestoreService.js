import { db } from '../firebase/config';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  Timestamp
} from 'firebase/firestore';

// Collection name - update this with your actual collection name
const COLLECTION_NAME = import.meta.env.VITE_FIRESTORE_COLLECTION || 'batteryReadings';

/**
 * Transform Firestore document to battery slot data format
 * Maps your Firestore fields to the format expected by the graphs
 */
const transformFirestoreData = (doc) => {
  const data = doc.data();

  return {
    slot_number: 1, // Assuming slot 1, modify if you have multiple slots
    occupied: true,
    battery_id: "BAT_001",
    // Convert current from mA to A and format with 2 decimals
    current: (data.current_mA / 1000).toFixed(2),
    // Voltage is already in volts
    voltage: data.voltage?.toFixed(2) || "0.00",
    // Temperature in Celsius
    temperature: data.temperatureC?.toFixed(1) || "0.0",
    // Calculate State of Charge (you may need to adjust this formula based on your battery specs)
    // This is a simple estimation: assuming 12V battery, 13.86V = ~100%, 11V = ~0%
    soc_percentage: calculateSoC(data.voltage).toFixed(1),
    // Estimate charging state based on current
    charging_state: determineChargingState(data.current_mA, data.voltage),
    // Calculate power (V * A)
    power: (data.voltage * (data.current_mA / 1000)).toFixed(2),
    // Store original timestamp
    timestamp: data.created_at?.toDate() || new Date(),
    // Additional raw data for reference
    shunt_mV: data.shunt_mV,
    local_ts: data.local_ts
  };
};

/**
 * Calculate State of Charge based on voltage
 * Adjust these values based on your specific battery chemistry
 */
const calculateSoC = (voltage) => {
  if (!voltage) return 0;

  // Typical 12V lead-acid battery voltage ranges
  // Fully charged: ~13.8V, Discharged: ~11.8V
  const voltageMax = 13.8;
  const voltageMin = 11.8;

  if (voltage >= voltageMax) return 100;
  if (voltage <= voltageMin) return 0;

  // Linear interpolation
  return ((voltage - voltageMin) / (voltageMax - voltageMin)) * 100;
};

/**
 * Determine charging state based on current and voltage
 */
const determineChargingState = (current_mA, voltage) => {
  if (!current_mA || !voltage) return 'idle';

  // Positive current means charging, negative means discharging
  if (current_mA > 100) {
    if (voltage >= 13.6) return 'full';
    return 'charging';
  } else if (current_mA < -100) {
    return 'discharging';
  } else {
    if (voltage >= 13.6) return 'full';
    return 'idle';
  }
};

/**
 * Subscribe to real-time battery data updates
 * Uses Firestore real-time listener - efficient for free tier
 * Only fetches the most recent document and listens for changes
 *
 * @param {Function} callback - Called with latest battery data
 * @param {Function} errorCallback - Called on error
 * @returns {Function} Unsubscribe function
 */
export const subscribeToLatestBatteryData = (callback, errorCallback) => {
  try {
    // Query for the most recent document only
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('created_at', 'desc'),
      limit(1)
    );

    // Real-time listener - only charges 1 read per document change
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const transformedData = transformFirestoreData(doc);

          // Format as battery station data with 3 slots
          const batteryData = {
            timestamp: new Date().toISOString(),
            station_id: "STATION_001",
            slots: [
              transformedData,
              { slot_number: 2, occupied: false }, // Empty slot
              { slot_number: 3, occupied: false }  // Empty slot
            ],
            alerts: []
          };

          callback(batteryData);
        }
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        if (errorCallback) errorCallback(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up Firestore subscription:', error);
    if (errorCallback) errorCallback(error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Fetch historical battery data for graphs
 * Fetches last N documents for time-series visualization
 *
 * @param {number} timeRangeMinutes - Time range in minutes (10, 30, or 60)
 * @param {Function} callback - Called with historical data array
 * @param {Function} errorCallback - Called on error
 * @returns {Function} Unsubscribe function
 */
export const subscribeToHistoricalData = (timeRangeMinutes = 30, callback, errorCallback) => {
  try {
    // For testing: If no recent data, fetch the most recent 200 documents regardless of age
    // In production, you can uncomment the time-based query below

    const maxDocuments = Math.min(timeRangeMinutes * 2, 200); // ~2 readings per minute max

    // Simple query: Get most recent documents (works even if data is old)
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('created_at', 'desc'),
      limit(maxDocuments)
    );

    /* PRODUCTION VERSION - Uncomment this when you have real-time data:
    const now = new Date();
    const timeThreshold = new Date(now.getTime() - timeRangeMinutes * 60 * 1000);

    const q = query(
      collection(db, COLLECTION_NAME),
      where('created_at', '>=', Timestamp.fromDate(timeThreshold)),
      orderBy('created_at', 'desc'),
      limit(maxDocuments)
    );
    */

    // Real-time listener for historical data
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const historicalData = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.created_at?.toDate() || new Date();

          historicalData.push({
            timestamp: timestamp.toISOString(),
            time: timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }),
            voltage: parseFloat(data.voltage) || 0,
            current: parseFloat(data.current_mA / 1000) || 0, // Convert mA to A
            soc: calculateSoC(data.voltage),
            temperature: parseFloat(data.temperatureC) || 0
          });
        });

        // Sort by timestamp ascending (oldest first) for proper graph display
        historicalData.reverse();

        callback(historicalData);
      },
      (error) => {
        console.error('Historical data subscription error:', error);
        if (errorCallback) errorCallback(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    if (errorCallback) errorCallback(error);
    return () => {};
  }
};

/**
 * Get Firestore usage statistics (for monitoring free tier limits)
 */
export const getUsageStats = () => {
  // Note: Actual usage tracking would need to be implemented server-side
  // This is a client-side estimate
  const estimatedReadsPerDay = {
    realTimeListener: 1440, // ~1 per minute for 24 hours
    historicalData: 200 * 3, // 200 docs * 3 time range changes per day
    total: 2040
  };

  const freeTierLimit = 50000;
  const usagePercentage = ((estimatedReadsPerDay.total / freeTierLimit) * 100).toFixed(2);

  return {
    estimatedReadsPerDay: estimatedReadsPerDay.total,
    freeTierLimit,
    usagePercentage: `${usagePercentage}%`,
    wellWithinLimits: estimatedReadsPerDay.total < freeTierLimit * 0.5
  };
};

export default {
  subscribeToLatestBatteryData,
  subscribeToHistoricalData,
  getUsageStats
};
