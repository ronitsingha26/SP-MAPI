const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, LevelFormat, Header, Footer,
  TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ─── Colour Palette ───────────────────────────────────────────────
const DARK_BLUE   = "1B3A5C";
const MID_BLUE    = "2E6DA4";
const LIGHT_BLUE  = "D6E8F5";
const ACCENT      = "E8F4FD";
const HEADER_BG   = "1B3A5C";
const HEADER_TXT  = "FFFFFF";
const ROW_ALT     = "F0F7FF";
const BORDER_CLR  = "AACDE8";
const GREEN_BG    = "E6F4EA";
const ORANGE_BG   = "FFF3E0";

// ─── Helpers ──────────────────────────────────────────────────────
const border = (color = BORDER_CLR) => ({ style: BorderStyle.SINGLE, size: 4, color });
const cellBorders = (color = BORDER_CLR) => ({
  top: border(color), bottom: border(color), left: border(color), right: border(color)
});
const noBorder = () => ({
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }
});

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: MID_BLUE, space: 4 } },
    children: [new TextRun({ text, bold: true, color: DARK_BLUE, size: 32, font: "Arial" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, bold: true, color: MID_BLUE, size: 26, font: "Arial" })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [new TextRun({ text, bold: true, color: DARK_BLUE, size: 22, font: "Arial" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 21, font: "Arial", color: "333333", ...opts })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 21, font: "Arial", color: "333333" })]
  });
}

function spacer(lines = 1) {
  return Array.from({ length: lines }, () =>
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun("")] })
  );
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ─── Table Helpers ────────────────────────────────────────────────
function twoColTable(rows, col1W = 3200, col2W = 6160) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [col1W, col2W],
    rows: rows.map(([c1, c2, isHeader]) =>
      new TableRow({
        tableHeader: !!isHeader,
        children: [
          new TableCell({
            borders: cellBorders(),
            width: { size: col1W, type: WidthType.DXA },
            shading: isHeader
              ? { fill: HEADER_BG, type: ShadingType.CLEAR }
              : { fill: "FFFFFF", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [new Paragraph({
              children: [new TextRun({
                text: c1, bold: true, size: 20, font: "Arial",
                color: isHeader ? HEADER_TXT : DARK_BLUE
              })]
            })]
          }),
          new TableCell({
            borders: cellBorders(),
            width: { size: col2W, type: WidthType.DXA },
            shading: isHeader
              ? { fill: HEADER_BG, type: ShadingType.CLEAR }
              : { fill: "FAFCFF", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [new Paragraph({
              children: [new TextRun({
                text: c2, size: 20, font: "Arial",
                color: isHeader ? HEADER_TXT : "333333"
              })]
            })]
          })
        ]
      })
    )
  });
}

function threeColTable(rows, w1 = 1500, w2 = 4500, w3 = 3360) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [w1, w2, w3],
    rows: rows.map(([c1, c2, c3, isHeader], idx) =>
      new TableRow({
        tableHeader: !!isHeader,
        children: [c1, c2, c3].map((txt, ci) => {
          const w = [w1, w2, w3][ci];
          const fill = isHeader ? HEADER_BG : (idx % 2 === 0 ? "FFFFFF" : ROW_ALT);
          return new TableCell({
            borders: cellBorders(),
            width: { size: w, type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [new Paragraph({
              children: [new TextRun({
                text: txt, size: 20, font: "Arial",
                bold: isHeader || ci === 0,
                color: isHeader ? HEADER_TXT : "333333"
              })]
            })]
          });
        })
      })
    )
  });
}

function moduleFeatureTable(featureRows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      makeCell("Feature", 3600, HEADER_BG, HEADER_TXT, true),
      makeCell("Description", 5760, HEADER_BG, HEADER_TXT, true)
    ]
  });
  const dataRows = featureRows.map(([f, d], i) =>
    new TableRow({
      children: [
        makeCell(f, 3600, i % 2 === 0 ? LIGHT_BLUE : "FFFFFF", DARK_BLUE, true),
        makeCell(d, 5760, i % 2 === 0 ? ACCENT : "FAFCFF", "333333", false)
      ]
    })
  );
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3600, 5760],
    rows: [headerRow, ...dataRows]
  });
}

function makeCell(text, width, fill, color, bold) {
  return new TableCell({
    borders: cellBorders(),
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20, font: "Arial", bold, color })]
    })]
  });
}

// ─── Cover Page ───────────────────────────────────────────────────
function coverPage() {
  return [
    ...spacer(3),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 80 },
      children: [new TextRun({ text: "BN INTELHUB PVT. LTD.", bold: true, size: 40, font: "Arial", color: DARK_BLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 240 },
      children: [new TextRun({ text: "Innovations in Training, Software, AI & Robotics", size: 22, font: "Arial", color: "666666" })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 }
      },
      spacing: { before: 160, after: 160 },
      children: [new TextRun({ text: "SOFTWARE REQUIREMENTS SPECIFICATION", bold: true, size: 44, font: "Arial", color: DARK_BLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [new TextRun({ text: "Real Estate & Land Measurement Management Portal", bold: true, size: 34, font: "Arial", color: MID_BLUE })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 320 },
      children: [new TextRun({ text: "Dynamic Web Application", size: 24, font: "Arial", color: "666666" })]
    }),
    ...spacer(2),
    twoColTable([
      ["Project Reference", "BN-2026-RE-001", false],
      ["Document Version", "1.0", false],
      ["Date", "June 18, 2026", false],
      ["Prepared By", "BN Intelhub Pvt. Ltd.", false],
      ["Document Type", "Software Requirements Specification (SRS)", false],
      ["Methodology", "IEEE 830 Standard", false],
      ["Technology Stack", "React.js + Node.js + Express + MongoDB/PostgreSQL", false],
    ], 2800, 6560),
    ...spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [new TextRun({ text: "Contact Information", bold: true, size: 22, font: "Arial", color: DARK_BLUE })]
    }),
    twoColTable([
      ["Email", "bnintelhub@gmail.com | bnintelhub.services@gmail.com", false],
      ["Phone", "+91 8936078905 | +91 9041289863", false],
      ["Website", "www.bnintelhub.com", false],
      ["Address", "STPI- Plot -8 Part, Namkum Industrial Area, Ranchi 834010", false],
      ["CIN", "U62013JH2024PTC023651", false],
      ["GST", "20AANCB0998E1ZR", false],
    ], 2800, 6560),
    pageBreak()
  ];
}

// ─── Document Revision ────────────────────────────────────────────
function revisionHistory() {
  return [
    heading1("1. Document Revision History"),
    spacer(1)[0],
    threeColTable([
      ["Version", "Date", "Description / Changes", true],
      ["1.0", "June 18, 2026", "Initial SRS document created based on Quotation BN-2026-RE-001", false],
    ], 1400, 2560, 5400),
    pageBreak()
  ];
}

// ─── Introduction ─────────────────────────────────────────────────
function introduction() {
  return [
    heading1("2. Introduction"),
    heading2("2.1 Purpose"),
    para("This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the Real Estate & Land Measurement Management Portal. It is intended for use by the development team at BN Intelhub Pvt. Ltd., project stakeholders, and the client, to establish a shared understanding of the system's scope, behavior, and constraints."),
    spacer(1)[0],
    heading2("2.2 Project Overview"),
    para("BN Intelhub Pvt. Ltd. proposes to develop a Modern Real Estate & Land Services Platform catering to plot selling, land measurement services, map preparation, and online booking management. The platform is inspired by the workflow and service structure of the eMapi Bihar Portal but is fully customized to meet the client's business requirements."),
    spacer(1)[0],
    heading2("2.3 Scope"),
    para("The system encompasses the following major components:"),
    bullet("Public-facing landing website with property listings and search"),
    bullet("Customer Panel with OTP login, dashboard, booking, and payments"),
    bullet("Admin Panel for managing properties, customers, bookings, and amins"),
    bullet("Amin (field surveyor) Management System"),
    bullet("Super Admin Panel with full system control"),
    bullet("Payment gateway integration (Razorpay)"),
    bullet("Document upload, verification, and PDF receipt generation"),
    bullet("SMS and email notification system"),
    spacer(1)[0],
    heading2("2.4 Definitions, Acronyms, and Abbreviations"),
    threeColTable([
      ["Term", "Full Form", "Meaning", true],
      ["SRS", "Software Requirements Spec.", "This document", false],
      ["OTP", "One-Time Password", "Mobile-based authentication code", false],
      ["Amin", "—", "A licensed land surveyor / field measurement officer", false],
      ["RBAC", "Role-Based Access Control", "Permission system based on user roles", false],
      ["API", "Application Programming Interface", "Backend service endpoints", false],
      ["VPS", "Virtual Private Server", "Cloud hosting infrastructure", false],
      ["GST", "Goods & Services Tax", "Indian indirect tax applied to the project", false],
      ["AMC", "Annual Maintenance Contract", "Yearly support & maintenance agreement", false],
      ["UI/UX", "User Interface / Experience", "Front-end design layer", false],
      ["JWT", "JSON Web Token", "Token-based authentication mechanism", false],
    ], 1400, 3200, 4760),
    spacer(1)[0],
    heading2("2.5 References"),
    bullet("Quotation Document: BN-2026-RE-001 (May 25, 2026)"),
    bullet("eMapi Bihar Portal — workflow & service structure reference"),
    bullet("IEEE 830-1998 — SRS Standard"),
    bullet("Razorpay Developer Documentation"),
    pageBreak()
  ];
}

// ─── Overall Description ──────────────────────────────────────────
function overallDescription() {
  return [
    heading1("3. Overall System Description"),
    heading2("3.1 Product Perspective"),
    para("The platform is a standalone, cloud-hosted web application accessible via modern browsers on desktop and mobile devices. It interfaces with third-party services including Razorpay (payments), SMS gateways (OTP), and email services (notifications). The system maintains its own database and does not depend on existing legacy systems."),
    spacer(1)[0],
    heading2("3.2 Product Features Summary"),
    threeColTable([
      ["#", "Feature Category", "Key Capabilities", true],
      ["1", "Plot Selling Management", "District-wise listings, search/filter, online booking", false],
      ["2", "Land Measurement Services", "Amin hiring, maapi/division/boundary/map service requests", false],
      ["3", "Customer Portal", "OTP login, dashboard, booking history, document upload, payments", false],
      ["4", "Admin Portal", "Multi-admin, district-wise access, amin assignment, reports", false],
      ["5", "Amin Portal", "Task dashboard, field reports, map uploads, status updates", false],
      ["6", "Super Admin Portal", "Full system control, analytics, security configuration", false],
      ["7", "Payment System", "Razorpay — UPI, Card, Net Banking, Wallets", false],
      ["8", "Security & Compliance", "SSL, JWT, RBAC, encrypted database, daily backups", false],
    ], 800, 3000, 5560),
    spacer(1)[0],
    heading2("3.3 User Classes and Characteristics"),
    moduleFeatureTable([
      ["Public / Guest User", "Browses property listings, views service info, no login required"],
      ["Customer", "Registers via OTP, books plots, requests land services, uploads documents, makes payments"],
      ["Amin (Field Surveyor)", "Receives task assignments, updates field status, uploads measurement maps/reports"],
      ["District Admin", "Manages properties and bookings for an assigned district; limited access scope"],
      ["Super Admin", "Full platform control; manages all admins, districts, financial data, and system settings"],
    ]),
    spacer(1)[0],
    heading2("3.4 Operating Environment"),
    threeColTable([
      ["Attribute", "Specification", "Notes", true],
      ["Frontend", "React.js (SPA)", "Mobile-responsive, cross-browser compatible"],
      ["Backend", "Node.js + Express", "RESTful API architecture"],
      ["Database", "MongoDB / PostgreSQL", "Dual-option based on client preference"],
      ["Hosting", "Cloud VPS Server", "SSL-secured, load-balanced"],
      ["Authentication", "OTP + JWT", "Stateless session management"],
      ["Browser Support", "Chrome, Firefox, Safari, Edge", "Latest 2 versions"],
      ["Mobile", "Responsive Web (iOS & Android)", "No separate app required"],
    ], 2400, 3500, 3460),
    spacer(1)[0],
    heading2("3.5 Design and Implementation Constraints"),
    bullet("Domain and server charges are separate from the project cost."),
    bullet("Third-party API charges (SMS/OTP/Payment Gateway) will be borne by the client."),
    bullet("Source code ownership transfers only after full payment clearance."),
    bullet("Major feature additions post-approval will be charged separately."),
    bullet("Project delivery timeline depends on timely content/feedback from the client."),
    pageBreak()
  ];
}

// ─── Functional Requirements ──────────────────────────────────────
function functionalRequirements() {
  return [
    heading1("4. Functional Requirements"),

    // 4.1 Public Website
    heading2("4.1 Module 1: Public Website / Landing Portal"),
    para("The landing portal is the primary public-facing interface. It must be SEO-optimized, mobile-responsive, and capable of serving property information to unauthenticated visitors."),
    spacer(1)[0],
    moduleFeatureTable([
      ["Home Page", "Hero section, featured plots, service highlights, CTA buttons"],
      ["District-wise Browsing", "Filter properties by district/tehsil/area; sortable listing grid"],
      ["Plot Search & Filter", "Search by area size, price range, plot type, availability status"],
      ["Service Pages", "Detail pages for Maapi, Division, Map Preparation, Boundary Survey"],
      ["About & Contact", "Company info, team details, enquiry form, Google Maps embed"],
      ["SEO Optimization", "Meta tags, structured data, sitemap.xml, robots.txt, fast load time"],
      ["Responsive Design", "Mobile-first layout; works on screens 320px and above"],
      ["Enquiry / Callback Form", "Lead capture form; data saved in admin dashboard"],
    ]),
    spacer(1)[0],

    // 4.2 Customer Panel
    heading2("4.2 Module 2: Customer Panel"),
    para("Registered customers can manage bookings, track service requests, upload documents, and complete payments through a personalized dashboard."),
    spacer(1)[0],
    moduleFeatureTable([
      ["OTP Registration & Login", "Mobile number-based registration; OTP sent via SMS; JWT session"],
      ["Customer Dashboard", "Overview of bookings, active requests, payment status, documents"],
      ["Online Plot Booking", "Select plot > view details > confirm booking > pay online"],
      ["Service Requests", "Request Maapi (measurement), Division, Map Preparation, Boundary Survey"],
      ["Service Status Tracking", "Real-time tracking: Pending > Assigned > In Progress > Completed"],
      ["Document Upload", "Upload Aadhaar card, land documents, ownership proof (PDF/JPG/PNG)"],
      ["Document Verification Status", "View approval/rejection status of uploaded documents"],
      ["Payment Gateway", "Razorpay integration: UPI, Credit/Debit Card, Net Banking, Wallets"],
      ["Payment History", "View all past transactions with date, amount, status, receipt"],
      ["PDF Receipt Download", "Auto-generated PDF receipt for every successful payment"],
      ["Notifications", "SMS and email alerts for booking confirmation, status updates, payments"],
      ["Profile Management", "Edit personal details, contact info, change linked mobile number"],
    ]),
    spacer(1)[0],

    // 4.3 Admin Panel
    heading2("4.3 Module 3: Admin Panel"),
    para("Admins are assigned at the district level and manage all operational activities within their jurisdiction."),
    spacer(1)[0],
    moduleFeatureTable([
      ["Admin Login", "Secure login with credentials set by Super Admin; role-based access"],
      ["Multiple Admin Management", "Each admin scoped to one or more districts"],
      ["Property & Plot Management", "Add, edit, delete, activate/deactivate plots; upload photos, price, area details"],
      ["Customer Management", "View all registered customers; filter by district, booking status"],
      ["Booking Management", "View, approve, or reject plot bookings; update booking status"],
      ["Service Request Management", "View incoming service requests; assign to Amin; track progress"],
      ["Amin Assignment", "Assign field surveyors to specific service requests"],
      ["Document Verification", "Review and approve/reject customer-uploaded documents"],
      ["Payment Tracking", "View all payments under assigned districts; export to CSV/Excel"],
      ["Report Generation", "Generate booking, revenue, and service reports by date range"],
      ["Notification Management", "Send manual SMS/email notifications to customers"],
    ]),
    spacer(1)[0],

    // 4.4 Amin Management
    heading2("4.4 Module 4: Amin Management"),
    para("The Amin module manages field surveyors who execute on-ground land measurement and map preparation services."),
    spacer(1)[0],
    moduleFeatureTable([
      ["Amin Registration", "Admin adds Amin with name, ID, district, contact details, and credentials"],
      ["Amin Dashboard", "Personal dashboard showing assigned tasks, deadlines, completion status"],
      ["Task Assignment", "Admin assigns service requests to available Amins by district"],
      ["Field Work Tracking", "Amin updates task status: Accepted > In Progress > Completed"],
      ["Map / Report Upload", "Amin uploads measurement maps, sketches, and completion reports"],
      ["Customer Communication", "In-system messaging or call support to coordinate with customer"],
      ["Task History", "View all past assignments with outcome and date"],
      ["Geo-tagging Support", "(Optional) Capture GPS coordinates of measurement site"],
    ]),
    spacer(1)[0],

    // 4.5 Super Admin Panel
    heading2("4.5 Module 5: Super Admin Panel"),
    para("The Super Admin has unrestricted access across all modules, districts, and system configurations."),
    spacer(1)[0],
    moduleFeatureTable([
      ["Master Dashboard", "High-level overview: total users, revenue, active bookings, service stats"],
      ["Admin Management", "Create, update, deactivate, or delete district admins"],
      ["District Configuration", "Add/edit districts, assign admins, configure district-level settings"],
      ["User Monitoring", "View all customers, Amins, and admins; filter and export"],
      ["Financial Reports & Analytics", "Platform-wide revenue, payment trends, pending settlements"],
      ["Service Configuration", "Add, edit, or disable service types (Maapi, Division, etc.)"],
      ["Role & Permission Management", "Configure RBAC permissions for each role"],
      ["System Security Settings", "Manage API keys, SSL renewals, database backup schedule"],
      ["Audit Logs", "Track all admin and Super Admin actions with timestamps"],
      ["Announcement / Broadcast", "Send system-wide SMS/email announcements to all users"],
    ]),
    spacer(1)[0],

    // 4.6 Additional Features
    heading2("4.6 Module 6: Additional / Cross-Cutting Features"),
    moduleFeatureTable([
      ["SMS & Email Notifications", "Triggered on: registration, booking, payment, status change, document verification"],
      ["PDF Receipt Generation", "Auto-generated on payment success; downloadable by customer"],
      ["Data Backup System", "Automated daily cloud backups; 30-day retention policy"],
      ["Role-Based Access Control", "5 roles: Public, Customer, Amin, Admin, Super Admin — each with scoped permissions"],
      ["Secure Database Architecture", "Encrypted at rest; parameterized queries to prevent SQL injection"],
      ["SSL Security", "HTTPS enforced on all routes; HSTS headers enabled"],
      ["Cloud VPS Deployment", "Hosted on managed cloud VPS with auto-scaling support"],
      ["Mobile Responsive Design", "Fluid grid layout for all screen sizes from 320px to 4K"],
      ["Error Logging & Monitoring", "Server-side error logs; optional integration with Sentry/LogRocket"],
      ["Session Management", "JWT tokens with configurable expiry; refresh token support"],
    ]),
    pageBreak()
  ];
}

// ─── Non-Functional Requirements ─────────────────────────────────
function nonFunctionalRequirements() {
  return [
    heading1("5. Non-Functional Requirements"),
    threeColTable([
      ["Requirement", "Category", "Specification", true],
      ["Performance", "Response Time", "Page load < 3 seconds on standard broadband; API response < 500ms"],
      ["Scalability", "Concurrent Users", "Support minimum 500 concurrent users; horizontally scalable"],
      ["Availability", "Uptime SLA", "99.5% uptime guaranteed excluding scheduled maintenance"],
      ["Security", "Authentication", "OTP + JWT; HTTPS everywhere; password hashing (bcrypt)"],
      ["Security", "Data Protection", "Encrypted database fields for sensitive PII; RBAC enforced"],
      ["Maintainability", "Code Quality", "MVC architecture; modular codebase; inline documentation"],
      ["Portability", "Deployment", "Dockerized deployment; cloud-agnostic VPS hosting"],
      ["Usability", "Accessibility", "WCAG 2.1 AA compliance; keyboard navigability"],
      ["Backup", "Recovery", "Daily automated backups; RPO < 24 hours; RTO < 4 hours"],
      ["Compliance", "Legal", "GST-compliant invoice generation; data retention policy"],
    ], 2400, 2500, 4460),
    pageBreak()
  ];
}

// ─── API Endpoints ────────────────────────────────────────────────
function apiDesign() {
  return [
    heading1("6. API Design — Key Endpoints"),
    heading2("6.1 Authentication APIs"),
    threeColTable([
      ["Method", "Endpoint", "Description", true],
      ["POST", "/api/auth/send-otp", "Send OTP to customer mobile number"],
      ["POST", "/api/auth/verify-otp", "Verify OTP and issue JWT token"],
      ["POST", "/api/auth/admin/login", "Admin/Super Admin login with credentials"],
      ["POST", "/api/auth/logout", "Invalidate JWT session token"],
    ], 1200, 3600, 4560),
    spacer(1)[0],
    heading2("6.2 Customer APIs"),
    threeColTable([
      ["Method", "Endpoint", "Description", true],
      ["GET", "/api/customer/profile", "Get customer profile details"],
      ["PUT", "/api/customer/profile", "Update customer profile"],
      ["GET", "/api/customer/bookings", "List all bookings by customer"],
      ["POST", "/api/customer/bookings", "Create new plot booking"],
      ["GET", "/api/customer/services", "List all service requests"],
      ["POST", "/api/customer/services", "Raise new land service request"],
      ["POST", "/api/customer/documents", "Upload document (multipart/form-data)"],
      ["GET", "/api/customer/payments", "Payment history"],
    ], 1200, 3600, 4560),
    spacer(1)[0],
    heading2("6.3 Property / Listings APIs"),
    threeColTable([
      ["Method", "Endpoint", "Description", true],
      ["GET", "/api/properties", "Public: get all active listings (filterable)"],
      ["GET", "/api/properties/:id", "Public: get single property detail"],
      ["POST", "/api/admin/properties", "Admin: create new property/plot"],
      ["PUT", "/api/admin/properties/:id", "Admin: update property"],
      ["DELETE", "/api/admin/properties/:id", "Admin: soft-delete property"],
    ], 1200, 3600, 4560),
    spacer(1)[0],
    heading2("6.4 Admin & Amin APIs"),
    threeColTable([
      ["Method", "Endpoint", "Description", true],
      ["GET", "/api/admin/customers", "List all customers in assigned district"],
      ["GET", "/api/admin/service-requests", "View all pending/active service requests"],
      ["POST", "/api/admin/assign-amin", "Assign service request to an Amin"],
      ["GET", "/api/amin/tasks", "Amin: view assigned tasks"],
      ["PUT", "/api/amin/tasks/:id/status", "Amin: update task status"],
      ["POST", "/api/amin/tasks/:id/upload", "Amin: upload field report/map"],
      ["GET", "/api/admin/reports", "Generate revenue/booking reports by date range"],
    ], 1200, 3600, 4560),
    spacer(1)[0],
    heading2("6.5 Payment APIs"),
    threeColTable([
      ["Method", "Endpoint", "Description", true],
      ["POST", "/api/payment/create-order", "Create Razorpay order for a booking"],
      ["POST", "/api/payment/verify", "Verify Razorpay payment signature"],
      ["GET", "/api/payment/receipt/:id", "Generate and download PDF receipt"],
    ], 1200, 3600, 4560),
    pageBreak()
  ];
}

// ─── Database Design ──────────────────────────────────────────────
function databaseDesign() {
  return [
    heading1("7. Database Design — Core Collections / Tables"),
    heading2("7.1 Users (Customers)"),
    threeColTable([
      ["Field", "Type", "Description", true],
      ["_id / id", "ObjectId / UUID", "Primary key"],
      ["name", "String", "Full name of the customer"],
      ["mobile", "String (unique)", "Registered mobile number"],
      ["email", "String", "Email address"],
      ["aadhaar_number", "String (encrypted)", "Aadhaar ID (masked display)"],
      ["district", "String", "District of residence"],
      ["status", "Enum", "active | blocked"],
      ["created_at", "Timestamp", "Account registration date"],
    ], 2200, 2500, 4660),
    spacer(1)[0],
    heading2("7.2 Properties / Plots"),
    threeColTable([
      ["Field", "Type", "Description", true],
      ["_id", "ObjectId", "Primary key"],
      ["title", "String", "Plot name/title"],
      ["district", "String", "Location district"],
      ["area_sqft", "Number", "Total area in sq. ft."],
      ["price", "Number", "Asking price (₹)"],
      ["plot_type", "Enum", "residential | commercial | agricultural"],
      ["status", "Enum", "available | booked | sold"],
      ["images", "Array[String]", "Cloud URLs of plot photos"],
      ["created_by", "Ref: Admin", "Admin who added the property"],
    ], 2200, 2500, 4660),
    spacer(1)[0],
    heading2("7.3 Bookings"),
    threeColTable([
      ["Field", "Type", "Description", true],
      ["_id", "ObjectId", "Primary key"],
      ["customer_id", "Ref: Users", "Booking customer"],
      ["property_id", "Ref: Properties", "Booked property"],
      ["booking_date", "Timestamp", "Date of booking"],
      ["status", "Enum", "pending | confirmed | cancelled"],
      ["payment_status", "Enum", "unpaid | paid | refunded"],
      ["amount", "Number", "Total booking amount (₹)"],
    ], 2200, 2500, 4660),
    spacer(1)[0],
    heading2("7.4 Service Requests"),
    threeColTable([
      ["Field", "Type", "Description", true],
      ["_id", "ObjectId", "Primary key"],
      ["customer_id", "Ref: Users", "Requesting customer"],
      ["service_type", "Enum", "maapi | division | map | boundary"],
      ["description", "String", "Additional notes from customer"],
      ["district", "String", "District where service is needed"],
      ["assigned_amin", "Ref: Amins", "Assigned field surveyor"],
      ["status", "Enum", "pending | assigned | in_progress | completed"],
      ["report_url", "String", "URL of final uploaded report"],
      ["created_at", "Timestamp", "Request submission date"],
    ], 2200, 2500, 4660),
    spacer(1)[0],
    heading2("7.5 Amins"),
    threeColTable([
      ["Field", "Type", "Description", true],
      ["_id", "ObjectId", "Primary key"],
      ["name", "String", "Full name"],
      ["mobile", "String", "Contact number"],
      ["district", "String", "Assigned district"],
      ["license_number", "String", "Government-issued license ID"],
      ["status", "Enum", "active | inactive"],
      ["created_by", "Ref: Admin", "Admin who registered the Amin"],
    ], 2200, 2500, 4660),
    spacer(1)[0],
    heading2("7.6 Payments"),
    threeColTable([
      ["Field", "Type", "Description", true],
      ["_id", "ObjectId", "Primary key"],
      ["customer_id", "Ref: Users", "Paying customer"],
      ["booking_id / service_id", "Ref", "Associated booking or service"],
      ["razorpay_order_id", "String", "Razorpay order reference"],
      ["razorpay_payment_id", "String", "Razorpay payment reference"],
      ["amount", "Number", "Amount paid (₹)"],
      ["status", "Enum", "created | success | failed | refunded"],
      ["paid_at", "Timestamp", "Payment timestamp"],
    ], 2200, 2500, 4660),
    pageBreak()
  ];
}

// ─── Project Timeline ─────────────────────────────────────────────
function projectTimeline() {
  return [
    heading1("8. Project Timeline & Milestones"),
    threeColTable([
      ["Phase", "Duration", "Key Deliverables", true],
      ["Phase 1: Requirement Finalization & Design", "Days 1–5", "Wireframes, UI mockups in Figma, design system, client approval"],
      ["Phase 2: Database & Backend Architecture", "Days 6–10", "DB schema, REST API foundation, authentication module, Razorpay setup"],
      ["Phase 3: Core Backend Development", "Days 11–20", "All API endpoints, RBAC, document upload, notification service, payment verification"],
      ["Phase 4: Frontend Development", "Days 21–30", "React SPA: public site, customer panel, admin panel, Amin dashboard, Super Admin"],
      ["Phase 5: Integration & System Testing", "Days 31–35", "API integration, end-to-end testing, security testing, cross-browser testing"],
      ["Phase 6: UAT, Deployment & Handover", "Days 36–40", "User Acceptance Testing, cloud deployment, SSL setup, documentation & training"],
    ], 3200, 1600, 4560),
    spacer(1)[0],
    heading2("8.1 Payment Milestones"),
    twoColTable([
      ["Milestone", "Amount", true],
      ["Advance Payment (on project approval)", "40% of ₹30,000 = ₹12,000 + GST"],
      ["Final Payment (on delivery & deployment)", "60% of ₹30,000 = ₹18,000 + GST"],
    ], 4200, 5160),
    pageBreak()
  ];
}

// ─── Security ─────────────────────────────────────────────────────
function securityRequirements() {
  return [
    heading1("9. Security Requirements"),
    moduleFeatureTable([
      ["Authentication", "OTP-based login for customers; credential-based for admin/amin; JWT with configurable expiry"],
      ["Authorization", "Role-Based Access Control (RBAC) — 5 roles with granular permission mapping"],
      ["Data Encryption", "Sensitive PII fields (Aadhaar) encrypted at rest; TLS 1.3 for data in transit"],
      ["API Security", "Rate limiting on OTP endpoints; CORS policy; Helmet.js headers; input sanitization"],
      ["Payment Security", "Razorpay signature verification on every payment callback; no card data stored locally"],
      ["Document Security", "Files stored on secure cloud storage (S3-compatible); pre-signed URL access"],
      ["Audit Logging", "All admin and Super Admin actions logged with user ID, timestamp, and IP address"],
      ["Backup & Recovery", "Daily automated backups; 30-day retention; tested restore procedure"],
      ["SSL Certificate", "HTTPS enforced on all routes; HSTS max-age 1 year"],
      ["Vulnerability Management", "Dependency audit via npm audit; regular security patch updates under AMC"],
    ]),
    pageBreak()
  ];
}

// ─── AMC & Terms ─────────────────────────────────────────────────
function amcAndTerms() {
  return [
    heading1("10. AMC, Support & Terms"),
    heading2("10.1 Annual Maintenance Contract (AMC)"),
    twoColTable([
      ["AMC Period", "Details", true],
      ["First 1 Year", "FREE — Bug fixes, minor UI updates, technical support, server monitoring"],
      ["Annual AMC (After 1st Year)", "₹6,000/- per year — Maintenance, security patches, backups, deployment updates"],
    ], 2800, 6560),
    spacer(1)[0],
    heading2("10.2 Terms & Conditions"),
    threeColTable([
      ["#", "Term", "Detail", true],
      ["1", "Domain & Server", "Domain registration and server hosting charges are separate and borne by the client"],
      ["2", "Third-party APIs", "SMS/OTP gateway, payment gateway transaction fees borne by the client"],
      ["3", "Scope Changes", "Feature additions post-project approval will be quoted and charged separately"],
      ["4", "Delivery Timeline", "Timely submission of content, feedback, and required assets by the client is essential for on-time delivery"],
      ["5", "Source Code Ownership", "Full source code transferred to client only after complete payment clearance"],
    ], 600, 2600, 6160),
    pageBreak()
  ];
}

// ─── Appendix ─────────────────────────────────────────────────────
function appendix() {
  return [
    heading1("11. Appendix"),
    heading2("11.1 Technology Stack Summary"),
    threeColTable([
      ["Component", "Technology", "Purpose", true],
      ["Frontend", "React.js", "Dynamic single-page application (SPA)"],
      ["Backend", "Node.js + Express.js", "RESTful API server"],
      ["Database", "MongoDB / PostgreSQL", "Persistent data storage"],
      ["Authentication", "OTP + JWT", "Stateless session management"],
      ["Payment Gateway", "Razorpay", "UPI, Card, Net Banking, Wallet payments"],
      ["File Storage", "Cloud Storage (S3-compatible)", "Document and image uploads"],
      ["Notifications", "SMS Gateway + SMTP", "OTP, booking, and status alerts"],
      ["Hosting", "Cloud VPS", "Production server deployment"],
      ["Security", "SSL + Helmet.js + bcrypt", "HTTPS, headers, password hashing"],
      ["Version Control", "Git / GitHub", "Source code management"],
    ], 2200, 2800, 4360),
    spacer(1)[0],
    heading2("11.2 Roles & Permissions Matrix"),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [2600, 1352, 1352, 1352, 1352, 1352],
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["Permission", "Public", "Customer", "Amin", "Admin", "Super Admin"].map((txt, i) =>
            new TableCell({
              borders: cellBorders(),
              width: { size: i === 0 ? 2600 : 1352, type: WidthType.DXA },
              shading: { fill: HEADER_BG, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 100, right: 100 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: txt, bold: true, size: 18, font: "Arial", color: HEADER_TXT })] })]
            })
          )
        }),
        ...([
          ["View Properties", "Y", "Y", "N", "Y", "Y"],
          ["Book Plot", "N", "Y", "N", "N", "N"],
          ["Request Land Service", "N", "Y", "N", "N", "N"],
          ["Make Payment", "N", "Y", "N", "N", "N"],
          ["Upload Documents", "N", "Y", "Y", "N", "N"],
          ["View Assigned Tasks", "N", "N", "Y", "N", "N"],
          ["Update Task Status", "N", "N", "Y", "N", "N"],
          ["Manage Properties", "N", "N", "N", "Y", "Y"],
          ["Assign Amin", "N", "N", "N", "Y", "Y"],
          ["View District Reports", "N", "N", "N", "Y", "Y"],
          ["Manage All Admins", "N", "N", "N", "N", "Y"],
          ["System Configuration", "N", "N", "N", "N", "Y"],
        ].map((row, idx) =>
          new TableRow({
            children: row.map((txt, ci) => {
              const w = ci === 0 ? 2600 : 1352;
              const fill = idx % 2 === 0 ? "FFFFFF" : ROW_ALT;
              const color = txt === "Y" ? "1A7A1A" : txt === "N" ? "AA0000" : DARK_BLUE;
              const bold = ci === 0 || txt !== "N";
              return new TableCell({
                borders: cellBorders(),
                width: { size: w, type: WidthType.DXA },
                shading: { fill, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 100, right: 100 },
                children: [new Paragraph({
                  alignment: ci > 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
                  children: [new TextRun({ text: txt, size: 19, font: "Arial", bold, color })]
                })]
              });
            })
          })
        ))
      ]
    }),
    spacer(1)[0],
    heading2("11.3 Authorized Signatory"),
    spacer(1)[0],
    twoColTable([
      ["Name", "", false],
      ["Designation", "Business Development Manager", false],
      ["Contact", "+91 90412 89863", false],
      ["Email", "bnintelhub@gmail.com", false],
      ["Organization", "BN Intelhub Pvt. Ltd.", false],
    ], 2800, 6560),
    spacer(1)[0],
    para("Document prepared and approved by BN Intelhub Pvt. Ltd. as per Quotation Reference BN-2026-RE-001 dated May 25, 2026."),
  ];
}

// ─── Main Document ────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: DARK_BLUE },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: MID_BLUE },
        paragraph: { spacing: { before: 260, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: DARK_BLUE },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25CB", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
            spacing: { before: 0, after: 120 },
            tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
            children: [
              new TextRun({ text: "BN Intelhub Pvt. Ltd.", bold: true, size: 18, font: "Arial", color: DARK_BLUE }),
              new TextRun({ text: "\t", size: 18 }),
              new TextRun({ text: "Real Estate & Land Measurement Portal — SRS v1.0", size: 18, font: "Arial", color: "666666" }),
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
            spacing: { before: 120, after: 0 },
            tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
            children: [
              new TextRun({ text: "Confidential | BN-2026-RE-001", size: 16, font: "Arial", color: "888888" }),
              new TextRun({ text: "\t", size: 16 }),
              new TextRun({ text: "Page ", size: 16, font: "Arial", color: "888888" }),
              new PageNumber({ type: "current" }),
            ]
          })
        ]
      })
    },
    children: [
      ...coverPage(),
      ...revisionHistory(),
      ...introduction(),
      ...overallDescription(),
      ...functionalRequirements(),
      ...nonFunctionalRequirements(),
      ...apiDesign(),
      ...databaseDesign(),
      ...projectTimeline(),
      ...securityRequirements(),
      ...amcAndTerms(),
      ...appendix(),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/SRS_RealEstate_LandPortal_BN2026RE001.docx", buffer);
  console.log("SRS document generated successfully.");
});