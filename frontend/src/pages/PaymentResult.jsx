import { useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { createOrder } from "../services/api"

export default function PaymentResult() {

    const [params] = useSearchParams()

    const responseCode = params.get("vnp_ResponseCode")

    const bikeId = params.get("bikeId")

    const success = responseCode === "00"

    useEffect(() => {

        const handleCreateOrder = async () => {

            if(success && bikeId){

                try{

                    await createOrder(bikeId)

                }catch(err){

                    console.error("Create order error:", err)

                }

            }

        }

        handleCreateOrder()

    }, [success, bikeId])

    return (

        <div className="main-content">

            {success ? (

                <>
                    <h2>Thanh toán thành công 🎉</h2>
                    <p>Tiền đã được giữ trong ví trung gian.</p>
                    <p>Seller sẽ giao xe cho bạn.</p>
                </>

            ) : (

                <>
                    <h2>Thanh toán thất bại ❌</h2>
                    <p>Bạn đã hủy giao dịch hoặc giao dịch hết hạn.</p>
                </>

            )}

            <Link
                to="/"
                style={{marginTop:"20px",display:"inline-block"}}
            >
                Quay về trang chủ
            </Link>

        </div>

    )

}