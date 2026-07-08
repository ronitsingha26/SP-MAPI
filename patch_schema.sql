ALTER TABLE applications MODIFY COLUMN status ENUM('draft','pending','under_review','approved','assigned','in_progress','completed','delivered','rejected','cancelled','withdrawn') NOT NULL DEFAULT 'pending';
ALTER TABLE applications ADD COLUMN withdrawn_at DATETIME NULL;
ALTER TABLE applications ADD COLUMN withdrawn_by VARCHAR(36) NULL;
ALTER TABLE applications ADD COLUMN withdraw_reason TEXT NULL;

ALTER TABLE tool_requests MODIFY COLUMN status ENUM('pending','approved','dispatched','returned','rejected','cancelled','withdrawn') DEFAULT 'pending';
ALTER TABLE tool_requests ADD COLUMN withdrawn_at DATETIME NULL;
ALTER TABLE tool_requests ADD COLUMN withdrawn_by VARCHAR(36) NULL;
ALTER TABLE tool_requests ADD COLUMN withdraw_reason TEXT NULL;

ALTER TABLE assignments MODIFY COLUMN status ENUM('pending','accepted','rejected','in_progress','completed','withdrawn') DEFAULT 'pending';
