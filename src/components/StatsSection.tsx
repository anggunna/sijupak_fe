import { Users, MapPin, CheckCircle, Clock } from 'lucide-react'

const stats = [
  { icon: Users, value: '2.400+', label: 'Juru Parkir Terdaftar', color: 'text-blue-600' },
  { icon: MapPin, value: '180+', label: 'Titik Parkir Aktif', color: 'text-green-600' },
  { icon: CheckCircle, value: '98%', label: 'Tingkat Verifikasi', color: 'text-yellow-600' },
  { icon: Clock, value: '24/7', label: 'Monitoring Aktif', color: 'text-purple-600' },
]

export default function StatsSection() {
  return (
    <section id="statistik" className="py-12 sm:py-16 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{s.value}</p>
              <p className="text-blue-200 text-xs sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
