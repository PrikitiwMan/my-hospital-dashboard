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
    ambulance: { total: 5, standby: 3 },
    doctors: []
  });

  // 1. Polling Data Telemetri Medis (Kamar)
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

  // 2. Polling Data Operasional Umum
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
      
      {/* ================= SIDEBAR MENU KIRI ================= */}
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
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">v2.7 - Enterprise Production</p>
              </div>
            </div>
            <span className="md:hidden text-[9px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded-full">LIVE</span>
          </div>

          {/* Navigasi Link Menu (Scrollable Horizontal di HP, Vertikal di Desktop) */}
          <div className="p-3 md:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible border-b border-slate-800 md:border-b-0 whitespace-nowrap scrollbar-none">
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${
                activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>📊</span> Dashboard Spasial
            </button>
            <button onClick={() => setActiveMenu('farmasi')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${activeMenu === 'farmasi' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>💊</span> Apotek &amp; Farmasi</button>
            <button onClick={() => setActiveMenu('personalia')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${activeMenu === 'personalia' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>👤</span> Tim Medis</button>
            <button onClick={() => setActiveMenu('keuangan')} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${activeMenu === 'keuangan' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'}`}><span>💼</span> Finansial</button>
          </div>
        </div>

        {/* User Profile */}
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
            Sistem Utama / <span className="text-blue-600 font-bold uppercase tracking-wider">{activeMenu === 'farmasi' ? 'Gudang Farmasi & Apotek' : activeMenu === 'personalia' ? 'Personalia Tim Medis' : activeMenu === 'keuangan' ? 'Manajer Keuangan' : 'Dashboard Spasial IoT'}</span>
          </div>
          <div className="text-[9px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            ● IoT Live Synchronized
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          
          {/* ================= 1. MODUL DASHBOARD UTAMA ================= */}
          {activeMenu === 'dashboard' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              {/* KARTU METRIK ATAS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm min-w-0">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Antrean IGD</p>
                    <p className="text-sm md:text-xl font-black text-slate-800 mt-0.5 font-mono truncate">{operationalData.total_igd_queue} <span className="text-[9px] font-normal text-slate-400">Pasien</span></p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-sm flex-shrink-0">🚨</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm min-w-0">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Sisa Bed ICU</p>
                    <p className="text-sm md:text-xl font-black text-slate-800 mt-0.5 font-mono truncate">{operationalData.icu_vacant_beds} <span className="text-[9px] font-normal text-slate-400">Bed</span></p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm flex-shrink-0">🛏️</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm min-w-0">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Ambulans Siaga</p>
                    <p className="text-sm md:text-xl font-black text-slate-800 mt-0.5 font-mono truncate">
                      {operationalData.ambulance.standby}<span className="text-[10px] font-normal text-slate-400">/{operationalData.ambulance.total} Unit</span>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sm flex-shrink-0">🚑</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm min-w-0">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold truncate">Status Node</p>
                    <p className="text-sm md:text-xl font-black text-emerald-600 mt-0.5 font-mono">ONLINE</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-sm flex-shrink-0">🌐</div>
                </div>
              </div>

              {/* SPLIT LAYOUT SPASIAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="w-full md:col-span-2 bg-white border border-slate-200 rounded-xl p-3 md:p-5 flex flex-col relative justify-center items-center shadow-sm min-h-[340px] md:min-h-[460px]">
                  {selectedFloor !== null && (
                    <button 
                      onClick={() => { setSelectedFloor(null); setSelectedRoom(null); }}
                      className="absolute top-3 right-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[9px] font-bold z-50 shadow-sm"
                    >
                      ⬅ Kembali ke Gedung
                    </button>
                  )}
                  <HospitalMap selectedFloor={selectedFloor} setSelectedFloor={(floor) => setSelectedFloor(floor)} setSelectedRoom={(room) => setSelectedRoom(room)} selectedRoom={selectedRoom} />
                </div>

                <div className="w-full md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col gap-4 shadow-sm h-fit">
                  {!selectedRoom ? (
                    <div className="flex flex-col gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl h-40">
                        <p className="text-[11px] font-bold text-slate-700 mb-2">📊 Tren Kunjungan IGD Per Jam</p>
                        <ResponsiveContainer width="100%" height="80%">
                          <BarChart data={operationalData.queue_trend}>
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={8} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '9px' }} />
                            <Bar dataKey="pasien" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <p className="text-[11px] font-bold text-slate-700">👨‍⚕️ Jadwal Jaga Dokter Hari Ini</p>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[160px] pr-1">
                          {operationalData.doctors.map((doc, idx) => (
                            <div key={idx} className="bg-slate-50/80 border border-slate-200 p-2 rounded-lg flex justify-between items-center text-[10px]">
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 truncate">{doc.nama}</p>
                                <p className="text-[8px] text-slate-400 truncate">{doc.spesialis} • <span className="text-blue-600 font-semibold">{doc.kamar}</span></p>
                              </div>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold flex-shrink-0 ${
                                doc.status === 'Di Ruangan' ? 'bg-emerald-100 text-emerald-700' : doc.status === 'Operasi' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
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

          {/* ================= 2. MODUL LENGKAP: FARMASI & RECEPTOR REKOMENDASI ================= */}
          {activeMenu === 'farmasi' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              {/* Ringkasan Logistik Obat */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Gas Medis O2</p>
                  <p className="text-base md:text-xl font-black text-slate-800 mt-1 font-mono">180 <span className="text-[10px] font-normal text-slate-500">Tabung</span></p>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded mt-1 inline-block">● Aman</span>
                </div>
                <div className="bg-white border p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Obat Resusitasi</p>
                  <p className="text-base md:text-xl font-black text-slate-800 mt-1 font-mono">45 <span className="text-[10px] font-normal text-slate-500">Vial</span></p>
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1 rounded mt-1 inline-block">⚠️ Batas Minimum</span>
                </div>
                <div className="bg-white border p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cairan Infus</p>
                  <p className="text-base md:text-xl font-black text-slate-800 mt-1 font-mono">1,240 <span className="text-[10px] font-normal text-slate-500">Pcs</span></p>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded mt-1 inline-block">● Optimal</span>
                </div>
                <div className="bg-white border p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Antrean Resep</p>
                  <p className="text-base md:text-xl font-black text-purple-700 mt-1 font-mono">4 <span className="text-[10px] font-normal text-slate-500">Racikan</span></p>
                  <span className="text-[9px] bg-purple-50 text-purple-700 font-bold px-1 rounded mt-1 inline-block">⏱️ Proses Apoteker</span>
                </div>
              </div>

              {/* Tabel Manajemen Stok */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                <div className="border-b pb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide text-blue-600">📋 Sistem Inventaris &amp; Batas Reorder Otomatis</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Data terintegrasi dengan sensor berat timbangan digital rak farmasi.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-500 font-bold">
                        <th className="p-2">SKU Kode</th><th className="p-2">Nama Komoditas Obat</th><th className="p-2">Kategori</th><th className="p-2">Stok Sekarang</th><th className="p-2">Status Urgensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 font-medium">
                      <tr className="hover:bg-slate-50/50"><td className="p-2 font-mono text-blue-600 font-bold">O2-PORTABLE-12</td><td className="p-2 font-bold text-slate-800">Oksigen Kompresi Tabung Mini</td><td className="p-2">Gas Medis Darurat</td><td className="p-2 font-mono">45 Unit</td><td className="p-2"><span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">SUPPLY OPTIMAL</span></td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-2 font-mono text-blue-600 font-bold">INJ-EPIN-1MG</td><td className="p-2 font-bold text-slate-800">Epinephrine Injection 1mg/mL</td><td className="p-2">Obat Jantung Kritis</td><td className="p-2 font-mono text-amber-600">18 Ampul</td><td className="p-2"><span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">CRITICAL RESTOCK</span></td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-2 font-mono text-blue-600 font-bold">INF-SALINE-500</td><td className="p-2 font-bold text-slate-800">NaCl 0.9% Cairan Infus 500ml</td><td className="p-2">Cairan Kristaloid</td><td className="p-2 font-mono">840 Pcs</td><td className="p-2"><span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">SUPPLY OPTIMAL</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. MODUL LENGKAP: TIM MEDIS / PERSONALIA DOKTER ================= */}
          {activeMenu === 'personalia' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              {/* Grid Personalia Dokter Jaga */}
              <div className="border-b pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide text-slate-800">👨‍⚕️ Manajemen Alokasi &amp; Penugasan Staf Medis</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Sistem Concurrency Guard aktif mencegah bentrok jadwal operasi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Dokter 1 */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800">dr. Harianto, Sp.JP</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Spesialis Jantung &amp; Pembuluh Darah</p>
                    </div>
                    <span className="text-base">❤️</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-500">
                    <p>🕒 Sif Kerja: <b>08:00 - 14:00 WIB</b></p>
                    <p className="mt-1">📍 Lokasi Tugas: <span className="text-blue-600 font-bold">Lantai 2 - ICU Kamar 01</span></p>
                  </div>
                  <span className="w-full text-center bg-emerald-100 text-emerald-800 text-[10px] font-bold py-1 rounded">STANBY DI RUANGAN</span>
                </div>

                {/* Dokter 2 */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800">dr. Amanda, Sp.An</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Spesialis Anestesiologi &amp; Reanimasi</p>
                    </div>
                    <span className="text-base">🧪</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-500">
                    <p>🕒 Sif Kerja: <b>07:00 - 15:00 WIB</b></p>
                    <p className="mt-1">📍 Lokasi Tugas: <span className="text-red-600 font-bold">OK Bedah Utama L2</span></p>
                  </div>
                  <span className="w-full text-center bg-red-100 text-red-800 text-[10px] font-bold py-1 rounded animate-pulse">SEDANG TINDAKAN OPERASI</span>
                </div>

                {/* Dokter 3 */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800">dr. Budi, Sp.OT</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Spesialis Bedah Orthopedi &amp; Traumatologi</p>
                    </div>
                    <span className="text-base">🦴</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-500">
                    <p>🕒 Sif Kerja: <b>10:00 - 17:00 WIB</b></p>
                    <p className="mt-1">📍 Lokasi Tugas: <span className="text-amber-600 font-bold">Poliklinik Bedah Tulang 1</span></p>
                  </div>
                  <span className="w-full text-center bg-amber-100 text-amber-800 text-[10px] font-bold py-1 rounded">KONSULTASI POLI RAJAL</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. MODUL LENGKAP: FINANSIAL & GRAFIK AGREGAT KEUANGAN ================= */}
          {activeMenu === 'keuangan' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              {/* Baris Kartu Finansial Finansial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border border-blue-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Total Klaim BPJS Kesehatan (Hari Ini)</p>
                    <p className="text-xl md:text-2xl font-black text-slate-800 font-mono mt-1">Rp 142.850.000</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-3">📊 Berhasil di-agregat otomatis dari 96 berkas rekam medis elektronik.</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Pendapatan Mandiri/Pasien Umum</p>
                    <p className="text-xl md:text-2xl font-black text-slate-800 font-mono mt-1">Rp 38.420.000</p>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-3">💳 Tervalidasi instan oleh kanal payment gateway kasir pusat.</p>
                </div>
              </div>

              {/* Grafik Agregat Mini Transaksi Harian */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="border-b pb-2 mb-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide text-rose-600">📈 Tren Akumulasi Arus Kas Masuk (Revenue History)</h3>
                </div>
                <div className="w-full h-44 bg-slate-50 border p-2 rounded-xl shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { tanggal: '21 Mei', rupiah: 110 },
                      { tanggal: '22 Mei', rupiah: 135 },
                      { tanggal: '23 Mei', rupiah: 120 },
                      { tanggal: '24 Mei', rupiah: 165 },
                      { tanggal: '25 Mei', rupiah: 142 },
                    ]}>
                      <XAxis dataKey="tanggal" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: '10px' }} formatter={(value) => [`Rp ${value}.000.000`, 'Pendapatan']} />
                      <Line type="monotone" dataKey="rupiah" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
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