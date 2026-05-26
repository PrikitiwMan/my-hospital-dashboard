'use client';
import { useState, useEffect } from 'react';
import HospitalMap from '@/components/HospitalMap';
import RoomDetailCard from '@/components/RoomDetailCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [operationalData, setOperationalData] = useState({
    total_igd_queue: 14,
    icu_vacant_beds: 1,
    queue_trend: [],
    ambulance: { total: 5, standby: 3 },
    doctors: []
  });

  // Polling Data Telemetri Medis (Kamar)
  useEffect(() => {
    let interval;
    if (selectedRoom) {
      const fetchRoomData = () => {
        fetch(`/api/rooms/${selectedRoom}`)
          .then((res) => res.json())
          .then((data) => setRoomData(data))
          .catch((err) => console.error("Error telemetry fetch:", err));
      };
      fetchRoomData();
      interval = setInterval(fetchRoomData, 3000);
    } else {
      setRoomData(null);
    }
    return () => clearInterval(interval);
  }, [selectedRoom]);

  // Polling Data Operasional Umum
  useEffect(() => {
    const fetchOperationalData = () => {
      fetch('/api/telemetry')
        .then((res) => {
          if (!res.ok) throw new Error("Respon server bermasalah");
          return res.json();
        })
        .then((data) => {
          if (data && !data.error) {
            setOperationalData(data);
          }
        })
        .catch((err) => console.error("Error operational fetch:", err));
    };
    fetchOperationalData();
    const interval = setInterval(fetchOperationalData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-screen bg-[#f4f6f9] text-slate-700 font-sans overflow-y-auto md:overflow-hidden">
      
      {/* ================= SIDEBAR MENU KIRI (RESPONSIF MOBILE NYAMAN) ================= */}
      <div className="w-full md:w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shadow-xl flex-shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between md:justify-start gap-3 bg-[#1e293b]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md">
                M
              </div>
              <div>
                <h1 className="text-xs md:text-sm font-bold text-white tracking-wide">MediCenter.OS</h1>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">v2.5 - Stable Mobile</p>
              </div>
            </div>
            <span className="md:hidden text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded-full">MOBILE</span>
          </div>

          {/* Navigasi Link Menu - Menggunakan Scroll Horizontal di HP agar muat */}
          <div className="p-3 md:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-none border-b border-slate-800 md:border-b-0">
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${
                activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>📊</span> Dashboard Spasial
            </button>
            <button onClick={() => setActiveMenu('farmasi')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${activeMenu === 'farmasi' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>💊</span> Apotek &amp; Farmasi</button>
            <button onClick={() => setActiveMenu('personalia')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${activeMenu === 'personalia' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>👤</span> Tim Medis</button>
            <button onClick={() => setActiveMenu('keuangan')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${activeMenu === 'keuangan' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>💼</span> Finansial</button>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="hidden md:flex p-4 border-t border-slate-800 items-center gap-3 bg-[#131c2e]">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">UGM</div>
          <div>
            <p className="text-xs font-bold text-white">Dosen Penguji</p>
            <p className="text-[10px] text-slate-400">Teknik Fisika UGM</p>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA SEBELAH KANAN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <div className="h-12 md:h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="text-[11px] md:text-xs font-medium text-slate-500">
            Sistem Utama / <span className="text-blue-600 font-bold uppercase tracking-wider">{activeMenu}</span>
          </div>
          <div className="text-[9px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shadow-sm animate-pulse">
            ● IoT Live Synchronized
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          
          {/* ================= 1. MODUL DASHBOARD UTAMA ================= */}
          {activeMenu === 'dashboard' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              
              {/* KARTU METRIK ATAS (Perbaikan ukuran font teks agar TIDAK MELUBER di HP) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Antrean IGD</p>
                    <p className="text-lg md:text-2xl font-black text-slate-800 mt-0.5 font-mono">{operationalData.total_igd_queue} <span className="text-[9px] md:text-xs font-semibold text-slate-400">pasien</span></p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-sm flex-shrink-0">🚨</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Sisa Bed ICU</p>
                    <p className="text-lg md:text-2xl font-black text-slate-800 mt-0.5 font-mono">{operationalData.icu_vacant_beds} <span className="text-[9px] md:text-xs font-semibold text-slate-400">bed</span></p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm flex-shrink-0">🛏️</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Ambulans</p>
                    <p className="text-base md:text-2xl font-black text-slate-800 mt-0.5 font-mono whitespace-nowrap">
                      {operationalData.ambulance.standby} <span className="text-[9px] md:text-xs font-normal text-slate-400">Siaga / {operationalData.ambulance.total}</span>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sm flex-shrink-0"> Ambulans 🚑 </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Status IoT</p>
                    <p className="text-lg md:text-2xl font-black text-emerald-600 mt-0.5 font-mono">ONLINE</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-sm flex-shrink-0">🌐</div>
                </div>
              </div>

              {/* SPLIT LAYOUT UTAMA (Perbaikan Frame Patah di HP - Menggunakan flex-col penuh) */}
              <div className="flex flex-col md:grid md:grid-cols-3 gap-5">
                
                {/* Frame Denah Spasial */}
                <div className="w-full md:col-span-2 bg-white border border-slate-200 rounded-xl p-3 md:p-5 flex flex-col relative justify-center items-center shadow-sm min-h-[340px] md:min-h-[460px]">
                  {selectedFloor !== null && (
                    <button 
                      onClick={() => { setSelectedFloor(null); setSelectedRoom(null); }}
                      className="absolute top-3 right-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[9px] font-bold z-50 shadow-sm"
                    >
                      ⬅ Kembali ke Gedung
                    </button>
                  )}
                  <HospitalMap 
                    selectedFloor={selectedFloor} 
                    setSelectedFloor={(floor) => setSelectedFloor(floor)} 
                    setSelectedRoom={(room) => setSelectedRoom(room)}
                    selectedRoom={selectedRoom}
                  />
                </div>

                {/* Frame Detal Kamar / Analisis Data Gawat Darurat */}
                <div className="w-full md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col gap-4 shadow-sm min-h-[320px]">
                  {!selectedRoom ? (
                    <div className="flex flex-col gap-4 h-full justify-between">
                      {/* Grafik Tren */}
                      <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl h-40 flex-shrink-0">
                        <p className="text-[11px] font-bold text-slate-700 mb-2">📊 Tren Kunjungan IGD Per Jam</p>
                        <ResponsiveContainer width="100%" height="80%">
                          <BarChart data={operationalData.queue_trend}>
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={8} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '9px' }} />
                            <Bar dataKey="pasien" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Penugasan Dokter */}
                      <div className="flex flex-col gap-1.5 flex-1 mt-1">
                        <p className="text-[11px] font-bold text-slate-700">👨‍⚕️ Jadwal Jaga Dokter Hari Ini</p>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[160px] pr-1">
                          {operationalData.doctors.map((doc, idx) => (
                            <div key={idx} className="bg-slate-50/80 border border-slate-200 p-2 rounded-lg flex justify-between items-center text-[10px]">
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate">{doc.nama}</p>
                                <p className="text-[8px] text-slate-400 truncate">{doc.spesialis} • <span className="text-blue-600 font-semibold">{doc.kamar}</span></p>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold flex-shrink-0 ${
                                doc.status === 'Di Ruangan' ? 'bg-emerald-100 text-emerald-700' :
                                doc.status === 'Operasi' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>{doc.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <RoomDetailCard data={roomData} onClose={() => setSelectedRoom(null)} />
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ================= 2. MODUL FARMASI (KINI AKTIF & BERWARNA) ================= */}
          {activeMenu === 'farmasi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b pb-2 text-blue-600">📦 Inventaris Utama Obat</h3>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex justify-between text-xs bg-slate-50 p-2 rounded border">
                    <span>Paracetamol Infus 500mg</span>
                    <span className="font-mono font-bold text-emerald-600">142 Botol (Aman)</span>
                  </div>
                  <div className="flex justify-between text-xs bg-slate-50 p-2 rounded border">
                    <span>Epinephrine Inj 1mg/mL</span>
                    <span className="font-mono font-bold text-amber-600">18 Ampul (Sisa Sedikit)</span>
                  </div>
                  <div className="flex justify-between text-xs bg-slate-50 p-2 rounded border">
                    <span>Oksigen Tabung Portable</span>
                    <span className="font-mono font-bold text-emerald-600">45 Unit (Aman)</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b pb-2 text-purple-600">⏳ Resep Antrean Apotek</h3>
                <div className="mt-3 flex flex-col gap-2 text-xs">
                  <div className="p-2 border border-dashed rounded bg-purple-50/40">Resep #0924A - Pasien Tn. Bambang P. <span className="font-bold text-purple-700 float-right">[Sedang Racik]</span></div>
                  <div className="p-2 border border-dashed rounded bg-slate-50">Resep #0925A - Pasien Ny. Ratna G. <span className="font-bold text-slate-400 float-right">[Antre]</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. MODUL TIM MEDIS / PERSONALIA ================= */}
          {activeMenu === 'personalia' && (
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm animate-fade-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b pb-2 text-slate-800">📋 Manajemen Kepegawaian &amp; Absensi Dokter</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                <div className="p-3 border rounded-xl bg-emerald-50/50">
                  <p className="font-bold text-emerald-800">dr. Harianto, Sp.JP</p>
                  <p className="text-[10px] text-slate-400">Dokter Spesialis Jantung</p>
                  <span className="mt-2 inline-block bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">HADIR - STANDBY</span>
                </div>
                <div className="p-3 border rounded-xl bg-red-50/50">
                  <p className="font-bold text-red-800">dr. Amanda, Sp.An</p>
                  <p className="text-[10px] text-slate-400">Dokter Spesialis Anestesi</p>
                  <span className="mt-2 inline-block bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">DI KAMAR OPERASI</span>
                </div>
                <div className="p-3 border rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-700">dr. Budi, Sp.OT</p>
                  <p className="text-[10px] text-slate-400">Dokter Spesialis Orthopedi</p>
                  <span className="mt-2 inline-block bg-slate-600 text-white font-bold px-1.5 py-0.5 rounded text-[9px]">HADIR - POLIKLINIK</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. MODUL FINANSIAL / KEUANGAN ================= */}
          {activeMenu === 'keuangan' && (
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm animate-fade-in">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b pb-2 text-rose-600">💼 Ringkasan Kas &amp; Alokasi Klaim BPJS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="border p-3 rounded-xl bg-slate-50/60">
                  <p className="text-slate-400 font-medium">Dana Klaim BPJS Terproses</p>
                  <p className="text-lg font-bold text-slate-800 font-mono mt-1">Rp 412.500.000</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-blue-500 h-full w-[78%]"></div></div>
                </div>
                <div className="border p-3 rounded-xl bg-slate-50/60">
                  <p className="text-slate-400 font-medium">Anggaran Pemeliharaan Node IoT Medis</p>
                  <p className="text-lg font-bold text-slate-800 font-mono mt-1">Rp 15.000.000</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-emerald-500 h-full w-[100%]"></div></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}