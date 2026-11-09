import {
  SensorReading,
  ThresholdConfig,
  SystemGeneralConfig,
  DeviceStatus,
  HistoricalRecord,
  ActivityEvent,
  CalibrationItem,
} from '@/types/sensor';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  turbidity_inlet: {
    warningThreshold: 100,
    criticalThreshold: 150,
  },
  ph_inlet: {
    min: 6.0,
    max: 8.5,
  },
  flow_inlet: {
    minFlow: 15,
    maxFlow: 25,
    nominalFlow: 20,
    minPressure: 1.2,
    maxPressure: 2.4,
  },
  temp_inlet: {
    min: 20,
    max: 35,
  },
  turbidity_outlet: {
    warningThreshold: 4.0,
    criticalThreshold: 5.0,
  },
  ph_outlet: {
    min: 6.5,
    max: 8.5,
  },
  temp_outlet: {
    min: 20,
    max: 35,
  },
};

export const DEFAULT_GENERAL_CONFIG: SystemGeneralConfig = {
  systemName: 'IoT Water Treatment Monitoring System',
  deviceName: 'ESP32-WROOM-32D-WT01',
  updateIntervalSec: 3,
  capacityLph: 20,
  installationDate: '15 Januari 2026',
  locationTag: 'Stasiun Pengolahan Air Bersih - Unit Multimedia Filter',
  autoRefreshEnabled: true,
};

export const INITIAL_DEVICE_STATUS: DeviceStatus = {
  name: 'ESP32 Water Treatment Master Controller',
  deviceId: 'ESP32-WT-2026-X01',
  ipAddress: '192.168.1.145',
  macAddress: '24:6F:28:B4:82:1C',
  status: 'online',
  wifiSignal: -58,
  wifiQuality: 88,
  uptime: '5 hari 18 jam 45 menit',
  uptimeSeconds: 499500,
  lastSync: 'Baru saja',
  firmwareVersion: 'v2.4.1-iot',
  freeHeap: '184 KB / 320 KB',
  cpuTemp: 44.2,
};

export const INITIAL_SENSORS: SensorReading[] = [
  // 4 INLET SENSORS
  {
    id: 'turbidity_inlet',
    name: 'Sensor Kekeruhan Inlet',
    category: 'Kekeruhan Air Baku',
    location: 'inlet',
    value: 85.4,
    unit: 'NTU',
    status: 'normal',
    hardwareModel: 'Gravity Analog Turbidity Sensor v1.0',
    pin: 'GPIO 34 (ADC1_CH6)',
    lastUpdated: '16:15:20 WIB',
    min24h: 78.2,
    max24h: 96.5,
    avg24h: 84.8,
    sparkline: [82, 83.5, 84, 86, 85.2, 87, 85, 84.6, 85.9, 85.4],
    description: 'Mengukur tingkat kekeruhan air baku sungai sebelum masuk ke tangki pengendapan dan filtrasi multimedia.',
  },
  {
    id: 'ph_inlet',
    name: 'Sensor pH Inlet',
    category: 'Derajat Keasaman Air Baku',
    location: 'inlet',
    value: 6.32,
    unit: 'pH',
    status: 'normal',
    hardwareModel: 'DFRobot Industrial pH Meter Pro (Glass Electrode)',
    pin: 'GPIO 35 (ADC1_CH7)',
    lastUpdated: '16:15:20 WIB',
    min24h: 6.15,
    max24h: 6.65,
    avg24h: 6.38,
    sparkline: [6.4, 6.38, 6.35, 6.31, 6.33, 6.34, 6.3, 6.32, 6.33, 6.32],
    description: 'Mengukur keasaman atau kebasaan air mentah (skala 0-14) sebelum proses netralisasi filtrasi zeolit/karbon.',
  },
  {
    id: 'flow_inlet',
    name: 'Flow & Tekanan Sensor Inlet',
    category: 'Laju Alir & Tekanan Pipa',
    location: 'inlet',
    value: 20.3,
    unit: 'L/jam',
    secondaryValue: 1.82,
    secondaryUnit: 'bar',
    status: 'normal',
    hardwareModel: 'YF-S201 Hall Flow Sensor + 0.5-4.5V Pressure Transducer',
    pin: 'GPIO 18 (Pulse Counter) & GPIO 39 (ADC1_CH3)',
    lastUpdated: '16:15:20 WIB',
    min24h: 18.5,
    max24h: 21.8,
    avg24h: 20.1,
    sparkline: [19.8, 20.1, 20.4, 20.0, 20.2, 20.5, 20.3, 20.1, 20.4, 20.3],
    description: 'Memantau laju alir air baku masuk ke sistem dengan kapasitas ~20 L/jam serta tekanan kerja pipa saluran.',
  },
  {
    id: 'temp_inlet',
    name: 'Sensor Suhu Inlet',
    category: 'Temperatur Air Baku',
    location: 'inlet',
    value: 27.2,
    unit: '°C',
    status: 'normal',
    hardwareModel: 'DS18B20 Waterproof Digital Thermometer',
    pin: 'GPIO 4 (1-Wire Bus)',
    lastUpdated: '16:15:20 WIB',
    min24h: 26.1,
    max24h: 28.5,
    avg24h: 27.3,
    sparkline: [27.0, 27.1, 27.1, 27.2, 27.3, 27.3, 27.2, 27.1, 27.2, 27.2],
    description: 'Memantau temperatur air baku guna mengantisipasi perubahan kelarutan gas dan efisiensi desinfeksi.',
  },

  // 3 OUTLET SENSORS
  {
    id: 'turbidity_outlet',
    name: 'Sensor Kekeruhan Outlet',
    category: 'Kekeruhan Air Hasil',
    location: 'outlet',
    value: 2.85,
    unit: 'NTU',
    status: 'normal',
    hardwareModel: 'Gravity High-Precision Turbidity Sensor v1.0',
    pin: 'GPIO 32 (ADC1_CH4)',
    lastUpdated: '16:15:20 WIB',
    min24h: 2.1,
    max24h: 3.6,
    avg24h: 2.9,
    sparkline: [3.1, 3.0, 2.9, 2.8, 2.85, 2.9, 2.8, 2.75, 2.82, 2.85],
    description: 'Mengukur kekeruhan air setelah melalui 4 tahap multimedia filter dan sterilisasi UV (Baku Mutu < 5 NTU).',
  },
  {
    id: 'ph_outlet',
    name: 'Sensor pH Outlet',
    category: 'Derajat Keasaman Air Hasil',
    location: 'outlet',
    value: 7.08,
    unit: 'pH',
    status: 'normal',
    hardwareModel: 'DFRobot Industrial pH Meter Pro (BNC Interface)',
    pin: 'GPIO 33 (ADC1_CH5)',
    lastUpdated: '16:15:20 WIB',
    min24h: 6.95,
    max24h: 7.22,
    avg24h: 7.06,
    sparkline: [7.02, 7.04, 7.06, 7.08, 7.09, 7.07, 7.08, 7.1, 7.07, 7.08],
    description: 'Mengukur nilai netralitas pH air hasil olahan agar berada pada standar aman air bersih (6.5 - 8.5 pH).',
  },
  {
    id: 'temp_outlet',
    name: 'Sensor Suhu Outlet',
    category: 'Temperatur Air Hasil',
    location: 'outlet',
    value: 27.8,
    unit: '°C',
    status: 'normal',
    hardwareModel: 'DS18B20 Waterproof Digital Thermometer',
    pin: 'GPIO 5 (1-Wire Bus)',
    lastUpdated: '16:15:20 WIB',
    min24h: 26.5,
    max24h: 28.9,
    avg24h: 27.7,
    sparkline: [27.6, 27.6, 27.7, 27.8, 27.8, 27.9, 27.8, 27.7, 27.8, 27.8],
    description: 'Memantau kestabilan temperatur air siap pakai setelah keluar dari chamber lampu disinfeksi UV.',
  },
];

export const INITIAL_CALIBRATIONS: CalibrationItem[] = [
  {
    sensorId: 'turbidity_inlet',
    sensorName: 'Sensor Kekeruhan Inlet',
    location: 'inlet',
    hardwareModel: 'Gravity Turbidity v1.0',
    physicalLocation: 'Pipa Masuk Sebelum Bak Pengendapan',
    referenceStandard: 'Standar Formazin 100 NTU',
    tolerance: '± 5%',
    lastCalibrated: '05 November 2026, 10:30 WIB',
    measuredBefore: 87.2,
    offset: -1.8,
    measuredAfter: 85.4,
    status: 'calibrated',
    pin: 'GPIO 34',
  },
  {
    sensorId: 'ph_inlet',
    sensorName: 'Sensor pH Inlet',
    location: 'inlet',
    hardwareModel: 'DFRobot pH Pro',
    physicalLocation: 'Pipa Inlet Primer',
    referenceStandard: 'Larutan Buffer pH 4.01 & 7.00',
    tolerance: '± 0.05 pH',
    lastCalibrated: '06 November 2026, 14:15 WIB',
    measuredBefore: 6.45,
    offset: -0.13,
    measuredAfter: 6.32,
    status: 'calibrated',
    pin: 'GPIO 35',
  },
  {
    sensorId: 'flow_inlet',
    sensorName: 'Flow Sensor Inlet',
    location: 'inlet',
    hardwareModel: 'YF-S201 Hall Flowmeter',
    physicalLocation: 'Pipa Saluran Utama Intake',
    referenceStandard: 'Kalibrasi Volumetrik 20 L/jam (Pulse K-Factor 450)',
    tolerance: '± 3%',
    lastCalibrated: '04 November 2026, 09:00 WIB',
    measuredBefore: 20.8,
    offset: -0.5,
    measuredAfter: 20.3,
    status: 'calibrated',
    pin: 'GPIO 18',
  },
  {
    sensorId: 'temp_inlet',
    sensorName: 'Sensor Suhu Inlet',
    location: 'inlet',
    hardwareModel: 'DS18B20 Waterproof',
    physicalLocation: 'Thermowell Pipa Inlet',
    referenceStandard: 'Termometer Standar Kalibrasi 25.0 °C',
    tolerance: '± 0.2 °C',
    lastCalibrated: '07 November 2026, 11:20 WIB',
    measuredBefore: 27.4,
    offset: -0.2,
    measuredAfter: 27.2,
    status: 'calibrated',
    pin: 'GPIO 4',
  },
  {
    sensorId: 'turbidity_outlet',
    sensorName: 'Sensor Kekeruhan Outlet',
    location: 'outlet',
    hardwareModel: 'Gravity High-Precision Turbidity',
    physicalLocation: 'Pipa Outlet Setelah Lampu UV',
    referenceStandard: 'Air Akuades 0.00 NTU & 5.00 NTU',
    tolerance: '± 2%',
    lastCalibrated: '05 November 2026, 11:00 WIB',
    measuredBefore: 3.12,
    offset: -0.27,
    measuredAfter: 2.85,
    status: 'calibrated',
    pin: 'GPIO 32',
  },
  {
    sensorId: 'ph_outlet',
    sensorName: 'Sensor pH Outlet',
    location: 'outlet',
    hardwareModel: 'DFRobot pH Pro BNC',
    physicalLocation: 'Manifold Pipa Outlet Menuju Tangki Hasil',
    referenceStandard: 'Buffer Standar pH 7.00 & 9.18',
    tolerance: '± 0.03 pH',
    lastCalibrated: '06 November 2026, 14:45 WIB',
    measuredBefore: 7.15,
    offset: -0.07,
    measuredAfter: 7.08,
    status: 'calibrated',
    pin: 'GPIO 33',
  },
  {
    sensorId: 'temp_outlet',
    sensorName: 'Sensor Suhu Outlet',
    location: 'outlet',
    hardwareModel: 'DS18B20 Waterproof',
    physicalLocation: 'Thermowell Chamber Outlet',
    referenceStandard: 'Termometer Standar Kalibrasi 25.0 °C',
    tolerance: '± 0.2 °C',
    lastCalibrated: '07 November 2026, 11:40 WIB',
    measuredBefore: 27.9,
    offset: -0.1,
    measuredAfter: 27.8,
    status: 'calibrated',
    pin: 'GPIO 5',
  },
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: 'Baru saja',
    type: 'success',
    title: 'Telemetri ESP32 Tersinkronisasi',
    description: 'Semua 7 sensor berhasil mengirimkan data terkini ke sistem monitoring frontend via simulasi WebSocket.',
    read: false,
  },
  {
    id: 'act-2',
    timestamp: '3 menit lalu',
    type: 'info',
    title: 'Sensor Kekeruhan Outlet Normal',
    description: 'Tingkat kekeruhan air hasil filtrasi tercatat stabil pada 2.85 NTU (Di bawah baku mutu aman 5.0 NTU).',
    sensorId: 'turbidity_outlet',
    read: false,
  },
  {
    id: 'act-3',
    timestamp: '15 menit lalu',
    type: 'info',
    title: 'Debit Aliran Stabil',
    description: 'Laju alir pompa inlet beroperasi optimal pada 20.3 L/jam dengan tekanan 1.82 bar.',
    sensorId: 'flow_inlet',
    read: true,
  },
  {
    id: 'act-4',
    timestamp: '42 menit lalu',
    type: 'warning',
    title: 'Kekeruhan Inlet Sedikit Meningkat',
    description: 'Terdeteksi lonjakan kekeruhan air baku pada 96.5 NTU akibat endapan hulu sungai, filtrasi multimedia tetap efektif mereduksi hingga 2.9 NTU.',
    sensorId: 'turbidity_inlet',
    read: true,
  },
  {
    id: 'act-5',
    timestamp: '1 jam lalu',
    type: 'success',
    title: 'Pemeriksaan Rutin Selesai',
    description: 'Prosedur diagnostic auto-check seluruh sensor menghasilkan status "Semua Sensor Beroperasi Normal".',
    read: true,
  },
  {
    id: 'act-6',
    timestamp: '2 jam lalu',
    type: 'info',
    title: 'Disinfeksi UV Aktif',
    description: 'Unit sterilisasi ultraviolet beroperasi normal dengan suhu air outlet tercatat stabil 27.8 °C.',
    sensorId: 'temp_outlet',
    read: true,
  },
];

// Generate 24 hours of realistic historical records
export function generate24hHistory(): HistoricalRecord[] {
  const records: HistoricalRecord[] = [];
  const now = new Date(2026, 10, 9, 16, 15, 0); // 09 Nov 2026 16:15

  const sensorMeta = [
    { id: 'turbidity_inlet' as const, name: 'Sensor Kekeruhan Inlet', loc: 'inlet' as const, base: 85.0, unit: 'NTU', spread: 6.0 },
    { id: 'ph_inlet' as const, name: 'Sensor pH Inlet', loc: 'inlet' as const, base: 6.35, unit: 'pH', spread: 0.2 },
    { id: 'flow_inlet' as const, name: 'Flow Sensor Inlet', loc: 'inlet' as const, base: 20.2, unit: 'L/jam', spread: 1.2 },
    { id: 'temp_inlet' as const, name: 'Sensor Suhu Inlet', loc: 'inlet' as const, base: 27.2, unit: '°C', spread: 0.6 },
    { id: 'turbidity_outlet' as const, name: 'Sensor Kekeruhan Outlet', loc: 'outlet' as const, base: 2.85, unit: 'NTU', spread: 0.35 },
    { id: 'ph_outlet' as const, name: 'Sensor pH Outlet', loc: 'outlet' as const, base: 7.08, unit: 'pH', spread: 0.12 },
    { id: 'temp_outlet' as const, name: 'Sensor Suhu Outlet', loc: 'outlet' as const, base: 27.8, unit: '°C', spread: 0.5 },
  ];

  // 24 time points (every 1 hour back)
  for (let i = 24; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const day = String(t.getDate()).padStart(2, '0');
    const month = String(t.getMonth() + 1).padStart(2, '0');
    const year = t.getFullYear();
    const hours = String(t.getHours()).padStart(2, '0');
    const mins = String(t.getMinutes()).padStart(2, '0');
    const timestampStr = `${day}/${month}/${year} ${hours}:${mins} WIB`;

    for (const s of sensorMeta) {
      // Deterministic slight wavy variation
      const wave = Math.sin((i / 24) * Math.PI * 3 + s.base);
      let val = Number((s.base + wave * (s.spread / 2)).toFixed(s.unit === 'pH' ? 2 : 1));

      // Occasional small spike at i === 8 for turbidity inlet
      if (s.id === 'turbidity_inlet' && i === 8) {
        val = 96.5;
      }

      records.push({
        id: `hist-${s.id}-${i}`,
        timestamp: timestampStr,
        sensorId: s.id,
        sensorName: s.name,
        location: s.loc,
        value: val,
        unit: s.unit,
        status: (s.id === 'turbidity_inlet' && val > 95) ? 'warning' : 'normal',
        notes: val > 95 ? 'Lonjakan sesaat akibat sedimen hulu' : 'Pembacaan normal dalam batas operasional',
      });
    }
  }

  return records;
}
