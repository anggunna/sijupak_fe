import { ScanFace, ShieldAlert, SendHorizonal, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: ScanFace,
    step: '01',
    title: 'Scan Wajah',
    desc: 'Arahkan kamera ke wajah juru parkir atau upload fotonya untuk diidentifikasi sistem.',
  },
  {
    icon: ShieldAlert,
    step: '02',
    title: 'Cek Status',
    desc: 'Sistem akan mencocokkan wajah dengan database juru parkir resmi Dishub secara otomatis.',
  },
  {
    icon: SendHorizonal,
    step: '03',
    title: 'Kirim Laporan',
    desc: 'Jika terdeteksi ilegal, isi form laporan dengan lokasi dan deskripsi singkat lalu kirim.',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Ditindaklanjuti',
    desc: 'Laporan masuk ke dashboard Dishub dan akan segera ditindaklanjuti oleh petugas.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2">
            Cara Melapor
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Mudah, Cepat, dan Aman
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Hanya 4 langkah untuk melaporkan juru parkir ilegal di sekitar Anda langsung ke Dinas Perhubungan.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-blue-100 z-0" />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-700 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-blue-200">
                  <s.icon className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-400 tracking-widest mb-1">
                  LANGKAH {s.step}
                </span>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2">{s.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed hidden sm:block">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA inline */}
        <div className="mt-10 sm:mt-14 text-center">
          <a href="#scan"
            className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm sm:text-base">
            <ScanFace className="w-5 h-5" />
            Coba Sekarang
          </a>
        </div>
      </div>
    </section>
  )
}
