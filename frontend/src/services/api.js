/**
 * ============================================================
 * API SERVICE — CONNECTED WITH SPRING BOOT BACKEND
 * ============================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function getAuthToken() {
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
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
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
    const message = data?.message || `Request failed ${res.status}`
    throw new Error(message)
  }

  return data
}

/* ============================================================
   AUTH
============================================================ */

/**
 * LOGIN — POST /auth/login
 */
export async function login(credentials) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: {
      email: credentials.email,
      password: credentials.password,
    },
    auth: false,
  })

  if (!res || res.success !== true || !res.data) {
    return {
      success: false,
      message: res?.message || 'Đăng nhập thất bại.',
    }
  }

  const d = res.data

  const user = {
    id: d.id,
    email: d.email,
    fullName: d.fullName,
    phone: d.phone,
    role: d.role,
    roles: [d.role],
  }

  // 🔥 Lưu token & user vào localStorage (quan trọng)
  localStorage.setItem('token', d.accessToken)
  localStorage.setItem('user', JSON.stringify(user))

  return {
    success: true,
    token: d.accessToken,
    user,
  }
}

/**
 * REGISTER — POST /auth/register
 */
export async function register(form) {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: {
      email: form.email,
      password: form.password,
      fullName: form.name,
      phone: form.phone,
      address: form.address || '',
    },
    auth: false,
  })

  return {
    success: res?.success === true,
    message:
        res?.message ||
        (res?.success
            ? 'Đăng ký thành công. Bạn có thể đăng nhập.'
            : 'Đăng ký thất bại.'),
  }
}

/* ============================================================
   REMAINING API (giữ nguyên của bạn)
============================================================ */

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