import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, ScanLine } from 'lucide-react'
import api from '@/lib/axios'

interface Aktivitas {
  id: number
  nama: string
  hasil: string
  confidence: number | null
  waktu_scan: string
  foto_scan_path: string | null
}

interface Summary {
  total: number
  terdaftar: number
  tidak_terdaftar: number
}

export default function AktivitasScanPage() {
  const [data, setData] = useState<Aktivitas[]>([])
  const [total, setTotal] = useState(0)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(0)
  const limit = 20

  const [lastUpdate, setLastUpdate] = useState(new Date())

  const fetchData = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('skip', String(page * limit))
    params.set('limit', String(limit))
    if (filter) params.set('hasil', filter)

    Promise.all([
      api.get(`/aktivitas-scan/?${params}`),
      api.get('/aktivitas-scan/summary'),
    ]).then(([res, sum]) => {
      setData(res.data.data)
      setTotal(res.data.total)
      setSummary(sum.data)
      setLastUpdate(new Date())
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [page, filter])

  // Auto-refetch setiap 10 detik
  useEffect(() => {
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [page, filter])

  const totalPages = Math.ceil(total / limit)

  const formatWaktu = (w: string) => {
    const d = new Date(w)
    return {
      tgl: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      jam: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Aktivitas Scan</h2>
        <p className="text-sm text-gray-500">
          Riwayat identifikasi wajah juru parkir · diperbarui {lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <ScanLine className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Total Scan</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-500">Terdaftar</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{summary.terdaftar.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs text-gray-500">Tidak Terdaftar</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{summary.tidak_terdaftar.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { val: '', label: 'Semua' },
          { val: 'terdaftar', label: 'Terdaftar' },
          { val: 'tidak_terdaftar', label: 'Tidak Terdaftar' },
        ].map((f) => (
          <button key={f.val}
            onClick={() => { setFilter(f.val); setPage(0) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f.val
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Hasil</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Confidence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                    Belum ada data aktivitas scan
                  </td>
                </tr>
              ) : (
                data.map((a) => {
                  const legal = a.hasil === 'terdaftar'
                  const { tgl, jam } = formatWaktu(a.waktu_scan)
                  const initials = a.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${legal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {initials}
                          </div>
                          <span className="font-medium text-gray-800">{a.nama}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${legal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {legal
                            ? <CheckCircle2 className="w-3 h-3" />
                            : <XCircle className="w-3 h-3" />}
                          {legal ? 'Terdaftar' : 'Tidak Terdaftar'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {a.confidence != null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${a.confidence >= 80 ? 'bg-green-500' : a.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-400'}`}
                                style={{ width: `${a.confidence}%` }} />
                            </div>
                            <span className="text-xs">{a.confidence}%</span>
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs">{tgl}</p>
                        <p className="text-gray-400 text-xs">{jam}</p>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {page * limit + 1}–{Math.min((page + 1) * limit, total)} dari {total}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
