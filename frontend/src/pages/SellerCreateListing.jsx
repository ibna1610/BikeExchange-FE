import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BICYCLE_TYPES, BICYCLE_BRANDS, FRAME_SIZES, CONDITIONS } from '../data/hardcoded'
import { ArrowLeft } from 'lucide-react'
import './CreateListing.css'

export default function SellerCreateListing() {
  const [form, setForm] = useState({
    title: '',
    type: '',
    brand: '',
    frameSize: '',
    condition: '',
    year: '',
    price: '',
    description: '',
    images: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Đăng tin thành công (mock). Khi có API sẽ lưu thật.')
  }

  return (
    <div className="create-listing-page main-content">
      <Link to="/seller" className="back-link">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <h1>Đăng tin bán xe</h1>

      <form onSubmit={handleSubmit} className="create-form">
        <section className="form-section">
          <h3>Hình ảnh</h3>
          <p className="form-hint">Kéo thả hoặc click để upload (URL tạm thời - sẽ thay bằng upload thật khi có backend)</p>
          <input
            type="text"
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="URL ảnh, phân cách bằng dấu phẩy"
          />
        </section>

        <section className="form-section">
          <h3>Thông tin xe</h3>
          <div className="form-grid">
            <label>
              Tiêu đề
              <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="VD: Giant XTC 800 2021" />
            </label>
            <label>
              Loại xe
              <select name="type" value={form.type} onChange={handleChange} required>
                <option value="">Chọn</option>
                {BICYCLE_TYPES.filter((t) => t !== 'Tất cả').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Hãng
              <select name="brand" value={form.brand} onChange={handleChange} required>
                <option value="">Chọn</option>
                {BICYCLE_BRANDS.filter((b) => b !== 'Tất cả hãng').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label>
              Kích thước khung
              <select name="frameSize" value={form.frameSize} onChange={handleChange}>
                <option value="">Chọn</option>
                {FRAME_SIZES.filter((s) => s !== 'Tất cả').map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Tình trạng
              <select name="condition" value={form.condition} onChange={handleChange} required>
                <option value="">Chọn</option>
                {CONDITIONS.filter((c) => c !== 'Tất cả').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Năm sản xuất
              <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="2021" min="1990" max="2025" />
            </label>
            <label>
              Giá (VNĐ)
              <input type="text" name="price" value={form.price} onChange={handleChange} required placeholder="12.500.000" />
            </label>
          </div>
          <label>
            Mô tả chi tiết
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Mô tả tình trạng xe, lịch sử sử dụng..." />
          </label>
        </section>

        <div className="form-actions">
          <Link to="/seller" className="btn btn-ghost">Hủy</Link>
          <button type="submit" className="btn btn-primary">Đăng tin</button>
        </div>
      </form>
    </div>
  )
}
