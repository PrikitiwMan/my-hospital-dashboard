'use client';
import { useState, useEffect } from 'react';
import HospitalMap from '@/components/HospitalMap';
import RoomDetailCard from '@/components/RoomDetailCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Home() {
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [operationalData, setOperationalData] = useState({
    total_igd_queue: 14,
    icu_vacant_beds: 1,
    queue_trend: [],
    ambulance: { 
      total: 5, 
      standby: 3,
      gps: [
        { id: 'AMB-01', location: 'Jl. Kaliurang Km 5', status: 'Menuju TKP' },
        { id: 'AMB-02', location: 'Base RS (Gedung A)', status: 'Standby' },
        { id: 'AMB-03', location: 'Ringroad Utara', status: 'Menuju RS' },
        { id: 'AMB-04', location: 'Pos Medik Timur', status: 'Standby' },
        { id: 'AMB-05', location: 'Area Parkir VIP', status: 'Standby' }
      ]
    },
    doctors: []
  });

  // LOGIKA PERBAIKAN: Hitung jumlah Standby secara real-time dari list GPS
  const currentStandbyCount = operationalData.ambulance.gps?.filter(loc => loc.status === 'Standby').length || 0;

  // Efek Rute GPS Ambulans (Multitasking Tracker)
  useEffect(() => {
    const ruteA = ['Jl. Kaliurang Km 5', 'Perempatan Kentungan', 'Ringroad Utara', 'Jl. Monjali', 'RSUP Dr. Sardjito', 'Gerbang Utama Kampus'];
    const ruteB = ['Jl. Magelang', 'Kawasan TVRI', 'Bundaran UGM', 'Klinik Korpri', 'Gedung Pusat UGM', 'Gedung Teknik Fisika'];
    
    let step = 0;
    
    const gpsInterval = setInterval(() => {
      step = (step + 1) % ruteA.length;
      setOperationalData(prev => ({
        ...prev,
        ambulance: {
          ...prev.ambulance,
          gps: prev.ambulance.gps?.map(loc => {
            if (loc.id === 'AMB-01') {
               return { ...loc, location: ruteA[step], status: 'Menuju TKP' };
            }
            if (loc.id === 'AMB-03') {
               return { ...loc, location: ruteB[step], status: 'Menuju RS' };
            }
            return loc;
          }) || []
        }
      }));
    }, 4500);
    return () => clearInterval(gpsInterval);
  }, []);

  // Polling Sensor Ruangan
  useEffect(() => {
    let interval;
    if (selectedRoom) {
      const fetchRoomData = () => {
        fetch(`/api/rooms/${selectedRoom}`)
          .then((res) => {
            if (!res.ok) throw new Error("Ruangan tidak ditemukan di API");
            return res.json();
          })
          .then((data) => setRoomData(data))
          .catch((err) => {
            console.error("Error telemetry fetch:", err);
            setRoomData({ error: "Data sensor ruangan ini belum tersedia di API" }); 
          });
      };
      fetchRoomData();
      interval = setInterval(fetchRoomData, 3000);
    } else {
      setRoomData(null);
    }
    return () => clearInterval(interval);
  }, [selectedRoom]);

  // Polling Data Operasional
  useEffect(() => {
    const fetchOperationalData = () => {
      fetch('/api/telemetry')
        .then((res) => {
          if (!res.ok) throw new Error("Respon server bermasalah");
          return res.json();
        })
        .then((data) => {
          if (data && !data.error) {
            setOperationalData(prev => ({
              ...data,
              ambulance: { ...data.ambulance, gps: prev.ambulance.gps } 
            }));
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
      
      {/* ================= SIDEBAR MENU ================= */}
      <div className="w-full md:w-64 bg-indigo-950 text-indigo-100 flex flex-col justify-between shadow-2xl flex-shrink-0">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 md:p-5 border-b border-indigo-900 flex items-center justify-between md:justify-start gap-3 bg-indigo-900/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-base md:text-lg shadow-lg shadow-blue-500/30">
                M
              </div>
              <div>
                <h1 className="text-xs md:text-sm font-black text-white tracking-wide">MediCenter.OS</h1>
                <p className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase tracking-wider">v3.0 - Enterprise</p>
              </div>
            </div>
            <span className="md:hidden text-[9px] bg-cyan-500/20 text-cyan-400 font-mono px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>

          <div className="p-3 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible border-b border-indigo-900 md:border-b-0 whitespace-nowrap scrollbar-none">
            <button onClick={() => setActiveMenu('dashboard')} className={`flex-shrink-0 flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] md:text-xs font-bold transition-all ${activeMenu === 'dashboard' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-indigo-900/60 text-indigo-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Dashboard Spasial
            </button>
            <button onClick={() => setActiveMenu('farmasi')} className={`flex-shrink-0 flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] md:text-xs font-bold transition-all ${activeMenu === 'farmasi' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-indigo-900/60 text-indigo-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              Apotek & Farmasi
            </button>
            <button onClick={() => setActiveMenu('personalia')} className={`flex-shrink-0 flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] md:text-xs font-bold transition-all ${activeMenu === 'personalia' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-indigo-900/60 text-indigo-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Profil Layanan Medis
            </button>
            <button onClick={() => setActiveMenu('keuangan')} className={`flex-shrink-0 flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] md:text-xs font-bold transition-all ${activeMenu === 'keuangan' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-indigo-900/60 text-indigo-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Finansial
            </button>
          </div>

          <div className="hidden md:flex flex-col flex-1 justify-end p-4 min-h-0">
            <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-2xl p-4 backdrop-blur-sm flex flex-col min-h-0">
              <p className="text-[10px] font-black text-cyan-400 mb-3 uppercase tracking-widest flex items-center gap-2 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> Live Fleet Tracker
              </p>
              <div className="flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
                {operationalData.ambulance.gps?.map(loc => (
                  <div key={loc.id} className="flex justify-between items-center bg-indigo-950/80 p-2.5 rounded-xl border border-indigo-800 shadow-inner flex-shrink-0">
                    <div className="min-w-0">
                      <p className="text-white font-black text-[9px]">{loc.id}</p>
                      <p className="text-indigo-300 text-[8px] mt-0.5 flex items-center gap-1 truncate">
                        <svg className="w-2.5 h-2.5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        {loc.location}
                      </p>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-md font-black text-[7px] uppercase tracking-wider flex-shrink-0 ${loc.status.includes('Menuju') ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                      {loc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 md:h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-sm flex-shrink-0 z-10">
          <div className="text-[11px] md:text-xs font-medium text-slate-500">
            Sistem Utama / <span className="text-blue-600 font-bold uppercase tracking-wider">{activeMenu === 'farmasi' ? 'Gudang Farmasi & Apotek' : activeMenu === 'personalia' ? 'Spesialis & Layanan Medis' : activeMenu === 'keuangan' ? 'Manajer Keuangan' : 'DASHBOARD SPASIAL IOT'}</span>
          </div>
          <div className="text-[9px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> IoT Live Synchronized
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50">
          
          {/* ================= 1. MODUL DASHBOARD UTAMA ================= */}
          {activeMenu === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-rose-500/30 min-w-0 border border-white/20">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-white/80 font-black truncate uppercase tracking-widest">Antrean IGD</p>
                    <p className="text-xl md:text-3xl font-black text-white mt-1 font-mono truncate">{operationalData.total_igd_queue} <span className="text-[10px] font-bold text-white/70">Pasien</span></p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/30 min-w-0 border border-white/20">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-white/80 font-black truncate uppercase tracking-widest">Sisa Bed ICU</p>
                    <p className="text-xl md:text-3xl font-black text-white mt-1 font-mono truncate">{operationalData.icu_vacant_beds} <span className="text-[10px] font-bold text-white/70">Bed</span></p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                </div>

                {/* SINKRONISASI: Menggunakan currentStandbyCount agar sesuai list */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-blue-500/30 min-w-0 border border-white/20">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-white/80 font-black truncate uppercase tracking-widest">Ambulans Siaga</p>
                    <p className="text-xl md:text-3xl font-black text-white mt-1 font-mono truncate">
                      {currentStandbyCount}<span className="text-[10px] md:text-sm font-bold text-white/70">/{operationalData.ambulance.total} Unit</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-500/30 min-w-0 border border-white/20">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-white/80 font-black truncate uppercase tracking-widest">Status Node</p>
                    <p className="text-xl md:text-3xl font-black text-white mt-1 font-mono">ONLINE</p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="w-full md:col-span-2 bg-white border border-slate-200 rounded-3xl p-3 md:p-5 flex flex-col relative justify-center items-center shadow-xl shadow-slate-200/50 min-h-[340px] md:min-h-[460px] overflow-hidden">
                  {selectedFloor !== null && (
                    <button 
                      onClick={() => { setSelectedFloor(null); setSelectedRoom(null); }}
                      className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold z-50 shadow-lg transition-all"
                    >
                      ⬅ Gedung Utama
                    </button>
                  )}
                  <HospitalMap selectedFloor={selectedFloor} setSelectedFloor={(floor) => setSelectedFloor(floor)} setSelectedRoom={(room) => setSelectedRoom(room)} selectedRoom={selectedRoom} />
                </div>

                <div className="w-full md:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 md:p-6 flex flex-col gap-6 shadow-xl shadow-slate-200/50 h-fit">
                  {!selectedRoom ? (
                    <div className="flex flex-col gap-6">
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl h-48 shadow-inner">
                        <p className="text-[11px] font-black text-slate-700 mb-4 tracking-wider flex items-center gap-2">
                           <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                           TREN KUNJUNGAN IGD PER JAM
                        </p>
                        <ResponsiveContainer width="100%" height="80%" minWidth={1} minHeight={1}>
                          <BarChart data={operationalData.queue_trend}>
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                            <Bar dataKey="pasien" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
                            <defs>
                              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={1}/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex flex-col gap-3">
                        <p className="text-[11px] font-black text-slate-700 tracking-wider uppercase">Layanan Spesialis Unggulan</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-3 transition hover:shadow-md cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                            </div>
                            <span className="text-[11px] font-bold text-rose-900">Cardiology</span>
                          </div>
                          <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center gap-3 transition hover:shadow-md cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span className="text-[11px] font-bold text-indigo-900">Pediatric</span>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3 transition hover:shadow-md cursor-pointer col-span-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-900">Orthopedic & Trauma</span>
                          </div>
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

          {/* ================= 2. MODUL FARMASI ================= */}
          {activeMenu === 'farmasi' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gas Medis O2</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800 mt-1 font-mono">180 <span className="text-[10px] font-normal text-slate-500">Tabung</span></p>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full mt-2 inline-block">● Aman</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Obat Resusitasi</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800 mt-1 font-mono">45 <span className="text-[10px] font-normal text-slate-500">Vial</span></p>
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full mt-2 inline-block">⚠️ Batas Minimum</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cairan Infus</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800 mt-1 font-mono">1,240 <span className="text-[10px] font-normal text-slate-500">Pcs</span></p>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full mt-2 inline-block">● Optimal</span>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Antrean Resep</p>
                  <p className="text-xl md:text-2xl font-black text-indigo-700 mt-1 font-mono">4 <span className="text-[10px] font-normal text-slate-500">Racikan</span></p>
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full mt-2 inline-block animate-pulse">⏱️ Proses Apoteker</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <div className="border-b pb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-indigo-600">Sistem Inventaris &amp; Batas Reorder Otomatis</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Data terintegrasi dengan sensor berat timbangan digital rak farmasi.</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y text-slate-500 font-bold">
                        <th className="p-3">SKU Kode</th><th className="p-3">Nama Komoditas Obat</th><th className="p-3">Kategori</th><th className="p-3">Stok Sekarang</th><th className="p-3">Status Urgensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 font-medium">
                      <tr className="hover:bg-slate-50 transition-colors"><td className="p-3 font-mono text-indigo-600 font-bold">O2-PORTABLE-12</td><td className="p-3 font-bold text-slate-800">Oksigen Kompresi Tabung Mini</td><td className="p-3">Gas Medis Darurat</td><td className="p-3 font-mono">45 Unit</td><td className="p-3"><span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-1 rounded">SUPPLY OPTIMAL</span></td></tr>
                      <tr className="hover:bg-slate-50 transition-colors"><td className="p-3 font-mono text-indigo-600 font-bold">INJ-EPIN-1MG</td><td className="p-3 font-bold text-slate-800">Epinephrine Injection 1mg/mL</td><td className="p-3">Obat Jantung Kritis</td><td className="p-3 font-mono text-rose-600">18 Ampul</td><td className="p-3"><span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-1 rounded animate-pulse">CRITICAL RESTOCK</span></td></tr>
                      <tr className="hover:bg-slate-50 transition-colors"><td className="p-3 font-mono text-indigo-600 font-bold">INF-SALINE-500</td><td className="p-3 font-bold text-slate-800">NaCl 0.9% Cairan Infus 500ml</td><td className="p-3">Cairan Kristaloid</td><td className="p-3 font-mono">840 Pcs</td><td className="p-3"><span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-1 rounded">SUPPLY OPTIMAL</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. MODUL TIM MEDIS ================= */}
          {activeMenu === 'personalia' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">👨‍⚕️ Profil Layanan &amp; Penugasan Spesialis</h3>
                <p className="text-[11px] text-slate-500 mt-1">Informasi lengkap terkait dokter spesialis, jadwal, dan deskripsi layanan klinis.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-md flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-sm text-slate-800">dr. Harianto, Sp.JP</p>
                      <p className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full mt-2 inline-block flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                        Cardiology Center
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">Fokus Layanan:</p>
                    Tindakan invasif kateterisasi jantung, penanganan gagal jantung akut, dan pemasangan pacemaker. Berpengalaman &gt;15 tahun.
                  </div>
                  <div className="flex flex-col gap-2 text-[10px] text-slate-500 mt-2">
                    <p className="flex justify-between border-b pb-1"><span>🕒 Sif Kerja:</span> <b>08:00 - 14:00 WIB</b></p>
                    <p className="flex justify-between"><span>📍 Lokasi Tugas:</span> <span className="text-indigo-600 font-bold">Lantai 2 - ICU 01</span></p>
                  </div>
                  <span className="w-full text-center bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-widest py-2 rounded-lg">LIVE: DI RUANGAN</span>
                </div>
                <div className="bg-white border border-indigo-100 p-5 rounded-2xl shadow-md flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-sm text-slate-800">dr. Amanda, Sp.A</p>
                      <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mt-2 inline-block flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Pediatric Clinic
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">Fokus Layanan:</p>
                    Pemeriksaan tumbuh kembang anak, penanganan asma pediatrik, imunisasi lengkap, dan gawat darurat neonatus (NICU).
                  </div>
                  <div className="flex flex-col gap-2 text-[10px] text-slate-500 mt-2">
                    <p className="flex justify-between border-b pb-1"><span>🕒 Sif Kerja:</span> <b>07:00 - 15:00 WIB</b></p>
                    <p className="flex justify-between"><span>📍 Lokasi Tugas:</span> <span className="text-rose-600 font-bold">OK Bedah L2</span></p>
                  </div>
                  <span className="w-full text-center bg-rose-100 text-rose-800 text-[10px] font-black tracking-widest py-2 rounded-lg animate-pulse">LIVE: OPERASI CITO</span>
                </div>
                <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-md flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-sm text-slate-800">dr. Budi, Sp.OT</p>
                      <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 inline-block flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        Orthopedic &amp; Trauma
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 mb-1">Fokus Layanan:</p>
                    Bedah tulang, penanganan patah tulang pasca kecelakaan, penggantian sendi pinggul, dan kedokteran olahraga.
                  </div>
                  <div className="flex flex-col gap-2 text-[10px] text-slate-500 mt-2">
                    <p className="flex justify-between border-b pb-1"><span>🕒 Sif Kerja:</span> <b>10:00 - 17:00 WIB</b></p>
                    <p className="flex justify-between"><span>📍 Lokasi Tugas:</span> <span className="text-amber-600 font-bold">Poli Tulang</span></p>
                  </div>
                  <span className="w-full text-center bg-amber-100 text-amber-800 text-[10px] font-black tracking-widest py-2 rounded-lg">LIVE: KONSULTASI</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. MODUL FINANSIAL ================= */}
          {activeMenu === 'keuangan' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 border border-indigo-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-indigo-700 font-black uppercase tracking-widest">Total Klaim BPJS (Hari Ini)</p>
                    <p className="text-2xl md:text-3xl font-black text-slate-800 font-mono mt-2">Rp 142.850.000</p>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 mt-4">📊 Di-agregat otomatis dari 96 rekam medis elektronik.</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Pendapatan Pasien Umum</p>
                    <p className="text-2xl md:text-3xl font-black text-slate-800 font-mono mt-2">Rp 38.420.000</p>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 mt-4">💳 Tervalidasi instan oleh kanal payment gateway pusat.</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide text-rose-600">Tren Akumulasi Arus Kas Masuk (Revenue History)</h3>
                </div>
                <div className="w-full h-56 bg-slate-50/50 p-2 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <LineChart data={[
                      { tanggal: '21 Mei', rupiah: 110 },
                      { tanggal: '22 Mei', rupiah: 135 },
                      { tanggal: '23 Mei', rupiah: 120 },
                      { tanggal: '24 Mei', rupiah: 165 },
                      { tanggal: '25 Mei', rupiah: 142 },
                    ]}>
                      <XAxis dataKey="tanggal" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} formatter={(value) => [`Rp ${value}.000.000`, 'Pendapatan']} />
                      <Line type="monotone" dataKey="rupiah" stroke="#4f46e5" strokeWidth={4} dot={{ r: 5, fill: '#4f46e5' }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}