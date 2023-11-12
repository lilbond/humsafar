-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.35 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping database structure for trains
CREATE DATABASE IF NOT EXISTS `trains` /*!40100 DEFAULT CHARACTER SET ascii */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `trains`;

-- Dumping structure for table trains.seat_row
CREATE TABLE IF NOT EXISTS `seat_row` (
  `id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii;


-- Dumping structure for table trains.seat
CREATE TABLE IF NOT EXISTS `seat` (
  `id` int NOT NULL,
  `seat_row_id` int NOT NULL,
  `booked` tinyint NOT NULL DEFAULT '0',
  `lock_id` binary(16) DEFAULT NULL,
  PRIMARY KEY (`id`,`seat_row_id`),
  KEY `fk_seat_row_id` (`seat_row_id`),
  KEY `lock_id` (`lock_id`),
  CONSTRAINT `fk_seat_row_id` FOREIGN KEY (`seat_row_id`) REFERENCES `seat_row` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=ascii;


-- Dumping structure for procedure trains.sp_book
DELIMITER //
CREATE PROCEDURE `sp_book`(IN seat_count INT)
BEGIN

	DECLARE tmp_lock_id BINARY(16) DEFAULT UUID_TO_BIN(UUID());
	
	-- If we have a seat row with required seat count
	UPDATE seat AS first_seat
	JOIN 
	(
		SELECT second_seat.id, second_seat.seat_row_id FROM seat AS second_seat JOIN 
		(
			SELECT outer_seat.seat_row_id AS seat_row_id
			FROM seat as outer_seat 
			INNER JOIN 
			(
				SELECT COUNT(s.id) AS available_seat_count, s.seat_row_id
				FROM seat AS s
				WHERE s.booked = 0 AND s.lock_id IS NULL
				GROUP BY s.seat_row_id
			) 
			AS inner_seat ON outer_seat.seat_row_id = inner_seat.seat_row_id
			AND inner_seat.available_seat_count >= seat_count
			AND outer_seat.booked = 0 AND outer_seat.lock_id IS NULL
			ORDER BY outer_seat.seat_row_id DESC,inner_seat.available_seat_count ASC
			LIMIT 1
		) AS third_seat ON second_seat.seat_row_id = third_seat.seat_row_id 
		AND second_seat.booked = 0 AND second_seat.lock_id IS NULL
		LIMIT seat_count FOR UPDATE
	) AS compound_seat ON first_seat.seat_row_id = compound_seat.seat_row_id 
	AND first_seat.id = compound_seat.id
	AND first_seat.booked = 0 
	AND first_seat.lock_id IS NULL 
	SET first_seat.lock_id = tmp_lock_id;
	
	
	
	SET @lock_count := ROW_COUNT();	
	IF @lock_count = seat_count THEN
		UPDATE seat SET booked = 1 WHERE lock_id = tmp_lock_id;
	ELSE 
		UPDATE seat SET lock_id = NULL WHERE lock_id = tmp_lock_id;
		
		-- If we have seats in different rows
		UPDATE seat AS first_seat JOIN 
		(SELECT * FROM seat WHERE booked = 0 AND lock_id IS NULL ORDER BY seat_row_id DESC, id ASC LIMIT seat_count FOR UPDATE) AS second_seat
		ON first_seat.id = second_seat.id AND first_seat.seat_row_id = second_seat.seat_row_id AND first_seat.booked = 0 AND first_seat.lock_id IS NULL
		SET first_seat.lock_id = tmp_lock_id;
		
		SET @lock_count := ROW_COUNT();
		IF @lock_count = seat_count THEN
			UPDATE seat SET booked = 1 WHERE lock_id = tmp_lock_id;
		ELSE 
			UPDATE seat SET lock_id = NULL WHERE lock_id = tmp_lock_id;
		END IF;
	END IF;		
	
	SELECT * FROM seat WHERE lock_id = tmp_lock_id;
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
