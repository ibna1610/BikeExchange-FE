// src/data/paymentMock.js

const paymentMock = {
    orderId: "ORDER_001",
    paymentMethod: "VNPAY",
    amount: 15000000,
    currency: "VND",
    status: "SUCCESS", // SUCCESS | PENDING | FAILED
    transactionId: "TXN_987654321",
    paidAt: "2026-02-05 14:30",
    buyer: {
        id: 1,
        name: "Nguyen Van A",
        email: "buyer@test.com",
    },
};

export default paymentMock;
