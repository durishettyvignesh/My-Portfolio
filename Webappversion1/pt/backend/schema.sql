-- WanderBuddy MySQL schema and seed
CREATE DATABASE IF NOT EXISTS `projct`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `projct`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Message`;
DROP TABLE IF EXISTS `Match`;
DROP TABLE IF EXISTS `User`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `age` INT NOT NULL,
  `gender` VARCHAR(50) NULL,
  `languages` VARCHAR(255) NOT NULL,
  `interests` TEXT NOT NULL,
  `picture` TEXT NULL,
  `location` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Match` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `buddyId` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `uniq_user_buddy` (`userId`, `buddyId`),
  INDEX `idx_match_user` (`userId`),
  INDEX `idx_match_buddy` (`buddyId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_match_user`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_match_buddy`
    FOREIGN KEY (`buddyId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `senderId` INT NOT NULL,
  `recipientId` INT NOT NULL,
  `content` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `readAt` DATETIME(3) NULL,
  INDEX `idx_message_pair_createdAt` (`senderId`, `recipientId`, `createdAt`),
  INDEX `idx_message_recipient_createdAt` (`recipientId`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_message_sender`
    FOREIGN KEY (`senderId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_message_recipient`
    FOREIGN KEY (`recipientId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `User` (`name`, `age`, `gender`, `languages`, `interests`, `picture`, `location`) VALUES
  ('Emma Johnson', 28, 'female', 'English', 'Photography, Hiking, Local Cuisine', 'https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg', 'London, UK'),
  ('Miguel Santos', 32, 'male', 'Spanish, English', 'Cultural Tours, Music, Food', 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg', 'Barcelona, Spain'),
  ('Sophia Chen', 26, 'female', 'English', 'Museums, Art, Coffee Shops', 'https://cdn.pixabay.com/photo/2017/02/16/23/10/smile-2072907_1280.jpg', 'Toronto, Canada');

INSERT INTO `Match` (`userId`, `buddyId`, `status`) VALUES
  (1, 2, 'pending'),
  (2, 3, 'accepted');

INSERT INTO `Message` (`senderId`, `recipientId`, `content`) VALUES
  (1, 2, 'Hey Miguel! Planning a trip soon—interested?'),
  (2, 1, 'Hi Emma! Yes, when are you thinking?'),
  (3, 2, 'Hey Miguel, any tips for Barcelona food spots?');


