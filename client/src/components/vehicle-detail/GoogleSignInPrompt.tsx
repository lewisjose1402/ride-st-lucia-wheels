
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { LogIn } from 'lucide-react';

const GoogleSignInPrompt = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">Sign in to Book</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          Please sign in with Google to book this vehicle and manage your reservations.
        </p>
        <Button 
          className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white"
          onClick={handleGoogleSignIn}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
        <p className="text-sm text-gray-500">
          Quick and secure authentication powered by Google
        </p>
      </CardContent>
    </Card>
  );
};

export default GoogleSignInPrompt;
