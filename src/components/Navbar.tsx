import { useState } from 'react'
import { Menu, X, ParkingSquare } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Identifikasi', href: '#scan' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Statistik', href: '#statistik' },
  { label: 'Kontak', href: '#kontak' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="#beranda" className="flex items-center gap-2 text-blue-700 font-bold text-lg sm:text-xl">
            <ParkingSquare className="w-6 h-6 sm:w-7 sm:h-7" />
            <span>SIGAP</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className="text-sm text-gray-600 hover:text-blue-700 font-medium transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-gray-600 hover:text-blue-700 p-1"
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="text-sm text-gray-700 hover:text-blue-700 font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
              {link.label}
            </a>
          ))}
          <a href="#scan" onClick={() => setOpen(false)}
            className="mt-2 text-center text-sm font-semibold bg-blue-700 text-white px-4 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">
            Laporkan Sekarang
          </a>
        </div>
      )}
    </nav>
  )
}
