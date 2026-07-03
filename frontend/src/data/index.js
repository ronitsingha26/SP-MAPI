import { Ruler, SplitSquareHorizontal, Map, Wrench } from 'lucide-react';

// Dummy Districts
export const districts = [
  "Patna", "Bhagalpur", "Purnia", "Madhepura", "Araria",
  "Kishanganj", "Katihar", "Saharsha", "Palamu", "Chaibasa",
  "Lohardaga", "Simdega", "Ramgarh", "Pakur", "Chatra"
];

// Properties removed (Real Estate listings deactivated)
export const properties = [];

// Services
export const services = [
  {
    id: "maapi",
    name: "Apply for Mapi",
    icon: Ruler,
    color: "green",
    description: "Accurate measurement of land parcels to determine exact property dimensions and boundaries.",
    price_range: "₹2,000 – ₹8,000",
    duration: "3–7 working days",
    steps: [
      "Submit measurement request online",
      "Admin reviews and assigns Amin",
      "Amin visits site for measurement",
      "Measurement report prepared",
      "Report uploaded & shared with customer"
    ],
    documents_required: ["Aadhaar Card", "Land Documents / Patta", "Old Measurement Report (if any)"]
  },
  {
    id: "division",
    name: "Apply for Batwara",
    icon: SplitSquareHorizontal,
    color: "yellow",
    description: "Identification and marking of legal property boundaries on the ground to prevent future disputes and encroachments.",
    price_range: "₹5,000 – ₹15,000",
    duration: "7–14 working days",
    steps: [
      "Submit division request with documents",
      "Admin verifies land ownership",
      "Amin assigned for site visit",
      "Division boundaries marked",
      "Division map prepared and certified"
    ],
    documents_required: ["Aadhaar Card", "Khatiyan / Land Record Copy", "Vanshawali (Family Tree)", "Original Land Deed"]
  },
  {
    id: "map",
    name: "Apply for Map",
    icon: Map,
    color: "green",
    description: "Assistance in obtaining official land maps and assigning certified Amin surveyors for professional property measurement.",
    price_range: "₹3,000 – ₹10,000",
    duration: "5–10 working days",
    steps: [
      "Submit map request with plot details",
      "Amin assigned for site survey",
      "GPS coordinates captured",
      "Digital map prepared",
      "Certified map document issued"
    ],
    documents_required: ["Aadhaar Card", "Land Documents", "Plot Number / Khasra Number"]
  },
  {
    id: "tools",
    name: "Apply for All Amin Tools",
    icon: Wrench,
    color: "yellow",
    description: "Request survey tools such as kitab, guniya, drafting compass, measuring tape, chain, scales, and ETS machine with quantity selection.",
    price_range: "As per tools",
    duration: "Subject to stock",
    steps: [
      "Select required survey tools",
      "Add quantity for each tool",
      "Submit tool request online",
      "Admin checks inventory availability",
      "Tools are issued or scheduled for delivery"
    ],
    documents_required: ["Aadhaar Card", "Land Documents"]
  }
];

// Customers
export const customers = [
  { id: "C001", name: "Ramesh Kumar Singh", mobile: "9876543210", email: "ramesh@example.com", district: "Patna", status: "active", created_at: "2026-03-15", bookings: 2, services: 1 },
  { id: "C002", name: "Sunita Devi", mobile: "9823456789", email: "sunita@example.com", district: "Bhagalpur", status: "active", created_at: "2026-03-20", bookings: 1, services: 2 },
  { id: "C003", name: "Manoj Yadav", mobile: "9812345678", email: "manoj@example.com", district: "Purnia", status: "active", created_at: "2026-04-02", bookings: 0, services: 3 },
  { id: "C004", name: "Priya Sharma", mobile: "9887654321", email: "priya.sharma@example.com", district: "Patna", status: "active", created_at: "2026-04-10", bookings: 1, services: 1 },
  { id: "C005", name: "Arjun Pandey", mobile: "9765432109", email: "arjun.p@example.com", district: "Araria", status: "blocked", created_at: "2026-04-15", bookings: 1, services: 0 },
  { id: "C006", name: "Kavita Gupta", mobile: "9754321098", email: "kavita@example.com", district: "Madhepura", status: "active", created_at: "2026-04-18", bookings: 0, services: 2 },
  { id: "C007", name: "Deepak Mahto", mobile: "9741234567", email: "deepak@example.com", district: "Kishanganj", status: "active", created_at: "2026-05-01", bookings: 1, services: 1 },
  { id: "C008", name: "Rina Tiwari", mobile: "9732345678", email: "rina.t@example.com", district: "Katihar", status: "active", created_at: "2026-05-08", bookings: 0, services: 1 },
];

// Bookings removed
export const bookings = [];

// Service Requests
export const serviceRequests = [
  { id: "SR001", customer_id: "C001", customer_name: "Ramesh Kumar Singh", service_type: "maapi", district: "Patna", description: "Measurement of 5 katha land in Namkum area.", assigned_amin: "A001", amin_name: "Ram Chandra Mahto", status: "completed", created_at: "2026-05-05", amount: 3500 },
  { id: "SR002", customer_id: "C002", customer_name: "Sunita Devi", service_type: "division", district: "Bhagalpur", description: "Division of inherited land between 3 brothers.", assigned_amin: "A002", amin_name: "Suresh Paswan", status: "in_progress", created_at: "2026-05-18", amount: 8000 },
  { id: "SR003", customer_id: "C003", customer_name: "Manoj Yadav", service_type: "boundary", district: "Purnia", description: "Boundary dispute with neighbor — need official survey.", assigned_amin: "A003", amin_name: "Birsa Oraon", status: "assigned", created_at: "2026-05-28", amount: 6000 },
  { id: "SR004", customer_id: "C003", customer_name: "Manoj Yadav", service_type: "map", district: "Purnia", description: "Digital map needed for bank loan application.", assigned_amin: null, amin_name: null, status: "pending", created_at: "2026-06-05", amount: 4500 },
  { id: "SR005", customer_id: "C006", customer_name: "Kavita Gupta", service_type: "maapi", district: "Madhepura", description: "Measure 2 acres of family land near river.", assigned_amin: "A001", amin_name: "Ram Chandra Mahto", status: "in_progress", created_at: "2026-06-08", amount: 5000 },
  { id: "SR006", customer_id: "C008", customer_name: "Rina Tiwari", service_type: "map", district: "Katihar", description: "Need map for construction permit application.", assigned_amin: null, amin_name: null, status: "pending", created_at: "2026-06-12", amount: 3000 },
];

// Amins (Field Surveyors)
export const amins = [
  { id: "A001", name: "Ram Chandra Mahto", mobile: "9123456789", district: "Patna", license_number: "BR-AMN-2018-0042", status: "active", tasks_completed: 87, active_tasks: 2, rating: 4.8, created_by: "Admin Rahul", joined: "2026-01-10" },
  { id: "A002", name: "Suresh Paswan", mobile: "9234567890", district: "Bhagalpur", license_number: "BR-AMN-2019-0071", status: "active", tasks_completed: 64, active_tasks: 1, rating: 4.6, created_by: "Admin Priya", joined: "2026-01-15" },
  { id: "A003", name: "Birsa Oraon", mobile: "9345678901", district: "Purnia", license_number: "BR-AMN-2017-0033", status: "active", tasks_completed: 112, active_tasks: 1, rating: 4.9, created_by: "Admin Rahul", joined: "2026-01-08" },
  { id: "A004", name: "Ganesh Mahali", mobile: "9456789012", district: "Araria", license_number: "BR-AMN-2020-0055", status: "active", tasks_completed: 45, active_tasks: 0, rating: 4.5, created_by: "Admin Priya", joined: "2026-02-01" },
  { id: "A005", name: "Shyam Bhushan", mobile: "9567890123", district: "Madhepura", license_number: "BR-AMN-2021-0089", status: "inactive", tasks_completed: 23, active_tasks: 0, rating: 4.2, created_by: "Admin Rahul", joined: "2026-02-15" },
  { id: "A006", name: "Prem Lal Turi", mobile: "9678901234", district: "Kishanganj", license_number: "BR-AMN-2019-0066", status: "active", tasks_completed: 78, active_tasks: 0, rating: 4.7, created_by: "Admin Priya", joined: "2026-01-20" },
];

// Payments
export const payments = [
  { id: "PAY003", customer_name: "Ramesh Kumar Singh", booking_id: "SR001", type: "Land Measurement", amount: 3500, status: "success", method: "UPI", paid_at: "2026-05-05T09:30:00Z", razorpay_id: "pay_RZP003XYZ789" },
  { id: "PAY004", customer_name: "Sunita Devi", booking_id: "SR002", type: "Division Survey", amount: 8000, status: "success", method: "Card", paid_at: "2026-05-18T16:45:00Z", razorpay_id: "pay_RZP004XYZ012" },
  { id: "PAY007", customer_name: "Kavita Gupta", booking_id: "SR005", type: "Land Measurement", amount: 5000, status: "success", method: "Wallet", paid_at: "2026-06-08T15:00:00Z", razorpay_id: "pay_RZP007XYZ901" },
  { id: "PAY008", customer_name: "Manoj Yadav", booking_id: "SR003", type: "Boundary Survey", amount: 6000, status: "success", method: "UPI", paid_at: "2026-05-28T12:00:00Z", razorpay_id: "pay_RZP008XYZ234" },
];

// Admins
export const admins = [
  { id: "AD001", name: "Rahul Kumar", email: "rahul.admin@spmapi.com", mobile: "9101010101", districts: ["Patna", "Araria", "Ramgarh"], status: "active", created_at: "2026-01-01" },
  { id: "AD002", name: "Priya Sinha", email: "priya.admin@spmapi.com", mobile: "9202020202", districts: ["Bhagalpur", "Kishanganj", "Madhepura"], status: "active", created_at: "2026-01-01" },
  { id: "AD003", name: "Sunil Verma", email: "sunil.admin@spmapi.com", mobile: "9303030303", districts: ["Purnia", "Chaibasa", "Simdega"], status: "active", created_at: "2026-01-05" },
  { id: "AD004", name: "Meera Kumari", email: "meera.admin@spmapi.com", mobile: "9404040404", districts: ["Katihar", "Saharsha", "Pakur"], status: "inactive", created_at: "2026-02-01" },
];

// Testimonials
export const testimonials = [
  { id: 1, name: "Rakesh Prasad", district: "Patna", text: "SP MAPI made my plot booking experience seamless. The entire process from search to payment was done online in 1 day!", rating: 5, service: "Plot Booking" },
  { id: 2, name: "Lalita Devi", district: "Bhagalpur", text: "The Maapi service was excellent. Amin Ram Chandra bhaiya came exactly on time and the report was ready within 3 days.", rating: 5, service: "Land Measurement" },
  { id: 3, name: "Vikrant Singh", district: "Purnia", text: "Finally a portal where you can book land services without going to government offices. Very helpful for working professionals.", rating: 4, service: "Map Preparation" },
  { id: 4, name: "Sushma Kumari", district: "Araria", text: "Our family boundary dispute was resolved professionally through SP MAPI. Highly recommend their services.", rating: 5, service: "Boundary Survey" },
];

// Dashboard Stats
export const dashboardStats = {
  super_admin: {
    total_users: 1247,
    pending_services: 28,
    active_amins: 34,
    total_revenue: 487500,
    monthly_revenue: [
      { month: "Jan", revenue: 32000 }, { month: "Feb", revenue: 41000 },
      { month: "Mar", revenue: 38000 }, { month: "Apr", revenue: 52000 },
      { month: "May", revenue: 68000 }, { month: "Jun", revenue: 47500 },
    ],
    service_by_type: [
      { name: "Maapi", value: 42 }, { name: "Division", value: 24 }, { name: "Map Prep", value: 20 }, { name: "Boundary", value: 14 }
    ]
  },
  admin: {
    total_customers: 312,
    active_amins: 24,
    pending_services: 11,
    district_revenue: 125000,
    monthly_applications: [
      { month: "Jan", count: 48 }, { month: "Feb", count: 54 }, { month: "Mar", count: 61 },
      { month: "Apr", count: 70 }, { month: "May", count: 88 }, { month: "Jun", count: 78 },
    ]
  }
};
