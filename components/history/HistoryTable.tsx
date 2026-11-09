'use client';

import React, { useState, useMemo } from 'react';
import { HistoricalRecord, SensorStatus } from '@/types/sensor';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import { showToast } from '@/lib/alerts';

interface HistoryTableProps {
  records: HistoricalRecord[];
}

export default function HistoryTable({ records }: HistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search
      const matchSearch =
        rec.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.notes && rec.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        rec.timestamp.toLowerCase().includes(searchQuery.toLowerCase());

      // Location
      const matchLoc =
        selectedLocation === 'all' || rec.location === selectedLocation;

      // Status
      const matchStatus =
        selectedStatus === 'all' || rec.status === selectedStatus;

      return matchSearch && matchLoc && matchStatus;
    });
  }, [records, searchQuery, selectedLocation, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Real Export to CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showToast('Tidak ada data untuk diekspor', 'warning');
      return;
    }

    const headers = ['Waktu Pembacaan', 'ID Sensor', 'Nama Sensor', 'Lokasi', 'Nilai', 'Satuan', 'Status', 'Keterangan'];
    const rows = filteredRecords.map((r) => [
      `"${r.timestamp}"`,
      `"${r.sensorId}"`,
      `"${r.sensorName}"`,
      `"${r.location.toUpperCase()}"`,
      r.value,
      `"${r.unit}"`,
      `"${r.status.toUpperCase()}"`,
      `"${r.notes || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const nowStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `telemetri_water_treatment_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Berhasil mengekspor ${filteredRecords.length} baris data ke CSV!`, 'success');
  };

  const getStatusBadge = (status: SensorStatus) => {
    switch (status) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
            <AlertOctagon className="w-2.5 h-2.5" />
            Kritis
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-2.5 h-2.5" />
            Warning
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Normal
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Tabel Histori Data Telemetri Terarsip
              </h3>
              <p className="text-xs text-slate-500">
                Data rekaman sensor terperinci dengan pencarian, filter kategori, dan fitur unduh CSV
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari waktu, sensor, keterangan..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 sm:w-64"
            />
          </div>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">Semua Lokasi</option>
            <option value="inlet">Inlet Saja</option>
            <option value="outlet">Outlet Saja</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="critical">Kritis</option>
          </select>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Data Container */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Waktu (WIB)</th>
              <th className="py-3 px-4">Nama Sensor</th>
              <th className="py-3 px-4">Lokasi</th>
              <th className="py-3 px-4 text-right">Nilai Baca</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  Tidak ditemukan rekaman data yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {rec.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {rec.sensorName}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rec.location === 'inlet'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {rec.location}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    {rec.value} <span className="text-[11px] font-normal text-slate-500">{rec.unit}</span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(rec.status)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] truncate max-w-xs">
                    {rec.notes || 'Pembacaan normal'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-1">
        <div>
          Menampilkan{' '}
          <strong className="text-slate-800">
            {filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </strong>{' '}
          sampai{' '}
          <strong className="text-slate-800">
            {Math.min(currentPage * pageSize, filteredRecords.length)}
          </strong>{' '}
          dari <strong className="text-slate-800">{filteredRecords.length}</strong> entri rekaman
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-mono font-semibold text-slate-700">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
