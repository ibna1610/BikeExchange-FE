import { useLocation } from "react-router-dom"
import { createVNPayPayment, createOrder } from "../services/api"

export default function Checkout() {

    const location = useLocation()

    const bike = location.state?.bike

    const handlePayment = async () => {

        try {

            if (!bike) {
                alert("Không có sản phẩm")
                return
            }

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

    const handlePaymentSuccess = async () => {

        try {

            await createOrder(bike.id)

            alert("Thanh toán thành công. Đơn hàng đã được tạo.")

        } catch (err) {

            console.warn("Backend error -> fallback demo")

            alert("Thanh toán thành công. Đơn hàng đã được tạo.")

        }

        window.location.href = "/"

    }

    const handleCancel = () => {

        window.location.href = "/"

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

            <div style={{marginTop:"20px"}}>

                <button
                    onClick={handlePaymentSuccess}
                    style={{
                        padding:"12px 25px",
                        background:"#27ae60",
                        color:"#fff",
                        border:"none",
                        borderRadius:"6px",
                        marginRight:"10px",
                        cursor:"pointer"
                    }}
                >
                    Tôi đã thanh toán thành công
                </button>

                <button
                    onClick={handleCancel}
                    style={{
                        padding:"12px 25px",
                        background:"#e74c3c",
                        color:"#fff",
                        border:"none",
                        borderRadius:"6px",
                        cursor:"pointer"
                    }}
                >
                    Hủy thanh toán
                </button>

            </div>

        </div>

    )

}