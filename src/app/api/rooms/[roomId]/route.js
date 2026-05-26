import { NextResponse } from 'next/server';

const mockHospitalDatabase = {
  // Lantai 1
  "IGD-101": {
    id: "IGD-101", name: "Ruang Triase IGD", floor: 1, status: "Terisi", maintenance_status: "Steril",
    patient_name: "Tn. Bambang Pamungkas", age: "42 Thn", diagnosis: "Sesak Napas Akut",
    sensors: { temperature: 22.1, humidity: 48, heart_rate: 102, oxygen_saturation: 94 }
  },
  "IGD-102": {
    id: "IGD-102", name: "Resusitasi Bed 01", floor: 1, status: "Kosong", maintenance_status: "Perlu Sterilisasi",
    patient_name: "-", age: "-", diagnosis: "-",
    sensors: { temperature: 24.0, humidity: 50, heart_rate: 0, oxygen_saturation: 0 }
  },
  // Lantai 2
  "ICU-201": {
    id: "ICU-201", name: "Kamar ICU 01", floor: 2, status: "Terisi", maintenance_status: "Steril",
    patient_name: "Tn. Ahmad Budiman", age: "54 Thn", diagnosis: "Pasca Operasi Jantung",
    sensors: { temperature: 21.5, humidity: 45, heart_rate: 82, oxygen_saturation: 97 }
  },
  "ICU-202": {
    id: "ICU-202", name: "Kamar ICU 02", floor: 2, status: "Terisi", maintenance_status: "Steril",
    patient_name: "Ny. Ratna Galih", age: "61 Thn", diagnosis: "Monitoring Gagal Ginjal",
    sensors: { temperature: 21.8, humidity: 44, heart_rate: 76, oxygen_saturation: 98 }
  },
  // Lantai 3
  "RNP-301": {
    id: "RNP-301", name: "Kamar VVIP Melati", floor: 3, status: "Terisi", maintenance_status: "Steril",
    patient_name: "Ibu Siti Khadijah", age: "48 Thn", diagnosis: "Pemulihan Pasca Melahirkan",
    sensors: { temperature: 23.5, humidity: 52, heart_rate: 72, oxygen_saturation: 99 }
  },
  "RNP-302": {
    id: "RNP-302", name: "Kamar VVIP Anggrek", floor: 3, status: "Kosong", maintenance_status: "Steril",
    patient_name: "-", age: "-", diagnosis: "-",
    sensors: { temperature: 24.2, humidity: 55, heart_rate: 0, oxygen_saturation: 0 }
  }
};

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { roomId } = resolvedParams;
  const roomData = mockHospitalDatabase[roomId];

  if (!roomData) {
    return NextResponse.json({ error: `Kamar ${roomId} tidak ditemukan.` }, { status: 404 });
  }

  if (roomData.status === "Terisi") {
    roomData.sensors.heart_rate = Math.floor(Math.random() * (100 - 65 + 1)) + 65;
    roomData.sensors.oxygen_saturation = Math.floor(Math.random() * (99 - 94 + 1)) + 94;
  }

  return NextResponse.json(roomData);
}