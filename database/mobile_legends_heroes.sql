-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 10.123.0.243:3306
-- Generation Time: Sep 19, 2026 at 02:50 AM
-- Data section regenerated from the live API (heroes.php) on 2026-09-20: 133 rows, hero_id 3-139.
-- Data section regenerated from the live API (heroes.php) on 2026-09-20: 133 rows, hero_id 3-139.
-- Data section regenerated from the live API (heroes.php) on 2026-09-20: 133 rows, hero_id 3-139.
-- Server version: 8.4.7
-- PHP Version: 8.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gabcas7_gelodb`
--

-- --------------------------------------------------------

--
-- Table structure for table `mobile_legends_heroes`
--

CREATE TABLE `mobile_legends_heroes` (
  `hero_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `lane` varchar(255) NOT NULL,
  `difficulty` varchar(255) NOT NULL,
  `picture` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `mobile_legends_heroes`
--

INSERT INTO `mobile_legends_heroes` (`hero_id`, `name`, `role`, `lane`, `difficulty`, `picture`) VALUES
(3, 'Layla', 'Marksman', 'Gold', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/5/58/Hero181-portrait.png/revision/latest?cb=20241021141031'),
(4, 'Miya', 'Marksman', 'Gold', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Hero011-portrait.png/revision/latest?cb=20250407160822'),
(5, 'Tigreal', 'Tank', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b8/Hero061-portrait.png/revision/latest?cb=20241021140350'),
(6, 'Eudora', 'Mage', 'Mid', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ab/Hero151-portrait.png/revision/latest?cb=20260129103005'),
(7, 'Zilong', 'Fighter/Assassin', 'EXP/Jungle', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7a/Hero161-portrait.png/revision/latest?cb=20241021141000'),
(8, 'Balmond', 'Fighter', 'EXP/Jungle', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c4/Hero021-portrait.png/revision/latest?cb=20251110110543'),
(9, 'Nana', 'Mage/Support', 'Mid/Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a4/Hero051-portrait.png/revision/latest?cb=20241021140348'),
(10, 'Estes', 'Support', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c0/Hero341-portrait.png/revision/latest?cb=20241021141430'),
(11, 'Alucard', 'Fighter/Assassin', 'Jungle/EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/0/01/Hero071-portrait.png/revision/latest?cb=20241021140353'),
(12, 'Franco', 'Tank', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b3/Hero101-portrait.png/revision/latest?cb=20260626040250'),
(13, 'Saber', 'Assassin', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e7/Hero031-portrait.png/revision/latest?cb=20250406000702'),
(14, 'Karina', 'Assassin/Mage', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/4/41/Hero081-portrait.png/revision/latest?cb=20241021140357'),
(15, 'Angela', 'Support', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6b/Hero551-portrait.png/revision/latest?cb=20250406000910'),
(16, 'Lesley', 'Marksman/Assassin', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f1/Hero531-portrait.png/revision/latest?cb=20241021141920'),
(17, 'Fanny', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Hero171-portrait.png/revision/latest?cb=20241021141015'),
(18, 'Gusion', 'Assassin/Mage', 'Jungle/Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Hero561-portrait.png/revision/latest?cb=20241021142006'),
(19, 'Lancelot', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/d/df/Hero471-portrait.png/revision/latest?cb=20241021141749'),
(20, 'Chou', 'Fighter', 'EXP/Roam', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ed/Hero261-portrait.png/revision/latest?cb=20241021141231'),
(21, 'Kagura', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8e/Hero251-portrait.png/revision/latest?cb=20241021141216'),
(22, 'Hayabusa', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/3/35/Hero211-portrait.png/revision/latest?cb=20241021141115'),
(27, 'Aamon', 'Assassin', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c8/Hero1091-portrait.png/revision/latest?cb=20251225192214'),
(28, 'Akai', 'Tank', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9d/Hero091-portrait.png/revision/latest?cb=20241021140401'),
(29, 'Aldous', 'Fighter', 'EXP', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/6/61/Hero641-portrait.png/revision/latest?cb=20241021142204'),
(30, 'Alice', 'Tank/Mage', 'EXP', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/8/88/Hero041-portrait.png/revision/latest?cb=20250917074230'),
(31, 'Alpha', 'Fighter', 'Jungle', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b0/Hero281-portrait.png/revision/latest?cb=20250802155020'),
(32, 'Argus', 'Fighter', 'EXP', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ac/Hero451-portrait.png/revision/latest?cb=20250407160733'),
(33, 'Arlott', 'Fighter/Assassin', 'EXP', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/4/49/Hero1201-portrait.png/revision/latest?cb=20241021140737'),
(34, 'Atlas', 'Tank', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7c/Hero931-portrait.png/revision/latest?cb=20241021142917'),
(35, 'Aulus', 'Fighter', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1d/Hero1081-portrait.png/revision/latest?cb=20260423100521'),
(36, 'Aurora', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Hero361-portrait.png/revision/latest?cb=20241021141501'),
(37, 'Badang', 'Fighter', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d8/Hero771-portrait.png/revision/latest?cb=20260919020718'),
(38, 'Bane', 'Fighter/Mage', 'Jungle', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8d/Hero111-portrait.png/revision/latest?cb=20241021140922'),
(39, 'Barats', 'Tank/Fighter', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0f/Hero991-portrait.png/revision/latest?cb=20241021143047'),
(40, 'Baxia', 'Tank', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d0/Hero871-portrait.png/revision/latest?cb=20241021142746'),
(41, 'Beatrix', 'Marksman', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/d/de/Hero1051-portrait.png/revision/latest?cb=20241021143216'),
(42, 'Belerick', 'Tank', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8d/Hero701-portrait.png/revision/latest?cb=20241021142334'),
(43, 'Benedetta', 'Assassin/Fighter', 'EXP', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1d/Hero971-portrait.png/revision/latest?cb=20241021143017'),
(44, 'Brody', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2c/Hero1001-portrait.png/revision/latest?cb=20260916131931'),
(45, 'Bruno', 'Marksman', 'Gold', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/4/44/Hero121-portrait.png/revision/latest?cb=20260916132624'),
(46, 'Carmilla', 'Support/Tank', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/3/30/Hero921-portrait.png/revision/latest?cb=20241021142902'),
(47, 'Cecilion', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/7/7f/Hero911-portrait.png/revision/latest?cb=20241021142846'),
(48, 'Chang''e', 'Mage', 'Mid', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/6/63/Hero611-portrait.png/revision/latest?cb=20241021142120'),
(49, 'Chip', 'Support/Tank', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/7/73/Hero1241-portrait.png/revision/latest?cb=20241021140835'),
(50, 'Cici', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/4/4f/Hero1231-portrait.png/revision/latest?cb=20241021140820'),
(51, 'Claude', 'Marksman', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/6/61/Hero651-portrait.png/revision/latest?cb=20241021142219'),
(52, 'Clint', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d9/Hero131-portrait.png/revision/latest?cb=20260918135520'),
(53, 'Cyclops', 'Mage', 'Mid', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/0/09/Hero331-portrait.png/revision/latest?cb=20241021141415'),
(54, 'Diggie', 'Support', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/1/17/Hero481-portrait.png/revision/latest?cb=20241021141804'),
(55, 'Dyrroth', 'Fighter', 'EXP', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2c/Hero851-portrait.png/revision/latest?cb=20250917081250'),
(56, 'Edith', 'Tank/Marksman', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/4/47/Hero1111-portrait.png/revision/latest?cb=20241021143348'),
(57, 'Esmeralda', 'Tank/Mage', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/4/42/Hero811-portrait.png/revision/latest?cb=20241021142615'),
(58, 'Faramis', 'Support/Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d0/Hero761-portrait.png/revision/latest?cb=20241021142504'),
(59, 'Floryn', 'Support', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/1/11/Hero1121-portrait.png/revision/latest?cb=20241021143403'),
(60, 'Fredrinn', 'Fighter/Tank', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/7/78/Hero1171-portrait.png/revision/latest?cb=20241021140652'),
(61, 'Freya', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/5/54/Hero221-portrait.png/revision/latest?cb=20251110105915'),
(62, 'Gatotkaca', 'Tank/Fighter', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/b/ba/Hero411-portrait.png/revision/latest?cb=20241021141617'),
(63, 'Gloo', 'Tank', 'Roam', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/1/12/Hero1041-portrait.png/revision/latest?cb=20250403144136'),
(64, 'Gord', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a7/Hero231-portrait.png/revision/latest?cb=20241123045016'),
(65, 'Granger', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/c/cb/Hero791-portrait.png/revision/latest?cb=20250407160652'),
(66, 'Grock', 'Tank/Fighter', 'Roam', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/9/95/Hero441-portrait.png/revision/latest?cb=20250811073746'),
(67, 'Guinevere', 'Fighter', 'EXP', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/8/88/Hero801-portrait.png/revision/latest?cb=20241021142559'),
(68, 'Hanabi', 'Marksman', 'Gold', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/9/95/Hero601-portrait.png/revision/latest?cb=20241021142105'),
(69, 'Hanzo', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f8/Hero691-portrait.png/revision/latest?cb=20250117141953'),
(70, 'Harith', 'Mage', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/3/36/Hero731-portrait.png/revision/latest?cb=20241021142419'),
(71, 'Harley', 'Assassin/Mage', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/8/81/Hero421-portrait.png/revision/latest?cb=20241021141633'),
(72, 'Helcurt', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ac/Hero511-portrait.png/revision/latest?cb=20241021141850'),
(73, 'Hilda', 'Tank/Fighter', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/d/dc/Hero351-portrait.png/revision/latest?cb=20241021141445'),
(74, 'Hirara', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/1/19/Hero1331-portrait.png/revision/latest?cb=20260618091411'),
(75, 'Hylos', 'Tank', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1e/Hero491-portrait.png/revision/latest?cb=20241021141819'),
(76, 'Irithel', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b8/Hero431-portrait.png/revision/latest?cb=20260618090446'),
(77, 'Ixia', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/2/24/Hero1211-portrait.png/revision/latest?cb=20241021140752'),
(78, 'Jawhead', 'Fighter', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/2/2c/Hero541-portrait.png/revision/latest?cb=20241021141935'),
(79, 'Johnson', 'Tank', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/4/4a/Hero321-portrait.png/revision/latest?cb=20241021141359'),
(80, 'Joy', 'Assassin/Fighter', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/f/fb/Hero1181-portrait.png/revision/latest?cb=20241021140707'),
(81, 'Julian', 'Fighter/Mage', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0c/Hero1161-portrait.png/revision/latest?cb=20241021140636'),
(82, 'Kadita', 'Mage/Assassin', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e8/Hero751-portrait.png/revision/latest?cb=20241021142450'),
(83, 'Kaja', 'Support/Fighter', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/8/86/Hero621-portrait.png/revision/latest?cb=20260805104241'),
(84, 'Kalea', 'Support/Fighter', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9a/Hero1281-portrait.png/revision/latest?cb=20250407160846'),
(85, 'Karrie', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/d/db/Hero401-portrait.png/revision/latest?cb=20241021141602'),
(86, 'Khaleed', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c6/Hero981-portrait.png/revision/latest?cb=20241021143032'),
(87, 'Khufra', 'Tank', 'Roam', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0f/Hero781-portrait.png/revision/latest?cb=20241021142534'),
(88, 'Kimmy', 'Marksman/Mage', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/e/eb/Hero711-portrait.png/revision/latest?cb=20250320124912'),
(89, 'Lapu-Lapu', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/7/78/Hero371-portrait.png/revision/latest?cb=20241021141516'),
(90, 'Leomord', 'Fighter', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/d/de/Hero671-portrait.png/revision/latest?cb=20241021142250'),
(91, 'Ling', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e0/Hero841-portrait.png/revision/latest?cb=20241021142700'),
(92, 'Lolita', 'Tank/Support', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/2/20/Hero201-portrait.png/revision/latest?cb=20241021141100'),
(93, 'Lukas', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b0/Hero1271-portrait.png/revision/latest?cb=20250412174341'),
(94, 'Lunox', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d8/Hero681-portrait.png/revision/latest?cb=20241021142306'),
(95, 'Luo Yi', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0f/Hero961-portrait.png/revision/latest?cb=20260918005619'),
(96, 'Lylia', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ef/Hero861-portrait.png/revision/latest?cb=20241021142730'),
(97, 'Marcel', 'Support', 'Roam', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/2/27/Hero1321-portrait.png/revision/latest?cb=20260311075303'),
(98, 'Martis', 'Fighter', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0b/Hero581-portrait.png/revision/latest?cb=20241021142036'),
(99, 'Masha', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/a/ae/Hero881-portrait.png/revision/latest?cb=20260918142339'),
(100, 'Mathilda', 'Support/Assassin', 'Roam', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/9/92/Hero1021-portrait.png/revision/latest?cb=20241021143131'),
(101, 'Melissa', 'Marksman', 'Gold', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/1/14/Hero1141-portrait.png/revision/latest?cb=20241021143430'),
(102, 'Minotaur', 'Tank/Support', 'Roam', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9f/Hero191-portrait.png/revision/latest?cb=20241021141046'),
(103, 'Minsitthar', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/8/83/Hero741-portrait.png/revision/latest?cb=20241021142435'),
(104, 'Moskov', 'Marksman', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/6/60/Hero311-portrait.png/revision/latest?cb=20241021141344'),
(105, 'Natalia', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/6/68/Hero241-portrait.png/revision/latest?cb=20241021141201'),
(106, 'Natan', 'Marksman', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0b/Hero1071-portrait.png/revision/latest?cb=20241021143246'),
(107, 'Nolan', 'Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/f/fc/Hero1221-portrait.png/revision/latest?cb=20241021140807'),
(108, 'Novaria', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d5/Hero1191-portrait.png/revision/latest?cb=20241021140722'),
(109, 'Obsidia', 'Marksman', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/0/0b/Hero1301-portrait.png/revision/latest?cb=20250928040037'),
(110, 'Odette', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/e/ed/Hero461-portrait.png/revision/latest?cb=20250117141936'),
(111, 'Paquito', 'Fighter', 'EXP', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a9/Hero1031-portrait.png/revision/latest?cb=20241021143146'),
(112, 'Pharsa', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a2/Hero521-portrait.png/revision/latest?cb=20241021141905'),
(113, 'Phoveus', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/3/3c/Hero1061-portrait.png/revision/latest?cb=20241021143231'),
(114, 'Popol and Kupa', 'Marksman', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a5/Hero941-portrait.png/revision/latest?cb=20241021142932'),
(115, 'Rafaela', 'Support', 'Roam', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/d/d0/Hero141-portrait.png/revision/latest?cb=20241021140932'),
(116, 'Roger', 'Fighter/Marksman', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/3/33/Hero391-portrait.png/revision/latest?cb=20241021141547'),
(117, 'Ruby', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/b/b4/Hero291-portrait.png/revision/latest?cb=20250802152205'),
(118, 'Selena', 'Assassin/Mage', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/a/a4/Hero631-portrait.png/revision/latest?cb=20241021142149'),
(119, 'Silvanna', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/9/97/Hero901-portrait.png/revision/latest?cb=20241021142831'),
(120, 'Sora', 'Fighter/Assassin', 'EXP', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/0/00/Hero1311-portrait.png/revision/latest?cb=20251218014024'),
(121, 'Sun', 'Fighter', 'EXP', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/8/89/Hero271-portrait.png/revision/latest?cb=20241021141243'),
(122, 'Suyou', 'Fighter/Assassin', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/4/41/Hero1261-portrait.png/revision/latest?cb=20250412174335'),
(123, 'Terizla', 'Fighter', 'EXP', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/6/6d/Hero821-portrait.png/revision/latest?cb=20250802145756'),
(124, 'Thamuz', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/7/74/Hero721-portrait.png/revision/latest?cb=20250917080630'),
(125, 'Uranus', 'Tank', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/b/bb/Hero591-portrait.png/revision/latest?cb=20241021142052'),
(126, 'Vale', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/c/c7/Hero661-portrait.png/revision/latest?cb=20250406000746'),
(127, 'Valentina', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/1/12/Hero1101-portrait.png/revision/latest?cb=20241021143333'),
(128, 'Valir', 'Mage', 'Mid', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9e/Hero571-portrait.png/revision/latest?cb=20241021142021'),
(129, 'Vexana', 'Mage', 'Mid', 'Easy', 'https://static.wikia.nocookie.net/mobile-legends/images/3/36/Hero381-portrait.png/revision/latest?cb=20241021141531'),
(130, 'Wanwan', 'Marksman', 'Gold', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/8/8f/Hero891-portrait.png/revision/latest?cb=20250117142006'),
(131, 'X.Borg', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/5/50/Hero831-portrait.png/revision/latest?cb=20241021142646'),
(132, 'Xavier', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/e/e0/Hero1151-portrait.png/revision/latest?cb=20241021143446'),
(133, 'Yi Sun-shin', 'Assassin/Marksman', 'Jungle', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/2/29/Hero301-portrait.png/revision/latest?cb=20241021141329'),
(134, 'Yin', 'Fighter', 'Jungle', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/b/bc/Hero1131-portrait.png/revision/latest?cb=20241021143417'),
(135, 'Yu Zhong', 'Fighter', 'EXP', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/1/10/Hero951-portrait.png/revision/latest?cb=20241021142947'),
(136, 'Yve', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/1/10/Hero1011-portrait.png/revision/latest?cb=20241021143118'),
(137, 'Zetian', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f7/Hero1291-portrait.png/revision/latest?cb=20250802160054'),
(138, 'Zhask', 'Mage', 'Mid', 'Medium', 'https://static.wikia.nocookie.net/mobile-legends/images/f/fe/Hero501-portrait.png/revision/latest?cb=20241021141834'),
(139, 'Zhuxin', 'Mage', 'Mid', 'Hard', 'https://static.wikia.nocookie.net/mobile-legends/images/9/9f/Hero1251-portrait.png/revision/latest?cb=20250406000833');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mobile_legends_heroes`
--
ALTER TABLE `mobile_legends_heroes`
  ADD PRIMARY KEY (`hero_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mobile_legends_heroes`
--
ALTER TABLE `mobile_legends_heroes`
  MODIFY `hero_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
