const API_BASE = "http://localhost:8080/api"

export async function createVNPayPayment(amount) {

    const token = localStorage.getItem("token")

    const res = await fetch(
        `${API_BASE}/vnpay/create-payment?amount=${amount}`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )

    if(!res.ok){
        throw new Error("Create payment failed")
    }

    const data = await res.json()

    return data.paymentUrl
}