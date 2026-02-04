import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, AlertTriangle, DollarSign, ShieldCheck } from 'lucide-react'
import './Dashboard.css'

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return (
      <div className="dashboard-page main-content">
        <p>Vui lòng đăng nhập.</p>
        <Link to="/login">Đăng nhập</Link>
      </div>
    )
  }

  if (!isAdmin()) {
    return (
      <div className="dashboard-page main-content">
        <p>Bạn cần quyền Admin để truy cập trang này.</p>
      </div>
    )
  }

  const stats = [
    { label: 'Tin đăng', value: '1,247', icon: FileText },
    { label: 'Chờ duyệt', value: '89', icon: AlertTriangle },
    { label: 'Tranh chấp', value: '12', icon: AlertTriangle },
    { label: 'Kiểm định', value: '45', icon: ShieldCheck },
    { label: 'Doanh thu', value: '2.1M', icon: DollarSign },
  ]

  return (
    <div className="dashboard-page main-content">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
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

      <div className="admin-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quản lý nhanh</h2>
          </div>
          <div className="quick-links">
            <Link to="/admin/users">Quản lý người dùng</Link>
            <Link to="/admin/listings">Kiểm duyệt tin đăng</Link>
            <Link to="/admin/reports">Báo cáo & tranh chấp</Link>
            <Link to="/admin/categories">Danh mục (Loại xe, Hãng)</Link>
            <Link to="/admin/transactions">Giao dịch & phí</Link>
            <Link to="/admin/stats">Thống kê & báo cáo</Link>
          </div>
        </div>
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Tổng quan</h2>
          </div>
          <p className="empty-msg">Biểu đồ thống kê sẽ hiển thị khi có dữ liệu thực.</p>
        </div>
      </div>
    </div>
  )
}
