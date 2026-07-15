import React, { useEffect } from 'react';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-brand-green-pale animate-fade-in">
        <h1 className="text-3xl font-bold text-brand-text mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-brand-text-muted leading-relaxed">
          <p>
            Welcome to SP MAPI Private Limited. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website and services.
          </p>
          <h2 className="text-xl font-bold text-brand-text mt-8">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when registering for an account, booking land measurement services, or applying for Amin tools. This may include your name, contact information, property details, and payment information.
          </p>
          <h2 className="text-xl font-bold text-brand-text mt-8">2. Use of Information</h2>
          <p>
            The information we collect is used to process your requests, communicate with you regarding your applications or bookings, process payments, and improve our platform's services.
          </p>
          <h2 className="text-xl font-bold text-brand-text mt-8">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, or disclosure. All payment transactions are encrypted and processed through secure gateways like Razorpay.
          </p>
          <h2 className="text-xl font-bold text-brand-text mt-8">4. Sharing of Information</h2>
          <p>
            We do not sell your personal information. We may share necessary details with our verified Amins (surveyors) solely for the purpose of fulfilling your requested land measurement services.
          </p>
          <h2 className="text-xl font-bold text-brand-text mt-8">5. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, please contact us at our official email address or through the contact form on our website.
          </p>
        </div>
      </div>
    </div>
  );
}

