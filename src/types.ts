export interface SearchJob {
  id: string;
  query: string;
  location: string;
  country: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'stopped';
  progress: number; // 0 to 100
  stage: 'idle' | 'searching' | 'extracting' | 'crawling' | 'enriching' | 'completed' | 'failed' | 'stopped';
  vendorCount: number;
  createdAt: string;
  updatedAt: string;
  logs: string[];
}

export interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
}

export interface Vendor {
  id: string;
  jobId: string;
  name: string;
  category: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  reviewsCount: number;
  mapsUrl: string;
  status: 'Pending Enrichment' | 'Completed';
  emails: string[];
  phonesNormalized: string[];
  socialLinks: SocialLinks;
  services: string[];
  products: string[];
  technologies: string[];
  industry: string;
  summary: string;
  idealCustomer: string;
  companySize: string;
  leadScore: number; // 0 to 100
  keywords: string[];
  starred: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  funnelStage?: 'Discovered' | 'Email Drafted' | 'Campaign Sent' | 'Replied' | 'Deal Closed';
  outreachEmailDraft?: string;
}
