import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BICYCLE_BRANDS, BICYCLE_TYPES, FRAME_SIZES, CONDITIONS, REGION, MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } from '../data/hardcoded'
import { getListings } from '../services/api'
import { Heart, ShieldCheck, MapPin } from 'lucide-react'
import './HomePage.css'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    frameSize: '',
    condition: '',
    inspected: '', // 'yes' | 'no' | ''
  })
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    let cancelled = false
    getListings({ region: REGION.value })
      .then((res) => {
        if (!cancelled) {
          setListings(res.data || [])
          setTotal(res.total ?? 0)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setListings(MOCK_LISTINGS)
          setTotal(MOCK_TOTAL_LISTINGS)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredListings = useMemo(() => {
    let data = [...listings]
    if (q) {
      const lower = q.toLowerCase()
      data = data.filter(
        (i) =>
          i.title?.toLowerCase().includes(lower) ||
          i.brand?.toLowerCase().includes(lower) ||
          i.type?.toLowerCase().includes(lower)
      )
    }
    if (filters.type && filters.type !== 'Tất cả') data = data.filter((i) => i.type === filters.type)
    if (filters.brand && filters.brand !== 'Tất cả hãng') data = data.filter((i) => i.brand === filters.brand)
    if (filters.frameSize && filters.frameSize !== 'Tất cả') data = data.filter((i) => i.frameSize === filters.frameSize)
    if (filters.condition && filters.condition !== 'Tất cả') data = data.filter((i) => i.condition === filters.condition)
    if (filters.inspected === 'yes') data = data.filter((i) => i.inspected)
    if (filters.inspected === 'no') data = data.filter((i) => !i.inspected)
    return data
  }, [listings, q, filters])

  const toggleWishlist = (id, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem('wishlist', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Tìm xe đạp thể thao phù hợp với bạn</h1>
        <p>Hàng ngàn tin rao uy tín tại TP.HCM • Xe đã kiểm định được ưu tiên</p>
      </div>

      <div className="home-content main-content">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Loại xe</h3>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            >
              {BICYCLE_TYPES.map((t) => (
                <option key={t} value={t === 'Tất cả' ? '' : t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="sidebar-section">
            <h3>Hãng xe</h3>
            <select
              value={filters.brand}
              onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
            >
              {BICYCLE_BRANDS.map((b) => (
                <option key={b} value={b === 'Tất cả hãng' ? '' : b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="sidebar-section">
            <h3>Kích thước khung</h3>
            <select
              value={filters.frameSize}
              onChange={(e) => setFilters((f) => ({ ...f, frameSize: e.target.value }))}
            >
              {FRAME_SIZES.map((s) => (
                <option key={s} value={s === 'Tất cả' ? '' : s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sidebar-section">
            <h3>Tình trạng</h3>
            <select
              value={filters.condition}
              onChange={(e) => setFilters((f) => ({ ...f, condition: e.target.value }))}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c === 'Tất cả' ? '' : c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sidebar-section">
            <h3>Đã kiểm định</h3>
            <div className="filter-check">
              <label>
                <input
                  type="radio"
                  name="inspected"
                  checked={filters.inspected === ''}
                  onChange={() => setFilters((f) => ({ ...f, inspected: '' }))}
                />
                Tất cả
              </label>
              <label>
                <input
                  type="radio"
                  name="inspected"
                  checked={filters.inspected === 'yes'}
                  onChange={() => setFilters((f) => ({ ...f, inspected: 'yes' }))}
                />
                Đã kiểm định
              </label>
              <label>
                <input
                  type="radio"
                  name="inspected"
                  checked={filters.inspected === 'no'}
                  onChange={() => setFilters((f) => ({ ...f, inspected: 'no' }))}
                />
                Chưa kiểm định
              </label>
            </div>
          </div>
        </aside>

        <div className="main-listings">
          <div className="listings-header">
            <span className="region-badge">{REGION.label}</span>
            <span className="listings-count">
              {filteredListings.length} / {total.toLocaleString('vi-VN')} tin
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Đang tải...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="empty-state">
              <p>Không tìm thấy xe phù hợp. Thử điều chỉnh bộ lọc.</p>
            </div>
          ) : (
            <div className="listing-grid">
              {filteredListings.map((item) => (
                <Link to={`/listing/${item.id}`} key={item.id} className="listing-card">
                  <div className="listing-image-wrap">
                    <img src={item.image} alt={item.title} className="listing-image" />
                    {item.inspected && (
                      <span className="badge-inspected">
                        <ShieldCheck size={12} /> Đã kiểm định
                      </span>
                    )}
                    <button
                      type="button"
                      className={`wishlist-btn ${wishlist.includes(item.id) ? 'active' : ''}`}
                      onClick={(e) => toggleWishlist(item.id, e)}
                      aria-label="Lưu yêu thích"
                    >
                      <Heart size={18} fill={wishlist.includes(item.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="listing-body">
                    <h3 className="listing-title">{item.title}</h3>
                    <p className="listing-price">{item.price}</p>
                    <p className="listing-location">
                      <MapPin size={14} /> {item.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
