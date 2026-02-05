import { getPaymentResult } from "../services/paymentService";
import "./Payment.css";

function Payment() {
    const payment = getPaymentResult();

    return (
        <div className="payment-page">
            {/* ===== QR PAYMENT BOX ===== */}
            <div className="qr-box">
                <h2 className="qr-title">Thanh toán VNPAY</h2>
                <p className="qr-subtitle">
                    Quét mã để thanh toán đơn hàng: {payment.orderId}
                </p>

                <div className="qr-amount">
                    {payment.amount.toLocaleString()} {payment.currency}
                </div>

                {/* QR PLACEHOLDER – sau này gắn QR VNPAY */}
                <div className="qr-placeholder">
                    <span>QR CODE</span>
                </div>

                <div className="qr-status">
                    Đang kiểm tra giao dịch của bạn...
                </div>
            </div>

            {/* ===== PAYMENT RESULT ===== */}
            <div className="payment-result">
                <h3>Kết quả thanh toán</h3>

                <div className="result-row">
                    <span>Mã đơn hàng:</span>
                    <span>{payment.orderId}</span>
                </div>

                <div className="result-row">
                    <span>Phương thức:</span>
                    <span>{payment.paymentMethod}</span>
                </div>

                <div className="result-row">
                    <span>Số tiền:</span>
                    <span>{payment.amount.toLocaleString()} {payment.currency}</span>
                </div>

                <div className="result-row">
                    <span>Trạng thái:</span>
                    <span className={`status ${payment.status.toLowerCase()}`}>
            {payment.status}
          </span>
                </div>

                <div className="result-row">
                    <span>Mã giao dịch:</span>
                    <span>{payment.transactionId}</span>
                </div>

                <div className="result-row">
                    <span>Thời gian:</span>
                    <span>{payment.paidAt}</span>
                </div>
            </div>
        </div>
    );
}

export default Payment;

