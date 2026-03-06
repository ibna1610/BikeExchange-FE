import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getListingById } from "../services/api"

import {
  MessageCircle,
  Heart,
  ShoppingCart,
  ShieldCheck,
  ArrowLeft
} from "lucide-react"

import "./ListingDetail.css"

export default function ListingDetail() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    getListingById(id).then(setItem)
  }, [id])

  const toggleWishlist = () => {

    if (!item) return

    setWishlist((prev) => {

      const next = prev.includes(item.id)
          ? prev.filter((x) => x !== item.id)
          : [...prev, item.id]

      localStorage.setItem("wishlist", JSON.stringify(next))

      return next

    })

  }

  const handleOrder = () => {

    if (!item) return

    navigate("/checkout", {
      state: { bike: item }
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

  return (

      <div className="listing-detail-page main-content">

        <Link to="/" className="back-link">
          <ArrowLeft size={18}/> Quay lại
        </Link>

        <div className="detail-layout">

          {/* IMAGE */}
          <div className="detail-gallery">

            <img
                src={item.image}
                alt={item.title}
                style={{width:"100%",borderRadius:"10px"}}
            />

          </div>

          {/* INFO */}
          <div className="detail-info">

            <h1>{item.title}</h1>

            <p className="detail-price">{item.price}</p>

            <p>{item.location}</p>

            <p>{item.description}</p>

            {item.inspected && (

                <div className="inspection-box">

                  <h4>
                    <ShieldCheck size={18}/> Báo cáo kiểm định
                  </h4>

                  <p>{item.inspectionReport}</p>

                </div>

            )}

            {/* SELLER */}
            <div className="detail-seller">

              <strong>{item.contactName}</strong>

              <p>{item.phone}</p>

            </div>

            {/* ACTIONS */}
            <div className="detail-actions">

              <button className="btn btn-primary">
                <MessageCircle size={18}/> Nhắn tin
              </button>

              <button
                  className="btn btn-secondary"
                  onClick={handleOrder}
              >
                <ShoppingCart size={18}/> Đặt mua
              </button>

              <button
                  className={`btn btn-ghost ${isInWishlist ? "active" : ""}`}
                  onClick={toggleWishlist}
              >

                <Heart
                    size={18}
                    fill={isInWishlist ? "currentColor" : "none"}
                />

                Lưu

              </button>

            </div>

          </div>

        </div>

      </div>

  )
}