import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getListingById } from '../services/api'
import { MessageCircle, Heart, ShoppingCart, ShieldCheck, ArrowLeft } from 'lucide-react'
import './ListingDetail.css'

export default function ListingDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    getListingById(id).then(setItem)
  }, [id])

  const toggleWishlist = () => {
    if (!item) return
    setWishlist((prev) => {
      const next = prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
      localStorage.setItem('wishlist', JSON.stringify(next))
      return next
    })
  }

  if (!item) {
    return (
      <div className="listing-detail-page main-content">
        <p>Không tìm thấy tin đăng.</p>
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    )
  }

  const isInWishlist = wishlist.includes(item.id)
  const images = item.images || [item.image]

  return (
    <div className="listing-detail-page main-content">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="gallery-main">
            <img src={images[0] || item.image} alt={item.title} />
            {item.inspected && (
              <span className="badge-inspected badge-large">
                <ShieldCheck size={16} /> Đã kiểm định
              </span>
            )}
          </div>
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{item.title}</h1>
          <p className="detail-price">{item.price}</p>
          <div className="detail-meta">
            <span>Mã: {item.code}</span>
            <span>•</span>
            <span>{item.location}</span>
            <span>•</span>
            <span>Năm {item.year}</span>
          </div>

          <div className="detail-specs">
            <div className="spec-row"><span>Loại xe</span><strong>{item.type || '—'}</strong></div>
            <div className="spec-row"><span>Hãng</span><strong>{item.brand || '—'}</strong></div>
            <div className="spec-row"><span>Kích thước khung</span><strong>{item.frameSize || '—'}</strong></div>
            <div className="spec-row"><span>Tình trạng</span><strong>{item.condition || '—'}</strong></div>
          </div>

          <p className="detail-desc">{item.description}</p>

          {item.inspected && item.inspectionReport && (
            <div className="inspection-box">
              <h4><ShieldCheck size={18} /> Báo cáo kiểm định</h4>
              <p>{item.inspectionReport}</p>
            </div>
          )}

          <div className="detail-seller">
            <div className="seller-avatar">
              {item.contactName?.charAt(0) || '?'}
            </div>
            <div>
              <strong>{item.contactName}</strong>
              <p className="seller-contact">{item.phone} • {item.contactAddress}</p>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" className="btn btn-primary">
              <MessageCircle size={18} /> Nhắn tin
            </button>
            <button type="button" className="btn btn-secondary">
              <ShoppingCart size={18} /> Đặt mua
            </button>
            <button
              type="button"
              className={`btn btn-ghost ${isInWishlist ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} /> Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
