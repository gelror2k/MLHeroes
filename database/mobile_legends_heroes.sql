-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 10.123.0.243:3306
-- Generation Time: Sep 19, 2026 at 02:50 AM
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
(3, 'Layla', 'Marksman', 'Gold', 'Easy', 'https://placehold.co/400x400.png?text=Layla'),
(4, 'Miya', 'Marksman', 'Gold', 'Easy', 'https://placehold.co/400x400.png?text=Miya'),
(5, 'Tigreal', 'Tank', 'Roam', 'Easy', 'https://placehold.co/400x400.png?text=Tigreal'),
(6, 'Eudora', 'Mage', 'Mid', 'Easy', 'https://placehold.co/400x400.png?text=Eudora'),
(7, 'Zilong', 'Fighter/Assassin', 'EXP/Jungle', 'Easy', 'https://placehold.co/400x400.png?text=Zilong'),
(8, 'Balmond', 'Fighter', 'EXP/Jungle', 'Easy', 'https://placehold.co/400x400.png?text=Balmond'),
(9, 'Nana', 'Mage/Support', 'Mid/Roam', 'Easy', 'https://placehold.co/400x400.png?text=Nana'),
(10, 'Estes', 'Support', 'Roam', 'Easy', 'https://placehold.co/400x400.png?text=Estes'),
(11, 'Alucard', 'Fighter/Assassin', 'Jungle/EXP', 'Medium', 'https://placehold.co/400x400.png?text=Alucard'),
(12, 'Franco', 'Tank', 'Roam', 'Medium', 'https://placehold.co/400x400.png?text=Franco'),
(13, 'Saber', 'Assassin', 'Jungle', 'Medium', 'https://placehold.co/400x400.png?text=Saber'),
(14, 'Karina', 'Assassin/Mage', 'Jungle', 'Medium', 'https://placehold.co/400x400.png?text=Karina'),
(15, 'Angela', 'Support', 'Roam', 'Medium', 'https://placehold.co/400x400.png?text=Angela'),
(16, 'Lesley', 'Marksman/Assassin', 'Gold', 'Medium', 'https://placehold.co/400x400.png?text=Lesley'),
(17, 'Fanny', 'Assassin', 'Jungle', 'Hard', 'https://placehold.co/400x400.png?text=Fanny'),
(18, 'Gusion', 'Assassin/Mage', 'Jungle/Mid', 'Hard', 'https://placehold.co/400x400.png?text=Gusion'),
(19, 'Lancelot', 'Assassin', 'Jungle', 'Hard', 'https://placehold.co/400x400.png?text=Lancelot'),
(20, 'Chou', 'Fighter', 'EXP/Roam', 'Hard', 'https://placehold.co/400x400.png?text=Chou'),
(21, 'Kagura', 'Mage', 'Mid', 'Hard', 'https://placehold.co/400x400.png?text=Kagura'),
(22, 'Hayabusa', 'Assassin', 'Jungle', 'Hard', 'https://placehold.co/400x400.png?text=Hayabusa');

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
  MODIFY `hero_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
