-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 07. Jun 2016 um 14:03
-- Server-Version: 10.1.10-MariaDB
-- PHP-Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `sportlink`
--
CREATE DATABASE IF NOT EXISTS `sportlink` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
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
  `date` date NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `isopen` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `anfrage`
--

INSERT INTO `anfrage` (`id`, `freizeit`, `training`, `wettkampf`, `personId`, `sportart`, `location`, `date`, `comment`, `isopen`) VALUES
(1, 0, 0, 0, 1, 'Irgendeine', 'hier', '2016-06-30', 'my comment', 0);

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
(1, 'Heinz', 'Peter', 'heinz.peter@gmail.com', 'b', 'hier'),
(8, 'karl', 'karl', 'karl@gmail.com', 'b', 'there');

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
(1, 1, 1, '03456789O', 'COMMENT');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `zusage2`
--

CREATE TABLE `zusage2` (
  `id` int(11) NOT NULL,
  `anfrageId` int(11) NOT NULL,
  `telnr` varchar(250) NOT NULL,
  `comment` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT für Tabelle `zusage1`
--
ALTER TABLE `zusage1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `zusage2`
--
ALTER TABLE `zusage2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
