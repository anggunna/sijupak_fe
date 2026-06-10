import { ParkingSquare } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ParkingSquare className="w-6 h-6 text-blue-400" />
            <span>SIGAP</span>
          </div>
          <p className="text-sm text-center">
            Sistem Identifikasi Legalitas Juru Parkir Alun-Alun Purwokerto — Dinas Perhubungan
          </p>
          <p className="text-sm">© {new Date().getFullYear()} Hak Cipta Dilindungi</p>
        </div>
      </div>
    </footer>
  )
}
