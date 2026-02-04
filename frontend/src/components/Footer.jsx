import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/">Giới thiệu</Link>
          <Link to="/">Liên hệ</Link>
          <Link to="/">Chính sách bảo mật</Link>
          <Link to="/">Điều khoản sử dụng</Link>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} BikeExchange - Mua Bán Xe Đạp Thể Thao TP.HCM
        </p>
        <p className="footer-note">
          Kết nối mua bán xe đạp thể thao đã qua sử dụng • Kiểm định uy tín • Giao dịch an toàn
        </p>
      </div>
    </footer>
  )
}
