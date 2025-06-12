
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInHeader from '@/components/auth/SignInHeader';
import SignInForm from '@/components/auth/SignInForm';

const SignIn = () => {
  const [signInSuccess, setSignInSuccess] = useState(false);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to company dashboard if user is already signed in
  useEffect(() => {
    if (user) {
      console.log("User is already signed in, redirecting to company dashboard");
      navigate('/company');
    }
  }, [user, navigate]);

  // Handle redirection after successful sign-in
  useEffect(() => {
    if (signInSuccess && user) {
      console.log("Sign-in successful, redirecting to company dashboard");
      navigate('/company');
    }
  }, [signInSuccess, user, navigate]);

  return (
    <AuthLayout>
      <div className="text-center">
        <SignInHeader />
      </div>
      <SignInForm />
    </AuthLayout>
  );
};

export default SignIn;
