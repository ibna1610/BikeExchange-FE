import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getListingById } from '../services/api'
import { MessageCircle, Heart, ShoppingCart, ShieldCheck, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import './ListingDetail.css'

export default function ListingDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]')
    } catch { return [] }
  })
  // Touch/swipe support for mobile - MUST be declared before any early returns
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

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
  const images = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : [])
  
  const nextImage = () => {
    if (images.length === 0) return
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    if (images.length === 0) return
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index) => {
    if (images.length === 0) return
    setCurrentImageIndex(index)
  }

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || images.length === 0) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      nextImage()
    }
    if (isRightSwipe) {
      prevImage()
    }
  }

  return (
    <div className="listing-detail-page main-content">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Quay lại
      </Link>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div 
            className="gallery-main"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {images.length > 0 ? (
              <img src={images[currentImageIndex]} alt={`${item.title} - Ảnh ${currentImageIndex + 1}`} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                Không có hình ảnh
              </div>
            )}
            {item.inspected && (
              <span className="badge-inspected badge-large">
                <ShieldCheck size={16} /> Đã kiểm định
              </span>
            )}
            {images.length > 1 && (
              <>
                <button 
                  className="gallery-nav gallery-nav-prev" 
                  onClick={prevImage}
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="gallery-nav gallery-nav-next" 
                  onClick={nextImage}
                  aria-label="Ảnh sau"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="gallery-indicator">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                >
                  <img src={img} alt={`${item.title} - Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
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
