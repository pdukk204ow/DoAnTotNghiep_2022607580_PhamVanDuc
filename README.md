
<p align="center">
  <strong>ĐỒ ÁN TỐT NGHIỆP / DỰ ÁN HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ</strong><br>
  <em>Đề tài: Xây dựng Website bán sách cho cửa hàng Văn Đức sử dụng Java và MySQL có tích hợp AI <br> Họ và tên: Phạm Văn Đức <br> Mã sinh viên: 2022607580 <br>Giảng viên hướng dẫn: ThS. Phạm Thế Anh</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange.svg?style=flat-square" alt="Java 17" />
  <img src="https://img.shields.io/badge/Spring%20Boot-2.6.4-brightgreen.svg?style=flat-square" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MySQL-8.0%2B-blue.svg?style=flat-square" alt="MySQL" />
  <img src="https://img.shields.io/badge/Angular-12-red.svg?style=flat-square" alt="Angular 12" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI%20Chatbot-blueviolet.svg?style=flat-square" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/VNPay-Payment%20Gateway-005baa.svg?style=flat-square" alt="VNPay" />
</p>

---

## 📖 1. GIỚI THIỆU ĐỀ TÀI

**Website Bán Sách Nhà Sách Văn Đức** là hệ thống thương mại điện tử phục vụ hoạt động kinh doanh sách trực tuyến. Dự án được xây dựng dựa trên kiến trúc phân tách:
- **Backend:** Xây dựng bằng ngôn ngữ **Java 17** kết hợp **Spring Boot**, cung cấp hệ thống RESTful API chuẩn hóa và bảo mật.
- **Cơ sở dữ liệu:** Sử dụng hệ quản trị CSDL quan hệ **MySQL**, thiết kế tối ưu cho lưu trữ thông tin sách, đơn hàng, hóa đơn và khách hàng.
- **Tích hợp Trí tuệ nhân tạo (AI):** Tích hợp **Google Gemini Generative AI**, hoạt động như một chuyên viên tư vấn bán sách thông minh: hiểu nhu cầu độc giả, đề xuất sách chính xác từ kho sách thực tế, giải đáp chính sách và cung cấp liên kết xem sách tức thì.
- **Thanh toán trực tuyến:** Tích hợp cổng thanh toán **VNPay Sandbox** (Quét mã VNPAY-QR, Thẻ ATM/Nội địa, Thẻ quốc tế Visa/MasterCard).
- **Frontend SPA:** Xây dựng trên nền tảng **Angular 12**, phân tách 2 phân hệ: **Website Khách hàng (`bookstore-ui`)** và **Trang Quản trị viên (`angular-admin`)**.

---

## ✨ 2. CÁC TÍNH NĂNG NỔI BẬT

### 2.1. Phân hệ Khách hàng (`bookstore-ui` - Cổng 4200)
- **Trang chủ & Khám phá sản phẩm:**
  - Banner quảng bá sách mới, các chương trình ưu đãi nổi bật.
  - Phân loại sách theo danh mục (Văn học, Kinh tế, Kỹ năng sống, Công nghệ thông tin, Thiếu nhi...).
  - Danh mục sách bán chạy nhất (Best-sellers), sách giảm giá mạnh, sách mới nhập về.
- **Tìm kiếm & Bộ lọc linh hoạt:**
  - Tìm kiếm sách tức thì theo tên tác phẩm, tên tác giả.
  - Bộ lọc nâng cao theo danh mục thể loại, khoảng giá, sắp xếp theo giá tăng/giảm hoặc độ phổ biến.
- **Chi tiết sách:**
  - Hiển thị thông tin: Ảnh bìa, tác giả, nhà xuất bản, mô tả nội dung sách, giá gốc, % giảm giá, giá khuyến mãi và số lượng tồn kho theo thời gian thực.
  - Gợi ý danh sách sách cùng thể loại.
- **Giỏ hàng & Đặt hàng:**
  - Thêm, sửa, xóa sách trong giỏ; hệ thống tự động kiểm tra số lượng tồn kho.
  - Áp dụng mã giảm giá (Voucher): Nhập mã (`VANDUC`, `VANDUC10`) để tự động khấu trừ vào tổng tiền thanh toán.
- **Phương thức thanh toán:**
  - **COD (Thanh toán khi nhận hàng):** Khách hàng nhận sách và thanh toán tiền mặt tại nhà.
  - **VNPay Sandbox:** Thanh toán trực tuyến an toàn qua Quét mã QR hoặc thẻ ngân hàng ATM/Visa.
- **Quản lý đơn hàng & Lịch sử mua sắm:**
  - Theo dõi trạng thái đơn hàng theo thời gian thực: *Chờ xác nhận ➔ Đang giao ➔ Hoàn thành ➔ Đã hủy*.
  - Khách hàng có thể chủ động hủy đơn hàng trực tiếp khi đơn chưa chuyển sang trạng thái đang giao.
- **Tài khoản người dùng:**
  - Đăng ký, đăng nhập bảo mật với JSON Web Token (JWT).
  - Cập nhật thông tin cá nhân, số điện thoại, địa chỉ nhận hàng, đổi mật khẩu.

### 2.2. Trợ lý ảo AI Văn Đức (Google Gemini AI)
- **Tư vấn sách theo ngữ cảnh:** Chatbot AI trò chuyện tự nhiên bằng Tiếng Việt, lắng nghe sở thích hoặc nhu cầu học tập của bạn đọc để gợi ý đầu sách phù hợp.
- **Đồng bộ kho sách thực tế:** AI đọc trực tiếp danh mục từ CSDL MySQL để tư vấn, chỉ gợi ý những tựa sách thực sự có trong nhà sách.
- **Tạo liên kết nhanh:** Tự động chèn liên kết sản phẩm dạng Markdown `[Tên Sách](/product-detail/ID)` ngay trong phản hồi để khách hàng bấm xem chi tiết và mua sách.
- **Hỗ trợ chính sách bán hàng:** Tự động giải đáp các câu hỏi về mã giảm giá (voucher), phí vận chuyển, chính sách đổi trả hàng trong vòng 7 ngày.

### 2.3. Phân hệ Quản trị viên (`angular-admin` - Cổng 4300)
- **Dashboard Báo cáo & Thống kê:**
  - Biểu đồ thống kê doanh thu theo năm và tháng với Chart.js.
  - Thống kê tổng doanh thu thực tế, số đơn hàng thành công, tổng số lượng đầu sách và khách hàng.
- **Quản lý Sách & Tồn kho:**
  - Thêm mới đầu sách, cập nhật thông tin chi tiết, tải ảnh bìa, điều chỉnh đơn giá, % khuyến mãi, tác giả, mô tả.
  - Kiểm soát số lượng tồn kho và theo dõi số lượng đã bán của từng cuốn sách.
- **Quản lý Thể loại / Danh mục:**
  - Thêm, sửa, xóa các danh mục thể loại sách.
- **Quản lý Đơn hàng:**
  - Danh sách đơn hàng trực quan, lọc nhanh theo từng trạng thái.
  - Xem chi tiết thông tin người nhận, địa chỉ giao hàng và danh sách sách được đặt.
  - Xử lý duyệt đơn: Chuyển trạng thái giao hàng, xác nhận hoàn tất thanh toán hoặc hủy đơn khi có yêu cầu.
- **Quản lý Khách hàng:**
  - Quản lý danh sách tài khoản người dùng, phân quyền hệ thống (`ROLE_ADMIN`, `ROLE_USER`).

---

## 🛠️ 3. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

| Tầng kiến trúc | Công nghệ / Thư viện | Chi tiết vai trò |
| :--- | :--- | :--- |
| **Ngôn ngữ Backend** | **Java 17** | Ngôn ngữ hướng đối tượng mạnh mẽ, hiệu năng cao |
| **Backend Framework** | **Spring Boot 2.6.4** | Framework phát triển RESTful Web Service |
| **Data Access / ORM** | **Spring Data JPA, Hibernate** | Ánh xạ đối tượng và thao tác truy vấn CSDL |
| **Cơ sở dữ liệu** | **MySQL 8.x / 9.x** | Lưu trữ dữ liệu hệ thống (hỗ trợ utf8mb4) |
| **Bảo mật & Phân quyền** | **Spring Security, JWT** | Xác thực Token không lưu trạng thái (Stateless) |
| **Trí tuệ nhân tạo (AI)** | **Google Gemini AI API** | Mô hình ngôn ngữ lớn (LLM) hỗ trợ Chatbot thông minh |
| **Cổng thanh toán** | **VNPay Sandbox** | Cổng thanh toán điện tử trực tuyến |
| **Dịch vụ Email** | **JavaMailSender** | Gửi email xác nhận đơn hàng và thông tin tài khoản |
| **Frontend Khách hàng** | **Angular 12, Bootstrap, SCSS** | Giao diện Single Page Application (SPA) thân thiện |
| **Frontend Quản trị** | **Angular 12, Material, Chart.js** | Bảng điều khiển quản lý và trực quan hóa số liệu |

---

## 📁 4. CẤU TRÚC DỰ ÁN

```text
DoAnTotNghiep/
├── VanDucBookStore/            # Mã nguồn Backend (Spring Boot - Java 17)
│   ├── src/main/java/vn/fs/
│   │   ├── api/                # Các Controller REST API (Product, Category, Order, AiApi...)
│   │   ├── config/             # Cấu hình Spring Security, VNPay, Swagger
│   │   ├── entity/             # Các thực thể dữ liệu JPA (Product, Category, Order, User...)
│   │   ├── repository/         # Giao diện truy vấn Spring Data JPA
│   │   └── service/            # Tầng xử lý nghiệp vụ, gửi mail, tích hợp AI
│   ├── src/main/resources/
│   │   └── application.properties # File cấu hình kết nối CSDL, VNPay, Mail, Gemini
│   └── pom.xml                 # Cấu hình thư viện Maven
│
├── bookstore-ui/               # Giao diện Website Khách hàng (Angular 12 - Port 4200)
│   ├── src/app/
│   │   ├── components/         # Các màn hình: Trang chủ, Chi tiết sách, Giỏ hàng, AI Chatbot...
│   │   └── services/           # Service gọi API Backend
│   └── package.json
│
├── angular-admin/              # Giao diện Trang Quản trị (Angular 12 - Port 4300)
│   ├── src/app/admin/
│   │   ├── dashboard/          # Thống kê số liệu, biểu đồ Chart.js
│   │   ├── product/            # Quản lý sách & tồn kho
│   │   ├── category/           # Quản lý thể loại
│   │   ├── order/              # Quản lý & duyệt trạng thái đơn hàng
│   │   └── customer/           # Quản lý danh sách khách hàng
│   └── package.json
│
├── database.sql                # File dump CSDL MySQL hoàn chỉnh
├── database_book.sql           # File CSDL dự phòng
└── README.md                   # Tài liệu hướng dẫn đồ án
```

---

## 🚀 5. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY HỆ THỐNG

### 5.1. Yêu cầu môi trường
- Java: JDK 17
- Node.js: v14.x đến v18.x kèm npm
- Database: MySQL Server 8.0+

---

### 5.2. Bước 1: Khởi tạo Cơ sở dữ liệu (MySQL)
1. Khởi động MySQL Server.
2. Tạo cơ sở dữ liệu `book` và nạp dữ liệu từ file `database.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS book DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
   USE book;
   SOURCE database.sql;
   ```

---

### 5.3. Bước 2: Cấu hình và Khởi chạy Backend (VanDucBookStore)
1. Mở file `VanDucBookStore/src/main/resources/application.properties`.
2. Cập nhật tài khoản kết nối MySQL:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/book?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=utf8&useUnicode=true
   spring.datasource.username=root
   spring.datasource.password=123456
   ```
3. Cấu hình Google Gemini API Key cho Trợ lý ảo AI:
   - Thiết lập biến môi trường hệ thống: `GEMINI_API_KEY=AIzaSy...`
   - Hoặc tạo file `gemini-key.txt` đặt tại `VanDucBookStore/gemini-key.txt` chứa mã API key.
4. Chạy ứng dụng Backend:
   ```bash
   cd VanDucBookStore
   ./mvnw spring-boot:run
   ```
   Backend khởi chạy tại: **`http://localhost:8080`**

---

### 5.4. Bước 3: Khởi chạy Website Khách hàng (bookstore-ui)
1. Mở terminal:
   ```bash
   cd bookstore-ui
   npm install
   npm start
   ```
2. Truy cập website khách hàng tại: **`http://localhost:4200`**

---

### 5.5. Bước 4: Khởi chạy Trang Quản trị (angular-admin)
1. Mở terminal:
   ```bash
   cd angular-admin
   npm install
   npm start -- --port 4300
   ```
2. Truy cập trang quản trị tại: **`http://localhost:4300`**

---

## 🔑 6. TÀI KHOẢN ĐĂNG NHẬP HỆ THỐNG MẪU

| Phân hệ | Tài khoản (Email) | Mật khẩu | Phân quyền |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `ducadm@gmail.com` | `123456` | **ROLE_ADMIN** |
| **Khách hàng mẫu (User)** | `1duc@gmail.com` | `123456` | **ROLE_USER** |

---

## 💳 7. THÔNG TIN THẺ TEST THANH TOÁN VNPAY SANDBOX

- **Ngân hàng:** NCB
- **Số thẻ:** `9704198526191432198`
- **Tên chủ thẻ:** `NGUYEN VAN A`
- **Ngày phát hành:** `07/15`
- **Mã OTP xác thực:** `123456`

---

## 🎁 8. MÃ GIẢM GIÁ (VOUCHER) ÁP DỤNG TRONG HỆ THỐNG

- **`VANDUC`**: Giảm 20% (Tối đa 50.000 VNĐ cho đơn từ 100.000 VNĐ).
- **`VANDUC10`**: Giảm 10% (Tối đa 30.000 VNĐ cho đơn từ 150.000 VNĐ).

---

## 👨‍💻 9. THÔNG TIN ĐỀ TÀI & TÁC GIẢ

- **Đề tài:** Xây dựng Website bán sách cho Cửa hàng Văn Đức sử dụng Java và MySQL có tích hợp AI
- **Chuyên ngành:** Công nghệ Thông tin
- **Năm thực hiện:** 2026
