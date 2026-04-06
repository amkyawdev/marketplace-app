export interface Profile {
  id: string;
  full_name: string;
  nrc_number: string;
  nrc_photo_url: string[];
  is_verified: boolean;
  gps_location: string | null;
  kpay_no: string | null;
  wave_no: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  images: string[];
  status: 'open' | 'pending' | 'sold';
  category: string | null;
  created_at: string;
  updated_at: string;
  seller?: Profile;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  payment_screenshot: string | null;
  last_4_digits: string | null;
  amount: number;
  down_payment_amount: number;
  status: 'pending' | 'confirmed';
  created_at: string;
  updated_at: string;
  product?: Product;
  buyer?: Profile;
  seller?: Profile;
}

export interface NRCParts {
  region: string;
  township: string;
  type: 'N' | 'A' | 'P';
  serial: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
}

export interface UserSession {
  id: string;
  email: string;
  profile?: Profile;
}