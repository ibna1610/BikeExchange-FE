# Website Mua Bán Xe Đạp Thể Thao Cũ - TP.HCM

Dự án website kết nối mua bán xe đạp thể thao đã qua sử dụng tại Thành phố Hồ Chí Minh.

## 🚀 Công nghệ sử dụng

- **Frontend:** React JS (JavaScript)
- **Backend:** Spring Boot (sắp phát triển)
- **Database:** MySQL
- **Authentication:** JWT
- **Payment:** VNPay (sắp tích hợp)
- **Công cụ:** GitHub, Postman

## 📁 Cấu trúc dự án

```
SP26SWP06/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Header, Footer, Layout
│   │   ├── pages/         # HomePage, Login, Register
│   │   ├── services/      # API services (mock hiện tại)
│   │   ├── data/          # Hardcoded data (sẽ thay bằng API)
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend/               # Spring Boot (sắp phát triển)
├── .gitignore
└── README.md
```

## 🛠️ Cài đặt và chạy

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại: **http://localhost:5173**

### Backend (khi có)

```bash
cd backend
# Hướng dẫn sẽ được cập nhật khi backend sẵn sàng
```

## 📋 Trạng thái phát triển

- ✅ **Frontend:** Login, Register, Homepage (dùng hardcoded data)
- ⏳ **Backend:** Đang phát triển
- ⏳ **API Integration:** Chờ backend
- ⏳ **Payment:** Chưa tích hợp VNPay

## 📝 Các trang đã hoàn thành

### Frontend
- ✅ **Trang chủ (Homepage):** Hiển thị danh sách tin rao xe đạp, sidebar lọc theo hãng
- ✅ **Đăng nhập (Login):** Form đăng nhập với email/username và mật khẩu
- ✅ **Đăng ký (Register):** Form đăng ký tài khoản mới
- ✅ **Header & Footer:** Layout theo thiết kế, chỉ khu vực TP.HCM

## 🔌 Ghi chú tích hợp API

Hiện tại frontend đang dùng **dữ liệu cứng (hardcoded)** và **mock API**. 

Khi backend Spring Boot sẵn sàng, xem file `frontend/README-API-NOTES.md` (nếu có) hoặc các comment trong:
- `frontend/src/services/api.js` - Các hàm API cần thay thế
- `frontend/src/data/hardcoded.js` - Dữ liệu cứng cần thay bằng API

### Các API cần tích hợp:
1. **Authentication:** `POST /auth/login`, `POST /auth/register`
2. **Listings:** `GET /listings?region=hcm&page=1&limit=10`
3. **Brands:** `GET /brands` (danh sách hãng xe đạp)
4. **Payment:** Tích hợp VNPay (sẽ có hướng dẫn sau)

## 👥 Thành viên

- [Thêm tên thành viên vào đây]

## 📖 Hướng dẫn làm việc với Git

### Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
```

### Tạo branch mới cho feature
```bash
git checkout -b feature/tên-feature
```

### Commit và push
```bash
git add .
git commit -m "Mô tả thay đổi"
git push origin feature/tên-feature
```

Sau đó tạo **Pull Request** trên GitHub để review trước khi merge vào `main`.

## 📄 License

[Thêm license nếu có]

---

**Lưu ý:** Dự án đang trong giai đoạn phát triển. Frontend hiện dùng mock data, sẽ được tích hợp với backend khi sẵn sàng.
