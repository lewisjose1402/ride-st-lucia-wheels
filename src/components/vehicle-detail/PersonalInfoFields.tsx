
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonalInfoFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

const PersonalInfoFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail
}: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Personal Information</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PersonalInfoFields;
