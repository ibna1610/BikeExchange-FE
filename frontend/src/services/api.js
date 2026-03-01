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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function getAuthToken() {
  if (typeof localStorage === 'undefined') return null
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (auth) {
    const token = getAuthToken()
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}

function formatCurrencyVnd(amountVnd) {
  if (amountVnd == null) return ''
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amountVnd)
  } catch {
    return `${amountVnd} VND`
  }
}

function mapBikeResponseToListing(bike) {
  if (!bike) return null
  const media = Array.isArray(bike.media) ? bike.media : []
  const images = media.map((m) => m.url).filter(Boolean)
  const image = images[0] || null
  const priceVnd = bike.pricePoints != null ? bike.pricePoints * 1000 : null

  return {
    id: bike.id,
    title: bike.title,
    description: bike.description,
    brand: bike.brand,
    model: bike.model,
    year: bike.year,
    price: priceVnd != null ? formatCurrencyVnd(priceVnd) : '',
    location: bike.location,
    condition: bike.condition,
    type: bike.bikeType,
    inspected: bike.inspectionStatus === 'APPROVED',
    images,
    image,
  }
}

/**
 * Login - TODO: Gọi POST /auth/login với body { email/username, password }
 * Backend trả về JWT, lưu vào localStorage và set vào header cho các request sau.
 */
export async function login(credentials) {
  const payload = {
    email: (credentials.email || '').trim(),
    password: credentials.password,
  }

  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  })

  if (!res || res.success !== true || !res.data) {
    return {
      success: false,
      message: res?.message || 'Đăng nhập thất bại.',
    }
  }

  const data = res.data
  const user = {
    id: data.id,
    email: data.email,
    name: data.fullName,
    phone: data.phone,
    avatar: null,
    roles: data.role ? [data.role] : [],
  }

  return {
    success: true,
    token: data.accessToken,
    user,
  }
}

/**
 * Register - TODO: Gọi POST /auth/register với body { email, password, name, phone, ... }
 * Mặc định tạo tài khoản BUYER
 */
export async function register(data) {
  const payload = {
    email: (data.email || '').trim(),
    password: data.password,
    fullName: data.name || '',
    phone: data.phone || '',
    address: data.address || '',
  }

  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  })

  return {
    success: res?.success === true,
    message: res?.message || (res?.success === true
      ? 'Đăng ký thành công. Bạn có thể đăng nhập.'
      : 'Đăng ký thất bại.'),
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
  const searchParams = new URLSearchParams()
  if (params.keyword) searchParams.set('keyword', params.keyword)
  if (params.categoryId) searchParams.set('category_id', params.categoryId)
  if (Array.isArray(params.status) && params.status.length > 0) {
    params.status.forEach((s) => searchParams.append('status', s))
  }
  if (typeof params.page === 'number') searchParams.set('page', String(params.page))
  if (typeof params.size === 'number') searchParams.set('size', String(params.size))

  try {
    const res = await apiFetch(`/bikes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, {
      method: 'GET',
      auth: false,
    })

    if (res && res.success === true && res.data) {
      const page = res.data
      const { getInspections } = await import('../data/store.js')
      const inspections = getInspections()
      const data = (page.content || []).map((bike) => {
        const mapped = mapBikeResponseToListing(bike)
        const override = inspections[String(mapped.id)]
        if (override) {
          return {
            ...mapped,
            inspected: override.inspected !== false,
            inspectionReport: override.inspectionReport || '',
          }
        }
        return mapped
      })

      return {
        data,
        total: page.totalElements ?? data.length,
      }
    }
  } catch {
    // Fallback mock nếu backend chưa chạy
  }

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
  try {
    const res = await apiFetch(`/bikes/${id}`, {
      method: 'GET',
      auth: false,
    })

    if (res && res.success === true && res.data) {
      const bike = res.data
      let listing = mapBikeResponseToListing(bike)

      // Lấy thông tin người bán để hiển thị ở trang chi tiết
      if (bike.sellerId) {
        try {
          const seller = await apiFetch(`/users/${bike.sellerId}`, { method: 'GET', auth: false })
          listing = {
            ...listing,
            contactName: seller.fullName,
            phone: seller.phone,
            contactAddress: seller.address,
          }
        } catch {
          // Bỏ qua nếu lỗi, giữ listing cơ bản
        }
      }

      const { getInspection } = await import('../data/store.js')
      const insp = getInspection(String(listing.id))
      if (insp) {
        listing = {
          ...listing,
          inspected: insp.inspected !== false,
          inspectionReport: insp.inspectionReport || listing.inspectionReport,
        }
      }

      return listing
    }
  } catch {
    // Fallback mock nếu backend chưa chạy
  }

  const { MOCK_LISTINGS } = await import('../data/hardcoded.js')
  const { getInspection } = await import('../data/store.js')
  const item = MOCK_LISTINGS.find((i) => String(i.id) === String(id))
  if (!item) return null
  const insp = getInspection(String(id))
  if (insp) {
    return { ...item, inspected: insp.inspected, inspectionReport: insp.inspectionReport }
  }
  return item
}

/**
 * Lấy profile user - TODO: GET /users/me hoặc /users/:id
 */
export async function getProfile(userId) {
  const user = await apiFetch(`/users/${userId}`, {
    method: 'GET',
    auth: false,
  })

  const { getProfile: getStoreProfile } = await import('../data/store.js')
  const profile = getStoreProfile(userId)

  return {
    id: user.id,
    email: user.email,
    name: profile?.name ?? user.fullName ?? '',
    phone: profile?.phone ?? user.phone ?? '',
    avatar: profile?.avatar ?? null,
  }
}

/**
 * Cập nhật profile - TODO: PUT /users/me
 */
export async function updateProfile(userId, data) {
  // Lấy thông tin hiện tại để tránh mất dữ liệu khác (address, role, ...)
  const current = await apiFetch(`/users/${userId}`, {
    method: 'GET',
    auth: false,
  })

  const payload = {
    ...current,
    fullName: data.name != null ? data.name : current.fullName,
    phone: data.phone != null ? data.phone : current.phone,
    address: data.address != null ? data.address : current.address,
  }

  await apiFetch(`/users/${userId}`, {
    method: 'PUT',
    body: payload,
    auth: false,
  })

  const { setProfile } = await import('../data/store.js')
  setProfile(userId, {
    name: payload.fullName,
    phone: payload.phone,
    avatar: data.avatar ?? null,
  })

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
  try {
    const res = await apiFetch('/categories?page=0&size=100', {
      method: 'GET',
      auth: false,
    })
    if (res && res.success === true && res.data && Array.isArray(res.data.content)) {
      const names = res.data.content
        .map((c) => c.name)
        .filter(Boolean)
      return { data: names }
    }
  } catch {
    // Fallback mock nếu backend chưa chạy
  }

  const { BICYCLE_BRANDS } = await import('../data/hardcoded.js')
  return { data: BICYCLE_BRANDS }
}

// Bổ sung thêm một số hàm cho Categories để dễ phủ hết luồng backend
export async function getCategories({ page = 0, size = 100 } = {}) {
  const res = await apiFetch(`/categories?page=${page}&size=${size}`, {
    method: 'GET',
    auth: false,
  })
  return res
}

export async function getBikesByCategory(categoryId, { page = 0, size = 20 } = {}) {
  const res = await apiFetch(`/categories/${categoryId}/bikes?page=${page}&size=${size}`, {
    method: 'GET',
    auth: false,
  })
  return res
}
