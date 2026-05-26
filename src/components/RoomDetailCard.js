import { useState, useEffect } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

export default function RoomDetailCard({ data, onClose }) {
  const [heartRateHistory, setHeartRateHistory] = useState([]);

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
      <div className="flex flex-col items-center justify-center p-6 text-center w-full">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-[11px] text-slate-400 font-medium">Sinkronisasi Node IoT...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center w-full">
        <p className="text-[11px] font-bold text-red-600">⚠️ {data.error}</p>
      </div>
    );
  }

  const isCritical = data.sensors.heart_rate > 85;

  return (
    // Menggunakan h-auto dan pb-4 agar pembungkus memanjang ke bawah dengan aman di HP
    <div className="flex flex-col gap-4 animate-fade-in text-slate-700 h-auto w-full pb-2">
      
      {/* HEADER KAMAR */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-2 w-full">
        <div className="min-w-0">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 font-mono">
            ID: {data.id}
          </span>
          <h2 className="text-sm font-black text-slate-800 mt-1 truncate tracking-tight">{data.name}</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-md text-xs font-bold flex-shrink-0 ml-2">
          ✕
        </button>
      </div>

      {/* PARAMETER GRADIENT (SUHU & KELEMBABAN) */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/30 border border-orange-200/60 p-2.5 rounded-xl shadow-sm">
          <p className="text-[9px] font-bold text-orange-700 uppercase tracking-wide">Suhu Ruangan</p>
          <p className="text-base md:text-xl font-black text-slate-800 font-mono mt-1 tracking-tight">
            {data.sensors.temperature}<span className="text-[10px] font-bold text-orange-600 ml-0.5">°C</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/30 border border-blue-200/60 p-2.5 rounded-xl shadow-sm">
          <p className="text-[9px] font-bold text-blue-700 uppercase tracking-wide">Kelembaban</p>
          <p className="text-base md:text-xl font-black text-slate-800 font-mono mt-1 tracking-tight">
            {data.sensors.humidity}<span className="text-[10px] font-bold text-blue-600 ml-0.5">% RH</span>
          </p>
        </div>
      </div>

      {/* BADGE STATUS OPERASIONAL */}
      <div className="flex flex-col gap-2 bg-slate-50/80 border border-slate-200/60 p-3 rounded-xl w-full text-[11px]">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Alokasi Ranjang:</span>
          <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
            data.status === 'Terisi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'
          }`}>{data.status === 'Terisi' ? 'OCCUPIED' : 'VACANT'}</span>
        </div>
        <div className="flex justify-between items-center border-t border-slate-200/40 pt-2">
          <span className="text-slate-400 font-medium">Kebersihan:</span>
          <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
            data.maintenance_status === 'Steril' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
          }`}>{data.maintenance_status === 'Steril' ? 'STERILE' : 'DIRTY'}</span>
        </div>
      </div>

      {/* TELEMETRI MEDIS (Hanya muncul jika kamar terisi) */}
      {data.status === "Terisi" && (
        <div className="flex flex-col gap-3 w-full border-t border-slate-100 pt-3">
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Identitas Pasien</p>
            <p className="text-xs font-extrabold text-slate-800 mt-0.5 truncate">{data.patient_name}</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{data.age} • <span className="text-slate-600 font-medium">{data.diagnosis}</span></p>
          </div>

          {/* MONITOR UTAMA BOX GRAFIK */}
          <div className={`p-3 rounded-xl border flex flex-col gap-2 transition-all duration-300 ${
            isCritical ? 'bg-red-950 border-red-500 text-white' : 'bg-slate-900 text-white border-slate-800'
          }`}>
            <div className="flex justify-between items-center w-full">
              <span className={`text-[9px] font-bold ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                {isCritical ? '⚠️ TACHYCARDIA' : '❤️ LIVE ECG STREAM'}
              </span>
              <span className={`font-mono font-black ${isCritical ? 'text-red-400 text-lg' : 'text-emerald-400 text-base'}`}>
                {data.sensors.heart_rate}<span className="text-[8px] font-normal text-slate-400 ml-0.5">BPM</span>
              </span>
            </div>
            
            {/* SCREEN BLACK BOX RECHARTS CONTAINER */}
            <div className="w-full bg-black/30 rounded-lg p-1.5 border border-slate-800/60 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heartRateHistory}>
                  <YAxis domain={[50, 110]} hide />
                  <Line type="monotone" dataKey="bpm" stroke={isCritical ? "#ef4444" : "#10b981"} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between text-[9px] text-slate-400 font-mono font-semibold px-0.5">
              <span>{isCritical ? '🚨 WARNING' : '🛡️ NORMAL'}</span>
              <span>$SpO_2$: <span className="text-sky-400 font-bold">{data.sensors.oxygen_saturation}%</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}