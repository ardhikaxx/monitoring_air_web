export type SensorId =
  | 'turbidity_inlet'
  | 'ph_inlet'
  | 'flow_inlet'
  | 'temp_inlet'
  | 'turbidity_outlet'
  | 'ph_outlet'
  | 'temp_outlet';

export type SensorLocation = 'inlet' | 'outlet';

export type SensorStatus = 'normal' | 'warning' | 'critical' | 'offline';

export interface SensorReading {
  id: SensorId;
  name: string;
  category: string;
  location: SensorLocation;
  value: number;
  unit: string;
  secondaryValue?: number; // e.g. for flow: pressure in bar
  secondaryUnit?: string;
  status: SensorStatus;
  hardwareModel: string;
  pin: string;
  lastUpdated: string;
  min24h: number;
  max24h: number;
  avg24h: number;
  sparkline: number[];
  description: string;
}

export interface ThresholdConfig {
  turbidity_inlet: {
    warningThreshold: number; // e.g. > 100 NTU
    criticalThreshold: number; // e.g. > 150 NTU
  };
  ph_inlet: {
    min: number; // e.g. 6.0
    max: number; // e.g. 8.5
  };
  flow_inlet: {
    minFlow: number; // e.g. 15 L/h
    maxFlow: number; // e.g. 25 L/h
    nominalFlow: number; // e.g. 20 L/h
    minPressure: number; // e.g. 1.0 bar
    maxPressure: number; // e.g. 2.5 bar
  };
  temp_inlet: {
    min: number; // e.g. 20 °C
    max: number; // e.g. 35 °C
  };
  turbidity_outlet: {
    warningThreshold: number; // e.g. > 4.0 NTU
    criticalThreshold: number; // e.g. > 5.0 NTU (Permenkes limit)
  };
  ph_outlet: {
    min: number; // e.g. 6.5
    max: number; // e.g. 8.5
  };
  temp_outlet: {
    min: number; // e.g. 20 °C
    max: number; // e.g. 35 °C
  };
}

export interface SystemGeneralConfig {
  systemName: string;
  deviceName: string;
  updateIntervalSec: number; // seconds
  capacityLph: number; // Liters per hour
  installationDate: string;
  locationTag: string;
  autoRefreshEnabled: boolean;
}

export interface DeviceStatus {
  name: string;
  deviceId: string;
  ipAddress: string;
  macAddress: string;
  status: 'online' | 'offline' | 'unstable';
  wifiSignal: number; // in dBm, e.g. -58
  wifiQuality: number; // in %, e.g. 86
  uptime: string;
  uptimeSeconds: number;
  lastSync: string;
  firmwareVersion: string;
  freeHeap: string;
  cpuTemp: number; // °C
}

export interface HistoricalRecord {
  id: string;
  timestamp: string; // ISO or Indonesian format
  sensorId: SensorId;
  sensorName: string;
  location: SensorLocation;
  value: number;
  unit: string;
  status: SensorStatus;
  notes?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  description: string;
  sensorId?: SensorId;
  read: boolean;
}

export interface CalibrationItem {
  sensorId: SensorId;
  sensorName: string;
  location: SensorLocation;
  hardwareModel: string;
  physicalLocation: string;
  referenceStandard: string;
  tolerance: string;
  lastCalibrated: string;
  measuredBefore: number;
  offset: number;
  measuredAfter: number;
  status: 'calibrated' | 'needs_calibration' | 'calibrating';
  pin: string;
}

export interface SensorTestStepResult {
  step: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'warning' | 'failed';
  message?: string;
}

export interface SensorTestFullResult {
  sensorId: SensorId;
  sensorName: string;
  timestamp: string;
  overallStatus: 'passed' | 'warning' | 'failed';
  steps: SensorTestStepResult[];
  readValue: number;
  unit: string;
  diagnosticNotes: string;
}

export type SimulationScenario =
  | 'all_normal'
  | 'turbidity_spike'
  | 'ph_acidic'
  | 'flow_drop'
  | 'temp_error'
  | 'sensor_offline'
  | 'esp32_disconnect';
