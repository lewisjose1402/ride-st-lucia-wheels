
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';

const SignInHeader = () => {
  return (
    <>
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
    </>
  );
};

export default SignInHeader;
