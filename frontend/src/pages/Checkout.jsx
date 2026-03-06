import { useLocation } from "react-router-dom"
import { createVNPayPayment } from "../services/orderService"

export default function Checkout() {

    const location = useLocation()

    const bike = location.state?.bike

    const handlePayment = async () => {

        try {

            if (!bike) {
                alert("Không có sản phẩm")
                return
            }

            /**
             * convert giá
             * "12.5 Triệu" -> 12500000
             */
            let amount = 0

            if (bike.price.includes("Triệu")) {
                amount = parseFloat(bike.price) * 1000000
            } else {
                amount = parseInt(bike.price.replace(/\D/g, ""))
            }

            const paymentUrl = await createVNPayPayment(amount)

            window.location.href = paymentUrl

        } catch (err) {

            console.error(err)

            alert("Thanh toán thất bại")

        }

    }

    if (!bike) {

        return (
            <div className="main-content">
                <h2>Không tìm thấy sản phẩm</h2>
            </div>
        )

    }

    return (

        <div className="main-content">

            <h2>Xác nhận đơn hàng</h2>

            <div style={{
                border:"1px solid #ddd",
                padding:"20px",
                borderRadius:"10px",
                maxWidth:"600px"
            }}>

                <h3>{bike.title}</h3>

                <p>Giá: {bike.price}</p>

                <p>Người bán: {bike.contactName}</p>

                <p>Địa điểm: {bike.location}</p>

            </div>

            <button
                onClick={handlePayment}
                style={{
                    marginTop:"20px",
                    padding:"12px 25px",
                    background:"#16a085",
                    color:"#fff",
                    border:"none",
                    borderRadius:"6px",
                    cursor:"pointer"
                }}
            >
                Thanh toán VNPay
            </button>

        </div>

    )
}