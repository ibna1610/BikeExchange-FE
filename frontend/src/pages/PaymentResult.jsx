import { useSearchParams, Link } from "react-router-dom"

export default function PaymentResult() {

    const [params] = useSearchParams()

    const status = params.get("status")

    return (

        <div className="main-content">

            {status === "success" ? (

                <>
                    <h2>Thanh toán thành công 🎉</h2>
                    <p>Đơn hàng của bạn đã được ghi nhận.</p>
                </>

            ) : (

                <>
                    <h2>Thanh toán thất bại ❌</h2>
                    <p>Bạn đã hủy giao dịch hoặc giao dịch hết hạn.</p>
                </>

            )}

            <Link to="/" style={{marginTop:"20px",display:"inline-block"}}>
                Quay về trang chủ
            </Link>

        </div>

    )
}