/**
 * ============================================================
 * API SERVICE - HYBRID (SPRING BOOT + MOCK FALLBACK)
 * ============================================================
 */

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
};

const TEST_PASSWORD = "Matkhau12345@";

/**
 * ============================================================
 * LOGIN
 * ============================================================
 */

export async function login(credentials) {
  const email = (credentials.email || "").trim();
  const password = credentials.password || "";

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const json = await res.json();

      if (json?.success && json?.data) {
        const d = json.data;

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
        };
      }
    }
  } catch (e) {
    console.warn("Backend login failed → fallback mock");
  }

  /**
   * FALLBACK MOCK
   */

  await new Promise((r) => setTimeout(r, 300));

  const account = TEST_ACCOUNTS[email.toLowerCase()];

  if (account && password === TEST_PASSWORD) {
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
    };
  }

  return {
    success: false,
    message: "Email hoặc mật khẩu không đúng.",
  };
}

/**
 * ============================================================
 * REGISTER
 * ============================================================
 */

export async function register(data) {
  const email = (data.email || "").trim();
  const password = data.password || "";
  const fullName = data.name || "";
  const phone = data.phone || "";
  const address = data.address || "";

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        fullName,
        phone,
        address,
      }),
    });

    if (res.ok) {
      const json = await res.json();

      return {
        success: json?.success ?? true,
        message: json?.message || "Đăng ký thành công.",
      };
    }
  } catch (e) {
    console.warn("Backend register failed → fallback mock");
  }

  await new Promise((r) => setTimeout(r, 300));

  return {
    success: true,
    message: "Đăng ký thành công (mock).",
  };
}

/**
 * ============================================================
 * MOCK APIs KHÁC (GIỮ NGUYÊN)
 * ============================================================
 */

export async function registerSeller(data) {
  await new Promise((r) => setTimeout(r, 500));
  return {
    success: true,
    message: "Đăng ký Seller thành công.",
  };
}

export async function getListings() {
  const { MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } = await import(
      "../data/hardcoded.js"
      );

  return {
    data: MOCK_LISTINGS,
    total: MOCK_TOTAL_LISTINGS,
  };
}

export async function getListingById(id) {
  const { MOCK_LISTINGS } = await import("../data/hardcoded.js");

  const item = MOCK_LISTINGS.find((i) => String(i.id) === id);

  return item || null;
}

export async function getProfile(userId) {
  const account = Object.values(TEST_ACCOUNTS).find((a) => a.id === userId);

  return {
    id: userId,
    email: "",
    name: account?.name ?? "",
    phone: account?.phone ?? "",
  };
}

export async function updateProfile() {
  return { success: true };
}

export async function submitInspection() {
  return { success: true };
}

export async function getBrands() {
  const { BICYCLE_BRANDS } = await import("../data/hardcoded.js");

  return { data: BICYCLE_BRANDS };
}

export async function createOrder() {
  return { success: true };
}