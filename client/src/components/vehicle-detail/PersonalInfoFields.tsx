
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonalInfoFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const PersonalInfoFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber
}: PersonalInfoFieldsProps) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters except +
    value = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +1
    if (!value.startsWith('+1')) {
      if (value.startsWith('1')) {
        value = '+' + value;
      } else if (value.startsWith('+')) {
        value = '+1' + value.substring(1);
      } else {
        value = '+1' + value;
      }
    }
    
    // Limit to +1 + 10 digits
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    setPhoneNumber(value);
  };

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

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="+1234567890"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PersonalInfoFields;
