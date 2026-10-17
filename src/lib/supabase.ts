import { createClient } from "@supabase/supabase-js";
import { EternityData, SiteConfig, GalleryImage, VideoMemory, TimelineEntry, LetterContent, SurpriseContent, PersonalQuirk } from "@/types/eternity";
import { defaultEternityData } from "./defaults";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith("https://") && 
  !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

const LOCAL_STORAGE_KEY = "eternity_vault_data_v3";

// Helper to get local data safely
export function getLocalData(): EternityData {
  if (typeof window === "undefined") {
    return defaultEternityData;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const recipientName =
        parsed.config?.recipient_name && parsed.config.recipient_name !== "[Recipient Name]"
          ? parsed.config.recipient_name
          : "LECHU";

      const heroImageUrl =
        parsed.config?.hero_image_url && !parsed.config.hero_image_url.includes("unsplash")
          ? parsed.config.hero_image_url
          : "/images/lechu-hero.jpg";

      return {
        config: { ...defaultEternityData.config, ...(parsed.config || {}), recipient_name: recipientName, hero_image_url: heroImageUrl },
        gallery: parsed.gallery?.length ? parsed.gallery : defaultEternityData.gallery,
        videos: parsed.videos?.length ? parsed.videos : defaultEternityData.videos,
        timeline: parsed.timeline?.length ? parsed.timeline : defaultEternityData.timeline,
        letter: { ...defaultEternityData.letter, ...(parsed.letter || {}) },
        surprise: { ...defaultEternityData.surprise, ...(parsed.surprise || {}) },
        quirks: parsed.quirks?.length ? parsed.quirks : defaultEternityData.quirks,
      };
    }
  } catch (e) {
    console.warn("Could not read local eternity data:", e);
  }
  return defaultEternityData;
}

// Helper to save local data safely
export function saveLocalData(data: EternityData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Could not write local eternity data:", e);
  }
}

// Load entire site data (from Supabase if connected, else from local storage)
export async function loadEternityData(): Promise<EternityData> {
  if (!isSupabaseConfigured || !supabase) {
    return getLocalData();
  }

  try {
    const [
      { data: configData },
      { data: galleryData },
      { data: videoData },
      { data: timelineData },
      { data: letterData },
      { data: surpriseData },
      { data: quirksData },
    ] = await Promise.all([
      supabase.from("site_config").select("*").limit(1).maybeSingle(),
      supabase.from("gallery_images").select("*").order("sort_order", { ascending: true }),
      supabase.from("video_memories").select("*").order("sort_order", { ascending: true }),
      supabase.from("timeline_entries").select("*").order("sort_order", { ascending: true }),
      supabase.from("letter_content").select("*").limit(1).maybeSingle(),
      supabase.from("surprise_content").select("*").limit(1).maybeSingle(),
      supabase.from("personal_details").select("*").order("sort_order", { ascending: true }),
    ]);

    const result: EternityData = {
      config: configData ? { ...defaultEternityData.config, ...configData } : defaultEternityData.config,
      gallery: galleryData && galleryData.length > 0 ? galleryData : defaultEternityData.gallery,
      videos: videoData && videoData.length > 0 ? videoData : defaultEternityData.videos,
      timeline: timelineData && timelineData.length > 0 ? timelineData : defaultEternityData.timeline,
      letter: letterData ? { ...defaultEternityData.letter, ...letterData } : defaultEternityData.letter,
      surprise: surpriseData ? { ...defaultEternityData.surprise, ...surpriseData } : defaultEternityData.surprise,
      quirks: quirksData && quirksData.length > 0 ? quirksData : defaultEternityData.quirks,
    };

    saveLocalData(result);
    return result;
  } catch (error) {
    console.error("Failed to load from Supabase, falling back to local vault:", error);
    return getLocalData();
  }
}

// Save functions
export async function saveSiteConfig(config: SiteConfig): Promise<boolean> {
  const current = getLocalData();
  current.config = config;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("site_config")
        .upsert({ ...config, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (err) {
      console.error("Supabase site_config save error:", err);
      return false;
    }
  }
  return true;
}

export async function saveGallery(gallery: GalleryImage[]): Promise<boolean> {
  const current = getLocalData();
  current.gallery = gallery;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      // Upsert current items
      const { error } = await supabase.from("gallery_images").upsert(gallery);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase gallery save error:", err);
      return false;
    }
  }
  return true;
}

export async function saveVideos(videos: VideoMemory[]): Promise<boolean> {
  const current = getLocalData();
  current.videos = videos;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("video_memories").upsert(videos);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase videos save error:", err);
      return false;
    }
  }
  return true;
}

export async function saveTimeline(timeline: TimelineEntry[]): Promise<boolean> {
  const current = getLocalData();
  current.timeline = timeline;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("timeline_entries").upsert(timeline);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase timeline save error:", err);
      return false;
    }
  }
  return true;
}

export async function saveLetter(letter: LetterContent): Promise<boolean> {
  const current = getLocalData();
  current.letter = letter;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("letter_content")
        .upsert({ ...letter, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (err) {
      console.error("Supabase letter save error:", err);
      return false;
    }
  }
  return true;
}

export async function saveSurprise(surprise: SurpriseContent): Promise<boolean> {
  const current = getLocalData();
  current.surprise = surprise;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("surprise_content")
        .upsert({ ...surprise, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (err) {
      console.error("Supabase surprise save error:", err);
      return false;
    }
  }
  return true;
}

export async function saveQuirks(quirks: PersonalQuirk[]): Promise<boolean> {
  const current = getLocalData();
  current.quirks = quirks;
  saveLocalData(current);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("personal_details").upsert(quirks);
      if (error) throw error;
    } catch (err) {
      console.error("Supabase quirks save error:", err);
      return false;
    }
  }
  return true;
}

// Media upload handler
export async function uploadMedia(
  file: File,
  folder: "photos" | "videos" | "audio"
): Promise<{ url: string; error?: string }> {
  // Check file type
  if (folder === "photos" && !file.type.startsWith("image/")) {
    return { url: "", error: "Please select a valid image file (JPEG, PNG, WebP)." };
  }
  if (folder === "videos" && !file.type.startsWith("video/")) {
    return { url: "", error: "Please select a valid video file (MP4, WebM)." };
  }
  if (folder === "audio" && !file.type.startsWith("audio/")) {
    return { url: "", error: "Please select a valid audio file (MP3, WAV, AAC)." };
  }

  // If Supabase is configured and online, upload to persistent cloud bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${folder}/${Date.now()}_${cleanName}`;
      
      const { data, error } = await supabase.storage
        .from("eternity-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: publicData } = supabase.storage
        .from("eternity-media")
        .getPublicUrl(data.path);

      return { url: publicData.publicUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload to cloud storage";
      console.error("Cloud storage upload error:", err);
      return { url: "", error: message };
    }
  }

  // Fallback: Read and optimize as persistent base64 data URL for local editing & testing
  if (folder === "photos") {
    try {
      const { optimizeImageForWeb } = await import("./imageOptimizer");
      const optimizedUrl = await optimizeImageForWeb(file);
      return { url: optimizedUrl };
    } catch {
      // fallback to regular FileReader if canvas fails
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: "", error: "Failed to read local file." });
    };
    reader.readAsDataURL(file);
  });
}
