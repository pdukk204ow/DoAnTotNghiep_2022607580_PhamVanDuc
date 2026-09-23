# 📚 HỆ THỐNG QUẢN TRỊ BÁN SÁCH - NHÀ SÁCH VĂN ĐỨC (ADMIN PORTAL)

Phân hệ Quản trị viên (`angular-admin`) thuộc đề tài: "Xây dựng Website bán sách cho cửa hàng Văn Đức sử dụng Java và MySQL có tích hợp AI".

---

## 📌 GIỚI THIỆU PHÂN HỆ ADMIN

Dự án **`angular-admin`** là trang quản trị đơn hàng, sản phẩm và khách hàng cho Nhà Sách Văn Đức. Ứng dụng được xây dựng trên nền tảng **Angular 12**, tích hợp **Angular Material**, **Bootstrap** và **Chart.js** giúp chủ cửa hàng theo dõi doanh thu và vận hành bán hàng trực quan, hiệu quả.

---

## ✨ CÁC CHỨC NĂNG CHÍNH

1. **Dashboard Thống kê:**
   - Biểu đồ doanh thu theo tháng/năm trực quan với **Chart.js**.
   - Thống kê tổng doanh thu thực tế, số lượng đơn hàng thành công, tổng số đầu sách và số khách hàng.
2. **Quản lý Sách (Products):**
   - Thêm mới, chỉnh sửa thông tin sách, cập nhật ảnh bìa, giá bìa, % khuyến mãi, tồn kho và mô tả sách.
   - Theo dõi số lượng sách tồn và số lượng đã bán.
3. **Quản lý Thể loại / Danh mục (Categories):**
   - Thêm, sửa, xóa các danh mục sách (Văn học, Kinh tế, Kỹ năng, Công nghệ...).
4. **Quản lý Đơn hàng (Orders):**
   - Tra cứu danh sách đơn hàng theo trạng thái: *Chờ xác nhận, Đang giao, Đã hoàn thành, Đã hủy*.
   - Xem thông tin người nhận, địa chỉ giao hàng, danh sách sách được đặt.
   - Thao tác duyệt đơn giao hàng, xác nhận thanh toán hoặc hủy đơn.
5. **Quản lý Khách hàng (Customers / Users):**
   - Danh sách tài khoản người dùng, phân quyền truy cập (`ROLE_ADMIN`, `ROLE_USER`).

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

- **Framework:** Angular 12.0.5, TypeScript 4.2.3, RxJS 6.6.0
- **Giao diện & UI:** Angular Material 12, Bootstrap 4.6, SweetAlert2, ngx-toastr
- **Trực quan hóa dữ liệu:** Chart.js 3.5.1
- **Kết nối Backend:** RESTful API (`http://localhost:8080/api/...`), JWT Authentication

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY

1. **Cài đặt thư viện dependencies:**
   ```bash
   npm install
   ```

2. **Khởi chạy Development Server (Cổng 4300):**
   ```bash
   npm start -- --port 4300
   ```

3. **Truy cập trang quản trị:**
   - Mở trình duyệt tại: **`http://localhost:4300`**

---

## 🔑 TÀI KHOẢN ĐĂNG NHẬP ADMIN MẪU

| Phân hệ | Tài khoản (Email) | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `ducadm@gmail.com` | `123456` | **ROLE_ADMIN** |
