import {
  UserCheck,
  ScanLine,
  FileText,
  MapPin,
  Bell,
  BarChart3,
} from 'lucide-react'

const features = [
  {
    icon: UserCheck,
    title: 'Verifikasi Identitas',
    desc: 'Proses verifikasi data juru parkir secara digital dengan validasi dokumen resmi.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: ScanLine,
    title: 'Scan QR Code',
    desc: 'Setiap juru parkir memiliki QR Code unik untuk identifikasi cepat di lapangan.',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    icon: FileText,
    title: 'Manajemen Dokumen',
    desc: 'Penyimpanan dan pengelolaan dokumen perizinan juru parkir secara terpusat.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: MapPin,
    title: 'Pemetaan Lokasi',
    desc: 'Pantau sebaran titik parkir dan juru parkir aktif di seluruh wilayah.',
    color: 'bg-red-100 text-red-700',
  },
  {
    icon: Bell,
    title: 'Notifikasi Real-time',
    desc: 'Peringatan otomatis untuk masa berlaku izin yang akan habis atau pelanggaran.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: BarChart3,
    title: 'Laporan & Statistik',
    desc: 'Dashboard analitik lengkap untuk monitoring dan pelaporan kepada pimpinan.',
    color: 'bg-orange-100 text-orange-700',
  },
]

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2">Fitur Unggulan</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Semua yang Anda Butuhkan</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            SIGAP hadir dengan fitur lengkap untuk memudahkan pengelolaan juru parkir dari
            pendaftaran hingga monitoring harian.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f) => (
            <div key={f.title}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${f.color}`}>
                <f.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">{f.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
