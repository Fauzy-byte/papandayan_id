export interface PriceTier {
  id: number;
  trip_package_id: number;
  customer_type: 'local' | 'foreign';
  meeting_point: string;
  min_participants: number;
  max_participants: number | null;
  price_per_person: number;
}

export interface PackageAddon {
  id: number;
  trip_package_id: number;
  name: string;
  description?: string;
  price: number;
}

export interface TripSchedule {
  id: number;
  trip_package_id: number;
  trip_date: string;
  quota_total: number;
  quota_terisi: number;
  kuota_tersedia: number;
  status: 'open' | 'closed';
}

export interface ItineraryItem {
  time: string;
  activity: string;
}

export interface TripPackage {
  id: number;
  name: string;
  slug: string;
  category: 'mountain_trip' | 'camping' | 'outbound' | 'custom';
  type: 'scheduled' | 'private' | 'custom';
  duration_label: string;
  short_description: string;
  hero_image: string;
  min_dp_percentage: number;
  is_active: boolean;
  facilities: string[];
  destinations: string[];
  itinerary: ItineraryItem[];
  required_gear: string[];
  terms: string[];
  priceTiers: PriceTier[];
  addons: PackageAddon[];
  schedules: TripSchedule[];
}

export interface Participant {
  name: string;
  identity_number?: string;
}

export interface BookingAddonItem {
  addon_id: number;
  name: string;
  price: number;
}

export type BookingStatus =
  | 'waiting_payment'
  | 'waiting_confirmation'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface Booking {
  id: number;
  booking_code: string;
  trip_package_id: number;
  trip_package: TripPackage;
  trip_schedule_id?: number;
  trip_schedule_date?: string;
  meeting_point: string;
  customer_type: 'local' | 'foreign';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  participant_count: number;
  participants: Participant[];
  addons: BookingAddonItem[];
  tier_price_per_person: number;
  total_amount: number;
  dp_amount: number;
  paid_amount: number;
  status: BookingStatus;
  created_at: string;
  payment_deadline?: string;
  paid_at?: string;
  payment_method?: string;
  customer_notes?: string;
  email_notified_at?: string;
  email_notification_status?: 'sent' | 'pending' | 'failed';
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  cover_image: string;
  author_name: string;
  published_at: string;
  read_time: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  caption?: string;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  rating: number;
  content: string;
  trip_name?: string;
}

export interface Partner {
  id: number;
  name: string;
  logo_url: string;
  type: 'client' | 'partner';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}
