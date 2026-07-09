-- ============================================================
-- SP MAPI — Hostinger Schema UPDATE Patch (Safe/Idempotent)
-- Apply on existing Hostinger database (preserves data)
-- Date: 2026-07-09
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. NEW TABLE: tools_inventory
-- ============================================================
CREATE TABLE IF NOT EXISTS tools_inventory (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  stock_quantity INT DEFAULT 0,
  rental_price DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. applications: Update status ENUM
-- ============================================================
ALTER TABLE applications
  MODIFY COLUMN status ENUM('draft','pending','under_review','approved','assigned','in_progress','completed','delivered','rejected','cancelled','withdrawn') NOT NULL DEFAULT 'pending';

-- Add withdrawal columns only if they don't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'withdrawn_at');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE applications ADD COLUMN withdrawn_at DATETIME NULL AFTER amin_assigned_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'withdrawn_by');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE applications ADD COLUMN withdrawn_by VARCHAR(36) NULL AFTER withdrawn_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'withdraw_reason');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE applications ADD COLUMN withdraw_reason TEXT NULL AFTER withdrawn_by', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Rename visit_date -> survey_scheduled_date (only if visit_date exists)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'applications' AND COLUMN_NAME = 'visit_date');
SET @sql = IF(@col_exists > 0, 'ALTER TABLE applications CHANGE COLUMN visit_date survey_scheduled_date DATE NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================
-- 3. assignments: Update status ENUM
-- ============================================================
ALTER TABLE assignments
  MODIFY COLUMN status ENUM('pending','accepted','rejected','in_progress','completed','withdrawn') DEFAULT 'pending';

-- ============================================================
-- 4. tool_requests: Update status ENUM + add withdrawal columns
-- ============================================================
ALTER TABLE tool_requests
  MODIFY COLUMN status ENUM('pending','approved','dispatched','returned','rejected','cancelled','withdrawn') DEFAULT 'pending';

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tool_requests' AND COLUMN_NAME = 'withdrawn_at');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE tool_requests ADD COLUMN withdrawn_at DATETIME NULL AFTER processed_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tool_requests' AND COLUMN_NAME = 'withdrawn_by');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE tool_requests ADD COLUMN withdrawn_by VARCHAR(36) NULL AFTER withdrawn_at', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tool_requests' AND COLUMN_NAME = 'withdraw_reason');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE tool_requests ADD COLUMN withdraw_reason TEXT NULL AFTER withdrawn_by', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;
