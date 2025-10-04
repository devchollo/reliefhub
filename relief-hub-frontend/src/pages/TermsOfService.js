export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: October 5, 2025</p>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing Relief Hub, you agree to be bound by these Terms of Service. 
                If you disagree with any part, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. User Conduct</h2>
              <p className="text-gray-700 mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Post false or misleading information</li>
                <li>Request assistance you don't need</li>
                <li>Use the platform for fraudulent purposes</li>
                <li>Harass, abuse, or harm others</li>
                <li>Violate any laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Donations</h2>
              <p className="text-gray-700 mb-3">
                All donations are voluntary and go directly to recipients (minus fees). 
                Donations are generally non-refundable except in cases of fraud.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                <p className="text-sm text-yellow-800">
                  <strong>Mandatory Fee Disclosure:</strong> We charge a 2.5% payment processing fee 
                  and ₱0.25 per ₱10 (2.5%) platform maintenance fee. Total fees: approximately 5%.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Verification</h2>
              <p className="text-gray-700">
                Email and phone verification are required. We may require additional verification 
                for monetary requests to prevent fraud.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">
                Relief Hub is provided "AS IS" without warranties. We are not liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Actions or inactions of users</li>
                <li>Quality or safety of assistance provided</li>
                <li>Loss or damage resulting from platform use</li>
                <li>Accuracy of user-posted content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Termination</h2>
              <p className="text-gray-700">
                We may suspend or terminate accounts for violations of these terms, 
                fraudulent activity, or legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of the Republic of the Philippines. 
                Any disputes shall be resolved in Philippine courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Contact</h2>
              <p className="text-gray-700">
                For questions about these terms: <strong>legal@reliefhub.com</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;