import { useRef, useState } from 'react'
import {
  Camera, Upload, X, CheckCircle2, AlertCircle,
  ScanFace, RefreshCw, SendHorizonal, MapPin, User, FlipHorizontal,
} from 'lucide-react'
import api from '@/lib/axios'

type ScanResult = {
  nama: string
  status: string
  valid: boolean
  nomorId: string
  area?: string | null
  confidence?: number
} | null
type Mode = 'idle' | 'camera' | 'preview'

export default function ScanSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [mode, setMode] = useState<Mode>('idle')
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult>(null)
  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Form laporan
  const [showForm, setShowForm] = useState(false)
  const [pelapor, setPelapor] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const scanWajah = async (imageBlob: Blob, previewUrl: string) => {
    setScanning(true)
    setResult(null)
    setShowForm(false)
    setSubmitted(false)
    setPreviewSrc(previewUrl)
    setMode('preview')

    try {
      const formData = new FormData()
      formData.append('file', imageBlob, 'scan.jpg')

      const response = await api.post('/aktivitas-scan/scan-wajah', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = response.data
      const r: NonNullable<ScanResult> = {
        nama: data.nama,
        status: data.status_label,
        valid: data.hasil === 'terdaftar',
        nomorId: data.nomor_id,
        area: data.area,
        confidence: data.confidence,
      }
      setResult(r)
      if (!r.valid) setShowForm(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setResult({
        nama: 'Gagal Memproses',
        status: msg || 'Terjadi kesalahan saat menghubungi server. Coba lagi.',
        valid: false,
        nomorId: '-',
      })
    } finally {
      setScanning(false)
    }
  }


  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    setCameraError(null)
    setResult(null)
    setPreviewSrc(null)
    setShowForm(false)
    setSubmitted(false)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream

      // Deteksi facing mode aktual
      const track = stream.getVideoTracks()[0]
      const settings = track.getSettings()
      const actualFacing = (settings.facingMode as string) || ''
      setFacingMode(actualFacing === 'environment' ? 'environment' : 'user')

      setMode('camera')
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 100)
    } catch {
      setCameraError('Akses kamera ditolak atau tidak tersedia. Coba upload foto.')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    stopCamera()
    const previewUrl = canvas.toDataURL('image/jpeg')
    // Convert canvas to Blob for multipart upload
    canvas.toBlob((blob) => {
      if (blob) scanWajah(blob, previewUrl)
    }, 'image/jpeg', 0.9)
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Generate preview URL for display
    const previewUrl = URL.createObjectURL(file)
    scanWajah(file, previewUrl)
    e.target.value = ''
  }

  const handleKirimLaporan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lokasi.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await api.post('/laporan/', {
        pelapor_nama: pelapor.trim() || 'Anonim',
        lokasi: lokasi.trim(),
        deskripsi: deskripsi.trim() || 'Juru parkir tidak terdaftar terdeteksi via scan.',
      })
      setSubmitted(true)
      setShowForm(false)
    } catch {
      setSubmitError('Gagal mengirim laporan. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    stopCamera()
    setMode('idle')
    setPreviewSrc(null)
    setResult(null)
    setScanning(false)
    setCameraError(null)
    setShowForm(false)
    setSubmitted(false)
    setPelapor('')
    setLokasi('')
    setDeskripsi('')
    setSubmitError('')
  }

  return (
    <section id="scan" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2">
            Identifikasi Langsung
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Scan Wajah Juru Parkir
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Scan wajah juru parkir untuk cek legalitasnya. Jika ilegal, laporan langsung dikirim ke Dishub.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top bar */}
          <div className="bg-blue-800 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mode === 'camera' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-white text-sm font-medium">
                {mode === 'camera' ? 'Kamera Aktif' : 'Kamera Tidak Aktif'}
              </span>
            </div>
            <span className="text-blue-300 text-xs">SIJAKA PWT v1.0</span>
          </div>

          <div className="p-5 sm:p-8">
            {/* IDLE */}
            {mode === 'idle' && (
              <div className="flex flex-col items-center gap-5">
                {cameraError && (
                  <div className="w-full flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{cameraError}
                  </div>
                )}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-blue-900 rounded-2xl flex items-center justify-center">
                  <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-green-400 rounded-tl" />
                  <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-green-400 rounded-tr" />
                  <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-green-400 rounded-bl" />
                  <span className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-green-400 rounded-br" />
                  <ScanFace className="w-16 h-16 text-blue-600 opacity-40" />
                </div>
                <p className="text-gray-500 text-sm">Pilih metode identifikasi</p>
                <div className="flex gap-3 w-full max-w-xs">
                  <button onClick={() => startCamera()}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm">
                    <Camera className="w-4 h-4" />Kamera
                  </button>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    <Upload className="w-4 h-4" />Upload
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
            )}

            {/* CAMERA */}
            {mode === 'camera' && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full rounded-2xl overflow-hidden bg-black">
                  <span className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-green-400 rounded-tl z-10" />
                  <span className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-green-400 rounded-tr z-10" />
                  <span className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-green-400 rounded-bl z-10" />
                  <span className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-green-400 rounded-br z-10" />
                  <video ref={videoRef} autoPlay playsInline muted
                    className="w-full aspect-video object-cover" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <p className="text-gray-500 text-sm text-center">Arahkan kamera ke wajah juru parkir</p>
                <div className="flex gap-3">
                  <button onClick={capturePhoto}
                    className="flex items-center gap-2 bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm">
                    <ScanFace className="w-4 h-4" />Ambil & Identifikasi
                  </button>
                  <button
                    onClick={() => startCamera(facingMode === 'environment' ? 'user' : 'environment')}
                    title="Ganti kamera"
                    className="p-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                  <button onClick={reset}
                    className="p-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW + RESULT */}
            {mode === 'preview' && (
              <div className="flex flex-col items-center gap-5">
                {previewSrc && (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-blue-200 shrink-0">
                    <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                    {scanning && (
                      <div className="absolute inset-0 bg-blue-900/60 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-white text-xs font-medium">Mengidentifikasi...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Result */}
                {!scanning && result && (
                  <div className={`w-full rounded-2xl border-2 p-4 text-center ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-center mb-2">
                      {result.valid
                        ? <CheckCircle2 className="w-9 h-9 text-green-500" />
                        : <AlertCircle className="w-9 h-9 text-red-500" />}
                    </div>
                    <p className="font-bold text-gray-900">{result.nama}</p>
                    {result.nomorId !== '-' && <p className="text-xs text-gray-400">ID: {result.nomorId}</p>}
                    {result.area && <p className="text-xs text-gray-400">Area: {result.area}</p>}
                    {result.confidence !== undefined && (
                      <p className="text-xs text-gray-400">Akurasi: {result.confidence.toFixed(1)}%</p>
                    )}
                    <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${result.valid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {result.status}
                    </span>
                    {!result.valid && result.nama !== 'Gagal Memproses' && (
                      <p className="text-xs text-red-600 mt-2 font-medium">Isi form di bawah untuk melaporkan ke Dishub</p>
                    )}
                  </div>
                )}

                {/* Form Laporan */}
                {showForm && !submitted && (
                  <form onSubmit={handleKirimLaporan} className="w-full space-y-3 border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <SendHorizonal className="w-4 h-4 text-blue-600" />
                      Kirim Laporan ke Dishub
                    </p>

                    {submitError && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />{submitError}
                      </div>
                    )}

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Nama Anda (opsional)"
                        value={pelapor} onChange={(e) => setPelapor(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Lokasi kejadian *" required
                        value={lokasi} onChange={(e) => setLokasi(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <textarea placeholder="Deskripsi tambahan (opsional)"
                      value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={2}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

                    <button type="submit" disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 text-sm">
                      {submitting
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><SendHorizonal className="w-4 h-4" />Kirim Laporan</>}
                    </button>
                  </form>
                )}

                {/* Success */}
                {submitted && (
                  <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-green-800 text-sm">Laporan Terkirim!</p>
                    <p className="text-xs text-green-600 mt-1">Terima kasih. Petugas Dishub akan segera menindaklanjuti.</p>
                  </div>
                )}

                <button onClick={reset}
                  className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  <RefreshCw className="w-3.5 h-3.5" />Scan Ulang
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          * Hasil identifikasi menggunakan model AI MobileNetV2 yang dilatih khusus untuk sistem SIJAKA PWT.
        </p>
      </div>
    </section>
  )
}
