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
          © {new Date().getFullYear()} Mua Bán Xe Đạp Thể Thao Cũ - Khu vực TP.HCM. All rights reserved.
        </p>
        <p className="footer-note">
          Website kết nối mua bán xe đạp thể thao đã qua sử dụng tại Thành phố Hồ Chí Minh.
        </p>
      </div>
    </footer>
  )
}
