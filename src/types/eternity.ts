export interface SiteConfig {
  id?: string;
  recipient_name: string;
  birthday_date: string;
  tagline: string;
  intro_quote: string;
  intro_title: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_image_url: string;
  music_url: string;
  music_title: string;
  final_quote: string;
  final_subtext: string;
  show_gallery: boolean;
  show_videos: boolean;
  show_timeline: boolean;
  show_letter: boolean;
  show_cake: boolean;
  show_quirks: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date?: string;
  location?: string;
  personal_note?: string;
  aspect_ratio?: 'portrait' | 'landscape' | 'square' | 'wide';
  is_featured?: boolean;
  sort_order: number;
  created_at?: string;
}

export interface VideoMemory {
  id: string;
  url: string;
  poster_url?: string;
  title: string;
  caption: string;
  date?: string;
  is_featured?: boolean;
  sort_order: number;
  created_at?: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  date: string;
  story: string;
  image_urls: string[];
  video_url?: string;
  location?: string;
  personal_note?: string;
  sort_order: number;
  created_at?: string;
}

export interface LetterContent {
  id?: string;
  heading: string;
  seal_text: string;
  instruction_text: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  date: string;
  photo_url?: string;
  updated_at?: string;
}

export interface SurpriseContent {
  id?: string;
  wish_prompt: string;
  cake_title: string;
  revealed_message: string;
  secret_title: string;
  secret_photo_url?: string;
  secret_video_url?: string;
  secret_note?: string;
  secret_wish?: string;
  updated_at?: string;
}

export interface PersonalQuirk {
  id: string;
  title: string;
  category: string;
  message: string;
  icon_name: 'sparkles' | 'heart' | 'smile' | 'coffee' | 'music' | 'camera' | 'star' | 'sun';
  sort_order: number;
  created_at?: string;
}

export interface EternityData {
  config: SiteConfig;
  gallery: GalleryImage[];
  videos: VideoMemory[];
  timeline: TimelineEntry[];
  letter: LetterContent;
  surprise: SurpriseContent;
  quirks: PersonalQuirk[];
}
