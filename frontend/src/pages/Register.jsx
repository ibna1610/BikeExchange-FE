import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      await register(form);

      setSuccess("Đăng ký thành công. Bạn có thể đăng nhập.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

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
                  minLength={6}
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
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>

          <p className="auth-switch auth-switch-seller">
            Muốn bán xe? Sau khi đăng nhập, vào{" "}
            <Link to="/register-seller">Đăng ký làm người bán</Link>
          </p>
        </div>
      </div>
  );
}