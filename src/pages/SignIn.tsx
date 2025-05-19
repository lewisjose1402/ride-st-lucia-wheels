
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building, ArrowRight } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const { signIn, isRentalCompany, profile } = useAuth();
  const navigate = useNavigate();

  // Handle redirection after successful sign-in
  useEffect(() => {
    if (signInSuccess && profile) {
      console.log("Redirecting based on role, profile:", profile);
      
      // All users should be redirected to company dashboard as we only have company accounts
      navigate('/company');
    }
  }, [signInSuccess, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        console.log("Sign-in successful");
        setSignInSuccess(true);
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-md rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Need a rental company account?{" "}
              <Link to="/signup" className="font-medium text-brand-purple hover:text-brand-purple-dark">
                Create a company account
              </Link>
            </p>

            {/* Account type information */}
            <div className="mt-6 flex justify-center">
              <div className="p-4 border rounded-md bg-gray-50 max-w-xs">
                <Building className="h-6 w-6 text-brand-purple mx-auto mb-2" />
                <h3 className="font-semibold">Company Accounts Only</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Our platform is exclusively for rental companies in St. Lucia. Sign in with your company credentials.
                </p>
              </div>
            </div>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/reset-password" className="font-medium text-brand-purple hover:text-brand-purple-dark">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purple-dark flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Signing in...'
              ) : (
                <>
                  Sign in <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
