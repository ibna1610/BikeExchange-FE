import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { submitInspection, getListingById } from '../services/api'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import './Inspector.css'

export default function InspectorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [form, setForm] = useState({
    frame: 'good',
    brake: 'good',
    drivetrain: 'good',
    inspected: true,
    serviceFee: '',
    notes: '',
  })

  useEffect(() => {
    getListingById(id).then((data) => {
      setListing(data)
      if (data?.inspected && data?.inspectionReport) {
        setForm((f) => ({ ...f, inspected: true, notes: data.inspectionReport }))
      }
    })
  }, [id])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitInspection(id, {
        inspected: form.inspected,
        inspectionReport: form.notes || `Khung sườn: ${form.frame}, Phanh: ${form.brake}, Truyền động: ${form.drivetrain}. Chi phí: ${form.serviceFee || 0} VNĐ`,
      })
      alert('Đánh giá "Đã kiểm định" đã lưu. Sản phẩm sẽ hiển thị đồng bộ trên tất cả role.')
      navigate('/inspector')
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra.')
    }
  }

  return (
    <div className="inspector-form-page main-content">
      <Link to="/inspector" className="back-link">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <h1>Kiểm định xe #{id}{listing ? ` - ${listing.title}` : ''}</h1>

      <form onSubmit={handleSubmit} className="inspection-form">
        <div className="form-section">
          <h3>Kết quả kiểm tra</h3>
          {['frame', 'brake', 'drivetrain'].map((key) => (
            <div key={key} className="inspect-row">
              <label>
                {key === 'frame' && 'Khung sườn'}
                {key === 'brake' && 'Phanh'}
                {key === 'drivetrain' && 'Hệ truyền động'}
              </label>
              <div className="radio-group">
                {['good', 'normal', 'bad'].map((v) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name={key}
                      value={v}
                      checked={form[key] === v}
                      onChange={handleChange}
                    />
                    {v === 'good' && 'Tốt'}
                    {v === 'normal' && 'Bình thường'}
                    {v === 'bad' && 'Hư hỏng'}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <label>
            Ghi chú chi tiết
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} placeholder="Mô tả tình trạng chi tiết..." />
          </label>
        </div>

        <div className="form-section">
          <h3>Chi phí dịch vụ</h3>
          <label>
            Số tiền (VNĐ)
            <input type="number" name="serviceFee" value={form.serviceFee} onChange={handleChange} placeholder="200000" />
          </label>
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="inspected"
              checked={form.inspected}
              onChange={(e) => setForm((p) => ({ ...p, inspected: e.target.checked }))}
            />
            Đánh giá sản phẩm là <strong>"Đã kiểm định"</strong> (hiển thị đồng bộ trên Buyer, Seller, Admin)
          </label>
        </div>

        <div className="label-preview">
          <ShieldCheck size={24} />
          <p>Nhãn "Xe đã kiểm định" sẽ được gắn sau khi thanh toán online</p>
        </div>

        <div className="form-actions">
          <Link to="/inspector" className="btn btn-ghost">Hủy</Link>
          <button type="submit" className="btn btn-primary">Lưu đánh giá & Hoàn thành</button>
        </div>
      </form>
    </div>
  )
}
