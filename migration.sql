-- Migration: Add public resume columns and resume_content JSON fields
-- Run this if you have existing data and don't want to lose it

ALTER TABLE `resumes` 
ADD COLUMN `is_public` tinyint(1) DEFAULT '0' AFTER `downloads`,
ADD COLUMN `public_key` varchar(50) UNIQUE AFTER `is_public`,
ADD KEY `is_public_idx` (`is_public`),
ADD KEY `public_key_idx` (`public_key`);

ALTER TABLE `resume_content`
ADD COLUMN `languages` json DEFAULT NULL AFTER `skills`,
ADD COLUMN `certifications` json DEFAULT NULL AFTER `languages`,
ADD COLUMN `projects` json DEFAULT NULL AFTER `certifications`;
