
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-purple to-brand-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              The terms and conditions governing your use of RideMatch St. Lucia
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  Welcome to RideMatch St. Lucia. These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using our platform, you agree to be bound by these Terms.
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">1. Platform Overview</h2>
                  <p className="text-gray-700 mb-4">
                    RideMatch St. Lucia is a platform that connects tourists and visitors with local car rental companies in St. Lucia. We facilitate bookings but are not a rental company ourselves. The actual rental agreement is between you and the individual rental company.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">2. Eligibility</h2>
                  <p className="text-gray-700 mb-4">
                    To use our platform, you must:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Be at least 18 years old</li>
                    <li>Have a valid driver's license</li>
                    <li>Provide accurate and complete information</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">3. Booking Process</h2>
                  
                  <h3 className="text-xl font-semibold text-brand-dark mb-3">Reservations</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>All bookings are subject to availability</li>
                    <li>A confirmation deposit is required to secure your reservation</li>
                    <li>You will receive booking confirmation via email</li>
                    <li>The rental company will contact you with pickup details</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-dark mb-3">Payment Terms</h3>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Confirmation deposit is paid through our platform</li>
                    <li>Remaining balance is paid directly to the rental company</li>
                    <li>All prices are displayed in USD unless otherwise noted</li>
                    <li>Additional fees may apply for delivery, permits, or insurance</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">4. Cancellation and Refunds</h2>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Cancellation policies vary by rental company</li>
                    <li>Most companies allow free cancellation 24-48 hours before pickup</li>
                    <li>Late cancellations may result in forfeiture of the confirmation deposit</li>
                    <li>Refunds for the confirmation deposit will be processed within 5-10 business days</li>
                    <li>Weather-related cancellations are handled on a case-by-case basis</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">5. User Responsibilities</h2>
                  <p className="text-gray-700 mb-4">
                    As a user of our platform, you agree to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Provide accurate and truthful information</li>
                    <li>Comply with all rental company terms and conditions</li>
                    <li>Follow all local traffic laws and regulations</li>
                    <li>Return the vehicle in the same condition as received</li>
                    <li>Report any accidents or damage immediately</li>
                    <li>Not use the platform for illegal activities</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">6. Rental Company Responsibilities</h2>
                  <p className="text-gray-700 mb-4">
                    Rental companies on our platform agree to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Maintain vehicles in safe, roadworthy condition</li>
                    <li>Provide accurate vehicle descriptions and pricing</li>
                    <li>Honor confirmed bookings</li>
                    <li>Comply with local licensing and insurance requirements</li>
                    <li>Provide customer support for their rentals</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">7. Platform Usage</h2>
                  <p className="text-gray-700 mb-4">
                    You may not:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Use the platform for commercial purposes without authorization</li>
                    <li>Attempt to circumvent our booking system</li>
                    <li>Upload malicious content or code</li>
                    <li>Impersonate others or provide false information</li>
                    <li>Interfere with the platform's operation</li>
                    <li>Violate intellectual property rights</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">8. Limitation of Liability</h2>
                  <p className="text-gray-700 mb-4">
                    RideMatch St. Lucia serves as an intermediary platform. We are not liable for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>The condition, safety, or legality of rental vehicles</li>
                    <li>Actions or omissions of rental companies</li>
                    <li>Accidents, damages, or injuries during rental periods</li>
                    <li>Disputes between users and rental companies</li>
                    <li>Loss of personal property</li>
                    <li>Business interruption or lost profits</li>
                  </ul>
                  <p className="text-gray-700">
                    Our liability is limited to the amount of the confirmation deposit paid through our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">9. Insurance and Coverage</h2>
                  <p className="text-gray-700 mb-4">
                    Insurance coverage is provided by rental companies and varies by provider. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Understanding the insurance coverage included</li>
                    <li>Purchasing additional coverage if desired</li>
                    <li>Reporting accidents to the rental company and authorities</li>
                    <li>Any damages exceeding insurance coverage limits</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">10. Dispute Resolution</h2>
                  <p className="text-gray-700 mb-4">
                    In case of disputes:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>First, attempt to resolve directly with the rental company</li>
                    <li>Contact our customer support for assistance</li>
                    <li>Disputes will be governed by St. Lucia law</li>
                    <li>Arbitration may be required for unresolved disputes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">11. Privacy</h2>
                  <p className="text-gray-700">
                    Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">12. Changes to Terms</h2>
                  <p className="text-gray-700">
                    We may update these Terms from time to time. Material changes will be communicated via email or platform notification. Continued use of our platform after changes indicates acceptance of the updated Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">13. Termination</h2>
                  <p className="text-gray-700 mb-4">
                    We may terminate or suspend your access to our platform for:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                    <li>Violation of these Terms</li>
                    <li>Fraudulent or illegal activity</li>
                    <li>Providing false information</li>
                    <li>Abuse of our platform or staff</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">14. Contact Information</h2>
                  <p className="text-gray-700 mb-4">
                    If you have questions about these Terms, please contact us:
                  </p>
                  <div className="bg-brand-light p-6 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> legal@ridematchstlucia.com
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>General Contact:</strong> info@ridematchstlucia.com
                    </p>
                    <p className="text-gray-700">
                      <strong>Address:</strong> Castries, St. Lucia
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4">15. Severability</h2>
                  <p className="text-gray-700">
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will continue to be valid and enforceable.
                  </p>
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

export default TermsOfService;
