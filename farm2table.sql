-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 26, 2020 at 10:58 PM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farm2table`
--

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

DROP TABLE IF EXISTS `food_items`;
CREATE TABLE IF NOT EXISTS `food_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` varchar(100) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`id`, `item`, `quantity`, `expire_date`, `created_at`) VALUES
(31, 'Coke Zero', 24, NULL, '2020-02-25 01:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userId`, `created_at`) VALUES
(69, 5, '2020-02-23 19:01:54'),
(68, 5, '2020-02-23 18:59:56'),
(67, 5, '2020-02-23 18:55:34'),
(66, 5, '2020-02-23 18:54:23'),
(65, 5, '2020-02-23 18:52:55'),
(64, 5, '2020-02-23 18:41:12'),
(63, 5, '2020-02-23 18:41:04'),
(62, 5, '2020-02-23 18:39:23'),
(70, 5, '2020-02-23 19:18:09'),
(71, 7, '2020-02-23 19:30:22'),
(72, 7, '2020-02-23 19:30:33');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `item_id` varchar(100) NOT NULL,
  `is_fulfilled` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=41476 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_id`, `is_fulfilled`) VALUES
(41458, 64, '21', NULL),
(41457, 63, '23', NULL),
(41456, 62, '23', NULL),
(41455, 62, '21', NULL),
(41459, 64, '23', NULL),
(41460, 65, '21', NULL),
(41461, 65, '23', NULL),
(41462, 66, '21', NULL),
(41463, 66, '23', NULL),
(41464, 67, '21', NULL),
(41465, 67, '23', NULL),
(41466, 68, '21', NULL),
(41467, 68, '23', NULL),
(41468, 69, '21', NULL),
(41469, 69, '23', NULL),
(41470, 70, '21', NULL),
(41471, 70, '23', NULL),
(41472, 71, '24', 1),
(41473, 72, '21', 1),
(41474, 72, '24', 1),
(41475, 72, '23', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `is_admin`) VALUES
(7, 'john.doe@example.com', '$2y$10$aFRRQ5rx93W41fSY9JIR9OxKaM7dURejCip89sOYa1dm9Mcv.iyXS', 0),
(6, 'mattaecole@gmail.com', '$2y$10$yKj92iemTvFB/M4PsoBKt.tMPChzC.jC1/hXT1DS3fr/qze/dTU9S', 1),
(8, 'jane.doe@example.com', '$2y$10$Kch6kmJ/nN4zRjJLmPLLNe6IPP4x9v4apQNm61Eajl5S2g64NGEN2', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
