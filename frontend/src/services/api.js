/**
 * ============================================================
 * API SERVICE - HYBRID (SPRING BOOT + MOCK FALLBACK)
 * ============================================================
 * Login/Register gọi backend thật.
 * Nếu backend chưa chạy → fallback mock cũ.
 * Các API khác giữ nguyên mock.
 * ============================================================
 */

// 👉 URL backend Spring Boot
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * ============================================================
 * MOCK DATA (GIỮ NGUYÊN)
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
    avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=seller1&backgroundColor=0d9488",
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
 * LOGIN (REAL API + FALLBACK MOCK)
 * POST /auth/login
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

        const user = {
          id: d.id,
          email: d.email,
          name: d.fullName,
          phone: d.phone,
          roles: d.role ? [d.role] : [],
        };

        return {
          success: true,
          token: d.accessToken,
          user,
        };
      }
    }
  } catch (e) {
    console.warn("Backend login failed → fallback mock");
  }

  // fallback mock
  await new Promise((r) => setTimeout(r, 300));
  const account = TEST_ACCOUNTS[email.toLowerCase()];
  if (account && password === TEST_PASSWORD) {
    const { getProfile: getStoreProfile } = await import("../data/store.js");
    const profile = getStoreProfile(account.id);

    const user = {
      id: account.id,
      email,
      name: profile?.name ?? account.name,
      phone: profile?.phone ?? account.phone,
      avatar: profile?.avatar ?? account.avatar ?? null,
      roles: account.roles,
    };

    return {
      success: true,
      token: "MOCK_JWT_TOKEN",
      user,
    };
  }

  return {
    success: false,
    message: "Email hoặc mật khẩu không đúng.",
  };
}

/**
 * ============================================================
 * REGISTER (REAL API + FALLBACK MOCK)
 * POST /auth/register
 * ============================================================
 */
export async function register(data) {
  const email = (data.email || "").trim();
  const password = data.password || "";
  const fullName = data.name || data.fullName || "";
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
    message: "Đăng ký Seller thành công. Tài khoản của bạn đã được nâng cấp.",
  };
}

export async function getListings(params = {}) {
  const { MOCK_LISTINGS, MOCK_TOTAL_LISTINGS } = await import(
      "../data/hardcoded.js"
      );
  const { getInspections } = await import("../data/store.js");
  const inspections = getInspections();

  const data = MOCK_LISTINGS.map((item) => {
    const insp = inspections[String(item.id)];
    if (insp) {
      return {
        ...item,
        inspected: insp.inspected,
        inspectionReport: insp.inspectionReport,
      };
    }
    return item;
  });

  return {
    data,
    total: MOCK_TOTAL_LISTINGS,
  };
}

export async function getListingById(id) {
  const { MOCK_LISTINGS } = await import("../data/hardcoded.js");
  const { getInspection } = await import("../data/store.js");

  const item = MOCK_LISTINGS.find((i) => String(i.id) === id);
  if (!item) return null;

  const insp = getInspection(id);
  if (insp) {
    return {
      ...item,
      inspected: insp.inspected,
      inspectionReport: insp.inspectionReport,
    };
  }

  return item;
}

export async function getProfile(userId) {
  const { getProfile: getStoreProfile } = await import("../data/store.js");
  const profile = getStoreProfile(userId);

  const account = Object.values(TEST_ACCOUNTS).find(
      (a) => a.id === userId
  );

  const email =
      Object.entries(TEST_ACCOUNTS).find(
          ([, a]) => a.id === userId
      )?.[0] || "";

  return {
    id: userId,
    email,
    name: profile?.name ?? account?.name ?? "",
    phone: profile?.phone ?? account?.phone ?? "",
    avatar: profile?.avatar ?? null,
  };
}

export async function updateProfile(userId, data) {
  const { setProfile } = await import("../data/store.js");
  setProfile(userId, data);
  return { success: true, message: "Cập nhật thành công." };
}

export async function submitInspection(listingId, data) {
  const { setInspection } = await import("../data/store.js");
  setInspection(listingId, {
    inspected: data.inspected !== false,
    inspectionReport: data.inspectionReport || "",
  });
  return { success: true, message: "Đánh giá kiểm định đã lưu." };
}

export async function getBrands() {
  const { BICYCLE_BRANDS } = await import("../data/hardcoded.js");
  return { data: BICYCLE_BRANDS };
}

/**
 * ============================================================
 * ORDERS API (REAL BE)
 * POST /orders
 * ============================================================
 */
export async function createOrder(bikeId) {
  const token = localStorage.getItem("token");

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bikeId: Number(bikeId),
        idempotencyKey: crypto.randomUUID(),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, message: text || "Order failed" };
    }

    return await res.json();
  } catch (e) {
    console.warn("Create order failed (BE not ready)");
    return { success: false, message: "Backend not available" };
  }
}