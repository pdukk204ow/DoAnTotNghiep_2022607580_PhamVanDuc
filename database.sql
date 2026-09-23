-- MySQL dump 10.13  Distrib 9.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: book
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `book`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `book` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `book`;

--
-- Table structure for table `app_roles`
--

DROP TABLE IF EXISTS `app_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_roles`
--

LOCK TABLES `app_roles` WRITE;
/*!40000 ALTER TABLE `app_roles` DISABLE KEYS */;
INSERT INTO `app_roles` VALUES (1,'ROLE_USER'),(2,'ROLE_ADMIN');
/*!40000 ALTER TABLE `app_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_details`
--

DROP TABLE IF EXISTS `cart_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_details` (
  `cart_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `quantity` int NOT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_detail_id`),
  KEY `FKkcochhsa891wv0s9wrtf36wgt` (`cart_id`),
  KEY `FK9rlic3aynl3g75jvedkx84lhv` (`product_id`),
  CONSTRAINT `FK9rlic3aynl3g75jvedkx84lhv` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKkcochhsa891wv0s9wrtf36wgt` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_details`
--

LOCK TABLES `cart_details` WRITE;
/*!40000 ALTER TABLE `cart_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FKb5o626f86h46m4s7ms6ginnop` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,0,'Hà Tĩnh','0967291997',2),(2,0,'123, Xã Thượng Ân, Huyện Ngân Sơn, Tỉnh Bắc Kạn','0916891997',3),(3,0,'11, Phường Minh Xuân, Thành phố Tuyên Quang, Tỉnh Tuyên Quang','0916855648',4),(4,136170,'khk (Người nhận: ljkljb) [Mã KM: FFFFFFF - Giảm 15.130đ]','8790869056',5),(5,0,'Số 20, Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội','0987657656',6),(6,0,'','',7),(7,735800,'ha noi (Người nhận: duc)','019239173',8),(8,950000,'100 Phú, Phường Phú Đô, Quận Nam Từ Liêm, Thành phố Hà Nội (Người nhận: Đức)','0987654545',13),(9,151300,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)','0987646464',14);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Sách Chính trị – pháp luật'),(2,'Sách Khoa học công nghệ – Kinh tế'),(3,'Sách Văn học nghệ thuật'),(4,'Sách Văn hóa xã hội – Lịch sử'),(5,'Sách Giáo trình'),(6,'Sách Truyện, tiểu thuyết'),(7,'Sách Tâm lý, tâm linh, tôn giáo'),(8,'Sách thiếu nhi'),(12,'Đức');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `favorite_id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`favorite_id`),
  KEY `FK6sgu5npe8ug4o42bf9j71x20c` (`product_id`),
  KEY `FKk7du8b8ewipawnnpg76d55fus` (`user_id`),
  CONSTRAINT `FK6sgu5npe8ug4o42bf9j71x20c` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKk7du8b8ewipawnnpg76d55fus` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `order_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`),
  KEY `FKjyu2qbqt8gnvno9oe9j2s2ldk` (`order_id`),
  KEY `FK4q98utpd73imf4yhttm3w0eax` (`product_id`),
  CONSTRAINT `FK4q98utpd73imf4yhttm3w0eax` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKjyu2qbqt8gnvno9oe9j2s2ldk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`orders_id`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (114,19800,1,27,51),(115,716000,1,27,25),(116,154560,1,28,54),(117,45000,2,29,3),(118,74100,1,29,4),(119,114750,2,30,6),(120,82800,1,30,5),(121,110000,3,31,7),(122,74100,2,31,4),(123,82800,2,32,5),(124,114750,1,33,6),(125,45000,1,33,3),(126,151300,1,34,55),(127,151300,1,35,55),(128,151300,1,36,55),(129,154560,1,37,54),(130,151300,1,37,55),(131,151300,1,38,55),(132,118800,1,39,52),(133,151300,1,40,55),(134,151300,1,41,55),(135,151300,1,42,55),(136,118800,1,43,52),(137,151300,1,44,55),(138,151300,1,45,55),(139,151300,1,46,55),(140,118800,1,47,52),(141,4945920,32,48,54),(142,154560,1,49,54),(143,154560,1,50,54),(144,1900000,2,51,57),(145,950000,1,52,57),(146,950000,1,53,57),(147,7600000,8,54,57),(148,950000,1,55,57),(149,950000,1,56,57),(150,79200,4,57,51),(151,121900,1,58,58),(152,243800,2,59,58),(153,121900,1,60,58),(154,121900,1,61,58),(155,90000,2,62,3),(156,45000,1,63,3),(157,121900,1,64,58),(158,151300,1,65,55);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orders_id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `payment_method` int NOT NULL,
  `vnp_txn_ref` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orders_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (27,'Số 18 Hoàng Quốc Việt, P. Nghĩa Đô, Q. Cầu Giấy, Hà Nội (Người nhận: Anh Đức)',735800,'2026-06-17 20:43:16','019239173',2,8,0,NULL),(28,'Khu đô thị Sala, P. An Lợi Đông, TP. Thủ Đức, TP. HCM (Người nhận: Lê Khang)',154560,'2026-09-11 12:32:33','8790869056',1,5,1,'15678069'),(29,'Số 12 Chùa Bộc, P. Quang Trung, Q. Đống Đa, Hà Nội (Người nhận: Nguyễn Cảnh Vinh)',164100,'2026-09-10 14:20:00','0372651619',0,5,0,NULL),(30,'Số 88 Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội (Người nhận: Trần Thảo Chi)',312300,'2026-09-09 10:15:30','0916855648',1,4,1,NULL),(31,'Tòa Landmark 81, 720A Điện Biên Phủ, P. 22, Q. Bình Thạnh, TP. HCM (Người nhận: Thái Văn Hà)',478200,'2026-09-08 16:45:10','0987657656',2,6,0,NULL),(32,'Số 25 Lê Duẩn, P. Bến Nghé, Quận 1, TP. HCM (Người nhận: Quang Vinh)',165600,'2026-09-05 09:30:00','0916891997',2,3,1,NULL),(33,'Số 45 Trần Phú, P. Văn Quán, Q. Hà Đông, Hà Nội (Người nhận: Nguyễn Cảnh Vinh)',159750,'2026-09-11 11:10:00','0372651619',0,5,0,NULL),(34,'khk (Người nhận: ljkljb)',151300,'2026-09-11 13:59:34','8790869056',0,5,0,NULL),(35,'khk (Người nhận: ljkljb) [Mã KM: FFFFFFF - Giảm 15.130đ]',151300,'2026-09-11 14:35:52','8790869056',0,5,1,'35'),(36,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-13 13:09:09','0987654545',0,13,1,'36'),(37,'ádfds (Người nhận: qưeqwe)',305860,'2026-09-13 13:09:34','0987654545',0,13,0,NULL),(38,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-13 13:11:25','0987654545',0,13,1,'38'),(39,'ádfds (Người nhận: qưeqwe)',118800,'2026-09-13 13:12:23','0987654545',0,13,0,NULL),(40,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-13 13:12:35','0987654545',0,13,1,'40'),(41,'jhjhjh, Xã Khánh Lợi, Huyện Yên Khánh, Tỉnh Ninh Bình (Người nhận: phamj van duc)',151300,'2026-09-20 07:52:55','0287403704',0,13,1,'41'),(42,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-20 07:53:02','0987654545',0,13,0,NULL),(43,'jhjhjh, Xã Khánh Lợi, Huyện Yên Khánh, Tỉnh Ninh Bình (Người nhận: phamj van duc)',118800,'2026-09-20 07:53:20','0287403704',3,13,1,'43'),(44,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-20 08:11:02','0987654545',0,13,0,NULL),(45,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-20 08:11:27','0987654545',3,13,1,'45'),(46,'ádfds (Người nhận: qưeqwe)',151300,'2026-09-23 09:33:46','0987654545',3,13,0,NULL),(47,'jhjhjh, Xã Khánh Lợi, Huyện Yên Khánh, Tỉnh Ninh Bình (Người nhận: phamj van duc)',118800,'2026-09-23 09:39:38','0287403704',0,13,0,NULL),(48,'ádfds (Người nhận: qưeqwe)',4945920,'2026-09-23 09:49:16','0987654545',2,13,0,NULL),(49,'ádfds (Người nhận: qưeqwe)',154560,'2026-09-23 09:54:27','0987654545',2,13,0,NULL),(50,'ádfds (Người nhận: qưeqwe)',154560,'2026-09-23 09:54:55','0987654545',2,13,0,NULL),(51,'100 Phú, Phường Phú Đô, Quận Nam Từ Liêm, Thành phố Hà Nội (Người nhận: Đức)',1900000,'2026-09-23 10:01:06','0987654545',2,13,0,NULL),(52,'100 Phú, Phường Phú Đô, Quận Nam Từ Liêm, Thành phố Hà Nội (Người nhận: Đức)',950000,'2026-09-23 10:01:32','0987654545',1,13,0,NULL),(53,'100 Phú, Phường Phú Đô, Quận Nam Từ Liêm, Thành phố Hà Nội (Người nhận: Đức)',950000,'2026-09-23 10:06:00','0987654545',2,13,0,NULL),(54,'100 Phú, Phường Phú Đô, Quận Nam Từ Liêm, Thành phố Hà Nội (Người nhận: Đức)',7600000,'2026-09-23 10:16:24','0987654545',0,13,0,NULL),(55,'100 Phú, Phường Phú Đô, Quận Nam Từ Liêm, Thành phố Hà Nội (Người nhận: Đức)',950000,'2026-09-23 10:16:35','0987654545',0,13,0,NULL),(56,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',950000,'2026-09-23 10:34:11','0987646464',2,14,0,NULL),(57,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',79200,'2026-09-23 10:36:10','0987646464',2,14,0,NULL),(58,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',121900,'2026-09-23 10:37:23','0987646464',3,14,0,NULL),(59,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',243800,'2026-09-23 10:37:36','0987646464',2,14,0,NULL),(60,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',121900,'2026-09-23 10:37:55','0987646464',3,14,0,NULL),(61,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',121900,'2026-09-23 10:42:56','0987646464',3,14,0,NULL),(62,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',90000,'2026-09-23 10:43:33','0987646464',2,14,0,NULL),(63,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',45000,'2026-09-23 10:44:29','0987646464',3,14,1,'63'),(64,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',121900,'2026-09-23 10:47:02','0987646464',3,14,0,NULL),(65,'12 22, Xã Thái Hòa, Huyện Ứng Hòa, Thành phố Hà Nội (Người nhận: Đức)',151300,'2026-09-23 10:47:12','0987646464',2,14,0,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) DEFAULT NULL,
  `discount` int NOT NULL,
  `entered_date` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int NOT NULL,
  `sold` int NOT NULL,
  `status` bit(1) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (3,'Toàn văn Hiến pháp hiện hành của nước CHXHCN Việt Nam — văn bản pháp lý cao nhất, nền tảng cho toàn bộ hệ thống pháp luật quốc gia. Ấn bản chuẩn, tiện tra cứu.',0,'2025-09-10','assets/images/hien-phap-nuoc-cong-hoa-xa-hoi-chu-nghia-viet-nam-hien-hanh.jpg','Hiến Pháp Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam (Hiện Hành)',45000,148,30,_binary '',1,'Quốc Hội Việt Nam'),(4,'Trọn bộ quy định mới nhất về thành lập, tổ chức quản lý và hoạt động của doanh nghiệp tại Việt Nam. Tài liệu không thể thiếu cho người khởi nghiệp và nhà quản lý.',5,'2025-10-02','assets/images/luat-doanh-nghiep-hien-hanh.jpg','Luật Doanh Nghiệp (Hiện Hành)',78000,120,22,_binary '',1,'Quốc Hội Việt Nam'),(5,'Phân tích và hướng dẫn áp dụng Bộ luật Lao động qua các tình huống thực tế: hợp đồng, tiền lương, kỷ luật, tranh chấp. Dành cho cả người lao động lẫn người sử dụng lao động.',10,'2025-11-15','assets/images/luat-lao-dong-thuc-hanh.jpg','Luật Lao Động Thực Hành',92000,100,18,_binary '',1,'Nguyễn Văn Phần'),(6,'Sổ tay pháp lý toàn diện giúp doanh nghiệp phòng ngừa rủi ro: hợp đồng, thuế, sở hữu trí tuệ, giải quyết tranh chấp. Viết bởi luật sư giàu kinh nghiệm thực chiến.',15,'2026-01-20','assets/images/cam-nang-phap-ly-cho-doanh-nghiep.jpg','Cẩm Nang Pháp Lý Cho Doanh Nghiệp',135000,90,41,_binary '',1,'Trương Thanh Đức'),(7,'Tập hợp đầy đủ Luật Đất đai cùng các nghị định, thông tư hướng dẫn thi hành mới nhất. Công cụ tra cứu thiết yếu cho công tác quản lý và giao dịch bất động sản.',0,'2025-08-05','assets/images/luat-dat-dai-va-van-ban-huong-dan-thi-hanh.jpg','Luật Đất Đai Và Văn Bản Hướng Dẫn Thi Hành',110000,80,12,_binary '',1,'Bộ Tư Pháp'),(8,'Bình luận khoa học về Bộ luật Dân sự — quyền sở hữu, hợp đồng, thừa kế, bồi thường thiệt hại. Giúp bạn đọc nắm vững nguyên tắc nền tảng của luật tư.',8,'2026-02-11','assets/images/tim-hieu-bo-luat-dan-su-viet-nam.jpg','Tìm Hiểu Bộ Luật Dân Sự Việt Nam',156000,85,15,_binary '',1,'Đỗ Văn Đại'),(9,'Cẩm nang kinh điển của Uncle Bob về cách viết mã nguồn sạch, dễ đọc, dễ bảo trì. Bắt buộc đọc với mọi lập trình viên muốn nâng tầm tay nghề.',10,'2026-03-01','assets/images/clean-code-ma-sach-va-cach-viet.jpg','Clean Code - Mã Sạch Và Cách Viết',168000,140,86,_binary '',2,'Robert C. Martin'),(10,'Kiệt tác thi ca của đại thi hào Nguyễn Du — 3254 câu lục bát kể về cuộc đời nàng Kiều. Đỉnh cao của văn học cổ điển Việt Nam, di sản của muôn đời.',5,'2025-09-09','assets/images/truyen-kieu.jpg','Truyện Kiều',68000,130,52,_binary '',3,'Nguyễn Du'),(11,'Tiểu thuyết trào phúng bậc thầy về Xuân Tóc Đỏ và xã hội thành thị nhố nhăng thời thuộc địa. Tiếng cười sắc bén phê phán thói rởm đời, học làm sang.',0,'2025-10-19','assets/images/so-do.jpg','Số Đỏ',72000,100,33,_binary '',3,'Vũ Trọng Phụng'),(12,'Tập truyện ngắn tài hoa tái hiện vẻ đẹp của một thời đã xa: thú uống trà, chơi chữ, những con người cuối mùa nho nhã. Văn phong Nguyễn Tuân độc đáo, đậm chất nghệ sĩ.',0,'2025-12-01','assets/images/vang-bong-mot-thoi.jpg','Vang Bóng Một Thời',78000,90,20,_binary '',3,'Nguyễn Tuân'),(13,'Cuộc phiêu lưu của chú Dế Mèn qua thế giới loài vật — bài học về lòng dũng cảm, tình bạn và khát vọng. Tác phẩm gối đầu giường của bao thế hệ thiếu nhi Việt Nam.',10,'2026-02-14','assets/images/de-men-phieu-luu-ky.jpg','Dế Mèn Phiêu Lưu Ký',56000,160,64,_binary '',3,'Tô Hoài'),(14,'Bộ thông sử Việt Nam bằng chữ quốc ngữ đầu tiên, trình bày mạch lạc dòng chảy lịch sử dân tộc từ thời dựng nước đến cận đại. Công trình kinh điển của học giả Trần Trọng Kim.',5,'2025-11-03','assets/images/viet-nam-su-luoc.jpg','Việt Nam Sử Lược',125000,110,47,_binary '',4,'Trần Trọng Kim'),(15,'Tổng quan các biến cố lớn định hình thế giới hiện đại: hai cuộc thế chiến, chiến tranh lạnh, toàn cầu hóa. Tài liệu nền tảng cho người yêu lịch sử.',8,'2026-01-08','assets/images/lich-su-the-gioi-hien-dai.jpg','Lịch Sử Thế Giới Hiện Đại',158000,90,24,_binary '',4,'Nguyễn Anh Thái'),(16,'Những bài học thực dụng đưa bạn từ thợ code thành kỹ sư phần mềm bậc thầy: tư duy, công cụ, thói quen nghề nghiệp bền vững.',12,'2026-03-18','assets/images/the-pragmatic-programmer-lap-trinh-vien-thuc-dung.jpg','The Pragmatic Programmer - Lập Trình Viên Thực Dụng',175000,110,58,_binary '',2,'Andrew Hunt & David Thomas'),(17,'Giải thích trí tuệ nhân tạo, machine learning và deep learning bằng ngôn ngữ dễ hiểu, không nặng toán. Khởi đầu hoàn hảo cho người mới bước vào lĩnh vực AI.',5,'2026-04-02','assets/images/ai-co-ban-tri-tue-nhan-tao-cho-moi-nguoi.jpg','AI Cơ Bản - Trí Tuệ Nhân Tạo Cho Mọi Người',132000,120,45,_binary '',2,'Phạm Huy Hoàng'),(18,'Khám phá cách blockchain định hình lại tài chính, kinh doanh và xã hội. Từ Bitcoin đến hợp đồng thông minh, một bức tranh toàn cảnh về cuộc cách mạng chuỗi khối.',8,'2026-02-22','assets/images/blockchain-fundamentals-nen-tang-cong-nghe-chuoi-khoi.jpg','Blockchain Fundamentals - Nền Tảng Công Nghệ Chuỗi Khối',145000,95,31,_binary '',2,'Don Tapscott'),(19,'Phương pháp xây dựng startup hiện đại: thử nghiệm nhanh, học hỏi từ khách hàng, xoay trục đúng lúc. Kim chỉ nam cho mọi nhà sáng lập.',15,'2026-03-25','assets/images/khoi-nghiep-tinh-gon-the-lean-startup.jpg','Khởi Nghiệp Tinh Gọn (The Lean Startup)',128000,130,72,_binary '',2,'Eric Ries'),(20,'Giáo trình nền tảng về cấu trúc dữ liệu và thuật toán: danh sách, cây, đồ thị, sắp xếp, tìm kiếm. Kèm ví dụ minh họa cho sinh viên công nghệ thông tin.',5,'2025-09-15','assets/images/giao-trinh-cau-truc-du-lieu-va-giai-thuat.jpg','Giáo Trình Cấu Trúc Dữ Liệu Và Giải Thuật',88000,130,38,_binary '',5,'Đinh Mạnh Tường'),(21,'Kiến thức cơ bản đến nâng cao về mạng máy tính: mô hình OSI, TCP/IP, định tuyến, bảo mật. Tài liệu chuẩn cho học phần mạng tại các trường đại học.',0,'2025-10-27','assets/images/giao-trinh-mang-may-tinh.jpg','Giáo Trình Mạng Máy Tính',95000,110,26,_binary '',5,'Nguyễn Thúc Hải'),(22,'Học lập trình Java từ căn bản: cú pháp, hướng đối tượng, collection, xử lý ngoại lệ, lập trình giao diện. Bài tập phong phú bám sát chương trình đào tạo.',10,'2026-01-30','assets/images/giao-trinh-lap-trinh-java.jpg','Giáo Trình Lập Trình Java',102000,140,44,_binary '',5,'Trần Đình Quế'),(23,'Nền tảng về mô hình quan hệ, thiết kế CSDL, chuẩn hóa và ngôn ngữ SQL. Giáo trình cốt lõi cho sinh viên ngành công nghệ thông tin và hệ thống thông tin.',8,'2025-12-12','assets/images/giao-trinh-co-so-du-lieu.jpg','Giáo Trình Cơ Sở Dữ Liệu',98000,115,29,_binary '',5,'Phạm Thị Anh Lê'),(24,'Bộ quốc sử đồ sộ ghi chép lịch sử Đại Việt từ thời Hồng Bàng đến nhà Lê. Di sản sử học vô giá, nguồn tư liệu gốc cho mọi nghiên cứu về Việt Nam xưa.',12,'2025-08-22','assets/images/dai-viet-su-ky-toan-thu.jpg','Đại Việt Sử Ký Toàn Thư',245000,70,19,_binary '',4,'Ngô Sĩ Liên'),(25,'Tác phẩm đoạt giải Pulitzer lý giải vì sao các nền văn minh phát triển không đồng đều. Một cái nhìn liên ngành chấn động về số phận của các xã hội loài người.',15,'2026-02-05','assets/images/sung-vi-trung-va-thep.jpg','Súng, Vi Trùng Và Thép',189000,94,36,_binary '',4,'Jared Diamond'),(26,'Những vụ án ly kỳ của thám tử lừng danh phố Baker. Tài suy luận thiên tài của Sherlock Holmes đã làm say mê độc giả khắp thế giới hơn một thế kỷ qua.',10,'2026-01-15','assets/images/sherlock-holmes-toan-tap-tap-1.jpg','Sherlock Holmes Toàn Tập - Tập 1',215000,110,51,_binary '',6,'Arthur Conan Doyle'),(27,'Kiệt tác về gia đình mafia Corleone — quyền lực, danh dự và máu. Một bức chân dung sắc lạnh về thế giới ngầm và bản chất con người. Tiểu thuyết bất hủ.',8,'2025-11-20','assets/images/bo-gia-the-godfather.jpg','Bố Già (The Godfather)',145000,100,49,_binary '',6,'Mario Puzo'),(28,'Hành trình của cậu bé Rémi lưu lạc khắp nước Pháp đi tìm gia đình. Câu chuyện cảm động về nghị lực, lòng nhân hậu và khát khao yêu thương.',5,'2025-10-08','assets/images/khong-gia-dinh.jpg','Không Gia Đình',132000,95,27,_binary '',6,'Hector Malot'),(29,'Câu chuyện trong veo mà đau đáu về cậu bé Zezé nghèo khó và trí tưởng tượng diệu kỳ. Một cuốn sách lay động trái tim hàng triệu độc giả toàn cầu.',12,'2026-03-10','assets/images/cay-cam-ngot-cua-toi.jpg','Cây Cam Ngọt Của Tôi',108000,130,68,_binary '',6,'José Mauro de Vasconcelos'),(30,'Tiểu thuyết tư tưởng về kiến trúc sư Howard Roark và cuộc chiến bảo vệ chính kiến trước đám đông. Bản tuyên ngôn về chủ nghĩa cá nhân và sự sáng tạo.',15,'2026-02-28','assets/images/suoi-nguon-the-fountainhead.jpg','Suối Nguồn (The Fountainhead)',232000,85,33,_binary '',6,'Ayn Rand'),(31,'Khám phá nguồn sức mạnh vô tận ẩn trong tiềm thức và cách khai mở nó để thay đổi cuộc đời. Một trong những cuốn sách phát triển bản thân có ảnh hưởng nhất.',10,'2026-01-22','assets/images/suc-manh-tiem-thuc.jpg','Sức Mạnh Tiềm Thức',110000,140,63,_binary '',7,'Joseph Murphy'),(32,'Những phương pháp thiết thực để vượt qua lo âu, tìm lại bình an và sống trọn vẹn từng ngày. Kim chỉ nam cho một tâm hồn an nhiên giữa cuộc sống bộn bề.',8,'2025-12-18','assets/images/quang-ganh-lo-di-va-vui-song.jpg','Quẳng Gánh Lo Đi Và Vui Sống',98000,130,57,_binary '',7,'Dale Carnegie'),(33,'Ghi chép về cuộc gặp gỡ các bậc hiền triết phương Đông và những huyền bí của tâm linh. Bản dịch của Nguyên Phong đưa người đọc vào thế giới minh triết sâu thẳm.',5,'2025-11-11','assets/images/hanh-trinh-ve-phuong-dong.jpg','Hành Trình Về Phương Đông',105000,110,42,_binary '',7,'Baird T. Spalding'),(34,'Kể lại cuộc đời Đức Phật bằng giọng văn dung dị, thấm đẫm chất thơ và thiền vị. Một tác phẩm chạm đến trái tim của hàng triệu người trên khắp thế giới.',12,'2026-02-09','assets/images/duong-xua-may-trang.jpg','Đường Xưa Mây Trắng',165000,100,38,_binary '',7,'Thích Nhất Hạnh'),(35,'Tuyển tập đồ sộ những câu chuyện cổ tích dân gian Việt Nam: Tấm Cám, Thạch Sanh, Cây tre trăm đốt... Gìn giữ hồn cốt văn hóa dân tộc cho thế hệ nhỏ.',10,'2025-10-30','assets/images/kho-tang-truyen-co-tich-viet-nam.jpg','Kho Tàng Truyện Cổ Tích Việt Nam',135000,150,44,_binary '',8,'Nguyễn Đổng Chi'),(36,'Bộ sách khoa học giải đáp hàng nghìn thắc mắc của trẻ về thế giới quanh ta: thiên nhiên, vũ trụ, cơ thể, công nghệ. Nuôi dưỡng trí tò mò và niềm yêu khám phá.',15,'2026-01-05','assets/images/10-van-cau-hoi-vi-sao.jpg','10 Vạn Câu Hỏi Vì Sao',89000,170,71,_binary '',8,'Nhiều Tác Giả'),(37,'Câu chuyện trong trẻo và sâu sắc về cậu hoàng tử nhỏ đến từ tiểu hành tinh B612. Tác phẩm văn học được yêu thích nhất nước Pháp, dành cho mọi lứa tuổi.',8,'2025-12-25','assets/images/hoang-tu-be.jpg','Hoàng Tử Bé',76000,160,59,_binary '',8,'Antoine de Saint-Exupéry'),(38,'Hồi ức cảm động về cô bé Totto-chan và ngôi trường Tomoe đặc biệt. Một quan niệm giáo dục đầy nhân văn khiến cả trẻ em lẫn người lớn yêu thích.',10,'2026-02-17','assets/images/totto-chan-ben-cua-so.jpg','Totto-chan Bên Cửa Sổ',92000,140,46,_binary '',8,'Kuroyanagi Tetsuko'),(39,'Truyện ngắn hiện thực đỉnh cao về bi kịch bị tha hóa của người nông dân. Tiếng kêu Ai cho tao lương thiện vang vọng mãi trong văn học Việt Nam.',10,'2025-09-28','assets/images/chi-pheo.jpg','Chí Phèo',55000,120,50,_binary '',3,'Nam Cao'),(40,'Bức tranh chân thực về số phận người nông dân dưới ách sưu thuế qua hình tượng chị Dậu. Một bản án đanh thép với xã hội thực dân phong kiến.',8,'2025-11-06','assets/images/tat-den.jpg','Tắt Đèn',60000,95,30,_binary '',3,'Ngô Tất Tố'),(41,'Đại tiểu thuyết về Jean Valjean và hành trình cứu rỗi giữa nước Pháp đầy biến động. Bản hùng ca bất hủ về lòng nhân ái, công lý và phẩm giá con người.',15,'2026-01-12','assets/images/nhung-nguoi-khon-kho.jpg','Những Người Khốn Khổ',218000,85,41,_binary '',3,'Victor Hugo'),(42,'Nghiên cứu vì sao một số công ty bứt phá từ tốt lên vĩ đại trong khi số khác thì không. Những nguyên lý lãnh đạo và quản trị đã được kiểm chứng bằng dữ liệu.',20,'2026-03-05','assets/images/tu-tot-den-vi-dai-good-to-great.jpg','Từ Tốt Đến Vĩ Đại (Good to Great)',138000,125,74,_binary '',2,'Jim Collins'),(43,'Kinh thánh của đầu tư giá trị, cuốn sách gối đầu giường của Warren Buffett. Tư duy kỷ luật giúp bạn đầu tư an toàn và sinh lời bền vững.',10,'2026-02-26','assets/images/nha-dau-tu-thong-minh.jpg','Nhà Đầu Tư Thông Minh',198000,100,55,_binary '',2,'Benjamin Graham'),(44,'Giới thiệu các khái niệm cốt lõi của trí tuệ nhân tạo: tìm kiếm, biểu diễn tri thức, suy diễn, học máy. Cầu nối lý thuyết và ứng dụng cho sinh viên.',8,'2026-01-18','assets/images/giao-trinh-nhap-mon-tri-tue-nhan-tao.jpg','Giáo Trình Nhập Môn Trí Tuệ Nhân Tạo',112000,100,22,_binary '',5,'Đinh Mạnh Tường'),(45,'Các nguyên lý cung cầu, hành vi người tiêu dùng, lý thuyết sản xuất và cấu trúc thị trường. Giáo trình chuẩn cho khối ngành kinh tế và quản trị kinh doanh.',5,'2025-12-05','assets/images/giao-trinh-kinh-te-vi-mo.jpg','Giáo Trình Kinh Tế Vi Mô',99000,120,31,_binary '',5,'Nguyễn Văn Công'),(46,'Phần tiếp nối của Sapiens, khám phá tương lai loài người trong kỷ nguyên công nghệ sinh học và trí tuệ nhân tạo. Những câu hỏi lớn về vận mệnh nhân loại.',12,'2026-03-14','assets/images/homo-deus-luoc-su-tuong-lai.jpg','Homo Deus: Lược Sử Tương Lai',195000,100,43,_binary '',4,'Yuval Noah Harari'),(47,'Góc nhìn kinh tế học bất ngờ và dí dỏm về những câu hỏi đời thường. Khám phá mặt ẩn giấu của mọi thứ qua dữ liệu và lý lẽ sắc bén.',12,'2026-02-20','assets/images/kinh-te-hoc-hai-huoc-freakonomics.jpg','Kinh Tế Học Hài Hước (Freakonomics)',142000,105,39,_binary '',2,'Steven D. Levitt & Stephen J. Dubner'),(48,'Thám tử Shinichi bị teo nhỏ thành cậu bé Conan và bắt đầu phá những vụ án hóc búa. Bộ truyện tranh trinh thám ăn khách bậc nhất mọi thời đại.',5,'2026-03-22','assets/images/tham-tu-lung-danh-conan-tap-1.jpg','Thám Tử Lừng Danh Conan - Tập 1',25000,250,78,_binary '',8,'Gosho Aoyama'),(49,'Thiết kế ấn tượng, sang trọng với màn hình tràn viền 3 cạnh\nAndroid Tivi AQUA 4K 50 inch LE50AQT6600UG tô điểm không gian lắp đặt nhờ thiết kế thanh mảnh, sang trọng, màn hình tràn viền độc đáo, tinh tế cả khi lắp đặt treo tường hay trên kệ tủ.\nTivi AQUA 50 inch phù hợp sử dụng cho các phòng vừa và nhỏ như phòng khách gia đình, phòng ngủ, phòng họp nhỏ…',21,'2022-03-20','https://res.cloudinary.com/martfury/image/upload/v1686548239/products/e2gljp4rkux1puw8hyrd.jpg','Sự Im Lặng Của Bầy Cừu (Tái Bản',12490000,686,0,_binary '\0',5,NULL),(50,'Thiết kế đơn giản, thanh lịch\nSmart Tivi Casper 32 inch 32HG5200 được thiết kế với vóc dáng vô cùng đơn giản, viền tivi mỏng 0,8 mm kết hợp với chân đế hình chữ V úp ngược mang lại tổng thể chiếc tivi trở nên sang trọng.\nTivi Casper 32 inch phù hợp trưng bày ở những nơi có không gian nhỏ như: Phòng ngủ, phòng khách nhỏ,...',9,'2022-03-20','https://res.cloudinary.com/martfury/image/upload/v1686548486/products/upy4yfzgpkfdx8kkzoqw.jpg','Sự Im Lặng Của Bầy Cừu (Tái Bản',5440000,1998,2,_binary '\0',4,NULL),(51,'Chú mèo máy Doraemon từ tương lai cùng những bảo bối thần kỳ và cậu bạn Nobita. Bộ truyện tranh tuổi thơ thân thương của bao thế hệ thiếu nhi.',10,'2026-05-12','assets/images/doraemon-tap-1.jpg','Doraemon - Tập 1',22000,295,110,_binary '',8,'Fujiko F. Fujio'),(52,'Khởi đầu của loạt truyện phù thủy huyền thoại. Cậu bé Harry bước vào trường Hogwarts và khám phá thế giới phép thuật kỳ diệu. Hiện tượng xuất bản toàn cầu.',12,'2026-05-20','assets/images/Harry Potter Và Hòn Đá Phù Thủy.jpg','Harry Potter Và Hòn Đá Phù Thủy',135000,200,120,_binary '',6,'J.K. Rowling'),(53,'Thiết kế sang trọng, chân đế chắc chắn\nAndroid Tivi TCL 43 inch L43S5200 có thiết kế hiện đại, gọn gàng, khung viền được làm mỏng cho màn hình phủ trọn tầm nhìn của bạn, mang đến trải nghiệm tuyệt vời, không bị giới hạn.\nTivi TCL 43 inch có chân đến chữ V úp ngược bằng kim loại bền bỉ, đứng vững trên mặt bàn, kệ, không sợ bị nghiêng, đổ khi lắp đặt trong không gian phòng ngủ, phòng khách hay phòng hội nghị.',0,'2022-03-20','https://res.cloudinary.com/martfury/image/upload/v1686548486/products/upy4yfzgpkfdx8kkzoqw.jpg','Sự Im Lặng Của Bầy Cừu (Tái Bản',8290000,998,2,_binary '\0',1,NULL),(54,'Những câu chuyện về luân hồi, nhân quả và hành trình của linh hồn qua muôn kiếp. Tác phẩm tâm linh ăn khách bậc nhất, gợi mở suy ngẫm về lẽ sống.',8,'2026-06-01','assets/images/Muôn Kiếp Nhân Sinh.jpg','Muôn Kiếp Nhân Sinh',168000,156,146,_binary '',7,'Nguyên Phong'),(55,'Công trình tâm lý học đoạt giải Nobel về hai hệ thống tư duy chi phối mọi quyết định của con người. Cuốn sách thay đổi cách bạn hiểu về lý trí và sai lầm.',15,'2026-06-03','assets/images/Tư Duy Nhanh Và Chậm.jpg','Tư Duy Nhanh Và Chậm',178000,199,135,_binary '',7,'Daniel Kahneman'),(56,'daf',1,'2026-06-17','https://res.cloudinary.com/martfury/image/upload/v1781729444/products/m9moxxaxvcs3aapa4mr1.jpg','fffsdaf',1111111,1,0,_binary '\0',1,'aaaaaa'),(57,'Đức',5,'2026-09-23','https://res.cloudinary.com/martfury/image/upload/v1790157635/products/q6ndvldf7u8eaetqjsjf.png','Poster',1000000,-2,4,_binary '\0',12,'Đức'),(58,'1',1,'2026-09-23','https://res.cloudinary.com/martfury/image/upload/v1790159809/products/vxryhzrgp21dgrwnysom.png','Văn Đức (Admin)',123131,0,2,_binary '',1,'Daniel Kahneman');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `rate_date` datetime DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `order_detail_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoesgfm245y1ula1pn74fw9mkk` (`order_detail_id`),
  KEY `FK4mdsmkrr7od84tpgxto2v3t2e` (`product_id`),
  KEY `FKanlgavwqngljux10mtly8qr6f` (`user_id`),
  CONSTRAINT `FK4mdsmkrr7od84tpgxto2v3t2e` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `FKanlgavwqngljux10mtly8qr6f` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKoesgfm245y1ula1pn74fw9mkk` FOREIGN KEY (`order_detail_id`) REFERENCES `order_details` (`order_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
INSERT INTO `rates` VALUES (50,'ffeefwef','2026-08-30 13:19:17',4,NULL,52,5),(51,'.','2026-09-12 16:17:28',5,NULL,55,13);
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKihg20vygk8qb8lw0s573lqsmq` (`role_id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKihg20vygk8qb8lw0s573lqsmq` FOREIGN KEY (`role_id`) REFERENCES `app_roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(2,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` bit(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `register_date` date DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Hà Nội','ducadm@gmail.com',_binary '','https://res.cloudinary.com/martfury/image/upload/v1789233060/users/oog1787bwmuijgga4pwl.jpg','Văn Đức','$2a$10$yvcT5zT/lDrM89Lofss6GeF0icqluuVVxo2QX4BehAh75k.eAzFIe','0967291997','2022-03-20',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJncmVlbnlzaG9wLmFkbUBnbWFpbC5jb20iLCJzY29wZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlzcyI6Imh0dHA6Ly9kZXZnbGFuLmNvbSIsImlhdCI6MTY0Nzc4MjE4MywiZXhwIjoxNjQ3ODAwMTgzfQ.cLQLN6HPjClhuJFdBro1WHKEKfA7wYbBa3Eg3uHfNAE'),(3,'Hà Tĩnh','huudong297@gmail.com',_binary '','https://res.cloudinary.com/martfury/image/upload/v1673278740/users/tlyz4b113etd4z5xluaw.png','Vinh','$2a$10$FMNO9C77S9/Pae4.V11muuxKL0zKF1rdvJITCzZG61mKjygtMRhwu','0916891997','2022-03-20',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXVkb25nMjk3QGdtYWlsLmNvbSIsInNjb3BlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaXNzIjoiaHR0cDovL2RldmdsYW4uY29tIiwiaWF0IjoxNjQ3Nzg5NDI5LCJleHAiOjE2NDc4MDc0Mjl9.JfbZQ2D8lRg8UPWhnnLMO9R-lFW_8-r2hxV9kOVZRZM'),(4,'Hà Tĩnh','thaochi6404@gmail.com',_binary '','https://res.cloudinary.com/veggie-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png','Trần Thảo Chi','$2a$10$EWTp2tH0Rc1osvewWztXM.ba02wWffEupaG0.jziUul7b8WYUal3K','0916855648','2022-03-23',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFvY2hpNjQwNEBnbWFpbC5jb20iLCJzY29wZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlzcyI6Imh0dHA6Ly9kZXZnbGFuLmNvbSIsImlhdCI6MTY0ODA0MzUzNywiZXhwIjoxNjQ4MDYxNTM3fQ.589LqMNNJ-NiF0s425cR_tfAr3cfhqf7rpQ_QU1AEIw'),(5,'Ha Noi','canhvinh931@gmail.com',_binary '','https://res.cloudinary.com/veggie-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png','Đức','$2a$10$s.HWSdzRzb7mNToqyH2lJ.pOcPHVu8RmN.t.bNSVZtafGZRVQPgzu','0372651619','2022-12-25',_binary '\0',NULL),(6,'Hà Nội','thaivanha350@gmail.com',_binary '','https://res.cloudinary.com/veggie-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png','Tháii Văn Hà','$2a$10$FHrlgpjpyFg.9ozNadJPHutS.Gm3.c0VzRVuzQr/WHCRPzKNgg0TC','0987657656','2023-02-04',_binary '\0','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aGFpdmFuaGEzNTBAZ21haWwuY29tIiwic2NvcGVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpc3MiOiJodHRwOi8vZGV2Z2xhbi5jb20iLCJpYXQiOjE2NzU1MDMyMjQsImV4cCI6MTY3NTUyMTIyNH0.67IE-UXrpzeOuaSjqlH7IzSNTu5ok2KAqT4CzHIWSWQ'),(7,'Số 59 Láng Hạ, Q. Ba Đình, Hà Nội','hoangquan@gmail.com',_binary '','','Hoàng Minh Quân','$2a$10$yvcT5zT/lDrM89Lofss6GeF0icqluuVVxo2QX4BehAh75k.eAzFIe','0978123456','2026-09-01',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJzY29wZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlzcyI6Imh0dHA6Ly9kZXZnbGFuLmNvbSIsImlhdCI6MTc4MTcyNzgzMSwiZXhwIjoxNzgxNzQ1ODMxfQ.T6OGKgv1Dh6uOkweDTEtcSZFlvsEluRay6OeH8-c6mA'),(8,'','duc@gmail.com',_binary '','','Pham van Duc','$2a$10$RRQSF963m34OHBLqxEzNmO9hv.p3HdlnF4jeBDeSsKyACRYmdyBsO','0987654321','2026-06-17',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkdWNAZ21haWwuY29tIiwic2NvcGVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpc3MiOiJodHRwOi8vZGV2Z2xhbi5jb20iLCJpYXQiOjE3ODE3Mjc5NTMsImV4cCI6MTc4MTc0NTk1M30.HCkD_bmYccMiZr8cl4Hi_3ifIbOKHo1P_un_fulHY7g'),(9,'Số 120 Hai Bà Trưng, P. Bến Nghé, Quận 1, TP. HCM','maianh@gmail.com',_binary '\0',NULL,'Đỗ Mai Anh','$2a$10$yvcT5zT/lDrM89Lofss6GeF0icqluuVVxo2QX4BehAh75k.eAzFIe','0988654321','2026-09-02',_binary '',NULL),(10,'Số 45 Trần Thái Tông, P. Dịch Vọng Hậu, Q. Cầu Giấy, Hà Nội','minhduc@gmail.com',_binary '',NULL,'Trần Minh Đức','$2a$10$yvcT5zT/lDrM89Lofss6GeF0icqluuVVxo2QX4BehAh75k.eAzFIe','0912345678','2026-09-05',_binary '',NULL),(11,'Số 72 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng','phuonglinh@gmail.com',_binary '\0',NULL,'Nguyễn Phương Linh','$2a$10$yvcT5zT/lDrM89Lofss6GeF0icqluuVVxo2QX4BehAh75k.eAzFIe','0935123987','2026-09-08',_binary '',NULL),(12,'Số 18 Đại Lộ Hòa Bình, P. An Cư, Q. Ninh Kiều, Cần Thơ','hoangnam@gmail.com',_binary '',NULL,'Lê Hoàng Nam','$2a$10$yvcT5zT/lDrM89Lofss6GeF0icqluuVVxo2QX4BehAh75k.eAzFIe','0942567890','2026-09-10',_binary '',NULL),(13,'','1duc@gmail.com',_binary '','','Phạm Văn Đức','$2a$10$wHiH5QFzyH0/DrRh7SQ95.2hO.Qxv9sbh4V4Strvx6HONv0BW7dMq','0987677651','2026-09-12',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxZHVjQGdtYWlsLmNvbSIsInNjb3BlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaXNzIjoiaHR0cDovL2RldmdsYW4uY29tIiwiaWF0IjoxNzg5MjI5Nzg1LCJleHAiOjE3ODkyNDc3ODV9.NEr-L9oKZj4_ndEyAKDvVVwYQpMbuE1EeX0ucrDBNIw'),(14,'','12@12.12',_binary '','','Đức','$2a$10$pUVnn4CLuNc1.XZIgwiLE..BV9eCFLZHbL.EbS5HtDg7ot/pYBTTC','1209877271','2026-09-23',_binary '','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMkAxMi4xMiIsInNjb3BlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaXNzIjoiaHR0cDovL2RldmdsYW4uY29tIiwiaWF0IjoxNzkwMTU5MDE1LCJleHAiOjE3OTAxNzcwMTV9.YC6lE7u2XhPmpG3Gr_7wxZFKgWNLJXe7FK64A2OOvwg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `voucher_id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `discount` double NOT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `max_discount_amount` double DEFAULT NULL,
  `min_order_amount` double DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  `used_count` int NOT NULL,
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `UK_30ftp2biebbvpik8e49wlmady` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES (1,'VANDUC',20,'PERCENT','2026-12-31',50000,100000,'Ưu đãi thương hiệu VanDucStore (Giảm 20%)',500,'2026-09-01',_binary '',17),(2,'VANDUC10',10,'PERCENT','2026-10-31',30000,150000,'Giảm 10% đơn từ 150.000₫',100,'2026-09-01',_binary '',28),(3,'FREESHIP',30000,'FIXED','2026-12-31',30000,200000,'Miễn phí vận chuyển toàn quốc',200,'2026-09-01',_binary '',75),(4,'CHAOBANMOI',20000,'FIXED','2026-11-30',20000,100000,'Ưu đãi chào mừng khách hàng mới',50,'2026-09-01',_binary '',15),(5,'BOOKLOVER',15,'PERCENT','2026-10-15',50000,250000,'Tri ân độc giả yêu sách',100,'2026-09-05',_binary '',42),(6,'VIPMEMBER',50000,'FIXED','2026-08-31',50000,500000,'Ưu đãi độc quyền thành viên VIP',50,'2026-08-01',_binary '\0',50);
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-23 18:41:30
