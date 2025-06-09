
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Loader2 className={`animate-spin text-brand-purple ${sizeClasses[size]}`} />
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
