
export function getStreetAddressFromCompanyData(data: any): string {
  if (!data || !data.address) return '';
  try {
    const addressObj = JSON.parse(data.address);
    return addressObj.street_address || '';
  } catch (e) {
    return data.address || '';
  }
}

export function getConstituencyFromCompanyData(data: any): string {
  if (!data || !data.address) return '';
  try {
    const addressObj = JSON.parse(data.address);
    return addressObj.constituency || '';
  } catch (e) {
    return '';
  }
}
