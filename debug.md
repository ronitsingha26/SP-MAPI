# SP MAPI - Debugging Changelog & Fix History

This document serves as a running debug log for the SP MAPI project. It maintains a comprehensive record of all bug fixes, enhancements, and configuration changes applied during debugging sessions to provide context for future developers.

---

## 🛠 Completed Fixes

### 1. Development Environment Rate Limiting
- **Date:** 2026-07-07
- **Module:** Backend / Security
- **Problem Description:** The application frequently displayed "Too many requests. Please try again in 15 minutes." during local development testing, blocking logins and API interactions.
- **Root Cause:** Production-grade `express-rate-limit` settings (200 reqs/15m, 20 logins/15m) were universally applied, which easily triggered blocks during hot-reloads and rapid local testing.
- **Solution Implemented:** Added environment awareness (`process.env.NODE_ENV !== 'production'`) to the rate limiters, using the `skip: () => isDev` property to bypass rate limits entirely when running locally.
- **Files Modified:**
  - `backend/server.js`
- **Current Status:** Fixed
- **Additional Notes:** Production limits remain completely unchanged and secure.

### 2. My Profile Card Alignment
- **Date:** 2026-07-07
- **Module:** Customer Portal
- **Problem Description:** The customer profile card was misaligned and not properly centered on the screen.
- **Root Cause:** Missing horizontal margin utility classes in the responsive layout container.
- **Solution Implemented:** Appended the Tailwind `mx-auto` class to the main container holding the profile card to perfectly center it on all viewport widths.
- **Files Modified:**
  - `frontend/src/pages/customer/CustomerProfilePage.jsx`
- **Current Status:** Fixed

### 3. Apply for Batwara — District Validation Error
- **Date:** 2026-07-07
- **Module:** Customer Portal (Services)
- **Problem Description:** Customers could not progress past the Location Details form to upload documents, receiving a false "Please select a district" validation error even when a district was selected.
- **Root Cause:** The validation logic on the "Next" button was explicitly checking the internal state for `districtId` and `blockId`, which were never populated because the form dropdowns only set `districtName` and `blockName`.
- **Solution Implemented:** Updated the form validation condition to verify the correct state fields (`districtName` and `blockName`).
- **Files Modified:**
  - `frontend/src/pages/customer/services/CustomerBantwaraForm.jsx`
- **Current Status:** Fixed

### 4. Apply for Batwara — Land Area Mandatory Validation
- **Date:** 2026-07-07
- **Module:** Customer Portal (Services)
- **Problem Description:** The "Land Area (sq. ft.)" field was an optional field, allowing users to proceed without specifying land size.
- **Root Cause:** Missing `required` attribute on the FormField and absent validation checks.
- **Solution Implemented:** Added the `required` prop to display the red asterisk and inserted a new `else if` validation check that blocks navigation and sets an error message if `form.landArea` is empty.
- **Files Modified:**
  - `frontend/src/pages/customer/services/CustomerBantwaraForm.jsx`
- **Current Status:** Fixed (Enhancement)

### 5. Apply for Batwara — Submission Fails After Document Upload
- **Date:** 2026-07-07
- **Module:** Backend / File Uploads
- **Problem Description:** Attempting to submit the Batwara application failed with an `ENOENT: no such file or directory, open 'uploads/misc/...'` backend error.
- **Root Cause:** The `multer` storage configuration dynamically routed generic documents (like `khatiyan` and `vanshawali`) to a `misc` folder. However, `uploads/misc` was never created during app initialization, causing `multer` to crash when attempting to save the file.
- **Solution Implemented:** Modified the `destination` callback in the multer configuration to dynamically check for and recursively create (`fs.mkdirSync(..., { recursive: true })`) the target destination folder before saving the file.
- **Files Modified:**
  - `backend/src/middleware/upload.js`
- **Current Status:** Fixed

### 6. Super Admin — Unable to Add Amin
- **Date:** 2026-07-07
- **Module:** Super Admin Portal
- **Problem Description:** Super Admins were blocked from creating new Amins. The UI displayed a "Related record not found." alert.
- **Root Cause:** Foreign Key Constraint Failure. The `amins` table requires the `created_by` field to reference a valid ID in the `admins` table. Since a Super Admin ID does not exist in the regular `admins` table, MySQL threw an `ER_NO_REFERENCED_ROW_2` error.
- **Solution Implemented:** Updated the `adminController.js` logic to detect if the user role is `superadmin`. If so, it passes `null` instead of `req.user.id` for the `created_by` field, bypassing the strict foreign key validation while maintaining referential integrity.
- **Files Modified:**
  - `backend/src/controllers/adminController.js`
- **Current Status:** Fixed

### 7. Super Admin — Documents Management Missing Uploads
- **Date:** 2026-07-07
- **Module:** Super Admin Portal
- **Problem Description:** The Documents Management page displayed "No documents uploaded yet" and counts were locked at zero, despite customers actively uploading files to applications.
- **Root Cause:** The frontend extracts documents from a `/admin/applications` API call. However, the backend application retrieval repository (`adminRepository.getApplicationsAll`) completely omitted fetching documents from the database.
- **Solution Implemented:** 
  - Added a new `getDocumentsForApplications(appIds)` method to `adminRepository.js`.
  - Updated `adminService.getApplications` to fetch all associated documents in a secondary query, group them by `application_id`, and embed them into each application object prior to returning the response.
- **Files Modified:**
  - `backend/src/repositories/adminRepository.js`
  - `backend/src/services/adminService.js`
- **Current Status:** Fixed

### 8. Super Admin — Incorrect User Data in "All Users" (Admins Tab)
- **Date:** 2026-07-07
- **Module:** Super Admin Portal
- **Problem Description:** Selecting the "Admins" tab inside the All Users dashboard displayed customer records instead of Administrator accounts.
- **Root Cause:** The frontend did not explicitly map an `admins` tab, and the backend repository (`superadminRepository.js`) treated anything other than `amins` as a fallback request for `customers`.
- **Solution Implemented:** 
  - Added `'admins'` to the frontend user type tabs array.
  - Implemented an `else if (type === 'admins')` clause in the backend SQL generation to explicitly query the `admins` database table.
- **Files Modified:**
  - `frontend/src/pages/superadmin/SuperAdminUsersPage.jsx`
  - `backend/src/repositories/superadminRepository.js`
- **Current Status:** Fixed

---

## 📌 Pending Issues

*No known pending issues or unresolved bugs exist from this debugging session. All reported issues have been documented and fixed above. Please append any new known issues here.*
