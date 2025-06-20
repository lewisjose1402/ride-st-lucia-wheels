import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const SignInHeader = () => {
  return (
    <>
      <h2 className="text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-brand-purple hover:text-brand-purple-dark"
        >
          Create an account
        </Link>
      </p>

      {/* Account type information */}
      <div className="mt-6 flex justify-center">
        <div className="p-4 border rounded-md bg-gray-50 max-w-xs">
          <Users className="h-6 w-6 text-brand-purple mx-auto mb-2" />
          <h3 className="font-semibold">All Account Types Welcome</h3>
          <p className="text-xs text-gray-600 mt-1">
            Sign in with your account credentials, whether you're a renter or
            rental company.
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInHeader;
