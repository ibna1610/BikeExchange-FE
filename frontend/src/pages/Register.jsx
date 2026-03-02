import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../services/api'
import './Auth.css'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)
    try {
      const res = await registerApi(form)

      if (res.success) {
        setSuccess(res.message || 'Đăng ký thành công.')
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setError(res.message || 'Đăng ký thất bại.')
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Đăng ký</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <label>
              Họ tên
              <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
              />
            </label>

            <label>
              Email
              <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
              />
            </label>

            <label>
              Mật khẩu
              <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
              />
            </label>

            <label>
              Xác nhận mật khẩu
              <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
              />
            </label>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
  )
}