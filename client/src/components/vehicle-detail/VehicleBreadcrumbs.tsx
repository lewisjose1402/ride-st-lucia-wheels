
import { Link } from 'wouter';

interface VehicleBreadcrumbsProps {
  vehicleName: string;
}

const VehicleBreadcrumbs = ({ vehicleName }: VehicleBreadcrumbsProps) => {
  return (
    <div className="text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-brand-purple">Home</Link>
      <span className="mx-2">/</span>
      <Link to="/vehicles" className="hover:text-brand-purple">Vehicles</Link>
      <span className="mx-2">/</span>
      <span className="text-gray-700">{vehicleName}</span>
    </div>
  );
};

export default VehicleBreadcrumbs;
