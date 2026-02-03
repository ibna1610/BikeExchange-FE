import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: Khi có backend JWT, hàm login() sẽ gọi API thật và trả về token
      const res = await login({ email, password })
      if (res.success && res.token) {
        // TODO: Lưu token từ backend. Ví dụ: localStorage.setItem('token', res.token)
        localStorage.setItem('token', res.token)
        if (res.user) localStorage.setItem('user', JSON.stringify(res.user))
        navigate('/')
        return
      }
      setError(res.message || 'Đăng nhập thất bại.')
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Khi có API sẽ kết nối backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        <p className="auth-note">
          {/* NOTE: Hiện dùng mock API. Khi backend Spring Boot + JWT sẵn sàng, sửa trong src/services/api.js → login() */}
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <label>
            Email hoặc tên đăng nhập
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              autoComplete="username"
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  )
}
