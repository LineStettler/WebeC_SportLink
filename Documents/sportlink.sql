-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 14. Jun 2016 um 11:45
-- Server-Version: 10.1.9-MariaDB
-- PHP-Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `sportlink`
--
CREATE DATABASE IF NOT EXISTS `sportlink` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `sportlink`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `anfrage`
--

CREATE TABLE `anfrage` (
  `id` int(11) NOT NULL,
  `freizeit` tinyint(1) NOT NULL,
  `training` tinyint(1) NOT NULL,
  `wettkampf` tinyint(1) NOT NULL,
  `personId` int(11) NOT NULL,
  `sportart` varchar(250) NOT NULL,
  `location` varchar(250) NOT NULL,
  `date` datetime NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `isopen` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `anfrage`
--

INSERT INTO `anfrage` (`id`, `freizeit`, `training`, `wettkampf`, `personId`, `sportart`, `location`, `date`, `comment`, `isopen`) VALUES
(7, 0, 0, 0, 12, '4', 'Aarau', '2016-06-24 09:45:00', 'Runde Badminton', 0),
(8, 0, 0, 0, 12, 'Tennis', 'Brugg', '2016-06-23 10:00:00', 'Ne Runde Tennis', 1),
(9, 0, 0, 0, 15, '5', 'Aarau', '2016-06-15 15:15:00', 'asdasdasd', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `person`
--

CREATE TABLE `person` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `vorname` varchar(250) NOT NULL,
  `mail` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `ort` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `person`
--

INSERT INTO `person` (`id`, `name`, `vorname`, `mail`, `password`, `ort`) VALUES
(12, 'Kunkel', 'Thomas', 'thomas.kunkel.tk@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'Brugg'),
(14, 'Muster', 'Max', 'Max.Muster@muster.ch', '827ccb0eea8a706c4c34a16891f84e7b', 'Aarau'),
(15, 'Muster', 'Maxine', 'Maxine.Muster@muster.ch', '827ccb0eea8a706c4c34a16891f84e7b', 'Aarau');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zusage1`
--

CREATE TABLE `zusage1` (
  `id` int(11) NOT NULL,
  `anfrageId` int(11) NOT NULL,
  `personid` int(11) NOT NULL,
  `telnr` varchar(250) NOT NULL,
  `comment` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `zusage1`
--

INSERT INTO `zusage1` (`id`, `anfrageId`, `personid`, `telnr`, `comment`) VALUES
(6, 7, 14, '01234578', 'Habe SchlÃ¤ger'),
(7, 7, 15, '78993566', 'bin nett'),
(8, 9, 14, '456842685523', 'sdfsadfsdfsdfsdf');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zusage2`
--

CREATE TABLE `zusage2` (
  `id` int(11) NOT NULL,
  `anfrageId` int(11) NOT NULL,
  `zusage1id` int(11) NOT NULL,
  `telnr` varchar(250) NOT NULL,
  `comment` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `zusage2`
--

INSERT INTO `zusage2` (`id`, `anfrageId`, `zusage1id`, `telnr`, `comment`) VALUES
(3, 7, 7, '12312312312', 'asdasdasdasdasd'),
(5, 9, 8, '1243568790as', 'daasdasdasdasd');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `anfrage`
--
ALTER TABLE `anfrage`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `zusage1`
--
ALTER TABLE `zusage1`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `zusage2`
--
ALTER TABLE `zusage2`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `anfrage`
--
ALTER TABLE `anfrage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT für Tabelle `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT für Tabelle `zusage1`
--
ALTER TABLE `zusage1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT für Tabelle `zusage2`
--
ALTER TABLE `zusage2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
