
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-purple to-brand-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  At RideMatch St. Lucia, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-brand-dark mb-3">Personal Information</h3>
                  <p className="text-gray-700 mb-4">
                    When you create an account or make a booking, we may collect:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Name, email address, and phone number</li>
                    <li>Driver's license information and age</li>
                    <li>Passport details (for international visitors)</li>
                    <li>Payment information (processed securely through third-party processors)</li>
                    <li>Pickup and delivery location preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-dark mb-3">Usage Information</h3>
                  <p className="text-gray-700 mb-4">
                    We automatically collect information about how you use our platform:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>IP address, browser type, and device information</li>
                    <li>Pages visited and time spent on our platform</li>
                    <li>Search queries and booking preferences</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">
                    We use your information to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Process and manage your vehicle rental bookings</li>
                    <li>Communicate with you about your reservations</li>
                    <li>Connect you with rental companies</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Improve our platform and services</li>
                    <li>Send promotional communications (with your consent)</li>
                    <li>Comply with legal obligations and prevent fraud</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Information Sharing</h2>
                  <p className="text-gray-700 mb-4">
                    We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li><strong>Rental Companies:</strong> To process your booking and rental agreement</li>
                    <li><strong>Payment Processors:</strong> To handle secure payment transactions</li>
                    <li><strong>Service Providers:</strong> Who help us operate and improve our platform</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                  </ul>
                  <p className="text-gray-700">
                    We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Data Security</h2>
                  <p className="text-gray-700 mb-4">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                    <li>Secure payment processing through certified providers</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Cookies and Tracking</h2>
                  <p className="text-gray-700 mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze platform usage and performance</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Enable social media features</li>
                  </ul>
                  <p className="text-gray-700">
                    You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Your Rights</h2>
                  <p className="text-gray-700 mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Access and review your personal information</li>
                    <li>Request corrections to inaccurate information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt out of marketing communications</li>
                    <li>Data portability (receive your data in a structured format)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Data Retention</h2>
                  <p className="text-gray-700">
                    We retain your personal information only as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Inactive accounts may be deleted after a period of inactivity.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Children's Privacy</h2>
                  <p className="text-gray-700">
                    Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe we have collected information about your child, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">International Transfers</h2>
                  <p className="text-gray-700">
                    Your information may be transferred to and processed in countries other than St. Lucia. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Changes to This Policy</h2>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our platform after any changes indicates your acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-brand-light p-6 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> privacy@ridematchstlucia.com
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>General Contact:</strong> info@ridematchstlucia.com
                    </p>
                    <p className="text-gray-700">
                      <strong>Address:</strong> Castries, St. Lucia
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
