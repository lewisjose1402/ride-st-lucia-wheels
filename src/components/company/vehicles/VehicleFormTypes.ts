
export interface VehicleFormValues {
  name: string;
  price_per_day: string;
  street_address: string;
  constituency: string;
  description: string;
  seats: string;
  transmission: string;
  vehicle_type: string;
  is_available: boolean;
  features: {
    air_conditioning: boolean;
    bluetooth: boolean;
    gps: boolean;
    usb: boolean;
    child_seat: boolean;
  };
}

export interface VehicleImage {
  id?: string;
  image_url: string;
  is_primary: boolean;
}
