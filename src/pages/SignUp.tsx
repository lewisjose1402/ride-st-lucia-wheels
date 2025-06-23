
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building, Info, AlertCircle, User, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type UserType = 'renter' | 'company';

const SignUp = () => {
  const [userType, setUserType] = useState<UserType>('renter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [generalError, setGeneralError] = useState('');
  
  const { signUpAsRenter, signUpAsCompany } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setPasswordError('');
    setGeneralError('');
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let result;
      
      if (userType === 'company') {
        if (!companyName.trim()) {
          setGeneralError("Company name is required");
          return;
        }
        result = await signUpAsCompany(email, password, companyName.trim());
      } else {
        result = await signUpAsRenter(email, password, firstName, lastName);
      }
      
      if (result.success) {
        // Redirect to sign in page after successful registration
        navigate('/signin');
      } else if (result.error) {
        setGeneralError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    return userType === 'company' ? 'Create Company Account' : 'Create Your Account';
  };

  const getFormDescription = () => {
    return userType === 'company' 
      ? 'Join our platform as a rental company to list and manage your vehicles'
      : 'Sign up to book vehicles and manage your reservations';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 shadow-md rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">{getFormTitle()}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-brand-purple hover:text-brand-purple-dark">
                Sign in here
              </Link>
            </p>
          </div>

          {/* User Type Selector */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">I want to sign up as a:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('renter')}
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    userType === 'renter'
                      ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">Renter</span>
                  <span className="text-xs text-gray-500">Book vehicles</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    userType === 'company'
                      ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Building className="h-6 w-6" />
                  <span className="text-sm font-medium">Company</span>
                  <span className="text-xs text-gray-500">List vehicles</span>
                </button>
              </div>
            </div>

            {/* Information Box */}
            <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-left text-blue-700">
                  <p className="font-semibold">
                    {userType === 'company' ? 'For Rental Companies' : 'For Vehicle Renters'}
                  </p>
                  <p className="mt-1">
                    {getFormDescription()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {generalError && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}
          
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
                  onChange={e => setEmail(e.target.value)} 
                  className="mt-1" 
                  placeholder={userType === 'company' ? "Enter your business email" : "Enter your email address"} 
                />
              </div>

              {userType === 'renter' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      type="text" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      className="mt-1" 
                      placeholder="First name" 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      type="text" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      className="mt-1" 
                      placeholder="Last name" 
                    />
                  </div>
                </div>
              )}

              {userType === 'company' && (
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company / Registered Business Name
                  </label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    type="text" 
                    required 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)} 
                    className="mt-1" 
                    placeholder="Enter your company name" 
                  />
                </div>
              )}

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
                  onChange={e => setPassword(e.target.value)} 
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
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="mt-1" 
                  placeholder="Confirm your password" 
                />
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple-dark flex items-center justify-center" 
              disabled={isSubmitting}
            >
              {userType === 'company' ? (
                <>
                  <Building className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating company account...' : 'Create company account'}
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating account...' : 'Create account'}
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

export default SignUp;
