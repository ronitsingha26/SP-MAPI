import React, { useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray/30">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-brand-green-pale animate-fade-in">
          <h1 className="text-3xl font-bold text-brand-text mb-6">Terms and Conditions</h1>
          <div className="space-y-6 text-brand-text-muted leading-relaxed">
            <p>
              Welcome to SP MAPI Private Limited. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h2 className="text-xl font-bold text-brand-text mt-8">1. Services</h2>
            <p>
              SP MAPI provides an online platform for booking land measurement services, applying for Amin tools, and managing property-related tasks. All services are subject to availability and verification.
            </p>
            <h2 className="text-xl font-bold text-brand-text mt-8">2. Payments and Refunds</h2>
            <p>
              Payments for services must be made through our designated payment gateway (Razorpay). In the event of a cancellation or rejected application, refunds will be processed in accordance with our refund policy and typically take 5-7 business days to reflect in your account.
            </p>
            <h2 className="text-xl font-bold text-brand-text mt-8">3. User Responsibilities</h2>
            <p>
              You agree to provide accurate and complete information when booking services. Providing false information may result in the rejection of your application or suspension of your account.
            </p>
            <h2 className="text-xl font-bold text-brand-text mt-8">4. Modifications</h2>
            <p>
              SP MAPI reserves the right to modify these terms and conditions at any time without prior notice. Your continued use of the website following any changes constitutes acceptance of the new terms.
            </p>
            <h2 className="text-xl font-bold text-brand-text mt-8">5. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India, specifically within the jurisdiction of Bihar courts.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
