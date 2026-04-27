import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ShieldAlert } from 'lucide-react'

function getTokenExpiry(): number | null {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 // convert to ms
  } catch {
    return null
  }
}

export default function SessionGuard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    const WARNING_BEFORE_MS = 60 * 1000 // tampilkan warning 60 detik sebelum expired

    const check = () => {
      const expiry = getTokenExpiry()
      if (!expiry) return

      const remaining = expiry - Date.now()

      if (remaining <= 0) {
        // Sudah expired — langsung logout
        logout()
        navigate('/admin', { replace: true })
        return
      }

      if (remaining <= WARNING_BEFORE_MS) {
        // Hitung mundur dalam detik
        setCountdown(Math.ceil(remaining / 1000))
      } else {
        setCountdown(null)
      }
    }

    check()
    const interval = setInterval(check, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogoutNow = () => {
    logout()
    navigate('/admin', { replace: true })
  }

  if (countdown === null) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 text-center">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7 text-orange-500" />
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Sesi Akan Berakhir</h2>
        <p className="text-sm text-gray-500 mb-5">
          Sesi Anda akan berakhir dalam
        </p>

        {/* Countdown */}
        <div className="w-20 h-20 rounded-full border-4 border-orange-200 flex items-center justify-center mx-auto mb-5 relative">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#fed7aa" strokeWidth="4" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="#f97316" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - Math.min(countdown, 60) / 60)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="text-2xl font-bold text-orange-500 relative z-10">{countdown}</span>
        </div>

        <p className="text-xs text-gray-400 mb-5">detik</p>

        <div className="flex gap-3">
          <button onClick={handleLogoutNow}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Logout Sekarang
          </button>
          <button onClick={() => setCountdown(null)}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Tetap Login
          </button>
        </div>
      </div>
    </div>
  )
}
