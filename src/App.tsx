import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import DashboardLayout from '@/layouts/DashboardLayout'
import DashboardHome from '@/pages/dashboard/DashboardHome'
import JuruParkirPage from '@/pages/dashboard/JuruParkirPage'
import LaporanPage from '@/pages/dashboard/LaporanPage'
import AktivitasScanPage from '@/pages/dashboard/AktivitasScanPage'
import PlaceholderPage from '@/pages/dashboard/PlaceholderPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />

          {/* Admin dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute role="admin"><DashboardLayout><DashboardHome /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/juru-parkir" element={<ProtectedRoute role="admin"><DashboardLayout><JuruParkirPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/aktivitas" element={<ProtectedRoute role="admin"><DashboardLayout><AktivitasScanPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/laporan" element={<ProtectedRoute role="admin"><DashboardLayout><LaporanPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/zona" element={<ProtectedRoute role="admin"><DashboardLayout><PlaceholderPage title="Zona Parkir" /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/pengaturan" element={<ProtectedRoute role="admin"><DashboardLayout><PlaceholderPage title="Pengaturan" /></DashboardLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
