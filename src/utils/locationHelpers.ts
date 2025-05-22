
export function getAddressFromLocationData(location: any): { street_address: string, constituency: string } {
  if (!location) return { street_address: '', constituency: '' };
  
  try {
    // If location is already a JSON object
    if (typeof location === 'object') {
      return {
        street_address: location.street_address || '',
        constituency: location.constituency || ''
      };
    }
    
    // If location is a JSON string
    const parsedLocation = JSON.parse(location);
    return {
      street_address: parsedLocation.street_address || '',
      constituency: parsedLocation.constituency || ''
    };
  } catch (e) {
    // If location is just a string or invalid JSON
    return {
      street_address: String(location),
      constituency: ''
    };
  }
}
