-- SmartPersona Database Dump
CREATE DATABASE IF NOT EXISTS smartpersona_db;
USE smartpersona_db;

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
('2e30877d-6196-4b79-8b8e-4e4cc227baba', '{"template":"classic"}', '{"email":"somchai@email.com","phone":"089-123-4567","github":"","address":"Bangkok, Thailand","jobTitle":"Senior Software Engineer","lastName":"WIRIYAKUL","linkedin":"","firstName":"NATTHAPONG","portfolio":"","profilePic":"","dateOfBirth":"","nationality":""}', '[{"id":"7817ad34-f096-4381-b974-7163a3464ad9","gpa":"3.45","field":"Computer Science","degree":"Bachelor of Science","gradYear":"2020","location":"","startYear":"2016","activities":"","institution":"Chulalongkorn University"}]', '[{"id":"aedcd7d8-9311-44a9-bdeb-85fab89ec0f0","company":"","details":"","endDate":"","location":"","position":"","isCurrent":false,"startDate":""}]', '{"details":"Experienced software engineer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications."}', '{"list":"React, Next.js, TypeScript, Node.js, Express.js, PostgreSQL, MongoDB, AWS, Docker, Git, Tailwind CSS, GraphQL"}', '[{"id":"3c8c71d6-b4a5-4cc2-ba4d-39da549ee4b0","level":"Native","language":"Thai"},{"id":"4522f98f-c3cf-423f-b93b-bf35b358d7b8","level":"Professional","language":"English"}]', '[]', '[]', '2026-04-18 11:44:42', '2026-04-18 11:48:50'),
('8bd0e0e8-ab4f-4ce9-a27a-899fd5a13e04', '{"template":"classic"}', '{"email":"natthapong.w@gmail.com","phone":"092-345-6789","github":"","address":"Bangkok, Thailand","jobTitle":"Full-Stack Developer","lastName":"Wiriyakul","linkedin":"","firstName":"Natthapong","portfolio":"","profilePic":"","dateOfBirth":"","nationality":"Thai"}', '[{"id":"46798eaa-507a-4e65-bc0f-3ba65dc54cba","gpa":"","field":"","degree":"","gradYear":"","location":"","startYear":"","activities":"","institution":""}]', '[{"id":"070b252c-75b4-42d7-a708-5e61787e2564","company":"TechVision Co., Ltd.","details":"- Led a team of 5 developers to rebuild the company''s flagship product using Next.js and TypeScript\n- Implemented CI/CD pipeline reducing deployment time by 60%\n- Optimized application performance achieving 95+ Lighthouse score\n- Mentored 3 junior developers through code reviews and pair programming","endDate":"","location":"Bangkok","position":"Senior Frontend Developer","isCurrent":true,"startDate":""}]', '{"details":"Results-driven Full-Stack Developer with 4+ years of experience building scalable web applications using React, Next.js, and Node.js. Passionate about clean code architecture, performance optimization, and delivering exceptional user experiences. Led development of e-commerce platforms serving 100K+ monthly active users."}', '{"list":""}', '[{"id":"2b995c56-d9c5-4663-80ab-75a0bff48521","level":"Professional","language":""}]', '[]', '[]', '2026-04-18 11:45:08', '2026-04-18 11:45:08');


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
('2e30877d-6196-4b79-8b8e-4e4cc227baba', 10, 'NATTHAPONG WIRIYAKUL Resume', 'classic', 'Draft', 2, 0, 0, NULL, '2026-04-18 11:44:42'),
('8bd0e0e8-ab4f-4ce9-a27a-899fd5a13e04', 10, 'Natthapong Wiriyakul Resume', 'classic', 'Draft', 4, 0, 1, NULL, '2026-04-18 11:45:08');


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
(1, 'User', 'Regular user with resume creation access', '2026-04-02 03:59:11'),
(2, 'Admin', 'Administrator with full system access', '2026-04-02 03:59:11');


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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_emails` (`id`, `user_id`, `email`, `is_primary`, `created_at`) VALUES
(1, 8, 'pipezaza34@gmail.com', 1, '2026-04-09 04:24:33'),
(2, 9, 'cat@gmail.com', 1, '2026-04-18 10:43:31'),
(3, 10, 'test@example.com', 1, '2026-04-18 11:08:28');


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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `profile_pic`, `role`, `status`, `created_at`) VALUES
(8, 'Pipe', 'pipezaza34@gmail.com', '$2b$10$E3JmIQzwcZRm6/sW7LWigOGVXevVEni9O7mGQsXDr3HOw/n5.szwC', NULL, 'User', 'Active', '2026-04-09 04:24:33'),
(9, 'Cat', 'cat@gmail.com', '$2b$10$UZ4VjaP2CjoIYzWLs8GgwexHqeSlZodsAufPRiF387pHJuc35vRoa', NULL, 'User', 'Active', '2026-04-18 10:43:31'),
(10, 'testuser', 'test@example.com', '$2b$10$.yWioOv9H0RBnn8o/HyMFOR0HV/v4K5uUQvXgTVxfnfl1.Tqidtjm', NULL, 'User', 'Active', '2026-04-18 11:08:28');

