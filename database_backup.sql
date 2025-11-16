-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: futuristic_portofolio
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

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
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section` varchar(50) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `content` text,
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,'hero','A Backend Developer Who\'s Flexible Enough to Touch the Frontend When Needed','Focused on Backend, but Not Afraid to Build a Quick Page to Test an API','I’m a Computer Science student at Universitas Pasundan with a strong focus on backend development—building APIs, managing databases, and crafting system logic. But in real-world projects, the frontend interface for testing APIs isn’t always ready when I need it.\n\nMost of the time, I rely on Postman. But when necessary, I build simple frontend pages to test the functionality myself. I\'m not a UI expert, but I get the job done.\n\nFor me, being a developer means staying adaptable—stepping out of my comfort zone, learning new tools, and supporting the team wherever I’m needed.',0,'2025-05-03 17:08:39','2025-05-03 19:21:25'),(2,'about','About Me','Who I am and what I do','I’m a computer science student at Universitas Pasundan who enjoys coding—though like most developers, I sometimes need a break too. My journey began with learning basic HTML, then building websites using PHP. That early exposure sparked a deeper interest, which eventually led me to fall in love with Java—and later, shift my focus to Kotlin.\n\nWhile I primarily enjoy backend development, I’ve taken on Laravel projects from time to time (sometimes for extra pocket money). Over time, I’ve expanded my skill set to mobile development using Kotlin and Flutter, and I’ve recently started exploring Go due to its strong career prospects in backend systems.\n\nI’m always open to learning new tools and technologies, and I believe in growing through hands-on experience, collaboration, and continuous curiosity.',0,'2025-05-03 17:08:39','2025-05-03 19:20:03');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cvs`
--

DROP TABLE IF EXISTS `cvs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cvs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` int DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `download_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cvs`
--

LOCK TABLES `cvs` WRITE;
/*!40000 ALTER TABLE `cvs` DISABLE KEYS */;
INSERT INTO `cvs` VALUES (4,'CV Lisvindanu','Lisvindanu CV\'s','/uploads/cv_file-1751536354643-950380882.pdf','CV Lisvindanu.pdf',119252,'2025-07-03 09:52:34',1,3,'2025-07-03 09:52:34','2025-08-21 11:11:57');
/*!40000 ALTER TABLE `cvs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `images` text,
  `tags` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (2,'Anaphygon Server','Pengembangan website untuk memudahkan pemantauan server dan akses ke beberapa website untuk kebutuhan pribadi.','https://i.imgur.com/32uWAS9.png','','Html5,Css3,JavaScript,Linux Mint','https://web.vinmedia.my.id/','',1,3,'2025-05-03 20:36:00','2025-05-15 15:25:32'),(3,'Penerbit Skt','Pengembangan website penjualan dan penerbitan buku','https://live.staticflickr.com/65535/54521564958_c889872f47_h.jpg','https://live.staticflickr.com/65535/54521308596_4d5862189a_h.jpg','Laravel, Tailwind, API, PHP, JavaScript','https://penerbitskt.apcoms.co.id/','https://github.com/ApcomSolutions/PenerbitSkt',1,1,'2025-05-15 15:24:24','2025-05-15 15:25:11'),(4,'Virtual Blogs','Virtual Blogs adalah aplikasi mobile yang memungkinkan pengguna untuk membaca dan menulis blog dengan mudah melalui smartphone. Dirancang dengan antarmuka yang modern dan intuitif, aplikasi ini memberikan pengalaman blogging yang nyaman di genggaman tangan.\r\n\r\nFitur unggulan:\r\n\r\nBuat, baca, dan kelola blog langsung dari perangkat mobile\r\n\r\nDesain UI yang simpel dan responsif\r\n\r\nTerhubung dengan backend API untuk sinkronisasi data secara real-time\r\n\r\nCocok untuk pengguna yang suka berbagi cerita, opini, atau informasi melalui blog di mana saja dan kapan saja\r\n\r\nVirtual Blogs dikembangkan sebagai bagian dari eksplorasi dalam membangun platform blogging berbasis mobile dengan teknologi modern.\r\n\r\nSaat ini server backend offline','/uploads/thumbnail-1751534248204-185304214.png','/uploads/images-1751523043204-807768648.png','Android, Kotlin','','https://github.com/DevGuerilla/VirtualBlog-Client',1,3,'2025-06-03 14:08:37','2025-07-03 09:17:28'),(8,'Naramakna','Website Berita','/uploads/thumbnail-1758887493196-203286940.jpg',NULL,'NextJs, React, Typescript','https://naramakna.id','',1,0,'2025-09-26 11:51:33','2025-09-26 11:51:33');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `proficiency` int DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Kotlin','Backend',50,'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kotlin_Icon.svg/1200px-Kotlin_Icon.svg.png',0,'2025-05-03 20:28:33','2025-05-03 20:28:33'),(2,'Spring Boot','Backend',40,'https://imgs.search.brave.com/PDsYeYpj9PoR7JEEwYnPSpBaWH5G9tPRYajJt4C-Yw4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy83/Lzc5L1NwcmluZ19C/b290LnN2Zw',0,'2025-05-06 14:15:46','2025-05-06 14:15:46'),(3,'Krita','Design',50,'https://static.cdnlogo.com/logos/k/92/krita.svg',0,'2025-06-07 13:46:48','2025-06-07 13:47:05'),(4,'Android','Mobile',50,'https://developer.android.com/static/images/logos/android.svg',0,'2025-06-07 13:47:59','2025-06-07 13:49:03');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin','$2b$10$NAFetVmXFIZdbrJwgZevEOK8N4UzNyumnAfVuHmcwbM6JGoXgcEbK','2025-05-03 18:57:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 14:27:49
