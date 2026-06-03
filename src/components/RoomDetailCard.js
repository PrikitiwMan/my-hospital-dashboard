'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';

export default function RoomDetailCard({ data, onClose }) {
  const [activeTab, setActiveTab] = useState('sensors');
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
      <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full bg-white rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Syncing IoT Node...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center w-full">
        <p className="text-[11px] font-bold text-rose-600">⚠️ {data.error}</p>
      </div>
    );
  }

  const isCritical = data.sensors.heart_rate > 85;

  // =========================================================================
  // DATABASE DOKTER & LOGIKA AUTO-ASSIGN (SISTEM CERDAS)
  // =========================================================================
  const doctorProfiles = {
    "dr. Harianto, Sp.JP": {
      spesialis: "Cardiology Center",
      bio: "Ahli Bedah Jantung intervensi dengan pengalaman 15 tahun. Fokus pada pemasangan stent, manajemen gagal jantung akut, dan rehabilitasi jantung pasca-operasi.",
      inisial: "H", color: "from-rose-500 to-orange-500", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100"
    },
    "dr. Amanda, Sp.A": {
      spesialis: "Pediatric Clinic",
      bio: "Pemeriksaan tumbuh kembang anak, penanganan asma pediatrik, imunisasi lengkap, dan gawat darurat neonatus (NICU).",
      inisial: "A", color: "from-indigo-500 to-purple-500", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100"
    },
    "dr. Budi, Sp.OT": {
      spesialis: "Orthopedic & Trauma",
      bio: "Bedah tulang, penanganan patah tulang pasca kecelakaan, penggantian sendi pinggul, dan kedokteran olahraga.",
      inisial: "B", color: "from-emerald-500 to-teal-500", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100"
    },
    "dr. Hendra, Sp.P": {
      spesialis: "Pulmonologi & Respirasi",
      bio: "Spesialis paru dan pernapasan. Ahli dalam penanganan asma akut, PPOK, pneumonia, infeksi paru, dan kegawatdaruratan sesak nafas.",
      inisial: "H", color: "from-cyan-500 to-blue-500", text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100"
    }
  };

  // Algoritma penugasan otomatis jika API tidak mengirim nama dokter
  let assignedDoctor = data.doctor_assigned;
  let isAutoAssigned = false;

  if (!assignedDoctor || assignedDoctor === "Belum Ditugaskan" || assignedDoctor === "") {
    const diag = data.diagnosis ? data.diagnosis.toLowerCase() : "";
    if (diag.includes("sesak") || diag.includes("asma") || diag.includes("paru") || diag.includes("nafas")) {
      assignedDoctor = "dr. Hendra, Sp.P";
      isAutoAssigned = true;
    } else if (diag.includes("jantung") || diag.includes("kardio")) {
      assignedDoctor = "dr. Harianto, Sp.JP";
      isAutoAssigned = true;
    } else if (diag.includes("tulang") || diag.includes("fraktur") || diag.includes("patah")) {
      assignedDoctor = "dr. Budi, Sp.OT";
      isAutoAssigned = true;
    } else if (data.age && parseInt(data.age) < 18) {
      assignedDoctor = "dr. Amanda, Sp.A";
      isAutoAssigned = true;
    }
  }

  // Jika tetap tidak terdeteksi, gunakan profil kosong
  const docProfile = doctorProfiles[assignedDoctor] || {
    spesialis: "Belum Ada Spesialisasi",
    bio: "DPJP (Dokter Penanggung Jawab Pelayanan) belum dialokasikan. Pasien saat ini berada di bawah pengawasan ketat perawat jaga.",
    inisial: "?", color: "from-slate-400 to-slate-500", text: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200"
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-slate-700 h-full w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* HEADER & TABS NAVIGATION */}
      <div className="bg-indigo-950 p-4 pb-0">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0">
            <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-cyan-500 text-white font-mono uppercase shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              {data.id}
            </span>
            <h2 className="text-base font-black text-white mt-1 truncate tracking-tight">{data.name}</h2>
          </div>
          <button onClick={onClose} className="text-indigo-300 hover:text-white bg-indigo-900/50 p-1.5 rounded-xl text-xs transition-all">
            ✕
          </button>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex gap-1 bg-indigo-900/40 p-1 rounded-2xl mb-4 border border-indigo-800">
          <button 
            onClick={() => setActiveTab('sensors')}
            className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all ${activeTab === 'sensors' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-400 hover:text-indigo-200'}`}
          >
            Vitals
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-400 hover:text-indigo-200'}`}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('doctor')}
            className={`flex-1 py-2 text-[9px] font-black rounded-xl transition-all ${activeTab === 'doctor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-400 hover:text-indigo-200'}`}
          >
            Doctor
          </button>
        </div>
      </div>

      <div className="p-5 pt-1 overflow-y-auto flex-1">
        
        {/* ================= TAB 1: SENSORS ================= */}
        {activeTab === 'sensors' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 p-3 rounded-2xl">
                <p className="text-[9px] font-black text-orange-700 uppercase tracking-widest">Suhu</p>
                <p className="text-xl font-black text-slate-800 font-mono mt-1">{data.sensors.temperature}°C</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 border border-cyan-200 p-3 rounded-2xl">
                <p className="text-[9px] font-black text-cyan-700 uppercase tracking-widest">Lembab</p>
                <p className="text-xl font-black text-slate-800 font-mono mt-1">{data.sensors.humidity}%</p>
              </div>
            </div>

            {data.status === "Terisi" ? (
              <div className="flex flex-col gap-3">
                <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${isCritical ? 'bg-rose-50 border-rose-500' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 ${isCritical ? 'text-rose-600' : 'text-emerald-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-600 animate-ping' : 'bg-emerald-400'}`}></span>
                      {isCritical ? 'Tachycardia Alert' : 'Live ECG Monitor'}
                    </span>
                    <span className={`text-xl font-black font-mono ${isCritical ? 'text-rose-600' : 'text-emerald-400'}`}>
                      {data.sensors.heart_rate}<span className="text-[10px] ml-1">BPM</span>
                    </span>
                  </div>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                      <LineChart data={heartRateHistory}>
                        <YAxis domain={[40, 120]} hide />
                        <Line type="monotone" dataKey="bpm" stroke={isCritical ? "#e11d48" : "#10b981"} strokeWidth={3} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Pasien Terdaftar</p>
                   <p className="text-xs font-black text-slate-800">{data.patient_name || 'No Name'}</p>
                   <p className="text-[10px] font-bold text-indigo-600 mt-1">{data.diagnosis || 'General Observation'}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kamar Kosong</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Riwayat Perawatan</h3>
            {data.status === "Terisi" ? (
              <>
                <div className="relative pl-4 border-l-2 border-indigo-100 flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                    <p className="text-[10px] font-black text-indigo-600">Hari Ini, 08:30</p>
                    <p className="text-xs font-bold text-slate-800">Pemberian Obat Intravena</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                    <p className="text-[10px] font-black text-slate-400">Kemarin, 20:00</p>
                    <p className="text-xs font-bold text-slate-700">Cek Laboratorium Darah Rutin</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                    <p className="text-[10px] font-black text-slate-400">Kunjungan Sebelumnya</p>
                    <p className="text-xs font-bold text-slate-700">Masuk Rawat Inap (Admisi)</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[11px] text-center text-slate-400 py-10 font-bold">TIDAK ADA DATA AKTIF</p>
            )}
          </div>
        )}

        {/* ================= TAB 3: DOCTOR (DINAMIS & AUTO-ASSIGN) ================= */}
        {activeTab === 'doctor' && (
          <div className="flex flex-col items-center gap-4 animate-fade-in pt-4">
            
            {/* Foto Profil Dokter Dinamis */}
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${docProfile.color} flex items-center justify-center text-white text-3xl shadow-lg font-black`}>
              {docProfile.inisial}
            </div>
            
            <div className="text-center">
              <h3 className="text-sm font-black text-slate-800">{assignedDoctor || 'Belum Ditugaskan'}</h3>
              <p className={`text-[10px] font-black ${docProfile.text} uppercase tracking-widest mt-1`}>
                {docProfile.spesialis}
              </p>
            </div>

            {/* Label Auto-Assign jika terdeteksi oleh sistem */}
            {isAutoAssigned && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Auto-Assigned by AI Triage
              </div>
            )}

            <div className={`w-full ${docProfile.bg} p-4 rounded-2xl border ${docProfile.border}`}>
               <p className={`text-[9px] font-black ${docProfile.text} uppercase mb-2`}>Bio Singkat & Layanan</p>
               <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                 {docProfile.bio}
               </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}