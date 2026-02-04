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
 * Tài khoản test (mock) - Mật khẩu tất cả: Matkhau12345@
 * Cấu trúc trùng với API: id, email, name, phone, avatar, roles
 */
const TEST_ACCOUNTS = {
  'buyer1@gmail.com': { id: 1, name: 'Nguyễn Văn Mua', phone: '0903123456', roles: ['BUYER'] },
  'seller1@gmail.com': { id: 2, name: 'Trần Thị Bán', phone: '0912789012', roles: ['BUYER', 'SELLER'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1&backgroundColor=0d9488' },
  'inspector1@gmail.com': { id: 3, name: 'Lê Văn Kiểm', phone: '0987654321', roles: ['BUYER', 'INSPECTOR'] },
  'admin1@gmail.com': { id: 4, name: 'Phạm Quản Trị', phone: '0777123456', roles: ['BUYER', 'ADMIN'] },
}
const TEST_PASSWORD = 'Matkhau12345@'

/**
 * Login - TODO: Gọi POST /auth/login với body { email/username, password }
 * Backend trả về JWT, lưu vào localStorage và set vào header cho các request sau.
 */
export async function login(credentials) {
  await new Promise((r) => setTimeout(r, 500))
  const email = (credentials.email || '').trim().toLowerCase()
  const account = TEST_ACCOUNTS[email]
  if (account && credentials.password === TEST_PASSWORD) {
    const { getProfile: getStoreProfile } = await import('../data/store.js')
    const profile = getStoreProfile(account.id)
    const user = {
      id: account.id,
      email,
      name: profile?.name ?? account.name,
      phone: profile?.phone ?? account.phone,
      avatar: profile?.avatar ?? account.avatar ?? null,
      roles: account.roles,
    }
    return {
      success: true,
      token: 'MOCK_JWT_TOKEN_REPLACE_WITH_REAL_WHEN_API_READY',
      user,
    }
  }
  return {
    success: false,
    message: 'Email hoặc mật khẩu không đúng.',
  }
}

/**
 * Register - TODO: Gọi POST /auth/register với body { email, password, name, phone, ... }
 * Mặc định tạo tài khoản BUYER
 */
export async function register(data) {
  await new Promise((r) => setTimeout(r, 500))
  return {
    success: true,
    message: 'Đăng ký thành công. Bạn có thể đăng nhập.',
  }
}

/**
 * Đăng ký làm Seller - TODO: Gọi POST /auth/register-seller
 * User đã có tài khoản Buyer, bổ sung thông tin để trở thành Seller
 */
export async function registerSeller(data) {
  await new Promise((r) => setTimeout(r, 500))
  return {
    success: true,
    message: 'Đăng ký Seller thành công. Tài khoản của bạn đã được nâng cấp.',
  }
}

/**
 * Lấy danh sách tin rao - TODO: GET /listings?region=hcm&page=1&limit=10
 * Mock: merge với inspection overrides (Inspector đánh giá) để hiển thị đồng bộ
 */
export async function getListings(params = {}) {
  const { MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } = await import('../data/hardcoded.js')
  const { getInspections } = await import('../data/store.js')
  const inspections = getInspections()
  const data = MOCK_LISTINGS.map((item) => {
    const insp = inspections[String(item.id)]
    if (insp) {
      return { ...item, inspected: insp.inspected, inspectionReport: insp.inspectionReport }
    }
    return item
  })
  return {
    data,
    total: MOCK_TOTAL_LISTINGS,
  }
}

/**
 * Lấy chi tiết 1 tin - TODO: GET /listings/:id
 */
export async function getListingById(id) {
  const { MOCK_LISTINGS } = await import('../data/hardcoded.js')
  const { getInspection } = await import('../data/store.js')
  const item = MOCK_LISTINGS.find((i) => String(i.id) === id)
  if (!item) return null
  const insp = getInspection(id)
  if (insp) {
    return { ...item, inspected: insp.inspected, inspectionReport: insp.inspectionReport }
  }
  return item
}

/**
 * Lấy profile user - TODO: GET /users/me hoặc /users/:id
 */
export async function getProfile(userId) {
  const { getProfile: getStoreProfile } = await import('../data/store.js')
  const profile = getStoreProfile(userId)
  const account = Object.values(TEST_ACCOUNTS).find((a) => a.id === userId)
  const email = Object.entries(TEST_ACCOUNTS).find(([, a]) => a.id === userId)?.[0] || ''
  return {
    id: userId,
    email,
    name: profile?.name ?? account?.name ?? '',
    phone: profile?.phone ?? account?.phone ?? '',
    avatar: profile?.avatar ?? null,
  }
}

/**
 * Cập nhật profile - TODO: PUT /users/me
 */
export async function updateProfile(userId, data) {
  const { setProfile } = await import('../data/store.js')
  setProfile(userId, data)
  return { success: true, message: 'Cập nhật thành công.' }
}

/**
 * Inspector: Đánh giá sản phẩm "Đã kiểm định" - TODO: POST /inspections
 * Cập nhật inspected status, hiển thị đồng bộ trên tất cả role
 */
export async function submitInspection(listingId, data) {
  const { setInspection } = await import('../data/store.js')
  setInspection(listingId, {
    inspected: data.inspected !== false,
    inspectionReport: data.inspectionReport || '',
  })
  return { success: true, message: 'Đánh giá kiểm định đã lưu.' }
}

/**
 * Lấy danh sách hãng xe - TODO: GET /brands hoặc /categories
 */
export async function getBrands() {
  const { BICYCLE_BRANDS } = await import('../data/hardcoded.js')
  return { data: BICYCLE_BRANDS }
}
