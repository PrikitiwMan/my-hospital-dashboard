import { useState, useEffect } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

export default function RoomDetailCard({ data, onClose }) {
  const [heartRateHistory, setHeartRateHistory] = useState([]);

  // Efek mencatat riwayat detak jantung untuk grafik ECG
  useEffect(() => {
    if (data?.sensors?.heart_rate) {
      setHeartRateHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory,
          { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), bpm: data.sensors.heart_rate }
        ];
        if (newHistory.length > 15) return newHistory.slice(1);
        return newHistory;
      });
    } else {
      setHeartRateHistory([]);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-slate-400 font-medium">Menghubungkan ke Node IoT Spasial...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
        <p className="text-xs font-bold text-red-600">⚠️ {data.error}</p>
      </div>
    );
  }

  // Evaluasi kondisi kritis jika detak jantung melompat tinggi (> 85 BPM)
  const isCritical = data.sensors.heart_rate > 85;

  return (
    <div className="flex flex-col gap-5 animate-fade-in text-slate-700">
      
      {/* HEADER KARTU: Info Identitas Kamar */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
        <div>
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase bg-blue-50 text-blue-600 border border-blue-100 font-mono">
            NODE-ID: {data.id}
          </span>
          <h2 className="text-base font-extrabold text-slate-800 mt-1.5 tracking-tight">{data.name}</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg p-1.5 text-xs transition-all font-bold">
          ✕
        </button>
      </div>

      {/* PARAMETER LINGKUNGAN RUANGAN: Lebih Berwarna & Label Jelas */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card Suhu Ruang (Aksen Biru/Oranye Lembut) */}
        <div className="bg-gradient-to-br from-orange-50/60 to-orange-100/30 border border-orange-200/70 p-3.5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">🌡️</span>
            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">Suhu Ruangan</span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-black text-slate-800 font-mono tracking-tight">
              {data.sensors.temperature}<span className="text-xs font-bold text-orange-600 ml-0.5">°C</span>
            </p>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">Kondisi Thermal Teratur</p>
          </div>
        </div>

        {/* Card Kelembaban (Aksen Biru Air Lembut) */}
        <div className="bg-gradient-to-br from-blue-50/60 to-blue-100/30 border border-blue-200/70 p-3.5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">💧</span>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Kelembaban</span>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-black text-slate-800 font-mono tracking-tight">
              {data.sensors.humidity}<span className="text-xs font-bold text-blue-600 ml-0.5">% RH</span>
            </p>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">Higrometer Node Kalibrasi</p>
          </div>
        </div>
      </div>

      {/* STATUS OPERASIONAL MANAJEMEN: Berwarna Sesuai Kondisi */}
      <div className="flex flex-col gap-2.5 bg-slate-50/70 border border-slate-200/80 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold">Status Alokasi Ranjang:</span>
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
            data.status === 'Terisi' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
              : 'bg-slate-100 border border-slate-200 text-slate-500'
          }`}>
            {data.status === 'Terisi' ? '● BED OCCUPIED' : '○ BED VACANT'}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2.5">
          <span className="text-slate-400 font-semibold">Kondisi Kebersihan Kamar:</span>
          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
            data.maintenance_status === 'Steril' 
              ? 'bg-teal-50 border border-teal-200 text-teal-700' 
              : 'bg-amber-50 border border-amber-200 text-amber-700 font-bold animate-pulse'
          }`}>
            {data.maintenance_status === 'Steril' ? '✨ STERILE CLEANED' : '⚠️ NEED CLEANING'}
          </span>
        </div>
      </div>

      {/* TELEMETRI KLINIS DATA PASIEN (Hanya Tampil Jika Bed Terisi) */}
      {data.status === "Terisi" && (
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
          <div className="bg-slate-50/40 border border-slate-200/40 p-3 rounded-xl">
            <p className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider">Identitas Pasien Aktif</p>
            <p className="text-sm font-extrabold text-slate-800 mt-1 tracking-tight">{data.patient_name}</p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{data.age} • Medis: <span className="text-slate-600 font-semibold">{data.diagnosis}</span></p>
          </div>

          {/* MONITOR TELEMETRI MEDIS DINAMIS */}
          <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all duration-500 ${
            isCritical 
              ? 'bg-red-950/95 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse text-white' 
              : 'bg-slate-900 text-white border-slate-800 shadow-md'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <p className={`text-[10px] font-extrabold tracking-wider flex items-center gap-1.5 ${isCritical ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`}>
                {isCritical ? '⚠️ CRITICAL: TACHYCARDIA ALERT' : '❤️ LIVE ECG TELEMETRY STREAM'}
              </p>
              <span className={`font-mono font-black transition-all duration-300 ${isCritical ? 'text-red-500 text-2xl scale-105' : 'text-emerald-400 text-xl'}`}>
                {data.sensors.heart_rate} <span className="text-[10px] font-bold text-slate-400 font-sans">BPM</span>
              </span>
            </div>
            
            {/* SCREEN MONITOR GRAFIK ECG */}
            <div className="w-full bg-black/40 rounded-lg overflow-hidden border border-slate-800 p-2">
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={heartRateHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <YAxis domain={[50, 110]} hide />
                  <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke={isCritical ? "#ef4444" : "#10b981"} 
                    strokeWidth={2.5} 
                    dot={false} 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold px-1 mt-0.5">
              <span className={isCritical ? 'text-red-400' : 'text-slate-400'}>
                STATUS: {isCritical ? '🚨 WARNING' : '🛡️ NORMAL'}
              </span>
              <span className="text-slate-300">Saturasi SpO_2: <span className="text-sky-400 font-bold">{data.sensors.oxygen_saturation}%</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}