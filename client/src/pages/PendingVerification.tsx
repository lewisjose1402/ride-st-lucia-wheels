import { AlertCircle, Clock, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PendingVerification = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                Account Pending Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your company account is currently under review. Our team is conducting background checks and verifying your business information.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Our team reviews your company information and conducts necessary background checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>We may contact you for additional documentation or clarification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-brand-purple rounded-full mt-2 flex-shrink-0"></div>
                      <span>Once approved, you'll receive an email notification and full access to your company dashboard</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>Phone number on file</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Typical review time:</strong> 1-3 business days
                  </p>
                  <p className="text-sm text-gray-600">
                    If you have questions about your application status, please contact our support team at{" "}
                    <a href="mailto:support@ridematchstlucia.com" className="text-brand-purple hover:text-brand-purple-dark">
                      support@ridematchstlucia.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PendingVerification;