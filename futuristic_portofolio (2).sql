-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 03, 2025 at 06:39 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `futuristic_portofolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

CREATE TABLE `content` (
  `id` int NOT NULL,
  `section` varchar(50) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `content` text,
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `content`
--

INSERT INTO `content` (`id`, `section`, `title`, `subtitle`, `content`, `order_index`, `created_at`, `updated_at`) VALUES
(1, 'hero', 'A Backend Developer Who\'s Flexible Enough to Touch the Frontend When Needed', 'Focused on Backend, but Not Afraid to Build a Quick Page to Test an API', 'I’m a Computer Science student at Universitas Pasundan with a strong focus on backend development—building APIs, managing databases, and crafting system logic. But in real-world projects, the frontend interface for testing APIs isn’t always ready when I need it.\n\nMost of the time, I rely on Postman. But when necessary, I build simple frontend pages to test the functionality myself. I\'m not a UI expert, but I get the job done.\n\nFor me, being a developer means staying adaptable—stepping out of my comfort zone, learning new tools, and supporting the team wherever I’m needed.', 0, '2025-05-03 17:08:39', '2025-05-03 19:21:25'),
(2, 'about', 'About Me', 'Who I am and what I do', 'I’m a computer science student at Universitas Pasundan who enjoys coding—though like most developers, I sometimes need a break too. My journey began with learning basic HTML, then building websites using PHP. That early exposure sparked a deeper interest, which eventually led me to fall in love with Java—and later, shift my focus to Kotlin.\n\nWhile I primarily enjoy backend development, I’ve taken on Laravel projects from time to time (sometimes for extra pocket money). Over time, I’ve expanded my skill set to mobile development using Kotlin and Flutter, and I’ve recently started exploring Go due to its strong career prospects in backend systems.\n\nI’m always open to learning new tools and technologies, and I believe in growing through hands-on experience, collaboration, and continuous curiosity.', 0, '2025-05-03 17:08:39', '2025-05-03 19:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `cvs`
--

CREATE TABLE `cvs` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` int DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `download_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cvs`
--

INSERT INTO `cvs` (`id`, `title`, `description`, `file_path`, `file_name`, `file_size`, `upload_date`, `is_active`, `download_count`, `created_at`, `updated_at`) VALUES
(3, 'CV Lisvindanu', 'CV Danu', '/uploads/cv_file-1751520286786-828378565.pdf', 'CV ATS[1].pdf', 116374, '2025-07-03 05:24:46', 1, 0, '2025-07-03 05:24:46', '2025-07-03 05:24:46');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `thumbnail`, `images`, `tags`, `url`, `github_url`, `featured`, `order_index`, `created_at`, `updated_at`) VALUES
(1, 'Apcoms Solutions', 'Pengembangan website apcoms solutions menggunakan laravel, tailwind css, dan membuat api untuk backend, serta pengembangan untuk seo, dan sitemap yang baik', 'http://dev.apcoms.co.id/images/logo.png', 'https://i.imgur.com/IIgdNZy.png', 'Laravel, Tailwind, API', 'https://apcoms.co.id/', 'https://github.com/ApcomSolutions/Apcoms', 1, 0, '2025-05-03 19:14:39', '2025-05-03 20:29:52'),
(2, 'Anaphygon Server', 'Pengembangan website untuk memudahkan pemantauan server dan akses ke beberapa website untuk kebutuhan pribadi.', 'https://i.imgur.com/32uWAS9.png', '', 'Html5,Css3,JavaScript,Linux Mint', 'https://web.vinmedia.my.id/', '', 1, 3, '2025-05-03 20:36:00', '2025-05-15 15:25:32'),
(3, 'Penerbit Skt', 'Pengembangan website penjualan dan penerbitan buku', 'https://live.staticflickr.com/65535/54521564958_c889872f47_h.jpg', 'https://live.staticflickr.com/65535/54521308596_4d5862189a_h.jpg', 'Laravel, Tailwind, API, PHP, JavaScript', 'https://penerbitskt.apcoms.co.id/', 'https://github.com/ApcomSolutions/PenerbitSkt', 1, 1, '2025-05-15 15:24:24', '2025-05-15 15:25:11'),
(4, 'Virtual Blogs', 'Virtual Blogs adalah aplikasi mobile yang memungkinkan pengguna untuk membaca dan menulis blog dengan mudah melalui smartphone. Dirancang dengan antarmuka yang modern dan intuitif, aplikasi ini memberikan pengalaman blogging yang nyaman di genggaman tangan.\r\n\r\nFitur unggulan:\r\n\r\nBuat, baca, dan kelola blog langsung dari perangkat mobile\r\n\r\nDesain UI yang simpel dan responsif\r\n\r\nTerhubung dengan backend API untuk sinkronisasi data secara real-time\r\n\r\nCocok untuk pengguna yang suka berbagi cerita, opini, atau informasi melalui blog di mana saja dan kapan saja\r\n\r\nVirtual Blogs dikembangkan sebagai bagian dari eksplorasi dalam membangun platform blogging berbasis mobile dengan teknologi modern.\r\n\r\nSaat ini server backend offline', '/uploads/thumbnail-1751523043202-403904653.png', '/uploads/images-1751523043204-807768648.png', 'Android, Kotlin', '', 'https://github.com/DevGuerilla/VirtualBlog-Client', 1, 3, '2025-06-03 14:08:37', '2025-07-03 06:10:43');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `proficiency` int DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `order_index` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `category`, `proficiency`, `icon`, `order_index`, `created_at`, `updated_at`) VALUES
(1, 'Kotlin', 'Backend', 50, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kotlin_Icon.svg/1200px-Kotlin_Icon.svg.png', 0, '2025-05-03 20:28:33', '2025-05-03 20:28:33'),
(2, 'Spring Boot', 'Backend', 40, 'https://imgs.search.brave.com/PDsYeYpj9PoR7JEEwYnPSpBaWH5G9tPRYajJt4C-Yw4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy83/Lzc5L1NwcmluZ19C/b290LnN2Zw', 0, '2025-05-06 14:15:46', '2025-05-06 14:15:46'),
(3, 'Krita', 'Design', 50, 'https://static.cdnlogo.com/logos/k/92/krita.svg', 0, '2025-06-07 13:46:48', '2025-06-07 13:47:05'),
(4, 'Android', 'Mobile', 50, 'https://developer.android.com/static/images/logos/android.svg', 0, '2025-06-07 13:47:59', '2025-06-07 13:49:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(3, 'admin', '$2b$10$NAFetVmXFIZdbrJwgZevEOK8N4UzNyumnAfVuHmcwbM6JGoXgcEbK', '2025-05-03 18:57:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cvs`
--
ALTER TABLE `cvs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `content`
--
ALTER TABLE `content`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cvs`
--
ALTER TABLE `cvs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
