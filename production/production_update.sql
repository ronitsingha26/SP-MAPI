-- Run this file in your Hostinger phpMyAdmin to update the existing tables!
ALTER TABLE customers CHANGE mouza mouja VARCHAR(100) NULL;
ALTER TABLE applications CHANGE mouza_name mouja_name VARCHAR(100) NULL;
ALTER TABLE applications ADD COLUMN no_of_days INT NULL AFTER map_purpose;
ALTER TABLE applications ADD COLUMN area_type VARCHAR(50) NULL AFTER no_of_days;
ALTER TABLE applications ADD COLUMN map_type VARCHAR(50) NULL AFTER area_type;
ALTER TABLE applications ADD COLUMN thana_municipal VARCHAR(100) NULL AFTER map_type;
ALTER TABLE applications ADD COLUMN mouja_ward VARCHAR(100) NULL AFTER thana_municipal;
ALTER TABLE applications ADD COLUMN no_of_sheets INT NULL AFTER mouja_ward;

-- Add password_hash to amin_applications
ALTER TABLE amin_applications ADD COLUMN password_hash VARCHAR(255) NULL;
