
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInHeader from '@/components/auth/SignInHeader';
import SignInForm from '@/components/auth/SignInForm';

const SignIn = () => {
  const [signInSuccess, setSignInSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to company dashboard if user is already signed in
  useEffect(() => {
    if (user) {
      console.log("User is already signed in, redirecting to company dashboard");
      setLocation('/company');
    }
  }, [user, setLocation]);

  // Handle redirection after successful sign-in
  useEffect(() => {
    if (signInSuccess && user) {
      console.log("Sign-in successful, redirecting to company dashboard");
      setLocation('/company');
    }
  }, [signInSuccess, user, setLocation]);

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
