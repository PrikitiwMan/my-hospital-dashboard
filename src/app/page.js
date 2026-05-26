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
    // Mengubah h-screen menjadi md:h-screen dan overflow-hidden menjadi overflow-y-auto di mobile agar bisa di-scroll ke bawah
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen w-screen bg-[#f4f6f9] text-slate-700 font-sans overflow-y-auto md:overflow-hidden">
      
      {/* ================= SIDEBAR MENU KIRI ================= */}
      {/* Menyesuaikan w-full di mobile dan w-64 di desktop */}
      <div className="w-full md:w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shadow-xl flex-shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-[#1e293b]">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">MediCenter.OS</h1>
              <p className="text-[10px] text-slate-400 font-medium">v2.1 - Mobile Responsive</p>
            </div>
          </div>

          {/* Navigasi Link Menu */}
          <div className="p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>📊</span> Dashboard
            </button>
            <button onClick={() => setActiveMenu('farmasi')} className={`flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeMenu === 'farmasi' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>💊</span> Farmasi</button>
            <button onClick={() => setActiveMenu('personalia')} className={`flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeMenu === 'personalia' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>👤</span> Dokter</button>
            <button onClick={() => setActiveMenu('keuangan')} className={`flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeMenu === 'keuangan' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>💼</span> Keuangan</button>
          </div>
        </div>

        {/* User Profile */}
        <div className="hidden md:flex p-4 border-t border-slate-800 items-center gap-3 bg-[#131c2e]">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">UGM</div>
          <div>
            <p className="text-xs font-bold text-white">Dosen Penguji</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA SEBELAH KANAN ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Navbar */}
        <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="text-xs font-medium text-slate-500">
            Home / <span className="text-slate-800 font-semibold uppercase">{activeMenu}</span>
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-slate-200">
            📍 Live Connected
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          
          {/* ================= 1. HALAMAN DASHBOARD MAIN LAYOUT ================= */}
          {activeMenu === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Kartu Metrik Operasional Atas: Menggunakan 2 kolom di HP, 4 kolom di PC */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-semibold">Kunjungan IGD</p>
                    <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1 font-mono">{operationalData.total_igd_queue}</p>
                  </div>
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-amber-50 flex items-center justify-center text-base md:text-xl">🚨</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-semibold">Bed ICU</p>
                    <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1 font-mono">{operationalData.icu_vacant_beds}</p>
                  </div>
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-base md:text-xl">🛏️</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-semibold">Ambulans</p>
                    <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1 font-mono">
                      {operationalData.ambulance.standby}<span className="text-xs font-normal text-slate-400">/{operationalData.ambulance.total}</span>
                    </p>
                  </div>
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-sky-50 flex items-center justify-center text-base md:text-xl">🚑</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-semibold">IoT Node</p>
                    <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1 font-mono">2 Aktif</p>
                  </div>
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-base md:text-xl">🌐</div>
                </div>
              </div>

              {/* Split Layout Responsif: Tumpuk bawah di HP (flex-col), Sampingan di PC (md:grid-cols-3) */}
              <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
                
                {/* BLOK KIRI: Peta Gedung */}
                <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col relative justify-center items-center shadow-sm min-h-[350px] md:min-h-[450px]">
                  {selectedFloor !== null && (
                    <button 
                      onClick={() => { setSelectedFloor(null); setSelectedRoom(null); }}
                      className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold z-50 shadow-sm"
                    >
                      ⬅ Kembali
                    </button>
                  )}
                  <HospitalMap 
                    selectedFloor={selectedFloor} 
                    setSelectedFloor={(floor) => setSelectedFloor(floor)} 
                    setSelectedRoom={(room) => setSelectedRoom(room)}
                    selectedRoom={selectedRoom}
                  />
                </div>

                {/* BLOK KANAN: Detail Kamar / Grafik Analytics */}
                <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col gap-5 shadow-sm min-h-[350px]">
                  {!selectedRoom ? (
                    <div className="flex flex-col gap-5 h-full justify-between">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl h-44 flex-shrink-0">
                        <p className="text-xs font-bold text-slate-700 mb-2">📈 Tren Kunjungan IGD</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={operationalData.queue_trend}>
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '10px' }} />
                            <Bar dataKey="pasien" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex flex-col gap-2 flex-1 mt-2">
                        <p className="text-xs font-bold text-slate-700">👨‍⚕️ Penugasan Dokter</p>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[180px] pr-1">
                          {operationalData.doctors.map((doc, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 p-2 rounded-lg flex justify-between items-center text-[11px]">
                              <div>
                                <p className="font-bold text-slate-800">{doc.nama}</p>
                                <p className="text-[9px] text-slate-400">{doc.spesialis} • <span className="text-blue-600 font-semibold">{doc.kamar}</span></p>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
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

          {/* ================= MODUL-MODUL LAIN ================= */}
          {activeMenu === 'farmasi' && <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-sm">💊 Modul Gudang Farmasi Aktif</div>}
          {activeMenu === 'personalia' && <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-sm">👤 Modul Kepegawaian Dokter Aktif</div>}
          {activeMenu === 'keuangan' && <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-sm">💼 Modul Finansial Rumah Sakit Aktif</div>}

        </div>
      </div>

    </div>
  );
}