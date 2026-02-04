import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Search, User, UserCircle, LogOut, Store, ShieldCheck, LayoutDashboard, ChevronDown } from 'lucide-react'
import './Header.css'

export default function Header() {
  const { user, logout, isSeller, isInspector, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchBike, setSearchBike] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e?.preventDefault()
    navigate(`/?q=${encodeURIComponent(searchBike)}`)
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="header-top">
        <Link to="/" className="header-logo">
          BikeExchange
        </Link>
        <nav className="header-nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/">Tìm mua xe</Link>
          <Link to={isSeller() ? '/seller' : '/register-seller'}>Bán xe</Link>
          {isInspector() && <Link to="/inspector">Kiểm định</Link>}
          {isAdmin() && <Link to="/admin">Admin</Link>}
        </nav>
        <div className="header-actions">
          {user ? (
            <div className="user-menu-wrap">
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <User size={18} />
                <span>{user.name || user.email}</span>
                <ChevronDown size={16} />
              </button>
              {userMenuOpen && (
                <>
                  <div className="user-menu-backdrop" onClick={() => setUserMenuOpen(false)} />
                  <div className="user-menu">
                    <Link to="/account" onClick={() => setUserMenuOpen(false)}>
                      <User size={16} /> Tài khoản
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                      <UserCircle size={16} /> Hồ sơ
                    </Link>
                    {isSeller() && (
                      <Link to="/seller" onClick={() => setUserMenuOpen(false)}>
                        <Store size={16} /> Seller
                      </Link>
                    )}
                    {isInspector() && (
                      <Link to="/inspector" onClick={() => setUserMenuOpen(false)}>
                        <ShieldCheck size={16} /> Kiểm định
                      </Link>
                    )}
                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={16} /> Admin
                      </Link>
                    )}
                    <button className="user-menu-logout" onClick={handleLogout}>
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header-btn header-btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="header-btn header-btn-primary">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
      <form className="header-search" onSubmit={handleSearch}>
        <span className="search-icon-wrap">
          <Search size={20} className="search-icon" />
        </span>
        <input
          type="text"
          placeholder="Tìm xe đạp theo tên, hãng, loại..."
          value={searchBike}
          onChange={(e) => setSearchBike(e.target.value)}
          className="search-input"
          aria-label="Tìm kiếm xe đạp"
        />
        <button type="submit" className="search-btn">Tìm</button>
      </form>
    </header>
  )
}
