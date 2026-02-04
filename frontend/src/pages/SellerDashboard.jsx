import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, MessageCircle, Star, Plus, FileText } from 'lucide-react'
import './Dashboard.css'

export default function SellerDashboard() {
  const { user, isSeller } = useAuth()

  if (!user) {
    return (
      <div className="dashboard-page main-content">
        <p>Vui lòng đăng nhập.</p>
        <Link to="/login">Đăng nhập</Link>
      </div>
    )
  }

  if (!isSeller()) {
    return (
      <div className="dashboard-page main-content">
        <p>Bạn cần đăng ký làm Seller để truy cập trang này.</p>
        <Link to="/register-seller">Đăng ký bán xe</Link>
      </div>
    )
  }

  const stats = [
    { label: 'Tin đăng', value: '12', icon: FileText },
    { label: 'Đang bán', value: '3', icon: Package },
    { label: 'Tin nhắn mới', value: '5', icon: MessageCircle },
    { label: 'Đánh giá', value: '4.8★', icon: Star },
  ]

  return (
    <div className="dashboard-page main-content">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <Link to="/seller/create" className="btn btn-primary">
          <Plus size={18} /> Đăng tin mới
        </Link>
      </div>

      <div className="dashboard-stats">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <s.icon size={24} className="stat-icon" />
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Tin đăng gần đây</h2>
          <Link to="/seller/listings">Xem tất cả</Link>
        </div>
        <p className="empty-msg">Chưa có tin đăng. <Link to="/seller/create">Đăng tin ngay</Link></p>
      </div>
    </div>
  )
}
