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
  // Polling Data Operasional Umum (Cari bagian ini di src/app/page.js)
  useEffect(() => {
    const fetchOperationalData = () => {
      fetch('/api/telemetry')
        .then((res) => {
          // Amankan jika respon server kosong atau error
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
    <div className="flex h-screen w-screen bg-[#f4f6f9] text-slate-700 font-sans overflow-hidden">
      
      {/* ================= SIDEBAR MENU KIRI ================= */}
      <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shadow-xl flex-shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-[#1e293b]">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">MediCenter.OS</h1>
              <p className="text-[10px] text-slate-400 font-medium">v2.0 - Full Integrated</p>
            </div>
          </div>

          {/* Navigasi Link Menu */}
          <div className="p-4 flex flex-col gap-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
            
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>📊</span> Dashboard Layanan
            </button>
            
            <button 
              onClick={() => setActiveMenu('farmasi')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMenu === 'farmasi' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>💊</span> Gudang Farmasi
            </button>

            <button 
              onClick={() => setActiveMenu('personalia')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMenu === 'personalia' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>👤</span> Personalia Dokter
            </button>

            <button 
              onClick={() => setActiveMenu('keuangan')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMenu === 'keuangan' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800/60'
              }`}
            >
              <span>💼</span> Manajer Keuangan
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-[#131c2e]">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
            UGM
          </div>
          <div>
            <p className="text-xs font-bold text-white">Dosen Penguji</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA SEBELAH KANAN ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Navbar */}
        <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Home</span> <span>/</span> <span className="text-slate-800 font-semibold uppercase tracking-wide">{activeMenu === 'dashboard' ? 'Dashboard Layanan' : activeMenu}</span>
          </div>
          <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            📍 System Status: Connected
          </div>
        </div>

        {/* Workspace Area Router Kondisional */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* ================= 1. HALAMAN UTAMA: DASHBOARD SPASIAL IOT ================= */}
          {activeMenu === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Kartu Metrik Operasional Atas */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide">Kunjungan IGD</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">{operationalData.total_igd_queue}</p>
                    <p className="text-[10px] text-amber-500 font-medium mt-1">● Menunggu Pelayanan</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl">🚨</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide">Ketersediaan Bed ICU</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">{operationalData.icu_vacant_beds}</p>
                    <p className="text-[10px] text-emerald-500 font-medium mt-1">● Bed Kosong Siap</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl">🛏️</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide">Ambulans Standby</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">
                      {operationalData.ambulance.standby}<span className="text-xs font-normal text-slate-400">/{operationalData.ambulance.total}</span>
                    </p>
                    <p className="text-[10px] text-sky-500 font-medium mt-1">● Siaga di Hanggar</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-xl">🚑</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide">Node IoT Kamar</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1 font-mono">2 <span className="text-xs font-normal text-slate-400">Aktif</span></p>
                    <p className="text-[10px] text-blue-500 font-medium mt-1">● Terkoneksi API</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl">🌐</div>
                </div>
              </div>

              {/* Split Layout: Peta Spasial & Detailed Widget */}
              <div className="grid grid-cols-3 gap-6 min-h-[450px]">
                <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-5 flex flex-col relative justify-center items-center shadow-sm">
                  {selectedFloor !== null && (
                    <button 
                      onClick={() => { setSelectedFloor(null); setSelectedRoom(null); }}
                      className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow-sm z-50"
                    >
                      ⬅ Kembali ke Gedung Utama
                    </button>
                  )}
                  <HospitalMap 
                    selectedFloor={selectedFloor} 
                    setSelectedFloor={(floor) => setSelectedFloor(floor)} 
                    setSelectedRoom={(room) => setSelectedRoom(room)}
                    selectedRoom={selectedRoom}
                  />
                </div>

                <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5 shadow-sm overflow-y-auto">
                  {!selectedRoom ? (
                    <div className="flex flex-col gap-5 h-full">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl h-44">
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1">📈 Tren Kunjungan IGD Per Jam</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={operationalData.queue_trend}>
                            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px' }} />
                            <Bar dataKey="pasien" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1">👨‍⚕️ Penugasan Dokter Hari Ini</p>
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1">
                          {operationalData.doctors.map((doc, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-slate-800">{doc.nama}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{doc.spesialis} • <span className="text-blue-600 font-semibold">{doc.kamar}</span></p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
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

          {/* ================= 2. HALAMAN : GUDANG FARMASI ================= */}
          {activeMenu === 'farmasi' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fade-in flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Manajemen Gudang Farmasi & Obat Kritis</h3>
                <p className="text-xs text-slate-400 mt-1">Monitoring real-time kapasitas logistik obat dan alat penunjang hidup darurat.</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 my-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">Stok Tabung Oksigen Cair</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">180 <span className="text-xs font-normal text-slate-500">Tabung</span></p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-emerald-500 h-full w-[85%]"></div></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">Vaksin Emergency Atas</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">45 <span className="text-xs font-normal text-slate-500">Vial</span></p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-amber-500 h-full w-[45%]"></div></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">Cairan Infus Saline</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">1,240 <span className="text-xs font-normal text-slate-500">Pcs</span></p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-emerald-500 h-full w-[90%]"></div></div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <th className="p-3">Kode Logistik</th><th className="p-3">Nama Item</th><th className="p-3">Kategori</th><th className="p-3">Batas Reorder</th><th className="p-3">Status Urgensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50/80"><td className="p-3 font-mono text-blue-600 font-bold">LOG-OX-09</td><td className="p-3 font-semibold">Oksigen Medis Portable</td><td className="p-3">Gas Medis</td><td className="p-3">20 Unit</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Aman / Optimal</span></td></tr>
                    <tr className="hover:bg-slate-50/80"><td className="p-3 font-mono text-blue-600 font-bold">LOG-EP-12</td><td className="p-3 font-semibold">Epinephrine Inj 1mg</td><td className="p-3">Obat Resusitasi</td><td className="p-3">50 Vial</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Restock Alert (45)</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 3. HALAMAN : PERSONALIA DOKTER ================= */}
          {activeMenu === 'personalia' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fade-in flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Direktori Personalia & Jadwal Shift Dokter</h3>
                <p className="text-xs text-slate-400 mt-1">Sistem pencegahan double-booking ruang operasi (Concurrency Guard Terpasang).</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <th className="p-3">Nama Dokter Spesialis</th><th className="p-3">Spesialisasi</th><th className="p-3">Jam Dinas</th><th className="p-3">Lokasi Tugas Active</th><th className="p-3">Alokasi Jadwal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    <tr className="hover:bg-slate-50/80"><td className="p-3 font-bold text-slate-800">dr. Harianto, Sp.JP</td><td className="p-3 text-slate-500">Jantung & Pembuluh</td><td className="p-3">08:00 - 14:00</td><td className="p-3 text-blue-600 font-semibold">ICU / Kamar 01</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Available / Aktif</span></td></tr>
                    <tr className="hover:bg-slate-50/80"><td className="p-3 font-bold text-slate-800">dr. Amanda, Sp.An</td><td className="p-3 text-slate-500">Anestesiologi</td><td className="p-3">07:00 - 15:00</td><td className="p-3 text-red-600 font-semibold">OK Bedah Lantai 2</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">On Duty / Operasi</span></td></tr>
                    <tr className="hover:bg-slate-50/80"><td className="p-3 font-bold text-slate-800">dr. Budi, Sp.OT</td><td className="p-3 text-slate-500">Bedah Ortopedi</td><td className="p-3">10:00 - 17:00</td><td className="p-3 text-amber-600 font-semibold">Poli Klinik Bedah 1</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Konsultasi Poli</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 4. HALAMAN : MANAJER KEUANGAN ================= */}
          {activeMenu === 'keuangan' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fade-in flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Manajer Keuangan & Revenue Analytics</h3>
                <p className="text-xs text-slate-400 mt-1">Laporan finansial agregat harian faskes terintegrasi sistem jaminan kesehatan.</p>
              </div>

              <div className="grid grid-cols-2 gap-6 my-2">
                <div className="bg-[#f8fafc] border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold">Akumulasi Klaim BPJS Kesehatan</p>
                  <p className="text-2xl font-bold text-blue-600 font-mono">Rp 142.850.000</p>
                  <p className="text-[10px] text-slate-400 mt-2">📊 Berhasil di-agregat dari 96 pasien IGD & Rawat Jalan hari ini</p>
                </div>
                <div className="bg-[#f8fafc] border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-sm">
                  <p className="text-xs text-slate-400 font-semibold">Pendapatan Pasien Umum (Cash/Mandiri)</p>
                  <p className="text-2xl font-bold text-emerald-600 font-mono">Rp 38.420.000</p>
                  <p className="text-[10px] text-slate-400 mt-2">💳 Selesai divalidasi oleh kasir utama administrasi</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}