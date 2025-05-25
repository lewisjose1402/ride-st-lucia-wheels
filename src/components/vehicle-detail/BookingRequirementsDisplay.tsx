
interface BookingRequirementsDisplayProps {
  requirements: {
    requireDriverLicense: boolean;
    minimumDriverAge: number;
    minimumDrivingExperience: number;
    requireDamageDeposit: boolean;
    damageDepositAmount: number;
    damageDepositType: string;
  };
}

const BookingRequirementsDisplay = ({ requirements }: BookingRequirementsDisplayProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-lg text-sm">
      <h4 className="font-semibold text-blue-800 mb-2">Booking Requirements</h4>
      <ul className="text-blue-700 space-y-1">
        {requirements.requireDriverLicense && (
          <li>• Valid driver's license required</li>
        )}
        <li>• Minimum age: {requirements.minimumDriverAge} years</li>
        <li>• Minimum driving experience: {requirements.minimumDrivingExperience} years</li>
        {requirements.requireDamageDeposit && (
          <li>• Damage deposit: ${requirements.damageDepositAmount} ({requirements.damageDepositType})</li>
        )}
      </ul>
    </div>
  );
};

export default BookingRequirementsDisplay;
