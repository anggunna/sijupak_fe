import { useState, useEffect, useRef, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, ScanLine, FileWarning,
  MapPin, Settings, LogOut, Menu, X, ParkingSquare,
  Bell, MapPinned, Clock,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/axios'
import SessionGuard from '@/components/SessionGuard'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Juru Parkir', icon: Users, href: '/dashboard/juru-parkir' },
  { label: 'Aktivitas Scan', icon: ScanLine, href: '/dashboard/aktivitas' },
  { label: 'Laporan Masuk', icon: FileWarning, href: '/dashboard/laporan' },
]

const navSecondary = [
  { label: 'Zona Parkir', icon: MapPin, href: '/dashboard/zona' },
]

interface NotifItem {
  id: number
  pelapor_nama: string
  lokasi: string
  deskripsi: string
  created_at: string
  is_read: boolean
}

interface Props { children: ReactNode }

export default function DashboardLayout({ children }: Props) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [notifs, setNotifs] = useState<NotifItem[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const notifOpenRef = useRef(false)
  const pathnameRef = useRef(location.pathname)
  useEffect(() => { notifOpenRef.current = notifOpen }, [notifOpen])

  const handleLogout = () => {
    logout()
    navigate('/admin', { replace: true })
  }

  const initials = user?.nama?.slice(0, 2).toUpperCase() ?? 'AD'

  // Fetch notifikasi
  // Sync pathnameRef setiap kali location berubah
  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  const fetchNotif = () => {
    if (pathnameRef.current === '/dashboard/laporan') return
    api.get('/notifikasi/').then((res) => {
      setNotifs(res.data.items)
      setUnread(res.data.total_unread)
    }).catch(() => {})
  }

  const markSeen = () => {
    const token = localStorage.getItem('access_token')
    console.log('markSeen called, token exists:', !!token)
    api.post('/notifikasi/mark-seen').then((res) => {
      console.log('markSeen response:', res.data)
      setUnread(0)
      setNotifs([])
    }).catch((err) => { console.error('markSeen error:', err.response?.data) })
  }

  useEffect(() => {
    if (location.pathname === '/dashboard/laporan') {
      markSeen()
      setNotifOpen(false)
    }
  }, [location.pathname])

  useEffect(() => {
    fetchNotif()
    const interval = setInterval(fetchNotif, 3000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown when click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        if (notifOpenRef.current) markSeen()
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const formatTime = (t: string) => {
    const d = new Date(t)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return `${diff}d lalu`
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`
    if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const NavLink = ({ item, badge }: { item: typeof navItems[0], badge?: number }) => {
    const active = location.pathname === item.href
    return (
      <Link to={item.href} onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
          active ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium'
        }`}>
        <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className="flex-1">{item.label}</span>
        {badge != null && badge > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        {active && !badge && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
      </Link>
    )
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-56 shrink-0">
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <ParkingSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-none">SIGAP</p>
            <p className="text-gray-400 text-xs mt-0.5">Dinas Perhubungan</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item}
              badge={item.href === '/dashboard/laporan' ? unread : undefined} />
          ))}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Manajemen</p>
          <div className="space-y-0.5">
            {navSecondary.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.nama}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Keluar"
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )

  const currentLabel = [...navItems, ...navSecondary].find(n => n.href === location.pathname)?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SessionGuard />
      <div className="hidden md:flex"><Sidebar /></div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 shadow-xl"><Sidebar /></div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-gray-700 p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-sm font-semibold text-gray-800">{currentLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-gray-400">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-semibold text-gray-800 text-sm">Notifikasi</p>
                    {unread > 0 && (
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {unread} baru
                      </span>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifs.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Tidak ada notifikasi</p>
                      </div>
                    ) : (
                      notifs.map((n) => (
                        <Link key={n.id} to="/dashboard/laporan"
                          onClick={() => { setNotifOpen(false); markSeen() }}
                          className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${n.is_read ? 'opacity-50' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.is_read ? 'bg-gray-100' : 'bg-red-100'}`}>
                            <FileWarning className={`w-4 h-4 ${n.is_read ? 'text-gray-400' : 'text-red-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${n.is_read ? 'text-gray-400' : 'text-gray-800'}`}>
                              Laporan dari {n.pelapor_nama}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPinned className="w-3 h-3 text-gray-400 shrink-0" />
                              <p className="text-xs text-gray-500 truncate">{n.lokasi}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                              <p className="text-xs text-gray-400">{formatTime(n.created_at)}</p>
                            </div>
                          </div>
                          {!n.is_read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />}
                        </Link>
                      ))
                    )}
                  </div>

                  {notifs.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-100">
                      <Link to="/dashboard/laporan" onClick={() => { setNotifOpen(false); markSeen() }}
                        className="text-xs text-blue-600 font-medium hover:underline">
                        Lihat semua laporan →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link to="/dashboard/pengaturan"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>

            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
