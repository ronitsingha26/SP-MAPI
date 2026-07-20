// ── SP MAPI — Complete English + Hindi Translations ──

const translations = {
  // ══════════════════════════════════════════
  // NAVBAR
  // ══════════════════════════════════════════
  nav_home: { en: 'Home', hi: 'होम' },
  nav_properties: { en: 'Properties', hi: 'प्रॉपर्टीज' },
  nav_services: { en: 'Services', hi: 'सेवाएं' },
  nav_about: { en: 'About', hi: 'हमारे बारे में' },
  nav_contact: { en: 'Contact', hi: 'संपर्क' },
  nav_login: { en: 'Login', hi: 'लॉगिन' },
  nav_find_plots: { en: 'Find Plots', hi: 'प्लॉट खोजें' },
  nav_customer_login: { en: 'Customer Login', hi: 'ग्राहक लॉगिन' },
  nav_admin_login: { en: 'Admin Login', hi: 'एडमिन लॉगिन' },
  nav_amin_login: { en: 'Amin Login', hi: 'अमीन लॉगिन' },
  nav_super_admin: { en: 'Super Admin', hi: 'सुपर एडमिन' },
  nav_subtitle: { en: 'Jamin Mapi Services ', hi: 'जमीन मापी सर्विसेज' },

  // ══════════════════════════════════════════
  // HOMEPAGE — Hero
  // ══════════════════════════════════════════
  hero_badge: { en: "Bihar's Trusted Land Survey Platform", hi: 'बिहार का भरोसेमंद भूमि सर्वेक्षण मंच' },
  hero_title_1: { en: 'Find Your', hi: 'अपना खोजें' },
  hero_title_2: { en: 'Perfect Plot.', hi: 'सही प्लॉट।' },
  hero_title_3: { en: 'Measure Your Land.', hi: 'अपनी ज़मीन मापें।' },
  hero_desc: {
    en: 'SP MAPI is the complete platform for buying residential, commercial, and agricultural plots — and booking professional land survey services online.',
    hi: 'SP MAPI आवासीय, व्यावसायिक और कृषि प्लॉट खरीदने — और पेशेवर भूमि सर्वेक्षण सेवाओं की ऑनलाइन बुकिंग के लिए संपूर्ण मंच है।'
  },
  hero_search_districts: { en: 'All Districts', hi: 'सभी जिले' },
  hero_search_types: { en: 'Any Type', hi: 'कोई भी प्रकार' },
  hero_search_btn: { en: 'Search Plots', hi: 'प्लॉट खोजें' },
  hero_residential: { en: 'Residential', hi: 'आवासीय' },
  hero_commercial: { en: 'Commercial', hi: 'व्यावसायिक' },
  hero_agricultural: { en: 'Agricultural', hi: 'कृषि' },
  hero_feat_booking: { en: 'Online Booking', hi: 'ऑनलाइन बुकिंग' },
  hero_feat_otp: { en: 'OTP Login', hi: 'OTP लॉगिन' },
  hero_feat_payment: { en: 'Razorpay Payments', hi: 'Razorpay भुगतान' },
  hero_feat_amins: { en: 'Licensed Amins', hi: 'लाइसेंस्ड अमीन' },
  hero_flowing_services: { en: 'JAMEEN MAPI • BATWARA • MAP PROVISION • AMIN TOOLS • ONLINE BOOKING • ', hi: 'जमीन मापी • बटवारा • नक़्शा प्राप्त करें • अमीन टूल्स • ऑनलाइन बुकिंग • ' },

  // ══════════════════════════════════════════
  // HOMEPAGE — Stats
  // ══════════════════════════════════════════
  stat_plots: { en: 'Plots Listed', hi: 'प्लॉट सूचीबद्ध' },
  stat_customers: { en: 'Happy Customers', hi: 'संतुष्ट ग्राहक' },
  stat_amins: { en: 'Licensed Amins', hi: 'लाइसेंस्ड अमीन' },
  stat_districts: { en: 'Districts Covered', hi: 'जिले कवर' },

  // ══════════════════════════════════════════
  // HOMEPAGE — Services Section
  // ══════════════════════════════════════════
  services_label: { en: 'Our Services', hi: 'हमारी सेवाएं' },
  services_title: { en: 'Professional Land Services', hi: 'पेशेवर भूमि सेवाएं' },
  services_subtitle: {
    en: 'Book licensed Amin surveyors for official land measurement, division, map preparation, and boundary surveys.',
    hi: 'आधिकारिक भूमि मापन, बटवारा, नक्शा तैयारी और सीमा सर्वेक्षण के लिए लाइसेंस्ड अमीन सर्वेयर बुक करें।'
  },
  services_learn_more: { en: 'Learn More', hi: 'और जानें' },
  services_view_all: { en: 'View All Services', hi: 'सभी सेवाएं देखें' },

  service_maapi_name: { en: 'Apply For Mapi', hi: 'जमीन मापी के लिए आवेदन (Apply for Mapi)' },
  service_maapi_desc: {
    en: 'Official land measurement service by licensed Amin. Get exact dimensions and area of your land measured and documented.',
    hi: 'लाइसेंस्ड अमीन द्वारा आधिकारिक भूमि मापन सेवा। अपनी जमीन की सटीक माप और क्षेत्रफल मापवाएं और दस्तावेज बनवाएं।'
  },
  service_division_name: { en: 'Apply For Batwara', hi: 'बटवारा के लिए आवेदन (Apply for Batwara)' },
  service_division_desc: {
    en: 'Divide your land into multiple parcels with official demarcation. Required for inheritance and property partitioning.',
    hi: 'आधिकारिक सीमांकन के साथ अपनी जमीन को कई हिस्सों में बांटें। विरासत और संपत्ति बंटवारे के लिए आवश्यक।'
  },
  service_map_name: { en: 'Apply For Map', hi: 'नक्शा के लिए आवेदन (Apply for Map)' },
  service_map_desc: {
    en: 'Professional map preparation of your land plot for legal, construction, and registration purposes.',
    hi: 'कानूनी, निर्माण और पंजीकरण उद्देश्यों के लिए आपकी जमीन के प्लॉट का पेशेवर नक्शा तैयार करना।'
  },
  service_boundary_name: { en: 'Boundary Survey', hi: 'सीमा सर्वेक्षण' },
  service_boundary_desc: {
    en: 'Resolve boundary disputes and get official demarcation of your land boundaries with certified report.',
    hi: 'सीमा विवादों का समाधान करें और प्रमाणित रिपोर्ट के साथ अपनी जमीन की सीमाओं का आधिकारिक सीमांकन प्राप्त करें।'
  },

  // Service detail items
  service_price_range: { en: 'Price Range', hi: 'मूल्य सीमा' },
  service_duration: { en: 'Duration', hi: 'अवधि' },
  service_process: { en: 'Process', hi: 'प्रक्रिया' },
  service_documents: { en: 'Required Documents', hi: 'आवश्यक दस्तावेज' },
  service_book: { en: 'Book', hi: 'बुक करें' },

  // Service steps (maapi)
  service_maapi_step1: { en: 'Submit measurement request online', hi: 'ऑनलाइन मापन अनुरोध जमा करें' },
  service_maapi_step2: { en: 'Admin reviews and assigns Amin', hi: 'एडमिन समीक्षा करता है और अमीन नियुक्त करता है' },
  service_maapi_step3: { en: 'Amin visits site for measurement', hi: 'अमीन मापन के लिए साइट पर आता है' },
  service_maapi_step4: { en: 'Measurement report prepared', hi: 'मापन रिपोर्ट तैयार की जाती है' },
  service_maapi_step5: { en: 'Report uploaded & shared with customer', hi: 'रिपोर्ट अपलोड और ग्राहक के साथ साझा की जाती है' },

  // Service steps (division)
  service_division_step1: { en: 'Submit division request with documents', hi: 'दस्तावेजों के साथ बटवारा अनुरोध जमा करें' },
  service_division_step2: { en: 'Admin verifies land ownership', hi: 'एडमिन भूमि स्वामित्व सत्यापित करता है' },
  service_division_step3: { en: 'Amin assigned for site visit', hi: 'साइट विजिट के लिए अमीन नियुक्त' },
  service_division_step4: { en: 'Division boundaries marked', hi: 'बटवारा सीमाएं चिन्हित की जाती हैं' },
  service_division_step5: { en: 'Division map prepared and certified', hi: 'बटवारा नक्शा तैयार और प्रमाणित किया जाता है' },

  // Service steps (map)
  service_map_step1: { en: 'Submit map request with plot details', hi: 'प्लॉट विवरण के साथ नक्शा अनुरोध जमा करें' },
  service_map_step2: { en: 'Amin assigned for site survey', hi: 'साइट सर्वे के लिए अमीन नियुक्त' },
  service_map_step3: { en: 'GPS coordinates captured', hi: 'GPS कोऑर्डिनेट्स लिए जाते हैं' },
  service_map_step4: { en: 'Digital map prepared', hi: 'डिजिटल नक्शा तैयार किया जाता है' },
  service_map_step5: { en: 'Certified map document issued', hi: 'प्रमाणित नक्शा दस्तावेज जारी किया जाता है' },

  // Service steps (boundary)
  service_boundary_step1: { en: 'Submit boundary survey request', hi: 'सीमा सर्वेक्षण अनुरोध जमा करें' },
  service_boundary_step2: { en: 'Document verification by admin', hi: 'एडमिन द्वारा दस्तावेज सत्यापन' },
  service_boundary_step3: { en: 'Amin visits with neighbors consent', hi: 'अमीन पड़ोसियों की सहमति से आता है' },
  service_boundary_step4: { en: 'Boundary pillars installed', hi: 'सीमा स्तंभ स्थापित किए जाते हैं' },
  service_boundary_step5: { en: 'Certified boundary report issued', hi: 'प्रमाणित सीमा रिपोर्ट जारी की जाती है' },

  // Documents
  doc_aadhaar: { en: 'Aadhaar Card', hi: 'आधार कार्ड' },
  doc_land_patta: { en: 'Land Documents / Patta', hi: 'भूमि दस्तावेज / पट्टा' },
  doc_old_report: { en: 'Old Measurement Report (if any)', hi: 'पुरानी मापन रिपोर्ट (यदि हो)' },
  doc_co_owners: { en: "All Co-owners' Consent", hi: 'सभी सह-मालिकों की सहमति' },
  doc_land_deed: { en: 'Original Land Deed', hi: 'मूल भूमि विलेख' },
  doc_jamabandi: { en: 'Jamabandi Copy', hi: 'जमाबंदी कॉपी' },
  doc_land_docs: { en: 'Land Documents', hi: 'भूमि दस्तावेज' },
  doc_khasra: { en: 'Plot Number / Khasra Number', hi: 'प्लॉट नंबर / खसरा नंबर' },
  doc_neighbor_noc: { en: 'Neighbor NOC', hi: 'पड़ोसी NOC' },
  doc_old_survey: { en: 'Old Survey Records', hi: 'पुराने सर्वेक्षण रिकॉर्ड' },

  // ══════════════════════════════════════════
  // HOMEPAGE — Featured Properties
  // ══════════════════════════════════════════
  featured_label: { en: 'Available Plots', hi: 'उपलब्ध प्लॉट' },
  featured_title: { en: 'Featured Properties', hi: 'विशेष प्रॉपर्टीज' },
  featured_subtitle: { en: 'Verified plots across Bihar', hi: 'बिहार भर में सत्यापित प्लॉट' },
  featured_view_all: { en: 'View All Plots', hi: 'सभी प्लॉट देखें' },
  area_label: { en: 'Area', hi: 'क्षेत्रफल' },
  price_label: { en: 'Price', hi: 'कीमत' },

  // ══════════════════════════════════════════
  // HOMEPAGE — Why Choose Us
  // ══════════════════════════════════════════
  why_label: { en: 'Why SP MAPI', hi: 'SP MAPI क्यों' },
  why_title: { en: 'The Smarter Way to Buy & Survey Land', hi: 'जमीन खरीदने और सर्वे कराने का स्मार्ट तरीका' },
  why_1_title: { en: 'Verified & Secure', hi: 'सत्यापित और सुरक्षित' },
  why_1_desc: {
    en: 'All properties are verified by our team. Payments secured via Razorpay with SSL encryption.',
    hi: 'सभी प्रॉपर्टीज हमारी टीम द्वारा सत्यापित हैं। Razorpay के माध्यम से SSL एन्क्रिप्शन के साथ भुगतान सुरक्षित।'
  },
  why_2_title: { en: 'End-to-End Online', hi: 'शुरू से अंत तक ऑनलाइन' },
  why_2_desc: {
    en: 'From searching plots to payment and document upload — everything is handled online.',
    hi: 'प्लॉट खोजने से लेकर भुगतान और दस्तावेज अपलोड तक — सब कुछ ऑनलाइन होता है।'
  },
  why_3_title: { en: 'Licensed Surveyors', hi: 'लाइसेंस्ड सर्वेयर' },
  why_3_desc: {
    en: 'Our Amins are government-licensed field surveyors with certified credentials and experience.',
    hi: 'हमारे अमीन प्रमाणित क्रेडेंशियल और अनुभव वाले सरकारी लाइसेंस प्राप्त फील्ड सर्वेयर हैं।'
  },

  // ══════════════════════════════════════════
  // HOMEPAGE — Testimonials
  // ══════════════════════════════════════════
  testimonials_label: { en: 'Testimonials', hi: 'प्रशंसापत्र' },
  testimonials_title: { en: 'What Our Customers Say', hi: 'हमारे ग्राहक क्या कहते हैं' },

  // Testimonial texts
  testimonial_1: {
    en: 'SP MAPI made my plot booking experience seamless. The entire process from search to payment was done online in 1 day!',
    hi: 'SP MAPI ने मेरे प्लॉट बुकिंग अनुभव को आसान बना दिया। खोज से भुगतान तक पूरी प्रक्रिया 1 दिन में ऑनलाइन हो गई!'
  },
  testimonial_2: {
    en: 'The Maapi service was excellent. Amin Ram Chandra bhaiya came exactly on time and the report was ready within 3 days.',
    hi: 'मापी सेवा उत्कृष्ट थी। अमीन राम चंद्र भैया बिल्कुल समय पर आए और रिपोर्ट 3 दिन में तैयार हो गई।'
  },
  testimonial_3: {
    en: 'Finally a portal where you can book land services without going to government offices. Very helpful for working professionals.',
    hi: 'आखिरकार एक पोर्टल जहां सरकारी दफ्तरों में जाए बिना भूमि सेवाएं बुक कर सकते हैं। कामकाजी लोगों के लिए बहुत मददगार।'
  },
  testimonial_4: {
    en: 'Our family boundary dispute was resolved professionally through SP MAPI. Highly recommend their services.',
    hi: 'हमारे परिवार का सीमा विवाद SP MAPI के माध्यम से पेशेवर तरीके से सुलझाया गया। उनकी सेवाओं की अत्यधिक अनुशंसा करते हैं।'
  },

  // ══════════════════════════════════════════
  // HOMEPAGE — CTA Banner
  // ══════════════════════════════════════════
  cta_title: { en: 'Ready to Find Your Land?', hi: 'अपनी ज़मीन खोजने के लिए तैयार?' },
  cta_subtitle: { en: 'Join 1,200+ satisfied customers across Bihar', hi: 'बिहार भर में 1,200+ संतुष्ट ग्राहकों से जुड़ें' },
  cta_browse: { en: 'Browse Plots', hi: 'प्लॉट देखें' },
  cta_register: { en: 'Register Now', hi: 'अभी रजिस्टर करें' },

  // ══════════════════════════════════════════
  // HOMEPAGE — About Company Section (with image.png)
  // ══════════════════════════════════════════
  about_company_label: { en: 'About SP MAPI Pvt. Ltd.', hi: 'SP MAPI प्राइवेट लिमिटेड के बारे में' },
  about_company_title: { en: 'Digitizing Land Surveys Across Bihar', hi: 'पूरे बिहार में भूमि सर्वेक्षण का डिजिटलीकरण' },
  about_company_desc: {
    en: 'SPMAPI Private Limited is a registered land survey and measurement firm based in Bihar that aims to digitize property boundaries. Our core mission is to provide accurate land mapping to help resolve and prevent property disputes among families and neighbors.',
    hi: 'एसपीएमएपीआई प्राइवेट लिमिटेड बिहार स्थित एक पंजीकृत भूमि सर्वेक्षण और मापन फर्म है जिसका उद्देश्य संपत्ति की सीमाओं का डिजिटलीकरण करना है। इसका मुख्य लक्ष्य परिवारों और पड़ोसियों के बीच संपत्ति विवादों को सुलझाने और रोकने में मदद करने के लिए सटीक भूमि मानचित्रण प्रदान करना है।'
  },
  about_company_feat1: {
    en: 'Operating across all districts of Bihar',
    hi: 'बिहार के सभी जिलों में कंपनी का काम कर रहा है'
  },
  about_company_feat2: {
    en: 'Accurate and reliable measurement of all types of land',
    hi: 'सभी प्रकार की जमीन की सही व भरोसे मंद नापी की जाती है'
  },
  about_company_feat3: {
    en: 'Survey, map preparation, and all equipment available at your doorstep',
    hi: 'नापी, नक्सा और अमीन संबंधित सभी उपकरण घर बैठे मंगाने के लिए सम्पक करें'
  },
  about_company_feat4: {
    en: 'Land measurement, division, digital maps, etc. prepared',
    hi: 'जमीन- नापी, बटवारा, डिजिटल नक्सा, इत्यादि बनाया जाता है'
  },
  about_company_feat5: {
    en: 'Digital maps, ETS machines, chains, tape — all equipment used for measurement',
    hi: 'नापी के डिजिटल मापी, ETS मशीन, चेन, फीता सभी उपकरण से मापी किया जाता है'
  },
  about_company_know_more: { en: 'Know More About Us', hi: 'हमारे बारे में और जानें' },

  // ══════════════════════════════════════════
  // ABOUT PAGE
  // ══════════════════════════════════════════
  about_hero_title: { en: 'About SP MAPI', hi: 'SP MAPI के बारे में' },
  about_hero_desc: {
    en: 'SP MAPI is a modern real estate and land services platform built to simplify property buying and professional land survey bookings across Bihar. Developed by BN Intelhub Pvt. Ltd.',
    hi: 'SP MAPI एक आधुनिक रियल एस्टेट और भूमि सेवा मंच है जो बिहार भर में संपत्ति खरीद और पेशेवर भूमि सर्वेक्षण बुकिंग को सरल बनाने के लिए बनाया गया है। BN Intelhub Pvt. Ltd. द्वारा विकसित।'
  },
  about_mission_title: { en: 'Our Mission', hi: 'हमारा मिशन' },
  about_mission_desc: {
    en: 'To democratize access to land information and services by building a transparent, secure, and fully digital platform where citizens can buy plots, book licensed surveyors, and manage land documentation — all in one place.',
    hi: 'एक पारदर्शी, सुरक्षित और पूरी तरह से डिजिटल मंच बनाकर भूमि जानकारी और सेवाओं तक पहुंच को लोकतांत्रिक बनाना जहां नागरिक प्लॉट खरीद सकते हैं, लाइसेंस्ड सर्वेयर बुक कर सकते हैं और भूमि दस्तावेज प्रबंधित कर सकते हैं — सब एक जगह।'
  },
  about_vision_title: { en: 'Our Vision', hi: 'हमारा विजन' },
  about_vision_desc: {
    en: "To become Bihar's most trusted real estate and land services platform, covering every district with verified listings and government-licensed Amin surveyors available at the click of a button.",
    hi: 'बिहार का सबसे भरोसेमंद रियल एस्टेट और भूमि सेवा मंच बनना, हर जिले को सत्यापित लिस्टिंग और एक बटन के क्लिक पर उपलब्ध सरकारी लाइसेंस प्राप्त अमीन सर्वेयर के साथ कवर करना।'
  },
  about_values_title: { en: 'Our Core Values', hi: 'हमारे मूल मूल्य' },
  about_val_transparency: { en: 'Transparency', hi: 'पारदर्शिता' },
  about_val_transparency_desc: { en: 'All listings are verified. All transactions are traceable.', hi: 'सभी लिस्टिंग सत्यापित हैं। सभी लेनदेन ट्रेसेबल हैं।' },
  about_val_speed: { en: 'Speed', hi: 'गति' },
  about_val_speed_desc: { en: 'From booking to report delivery — we optimize every step.', hi: 'बुकिंग से लेकर रिपोर्ट डिलीवरी तक — हम हर कदम को अनुकूलित करते हैं।' },
  about_val_trust: { en: 'Trust', hi: 'विश्वास' },
  about_val_trust_desc: { en: 'Licensed Amins, secure payments, and verified properties.', hi: 'लाइसेंस्ड अमीन, सुरक्षित भुगतान और सत्यापित प्रॉपर्टीज।' },
  about_val_access: { en: 'Accessibility', hi: 'सुलभता' },
  about_val_access_desc: { en: 'Fully online platform available 24/7 on any device.', hi: 'किसी भी डिवाइस पर 24/7 उपलब्ध पूर्णतः ऑनलाइन मंच।' },
  about_team_title: { en: 'Meet the Team', hi: 'हमारी टीम से मिलें' },
  about_team_sr_role: { en: 'Business Development Manager', hi: 'बिजनेस डेवलपमेंट मैनेजर' },
  about_team_rk_role: { en: 'District Admin — Patna', hi: 'जिला एडमिन — पटना' },
  about_team_ps_role: { en: 'District Admin — Araria', hi: 'जिला एडमिन — अररिया' },
  about_team_rc_role: { en: 'Senior Amin — Madhepura', hi: 'सीनियर अमीन — मधेपुरा' },
  about_company_title_page: { en: 'Company Information', hi: 'कंपनी की जानकारी' },
  about_company_label_page: { en: 'Company', hi: 'कंपनी' },
  about_cin: { en: 'CIN', hi: 'CIN' },
  about_reg: { en: 'Registration Number', hi: 'Reg नंबर' },
  about_head_office: { en: 'Head Office', hi: 'प्रधान कार्यालय' },
  about_branch: { en: 'Branch Office', hi: 'शाखा कार्यालय' },
  about_website: { en: 'Website', hi: 'वेबसाइट' },
  about_email: { en: 'Email', hi: 'ईमेल' },
  about_contact_lbl: { en: 'Contact', hi: 'संपर्क' },

  // ══════════════════════════════════════════
  // CONTACT PAGE
  // ══════════════════════════════════════════
  contact_label: { en: 'Get in Touch', hi: 'संपर्क करें' },
  contact_title: { en: 'Contact SP MAPI', hi: 'SP MAPI से संपर्क करें' },
  contact_subtitle: { en: 'Have questions? Our team is here to help.', hi: 'कोई सवाल? हमारी टीम मदद के लिए यहाँ है।' },
  contact_email_us: { en: 'Email Us', hi: 'ईमेल करें' },
  contact_call_us: { en: 'Call Us', hi: 'कॉल करें' },
  contact_head_office: { en: 'Head Office', hi: 'प्रधान कार्यालय' },
  contact_branch: { en: 'Branch: Araria, Bihar', hi: 'शाखा: अररिया, बिहार' },
  contact_office_hours: { en: 'Office Hours', hi: 'कार्यालय समय' },
  contact_mon_sat: { en: 'Mon – Sat', hi: 'सोम – शनि' },
  contact_sunday: { en: 'Sunday', hi: 'रविवार' },
  contact_closed: { en: 'Closed', hi: 'बंद' },
  contact_form_title: { en: 'Send us a Message', hi: 'हमें संदेश भेजें' },
  contact_name: { en: 'Full Name', hi: 'पूरा नाम' },
  contact_mobile: { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  contact_email: { en: 'Email Address', hi: 'ईमेल पता' },
  contact_subject: { en: 'Subject', hi: 'विषय' },
  contact_select_subject: { en: 'Select a subject', hi: 'विषय चुनें' },
  contact_plot_enquiry: { en: 'Plot Enquiry', hi: 'प्लॉट पूछताछ' },
  contact_land_enquiry: { en: 'Land Service Enquiry', hi: 'भूमि सेवा पूछताछ' },
  contact_payment_issue: { en: 'Payment Issue', hi: 'भुगतान समस्या' },
  contact_doc_issue: { en: 'Document Issue', hi: 'दस्तावेज़ समस्या' },
  contact_other: { en: 'Other', hi: 'अन्य' },
  contact_message: { en: 'Message', hi: 'संदेश' },
  contact_msg_placeholder: { en: 'Describe your query in detail...', hi: 'अपनी जानकारी विस्तार से लिखें...' },
  contact_send: { en: 'Send Message', hi: 'संदेश भेजें' },
  contact_sent_title: { en: 'Message Sent!', hi: 'संदेश भेजा गया!' },
  contact_sent_desc: { en: 'Our team will get back to you within 24 hours.', hi: 'हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी।' },
  contact_send_another: { en: 'Send Another Message', hi: 'एक और संदेश भेजें' },

  // ══════════════════════════════════════════
  // SERVICES PAGE
  // ══════════════════════════════════════════
  services_page_label: { en: 'Land Services', hi: 'भूमि सेवाएं' },
  services_page_title: { en: 'Professional Survey Services', hi: 'पेशेवर सर्वेक्षण सेवाएं' },
  services_page_subtitle: {
    en: 'Book government-licensed Amin surveyors for official land measurement, division, map preparation, and boundary surveys across Bihar.',
    hi: 'बिहार भर में आधिकारिक भूमि मापन, बटवारा, नक्शा तैयारी और सीमा सर्वेक्षण के लिए सरकारी लाइसेंस प्राप्त अमीन सर्वेयर बुक करें।'
  },
  services_cta_title: { en: 'Not sure which service you need?', hi: 'कौन सी सेवा चाहिए, तय नहीं कर पा रहे?' },
  services_cta_desc: { en: 'Contact us and our team will guide you to the right service for your land requirements.', hi: 'हमसे संपर्क करें और हमारी टीम आपकी भूमि आवश्यकताओं के लिए सही सेवा में मार्गदर्शन करेगी।' },
  services_contact_us: { en: 'Contact Us', hi: 'संपर्क करें' },
  services_create_book: { en: 'Create Account & Book', hi: 'खाता बनाएं और बुक करें' },

  // ══════════════════════════════════════════
  // PROPERTIES PAGE
  // ══════════════════════════════════════════
  properties_label: { en: 'All Listings', hi: 'सभी लिस्टिंग' },
  properties_title: { en: 'Browse Properties', hi: 'प्रॉपर्टीज देखें' },
  properties_subtitle: { en: 'Find verified plots across {count} districts in Bihar', hi: 'बिहार के {count} जिलों में सत्यापित प्लॉट खोजें' },
  properties_search: { en: 'Search by name or district...', hi: 'नाम या जिले से खोजें...' },
  properties_filters: { en: 'Filters', hi: 'फ़िल्टर' },
  properties_all_districts: { en: 'All Districts', hi: 'सभी जिले' },
  properties_all_types: { en: 'All Types', hi: 'सभी प्रकार' },
  properties_all_status: { en: 'All Status', hi: 'सभी स्थिति' },
  properties_showing: { en: 'Showing', hi: 'दिखा रहा' },
  properties_of: { en: 'of', hi: 'में से' },
  properties_items: { en: 'properties', hi: 'प्रॉपर्टीज' },
  properties_clear: { en: 'Clear Filters', hi: 'फ़िल्टर हटाएं' },
  properties_none_title: { en: 'No Properties Found', hi: 'कोई प्रॉपर्टी नहीं मिली' },
  properties_none_desc: { en: 'Try adjusting your filters or search terms.', hi: 'अपने फ़िल्टर या खोज शब्दों को बदलकर देखें।' },
  properties_view_details: { en: 'View Details →', hi: 'विवरण देखें →' },
  properties_road: { en: 'Road', hi: 'सड़क' },

  // Plot types
  plot_residential: { en: 'Residential', hi: 'आवासीय' },
  plot_commercial: { en: 'Commercial', hi: 'व्यावसायिक' },
  plot_agricultural: { en: 'Agricultural', hi: 'कृषि' },

  // Statuses
  status_available: { en: 'Available', hi: 'उपलब्ध' },
  status_booked: { en: 'Booked', hi: 'बुक्ड' },
  status_sold: { en: 'Sold', hi: 'बिक चुका' },

  // ══════════════════════════════════════════
  // PROPERTY DETAIL PAGE
  // ══════════════════════════════════════════
  detail_back: { en: 'Back to Listings', hi: 'लिस्टिंग पर वापस' },
  detail_share: { en: 'Share', hi: 'शेयर करें' },
  detail_area: { en: 'Area', hi: 'क्षेत्रफल' },
  detail_type: { en: 'Type', hi: 'प्रकार' },
  detail_facing: { en: 'Facing', hi: 'दिशा' },
  detail_road_width: { en: 'Road Width', hi: 'सड़क चौड़ाई' },
  detail_description: { en: 'Description', hi: 'विवरण' },
  detail_amenities: { en: 'Amenities', hi: 'सुविधाएं' },
  detail_plot_price: { en: 'Plot Price', hi: 'प्लॉट कीमत' },
  detail_property_id: { en: 'Property ID', hi: 'प्रॉपर्टी ID' },
  detail_district: { en: 'District', hi: 'जिला' },
  detail_listed_by: { en: 'Listed By', hi: 'लिस्ट किया' },
  detail_book: { en: 'Book This Plot', hi: 'यह प्लॉट बुक करें' },
  detail_contact_admin: { en: 'Contact Admin', hi: 'एडमिन से संपर्क करें' },
  detail_not_available: { en: 'This plot is', hi: 'यह प्लॉट' },
  detail_browse_avail: { en: 'Browse Available Plots', hi: 'उपलब्ध प्लॉट देखें' },
  detail_secure_text: { en: 'Secure payment via Razorpay · SSL encrypted', hi: 'Razorpay द्वारा सुरक्षित भुगतान · SSL एन्क्रिप्टेड' },
  detail_more_in: { en: 'More in', hi: 'और प्लॉट' },
  detail_not_found: { en: 'Property Not Found', hi: 'प्रॉपर्टी नहीं मिली' },
  detail_back_listings: { en: 'Back to Listings', hi: 'लिस्टिंग पर वापस' },

  // ══════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════
  footer_brand_name: { en: 'SP MAPI', hi: 'SP MAPI' },
  footer_brand_tagline: { en: 'Real Estate & Land Services', hi: 'रियल एस्टेट और भूमि सेवाएं' },
  footer_brand_desc: {
    en: 'SP MAPI is your trusted partner for plot booking, land measurement, and professional survey services across Bihar.',
    hi: 'SP MAPI बिहार भर में प्लॉट बुकिंग, भूमि मापन और पेशेवर सर्वेक्षण सेवाओं के लिए आपका भरोसेमंद साथी है।'
  },
  footer_about_us: { en: 'About Us', hi: 'हमारे बारे में' },
  footer_company: { en: 'Company', hi: 'कंपनी' },
  footer_our_team: { en: 'Our Team', hi: 'हमारी टीम' },
  footer_careers: { en: 'Careers', hi: 'करियर' },
  footer_contact: { en: 'Contact', hi: 'संपर्क' },
  footer_services: { en: 'Services', hi: 'सेवाएं' },
  footer_maapi: { en: 'Land Measurement (Maapi)', hi: 'भूमि मापन (मापी)' },
  footer_division: { en: 'Division Survey', hi: 'बटवारा सर्वेक्षण' },
  footer_map: { en: 'Map Preparation', hi: 'नक्शा तैयारी' },
  footer_boundary: { en: 'Boundary Survey', hi: 'सीमा सर्वेक्षण' },
  footer_quick: { en: 'Quick Links', hi: 'त्वरित लिंक' },
  footer_browse: { en: 'Browse Properties', hi: 'प्रॉपर्टीज देखें' },
  footer_customer_login: { en: 'Customer Login', hi: 'ग्राहक लॉगिन' },
  footer_admin_login: { en: 'Admin Login', hi: 'एडमिन लॉगिन' },
  footer_super_admin_login: { en: 'Super Admin Login', hi: 'सुपर एडमिन लॉगिन' },

  footer_amin_portal: { en: 'Amin Portal', hi: 'अमीन पोर्टल' },
  footer_copyright: { en: '© 2026 SP MAPI. All rights reserved.', hi: '© 2026 SP MAPI. सर्वाधिकार सुरक्षित।' },
  footer_privacy: { en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
  footer_terms: { en: 'Terms of Service', hi: 'सेवा की शर्तें' },
  footer_head_office: { en: 'Head Office: Plot No. 432, VCT - Kumhra, Post - Mirzapur, Dist - Araria, Bihar - 854312', hi: 'प्रधान कार्यालय: प्लॉट नं. 432, VCT - कुम्हरा, पोस्ट - मिर्जापुर, जिला - अररिया, बिहार - 854312' },

  // ══════════════════════════════════════════
  // REQUEST STATUS CHECK
  // ══════════════════════════════════════════
  request_label: { en: 'Track Your Request', hi: 'अपना अनुरोध ट्रैक करें' },
  request_title: { en: 'Check Request Status', hi: 'रिक्वेस्ट स्टेटस चेक करें' },
  request_subtitle: { en: 'Enter your Request ID to check the current status of your land measurement or service booking.', hi: 'अपनी भूमि मापन या सेवा बुकिंग की वर्तमान स्थिति जानने के लिए अपना रिक्वेस्ट ID दर्ज करें।' },
  request_placeholder: { en: 'Enter Request ID / रिक्वेस्ट आईडी डालें...', hi: 'रिक्वेस्ट आईडी डालें...' },
  request_btn: { en: 'Get Status', hi: 'स्टेटस देखें' },
  request_empty: { en: 'Please enter a valid Request ID', hi: 'कृपया एक वैध रिक्वेस्ट ID दर्ज करें' },
  request_not_found: { en: 'No request found with this ID. Please check and try again.', hi: 'इस ID से कोई रिक्वेस्ट नहीं मिला। कृपया जाँच करें और पुनः प्रयास करें।' },
  request_found_title: { en: 'Request Found!', hi: 'रिक्वेस्ट मिला!' },
  request_id_label: { en: 'Request ID', hi: 'रिक्वेस्ट ID' },
  request_service_label: { en: 'Service', hi: 'सेवा' },
  request_status_label: { en: 'Status', hi: 'स्थिति' },
  request_date_label: { en: 'Submitted On', hi: 'जमा दिनांक' },
  request_status_pending: { en: 'Pending Review', hi: 'समीक्षा लंबित' },
  request_status_assigned: { en: 'Amin Assigned', hi: 'अमीन नियुक्त' },
  request_status_in_progress: { en: 'In Progress', hi: 'प्रगति में' },
  request_status_completed: { en: 'Completed', hi: 'पूर्ण' },
  request_note: { en: 'For detailed updates, please login to your account or contact us.', hi: 'विस्तृत अपडेट के लिए, कृपया अपने खाते में लॉगिन करें या हमसे संपर्क करें।' },

  // ══════════════════════════════════════════
  // LANGUAGE TOGGLE
  // ══════════════════════════════════════════
  lang_hindi: { en: 'हिंदी', hi: 'हिंदी' },
  lang_english: { en: 'English', hi: 'English' },
};

Object.assign(translations, {
  admin_pending_apps: { en: 'Pending Applications', hi: 'लंबित आवेदन' },
  nav_apply_tools: { en: 'Apply for Amin Tools', hi: 'अमीन उपकरण आवेदन' },
  lang_bilingual: { en: 'English + हिन्दी', hi: 'English + हिन्दी' },

  hero_desc: {
    en: 'SPMAPI Private Limited is a registered land survey and measurement firm based in Bihar. Apply for land measurement, Batwara, map copies, survey support, and track your application online.',
    hi: 'SPMAPI प्राइवेट लिमिटेड बिहार स्थित एक पंजीकृत भूमि सर्वेक्षण एवं मापन कंपनी है। जमीन मापी, बटवारा, नक्शा, सर्वे सहायता के लिए आवेदन करें और अपना आवेदन ऑनलाइन ट्रैक करें।'
  },
  hero_feat_payment: { en: 'Status Tracking', hi: 'स्टेटस ट्रैकिंग' },
  hero_feat_amins: { en: 'Certified Amins', hi: 'प्रमाणित अमीन' },

  services_subtitle: {
    en: 'Professional land measurement, demarcation, map request support, boundary verification, and digital land mapping across Bihar.',
    hi: 'बिहार भर में पेशेवर जमीन मापी, सीमांकन, नक्शा एवं सर्वे सहायता, सीमा सत्यापन और डिजिटल भूमि मानचित्रण सेवाएँ।'
  },
  service_maapi_name: { en: 'Apply for mapi', hi: 'जमीन मापी के लिए आवेदन (Apply for Mapi)' },
  service_maapi_desc: {
    en: 'Accurate measurement of land parcels to determine exact property dimensions and boundaries.',
    hi: 'भूमि की सही लंबाई, चौड़ाई, क्षेत्रफल और सीमाओं का सटीक मापन।'
  },
  service_division_name: { en: 'Apply for batwara', hi: 'बटवारा के लिए आवेदन (Apply for Batwara)' },
  service_division_desc: {
    en: 'Identification and marking of legal property boundaries on the ground to prevent future disputes and encroachments.',
    hi: 'भूमि की कानूनी सीमाओं को चिन्हित करना ताकि भविष्य में विवाद और अतिक्रमण से बचा जा सके।'
  },
  service_map_name: { en: 'Apply for map', hi: 'नक्शा के लिए आवेदन (Apply for Map)' },
  service_map_desc: {
    en: 'Assistance in obtaining official land maps and assigning certified Amin surveyors for professional property measurement.',
    hi: 'आधिकारिक भूमि नक्शा प्राप्त करने तथा प्रमाणित अमीन की नियुक्ति में सहायता।'
  },
  service_boundary_name: { en: 'Property Boundary Verification', hi: 'भूमि सीमा सत्यापन' },
  service_boundary_desc: {
    en: 'Verification of existing property boundaries using official records and field surveys.',
    hi: 'राजस्व अभिलेखों एवं स्थल निरीक्षण के आधार पर भूमि सीमा का सत्यापन।'
  },
  service_digital_name: { en: 'Digital Land Mapping', hi: 'डिजिटल भूमि मानचित्रण' },
  service_digital_desc: {
    en: 'Creation of digital maps and property records for better land management and documentation.',
    hi: 'भूमि का डिजिटल नक्शा तैयार करना जिससे रिकॉर्ड प्रबंधन और दस्तावेज़ीकरण आसान हो सके।'
  },
  service_tools_name: { en: 'Apply for all amin tools', hi: 'अमीन औजार के लिए आवेदन (Apply for All Amin Tools)' },
  service_tools_desc: {
    en: 'Request survey tools such as kitab, guniya, drafting compass, measuring tape, chain, scales, and ETS machine with quantity selection.',
    hi: 'किताब, गुणिया, ड्राफ्टिंग कम्पास, फीता, चेन, स्केल और ETS मशीन जैसे सर्वे उपकरण मात्रा सहित अनुरोध करें।'
  },
  service_digital_step1: { en: 'Submit digital mapping request', hi: 'डिजिटल मैपिंग अनुरोध जमा करें' },
  service_digital_step2: { en: 'Official records and field details reviewed', hi: 'राजस्व अभिलेख और स्थल विवरण की समीक्षा' },
  service_digital_step3: { en: 'Certified Amin survey support assigned', hi: 'प्रमाणित अमीन सर्वे सहायता नियुक्त' },
  service_digital_step4: { en: 'Digital land map prepared', hi: 'डिजिटल भूमि नक्शा तैयार' },
  service_digital_step5: { en: 'Map and records shared for documentation', hi: 'दस्तावेज़ीकरण हेतु नक्शा और रिकॉर्ड साझा' },
  service_tools_step1: { en: 'Select required survey tools', hi: 'आवश्यक सर्वे उपकरण चुनें' },
  service_tools_step2: { en: 'Add quantity for each tool', hi: 'हर उपकरण की मात्रा जोड़ें' },
  service_tools_step3: { en: 'Submit tool request online', hi: 'उपकरण अनुरोध ऑनलाइन जमा करें' },
  service_tools_step4: { en: 'Admin checks inventory availability', hi: 'एडमिन स्टॉक उपलब्धता जाँचता है' },
  service_tools_step5: { en: 'Tools are issued or scheduled for delivery', hi: 'उपकरण जारी या डिलीवरी के लिए निर्धारित' },
  doc_vanshawali: { en: 'Vanshawali (Family Tree)', hi: 'वंशावली (Family Tree)' },
  doc_khatian: { en: 'Khatiyan / Land Record Copy', hi: 'खतियान / भूमि रिकॉर्ड कॉपी' },

  why_label: { en: 'Why SPMAPI?', hi: 'SPMAPI क्यों चुनें?' },
  why_title: { en: 'Reliable Support for Accurate Land Survey Work', hi: 'सटीक भूमि सर्वे कार्य के लिए भरोसेमंद सहयोग' },
  why_1_title: { en: 'Professional and Certified', hi: 'प्रमाणित एवं पेशेवर' },
  why_1_desc: {
    en: 'Professional and certified survey services with support throughout the survey process.',
    hi: 'प्रमाणित एवं अनुभवी सर्वेक्षण सेवाएँ और संपूर्ण सर्वेक्षण सहायता।'
  },
  why_2_title: { en: 'Accurate and Modern', hi: 'सटीक और आधुनिक' },
  why_2_desc: {
    en: 'Accurate land measurement using modern mapping technology and field expertise.',
    hi: 'आधुनिक तकनीक और अनुभवी विशेषज्ञों की सहायता से सटीक भूमि मापन।'
  },
  why_3_title: { en: 'Transparent and Quick', hi: 'पारदर्शी और त्वरित' },
  why_3_desc: {
    en: 'Transparent process, quick service delivery, and assistance in resolving boundary-related disputes.',
    hi: 'पारदर्शी प्रक्रिया, त्वरित सेवा और भूमि विवाद समाधान में सहयोग।'
  },

  about_company_label: { en: 'About SPMAPI Private Limited', hi: 'SPMAPI प्राइवेट लिमिटेड के बारे में' },
  about_company_title: { en: 'Digitizing Property Boundaries Across Bihar', hi: 'बिहार में भूमि सीमाओं का डिजिटलीकरण' },
  about_company_desc: {
    en: 'SPMAPI Private Limited is a registered land survey and measurement firm based in Bihar. Our mission is to digitize property boundaries and provide accurate land mapping solutions that help resolve and prevent land disputes among families, neighbors, and property owners. We combine modern surveying techniques with professional expertise to deliver precise land measurement, boundary verification, and mapping services across Bihar.',
    hi: 'SPMAPI प्राइवेट लिमिटेड बिहार स्थित एक पंजीकृत भूमि सर्वेक्षण एवं मापन कंपनी है। हमारा उद्देश्य भूमि सीमाओं का डिजिटलीकरण करना तथा सटीक भूमि मानचित्रण सेवाएँ प्रदान करना है, जिससे परिवारों, पड़ोसियों और भूमि मालिकों के बीच होने वाले भूमि विवादों को रोका और सुलझाया जा सके। हम आधुनिक सर्वेक्षण तकनीकों और अनुभवी विशेषज्ञों की सहायता से सटीक भूमि माप, सीमा सत्यापन और मानचित्रण सेवाएँ प्रदान करते हैं।'
  },
  about_company_feat1: { en: 'Professional and certified survey services', hi: 'प्रमाणित एवं अनुभवी सर्वेक्षण सेवाएँ' },
  about_company_feat2: { en: 'Accurate land measurement', hi: 'सटीक भूमि मापन' },
  about_company_feat3: { en: 'Modern mapping technology', hi: 'आधुनिक तकनीक आधारित सर्वे' },
  about_company_feat4: { en: 'Transparent process and quick service delivery', hi: 'पारदर्शी प्रक्रिया और त्वरित सेवा' },
  about_company_feat5: { en: 'Support in resolving boundary-related disputes', hi: 'भूमि विवाद समाधान में सहयोग' },
  about_hero_title: { en: 'About SPMAPI', hi: 'SPMAPI के बारे में' },
  about_hero_desc: {
    en: 'SPMAPI Private Limited is a registered land survey and measurement firm based in Bihar. Our mission is to digitize property boundaries and provide accurate land mapping solutions that help resolve and prevent land disputes among families, neighbors, and property owners.',
    hi: 'SPMAPI प्राइवेट लिमिटेड बिहार स्थित एक पंजीकृत भूमि सर्वेक्षण एवं मापन कंपनी है। हमारा उद्देश्य भूमि सीमाओं का डिजिटलीकरण करना तथा सटीक भूमि मानचित्रण सेवाएँ प्रदान करना है, जिससे परिवारों, पड़ोसियों और भूमि मालिकों के बीच होने वाले भूमि विवादों को रोका और सुलझाया जा सके।'
  },
  about_mission_desc: {
    en: 'To digitize property boundaries and provide accurate land mapping solutions that help resolve and prevent land disputes.',
    hi: 'भूमि सीमाओं का डिजिटलीकरण करना तथा सटीक भूमि मानचित्रण सेवाएँ प्रदान करना, जिससे भूमि विवादों को रोका और सुलझाया जा सके।'
  },
  about_vision_desc: {
    en: 'To combine modern surveying techniques with professional expertise for precise land measurement, boundary verification, and mapping services across Bihar.',
    hi: 'आधुनिक सर्वेक्षण तकनीकों और अनुभवी विशेषज्ञों की सहायता से बिहार भर में सटीक भूमि माप, सीमा सत्यापन और मानचित्रण सेवाएँ प्रदान करना।'
  },
  about_val_transparency_desc: {
    en: 'Transparent process for land survey, status updates, and documentation support.',
    hi: 'भूमि सर्वे, स्टेटस अपडेट और दस्तावेज़ सहायता के लिए पारदर्शी प्रक्रिया।'
  },
  about_val_speed_desc: {
    en: 'Quick service delivery with support throughout the survey process.',
    hi: 'संपूर्ण सर्वेक्षण सहायता के साथ त्वरित सेवा उपलब्धता।'
  },
  about_val_trust_desc: {
    en: 'Certified survey services, accurate measurement, and modern mapping technology.',
    hi: 'प्रमाणित सर्वेक्षण सेवाएँ, सटीक भूमि मापन और आधुनिक मानचित्रण तकनीक।'
  },
  about_val_access_desc: {
    en: 'Operational support across Bihar including Araria and nearby districts.',
    hi: 'अररिया एवं आसपास के जिलों सहित बिहार के विभिन्न जिलों में सेवा सहयोग।'
  },
  about_company_label_page: { en: 'Company', hi: 'कंपनी' },

  contact_title: { en: 'Contact SPMAPI', hi: 'SPMAPI से संपर्क करें' },
  contact_subtitle: { en: 'Contact us for land measurement, demarcation, map requests, survey support, and application status help.', hi: 'जमीन मापी, सीमांकन, नक्शा अनुरोध, सर्वे सहायता और आवेदन स्थिति सहयोग के लिए संपर्क करें।' },
  contact_branch: { en: 'Operational Areas: Across Bihar including Araria and nearby districts', hi: 'कार्य क्षेत्र: बिहार के विभिन्न जिलों सहित अररिया एवं आसपास के क्षेत्र' },
  contact_plot_enquiry: { en: 'Application Status Enquiry', hi: 'आवेदन स्थिति पूछताछ' },
  contact_land_enquiry: { en: 'Land Survey Service Enquiry', hi: 'भूमि सर्वे सेवा पूछताछ' },
  contact_payment_issue: { en: 'Amin Tools Request', hi: 'अमीन उपकरण अनुरोध' },
  contact_doc_issue: { en: 'Documents / Map Support', hi: 'दस्तावेज़ / नक्शा सहायता' },

  services_page_title: { en: 'Professional Land Survey Services', hi: 'पेशेवर भूमि सर्वेक्षण सेवाएँ' },
  services_page_subtitle: {
    en: 'Apply for land measurement, Batwara, map copies, survey tools, and certified Amin support. Track status from pending review through completion.',
    hi: 'जमीन मापी, बटवारा, नक्शा, सर्वे उपकरण और प्रमाणित अमीन सहायता के लिए आवेदन करें। लंबित समीक्षा से पूर्ण होने तक स्थिति ट्रैक करें।'
  },
  services_cta_desc: {
    en: 'Contact us and our team will guide you to the right service for your land survey, map, Batwara, or tool request.',
    hi: 'हमसे संपर्क करें और हमारी टीम आपकी जमीन मापी, नक्शा, बटवारा या उपकरण आवश्यकता के लिए सही सेवा में मार्गदर्शन करेगी।'
  },

  footer_brand_tagline: { en: 'Land Survey & Mapping Services', hi: 'भूमि सर्वेक्षण एवं मानचित्रण सेवाएँ' },
  footer_brand_desc: {
    en: 'SPMAPI Private Limited provides accurate land measurement, boundary verification, map request support, and digital land mapping services across Bihar.',
    hi: 'SPMAPI प्राइवेट लिमिटेड बिहार भर में सटीक भूमि मापन, सीमा सत्यापन, नक्शा सहायता और डिजिटल भूमि मानचित्रण सेवाएँ प्रदान करती है।'
  },
  footer_maapi: { en: 'Land Measurement (Jameen Mapi)', hi: 'जमीन मापी' },
  footer_division: { en: 'Land Demarcation', hi: 'भूमि सीमांकन' },
  footer_map: { en: 'Map Request & Survey Support', hi: 'नक्शा एवं सर्वे सहायता' },
  footer_boundary: { en: 'Property Boundary Verification', hi: 'भूमि सीमा सत्यापन' },
  footer_browse: { en: 'Pending Applications', hi: 'लंबित आवेदन' },
  footer_head_office: { en: 'Head Office: Plot No. 432, VCT - Kumhra, Post - Mirzapur, Dist - Araria, Bihar - 854312', hi: 'मुख्य कार्यालय: प्लॉट नं. 432, VCT - कुम्हरा, पोस्ट - मिर्जापुर, जिला - अररिया, बिहार - 854312' },

  request_title: { en: 'Search Application Status', hi: 'आवेदन स्थिति खोजें' },
  request_subtitle: {
    en: 'Enter your Application ID to view current status, assigned Amin, survey date, survey time, and remarks.',
    hi: 'वर्तमान स्थिति, नियुक्त अमीन, सर्वे दिनांक, सर्वे समय और टिप्पणी देखने के लिए अपना आवेदन ID दर्ज करें।'
  },
  request_id_label: { en: 'Application ID', hi: 'आवेदन ID' },
  request_status_pending: { en: 'Pending', hi: 'लंबित' },
  request_status_assigned: { en: 'Amin Assigned', hi: 'अमीन नियुक्त' },
  request_status_in_progress: { en: 'Survey Scheduled', hi: 'सर्वे निर्धारित' },
  request_note: { en: 'Status examples include Pending, Under Review, Amin Assigned, Survey Scheduled, Completed, and Rejected.', hi: 'स्थिति उदाहरण: लंबित, समीक्षा में, अमीन नियुक्त, सर्वे निर्धारित, पूर्ण, अस्वीकृत।' },
  request_assigned_amin: { en: 'Assigned Amin', hi: 'नियुक्त अमीन' },
  request_survey_time: { en: 'Survey Time', hi: 'सर्वे समय' },
  request_remarks: { en: 'Remarks', hi: 'टिप्पणी' },
  request_demo_remark: { en: 'Amin assigned. Survey schedule shared with customer.', hi: 'अमीन नियुक्त। सर्वे समय-सारणी ग्राहक के साथ साझा की गई।' },
});

export default translations;
