'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  SensorReading,
  SensorId,
  SensorStatus,
  ThresholdConfig,
  SystemGeneralConfig,
  DeviceStatus,
  HistoricalRecord,
  ActivityEvent,
  CalibrationItem,
  SimulationScenario,
  SensorTestFullResult,
  SensorTestStepResult,
} from '@/types/sensor';
import {
  DEFAULT_THRESHOLDS,
  DEFAULT_GENERAL_CONFIG,
  INITIAL_DEVICE_STATUS,
  INITIAL_SENSORS,
  INITIAL_CALIBRATIONS,
  INITIAL_ACTIVITIES,
  generate24hHistory,
} from '@/mock/initialData';
import { showToast } from '@/lib/alerts';

interface SystemContextType {
  sensors: SensorReading[];
  deviceStatus: DeviceStatus;
  thresholds: ThresholdConfig;
  generalConfig: SystemGeneralConfig;
  historicalRecords: HistoricalRecord[];
  activities: ActivityEvent[];
  calibrations: CalibrationItem[];
  isMonitoringActive: boolean;
  activeScenario: SimulationScenario;
  lastUpdatedTime: string;

  // Computed
  totalSensors: number;
  normalCount: number;
  warningCount: number;
  criticalCount: number;
  offlineCount: number;
  purificationEfficiency: number;

  // Actions
  toggleMonitoring: () => void;
  setMonitoringActive: (active: boolean) => void;
  refreshAllData: () => void;
  resetSimulation: () => void;
  applyScenario: (scenario: SimulationScenario) => void;
  updateThresholds: (newThresholds: ThresholdConfig) => void;
  updateGeneralConfig: (newConfig: SystemGeneralConfig) => void;
  resetToDefaults: () => void;

  // Notifications
  markActivityAsRead: (id: string) => void;
  markAllActivitiesAsRead: () => void;
  clearActivities: () => void;
  addActivity: (type: ActivityEvent['type'], title: string, description: string, sensorId?: SensorId) => void;

  // Diagnostic & Calibration
  runSensorCheck: (sensorId: SensorId) => Promise<SensorReading>;
  runSingleSensorTest: (sensorId: SensorId) => Promise<SensorTestFullResult>;
  runTestAllSensors: (onProgress?: (index: number, total: number) => void) => Promise<SensorTestFullResult[]>;
  calibrateSensor: (sensorId: SensorId, offset: number, newRef: number) => Promise<boolean>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const THRESHOLDS_STORAGE_KEY = 'wt_thresholds_config_v1';
const GENERAL_CONFIG_STORAGE_KEY = 'wt_general_config_v1';

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorReading[]>(INITIAL_SENSORS);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(INITIAL_DEVICE_STATUS);

  const [thresholds, setThresholds] = useState<ThresholdConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(THRESHOLDS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_THRESHOLDS;
  });

  const [generalConfig, setGeneralConfig] = useState<SystemGeneralConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(GENERAL_CONFIG_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return DEFAULT_GENERAL_CONFIG;
  });

  const [historicalRecords, setHistoricalRecords] = useState<HistoricalRecord[]>(() => generate24hHistory());
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [calibrations, setCalibrations] = useState<CalibrationItem[]>(INITIAL_CALIBRATIONS);
  const [isMonitoringActive, setIsMonitoringActive] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('all_normal');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Baru saja');

  // Format current WIB time string
  const getWibTimeString = useCallback(() => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s} WIB`;
  }, []);

  // Compute status for a specific sensor reading based on thresholds
  const calculateSensorStatus = useCallback(
    (id: SensorId, value: number, th: ThresholdConfig, isDeviceOnline: boolean): SensorStatus => {
      if (!isDeviceOnline) return 'offline';

      switch (id) {
        case 'turbidity_inlet':
          if (value >= th.turbidity_inlet.criticalThreshold) return 'critical';
          if (value >= th.turbidity_inlet.warningThreshold) return 'warning';
          return 'normal';

        case 'ph_inlet':
          if (value < th.ph_inlet.min - 0.5 || value > th.ph_inlet.max + 0.5) return 'critical';
          if (value < th.ph_inlet.min || value > th.ph_inlet.max) return 'warning';
          return 'normal';

        case 'flow_inlet':
          if (value < th.flow_inlet.minFlow - 5 || value > th.flow_inlet.maxFlow + 5) return 'critical';
          if (value < th.flow_inlet.minFlow || value > th.flow_inlet.maxFlow) return 'warning';
          return 'normal';

        case 'temp_inlet':
          if (value < th.temp_inlet.min - 5 || value > th.temp_inlet.max + 5) return 'critical';
          if (value < th.temp_inlet.min || value > th.temp_inlet.max) return 'warning';
          return 'normal';

        case 'turbidity_outlet':
          if (value >= th.turbidity_outlet.criticalThreshold) return 'critical';
          if (value >= th.turbidity_outlet.warningThreshold) return 'warning';
          return 'normal';

        case 'ph_outlet':
          if (value < th.ph_outlet.min - 0.4 || value > th.ph_outlet.max + 0.4) return 'critical';
          if (value < th.ph_outlet.min || value > th.ph_outlet.max) return 'warning';
          return 'normal';

        case 'temp_outlet':
          if (value < th.temp_outlet.min - 5 || value > th.temp_outlet.max + 5) return 'critical';
          if (value < th.temp_outlet.min || value > th.temp_outlet.max) return 'warning';
          return 'normal';

        default:
          return 'normal';
      }
    },
    []
  );

  // Helper to add activity with debounce / avoidance of duplicated spam
  const lastAlertTimeRef = useRef<{ [key: string]: number }>({});
  const addActivity = useCallback(
    (type: ActivityEvent['type'], title: string, description: string, sensorId?: SensorId) => {
      const now = Date.now();
      const key = `${sensorId || 'gen'}-${type}-${title}`;
      if (lastAlertTimeRef.current[key] && now - lastAlertTimeRef.current[key] < 20000) {
        return; // debounce 20s for identical alert
      }
      lastAlertTimeRef.current[key] = now;

      const newAct: ActivityEvent = {
        id: `act-${now}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: 'Baru saja',
        type,
        title,
        description,
        sensorId,
        read: false,
      };

      setActivities((prev) => [newAct, ...prev.slice(0, 49)]);
    },
    []
  );

  // Central simulation tick
  const simulateTick = useCallback(() => {
    if (!isMonitoringActive) return;

    const timeStr = getWibTimeString();
    setLastUpdatedTime(timeStr);

    const isOnline = deviceStatus.status !== 'offline';

    setSensors((prevSensors) =>
      prevSensors.map((sensor) => {
        // If device is offline or specific scenario set offline
        if (!isOnline || sensor.status === 'offline') {
          return {
            ...sensor,
            status: isOnline ? sensor.status : 'offline',
            lastUpdated: timeStr,
          };
        }

        // Generate tiny realistic fluctuation
        let delta = 0;
        let precision = 1;

        if (sensor.id === 'ph_inlet' || sensor.id === 'ph_outlet') {
          delta = (Math.random() - 0.5) * 0.04;
          precision = 2;
        } else if (sensor.id === 'turbidity_inlet') {
          delta = (Math.random() - 0.5) * 0.8;
          precision = 1;
        } else if (sensor.id === 'turbidity_outlet') {
          delta = (Math.random() - 0.5) * 0.12;
          precision = 2;
        } else if (sensor.id === 'flow_inlet') {
          delta = (Math.random() - 0.5) * 0.3;
          precision = 1;
        } else {
          // Temperature
          delta = (Math.random() - 0.5) * 0.15;
          precision = 1;
        }

        const rawNewVal = sensor.value + delta;
        const clampedVal = Number(Math.max(0.1, rawNewVal).toFixed(precision));

        // Update secondary value for flow sensor (pressure)
        let newSecondary = sensor.secondaryValue;
        if (sensor.id === 'flow_inlet' && sensor.secondaryValue !== undefined) {
          const pressDelta = (Math.random() - 0.5) * 0.02;
          newSecondary = Number(Math.max(0.2, sensor.secondaryValue + pressDelta).toFixed(2));
        }

        const newStatus = calculateSensorStatus(sensor.id, clampedVal, thresholds, isOnline);

        // Notify if sensor crossed into warning or critical
        if (newStatus === 'critical' && sensor.status !== 'critical') {
          addActivity(
            'critical',
            `Kritis: ${sensor.name} Melebihi Batas`,
            `Nilai saat ini ${clampedVal} ${sensor.unit} melewati batas ambang kritis sistem!`,
            sensor.id
          );
        } else if (newStatus === 'warning' && sensor.status === 'normal') {
          addActivity(
            'warning',
            `Peringatan: ${sensor.name} Perlu Perhatian`,
            `Nilai ${clampedVal} ${sensor.unit} mendekati batas toleransi operasional.`,
            sensor.id
          );
        }

        // Update sparkline
        const newSparkline = [...sensor.sparkline.slice(1), clampedVal];

        return {
          ...sensor,
          value: clampedVal,
          secondaryValue: newSecondary,
          status: newStatus,
          lastUpdated: timeStr,
          sparkline: newSparkline,
        };
      })
    );

    // Update ESP32 uptime and lastSync
    setDeviceStatus((prev) => {
      const nextUptimeSec = prev.uptimeSeconds + generalConfig.updateIntervalSec;
      const days = Math.floor(nextUptimeSec / 86400);
      const hours = Math.floor((nextUptimeSec % 86400) / 3600);
      const mins = Math.floor((nextUptimeSec % 3600) / 60);

      const cpuDelta = (Math.random() - 0.5) * 0.2;
      const newCpu = Number((prev.cpuTemp + cpuDelta).toFixed(1));

      return {
        ...prev,
        uptimeSeconds: nextUptimeSec,
        uptime: `${days} hari ${hours} jam ${mins} menit`,
        lastSync: 'Baru saja',
        cpuTemp: Math.max(38, Math.min(55, newCpu)),
      };
    });
  }, [
    isMonitoringActive,
    getWibTimeString,
    deviceStatus.status,
    thresholds,
    generalConfig.updateIntervalSec,
    calculateSensorStatus,
    addActivity,
  ]);

  // Interval timer for real-time simulation
  useEffect(() => {
    if (!isMonitoringActive) return;

    const intervalMs = Math.max(2, generalConfig.updateIntervalSec) * 1000;
    const timer = setInterval(() => {
      simulateTick();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isMonitoringActive, generalConfig.updateIntervalSec, simulateTick]);

  // Refresh all data manually
  const refreshAllData = useCallback(() => {
    const timeStr = getWibTimeString();
    setLastUpdatedTime(timeStr);

    setSensors((prev) =>
      prev.map((s) => {
        const delta = (Math.random() - 0.5) * (s.unit === 'pH' ? 0.05 : 0.4);
        const nextVal = Number((s.value + delta).toFixed(s.unit === 'pH' ? 2 : 1));
        const st = calculateSensorStatus(s.id, nextVal, thresholds, deviceStatus.status !== 'offline');
        return {
          ...s,
          value: nextVal,
          status: st,
          lastUpdated: timeStr,
          sparkline: [...s.sparkline.slice(1), nextVal],
        };
      })
    );

    addActivity('info', 'Pembaruan Data Manual', 'Seluruh parameter sensor berhasil diperbarui secara instan.');
    showToast('Data telemetri sensor berhasil diperbarui!', 'success');
  }, [getWibTimeString, thresholds, deviceStatus.status, calculateSensorStatus, addActivity]);

  // Toggle active / paused monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoringActive((prev) => {
      const next = !prev;
      if (next) {
        showToast('Monitoring Sensor Diaktifkan (Real-time)', 'info');
        addActivity('info', 'Monitoring Dimulai', 'Pembaruan data telemetri otomatis aktif.');
      } else {
        showToast('Monitoring Sensor Dijeda (Manual Mode)', 'warning');
        addActivity('warning', 'Monitoring Dijeda', 'Pembaruan data otomatis dihentikan sementara oleh administrator.');
      }
      return next;
    });
  }, [addActivity]);

  const setMonitoringActive = useCallback(
    (active: boolean) => {
      setIsMonitoringActive(active);
      if (active) {
        showToast('Monitoring Sensor Diaktifkan', 'info');
      } else {
        showToast('Monitoring Sensor Dijeda', 'warning');
      }
    },
    []
  );

  // Apply quick simulation scenarios
  const applyScenario = useCallback(
    (scenario: SimulationScenario) => {
      setActiveScenario(scenario);
      const isOnline = scenario !== 'esp32_disconnect';

      setDeviceStatus((prev) => ({
        ...prev,
        status: isOnline ? 'online' : 'offline',
        wifiQuality: isOnline ? 88 : 0,
      }));

      setSensors((prev) =>
        prev.map((s) => {
          if (!isOnline) {
            return { ...s, status: 'offline', lastUpdated: getWibTimeString() };
          }

          let val = s.value;
          let secVal = s.secondaryValue;
          let forceStatus: SensorStatus | null = null;

          switch (scenario) {
            case 'all_normal':
              if (s.id === 'turbidity_inlet') val = 85.4;
              if (s.id === 'ph_inlet') val = 6.32;
              if (s.id === 'flow_inlet') {
                val = 20.3;
                secVal = 1.82;
              }
              if (s.id === 'temp_inlet') val = 27.2;
              if (s.id === 'turbidity_outlet') val = 2.85;
              if (s.id === 'ph_outlet') val = 7.08;
              if (s.id === 'temp_outlet') val = 27.8;
              break;

            case 'turbidity_spike':
              if (s.id === 'turbidity_inlet') {
                val = 142.0;
              }
              break;

            case 'ph_acidic':
              if (s.id === 'ph_outlet') {
                val = 5.85;
              }
              break;

            case 'flow_drop':
              if (s.id === 'flow_inlet') {
                val = 9.2;
                secVal = 0.85;
              }
              break;

            case 'temp_error':
              if (s.id === 'temp_inlet') {
                val = 38.6;
              }
              break;

            case 'sensor_offline':
              if (s.id === 'turbidity_outlet') {
                forceStatus = 'offline';
                val = 0.0;
              }
              break;
          }

          const calculated = forceStatus || calculateSensorStatus(s.id, val, thresholds, true);

          return {
            ...s,
            value: val,
            secondaryValue: secVal,
            status: calculated,
            lastUpdated: getWibTimeString(),
            sparkline: [...s.sparkline.slice(1), val],
          };
        })
      );

      const scenarioTitles: Record<SimulationScenario, string> = {
        all_normal: 'Skenario: Semua Sensor Normal Diaktifkan',
        turbidity_spike: 'Skenario: Lonjakan Kekeruhan Air Baku (142 NTU)',
        ph_acidic: 'Skenario: pH Outlet Asam Terdeteksi (5.85 pH)',
        flow_drop: 'Skenario: Penurunan Laju Alir Masuk (9.2 L/jam)',
        temp_error: 'Skenario: Anomali Temperatur Air Baku (38.6 °C)',
        sensor_offline: 'Skenario: Sensor Kekeruhan Outlet Terputus',
        esp32_disconnect: 'Skenario: Perangkat ESP32 Kehilangan Koneksi',
      };

      const scenarioType: ActivityEvent['type'] =
        scenario === 'all_normal' ? 'success' : scenario === 'esp32_disconnect' ? 'critical' : 'warning';

      addActivity(
        scenarioType,
        scenarioTitles[scenario],
        `Skenario demonstrasi dijalankan melalui Control Panel.`
      );

      showToast(`Skenario diterapkan: ${scenarioTitles[scenario]}`, scenarioType === 'critical' ? 'error' : 'info');
    },
    [calculateSensorStatus, getWibTimeString, thresholds, addActivity]
  );

  // Reset simulation completely
  const resetSimulation = useCallback(() => {
    setSensors(INITIAL_SENSORS);
    setDeviceStatus(INITIAL_DEVICE_STATUS);
    setActiveScenario('all_normal');
    setIsMonitoringActive(true);
    setHistoricalRecords(generate24hHistory());
    addActivity('info', 'Simulasi Direset', 'Kondisi sistem dan data sensor dikembalikan ke nilai awal pabrik.');
    showToast('Simulasi berhasil direset ke kondisi default!', 'success');
  }, [addActivity]);

  // Update threshold configurations
  const updateThresholds = useCallback((newThresholds: ThresholdConfig) => {
    setThresholds(newThresholds);
    try {
      localStorage.setItem(THRESHOLDS_STORAGE_KEY, JSON.stringify(newThresholds));
    } catch {
      console.warn('Could not save thresholds to localStorage');
    }
    showToast('Konfigurasi ambang batas berhasil disimpan!', 'success');
  }, []);

  // Update general configurations
  const updateGeneralConfig = useCallback((newConfig: SystemGeneralConfig) => {
    setGeneralConfig(newConfig);
    try {
      localStorage.setItem(GENERAL_CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      console.warn('Could not save general config to localStorage');
    }
    showToast('Konfigurasi umum sistem berhasil disimpan!', 'success');
  }, []);

  // Reset to default settings
  const resetToDefaults = useCallback(() => {
    setThresholds(DEFAULT_THRESHOLDS);
    setGeneralConfig(DEFAULT_GENERAL_CONFIG);
    try {
      localStorage.removeItem(THRESHOLDS_STORAGE_KEY);
      localStorage.removeItem(GENERAL_CONFIG_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Pengaturan berhasil dikembalikan ke standar awal!', 'success');
  }, []);

  // Notifications management
  const markActivityAsRead = useCallback((id: string) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllActivitiesAsRead = useCallback(() => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast('Semua notifikasi ditandai telah dibaca', 'info');
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    showToast('Histori notifikasi dibersihkan', 'info');
  }, []);

  // Single sensor check (quick diagnostic scan)
  const runSensorCheck = useCallback(
    async (sensorId: SensorId): Promise<SensorReading> => {
      await new Promise((r) => setTimeout(r, 800));
      const found = sensors.find((s) => s.id === sensorId);
      if (!found) throw new Error('Sensor not found');
      return found;
    },
    [sensors]
  );

  // Single sensor full test simulation
  const runSingleSensorTest = useCallback(
    async (sensorId: SensorId): Promise<SensorTestFullResult> => {
      const sensor = sensors.find((s) => s.id === sensorId);
      const name = sensor?.name || 'Sensor';
      const readVal = sensor?.value || 0;
      const unit = sensor?.unit || '';

      const steps: SensorTestStepResult[] = [
        { step: '1. Inisialisasi Bus I2C/ADC', description: 'Memeriksa jalur data mikro ke sensor pin', status: 'passed' },
        { step: '2. Pengiriman Sinyal Ping', description: 'Mengirim frame byte telemetri ke sensor', status: 'passed' },
        { step: '3. Penerimaan Nilai Raw', description: 'Mengonversi tegangan analog ke satuan terkalibrasi', status: 'passed' },
        {
          step: '4. Validasi Ambang Batas',
          description: 'Membandingkan nilai terhadap batas operasional aman',
          status: sensor?.status === 'critical' ? 'failed' : sensor?.status === 'warning' ? 'warning' : 'passed',
        },
        {
          step: '5. Evaluasi Kestabilan',
          description: 'Mengukur noise rasio sinyal selama 5 sampling',
          status: 'passed',
        },
      ];

      const overall =
        sensor?.status === 'critical' ? 'failed' : sensor?.status === 'warning' ? 'warning' : 'passed';

      return {
        sensorId,
        sensorName: name,
        timestamp: getWibTimeString(),
        overallStatus: overall,
        steps,
        readValue: readVal,
        unit,
        diagnosticNotes:
          overall === 'passed'
            ? 'Seluruh parameter pengujian terpenuhi. Sensor siap beroperasi optimal.'
            : overall === 'warning'
            ? 'Sensor merespon normal namun nilai mendekati batas toleransi batas ambang.'
            : 'Perhatian: Nilai sensor melampaui batas kritis keselamatan sistem.',
      };
    },
    [sensors, getWibTimeString]
  );

  // Run Test All Sensors sequentially
  const runTestAllSensors = useCallback(
    async (onProgress?: (index: number, total: number) => void): Promise<SensorTestFullResult[]> => {
      const results: SensorTestFullResult[] = [];
      const total = sensors.length;

      for (let i = 0; i < total; i++) {
        const s = sensors[i];
        if (onProgress) onProgress(i + 1, total);
        await new Promise((r) => setTimeout(r, 600));
        const res = await runSingleSensorTest(s.id);
        results.push(res);
      }

      addActivity(
        'info',
        'Uji Diagnostik 7 Sensor Selesai',
        `Pemeriksaan komprehensif selesai dilakukan pada seluruh modul inlet & outlet.`
      );

      return results;
    },
    [sensors, runSingleSensorTest, addActivity]
  );

  // Calibrate sensor simulation
  const calibrateSensor = useCallback(
    async (sensorId: SensorId, offset: number, newRef: number): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 1200));

      const timeStr = `${new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })}, ${getWibTimeString()}`;

      setCalibrations((prev) =>
        prev.map((c) => {
          if (c.sensorId === sensorId) {
            return {
              ...c,
              lastCalibrated: timeStr,
              offset,
              measuredBefore: c.measuredAfter,
              measuredAfter: newRef,
              status: 'calibrated',
            };
          }
          return c;
        })
      );

      setSensors((prev) =>
        prev.map((s) => {
          if (s.id === sensorId) {
            const adjustedVal = Number((newRef).toFixed(s.unit === 'pH' ? 2 : 1));
            return {
              ...s,
              value: adjustedVal,
              lastUpdated: getWibTimeString(),
            };
          }
          return s;
        })
      );

      addActivity(
        'success',
        `Kalibrasi Berhasil: ${sensorId}`,
        `Offset kalibrasi ${offset > 0 ? '+' : ''}${offset} diterapkan dengan nilai referensi ${newRef}.`
      );

      return true;
    },
    [getWibTimeString, addActivity]
  );

  const totalSensors = sensors.length;
  const normalCount = sensors.filter((s) => s.status === 'normal').length;
  const warningCount = sensors.filter((s) => s.status === 'warning').length;
  const criticalCount = sensors.filter((s) => s.status === 'critical').length;
  const offlineCount = sensors.filter((s) => s.status === 'offline').length;

  const turbIn = sensors.find((s) => s.id === 'turbidity_inlet')?.value || 85;
  const turbOut = sensors.find((s) => s.id === 'turbidity_outlet')?.value || 2.8;
  const purificationEfficiency =
    turbIn > 0 ? Number((((turbIn - turbOut) / turbIn) * 100).toFixed(1)) : 0;

  return (
    <SystemContext.Provider
      value={{
        sensors,
        deviceStatus,
        thresholds,
        generalConfig,
        historicalRecords,
        activities,
        calibrations,
        isMonitoringActive,
        activeScenario,
        lastUpdatedTime,
        totalSensors,
        normalCount,
        warningCount,
        criticalCount,
        offlineCount,
        purificationEfficiency,
        toggleMonitoring,
        setMonitoringActive,
        refreshAllData,
        resetSimulation,
        applyScenario,
        updateThresholds,
        updateGeneralConfig,
        resetToDefaults,
        markActivityAsRead,
        markAllActivitiesAsRead,
        clearActivities,
        addActivity,
        runSensorCheck,
        runSingleSensorTest,
        runTestAllSensors,
        calibrateSensor,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
