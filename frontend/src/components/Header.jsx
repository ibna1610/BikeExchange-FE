import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <nav className="header-nav">
        <Link to="/">Trang chủ</Link>
        <Link to="/">Tìm mua xe đạp</Link>
        <Link to="/">Salon Xe Đạp</Link>
        <Link to="/">Bán xe đạp</Link>
        <Link to="/">Giá xe đạp</Link>
        <Link to="/">Cần mua?</Link>
        <Link to="/login" className="header-account">Tài khoản của tôi</Link>
      </nav>
      <div className="header-search-bar">
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Tin bán xe đạp"
            aria-label="Tìm tin bán xe đạp"
          />
          <input
            type="text"
            className="search-input"
            placeholder="Tin mua xe đạp"
            aria-label="Tìm tin mua xe đạp"
          />
          <button type="button" className="search-btn">Tìm kiếm</button>
        </div>
      </div>
    </header>
  )
}
