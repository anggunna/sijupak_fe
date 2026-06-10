import { ShieldCheck, ArrowRight, BadgeCheck, ScanFace } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="beranda"
      className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden pt-14 sm:pt-16">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm mb-5 sm:mb-6">
              <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
              <span>Sistem Resmi Dinas Perhubungan</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-2 tracking-tight">
              SIGAP
            </h1>
            <p className="text-yellow-400 font-bold text-lg sm:text-xl md:text-2xl mb-6 leading-snug">
              Sistem Identifikasi Legalitas Juru Parkir Alun-Alun Purwokerto
            </p>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
              Platform digital untuk pendataan, verifikasi, dan pengelolaan identitas juru parkir
              secara terpusat, transparan, dan akuntabel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#scan"
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors text-sm sm:text-base">
                <ScanFace className="w-5 h-5" />
                Laporkan Juru Parkir
              </a>
              <a href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm sm:text-base">
                Pelajari Lebih Lanjut
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-blue-200">
              {['Data Terenkripsi', 'Terintegrasi Dishub', 'Real-time Monitoring'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — ID Card mockup, hidden on mobile */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">SIGAP</p>
                    <p className="font-bold text-gray-800">Kartu Identitas Juru Parkir</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 mb-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-blue-200 rounded-lg flex items-center justify-center text-blue-500 text-xs text-center">Foto</div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 rounded w-1/2" />
                      <div className="h-3 bg-gray-300 rounded w-2/3" />
                      <div className="h-3 bg-gray-300 rounded w-1/3" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-20" />
                    <div className="h-2 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ✓ Terverifikasi
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
