
export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface VehicleType {
  id: number;
  name: string;
  created_at: string;
}

export interface RentalCompany {
  id: string;
  user_id: string;
  company_name: string;
  contact_person?: string;
  email: string;
  phone: string;
  address?: string;
  description?: string;
  logo_url?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  type_id?: number;
  transmission: string;
  seats: number;
  price_per_day: number;
  features?: Record<string, any>;
  location: Record<string, any>;
  latitude?: number;
  longitude?: number;
  is_featured: boolean;
  is_available: boolean;
  rating?: number;
  feed_token?: string;
  created_at: string;
  updated_at: string;
  vehicle_images?: VehicleImage[];
  vehicle_types?: VehicleType;
  rental_companies?: RentalCompany;
}
