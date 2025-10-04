import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 5, 2025</p>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information you provide directly to us, including name, email address, 
                phone number, location data, and payment information when you use Relief Hub.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Facilitate relief operations and connect those in need with volunteers</li>
                <li>Process donations and maintain transaction records</li>
                <li>Send verification codes and important notifications</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
              <p className="text-gray-700 mb-3">
                We share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Other users (name and general location when requesting/providing help)</li>
                <li>Payment processors (Stripe, GCash) for donation processing</li>
                <li>Service providers (email, SMS, hosting services)</li>
                <li>Law enforcement when required by law</li>
              </ul>
              <p className="text-gray-700 mt-3">
                <strong>We never sell your personal information.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Payment Processing Fees</h2>
              <p className="text-gray-700">
                We charge a 2.5% payment processing fee and ₱0.25 per ₱10 platform maintenance fee 
                (total ~5% of donation amount). These fees support platform operations, security, 
                and technical support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-700">
                We implement industry-standard security measures including encryption, secure storage, 
                access controls, and regular security audits to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-700 mb-3">
                Under the Philippine Data Privacy Act, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to certain data processing</li>
                <li>Receive your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
              <p className="text-gray-700">
                For privacy concerns, contact us at: <strong>privacy@reliefhub.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;