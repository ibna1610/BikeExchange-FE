import { Link } from 'react-router-dom'
import { Edit, EyeOff, Trash2 } from 'lucide-react'
import './ManageListings.css'

export default function SellerListings() {
  return (
    <div className="manage-listings-page main-content">
      <div className="page-header">
        <h1>Quản lý tin đăng</h1>
        <Link to="/seller/create" className="btn btn-primary">Đăng tin mới</Link>
      </div>

      <div className="tabs">
        <button type="button" className="active">Tất cả</button>
        <button type="button">Đang hiển thị</button>
        <button type="button">Đã ẩn</button>
        <button type="button">Chờ duyệt</button>
      </div>

      <p className="empty-msg">Chưa có tin đăng nào.</p>
    </div>
  )
}
