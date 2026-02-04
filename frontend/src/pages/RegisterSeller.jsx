import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerSeller } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Store, ArrowLeft } from 'lucide-react'
import './Auth.css'

export default function RegisterSeller() {
  const navigate = useNavigate()
  const { user, login, updateUser } = useAuth()
  const [form, setForm] = useState({
    storeName: '',
    address: '',
    phone: '',
    taxCode: '',
    idCard: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await registerSeller({ ...form, userId: user?.id })
      if (res.success) {
        const newRoles = [...(user?.roles || []), 'SELLER']
        updateUser({ roles: newRoles })
        setSuccess(res.message || 'Đăng ký Seller thành công!')
        setTimeout(() => navigate('/seller'), 1500)
      } else {
        setError(res.message || 'Đăng ký thất bại.')
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-error">Vui lòng đăng nhập trước khi đăng ký làm người bán.</p>
          <Link to="/login" className="auth-link-btn">Đăng nhập</Link>
        </div>
      </div>
    )
  }

  if (user?.roles?.includes('SELLER')) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-success">Bạn đã là Seller. Chuyển đến trang quản lý bán hàng.</p>
          <Link to="/seller" className="auth-link-btn">Vào Seller Dashboard</Link>
        </div>
      </div>
    )
  }

  const needsAvatar = !user?.avatar
  if (needsAvatar) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-error">Bạn cần cập nhật ảnh đại diện trước khi đăng ký bán xe.</p>
          <Link to="/profile" className="auth-link-btn">Cập nhật ảnh đại diện</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={18} /> Quay lại
        </Link>
        <div className="auth-icon-wrap">
          <Store size={32} strokeWidth={2} />
        </div>
        <h1>Đăng ký bán xe</h1>
        <p className="auth-desc">Điền đầy đủ thông tin để trở thành người bán trên BikeExchange</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <label>
            Tên cửa hàng / Cá nhân kinh doanh
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              placeholder="VD: Cửa hàng xe đạp ABC"
              required
            />
          </label>
          <label>
            Địa chỉ
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Số nhà, đường, quận, TP.HCM"
              required
            />
          </label>
          <label>
            Số điện thoại
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0903 xxx xxx"
              required
            />
          </label>
          <label>
            Mã số thuế (nếu có)
            <input
              type="text"
              name="taxCode"
              value={form.taxCode}
              onChange={handleChange}
              placeholder="Tùy chọn"
            />
          </label>
          <label>
            CMND/CCCD
            <input
              type="text"
              name="idCard"
              value={form.idCard}
              onChange={handleChange}
              placeholder="Số CMND/CCCD"
              required
            />
          </label>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký bán xe'}
          </button>
        </form>
      </div>
    </div>
  )
}
