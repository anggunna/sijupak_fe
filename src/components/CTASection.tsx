import { Phone, Mail, ScanFace } from 'lucide-react'

export default function CTASection() {
  return (
    <section id="kontak" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2">
          Laporkan Sekarang
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Temukan Juru Parkir Ilegal?
        </h2>
        <p className="text-gray-500 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Bantu kami menjaga ketertiban parkir di kota. Scan dan laporkan juru parkir
          yang tidak terdaftar langsung ke Dinas Perhubungan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 sm:mb-12">
          <a href="#scan"
            className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm sm:text-base">
            <ScanFace className="w-5 h-5" />
            Scan Sekarang
          </a>
          <a href="mailto:dishub@example.go.id"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 sm:px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base">
            Hubungi Kami
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-sm text-gray-500">
          <div className="flex items-center gap-2 justify-center">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <span>(021) 1234-5678</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Mail className="w-4 h-4 text-blue-600 shrink-0" />
            <span>dishub@example.go.id</span>
          </div>
        </div>
      </div>
    </section>
  )
}
