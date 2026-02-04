import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getListings } from '../services/api'
import { Heart, Package, MessageCircle, Star } from 'lucide-react'
import './Account.css'

export default function Account() {
  const { user } = useAuth()
  const [tab, setTab] = useState('wishlist')
  const [listings, setListings] = useState([])
  const [wishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    getListings().then((res) => setListings(res.data || []))
  }, [])

  const wishlistItems = listings.filter((i) => wishlist.includes(i.id))

  if (!user) {
    return (
      <div className="account-page main-content">
        <p>Vui lòng đăng nhập để xem tài khoản.</p>
        <Link to="/login">Đăng nhập</Link>
      </div>
    )
  }

  return (
    <div className="account-page main-content">
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-user">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="account-avatar-img" />
            ) : (
              <div className="account-avatar">{user.name?.charAt(0) || user.email?.charAt(0) || '?'}</div>
            )}
            <h3>{user.name || user.email}</h3>
            <p>{user.email}</p>
            {user.phone && <p className="account-phone">{user.phone}</p>}
            <Link to="/profile" className="account-edit-profile">Chỉnh sửa hồ sơ</Link>
          </div>
          <nav className="account-nav">
            <button
              type="button"
              className={tab === 'wishlist' ? 'active' : ''}
              onClick={() => setTab('wishlist')}
            >
              <Heart size={18} /> Wishlist
            </button>
            <button
              type="button"
              className={tab === 'orders' ? 'active' : ''}
              onClick={() => setTab('orders')}
            >
              <Package size={18} /> Đơn mua
            </button>
            <button
              type="button"
              className={tab === 'messages' ? 'active' : ''}
              onClick={() => setTab('messages')}
            >
              <MessageCircle size={18} /> Tin nhắn
            </button>
            <button
              type="button"
              className={tab === 'reviews' ? 'active' : ''}
              onClick={() => setTab('reviews')}
            >
              <Star size={18} /> Đánh giá
            </button>
          </nav>
        </aside>
        <div className="account-main">
          {tab === 'wishlist' && (
            <div className="account-section">
              <h2>Xe yêu thích</h2>
              {wishlistItems.length === 0 ? (
                <p className="empty-msg">Chưa có xe nào trong danh sách yêu thích.</p>
              ) : (
                <div className="wishlist-grid">
                  {wishlistItems.map((item) => (
                    <Link to={`/listing/${item.id}`} key={item.id} className="wishlist-card">
                      <img src={item.image} alt={item.title} />
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'orders' && (
            <div className="account-section">
              <h2>Đơn mua</h2>
              <p className="empty-msg">Chưa có đơn hàng nào.</p>
            </div>
          )}
          {tab === 'messages' && (
            <div className="account-section">
              <h2>Tin nhắn</h2>
              <p className="empty-msg">Chưa có tin nhắn nào.</p>
            </div>
          )}
          {tab === 'reviews' && (
            <div className="account-section">
              <h2>Đánh giá đã viết</h2>
              <p className="empty-msg">Chưa có đánh giá nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
