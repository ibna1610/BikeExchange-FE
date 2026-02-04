import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getListings } from '../services/api'
import { ShieldCheck, MapPin } from 'lucide-react'
import './Inspector.css'

export default function InspectorDashboard() {
  const { user, isInspector } = useAuth()
  const [filter, setFilter] = useState('all')
  const [listings, setListings] = useState([])

  useEffect(() => {
    getListings().then((res) => setListings(res.data || []))
  }, [])

  const filteredListings = listings.filter((item) => {
    if (filter === 'pending') return !item.inspected
    if (filter === 'done') return item.inspected
    return true
  })

  if (!user) {
    return (
      <div className="inspector-page main-content">
        <p>Vui lòng đăng nhập.</p>
        <Link to="/login">Đăng nhập</Link>
      </div>
    )
  }

  if (!isInspector()) {
    return (
      <div className="inspector-page main-content">
        <p>Bạn cần quyền Inspector để truy cập trang này.</p>
      </div>
    )
  }

  return (
    <div className="inspector-page main-content">
      <div className="inspector-header">
        <h1>Kiểm định xe</h1>
        <div className="inspector-badge">
          <ShieldCheck size={20} /> Phạm vi: TP.HCM (Offline)
        </div>
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="pending">Chưa kiểm</option>
          <option value="done">Đã xong</option>
        </select>
      </div>

      <div className="inspection-list">
        {filteredListings.map((item) => (
          <div key={item.id} className="inspection-card">
            <div>
              <h4>#{item.id} - {item.title}</h4>
              <p><MapPin size={14} /> {item.location}</p>
              {item.inspected && (
                <span className="badge-inspected" style={{ marginTop: 8, display: 'inline-flex' }}>
                  <ShieldCheck size={12} /> Đã kiểm định
                </span>
              )}
            </div>
            <div className="inspection-actions">
              {!item.inspected ? (
                <Link to={`/inspector/inspect/${item.id}`} className="btn btn-primary">
                  Nhận kiểm định
                </Link>
              ) : (
                <Link to={`/inspector/inspect/${item.id}`} className="btn btn-secondary">
                  Xem / Sửa đánh giá
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="form-note">
        Chi phí dịch vụ kiểm định được thanh toán online. Nhãn dán sẽ phát khi hoàn thành.
      </p>
    </div>
  )
}
