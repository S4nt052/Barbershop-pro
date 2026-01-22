export interface Barbershop {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  bannerUrl?: string;
  settings: BarbershopSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarbershopSettings {
  showPublicSite: boolean;
  allowReviews: boolean;
  allowPosts: boolean;
  allowOnlineBooking: boolean;
  themeColor?: string;
}
