-- SmartPersona Database Dump
CREATE DATABASE IF NOT EXISTS smartpersona_db;
USE smartpersona_db;

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'system',
  `link` varchar(255) DEFAULT '#',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `notifications` (`id`, `message`, `type`, `link`, `is_read`, `created_at`) VALUES
(1, 'มีผู้สมัครสมาชิกใหม่: admin', 'user', '/admin/users', 0, '2026-04-19 07:47:07'),
(2, 'มีผู้สมัครสมาชิกใหม่: Admin', 'user', '/admin/users', 0, '2026-04-19 08:17:59'),
(3, 'มีการสร้างเรซูเม่ใหม่: กฟกฟ Resume', 'resume', '/admin/resumes/d16f11da-6a7c-47aa-8a7e-3910893c89f8', 0, '2026-04-19 10:10:52'),
(4, 'มีการสร้างเรซูเม่ใหม่: Waranom Soprok Resume', 'resume', '/admin/resumes/4010e3cc-7417-416a-902f-cb222cfa0701', 0, '2026-04-19 10:10:59'),
(5, 'มีผู้สมัครสมาชิกใหม่: Pol', 'user', '/admin/users', 0, '2026-04-19 10:47:31');


DROP TABLE IF EXISTS `resume_content`;
CREATE TABLE `resume_content` (
  `resume_id` varchar(50) NOT NULL,
  `config` json DEFAULT NULL,
  `personal` json DEFAULT NULL,
  `education` json DEFAULT NULL,
  `experience` json DEFAULT NULL,
  `summary` json DEFAULT NULL,
  `skills` json DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  `projects` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`resume_id`),
  CONSTRAINT `resume_content_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `resume_content` (`resume_id`, `config`, `personal`, `education`, `experience`, `summary`, `skills`, `languages`, `certifications`, `projects`, `created_at`, `updated_at`) VALUES
('4010e3cc-7417-416a-902f-cb222cfa0701', '{"template":"classic"}', '{"email":"pipezaza34@gmail.com","phone":"0823077777","github":"https://github.com/waranon-sop","address":"Bangkok","jobTitle":"Backend Systems Engineer","lastName":"Soprok","linkedin":"https://www.linkedin.com/in/waranon-soprok-b14604394/","firstName":"Waranom","portfolio":"-","profilePic":"/uploads/profile_8_1776618433125.jpg","dateOfBirth":"2000-06-13","nationality":"Thai"}', '[{"id":"cf5be15d-b8c5-4cd1-89d7-a052cba1b13e","gpa":"3","field":"IT","degree":"Grade1","gradYear":"2023","location":"","startYear":"2018","activities":"-","institution":"ABC"}]', '[{"id":"bfbc7900-844a-4b94-a034-398dcf4335a5","company":"ABC","details":"Java","endDate":"","location":"Bangkok","position":"Backend","isCurrent":true,"startDate":"2026-02"}]', '{"details":"-"}', '{"list":"Java"}', '[{"id":"84ae00f7-f239-44b4-89be-bd79771e16d5","level":"Basic","language":"Thai"}]', '[{"id":"e667d78b-21c3-40a7-ae11-f9b532da3b3f","name":"abc","issuer":"abc champions","issueDate":"2026-07","credentialId":""}]', '[]', '2026-04-19 10:10:59', '2026-04-19 10:10:59');


DROP TABLE IF EXISTS `resumes`;
CREATE TABLE `resumes` (
  `id` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `template` varchar(100) NOT NULL,
  `status` enum('Draft','Published','Archived') DEFAULT 'Draft',
  `views` int DEFAULT '0',
  `downloads` int DEFAULT '0',
  `is_public` tinyint(1) DEFAULT '0',
  `public_key` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `public_key` (`public_key`),
  KEY `user_id` (`user_id`),
  KEY `is_public_idx` (`is_public`),
  KEY `public_key_idx` (`public_key`),
  CONSTRAINT `resumes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `resumes` (`id`, `user_id`, `title`, `template`, `status`, `views`, `downloads`, `is_public`, `public_key`, `created_at`) VALUES
('4010e3cc-7417-416a-902f-cb222cfa0701', 8, 'Waranom Soprok Resume', 'classic', 'Draft', 6, 1, 1, 'pub_637b3fdc', '2026-04-19 10:10:59');


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'User', 'Regular user with resume creation access', '2026-04-01 20:59:11'),
(2, 'Admin', 'Administrator with full system access', '2026-04-01 20:59:11');


DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('allow_registration', 'true'),
('contact_email', 'admin@smartpersona.com'),
('maintenance_mode', 'false'),
('site_description', 'AI Resume Generation Platform'),
('site_name', 'SmartPersona');


DROP TABLE IF EXISTS `user_emails`;
CREATE TABLE `user_emails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_email` (`user_id`,`email`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_emails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_emails` (`id`, `user_id`, `email`, `is_primary`, `created_at`) VALUES
(1, 8, 'pipezaza34@gmail.com', 1, '2026-04-08 21:24:33'),
(2, 9, 'cat@gmail.com', 1, '2026-04-18 03:43:31'),
(5, 12, 'admin@gmail.com', 1, '2026-04-19 08:17:59'),
(22, 30, 'pol@gmail.com', 1, '2026-04-19 10:47:31');


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_pic` longtext,
  `role` enum('User','Admin') DEFAULT 'User',
  `status` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `profile_pic`, `role`, `status`, `created_at`) VALUES
(8, 'Pipe', 'pipezaza34@gmail.com', '$2b$10$E3JmIQzwcZRm6/sW7LWigOGVXevVEni9O7mGQsXDr3HOw/n5.szwC', '/uploads/profile_8_1776610739421.jpg', 'User', 'Active', '2026-04-08 21:24:33'),
(9, 'Cat', 'cat@gmail.com', '$2b$10$UZ4VjaP2CjoIYzWLs8GgwexHqeSlZodsAufPRiF387pHJuc35vRoa', NULL, 'User', 'Active', '2026-04-18 03:43:31'),
(12, 'Admin', 'admin@gmail.com', '$2b$10$lJZZsd92Hpq.GVoMX/rvaePMu52.B5fG/ePfTf2iMXDP8GNs0YHta', NULL, 'Admin', 'Active', '2026-04-19 08:17:59'),
(30, 'Pol', 'pol@gmail.com', '$2b$10$8Hg1MUR8KMjCg/iTbWLGLO36tHyTxqFYxX1U9KR7a6RmNbDXhxJ52', NULL, 'User', 'Active', '2026-04-19 10:47:31');

