'use client';

export default function HospitalMap({ selectedFloor, setSelectedFloor, setSelectedRoom, selectedRoom }) {
  
  // ================= TAMPILAN MAKRO: STRUKTUR GEDUNG UTAMA YANG DISINKRONKAN =================
  if (selectedFloor === null) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in text-slate-700">
        
        {/* Header Seksi */}
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Arsitektur Gedung Utama
          </span>
          <h3 className="text-lg font-extrabold text-slate-800 mt-3 tracking-tight">Peta Spasial Digital Twin</h3>
          <p className="text-xs text-slate-400 mt-1">Klik langsung pada bagian gedung untuk memantau node IoT per lantai.</p>
        </div>

        {/* Visual Gedung Interaktif */}
        <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-2 shadow-inner">
          
          {/* Roof / Helipad */}
          <div className="h-8 bg-slate-200 border border-slate-300 rounded-t-xl text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-sm select-none">
            🚁 AREA HELIPAD EVAKUASI MEDIS
          </div>
          
          {/* LANTAI 3: RAWAT INAP (Kapasitas disesuaikan dengan denah mikro) */}
          <button 
            onClick={() => { setSelectedFloor(3); setSelectedRoom(null); }} 
            className="group h-20 bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-500 rounded-xl transition-all duration-300 flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center border border-blue-100 text-xs shadow-sm">
                L3
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Lantai 3 — Unit Rawat Inap</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pemantauan Node IoT: Kamar VVIP Melati & Anggrek</p>
              </div>
            </div>
            <span className="text-xs text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">➔</span>
          </button>
          
          {/* LANTAI 2: ICU UNIT (Kini seragam, tidak dibeda-bedakan secara sepihak) */}
          <button 
            onClick={() => { setSelectedFloor(2); setSelectedRoom(null); }} 
            className="group h-20 bg-white hover:bg-purple-50/40 border border-slate-200 hover:border-purple-500 rounded-xl transition-all duration-300 flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center border border-purple-100 text-xs shadow-sm">
                L2
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Lantai 2 — Unit Perawatan Intensif (ICU)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pemantauan Node IoT: Kamar Resusitasi Kritis 01 & 02</p>
              </div>
            </div>
            <span className="text-xs text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all">➔</span>
          </button>
          
          {/* LANTAI 1: EMERGENCY IGD */}
          <button 
            onClick={() => { setSelectedFloor(1); setSelectedRoom(null); }} 
            className="group h-20 bg-white hover:bg-rose-50/40 border border-slate-200 hover:border-rose-500 rounded-xl transition-all duration-300 flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center border border-rose-100 text-xs shadow-sm">
                L1
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors">Lantai 1 — Instalasi Gawat Darurat (IGD)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pemantauan Node IoT: Ruang Triase Utama & Ruang Resusitasi</p>
              </div>
            </div>
            <span className="text-xs text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all">➔</span>
          </button>
          
          {/* Basement */}
          <div className="h-6 bg-slate-300 border border-slate-400 rounded-b-xl text-[9px] font-bold text-slate-500 flex items-center justify-center shadow-inner select-none">
            LOGISTIK & PARKING BASEMENT
          </div>
        </div>

      </div>
    );
  }


  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 animate-fade-in text-slate-700">
      <div className="mb-6 text-center">
        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          📍 Digital Twin — Lantai {selectedFloor} : {
            selectedFloor === 1 ? 'Instalasi Gawat Darurat' : 
            selectedFloor === 2 ? 'Unit ICU & Intensif' : 'Unit Rawat Inap Utama'
          }
        </span>
      </div>
      
      <div className="w-full max-w-xl aspect-[4/3] bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-3 grid-rows-2 gap-4 relative shadow-md">
        
        {/* ================= LANTAI 1 ================= */}
        {selectedFloor === 1 && (
          <>
            <button onClick={() => setSelectedRoom('IGD-101')} className={`col-span-2 row-span-1 rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 text-left ${selectedRoom === 'IGD-101' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'}`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-slate-800">🚑 Ruang Triase IGD</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Pasien: <span className="text-slate-700 font-semibold">Tn. Bambang Pamungkas</span></p>
            </button>
            <button onClick={() => setSelectedRoom('IGD-102')} className={`col-span-1 row-span-2 rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 text-left ${selectedRoom === 'IGD-102' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'}`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-slate-800">🏥 Resusitasi Bed</span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-auto">Status: <span className="text-amber-600 font-semibold">Kosong</span></p>
            </button>
            <div className="col-span-2 row-span-1 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              AREA RECEPTION & RUANG TUNGGU IGD
            </div>
          </>
        )}

        {/* ================= LANTAI 2 ================= */}
        {selectedFloor === 2 && (
          <>
            <button onClick={() => setSelectedRoom('ICU-201')} className={`col-span-2 row-span-1 rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 text-left ${selectedRoom === 'ICU-201' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'}`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-slate-800">🛏️ Kamar ICU 01</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Pasien: <span className="text-slate-700 font-semibold">Tn. Ahmad Budiman</span></p>
            </button>
            <button onClick={() => setSelectedRoom('ICU-202')} className={`col-span-1 row-span-2 rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 text-left ${selectedRoom === 'ICU-202' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'}`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-slate-800">🛏️ Kamar ICU 02</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-auto">Pasien: <span className="text-slate-700 font-semibold">Ny. Ratna Galih</span></p>
            </button>
            <div className="col-span-2 row-span-1 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Sterile Corridor L2
            </div>
          </>
        )}

        {/* ================= LANTAI 3 ================= */}
        {selectedFloor === 3 && (
          <>
            <button onClick={() => setSelectedRoom('RNP-301')} className={`col-span-2 row-span-1 rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 text-left ${selectedRoom === 'RNP-301' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'}`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-slate-800">⭐ Kamar VVIP Melati</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Pasien: <span className="text-slate-700 font-semibold">Ibu Siti Khadijah</span></p>
            </button>
            <button onClick={() => setSelectedRoom('RNP-302')} className={`col-span-1 row-span-2 rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 text-left ${selectedRoom === 'RNP-302' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/15' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-400'}`}>
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-slate-800">🏢 Kamar Anggrek</span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              </div>
              <p className="text-[10px] text-slate-400 mt-auto">Status: <span className="text-emerald-600 font-semibold">Tersedia</span></p>
            </button>
            <div className="col-span-2 row-span-1 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              LORONG RAWAT INAP LANTAI 3
            </div>
          </>
        )}

      </div>
    </div>
  );
}