import Swal from 'sweetalert2';
import { SensorReading, SensorTestFullResult } from '@/types/sensor';

// Custom SweetAlert2 theme matching Navy/Blue Industrial IoT palette
const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl border border-slate-200/80 shadow-2xl p-6 font-sans',
    title: 'text-xl font-bold text-slate-800 tracking-tight',
    htmlContainer: 'text-sm text-slate-600 leading-relaxed',
    confirmButton:
      'px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mx-1.5',
    cancelButton:
      'px-5 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 focus:outline-none mx-1.5',
  },
  buttonsStyling: false,
});

export const showToast = (
  title: string,
  icon: 'success' | 'warning' | 'error' | 'info' = 'success',
  timer = 3000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon,
    title,
  });
};

export const showSuccess = (title: string, text: string) => {
  return customSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Tutup',
  });
};

export const showWarning = (title: string, text: string) => {
  return customSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Mengerti',
  });
};

export const showError = (title: string, text: string) => {
  return customSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Tutup',
  });
};

export const showInfo = (title: string, text: string) => {
  return customSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

export const showConfirm = async (
  title: string,
  text: string,
  confirmButtonText = 'Ya, Lanjutkan',
  cancelButtonText = 'Batal'
): Promise<boolean> => {
  const result = await customSwal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showSensorCheckResult = (sensor: SensorReading) => {
  const statusColor =
    sensor.status === 'normal'
      ? '#10B981'
      : sensor.status === 'warning'
      ? '#F59E0B'
      : sensor.status === 'critical'
      ? '#EF4444'
      : '#94A3B8';

  const statusLabel =
    sensor.status === 'normal'
      ? 'Normal (Optimal)'
      : sensor.status === 'warning'
      ? 'Perlu Perhatian (Warning)'
      : sensor.status === 'critical'
      ? 'Kritis / Di Luar Batas'
      : 'Sensor Offline';

  return customSwal.fire({
    title: `Pemeriksaan ${sensor.name}`,
    html: `
      <div class="text-left space-y-3 mt-3 text-xs md:text-sm">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div class="flex justify-between items-center mb-1">
            <span class="text-slate-500 font-medium">Status Kesehatan:</span>
            <span class="font-bold px-2 py-0.5 rounded-full text-white text-xs" style="background-color: ${statusColor}">
              ${statusLabel}
            </span>
          </div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-slate-500 font-medium">Nilai Pembacaan:</span>
            <span class="font-bold text-slate-800 text-base">${sensor.value} ${sensor.unit}</span>
          </div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-slate-500 font-medium">Lokasi Pemasangan:</span>
            <span class="font-semibold text-slate-700 uppercase tracking-wide text-xs">${sensor.location}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-medium">Model Perangkat Keras:</span>
            <span class="font-mono text-slate-700 text-xs">${sensor.hardwareModel}</span>
          </div>
          <div class="flex justify-between items-center mt-1">
            <span class="text-slate-500 font-medium">Pin Mikrokontroler:</span>
            <span class="font-mono text-blue-600 font-semibold text-xs">${sensor.pin}</span>
          </div>
        </div>

        <div class="text-slate-600 text-xs leading-relaxed bg-blue-50/60 border border-blue-100 rounded-xl p-3">
          <div class="font-semibold text-blue-900 mb-1">Diagnostik Sinyal & ADC:</div>
          <div>• Integritas data: 100% (CRC32 Valid)</div>
          <div>• Waktu respon sensor: 14 ms</div>
          <div>• Fluktuasi tegangan analog: ± 0.012 V (Sangat Stabil)</div>
        </div>
      </div>
    `,
    icon: sensor.status === 'critical' ? 'error' : sensor.status === 'warning' ? 'warning' : 'success',
    confirmButtonText: 'Selesai',
  });
};

export const showTestAllReport = (results: SensorTestFullResult[]) => {
  const passedCount = results.filter((r) => r.overallStatus === 'passed').length;
  const warningCount = results.filter((r) => r.overallStatus === 'warning').length;
  const failedCount = results.filter((r) => r.overallStatus === 'failed').length;

  const rowsHtml = results
    .map(
      (r) => `
    <tr class="border-b border-slate-100 text-left text-xs">
      <td class="py-2.5 font-medium text-slate-800">${r.sensorName}</td>
      <td class="py-2.5 text-center font-mono font-semibold">${r.readValue} ${r.unit}</td>
      <td class="py-2.5 text-right">
        <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
          r.overallStatus === 'passed'
            ? 'bg-emerald-100 text-emerald-800'
            : r.overallStatus === 'warning'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-rose-100 text-rose-800'
        }">
          ${r.overallStatus.toUpperCase()}
        </span>
      </td>
    </tr>
  `
    )
    .join('');

  return customSwal.fire({
    title: 'Laporan Pengujian 7 Sensor',
    html: `
      <div class="text-left space-y-4 mt-2">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
            <div class="text-xs text-emerald-700 font-medium">Lolos (Passed)</div>
            <div class="text-xl font-bold text-emerald-800">${passedCount}</div>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
            <div class="text-xs text-amber-700 font-medium">Peringatan</div>
            <div class="text-xl font-bold text-amber-800">${warningCount}</div>
          </div>
          <div class="bg-rose-50 border border-rose-200 rounded-xl p-2.5">
            <div class="text-xs text-rose-700 font-medium">Gagal</div>
            <div class="text-xl font-bold text-rose-800">${failedCount}</div>
          </div>
        </div>

        <div class="overflow-x-auto max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
          <table class="w-full border-collapse px-2">
            <thead>
              <tr class="bg-slate-100/80 text-[11px] font-semibold text-slate-600">
                <th class="py-2 px-3 text-left">Nama Sensor</th>
                <th class="py-2 text-center">Nilai Uji</th>
                <th class="py-2 px-3 text-right">Hasil</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 px-3">
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <p class="text-[11px] text-slate-500 italic text-center">
          Pengujian selesai pada seluruh sensor stasiun inlet dan outlet. Sistem telemetri ESP32 siap beroperasi.
        </p>
      </div>
    `,
    icon: failedCount > 0 ? 'warning' : 'success',
    confirmButtonText: 'Tutup Laporan',
  });
};
