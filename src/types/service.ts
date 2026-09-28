export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;

  category: string;
  subcategory: string;

  description: string;

  basePrice: number;
  duration: string;

  includes: string[];
  faqs: FAQ[];

  rating?: number;
  reviews?: number;

  image?: string;
}

export interface ServiceVariant {
  name: string;
  price: number;
  originalPrice?: number;
}

export interface RatingBreakdown {
  stars: number;
  percent: number;
}

export interface ServicePackage {
  id: string;
  title: string;

  description?: string;
  duration?: string;

  includes?: string[];
  excludes?: string[];

  rating?: number;
  reviews?: number;

  ratingsBreakdown?: RatingBreakdown[];

  image?: string;

  variants: ServiceVariant[];
}

export interface ServiceSection {
  id: string;
  title: string;
  services: ServicePackage[];
}