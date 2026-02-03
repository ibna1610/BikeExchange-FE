import { useState, useEffect } from 'react'
import { BICYCLE_BRANDS, REGION, MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } from '../data/hardcoded'
import { getListings } from '../services/api'
import './HomePage.css'

export default function HomePage() {
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // TODO: Khi có API backend, thay bằng gọi getListings({ region: 'hcm', page, limit })
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

  return (
    <div className="home-page">
      <div className="home-content">
        <aside className="sidebar">
          <h2 className="sidebar-title">Tìm theo hãng xe</h2>
          <ul className="brand-list">
            {BICYCLE_BRANDS.map((brand) => (
              <li key={brand}>
                <a href="#brand" className="brand-link">{brand}</a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="main-listings">
          <div className="region-bar">
            <span className="region-tab active">{REGION.label}</span>
            <span className="listings-count">Tổng: {total.toLocaleString('vi-VN')} tin</span>
          </div>
          <h1 className="section-title">MUA BÁN XE ĐẠP</h1>

          {loading ? (
            <p className="loading-text">Đang tải...</p>
          ) : (
            <ul className="listing-list">
              {listings.map((item) => (
                <li key={item.id} className="listing-card">
                  <div className="listing-image-wrap">
                    <img src={item.image} alt={item.title} className="listing-image" />
                  </div>
                  <div className="listing-body">
                    <h3 className="listing-title">{item.title}</h3>
                    <p className="listing-price">{item.price}</p>
                    <p className="listing-location">{item.location}</p>
                    <p className="listing-desc">{item.description}</p>
                    <p className="listing-contact">
                      LH: {item.contactName} - {item.contactAddress}
                    </p>
                    <p className="listing-phone">ĐT: {item.phone}</p>
                    <p className="listing-code">Mã: {item.code}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
