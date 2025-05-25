
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
}

const PersonalInfoFields = ({ 
  firstName, 
  setFirstName, 
  lastName, 
  setLastName 
}: PersonalInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
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
          placeholder="Doe"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default PersonalInfoFields;
