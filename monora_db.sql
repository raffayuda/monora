-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2026 at 02:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monora_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `gradient` varchar(120) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon`, `gradient`, `created_at`, `updated_at`) VALUES
(1, 'Concert', 'IoMusicalNotes', 'linear-gradient(135deg, #6366f1, #4f46e5)', '2026-03-14 04:18:18.881', '2026-03-14 04:18:18.881'),
(2, 'Comedy', 'IoHappy', 'linear-gradient(135deg, #6366f1, #4f46e5)', '2026-03-14 05:06:18.392', '2026-03-14 05:06:18.392'),
(3, 'Sport', 'IoFootball', 'linear-gradient(135deg, #6366f1, #4f46e5)', '2026-03-14 05:06:36.003', '2026-03-14 05:06:36.003');

-- --------------------------------------------------------

--
-- Table structure for table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `event_title` varchar(255) DEFAULT NULL,
  `organizer_name` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_conversations`
--

INSERT INTO `chat_conversations` (`id`, `user_id`, `event_id`, `user_name`, `event_title`, `organizer_name`, `created_at`, `updated_at`) VALUES
(1, 7, 15, 'Japra sugeng', 'Jazz Night Jakarta', 'Budi Entertainment', '2026-03-12 13:18:15.469', '2026-04-20 12:54:40.903');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender` enum('customer','organizer') NOT NULL,
  `message_text` text NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `conversation_id`, `sender`, `message_text`, `created_at`) VALUES
(1, 1, 'customer', 'test', '2026-03-12 13:18:15.539'),
(2, 1, 'organizer', 'ngopi', '2026-04-20 12:54:40.896');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `display_date` varchar(100) DEFAULT NULL,
  `full_date` date DEFAULT NULL,
  `time_range` varchar(50) DEFAULT NULL,
  `venue` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL,
  `status` enum('draft','published','cancelled') NOT NULL DEFAULT 'draft',
  `has_merch` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `slug`, `display_date`, `full_date`, `time_range`, `venue`, `city`, `province`, `address`, `latitude`, `longitude`, `category_id`, `image_url`, `thumbnail_url`, `description`, `artist`, `organizer`, `status`, `has_merch`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'NEON JUNGLE FESTIVAL', 'neon-jungle-festival', 'Sat, Oct 26 | 8 PM', '2026-10-26', '8:00 PM - 2:00 AM', 'Gelora Bung Karno Stadium', 'Jakarta', 'DKI Jakarta', 'Jl. Pintu Satu Senayan, Jakarta Pusat', -6.2183000, 106.8023000, NULL, 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop', 'Experience the ultimate neon-lit jungle festival with world-class DJs, stunning visual projections, and an atmosphere that will transport you to another dimension.', 'Various Artists', 'NEON Events Co.', 'published', 1, 1, '2026-03-12 13:05:34.923', '2026-03-12 13:05:34.923'),
(2, 'LUNA\'S WORLD TOUR', 'lunas-world-tour', 'Sat, Nov 2 | 8 PM', '2026-11-02', '8:00 PM - 11:00 PM', 'Istora Senayan', 'Jakarta', 'DKI Jakarta', 'Jl. Pintu Satu Senayan, Jakarta Pusat', -6.2244000, 106.8008000, NULL, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 'Luna brings her electrifying World Tour! New tracks from platinum album \'Midnight Dreams\' and fan favorites.', 'Luna', 'Live Nation', 'published', 1, 1, '2026-03-12 13:05:35.038', '2026-03-12 13:05:35.038'),
(3, 'ELECTRIC DREAMS FESTIVAL', 'electric-dreams-festival', 'Fri, Nov 8 | 6 PM', '2026-11-08', '6:00 PM - 1:00 AM', 'Trans Studio Bandung', 'Bandung', 'Jawa Barat', 'Jl. Gatot Subroto No.289, Bandung', -6.9261000, 107.6345000, NULL, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&fit=crop', 'Electric Dreams takes over for one epic night of electronic music, art installations, and pure euphoria.', 'Various Artists', 'Electric Dreams LLC', 'published', 0, 1, '2026-03-12 13:05:35.083', '2026-03-12 13:05:35.083'),
(4, 'COMEDY NIGHT LIVE', 'comedy-night-live', 'Sat, Nov 9 | 7 PM', '2026-11-09', '7:00 PM - 10:00 PM', 'Balai Sarbini', 'Jakarta', 'DKI Jakarta', 'Jl. Jend. Sudirman, Jakarta', -6.2267000, 106.8071000, NULL, 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop', 'A hilarious evening of stand-up comedy featuring top comedians.', 'Various Comedians', 'LOL Productions', 'published', 0, 1, '2026-03-12 13:05:35.105', '2026-03-12 13:05:35.105'),
(5, 'BALI SUNSET MUSIC FESTIVAL', 'bali-sunset-music-festival', 'Sat, Nov 15 | 4 PM', '2026-11-15', '4:00 PM - 12:00 AM', 'Potato Head Beach Club', 'Denpasar', 'Bali', 'Jl. Petitenget, Seminyak, Bali', -8.6837000, 115.1554000, NULL, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', 'Experience magical sunset beats on the beautiful shores of Bali.', 'Various Artists', 'Bali Events', 'published', 1, 1, '2026-03-12 13:05:35.116', '2026-03-12 13:05:35.116'),
(6, 'SURABAYA ROCK REVOLUTION', 'surabaya-rock-revolution', 'Sun, Nov 16 | 7 PM', '2026-11-16', '7:00 PM - 11:00 PM', 'Gelora Bung Tomo', 'Surabaya', 'Jawa Timur', 'Jl. Jajar Tunggal, Surabaya', -7.3043000, 112.6736000, NULL, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', 'Rock revolution featuring Indonesia best rock bands.', 'Various Rock Bands', 'Surabaya Rock', 'published', 0, 1, '2026-03-12 13:05:35.148', '2026-03-12 13:05:35.148'),
(7, 'JOGJA ART & MUSIC FEST', 'jogja-art-music-fest', 'Fri, Nov 17 | 5 PM', '2026-11-17', '5:00 PM - 11:00 PM', 'Candi Prambanan', 'Yogyakarta', 'DI Yogyakarta', 'Jl. Raya Solo - Yogyakarta', -7.7520000, 110.4915000, NULL, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop', 'Art and music festival at the iconic Prambanan Temple complex.', 'Various Artists', 'Jogja Culture', 'published', 1, 1, '2026-03-12 13:05:35.156', '2026-03-12 13:05:35.156'),
(8, 'MAKASSAR SPORTS EXPO', 'makassar-sports-expo', 'Sat, Nov 17 | 9 AM', '2026-11-17', '9:00 AM - 6:00 PM', 'Celebes Convention Center', 'Makassar', 'Sulawesi Selatan', 'Jl. Metro Tanjung Bunga, Makassar', -5.1500000, 119.4200000, NULL, 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfdb?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfdb?w=400&h=300&fit=crop', 'Annual sports expo with exhibitions, talks, and athlete meet & greets.', 'Various Athletes', 'Sports Indonesia', 'published', 1, 1, '2026-03-12 13:05:35.182', '2026-03-12 13:05:35.182'),
(9, 'NBA FINALS WATCH PARTY', 'nba-finals-watch-party', 'Mon, Nov 18 | 6 PM', '2026-11-18', '6:00 PM - 11:00 PM', 'Stadion Manahan', 'Solo', 'Jawa Tengah', 'Jl. Adi Sucipto, Manahan, Solo', -7.5558000, 110.8069000, NULL, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', 'Watch the NBA Finals on a massive 40-foot screen with fellow fans!', 'NBA Finals', 'Sports Bar Arena', 'published', 0, 1, '2026-03-12 13:05:35.203', '2026-03-12 13:05:35.203'),
(10, 'MEDAN MUSIC MARATHON', 'medan-music-marathon', 'Fri, Nov 22 | 5 PM', '2026-11-22', '5:00 PM - 11:00 PM', 'Lapangan Merdeka', 'Medan', 'Sumatera Utara', 'Jl. Balai Kota, Medan', 3.5952000, 98.6722000, NULL, 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop', 'Full-day music marathon in Medan featuring local and national acts.', 'Various Artists', 'Medan Musik Foundation', 'published', 0, 1, '2026-03-12 13:05:35.226', '2026-03-12 13:05:35.226'),
(11, 'PALEMBANG JAZZ FEST', 'palembang-jazz-fest', 'Sat, Nov 23 | 7 PM', '2026-11-23', '7:00 PM - 11:00 PM', 'Benteng Kuto Besak', 'Palembang', 'Sumatera Selatan', 'Jl. Sultan Mahmud Badaruddin, Palembang', -2.9916000, 104.7636000, NULL, 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&fit=crop', 'Enchanting jazz evening at the historic Benteng Kuto Besak.', 'Indonesian Jazz Stars', 'Palembang Arts Council', 'published', 0, 1, '2026-03-12 13:05:35.239', '2026-03-12 13:05:35.239'),
(12, 'MANADO CULTURAL FEST', 'manado-cultural-fest', 'Sun, Nov 24 | 3 PM', '2026-11-24', '3:00 PM - 10:00 PM', 'Mega Mall Manado', 'Manado', 'Sulawesi Utara', 'Jl. Piere Tendean, Manado', 1.4874000, 124.8455000, NULL, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', 'Celebrate the rich culture of North Sulawesi with traditional dance and music.', 'Various Artists', 'Manado Cultural Board', 'published', 0, 1, '2026-03-12 13:05:35.247', '2026-03-12 13:05:35.247'),
(13, 'BALIKPAPAN BEATS', 'balikpapan-beats', 'Sat, Nov 29 | 7 PM', '2026-11-29', '7:00 PM - 12:00 AM', 'Dome Balikpapan', 'Balikpapan', 'Kalimantan Timur', 'Jl. Jend. Sudirman, Balikpapan', -1.2379000, 116.8529000, NULL, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop', 'Balikpapan biggest music night featuring EDM, hip-hop, and pop.', 'Various Artists', 'Borneo Events', 'published', 1, 1, '2026-03-12 13:05:35.264', '2026-03-12 13:05:35.264'),
(14, 'Rock Fest Bandung 2026', 'rock-fest-bandung-2026', 'Sat, Apr 18 | 7 PM', '2026-04-18', '7:00 PM - 11:30 PM', 'Lapangan Gasibu', 'Bandung', 'Papua', 'Jl. Diponegoro, Bandung', -4.1744180, 139.1476380, NULL, 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', 'Festival rock terbesar di Bandung! Band-band rock legendaris Indonesia dan internasional.', 'Various Rock Bands', 'Budi Entertainment', 'published', 1, 2, '2026-03-12 13:05:35.288', '2026-03-14 04:19:49.171'),
(15, 'Jazz Night Jakarta', 'jazz-night-jakarta', 'Sat, Mar 14 | 8:00 PM', '2026-03-14', '8:00 PM - 12:00 AM', 'Jakarta Convention Center', 'Jakarta', 'DKI Jakarta', 'Jl. Gatot Subroto, Jakarta Selatan', 3.4735560, 116.4629140, NULL, 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop', 'Malam jazz eksklusif dengan musisi jazz terbaik Indonesia.', 'Tompi, Indra Lesmana, Monita Tahalea', 'Budi Entertainment', 'published', 0, 2, '2026-03-12 13:05:35.329', '2026-03-14 03:38:24.357'),
(16, 'Budi Comedy Show', 'budi-comedy-show', 'Sun, Jun 15 | 7 PM', '2026-06-15', '7:00 PM - 10:00 PM', 'Balai Kartini', 'Jakarta', 'DKI Jakarta', 'Jl. Gatot Subroto Kav. 37, Jakarta', -6.2297000, 106.8174000, NULL, 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&h=300&fit=crop', 'Malam penuh tawa bersama komika-komika terbaik tanah air.', 'Raditya Dika, Pandji, Cak Lontong', 'Budi Entertainment', 'draft', 0, 2, '2026-03-12 13:05:35.357', '2026-03-12 13:05:35.357'),
(17, 'EDM Beach Party Bali update', 'edm-beach-party-bali-update', 'Sat, Jul 25 | 4 PM', '2026-07-25', '4:00 PM - 2:00 AM', 'Potato Head Beach Club', 'Denpasar', 'Bali', 'Jl. Petitenget, Seminyak, Bali', -2.9882590, 131.4845830, NULL, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop', 'Beach party EDM terbesar di Bali! DJ internasional dan sunset vibes.', 'DJ Snake, Marshmello (Guest)', 'Sari Productions', 'published', 1, 3, '2026-03-12 13:05:35.384', '2026-03-12 13:13:18.488'),
(18, 'Surabaya Art Exhibition', 'surabaya-art-exhibition', 'Fri, Aug 8 | 10 AM', '2026-08-08', '10:00 AM - 9:00 PM', 'House of Sampoerna', 'Surabaya', 'Jawa Timur', 'Jl. Taman Sampoerna No.6, Surabaya', -7.2347000, 112.7373000, NULL, 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=300&fit=crop', 'Pameran seni kontemporer terbesar di Jawa Timur. 50+ seniman.', 'Various Artists', 'Sari Productions', 'published', 0, 3, '2026-03-12 13:05:35.440', '2026-03-12 13:05:35.440'),
(19, 'Yogyakarta Food Festival', 'yogyakarta-food-festival', 'Sat, Sep 20 | 11 AM', '2026-09-20', '11:00 AM - 10:00 PM', 'Alun-Alun Kidul', 'Yogyakarta', 'DI Yogyakarta', 'Alun-Alun Kidul, Yogyakarta', -7.8107000, 110.3621000, NULL, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', 'Festival kuliner terbesar di Yogyakarta! 100+ booth makanan.', 'Chef Juna, Chef Arnold', 'Sari Productions', 'cancelled', 0, 3, '2026-03-12 13:05:35.463', '2026-03-12 13:05:35.463');

-- --------------------------------------------------------

--
-- Table structure for table `event_discounts`
--

CREATE TABLE `event_discounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `starts_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_discounts`
--

INSERT INTO `event_discounts` (`id`, `event_id`, `percentage`, `label`, `starts_at`, `expires_at`, `is_active`, `created_at`) VALUES
(1, 1, 15.00, 'Early Bird Sale', NULL, NULL, 1, '2026-03-12 13:05:35.031'),
(2, 3, 20.00, 'Flash Sale', NULL, NULL, 1, '2026-03-12 13:05:35.098'),
(3, 5, 10.00, 'Limited Offer', NULL, NULL, 1, '2026-03-12 13:05:35.144'),
(4, 8, 25.00, 'Weekend Deal', NULL, NULL, 1, '2026-03-12 13:05:35.197'),
(5, 12, 30.00, 'Special Promo', NULL, NULL, 1, '2026-03-12 13:05:35.261');

-- --------------------------------------------------------

--
-- Table structure for table `event_tags`
--

CREATE TABLE `event_tags` (
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_tags`
--

INSERT INTO `event_tags` (`event_id`, `tag_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 2),
(5, 2),
(7, 2),
(9, 2),
(10, 2),
(12, 2),
(13, 1),
(14, 2),
(14, 3),
(15, 4),
(15, 5),
(16, 6),
(16, 7),
(17, 2),
(17, 8),
(17, 9),
(18, 10),
(18, 11),
(19, 12),
(19, 13);

-- --------------------------------------------------------

--
-- Table structure for table `merchandise`
--

CREATE TABLE `merchandise` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `image_url` varchar(500) DEFAULT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `merchandise`
--

INSERT INTO `merchandise` (`id`, `event_id`, `name`, `price`, `image_url`, `stock`, `created_at`) VALUES
(1, 1, 'Neon Jungle T-Shirt', 35.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', 200, '2026-03-12 13:05:34.980'),
(2, 1, 'Festival Hoodie', 65.00, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop', 100, '2026-03-12 13:05:35.009'),
(3, 1, 'LED Wristband', 15.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop', 500, '2026-03-12 13:05:35.020'),
(4, 1, 'Event Poster', 20.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop', 300, '2026-03-12 13:05:35.026'),
(5, 2, 'Luna World Tour T-Shirt', 40.00, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop', 500, '2026-03-12 13:05:35.056'),
(6, 2, 'Luna Album Vinyl', 30.00, 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=300&h=300&fit=crop', 200, '2026-03-12 13:05:35.069'),
(7, 2, 'Glow Stick Pack (5)', 12.00, 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop', 1000, '2026-03-12 13:05:35.073'),
(8, 5, 'Bali Sunset Tee', 30.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', 200, '2026-03-12 13:05:35.133'),
(9, 7, 'Jogja Fest T-Shirt', 28.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', 200, '2026-03-12 13:05:35.170'),
(10, 8, 'Sports Expo Cap', 18.00, 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=300&h=300&fit=crop', 300, '2026-03-12 13:05:35.189'),
(11, 13, 'Balikpapan Beats Tee', 30.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', 200, '2026-03-12 13:05:35.278'),
(15, 17, 'Beach Party Tank Top', 100000.00, 'https://images.unsplash.com/photo-1503341504253-dff4855f4454?w=300&h=300&fit=crop', 300, '2026-03-12 13:13:18.646'),
(16, 17, 'LED Sunglasses', 50000.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', 500, '2026-03-12 13:13:18.667'),
(17, 14, 'Rock Fest T-Shirt', 120000.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', 200, '2026-03-14 04:19:49.287');

-- --------------------------------------------------------

--
-- Table structure for table `merchandise_colors`
--

CREATE TABLE `merchandise_colors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `merch_id` bigint(20) UNSIGNED NOT NULL,
  `color_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `merchandise_colors`
--

INSERT INTO `merchandise_colors` (`id`, `merch_id`, `color_name`) VALUES
(1, 1, 'Black'),
(2, 1, 'White'),
(3, 2, 'Black'),
(4, 3, 'Multi'),
(5, 5, 'Black'),
(6, 5, 'Purple'),
(7, 7, 'Multi'),
(8, 8, 'White'),
(9, 8, 'Blue'),
(10, 9, 'Black'),
(11, 9, 'White'),
(12, 10, 'Black'),
(13, 10, 'Red'),
(14, 11, 'Black'),
(15, 11, 'White'),
(20, 15, 'White'),
(21, 15, 'Neon Green'),
(22, 16, 'Multi'),
(23, 17, 'Black');

-- --------------------------------------------------------

--
-- Table structure for table `merchandise_sizes`
--

CREATE TABLE `merchandise_sizes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `merch_id` bigint(20) UNSIGNED NOT NULL,
  `size_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `merchandise_sizes`
--

INSERT INTO `merchandise_sizes` (`id`, `merch_id`, `size_name`) VALUES
(1, 1, 'S'),
(2, 1, 'M'),
(3, 1, 'L'),
(4, 1, 'XL'),
(5, 2, 'S'),
(6, 2, 'M'),
(7, 2, 'L'),
(8, 2, 'XL'),
(9, 5, 'S'),
(10, 5, 'M'),
(11, 5, 'L'),
(12, 5, 'XL'),
(13, 8, 'S'),
(14, 8, 'M'),
(15, 8, 'L'),
(16, 8, 'XL'),
(17, 9, 'S'),
(18, 9, 'M'),
(19, 9, 'L'),
(20, 9, 'XL'),
(21, 11, 'S'),
(22, 11, 'M'),
(23, 11, 'L'),
(24, 11, 'XL'),
(32, 15, 'S'),
(33, 15, 'M'),
(34, 15, 'L'),
(35, 17, 'S'),
(36, 17, 'M'),
(37, 17, 'L'),
(38, 17, 'XL');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_code` varchar(30) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','confirmed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `subtotal` decimal(14,2) NOT NULL DEFAULT 0.00,
  `voucher_code` varchar(50) DEFAULT NULL,
  `voucher_discount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `service_fee` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total` decimal(14,2) NOT NULL DEFAULT 0.00,
  `delivery_method` enum('pickup','delivery') DEFAULT NULL,
  `delivery_address` varchar(500) DEFAULT NULL,
  `delivery_city` varchar(100) DEFAULT NULL,
  `delivery_zip` varchar(20) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `user_id`, `status`, `subtotal`, `voucher_code`, `voucher_discount`, `service_fee`, `total`, `delivery_method`, `delivery_address`, `delivery_city`, `delivery_zip`, `customer_name`, `customer_email`, `customer_phone`, `created_at`, `updated_at`) VALUES
(1, 'ORD-SEED-001', 4, 'confirmed', 500000.00, NULL, 0.00, 0.00, 500000.00, NULL, NULL, NULL, NULL, 'Andi Pratama', 'andi@gmail.com', NULL, '2026-03-12 13:05:35.493', '2026-03-12 13:05:35.493'),
(2, 'ORD-SEED-002', 5, 'confirmed', 750000.00, NULL, 0.00, 0.00, 750000.00, NULL, NULL, NULL, NULL, 'Maya Putri', 'maya@gmail.com', NULL, '2026-03-12 13:05:35.514', '2026-03-12 13:05:35.514'),
(3, 'ORD-SEED-003', 6, 'confirmed', 1000000.00, NULL, 0.00, 0.00, 1000000.00, NULL, NULL, NULL, NULL, 'Rizky Hidayat', 'rizky@gmail.com', NULL, '2026-03-12 13:05:35.527', '2026-03-12 13:05:35.527'),
(4, 'ORD-SEED-004', 5, 'confirmed', 550000.00, NULL, 0.00, 0.00, 550000.00, NULL, NULL, NULL, NULL, 'Maya Putri', 'maya@gmail.com', NULL, '2026-03-12 13:05:35.536', '2026-03-12 13:05:35.536'),
(5, 'ORD-SEED-005', 6, 'confirmed', 1500000.00, NULL, 0.00, 0.00, 1500000.00, NULL, NULL, NULL, NULL, 'Rizky Hidayat', 'rizky@gmail.com', NULL, '2026-03-12 13:05:35.550', '2026-03-12 13:05:35.550'),
(6, 'ORD-SEED-006', 4, 'confirmed', 275000.00, NULL, 0.00, 0.00, 275000.00, NULL, NULL, NULL, NULL, 'Andi Pratama', 'andi@gmail.com', NULL, '2026-03-12 13:05:35.557', '2026-03-12 13:05:35.557'),
(7, 'ORD-1773458610240', 2, 'refunded', 270000.00, 'BUDIMAN', 54000.00, 10800.00, 226800.00, 'pickup', NULL, NULL, NULL, 'Budi Santoso', 'budi@monora.com', '081298765432', '2026-03-14 03:23:30.244', '2026-03-14 04:26:53.034'),
(8, 'ORD-1773459092643', 2, 'confirmed', 250000.00, NULL, 0.00, 12500.00, 262500.00, NULL, NULL, NULL, NULL, 'Budi Santoso', 'budi@monora.com', '081298765432', '2026-03-14 03:31:32.646', '2026-03-14 03:31:32.646'),
(9, 'ORD-1773464640808', 2, 'refunded', 250000.00, NULL, 0.00, 12500.00, 262500.00, NULL, NULL, NULL, NULL, 'Budi Santoso', 'budi@monora.com', '081298765432', '2026-03-14 05:04:00.812', '2026-03-14 05:04:59.845'),
(10, 'ORD-1774935239116', 2, 'confirmed', 470000.00, NULL, 0.00, 23500.00, 493500.00, 'pickup', NULL, NULL, NULL, 'Budi Santoso', 'budi@monora.com', '081298765432', '2026-03-31 05:33:59.135', '2026-03-31 05:33:59.135'),
(11, 'ORD-1774940748415', 1, 'confirmed', 270000.00, NULL, 0.00, 13500.00, 283500.00, 'pickup', NULL, NULL, NULL, 'Super Admin', 'admin@monora.com', '081234567890', '2026-03-31 07:05:48.417', '2026-03-31 07:05:48.417'),
(12, 'ORD-1776688937992', 1, 'confirmed', 350000.00, NULL, 0.00, 17500.00, 367500.00, NULL, NULL, NULL, NULL, 'Super Admin', 'admin@monora.com', '081234567890', '2026-04-20 12:42:17.995', '2026-04-20 12:42:17.995'),
(13, 'ORD-1776689650485', 1, 'confirmed', 270000.00, NULL, 0.00, 13500.00, 283500.00, 'pickup', NULL, NULL, NULL, 'Super Admin', 'admin@monora.com', '081234567890', '2026-04-20 12:54:10.489', '2026-04-20 12:54:10.489');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `item_type` enum('ticket','merch') NOT NULL,
  `event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ticket_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `merch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `original_price` decimal(12,2) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `event_date` varchar(100) DEFAULT NULL,
  `event_image` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_type`, `event_id`, `ticket_type_id`, `merch_id`, `title`, `quantity`, `unit_price`, `original_price`, `size`, `color`, `event_date`, `event_image`) VALUES
(1, 1, 'ticket', 14, NULL, NULL, 'Regular', 2, 150000.00, NULL, NULL, NULL, NULL, NULL),
(2, 1, 'merch', 14, NULL, NULL, 'Rock Fest T-Shirt', 1, 120000.00, NULL, 'L', 'Black', NULL, NULL),
(3, 2, 'ticket', 14, NULL, NULL, 'VIP', 1, 350000.00, NULL, NULL, NULL, NULL, NULL),
(4, 2, 'ticket', 15, NULL, NULL, 'Standard', 1, 250000.00, NULL, NULL, NULL, NULL, NULL),
(5, 3, 'ticket', 15, NULL, NULL, 'Premium', 2, 500000.00, NULL, NULL, NULL, NULL, NULL),
(6, 4, 'ticket', 17, NULL, NULL, 'Early Bird', 2, 200000.00, NULL, NULL, NULL, NULL, NULL),
(7, 4, 'merch', 17, NULL, NULL, 'Beach Party Tank Top', 1, 100000.00, NULL, 'M', 'White', NULL, NULL),
(8, 5, 'ticket', 17, NULL, NULL, 'VIP Cabana', 1, 1500000.00, NULL, NULL, NULL, NULL, NULL),
(9, 6, 'ticket', 18, 39, NULL, 'Day Pass', 1, 75000.00, NULL, NULL, NULL, NULL, NULL),
(10, 6, 'ticket', 18, 40, NULL, 'VIP Tour', 1, 200000.00, NULL, NULL, NULL, NULL, NULL),
(11, 7, 'ticket', 14, NULL, NULL, 'Regular', 1, 150000.00, NULL, NULL, NULL, 'Sat, Apr 18 | 7 PM', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'),
(12, 7, 'merch', 14, NULL, NULL, 'Rock Fest T-Shirt', 1, 120000.00, NULL, 'M', 'Black', NULL, NULL),
(13, 8, 'ticket', 15, NULL, NULL, 'Standard', 1, 250000.00, NULL, NULL, NULL, 'Fri, May 9 | 8 PM', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop'),
(14, 9, 'ticket', 15, NULL, NULL, 'Standard', 1, 250000.00, NULL, NULL, NULL, 'Sat, Mar 14 | 8:00 PM', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop'),
(15, 10, 'ticket', 14, NULL, NULL, 'VIP', 1, 350000.00, NULL, NULL, NULL, 'Sat, Apr 18 | 7 PM', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'),
(16, 10, 'merch', 14, NULL, NULL, 'Rock Fest T-Shirt', 1, 120000.00, NULL, 'L', 'Black', NULL, NULL),
(17, 11, 'ticket', 14, NULL, NULL, 'Regular', 1, 150000.00, NULL, NULL, NULL, 'Sat, Apr 18 | 7 PM', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'),
(18, 11, 'merch', 14, NULL, NULL, 'Rock Fest T-Shirt', 1, 120000.00, NULL, 'L', 'Black', NULL, NULL),
(19, 12, 'ticket', 14, NULL, NULL, 'VIP', 1, 350000.00, NULL, NULL, NULL, 'Sat, Apr 18 | 7 PM', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'),
(20, 13, 'ticket', 14, NULL, NULL, 'Regular', 1, 150000.00, NULL, NULL, NULL, 'Sat, Apr 18 | 7 PM', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop'),
(21, 13, 'merch', 14, NULL, NULL, 'Rock Fest T-Shirt', 1, 120000.00, NULL, 'M', 'Black', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `refund_code` varchar(30) NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `requested_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `processed_at` datetime(3) DEFAULT NULL,
  `event_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_item_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refunds`
--

INSERT INTO `refunds` (`id`, `refund_code`, `order_id`, `user_id`, `reason`, `status`, `requested_at`, `processed_at`, `event_id`, `order_item_id`) VALUES
(1, 'REF-1773462374955', 7, 2, 'gk jadi', 'approved', '2026-03-14 04:26:14.958', '2026-03-14 04:26:52.987', NULL, NULL),
(2, 'REF-1773464681849', 9, 2, 'test', 'approved', '2026-03-14 05:04:41.851', '2026-03-14 05:04:59.776', 15, 14);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(10, 'Art'),
(9, 'Beach'),
(14, 'boday'),
(6, 'Comedy'),
(8, 'EDM'),
(11, 'Exhibition'),
(13, 'Family'),
(12, 'Food'),
(16, 'gas'),
(15, 'hayu'),
(4, 'Jazz'),
(7, 'New'),
(2, 'Popular'),
(5, 'Premium'),
(3, 'Rock'),
(1, 'Selling Fast');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_types`
--

CREATE TABLE `ticket_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `description` varchar(500) DEFAULT NULL,
  `available` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ticket_types`
--

INSERT INTO `ticket_types` (`id`, `event_id`, `type_name`, `price`, `description`, `available`, `created_at`) VALUES
(1, 1, 'General Admission', 89.00, 'Access to main festival grounds', 450, '2026-03-12 13:05:34.970'),
(2, 1, 'VIP', 199.00, 'VIP lounge access, free drinks, priority entry', 80, '2026-03-12 13:05:34.970'),
(3, 1, 'Premium VIP', 349.00, 'Backstage meet & greet, premium open bar, front row', 20, '2026-03-12 13:05:34.970'),
(4, 2, 'Standard', 120.00, 'Upper bowl seating', 800, '2026-03-12 13:05:35.053'),
(5, 2, 'Floor', 220.00, 'Floor standing, close to stage', 300, '2026-03-12 13:05:35.053'),
(6, 2, 'VIP Package', 450.00, 'Meet & greet, signed poster, premium seating', 50, '2026-03-12 13:05:35.053'),
(7, 3, 'Early Bird', 65.00, 'Limited early bird pricing', 100, '2026-03-12 13:05:35.093'),
(8, 3, 'General Admission', 85.00, 'Full festival access', 600, '2026-03-12 13:05:35.093'),
(9, 3, 'VIP', 180.00, 'VIP area, complimentary bar', 120, '2026-03-12 13:05:35.093'),
(10, 4, 'Standard', 45.00, 'General seating', 300, '2026-03-12 13:05:35.111'),
(11, 4, 'Premium', 89.00, 'Front rows with drinks', 50, '2026-03-12 13:05:35.111'),
(12, 5, 'General', 75.00, 'Beach access', 500, '2026-03-12 13:05:35.129'),
(13, 5, 'VIP', 150.00, 'VIP cabana area', 100, '2026-03-12 13:05:35.129'),
(14, 6, 'General', 55.00, 'Standing area', 600, '2026-03-12 13:05:35.152'),
(15, 6, 'VIP', 120.00, 'VIP area with seating', 100, '2026-03-12 13:05:35.152'),
(16, 7, 'General', 60.00, 'Festival grounds access', 400, '2026-03-12 13:05:35.167'),
(17, 7, 'VIP', 150.00, 'Premium area + art tour', 80, '2026-03-12 13:05:35.167'),
(18, 8, 'Day Pass', 25.00, 'Full day access', 1000, '2026-03-12 13:05:35.186'),
(19, 8, 'VIP', 75.00, 'Meet athletes + exclusive zone', 100, '2026-03-12 13:05:35.186'),
(20, 9, 'General', 30.00, 'Standing area access', 500, '2026-03-12 13:05:35.223'),
(21, 9, 'Seated', 55.00, 'Reserved table seating', 100, '2026-03-12 13:05:35.223'),
(22, 10, 'General', 50.00, 'General admission', 600, '2026-03-12 13:05:35.236'),
(23, 10, 'VIP', 120.00, 'VIP lounge and priority area', 100, '2026-03-12 13:05:35.236'),
(24, 11, 'General', 40.00, 'Open area', 300, '2026-03-12 13:05:35.243'),
(25, 11, 'VIP', 90.00, 'Front row and drinks', 60, '2026-03-12 13:05:35.243'),
(26, 12, 'General', 35.00, 'Festival access', 400, '2026-03-12 13:05:35.258'),
(27, 13, 'General', 55.00, 'General admission', 500, '2026-03-12 13:05:35.275'),
(28, 13, 'VIP', 130.00, 'VIP lounge with drinks', 80, '2026-03-12 13:05:35.275'),
(34, 16, 'Regular', 100000.00, 'General seating', 400, '2026-03-12 13:05:35.380'),
(35, 16, 'VIP', 250000.00, 'Front 3 rows + photo op', 50, '2026-03-12 13:05:35.380'),
(39, 18, 'Day Pass', 75000.00, 'Full day access', 1000, '2026-03-12 13:05:35.458'),
(40, 18, 'VIP Tour', 200000.00, 'Guided tour + artist meet', 50, '2026-03-12 13:05:35.458'),
(41, 19, 'General', 50000.00, 'Festival entry', 2000, '2026-03-12 13:05:35.480'),
(42, 17, 'Early Bird', 200000.00, 'Limited early bird', 200, '2026-03-12 13:13:18.629'),
(43, 17, 'Regular', 350000.00, 'General access', 600, '2026-03-12 13:13:18.629'),
(44, 17, 'VIP Cabana', 1500000.00, 'Private cabana for 4', 20, '2026-03-12 13:13:18.629'),
(45, 15, 'Standard', 250000.00, 'Seating area', 300, '2026-03-14 03:38:24.531'),
(46, 15, 'Premium', 500000.00, 'Front row + dinner', 80, '2026-03-14 03:38:24.531'),
(47, 14, 'Regular', 150000.00, 'Akses area festival', 500, '2026-03-14 04:19:49.270'),
(48, 14, 'VIP', 350000.00, 'Area VIP + free drinks', 100, '2026-03-14 04:19:49.270'),
(49, 14, 'VVIP', 750000.00, 'Meet & greet + backstage', 30, '2026-03-14 04:19:49.270');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('customer','event_admin','app_admin') NOT NULL DEFAULT 'customer',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@monora.com', '$2b$10$a6mFn72vvxvsoc1MqGIbEefFJiEkvhScHYMmsifyVm38YqfHazjOO', '081234567890', 'app_admin', 1, '2026-03-12 13:05:34.335', '2026-03-12 13:05:34.335'),
(2, 'Budi Santoso', 'budi@monora.com', '$2b$10$QMgnvKaMEjGbEXM2oFOAFe2bB2So4WsSnSQbUrMtmOBczNT.49xxm', '081298765432', 'event_admin', 1, '2026-03-12 13:05:34.492', '2026-03-12 13:05:34.492'),
(3, 'Sari Dewi', 'sari@monora.com', '$2b$10$dr5TgbxaiPxg1nHr7Po9z.xeSofnGsTjQ5cy5pT57yoPPOGxwpPea', '087712345678', 'event_admin', 1, '2026-03-12 13:05:34.601', '2026-03-12 13:05:34.601'),
(4, 'Andi Pratama', 'andi@gmail.com', '$2b$10$2/OloLPGzULyAszbGNSGTOM7w3O86MKp2ybOPJImZv3g1KvgL5pXi', '085611223344', 'customer', 1, '2026-03-12 13:05:34.700', '2026-03-12 13:05:34.700'),
(5, 'Maya Putri', 'maya@gmail.com', '$2b$10$oi3jTKx3yYYi729jm/tZ6.rXFQMvU2SDAtOLznGoMVq5luSgemEle', '089922334455', 'customer', 1, '2026-03-12 13:05:34.805', '2026-03-12 13:05:34.805'),
(6, 'Rizky Hidayat', 'rizky@gmail.com', '$2b$10$6olJNWhc8nyGiAX1Mqu/FOu5Uj2u/QNbuA/mojX834tHqnUyhLTFO', '081355667788', 'customer', 1, '2026-03-12 13:05:34.903', '2026-03-12 13:05:34.903'),
(7, 'Japra sugeng', 'sugengjapra71@gmail.com', '$2b$10$u6HbTvdYw98xW8l52o2ZP.FljfRglaknBPOz5g/kp.mScrDCh6TnS', '08889222727', 'event_admin', 1, '2026-03-12 13:08:19.510', '2026-03-12 13:08:19.510');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `type` enum('percentage','flat') NOT NULL DEFAULT 'percentage',
  `value` decimal(12,2) NOT NULL DEFAULT 0.00,
  `min_purchase` decimal(12,2) NOT NULL DEFAULT 0.00,
  `max_uses` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `used_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `expires_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `event_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `type`, `value`, `min_purchase`, `max_uses`, `used_count`, `description`, `is_active`, `expires_at`, `created_at`, `event_id`) VALUES
(1, 'BUDIMAN', 'percentage', 20.00, 1.00, 2, 1, 'Discount up to 20%', 1, NULL, '2026-03-14 03:22:13.934', NULL),
(2, 'TEST', 'percentage', 50.00, 1.00, 5, 0, 'gokil', 1, NULL, '2026-03-14 04:13:16.998', 15);

-- --------------------------------------------------------

--
-- Table structure for table `voucher_usages`
--

CREATE TABLE `voucher_usages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `voucher_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `discount_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `used_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_key` (`name`);

--
-- Indexes for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_chat_user_event` (`user_id`,`event_id`),
  ADD KEY `idx_chat_user` (`user_id`),
  ADD KEY `idx_chat_event` (`event_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cm_conv` (`conversation_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `events_slug_key` (`slug`),
  ADD KEY `idx_events_slug` (`slug`),
  ADD KEY `idx_events_category` (`category_id`),
  ADD KEY `idx_events_status` (`status`),
  ADD KEY `idx_events_full_date` (`full_date`),
  ADD KEY `idx_events_city` (`city`),
  ADD KEY `idx_events_created_by` (`created_by`);

--
-- Indexes for table `event_discounts`
--
ALTER TABLE `event_discounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ed_event` (`event_id`);

--
-- Indexes for table `event_tags`
--
ALTER TABLE `event_tags`
  ADD PRIMARY KEY (`event_id`,`tag_id`),
  ADD KEY `event_tags_tag_id_fkey` (`tag_id`);

--
-- Indexes for table `merchandise`
--
ALTER TABLE `merchandise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_merch_event` (`event_id`);

--
-- Indexes for table `merchandise_colors`
--
ALTER TABLE `merchandise_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `merchandise_colors_merch_id_fkey` (`merch_id`);

--
-- Indexes for table `merchandise_sizes`
--
ALTER TABLE `merchandise_sizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `merchandise_sizes_merch_id_fkey` (`merch_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_code_key` (`order_code`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_code` (`order_code`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_oi_order` (`order_id`),
  ADD KEY `idx_oi_event` (`event_id`),
  ADD KEY `order_items_ticket_type_id_fkey` (`ticket_type_id`),
  ADD KEY `order_items_merch_id_fkey` (`merch_id`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refunds_refund_code_key` (`refund_code`),
  ADD KEY `idx_refund_order` (`order_id`),
  ADD KEY `idx_refund_user` (`user_id`),
  ADD KEY `idx_refund_status` (`status`),
  ADD KEY `idx_refund_order_item` (`order_item_id`),
  ADD KEY `idx_refund_event` (`event_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_name_key` (`name`);

--
-- Indexes for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tt_event` (`event_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vouchers_code_key` (`code`),
  ADD KEY `idx_voucher_code` (`code`),
  ADD KEY `idx_voucher_event` (`event_id`);

--
-- Indexes for table `voucher_usages`
--
ALTER TABLE `voucher_usages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vu_voucher` (`voucher_id`),
  ADD KEY `idx_vu_order` (`order_id`),
  ADD KEY `idx_vu_user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `event_discounts`
--
ALTER TABLE `event_discounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `merchandise`
--
ALTER TABLE `merchandise`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `merchandise_colors`
--
ALTER TABLE `merchandise_colors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `merchandise_sizes`
--
ALTER TABLE `merchandise_sizes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ticket_types`
--
ALTER TABLE `ticket_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `voucher_usages`
--
ALTER TABLE `voucher_usages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD CONSTRAINT `chat_conversations_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chat_conversations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `events_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_discounts`
--
ALTER TABLE `event_discounts`
  ADD CONSTRAINT `event_discounts_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_tags`
--
ALTER TABLE `event_tags`
  ADD CONSTRAINT `event_tags_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `merchandise`
--
ALTER TABLE `merchandise`
  ADD CONSTRAINT `merchandise_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `merchandise_colors`
--
ALTER TABLE `merchandise_colors`
  ADD CONSTRAINT `merchandise_colors_merch_id_fkey` FOREIGN KEY (`merch_id`) REFERENCES `merchandise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `merchandise_sizes`
--
ALTER TABLE `merchandise_sizes`
  ADD CONSTRAINT `merchandise_sizes_merch_id_fkey` FOREIGN KEY (`merch_id`) REFERENCES `merchandise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_merch_id_fkey` FOREIGN KEY (`merch_id`) REFERENCES `merchandise` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ticket_type_id_fkey` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `refunds_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `refunds_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `refunds_order_item_id_fkey` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `refunds_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket_types`
--
ALTER TABLE `ticket_types`
  ADD CONSTRAINT `ticket_types_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `vouchers_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `voucher_usages`
--
ALTER TABLE `voucher_usages`
  ADD CONSTRAINT `voucher_usages_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `voucher_usages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `voucher_usages_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
