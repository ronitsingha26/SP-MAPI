-- ============================================================
-- SP MAPI — Production MySQL Schema
-- Land Survey & Property Management System
-- Version: 2.0 | Date: July 2026 (Full Overhaul)
-- ============================================================

-- CREATE DATABASE IF NOT EXISTS spmapi_db;
-- USE spmapi_db;

-- ============================================================
-- MASTER DATA (Location & Hierarchy)
-- ============================================================
CREATE TABLE IF NOT EXISTS districts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  state      VARCHAR(100) NOT NULL DEFAULT 'Bihar',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_districts_state (state)
);

CREATE TABLE IF NOT EXISTS blocks (
  id VARCHAR(36) PRIMARY KEY,
  district_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS panchayats (
  id VARCHAR(36) PRIMARY KEY,
  block_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS villages (
  id VARCHAR(36) PRIMARY KEY,
  panchayat_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE CASCADE
);

-- ============================================================
-- SERVICES & PRICING
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
CREATE TABLE IF NOT EXISTS service_types (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) DEFAULT 0.00,
  unit_type ENUM('sqft', 'acre', 'katha', 'fixed') DEFAULT 'sqft',
  unit_price DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing_rules (
  id VARCHAR(36) PRIMARY KEY,
  service_id VARCHAR(36) NOT NULL,
  district_id INT NULL,
  modifier_type ENUM('multiplier', 'fixed_addition') DEFAULT 'multiplier',
  modifier_value DECIMAL(10,2) DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES service_types(id) ON DELETE CASCADE,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- ============================================================
-- RBAC (ROLES & PERMISSIONS)
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  module VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id VARCHAR(36) NOT NULL,
  permission_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ============================================================
-- USERS & ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS super_admins (
  id            VARCHAR(36) PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  mobile        VARCHAR(15)  NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME NULL,
  UNIQUE INDEX idx_super_admins_email (email),
  UNIQUE INDEX idx_super_admins_mobile (mobile)
);

CREATE TABLE IF NOT EXISTS admins (
  id            VARCHAR(36) PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  mobile        VARCHAR(15)  NOT NULL,
  status        ENUM('active','inactive','blocked') NOT NULL DEFAULT 'active',
  created_by    VARCHAR(36) NULL COMMENT 'ID of admin or superadmin who created this',
  last_login_at DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at    DATETIME NULL,
  UNIQUE INDEX idx_admins_email (email),
  INDEX idx_admins_status (status),
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admin_districts (
  admin_id    VARCHAR(36) NOT NULL,
  district_id INT NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (admin_id, district_id),
  INDEX idx_admin_districts_admin (admin_id),
  INDEX idx_admin_districts_district (district_id),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customers (
  id                   VARCHAR(36) PRIMARY KEY,
  customer_id_display  VARCHAR(20) NULL UNIQUE COMMENT 'e.g. SPMAPI-C-0001',
  name                 VARCHAR(150) NOT NULL,
  father_name          VARCHAR(150) NULL,
  mobile               VARCHAR(15)  NOT NULL,
  email                VARCHAR(255) NULL,
  password_hash        VARCHAR(255) NULL,
  aadhaar_number       VARCHAR(255) NULL,
  -- Location fields (expanded for profile auto-fill)
  state                VARCHAR(100) DEFAULT 'Bihar',
  district             VARCHAR(100) NULL,
  block                VARCHAR(100) NULL,
  village              VARCHAR(100) NULL,
  ward_number          VARCHAR(20)  NULL,
  panchayat            VARCHAR(100) NULL,
  mouja                VARCHAR(100) NULL,
  police_station       VARCHAR(100) NULL,
  pincode              VARCHAR(10)  NULL,
  address              TEXT NULL,
  -- Account fields
  status               ENUM('active','blocked','pending_verification') NOT NULL DEFAULT 'active',
  is_email_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  is_mobile_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  otp_code             VARCHAR(10) NULL,
  otp_expires_at       DATETIME NULL,
  primary_app_id       VARCHAR(50) NULL,
  profile_photo_url    VARCHAR(500) NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at           DATETIME NULL,
  UNIQUE INDEX idx_customers_mobile (mobile),
  UNIQUE INDEX idx_customers_email (email),
  INDEX idx_customers_district (district),
  INDEX idx_customers_status (status)
);

CREATE TABLE IF NOT EXISTS amins (
  id              VARCHAR(36) PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  mobile          VARCHAR(15)  NOT NULL,
  email           VARCHAR(255) NULL,
  password_hash   VARCHAR(255) NULL,
  district_id     INT NULL,
  district_name   VARCHAR(100) NULL,
  license_number  VARCHAR(100) NULL,
  status          ENUM('active','inactive','blocked') NOT NULL DEFAULT 'active',
  tasks_completed INT NOT NULL DEFAULT 0,
  active_tasks    INT NOT NULL DEFAULT 0,
  rating          DECIMAL(3,1) DEFAULT 5.0,
  created_by      VARCHAR(36) NULL,
  last_login_at   DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      DATETIME NULL,
  UNIQUE INDEX idx_amins_mobile (mobile),
  UNIQUE INDEX idx_amins_license (license_number),
  INDEX idx_amins_district (district_id),
  INDEX idx_amins_status (status),
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS amin_territories (
  id VARCHAR(255) PRIMARY KEY,
  amin_id VARCHAR(255) NOT NULL,
  district_id INT NULL,
  block_id VARCHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (amin_id) REFERENCES amins(id) ON DELETE CASCADE,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- ============================================================
-- APPLICATIONS & DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id                VARCHAR(36) PRIMARY KEY,
  app_id            VARCHAR(50) NOT NULL UNIQUE,
  service_type      ENUM('mapi','bantwara','map','tools') NOT NULL,
  customer_id       VARCHAR(36) NOT NULL,
  -- Applicant info (auto-filled from profile)
  applicant_name    VARCHAR(150) NOT NULL,
  applicant_mobile  VARCHAR(15)  NOT NULL,
  applicant_email   VARCHAR(255) NULL,
  father_name       VARCHAR(150) NULL,
  -- Location (auto-filled from profile)
  state             VARCHAR(100) NULL,
  district          VARCHAR(100) NULL,
  district_id       INT NULL,
  block_name        VARCHAR(150) NULL,
  block_id          INT NULL,
  panchayat         VARCHAR(150) NULL,
  village           VARCHAR(150) NULL,
  ward_name         VARCHAR(100) NULL,
  mouja_name        VARCHAR(100) NULL,
  police_station    VARCHAR(150) NULL,
  pincode           VARCHAR(10) NULL,
  -- Service-specific fields
  khata_number      VARCHAR(100) NULL,
  plot_number       VARCHAR(100) NULL,
  khasra_number     VARCHAR(100) NULL,
  land_area         DECIMAL(12,4) NULL,
  purpose           VARCHAR(200) NULL,
  remarks           TEXT NULL,
  -- Map-specific fields
  sheet_number      VARCHAR(100) NULL,
  cs_number         VARCHAR(100) NULL,
  rs_number         VARCHAR(100) NULL,
  ss_number         VARCHAR(100) NULL,
  -- Bantwara-specific
  co_owners         JSON NULL,
  court_case_number VARCHAR(100) NULL,
  vanshawali_details TEXT NULL,
  map_purpose       VARCHAR(50) NULL,
  no_of_days        INT NULL,
  area_type         VARCHAR(50) NULL,
  map_type          VARCHAR(50) NULL,
  thana_municipal   VARCHAR(100) NULL,
  mouja_ward        VARCHAR(100) NULL,
  no_of_sheets      INT NULL,
  
  -- Status & lifecycle
  status            ENUM('draft','pending','under_review','approved','assigned','in_progress','completed','delivered','rejected','cancelled','withdrawn') NOT NULL DEFAULT 'pending',
  status_history    JSON NOT NULL,
  admin_remark      TEXT NULL,
  -- Assignment
  assigned_amin_id  VARCHAR(36) NULL,
  amin_assigned_at  DATETIME NULL,
  -- Withdrawal
  withdrawn_at      DATETIME NULL,
  withdrawn_by      VARCHAR(36) NULL,
  withdraw_reason   TEXT NULL,
  -- Survey
  visit_date DATE NULL,
  visit_time        TIME NULL,
  -- Completion
  field_report_url  VARCHAR(500) NULL,
  completed_at      DATETIME NULL,
  completion_date   DATETIME NULL,
  -- Payment
  payment_required  DECIMAL(12,2) NULL,
  payment_status    ENUM('unpaid','paid','waived') DEFAULT 'unpaid',
  -- Tracking
  processed_by      VARCHAR(36) NULL,
  last_edited_by    VARCHAR(36) NULL,
  last_edited_at    DATETIME NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        DATETIME NULL,
  INDEX idx_apps_app_id (app_id),
  INDEX idx_apps_customer (customer_id),
  INDEX idx_apps_service_type (service_type),
  INDEX idx_apps_status (status),
  INDEX idx_apps_district (district),
  INDEX idx_apps_amin (assigned_amin_id),
  INDEX idx_apps_created_at (created_at DESC),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_amin_id) REFERENCES amins(id) ON DELETE SET NULL,
  FOREIGN KEY (processed_by) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id                  VARCHAR(36) PRIMARY KEY,
  application_id      VARCHAR(36) NOT NULL,
  customer_id         VARCHAR(36) NULL,
  doc_type            ENUM('aadhaar_front','aadhaar_back','land_document','vanshawali','khatiyan','kewala','original_deed','field_report','map_document','survey_photo','other') NOT NULL,
  original_name       VARCHAR(255) NOT NULL,
  stored_name         VARCHAR(255) NOT NULL,
  file_path           VARCHAR(500) NOT NULL,
  file_url            VARCHAR(500) NULL,
  file_size           BIGINT NULL,
  mime_type           VARCHAR(100) NULL,
  verification_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  verified_by         VARCHAR(36) NULL,
  verified_at         DATETIME NULL,
  rejection_reason    TEXT NULL,
  uploaded_by         VARCHAR(20) DEFAULT 'customer',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_docs_application (application_id),
  INDEX idx_docs_customer (customer_id),
  INDEX idx_docs_type (doc_type),
  INDEX idx_docs_verification (verification_status),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (verified_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- ============================================================
-- ASSIGNMENTS (Admin assigns Amin to application)
-- ============================================================
CREATE TABLE IF NOT EXISTS assignments (
  id              VARCHAR(36) PRIMARY KEY,
  application_id  VARCHAR(36) NOT NULL,
  amin_id         VARCHAR(36) NOT NULL,
  assigned_by     VARCHAR(36) NULL COMMENT 'Admin who assigned',
  survey_date     DATE NULL,
  survey_time     TIME NULL,
  priority        ENUM('low','normal','high','urgent') DEFAULT 'normal',
  remarks         TEXT NULL,
  status          ENUM('pending','accepted','rejected','in_progress','completed','withdrawn') DEFAULT 'pending',
  accepted_at     DATETIME NULL,
  started_at      DATETIME NULL,
  completed_at    DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_assign_app (application_id),
  INDEX idx_assign_amin (amin_id),
  INDEX idx_assign_status (status),
  INDEX idx_assign_date (survey_date),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (amin_id) REFERENCES amins(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- ============================================================
-- SURVEY REPORTS (Amin uploads after field visit)
-- ============================================================
CREATE TABLE IF NOT EXISTS survey_reports (
  id              VARCHAR(36) PRIMARY KEY,
  assignment_id   VARCHAR(36) NOT NULL,
  application_id  VARCHAR(36) NOT NULL,
  amin_id         VARCHAR(36) NOT NULL,
  gps_coordinates VARCHAR(100) NULL,
  survey_notes    TEXT NULL,
  final_report_url VARCHAR(500) NULL,
  map_pdf_url     VARCHAR(500) NULL,
  photos          JSON NULL COMMENT 'Array of photo URLs',
  remarks         TEXT NULL,
  submitted_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_by     VARCHAR(36) NULL COMMENT 'Admin who verified',
  verified_at     DATETIME NULL,
  verification_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  rejection_reason TEXT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sr_assignment (assignment_id),
  INDEX idx_sr_app (application_id),
  INDEX idx_sr_amin (amin_id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (amin_id) REFERENCES amins(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- ============================================================
-- TOOL REQUESTS (Service 4: Apply for Amin Tools)
-- ============================================================
CREATE TABLE IF NOT EXISTS tool_requests (
  id              VARCHAR(36) PRIMARY KEY,
  app_id          VARCHAR(50) NOT NULL UNIQUE,
  customer_id     VARCHAR(36) NOT NULL,
  tools           JSON NOT NULL COMMENT '[{name, quantity}]',
  payment_required DECIMAL(10,2) DEFAULT 0,
  remarks         TEXT NULL,
  status          ENUM('pending','approved','dispatched','returned','rejected','cancelled','withdrawn') DEFAULT 'pending',
  admin_remark    TEXT NULL,
  processed_by    VARCHAR(36) NULL,
  processed_at    DATETIME NULL,
  withdrawn_at    DATETIME NULL,
  withdrawn_by    VARCHAR(36) NULL,
  withdraw_reason TEXT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tr_customer (customer_id),
  INDEX idx_tr_status (status),
  INDEX idx_tr_app_id (app_id),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- ============================================================
-- ACTIVITY LOGS (Application lifecycle tracking — timeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  application_id  VARCHAR(36) NULL COMMENT 'NULL for non-application activities',
  tool_request_id VARCHAR(36) NULL,
  action          VARCHAR(100) NOT NULL,
  performed_by    VARCHAR(36) NULL,
  performer_type  ENUM('customer','admin','amin','system') NULL,
  performer_name  VARCHAR(150) NULL,
  old_status      VARCHAR(50) NULL,
  new_status      VARCHAR(50) NULL,
  remarks         TEXT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_al_app (application_id),
  INDEX idx_al_tool (tool_request_id),
  INDEX idx_al_action (action),
  INDEX idx_al_created (created_at DESC)
);

-- ============================================================
-- PAYMENTS & INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                  VARCHAR(36) PRIMARY KEY,
  payment_ref         VARCHAR(50)  NOT NULL UNIQUE,
  customer_id         VARCHAR(36) NULL,
  application_id      VARCHAR(36) NULL,
  razorpay_order_id   VARCHAR(100) UNIQUE NULL,
  razorpay_payment_id VARCHAR(100) UNIQUE NULL,
  razorpay_signature  VARCHAR(400) NULL,
  amount              DECIMAL(12,2) NOT NULL,
  currency            VARCHAR(10)  NOT NULL DEFAULT 'INR',
  payment_method      VARCHAR(50) NULL,
  payment_type        VARCHAR(100) NULL,
  status              ENUM('created','success','failed','refunded','pending') NOT NULL DEFAULT 'created',
  refund_id           VARCHAR(100) NULL,
  refund_amount       DECIMAL(12,2) NULL,
  refund_reason       TEXT NULL,
  refunded_at         DATETIME NULL,
  receipt_url         VARCHAR(500) NULL,
  paid_at             DATETIME NULL,
  notes               TEXT NULL,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payments_customer (customer_id),
  INDEX idx_payments_application (application_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_paid_at (paid_at DESC),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(36) PRIMARY KEY,
  application_id VARCHAR(36) NOT NULL,
  payment_id VARCHAR(36) NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id VARCHAR(36) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('unpaid', 'paid', 'cancelled') DEFAULT 'unpaid',
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================================
-- SYSTEM & UTILS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  mobile      VARCHAR(15)  NOT NULL,
  email       VARCHAR(255) NULL,
  subject     VARCHAR(200) NULL,
  message     TEXT NOT NULL,
  status      ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
  assigned_to VARCHAR(36) NULL,
  reply_text  TEXT NULL,
  replied_at  DATETIME NULL,
  ip_address  VARCHAR(45) NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status),
  INDEX idx_contact_created_at (created_at DESC),
  FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id             VARCHAR(36) PRIMARY KEY,
  user_id        VARCHAR(255) NOT NULL,
  user_type      ENUM('customer', 'amin', 'admin', 'superadmin', 'all') NOT NULL,
  title          VARCHAR(255) NOT NULL,
  message        TEXT NOT NULL,
  is_read        BOOLEAN DEFAULT FALSE,
  action_link    VARCHAR(255) NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_id    VARCHAR(36) NULL,
  actor_type  ENUM('customer','admin','amin','superadmin','system') NULL,
  actor_name  VARCHAR(150) NULL,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NULL,
  entity_id   VARCHAR(100) NULL,
  old_value   JSON NULL,
  new_value   JSON NULL,
  ip_address  VARCHAR(45) NULL,
  user_agent  TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_created_at (created_at DESC)
);

CREATE TABLE IF NOT EXISTS token_blacklist (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token_hash (token_hash),
  INDEX idx_token_expires (expires_at)
);

-- ============================================================
-- PROPERTY & PLOT SELLING MODULE
-- ============================================================
CREATE TABLE IF NOT EXISTS properties (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  block_name VARCHAR(100) NOT NULL,
  area_sqft DECIMAL(10,2) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  plot_type ENUM('residential', 'commercial', 'agricultural') DEFAULT 'residential',
  status ENUM('available', 'booked', 'sold') DEFAULT 'available',
  images JSON,
  admin_id VARCHAR(36),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_prop_dist (district),
  INDEX idx_prop_status (status)
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  property_id VARCHAR(36) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_booking_cust (customer_id),
  INDEX idx_booking_prop (property_id)
);

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT IGNORE INTO districts (name, state) VALUES
  ('Araria','Bihar'),('Arwal','Bihar'),('Aurangabad','Bihar'),
  ('Banka','Bihar'),('Begusarai','Bihar'),('Bhagalpur','Bihar'),
  ('Bhojpur','Bihar'),('Buxar','Bihar'),('Darbhanga','Bihar'),
  ('East Champaran','Bihar'),('Gaya','Bihar'),('Gopalganj','Bihar'),
  ('Jamui','Bihar'),('Jehanabad','Bihar'),('Kaimur','Bihar'),
  ('Katihar','Bihar'),('Khagaria','Bihar'),('Kishanganj','Bihar'),
  ('Lakhisarai','Bihar'),('Madhepura','Bihar'),('Madhubani','Bihar'),
  ('Munger','Bihar'),('Muzaffarpur','Bihar'),('Nalanda','Bihar'),
  ('Nawada','Bihar'),('Patna','Bihar'),('Purnia','Bihar'),
  ('Rohtas','Bihar'),('Saharsa','Bihar'),('Samastipur','Bihar'),
  ('Saran','Bihar'),('Sheikhpura','Bihar'),('Sheohar','Bihar'),
  ('Sitamarhi','Bihar'),('Siwan','Bihar'),('Supaul','Bihar'),
  ('Vaishali','Bihar'),('West Champaran','Bihar'),
  ('Bokaro','Jharkhand'),('Chatra','Jharkhand'),('Deoghar','Jharkhand'),
  ('Dhanbad','Jharkhand'),('Dumka','Jharkhand'),('East Singhbhum','Jharkhand'),
  ('Garhwa','Jharkhand'),('Giridih','Jharkhand'),('Godda','Jharkhand'),
  ('Gumla','Jharkhand'),('Hazaribagh','Jharkhand'),('Jamtara','Jharkhand'),
  ('Khunti','Jharkhand'),('Koderma','Jharkhand'),('Latehar','Jharkhand'),
  ('Lohardaga','Jharkhand'),('Pakur','Jharkhand'),('Palamu','Jharkhand'),
  ('Ramgarh','Jharkhand'),('Ranchi','Jharkhand'),('Sahebganj','Jharkhand'),
  ('Seraikela Kharsawan','Jharkhand'),('Simdega','Jharkhand'),
  ('West Singhbhum','Jharkhand');

INSERT IGNORE INTO service_types (id, name, display_name, description, base_price, unit_type, unit_price, is_active)
VALUES
(UUID(), 'mapi', 'Land Measurement (Mapi)', 'Measure property boundaries, dimensions, area', 0.00, 'sqft', 3.00, TRUE),
(UUID(), 'bantwara', 'Land Partition (Bantwara)', 'Legal division of jointly-held property among co-owners', 0.00, 'sqft', 5.00, TRUE),
(UUID(), 'map', 'Map Provision', 'Generate/provide official land maps, digital mapping', 0.00, 'fixed', 0.00, TRUE),
(UUID(), 'tools', 'Amin Tools Request', 'Request surveying tools and equipment', 0.00, 'fixed', 0.00, TRUE);

INSERT IGNORE INTO super_admins (id, name, email, password_hash, mobile)
SELECT
  UUID(),
  'Super Admin',
  'superadmin@spmapi.in',
  '$2a$10$G.pwtjfRrMAK7qD5PA0nf.v0F9Synhc0T00q0fiGb9.XEXvG9Zkhq',
  '9999999999'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM super_admins LIMIT 1);

-- ============================================================
-- AMIN APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS amin_applications (
  id VARCHAR(36) PRIMARY KEY,
  app_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  father_name VARCHAR(100) NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  block_name VARCHAR(100) NOT NULL,
  village VARCHAR(100) NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  highest_qualification VARCHAR(100) NOT NULL,
  experience_years INT DEFAULT 0,
  previous_organization VARCHAR(255),
  documents JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_remark TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_amin_app_mobile (mobile),
  INDEX idx_amin_app_email (email),
  INDEX idx_amin_app_id (app_id)
);
