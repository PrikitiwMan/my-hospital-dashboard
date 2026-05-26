import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Data Tren Antrean IGD
  const baseQueueData = [
    { hour: '08:00', pasien: 8 },
    { hour: '09:00', pasien: 13 },
    { hour: '10:00', pasien: 18 },
    { hour: '11:00', pasien: 12 },
    { hour: '12:00', pasien: 15 },
    { hour: '13:00', pasien: 9 },
  ];

  const dynamicQueue = baseQueueData.map((item) => {
    if (item.hour === '10:00' || item.hour === '12:00') {
      return { ...item, pasien: item.pasien + Math.floor(Math.random() * 4) };
    }
    return item;
  });

  const currentIgdQueue = dynamicQueue[dynamicQueue.length - 1].pasien + Math.floor(Math.random() * 3);

  // 2. Data Armada Ambulans
  const ambulanceData = {
    total: 5,
    standby: Math.floor(Math.random() * 3) + 1,
  };

  // 3. Data Jadwal Dokter Penugasan
  const doctorSchedule = [
    { nama: "dr. Harianto, Sp.JP", spesialis: "Jantung", status: "Di Ruangan", kamar: "ICU / Kamar 01" },
    { nama: "dr. Amanda, Sp.An", spesialis: "Anestesi", status: "Operasi", kamar: "OK Bedah L2" },
    { nama: "dr. Budi, Sp.OT", spesialis: "Bedah Tulang", status: "Poli", kamar: "Poli Bedah 1" },
  ];

  // Pastikan me-return objek secara utuh lewat NextResponse
  return NextResponse.json({
    total_igd_queue: currentIgdQueue,
    icu_vacant_beds: Math.random() > 0.5 ? 1 : 2,
    queue_trend: dynamicQueue,
    ambulance: ambulanceData,
    doctors: doctorSchedule
  });
}