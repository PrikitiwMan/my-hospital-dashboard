'use client';
import { useState } from 'react';

const floorData = {
  1: { name: 'Instalasi Gawat Darurat (IGD)', bed: '1 Bed Kosong',   stat: 'Kondisi Triase Padat', alert: 'Ambulans Siaga',   live: 'NODE IGD-101 & 102 LIVE' },
  2: { name: 'Intensive Care Unit (ICU)',      bed: 'Steril / Penuh', stat: 'Monitoring Kritis',    alert: 'Pasien Kritis 2x', live: 'NODE ICU-201 & 202 LIVE' },
  3: { name: 'Unit Rawat Inap Utama',          bed: '1 Bed Tersedia', stat: 'Bangsal Stabil',        alert: 'Tidak Ada',        live: 'NODE RNP-301 & 302 LIVE' },
};

/* ── HOVER PREVIEW CARD ── */
function HoverCard({ floor }) {
  if (!floor) return null;
  const d = floorData[floor];
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-56
                    bg-slate-950/95 backdrop-blur-sm border border-slate-700 rounded-xl p-3 shadow-2xl
                    animate-[fadeIn_.2s_ease] text-white">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] font-black text-sky-400 tracking-wider">L0{floor} MONITORING</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      <p className="text-xs font-bold text-slate-100 mb-2">{d.name}</p>
      <div className="border-t border-slate-800 pt-2 space-y-1">
        {[['BED', d.bed], ['STATUS', d.stat], ['IOT NODE', d.live]].map(([k, v]) => (
          <div key={k} className="flex justify-between font-mono text-[10px]">
            <span className="text-slate-500">▪ {k}</span>
            <span className="text-slate-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SINGLE IOT PULSE DOT ── */
function IotDot({ color }) {
  const cls = {
    green: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)] animate-[ping_2s_infinite]',
    red:   'bg-red-500    shadow-[0_0_8px_rgba(239,68,68,.8)]    animate-[pulse_1.4s_infinite]',
    amber: 'bg-amber-400  shadow-[0_0_8px_rgba(245,158,11,.8)]   animate-[ping_1.8s_infinite]',
  }[color];
  return <span className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ${cls}`} />;
}

/* ── TOP-FACE WINDOW CELL ── */
function WindowCell({ type }) {
  if (type === 'bed')
    return (
      <div className="bg-slate-200/50 border border-slate-300 rounded-sm flex items-center justify-center">
        <span className="w-3.5 h-2 bg-sky-400/50 border border-sky-500/60 rounded-sm block" />
      </div>
    );
  if (type === 'cross')
    return (
      <div className="bg-slate-200/50 border border-slate-300 rounded-sm relative overflow-hidden">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-[3px] bg-red-500/70 rounded" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-3 bg-red-500/70 rounded" />
      </div>
    );
  if (type === 'zone')
    return (
      <div className="col-span-1 bg-slate-200/50 border border-slate-300 rounded-sm flex items-center justify-center">
        <span className="font-mono text-[6px] font-bold text-slate-400 tracking-wide">ISO</span>
      </div>
    );
  return <div className="bg-slate-100/50 border border-slate-200 rounded-sm" />;
}

/* ── ONE BUILDING FLOOR (3D Makro) ── */
function BuildingFloor({ floor, zOffset, onClick, onEnter, onLeave }) {
  const cfg = {
    1: { dot: 'amber', cells: [{ type: 'cross' }, { type: 'bed' }, { type: 'empty' }, { type: 'bed' }] },
    2: { dot: 'red',   cells: [{ type: 'bed' }, { type: 'bed' }, { type: 'zone' }, { type: 'zone' }] },
    3: { dot: 'green', cells: [{ type: 'bed' }, { type: 'empty' }, { type: 'empty' }, { type: 'bed' }] },
  }[floor];

  const SLAB = 56;
  const isL1 = floor === 1;

  return (
    <div
      className="absolute w-44 h-44 cursor-pointer group"
      style={{ transform: `translateZ(${zOffset}px)`, transformStyle: 'preserve-3d' }}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        className="absolute inset-0 bg-slate-50 border-2 border-slate-200 grid grid-cols-2 grid-rows-2 gap-1 p-2 overflow-hidden
                    transition-all duration-300 group-hover:bg-slate-100 shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]"
        style={{ transform: `translateZ(${SLAB}px)` }}
      >
        {cfg.cells.map((c, i) => <WindowCell key={i} type={c.type} />)}
        
        {floor === 3 && (
          <div className="absolute top-4 left-4 w-12 h-12 bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
              <span className="w-6 h-1 bg-slate-400 animate-spin" />
            </div>
          </div>
        )}
        <IotDot color={cfg.dot} />
      </div>

      <div
        className="absolute bottom-0 left-0 w-44 border-x-2 border-b-2 border-slate-300 bg-slate-100 flex items-center justify-center"
        style={{ height: `${SLAB}px`, transformOrigin: 'bottom', transform: 'rotateX(-90deg)' }}
      >
        {isL1 ? (
          <div className="absolute bottom-0 w-24 h-18 bg-white border-x-2 border-t-2 border-slate-200 flex flex-col items-center shadow-lg transform translate-z-2">
            <span className="text-[7px] font-black text-sky-700 mt-1">HOSPITAL</span>
            <span className="text-[12px] font-black text-blue-600">✚</span>
            <div className="w-12 h-6 bg-slate-800/80 mt-auto rounded-t-sm flex gap-0.5 p-0.5">
              <div className="w-full h-full bg-sky-200/20" />
              <div className="w-full h-full bg-sky-200/20" />
            </div>
          </div>
        ) : (
          <div className="w-32 h-6 bg-sky-200/80 border-2 border-sky-400/80 group-hover:bg-amber-300 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_#fcd34d] transition-all flex items-center px-2 space-x-2 shadow-inner">
            <div className="w-full h-full bg-sky-500/20 group-hover:bg-amber-500/20 transition-all" />
            <div className="w-full h-full bg-sky-500/20 group-hover:bg-amber-500/20 transition-all" />
          </div>
        )}
      </div>

      <div
        className="absolute top-0 right-0 border-y-2 border-r-2 border-slate-300 bg-slate-200 flex flex-col items-center justify-center"
        style={{ width: `${SLAB}px`, height: '176px', transformOrigin: 'left', transform: 'rotateY(90deg)' }}
      >
        <div className="w-6 h-32 bg-sky-200/80 border-2 border-sky-400/80 group-hover:bg-amber-300 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_#fcd34d] transition-all flex flex-col py-2 space-y-2 shadow-inner">
          <div className="w-full h-full bg-sky-500/20 group-hover:bg-amber-500/20 transition-all" />
          <div className="w-full h-full bg-sky-500/20 group-hover:bg-amber-500/20 transition-all" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ARSITEKTUR BLUEPRINT FLOORPLAN (BARU)
══════════════════════════════════════════ */

// Komponen Pembentuk Ruangan (Blueprint Room)
function BlueprintRoom({ id, title, patient, status, isActive, selectedRoom, setSelectedRoom, className, children, door }) {
  const isSelected = selectedRoom === id;
  return (
    <div
      onClick={() => setSelectedRoom(id)}
      className={`relative border-[4px] transition-all cursor-pointer flex flex-col p-2
        ${isSelected ? 'border-sky-500 bg-sky-50 shadow-[0_0_15px_rgba(14,165,233,0.2)] z-10' : 'border-slate-700 bg-white hover:bg-slate-50'}
        ${className}`}
    >
      {/* Visualisasi Celah Pintu (Door Cutout) */}
      {door === 'bottom' && <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-8 h-[4px] bg-slate-100" />}
      {door === 'top' && <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-8 h-[4px] bg-slate-100" />}
      {door === 'right' && <div className="absolute top-1/2 -right-[4px] -translate-y-1/2 w-[4px] h-8 bg-slate-100" />}
      
      {/* Header Info Ruangan */}
      <div className="flex justify-between items-start w-full mb-1">
        <span className={`text-[10px] font-black tracking-tight ${isSelected ? 'text-sky-700' : 'text-slate-800'}`}>{title}</span>
        <span className={`w-2 h-2 rounded-full shadow-sm ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
      </div>

      {/* Maket Interior (Bed, Meja, dll) */}
      <div className="flex-1 flex items-center justify-center relative pointer-events-none">
        {children}
      </div>

      {/* Status Footer */}
      <div className="mt-auto pt-1 border-t border-slate-200 w-full flex justify-between items-center">
        <span className="text-[8px] font-mono font-bold text-slate-500">{patient || status}</span>
        {isSelected && <span className="text-[7px] font-bold text-sky-600 bg-sky-100 px-1 rounded">LIVE</span>}
      </div>
    </div>
  );
}

// Master Komponen Denah 2D
function FloorPlan({ floor, selectedRoom, setSelectedRoom }) {
  return (
    <div className="w-full max-w-sm bg-slate-100 border-[6px] border-slate-800 rounded-xl p-3 shadow-2xl animate-[fadeIn_.3s_ease] relative">
      
      {/* Ornamen Blueprint (Mata Angin & Skala) */}
      <div className="absolute -top-4 -right-2 bg-slate-800 text-white text-[8px] font-mono px-2 py-1 rounded shadow-lg flex items-center gap-2 border border-slate-600">
        <span className="font-bold text-sky-300">N ⬆</span> <span className="opacity-50">|</span> <span>1:100</span>
      </div>

      <div className="text-[9px] font-mono font-black text-slate-500 mb-2 border-b-2 border-slate-300 pb-1 flex justify-between items-center">
        <span>BLUEPRINT L0{floor}</span>
        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">{floor === 1 ? 'EMERGENCY' : floor === 2 ? 'INTENSIVE CARE' : 'INPATIENT'}</span>
      </div>

      {/* ── LAYOUT ARSITEKTUR LANTAI 1 (IGD) ── */}
      {floor === 1 && (
        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-64">
          <BlueprintRoom id="IGD-101" title="TRIASE UTAMA" patient="Tn. Bambang P." isActive={true} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} className="col-span-2 row-span-2" doorPosition="bottom">
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-10 border border-blue-300 bg-blue-50 rounded-sm flex flex-col"><div className="h-2 border-b border-blue-200 bg-white rounded-t-sm" /></div>
              ))}
            </div>
          </BlueprintRoom>

          <BlueprintRoom id="IGD-102" title="RESUSITASI" status="Kosong (Standby)" isActive={false} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} className="col-span-1 row-span-2" doorPosition="bottom">
            <div className="w-7 h-12 border-2 border-red-300 bg-red-50 rounded-sm flex flex-col items-center p-0.5">
              <div className="w-full h-3 border-b-2 border-red-200 bg-white rounded-t-sm" />
              <span className="text-[7px] mt-1 text-red-500 font-bold">AED</span>
            </div>
          </BlueprintRoom>

          <div className="col-span-3 row-span-1 bg-slate-200/60 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center rounded">
            <span className="text-[10px] font-black text-slate-600 tracking-widest">LOBBY & RECEPTION</span>
            <div className="flex gap-4 mt-1 opacity-60 font-mono text-[7px] font-bold">
              <span>⬇ MAIN ENTRANCE</span>
              <span>PHARMACY ➡</span>
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT ARSITEKTUR LANTAI 2 (ICU) ── */}
      {floor === 2 && (
        <div className="grid grid-cols-4 grid-rows-3 gap-2 h-64">
          <BlueprintRoom id="ICU-201" title="ICU 01 (ISO)" patient="Tn. Ahmad B." isActive={true} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} className="col-span-2 row-span-2" door="bottom">
            <div className="relative w-10 h-14 border-2 border-purple-300 bg-purple-50 rounded flex flex-col p-0.5">
              <div className="w-full h-3 border-b-2 border-purple-200 bg-white rounded-t-sm" />
              <div className="absolute top-1 -right-3 w-2 h-4 bg-slate-700 border border-slate-800 rounded-sm animate-pulse flex items-center justify-center"><div className="w-1 h-1 bg-emerald-400 rounded-full"/></div>
            </div>
          </BlueprintRoom>

          <BlueprintRoom id="ICU-202" title="ICU 02 (ISO)" patient="Ny. Ratna G." isActive={true} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} className="col-span-2 row-span-2" door="bottom">
            <div className="relative w-10 h-14 border-2 border-purple-300 bg-purple-50 rounded flex flex-col p-0.5">
              <div className="w-full h-3 border-b-2 border-purple-200 bg-white rounded-t-sm" />
              <div className="absolute top-1 -right-3 w-2 h-4 bg-slate-700 border border-slate-800 rounded-sm animate-pulse flex items-center justify-center"><div className="w-1 h-1 bg-emerald-400 rounded-full"/></div>
            </div>
          </BlueprintRoom>

          <div className="col-span-4 row-span-1 bg-sky-100/50 border-2 border-slate-400 flex items-center justify-between px-4 rounded">
            <span className="text-[10px] font-black text-sky-700 tracking-widest">STERILE CORRIDOR</span>
            <div className="w-16 h-8 border-2 border-sky-400 bg-white flex items-center justify-center text-[7px] font-black text-sky-600 text-center leading-tight rounded-sm shadow-sm">NURSE<br/>STATION</div>
          </div>
        </div>
      )}

      {/* ── LAYOUT ARSITEKTUR LANTAI 3 (RAWAT INAP) ── */}
      {floor === 3 && (
        <div className="grid grid-cols-3 grid-rows-4 gap-2 h-64">
          <BlueprintRoom id="RNP-301" title="VVIP MELATI" patient="Ibu Siti K." isActive={true} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} className="col-span-3 row-span-2" door="bottom">
            <div className="w-full h-full flex items-center justify-around px-2">
              <div className="w-10 h-14 border-2 border-emerald-300 bg-emerald-50 rounded flex flex-col p-0.5">
                <div className="w-full h-3 border-b-2 border-emerald-200 bg-white rounded-t-sm" />
              </div>
              <div className="w-16 h-10 border-2 border-dashed border-slate-400 bg-slate-200/50 flex items-center justify-center text-[6px] text-slate-500 font-bold rounded-sm text-center leading-tight">SOFA /<br/>FAMILY AREA</div>
            </div>
          </BlueprintRoom>

          <div className="col-span-3 row-span-1 bg-slate-200/50 border-y-2 border-slate-400 flex flex-col items-center justify-center">
            <span className="text-[9px] font-black text-slate-500 tracking-widest">MAIN HALLWAY</span>
          </div>

          <BlueprintRoom id="RNP-302" title="KAMAR ANGGREK" status="Tersedia" isActive={false} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} className="col-span-3 row-span-1" door="top">
            <div className="flex gap-6 mt-1">
              {[1,2].map(i => (
                <div key={i} className="w-6 h-8 border border-slate-400 bg-slate-100 rounded-sm flex flex-col"><div className="h-2 border-b border-slate-300 bg-white rounded-t-sm" /></div>
              ))}
            </div>
          </BlueprintRoom>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
export default function HospitalMap({ selectedFloor, setSelectedFloor, setSelectedRoom, selectedRoom }) {
  const [hoveredFloor, setHoveredFloor] = useState(null);

  const handleBackToGedung = () => {
    setSelectedFloor(null);
    setSelectedRoom(null);
  };

  const zMap = { 1: 0, 2: 56, 3: 112 };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-4 pt-16 md:pt-20 text-slate-700 relative overflow-hidden select-none bg-sky-50/10">

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
                      bg-[size:25px_25px] opacity-40 pointer-events-none z-0" />

      <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none w-full">
        <span className="text-[9px] md:text-[10px] bg-sky-900 border border-sky-700 text-sky-100 font-bold px-4 py-1.5 rounded-full tracking-wider shadow-md">
          {selectedFloor === null
            ? '🏢 3D LOW-POLY: HOSPITAL COMMAND CENTER'
            : `📍 DENAH DIGITAL TWIN: LANTAI ${selectedFloor}`}
        </span>
      </div>

      {selectedFloor !== null && (
        <button
          onClick={handleBackToGedung}
          className="absolute bottom-4 right-4 bg-sky-600 hover:bg-sky-700 text-white font-bold
                     px-4 py-2 rounded-xl text-[10px] md:text-xs
                     transition-all shadow-lg z-30 flex items-center gap-1.5"
        >
          🔍 KEMBALI KE GEDUNG 3D
        </button>
      )}

      <div
        className="w-full max-w-sm md:max-w-md aspect-square flex items-center justify-center relative z-10"
        style={{ perspective: '1600px' }}
      >
        {selectedFloor === null && <HoverCard floor={hoveredFloor} />}

        <div
          className="w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: selectedFloor === null
              ? 'rotateX(60deg) rotateZ(-45deg) translateY(40px) translateX(-10px)'
              : 'rotateX(0deg) rotateZ(0deg) translateY(0px) translateX(0px)',
          }}
        >

          {selectedFloor === null && (
            <div className="absolute w-44 h-44 relative" style={{ transformStyle: 'preserve-3d' }}>
              
              <div className="absolute w-72 h-72 bg-zinc-700 rounded-xl shadow-[20px_30px_40px_rgba(0,0,0,0.25)] border-b-8 border-r-8 border-zinc-900 -left-14 -top-14 pointer-events-none" style={{ transform: 'translateZ(-2px)', transformStyle: 'preserve-3d' }}>
                <div className="absolute top-0 left-0 right-0 h-14 bg-emerald-500 rounded-t-sm border-b-2 border-emerald-700" />
                <div className="absolute top-14 left-0 w-14 bottom-16 bg-emerald-500 border-r-2 border-emerald-700" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-800 flex items-center justify-around px-4">
                  <div className="w-8 h-1.5 bg-white/70 rounded-full" />
                  <div className="w-8 h-1.5 bg-white/70 rounded-full" />
                  <div className="w-8 h-1.5 bg-white/70 rounded-full" />
                  <div className="w-8 h-1.5 bg-white/70 rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-[-30px] right-[-10px] w-8 h-12 pointer-events-none" style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 bg-white rounded-sm border border-slate-300" />
                <div className="absolute left-0 bottom-[-16px] w-8 h-4 bg-slate-100 origin-top flex items-center justify-center border-b border-slate-300" style={{ transform: 'rotateX(-90deg)' }}>
                  <div className="w-6 h-2 bg-sky-800 rounded-sm" />
                </div>
                <div className="absolute right-[-16px] top-0 w-4 h-12 bg-slate-200 origin-left border-r border-b border-slate-400 flex items-center justify-center" style={{ transform: 'rotateY(90deg)' }}>
                   <div className="w-full h-1.5 bg-red-500" />
                </div>
              </div>

              {[3, 2, 1].map((f) => (
                <BuildingFloor
                  key={f}
                  floor={f}
                  zOffset={zMap[f]}
                  onClick={() => setSelectedFloor(f)}
                  onEnter={() => setHoveredFloor(f)}
                  onLeave={() => setHoveredFloor(null)}
                />
              ))}
            </div>
          )}

          {selectedFloor !== null && (
            <FloorPlan
              floor={selectedFloor}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />
          )}

        </div>
      </div>
    </div>
  );
}