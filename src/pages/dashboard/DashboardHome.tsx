import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Users, AlertTriangle, FileText } from 'lucide-react'
import api from '@/lib/axios'

interface Stats {
  scan_hari_ini: number
  scan_pct_change: number
  juru_legal: number
  juru_total: number
  pct_legal: number
  tidak_terdaftar: number
  laporan_masuk: number
  laporan_pending: number
}

interface Aktivitas {
  id: number
  nama: string
  initials: string
  hasil: string
  waktu_scan: string
}

interface TrenItem {
  bulan: number
  tahun: number
  hasil: string
  total: number
}

interface AreaItem {
  area_id: number
  total: number
  pct: number
}

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des']
const AREA_COLORS = ['bg-blue-600','bg-green-500','bg-yellow-500','bg-red-500','bg-purple-500']

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [aktivitas, setAktivitas] = useState<Aktivitas[]>([])
  const [tren, setTren] = useState<TrenItem[]>([])
  const [distribusi, setDistribusi] = useState<AreaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () => Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/aktivitas-terbaru?limit=5'),
      api.get('/dashboard/tren-scan'),
      api.get('/dashboard/distribusi-area'),
    ]).then(([s, a, t, d]) => {
      setStats(s.data)
      setAktivitas(a.data)
      setTren(t.data)
      setDistribusi(d.data)
    }).finally(() => setLoading(false))

    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Build tren chart data — last 7 months
  const trenMonths = Array.from(new Set(tren.map(t => `${t.tahun}-${t.bulan}`))).slice(-7)
  const legalData = trenMonths.map(key => {
    const [y, m] = key.split('-').map(Number)
    return tren.find(t => t.tahun === y && t.bulan === m && t.hasil === 'terdaftar')?.total ?? 0
  })
  const illegalData = trenMonths.map(key => {
    const [y, m] = key.split('-').map(Number)
    return tren.find(t => t.tahun === y && t.bulan === m && t.hasil === 'tidak_terdaftar')?.total ?? 0
  })
  const monthLabels = trenMonths.map(key => BULAN[parseInt(key.split('-')[1]) - 1])
  const maxLegal = Math.max(...legalData, 1)
  const maxIllegal = Math.max(...illegalData, 1)

  // Donut conic gradient
  let cumulative = 0
  const donutSegments = distribusi.slice(0, 4).map((d, i) => {
    const colors = ['#2563eb','#22c55e','#eab308','#ef4444']
    const start = cumulative
    cumulative += d.pct
    return { color: colors[i], start, end: cumulative }
  })
  const conicGradient = donutSegments.map(s => `${s.color} ${s.start}% ${s.end}%`).join(', ')

  const statCards = stats ? [
    {
      label: 'Total Scan Hari Ini',
      value: stats.scan_hari_ini.toString(),
      sub: `${stats.scan_pct_change >= 0 ? '+' : ''}${stats.scan_pct_change}% dari kemarin`,
      subColor: stats.scan_pct_change >= 0 ? 'text-green-600' : 'text-red-500',
      icon: TrendingUp, iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Juru Parkir Legal',
      value: stats.juru_legal.toString(),
      sub: `${stats.pct_legal}% terverifikasi`,
      subColor: 'text-green-600',
      icon: Users, iconBg: 'bg-green-100 text-green-600',
    },
    {
      label: 'Tidak Terdaftar',
      value: stats.tidak_terdaftar.toString(),
      sub: 'total terdeteksi',
      subColor: 'text-red-500',
      icon: TrendingDown, iconBg: 'bg-red-100 text-red-600',
    },
    {
      label: 'Laporan Masuk',
      value: stats.laporan_masuk.toString(),
      sub: `${stats.laporan_pending} belum diproses`,
      subColor: 'text-orange-500',
      icon: FileText, iconBg: 'bg-orange-100 text-orange-600',
    },
  ] : []

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Bar chart tren */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <p className="font-semibold text-gray-800">Tren Scan per Bulan</p>
          </div>
          {tren.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data tren</p>
          ) : (
            <>
              <div className="flex gap-6">
                <div className="flex-1">
                  <div className="flex items-end gap-1 h-28">
                    {legalData.map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${(v / maxLegal) * 100}%`, minHeight: v > 0 ? '4px' : '0' }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {monthLabels.map((m) => <p key={m} className="flex-1 text-center text-xs text-gray-400">{m}</p>)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-end gap-1 h-28">
                    {illegalData.map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-red-400 rounded-t-sm" style={{ height: `${(v / maxIllegal) * 100}%`, minHeight: v > 0 ? '4px' : '0' }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {monthLabels.map((m) => <p key={m} className="flex-1 text-center text-xs text-gray-400">{m}</p>)}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-sm bg-blue-500" /> Scan legal
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-sm bg-red-400" /> Tidak terdaftar
                </div>
              </div>
            </>
          )}
        </div>

        {/* Donut distribusi area */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <p className="font-semibold text-gray-800">Distribusi Area</p>
          </div>
          {distribusi.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada data</p>
          ) : (
            <div className="flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: `conic-gradient(${conicGradient})` }}
              >
                <div className="w-14 h-14 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">{distribusi.length}</span>
                  <span className="text-xs text-gray-400">area</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {distribusi.slice(0, 4).map((d, i) => (
                  <div key={d.area_id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${AREA_COLORS[i]}`} />
                      <span className="text-gray-600">Area {d.area_id}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity + Warnings */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800">Aktivitas Terbaru</p>
            <button className="text-xs text-blue-600 hover:underline">Lihat semua</button>
          </div>
          {aktivitas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada aktivitas scan</p>
          ) : (
            <div className="space-y-3">
              {aktivitas.map((a) => {
                const legal = a.hasil === 'terdaftar'
                const waktu = new Date(a.waktu_scan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${legal ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{a.nama}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${legal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {legal ? 'LEGAL' : 'ILEGAL'}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{waktu}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ringkasan + peringatan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800">Peringatan Aktif</p>
          </div>
          <div className="space-y-3">
            {stats && stats.laporan_pending > 0 && (
              <div className="flex gap-3 p-3 rounded-xl border-l-4 bg-red-50 border-red-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Laporan belum diproses</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stats.laporan_pending} laporan menunggu tindak lanjut</p>
                </div>
              </div>
            )}
            {stats && stats.tidak_terdaftar > 0 && (
              <div className="flex gap-3 p-3 rounded-xl border-l-4 bg-red-50 border-red-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Parkir ilegal terdeteksi</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stats.tidak_terdaftar} scan tidak terdaftar</p>
                </div>
              </div>
            )}
            {stats && stats.laporan_pending === 0 && stats.tidak_terdaftar === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Tidak ada peringatan aktif</p>
            )}
          </div>

          {/* Progress bar */}
          {stats && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Juru Parkir Terverifikasi</span>
                <span className="font-semibold text-gray-800">{stats.juru_legal} / {stats.juru_total}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stats.pct_legal}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{stats.pct_legal}% terverifikasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
