# Ghi chú tích hợp API Backend (Spring Boot)

Frontend hiện dùng **dữ liệu cứng (hardcoded)** và **mock API**. Khi backend sẵn sàng, thay thế theo hướng dẫn dưới đây.

## 1. Đăng nhập / Đăng ký (JWT)

- **File:** `src/services/api.js`
- **Hàm `login(credentials)`:**  
  Gọi `POST /auth/login` (hoặc endpoint backend của bạn), body: `{ email/username, password }`.  
  Backend trả về JWT → lưu `localStorage.setItem('token', res.token)` và dùng token cho mọi request sau.
- **Hàm `register(data)`:**  
  Gọi `POST /auth/register` với body đăng ký (tên, email, số điện thoại, mật khẩu...).

Trang Login/Register đã gọi các hàm này; chỉ cần sửa nội dung trong `api.js` để gọi API thật (axios/fetch).

### Ví dụ khi có backend:

```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Thêm interceptor để gắn JWT vào header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(credentials) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
  localStorage.setItem('token', res.data.token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  return res.data
}
```

## 2. Danh sách tin rao (Listings)

- **File dữ liệu cứng:** `src/data/hardcoded.js`  
  `MOCK_LISTINGS`, `MOCK_TOTAL_LISTINGS` → thay bằng response từ API.
- **File service:** `src/services/api.js`  
  Hàm `getListings(params)` → gọi `GET /listings?region=hcm&page=1&limit=10` (hoặc theo thiết kế backend).  
  Trang chủ (`HomePage.jsx`) đã dùng `getListings()`; khi API trả đúng format `{ data: [], total: number }` thì không cần sửa component.

### Ví dụ:

```javascript
export async function getListings(params = {}) {
  const res = await axios.get(`${API_BASE_URL}/listings`, { params })
  return {
    data: res.data.content || res.data, // Tùy format backend
    total: res.data.totalElements || res.data.total
  }
}
```

## 3. Danh sách hãng xe đạp

- **File:** `src/data/hardcoded.js` → `BICYCLE_BRANDS`  
  Có thể thay bằng API (ví dụ `GET /brands`), sau đó trong `api.js` thêm `getBrands()` gọi API và ở Homepage lấy brands từ state/API thay vì import từ hardcoded.

### Ví dụ:

```javascript
export async function getBrands() {
  const res = await axios.get(`${API_BASE_URL}/brands`)
  return { data: res.data }
}
```

Trong `HomePage.jsx`, thay:
```javascript
import { BICYCLE_BRANDS } from '../data/hardcoded'
```
bằng:
```javascript
const [brands, setBrands] = useState([])
useEffect(() => {
  getBrands().then(res => setBrands(res.data))
}, [])
```

## 4. Khu vực

Hiện chỉ dùng **TP.HCM** (constant `REGION` trong `hardcoded.js`). Nếu sau này mở rộng tỉnh thành, chỉ cần đổi nguồn dữ liệu (API) và phần lọc theo region.

## 5. Thanh toán VNPay

Chưa có giao diện thanh toán. Khi tích hợp:

- Backend tạo URL thanh toán VNPay, frontend redirect user đến URL đó.
- Trang xử lý return/callback (sau khi thanh toán) có thể đọc query params và gọi API xác nhận với backend.

### Ví dụ flow:

```javascript
// Khi user click thanh toán
const handlePayment = async () => {
  const res = await axios.post(`${API_BASE_URL}/payment/create`, {
    orderId: orderId,
    amount: amount
  })
  // Backend trả về URL thanh toán VNPay
  window.location.href = res.data.paymentUrl
}

// Trang callback sau thanh toán
// URL: /payment/callback?vnp_ResponseCode=00&...
const params = new URLSearchParams(window.location.search)
const responseCode = params.get('vnp_ResponseCode')
if (responseCode === '00') {
  // Gọi API xác nhận với backend
  await axios.post(`${API_BASE_URL}/payment/verify`, {
    vnp_ResponseCode: responseCode,
    // ... các params khác từ VNPay
  })
}
```

## 6. Cài đặt Axios (khi cần)

```bash
cd frontend
npm install axios
```

## 7. Biến môi trường

Tạo file `.env` trong `frontend/`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 8. Profile & Inspections (đã đồng bộ cấu trúc)

**Profile** – `getProfile(userId)`, `updateProfile(userId, data)`  
- Cấu trúc: `{ id, email, name, phone, avatar }`  
- API tương ứng: `GET /users/me`, `PUT /users/me`

**Inspections** – `submitInspection(listingId, data)`  
- Inspector đánh giá "Đã kiểm định", hiển thị đồng bộ Buyer/Seller/Admin  
- Cấu trúc: `{ inspected: boolean, inspectionReport: string }`  
- API tương ứng: `POST /inspections` hoặc `PUT /inspections/:listingId`

**Listings** – `getListings()`, `getListingById(id)`  
- Mỗi listing: `{ id, code, title, price, ..., inspected, inspectionReport }`  
- API trả về đúng format này để hiển thị badge "Đã kiểm định" thống nhất

---

**Tóm tắt:** Phần cần đổi khi có API chủ yếu nằm ở `src/services/api.js`, `src/data/hardcoded.js` và `src/data/store.js`; các component đã chuẩn bị sẵn để nhận dữ liệu từ các hàm service này.