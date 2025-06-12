
interface ValidationErrorDisplayProps {
  isValid: boolean;
  errors: string[];
  blockingErrors: string[];
}

const ValidationErrorDisplay = ({ isValid, errors, blockingErrors }: ValidationErrorDisplayProps) => {
  if (isValid || (errors.length === 0 && blockingErrors.length === 0)) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-red-800 mb-3 flex items-center">
        <span className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs mr-2">!</span>
        Please complete the following to proceed:
      </h4>
      
      {blockingErrors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-700 mb-1">Critical Requirements:</p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {blockingErrors.map((error, index) => (
              <li key={`blocking-${index}`} className="font-medium">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {errors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-700 mb-1">Required Fields:</p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={`error-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ValidationErrorDisplay;
