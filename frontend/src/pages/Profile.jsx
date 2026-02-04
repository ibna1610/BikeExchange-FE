import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile } from '../services/api'
import { Camera, ArrowLeft } from 'lucide-react'
import './Profile.css'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', avatar: '' })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    getProfile(user.id).then((p) => {
      setForm({
        name: p.name || '',
        email: p.email || user.email || '',
        phone: p.phone || '',
        avatar: p.avatar || '',
      })
      setAvatarPreview(p.avatar || null)
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh (JPEG, PNG, ...)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setAvatarPreview(dataUrl)
      setForm((prev) => ({ ...prev, avatar: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setSaved(false)
    try {
      await updateProfile(user.id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar || null,
      })
      updateUser({ name: form.name.trim(), phone: form.phone.trim(), avatar: form.avatar || null })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert(err.message || 'Cập nhật thất bại.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="profile-page main-content">
        <p>Vui lòng đăng nhập.</p>
        <Link to="/login">Đăng nhập</Link>
      </div>
    )
  }

  return (
    <div className="profile-page main-content">
      <Link to="/account" className="back-link">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <h1>Hồ sơ cá nhân</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-avatar-section">
          <div className="avatar-wrap">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {form.name?.charAt(0) || user.email?.charAt(0) || '?'}
              </div>
            )}
            <label className="avatar-upload">
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              <Camera size={20} /> Thay ảnh
            </label>
          </div>
          <p className="avatar-hint">Ảnh đại diện bắt buộc khi đăng ký bán xe</p>
        </div>

        <div className="form-row">
          <label>
            Họ tên
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Email
            <input type="email" name="email" value={form.email} readOnly disabled className="readonly" />
          </label>
          <p className="field-hint">Email không thể thay đổi</p>
        </div>

        <div className="form-row">
          <label>
            Số điện thoại
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="0903 xxx xxx"
            />
          </label>
        </div>

        {saved && <p className="success-msg">Đã lưu thành công.</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  )
}
