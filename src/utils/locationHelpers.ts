
export function getAddressFromLocationData(location: any): { street_address: string, constituency: string } {
  if (!location) return { street_address: '', constituency: '' };
  
  try {
    // If location is already a JSON object
    if (typeof location === 'object' && location !== null) {
      return {
        street_address: location.street_address || '',
        constituency: location.constituency || ''
      };
    }
    
    // If location is a JSON string
    if (typeof location === 'string') {
      try {
        const parsedLocation = JSON.parse(location);
        return {
          street_address: parsedLocation.street_address || '',
          constituency: parsedLocation.constituency || ''
        };
      } catch (e) {
        // If parsing failed, it's just a plain string
        return {
          street_address: location,
          constituency: ''
        };
      }
    }
    
    // Fallback for any other type
    return {
      street_address: String(location),
      constituency: ''
    };
  } catch (e) {
    console.error("Error parsing location data:", e);
    // If location is just a string or invalid JSON
    return {
      street_address: String(location || ''),
      constituency: ''
    };
  }
}
