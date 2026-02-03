/**
 * ============================================================
 * API SERVICE - THAY THẾ KHI CÓ BACKEND SPRING BOOT
 * ============================================================
 * Hiện tại dùng mock/hardcoded. Khi backend sẵn sàng:
 * 1. Cài axios: npm install axios
 * 2. Đặt baseURL = địa chỉ backend (ví dụ: http://localhost:8080/api)
 * 3. Thêm interceptor gắn JWT vào header: Authorization: Bearer <token>
 * 4. Thay các hàm bên dưới bằng gọi API thật
 * ============================================================
 */

// TODO: Khi có backend, dùng biến môi trường
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

/**
 * Login - TODO: Gọi POST /auth/login với body { email/username, password }
 * Backend trả về JWT, lưu vào localStorage và set vào header cho các request sau.
 */
export async function login(credentials) {
  // Mock: giả lập đăng nhập thành công
  // Thay bằng: return axios.post(`${API_BASE_URL}/auth/login`, credentials)
  await new Promise((r) => setTimeout(r, 500))
  return {
    success: true,
    token: 'MOCK_JWT_TOKEN_REPLACE_WITH_REAL_WHEN_API_READY',
    user: { id: 1, email: credentials.email || 'user@example.com', name: 'Người dùng' }
  }
}

/**
 * Register - TODO: Gọi POST /auth/register với body { email, password, name, phone, ... }
 */
export async function register(data) {
  // Mock: giả lập đăng ký thành công
  // Thay bằng: return axios.post(`${API_BASE_URL}/auth/register`, data)
  await new Promise((r) => setTimeout(r, 500))
  return {
    success: true,
    message: 'Đăng ký thành công (mock). Khi có API sẽ gọi backend.'
  }
}

/**
 * Lấy danh sách tin rao - TODO: GET /listings?region=hcm&page=1&limit=10
 */
export async function getListings(params = {}) {
  // Mock: trả về từ hardcoded. Thay bằng: return axios.get(`${API_BASE_URL}/listings`, { params })
  const { MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } = await import('../data/hardcoded.js')
  return {
    data: MOCK_LISTINGS,
    total: MOCK_TOTAL_LISTINGS
  }
}

/**
 * Lấy danh sách hãng xe - TODO: GET /brands hoặc /categories
 */
export async function getBrands() {
  const { BICYCLE_BRANDS } = await import('../data/hardcoded.js')
  return { data: BICYCLE_BRANDS }
}
