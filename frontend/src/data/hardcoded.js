/**
 * ============================================================
 * DỮ LIỆU CỨNG - THAY THẾ KHI CÓ API BACKEND
 * ============================================================
 * Các constant và mock data dưới đây dùng tạm cho giao diện.
 * Khi backend Spring Boot sẵn sàng:
 * - Thay bằng gọi API (axios/fetch) trong services/api.js
 * - Xóa hoặc giữ file này chỉ để fallback khi lỗi API
 * ============================================================
 */

// Các hãng xe đạp thể thao thông dụng tại Việt Nam (thay bằng API danh sách hãng khi có)
export const BICYCLE_BRANDS = [
  'Giant', 'Trek', 'Cannondale', 'Specialized', 'Merida', 'Bianchi',
  'Pinarello', 'Scott', 'Marin', 'Fuji', 'Asama', 'Jett', 'Twitter',
  'Thống Nhất', 'Fixed Gear', 'Trinx', 'Double Nine', 'Nakamura',
  'Tất cả hãng'
]

// Khu vực: chỉ TP.HCM (theo yêu cầu)
export const REGION = {
  label: 'TP HCM',
  value: 'hcm'
}

/**
 * Danh sách tin rao xe đạp thể thao cũ - HARDCODED
 * TODO: Thay bằng API GET /api/listings hoặc tương đương khi backend có
 * Ví dụ: const res = await api.get('/listings?region=hcm')
 */
export const MOCK_LISTINGS = [
  {
    id: 1,
    code: 'XĐ001',
    title: 'Xe đạp cũ 2021 - Giant XTC 800',
    price: '12.5 Triệu',
    priceValue: 12500000,
    location: 'Quận 1, TP.HCM',
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&h=150&fit=crop',
    description: 'Khung nhôm, size L, nhóm líp Shimano Deore, phanh đĩa, lốp 29. Tình trạng tốt, bảo dưỡng định kỳ.',
    contactName: 'Anh Tuấn',
    contactAddress: 'Quận 1, TP.HCM',
    phone: '0903 xxx xxx',
    year: 2021
  },
  {
    id: 2,
    code: 'XĐ002',
    title: 'Xe đạp cũ 2020 - Trek Marlin 7',
    price: '15 Triệu',
    priceValue: 15000000,
    location: 'Quận 7, TP.HCM',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=200&h=150&fit=crop',
    description: 'Khung nhôm, size M, Shimano Altus, phanh đĩa cơ. Ít sử dụng, còn mới.',
    contactName: 'Chị Hương',
    contactAddress: 'Quận 7, TP.HCM',
    phone: '0912 xxx xxx',
    year: 2020
  },
  {
    id: 3,
    code: 'XĐ003',
    title: 'Xe đạp cũ 2022 - Merida Big Nine',
    price: '18 Triệu',
    priceValue: 18000000,
    location: 'Bình Thạnh, TP.HCM',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&h=150&fit=crop',
    description: 'Khung carbon, size L, nhóm Shimano XT, bánh 29. Chuyên leo đèo.',
    contactName: 'Anh Minh',
    contactAddress: 'Bình Thạnh, TP.HCM',
    phone: '0988 xxx xxx',
    year: 2022
  },
  {
    id: 4,
    code: 'XĐ004',
    title: 'Xe đạp cũ 2019 - Cannondale Trail',
    price: '14 Triệu',
    priceValue: 14000000,
    location: 'Quận 10, TP.HCM',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200&h=150&fit=crop',
    description: 'Khung nhôm, size M, Shimano Deore, phanh đĩa. Phù hợp đi phượt.',
    contactName: 'Anh Khoa',
    contactAddress: 'Quận 10, TP.HCM',
    phone: '0777 xxx xxx',
    year: 2019
  },
  {
    id: 5,
    code: 'XĐ005',
    title: 'Xe đạp cũ 2021 - Specialized Rockhopper',
    price: '16 Triệu',
    priceValue: 16000000,
    location: 'Tân Bình, TP.HCM',
    image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=200&h=150&fit=crop',
    description: 'Khung nhôm, size L, SRAM NX, lốp 29. Màu đen đỏ.',
    contactName: 'Chị Lan',
    contactAddress: 'Tân Bình, TP.HCM',
    phone: '0933 xxx xxx',
    year: 2021
  }
]

/** Tổng số tin (mock) - TODO: lấy từ API response (ví dụ totalCount) */
export const MOCK_TOTAL_LISTINGS = 1247
