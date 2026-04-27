import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, User, Clock, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '@/lib/axios'

interface Laporan {
  id: number
  pelapor_nama: string
  lokasi: string
  deskripsi: string
  status: string
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: 'Menunggu',  bg: 'bg-yellow-100', text: 'text-yellow-700' },
  diproses:  { label: 'Diproses',  bg: 'bg-blue-100',   text: 'text-blue-700'   },
  selesai:   { label: 'Selesai',   bg: 'bg-green-100',  text: 'text-green-700'  },
  ditolak:   { label: 'Ditolak',   bg: 'bg-red-100',    text: 'text-red-600'    },
}

const FILTERS = [
  { val: '',         label: 'Semua'    },
  { val: 'pending',  label: 'Menunggu' },
  { val: 'diproses', label: 'Diproses' },
  { val: 'selesai',  label: 'Selesai'  },
  { val: 'ditolak',  label: 'Ditolak'  },
]

export default function LaporanPage() {
  const [data, setData] = useState<Laporan[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Laporan | null>(null)
  const [updating, setUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const limit = 12

  const fetchData = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('skip', String(page * limit))
    params.set('limit', String(limit))
    if (filterStatus) params.set('status', filterStatus)
    api.get(`/laporan/?${params}`).then((res) => {
      setData(res.data.data)
      setTotal(res.data.total)
      setLastUpdate(new Date())
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [page, filterStatus])
  useEffect(() => {
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [page, filterStatus])

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true)
    await api.patch(`/laporan/${id}/status?status=${status}`)
    setUpdating(false)
    setSelected(null)
    fetchData()
  }

  const totalPages = Math.ceil(total / limit)

  const formatTgl = (w: string) =>
    new Date(w).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  const formatJam = (w: string) =>
    new Date(w).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Laporan Masuk</h2>
          <p className="text-sm text-gray-500">
            {total} laporan · diperbarui {lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.val}
            onClick={() => { setFilterStatus(f.val); setPage(0) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filterStatus === f.val
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 text-sm">
          Tidak ada laporan
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {data.map((l) => {
            const cfg = STATUS_CONFIG[l.status] ?? { label: l.status, bg: 'bg-gray-100', text: 'text-gray-600' }
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                {/* Status + tanggal */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatTgl(l.created_at)}
                  </div>
                </div>

                {/* Pelapor */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{l.pelapor_nama}</p>
                    <p className="text-xs text-gray-400">{formatJam(l.created_at)}</p>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 line-clamp-1">{l.lokasi}</p>
                </div>

                {/* Deskripsi */}
                <p className="text-xs text-gray-500 line-clamp-2 flex-1">{l.deskripsi}</p>

                {/* Button */}
                <button onClick={() => setSelected(l)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-600 py-2 rounded-xl hover:bg-blue-700 transition-colors mt-auto">
                  <Eye className="w-4 h-4" />
                  Lihat Detail
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-semibold text-gray-800">Detail Laporan #{selected.id}</p>
              <button onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[selected.status]?.bg} ${STATUS_CONFIG[selected.status]?.text}`}>
                  {STATUS_CONFIG[selected.status]?.label ?? selected.status}
                </span>
              </div>

              {/* Pelapor */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Pelapor</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">{selected.pelapor_nama}</p>
                </div>
              </div>

              {/* Waktu */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Waktu Laporan</p>
                <p className="text-sm text-gray-700">{formatTgl(selected.created_at)} · {formatJam(selected.created_at)}</p>
              </div>

              {/* Lokasi */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Lokasi</p>
                <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl px-3 py-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{selected.lokasi}</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 leading-relaxed">
                  {selected.deskripsi || '-'}
                </p>
              </div>
            </div>

            {/* Modal actions */}
            {(selected.status === 'pending' || selected.status === 'diproses') && (
              <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
                {selected.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(selected.id, 'diproses')} disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors">
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" />Proses</>}
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'ditolak')} disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-50 disabled:opacity-60 transition-colors">
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4" />Tolak</>}
                    </button>
                  </>
                )}
                {selected.status === 'diproses' && (
                  <button onClick={() => updateStatus(selected.id, 'selesai')} disabled={updating}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-60 transition-colors">
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" />Tandai Selesai</>}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
