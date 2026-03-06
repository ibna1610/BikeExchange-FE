/**
 * ============================================================
 * API SERVICE - HYBRID (SPRING BOOT + MOCK FALLBACK)
 * ============================================================
 */

export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api"

/**
 * ============================================================
 * MOCK DATA
 * ============================================================
 */

const TEST_ACCOUNTS = {
  "buyer1@gmail.com": {
    id: 1,
    name: "Nguyễn Văn Mua",
    phone: "0903123456",
    roles: ["BUYER"],
  },
  "seller1@gmail.com": {
    id: 2,
    name: "Trần Thị Bán",
    phone: "0912789012",
    roles: ["BUYER", "SELLER"],
  },
  "inspector1@gmail.com": {
    id: 3,
    name: "Lê Văn Kiểm",
    phone: "0987654321",
    roles: ["BUYER", "INSPECTOR"],
  },
  "admin1@gmail.com": {
    id: 4,
    name: "Phạm Quản Trị",
    phone: "0777123456",
    roles: ["BUYER", "ADMIN"],
  },
}

const TEST_PASSWORD = "Matkhau12345@"

/**
 * ============================================================
 * LOGIN
 * ============================================================
 */

export async function login(credentials) {
  const email = (credentials.email || "").trim()
  const password = credentials.password || ""

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const json = await res.json()

      if (json?.success && json?.data) {
        const d = json.data

        localStorage.setItem("token", d.accessToken)

        return {
          success: true,
          token: d.accessToken,
          user: {
            id: d.id,
            email: d.email,
            name: d.fullName,
            phone: d.phone,
            roles: d.role ? [d.role] : [],
          },
        }
      }
    }
  } catch (e) {
    console.warn("Backend login failed → fallback mock")
  }

  await new Promise((r) => setTimeout(r, 300))

  const account = TEST_ACCOUNTS[email.toLowerCase()]

  if (account && password === TEST_PASSWORD) {
    localStorage.setItem("token", "MOCK_JWT_TOKEN")

    return {
      success: true,
      token: "MOCK_JWT_TOKEN",
      user: {
        id: account.id,
        email,
        name: account.name,
        phone: account.phone,
        roles: account.roles,
      },
    }
  }

  return {
    success: false,
    message: "Email hoặc mật khẩu không đúng.",
  }
}

/**
 * ============================================================
 * REGISTER
 * ============================================================
 */

export async function register(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      return await res.json()
    }
  } catch (e) {
    console.warn("Backend register failed → fallback mock")
  }

  return {
    success: true,
    message: "Đăng ký thành công (mock).",
  }
}

/**
 * ============================================================
 * SELLER REGISTER
 * ============================================================
 */

export async function registerSeller(data) {
  await new Promise((r) => setTimeout(r, 500))

  return {
    success: true,
    message: "Đăng ký Seller thành công.",
  }
}

/**
 * ============================================================
 * LISTINGS
 * ============================================================
 */

export async function getListings() {
  const { MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } = await import(
      "../data/hardcoded.js"
      )

  return {
    data: MOCK_LISTINGS,
    total: MOCK_TOTAL_LISTINGS,
  }
}

export async function getListingById(id) {
  const { MOCK_LISTINGS } = await import("../data/hardcoded.js")

  const item = MOCK_LISTINGS.find((i) => String(i.id) === id)

  return item || null
}

/**
 * ============================================================
 * PROFILE
 * ============================================================
 */

export async function getProfile(userId) {
  const account = Object.values(TEST_ACCOUNTS).find((a) => a.id === userId)

  return {
    id: userId,
    email: "",
    name: account?.name ?? "",
    phone: account?.phone ?? "",
  }
}

export async function updateProfile() {
  return { success: true }
}

/**
 * ============================================================
 * INSPECTION
 * ============================================================
 */

export async function submitInspection(data) {
  await new Promise((r) => setTimeout(r, 300))

  return {
    success: true,
    message: "Inspection submitted",
  }
}

/**
 * ============================================================
 * BRANDS
 * ============================================================
 */

export async function getBrands() {
  const { BICYCLE_BRANDS } = await import("../data/hardcoded.js")

  return { data: BICYCLE_BRANDS }
}

/**
 * ============================================================
 * ORDER
 * ============================================================
 */

export async function createOrder(bikeId) {
  const token = localStorage.getItem("token")

  const idempotencyKey =
      Math.random().toString(36).substring(2) + Date.now()

  console.log("Creating order for bike:", bikeId)

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bikeId: bikeId,
      idempotencyKey: idempotencyKey,
    }),
  })

  const text = await res.text()

  console.log("ORDER RESPONSE:", text)

  if (!res.ok) {
    throw new Error(text)
  }

  return JSON.parse(text)
}

/**
 * ============================================================
 * VNPAY PAYMENT
 * ============================================================
 */

export async function createVNPayPayment(amount) {

  const token = localStorage.getItem("token")

  const res = await fetch(
      `${API_BASE_URL}/vnpay/create-payment?amount=${amount}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  )

  if (!res.ok) {
    throw new Error("Create payment failed")
  }

  const data = await res.json()

  return data.paymentUrl
}