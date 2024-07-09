-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: 127.0.0.1
-- 生成日時: 2024-07-09 06:35:36
-- サーバのバージョン： 10.4.32-MariaDB
-- PHP のバージョン: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `inventory_db2`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `inventories`
--

CREATE TABLE `inventories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `inventories`
--

INSERT INTO `inventories` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 1, '食品', '2024-07-08 06:10:16', '2024-07-08 06:10:16'),
(2, 1, '日用品', '2024-07-08 06:10:25', '2024-07-08 06:10:25'),
(3, 1, '雑貨', '2024-07-08 06:10:33', '2024-07-08 06:10:33'),
(5, 2, 'やること', '2024-07-08 06:13:40', '2024-07-08 06:13:40'),
(6, 3, '日用品', '2024-07-08 06:43:55', '2024-07-08 06:43:55'),
(8, 1, 'やること', '2024-07-09 04:23:34', '2024-07-09 04:23:34');

-- --------------------------------------------------------

--
-- テーブルの構造 `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `stock` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `products`
--

INSERT INTO `products` (`id`, `inventory_id`, `name`, `stock`, `active`, `created_at`, `updated_at`) VALUES
(1, 1, '牛肉', 4, 1, '2024-07-08 06:10:43', '2024-07-09 04:23:15'),
(2, 2, 'トイレットペーパー', 4, 1, '2024-07-08 06:10:53', '2024-07-09 04:00:30'),
(3, 2, 'ティッシュ', 2, 1, '2024-07-08 06:10:58', '2024-07-08 06:11:23'),
(4, 3, '化粧水', 5, 1, '2024-07-08 06:11:05', '2024-07-08 07:21:11'),
(5, 5, '出席状況の更新', 1, 1, '2024-07-08 06:14:01', '2024-07-08 06:14:01'),
(7, 1, '鶏肉', 1, 1, '2024-07-09 03:21:18', '2024-07-09 04:22:48'),
(10, 1, '豚肉', 3, 1, '2024-07-09 04:05:32', '2024-07-09 04:06:06'),
(11, 8, '宿題', 1, 1, '2024-07-09 04:23:45', '2024-07-09 04:23:45');

-- --------------------------------------------------------

--
-- テーブルの構造 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'tominaga', '$2b$10$ZuDA9bqVo1RDijU9H9vj3.8k6OMmsBYL4YrUl3k9vTuwtSeBdAom2', '2024-07-08 06:09:48', '2024-07-08 06:09:48'),
(2, 'ひでよ', '$2b$10$gfbExOYgwr5Z1onM/Ci8UORwUw.GILI73L6prFEIgDXZFje2dBQyS', '2024-07-08 06:12:34', '2024-07-08 06:12:34'),
(3, 'asd', '$2b$10$JHIjxwecVtOfcrneB7fckez5V6StRO6KqRN0vXvT9t9RpTlX/GeOC', '2024-07-08 06:43:35', '2024-07-08 06:43:35');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- テーブルのインデックス `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `inventories`
--
ALTER TABLE `inventories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- テーブルの AUTO_INCREMENT `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- テーブルの AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `inventories`
--
ALTER TABLE `inventories`
  ADD CONSTRAINT `inventories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- テーブルの制約 `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
