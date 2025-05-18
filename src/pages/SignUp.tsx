
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building, Info } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setPasswordError('');
    setIsSubmitting(true);

    try {
      // Include company metadata
      const metadata = { 
        company_name: companyName, 
        registration_number: registrationNumber, 
        is_company: true 
      };
      
      const result = await signUp(email, password, metadata);
      if (result.success) {
        navigate('/signin');
      }
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
            <h2 className="text-3xl font-extrabold text-gray-900">Create Company Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link to="/signin" className="font-medium text-brand-purple hover:text-brand-purple-dark">
                sign in to your existing account
              </Link>
            </p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-left text-blue-700">
                  <p className="font-semibold">Rental companies sign up here</p>
                  <p className="mt-1">
                    Create your company account to list and manage your vehicles for rent in St. Lucia. 
                    Personal accounts for booking vehicles can be created during the booking process.
                  </p>
                </div>
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
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Registration Number
                </label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  required
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="mt-1"
                  placeholder="Enter company registration number"
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Confirm your password"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purple-dark flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Building className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Creating account...' : 'Create company account'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
