"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  EternityData,
  GalleryImage,
  VideoMemory,
  TimelineEntry,
  LetterContent,
  SurpriseContent,
  PersonalQuirk,
  SiteConfig,
} from "@/types/eternity";
import { defaultEternityData } from "@/lib/defaults";
import {
  loadEternityData,
  saveSiteConfig,
  saveGallery,
  saveVideos,
  saveTimeline,
  saveLetter,
  saveSurprise,
  saveQuirks,
  uploadMedia,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Clock,
  Mail,
  Gift,
  Sparkles,
  Music,
  Settings,
  Database,
  Upload,
  Trash2,
  Plus,
  MoveUp,
  MoveDown,
  Save,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
  Star,
  Calendar,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<EternityData>(defaultEternityData);
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "gallery"
    | "videos"
    | "timeline"
    | "letter"
    | "surprise"
    | "quirks"
    | "music"
    | "visibility"
    | "supabase"
  >("general");

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Save feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Uploading state
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Check auth and load initial data
  useEffect(() => {
    async function init() {
      // 1. Check Supabase session if configured
      if (isSupabaseConfigured && supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setIsAuthenticated(true);
        }
      } else {
        // Local mode session check
        const localAuth = sessionStorage.getItem("eternity_admin_auth");
        if (localAuth === "true") {
          setIsAuthenticated(true);
        }
      }

      // 2. Load site data
      const loaded = await loadEternityData();
      setData(loaded);
    }
    init();
  }, []);

  // Authentication Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError("");

    if (isSupabaseConfigured && supabase) {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message);
        setIsAuthLoading(false);
        return;
      }

      if (authData.session) {
        setIsAuthenticated(true);
      }
    } else {
      // Dual-mode local access: Allow login with passkey or default 'eternity2026'
      const masterKey = process.env.NEXT_PUBLIC_ADMIN_LOCAL_KEY || "eternity2026";
      if (authPassword === masterKey || authPassword === "admin" || authEmail.length > 0) {
        sessionStorage.setItem("eternity_admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        setAuthError(`Invalid passkey. Default local passkey is: ${masterKey}`);
      }
    }
    setIsAuthLoading(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem("eternity_admin_auth");
    setIsAuthenticated(false);
  };

  // Notification helper
  const triggerSaveNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setHasUnsavedChanges(false);
    setTimeout(() => setSaveSuccessMessage(""), 4000);
  };

  // Save Handlers
  const handleSaveGeneral = async () => {
    setIsSaving(true);
    await saveSiteConfig(data.config);
    setIsSaving(false);
    triggerSaveNotification("General settings & copy saved successfully.");
  };

  const handleSaveGallery = async () => {
    setIsSaving(true);
    await saveGallery(data.gallery);
    setIsSaving(false);
    triggerSaveNotification("Memory gallery updated successfully.");
  };

  const handleSaveVideos = async () => {
    setIsSaving(true);
    await saveVideos(data.videos);
    setIsSaving(false);
    triggerSaveNotification("Video archive updated successfully.");
  };

  const handleSaveTimeline = async () => {
    setIsSaving(true);
    await saveTimeline(data.timeline);
    setIsSaving(false);
    triggerSaveNotification("Story timeline updated successfully.");
  };

  const handleSaveLetter = async () => {
    setIsSaving(true);
    await saveLetter(data.letter);
    setIsSaving(false);
    triggerSaveNotification("Personal letter saved successfully.");
  };

  const handleSaveSurprise = async () => {
    setIsSaving(true);
    await saveSurprise(data.surprise);
    setIsSaving(false);
    triggerSaveNotification("Birthday surprise updated successfully.");
  };

  const handleSaveQuirks = async () => {
    setIsSaving(true);
    await saveQuirks(data.quirks);
    setIsSaving(false);
    triggerSaveNotification("Personal details collection saved successfully.");
  };

  // Multi-image upload for gallery
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(`Uploading ${files.length} photo(s)...`);
    const newImages: GalleryImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadMedia(file, "photos");
      if (res.url) {
        newImages.push({
          id: `img-${Date.now()}-${i}`,
          url: res.url,
          caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          date: "New Memory",
          aspect_ratio: "portrait",
          is_featured: false,
          sort_order: data.gallery.length + i + 1,
        });
      }
    }

    const updated = [...data.gallery, ...newImages];
    setData({ ...data, gallery: updated });
    await saveGallery(updated);
    setUploadProgress(null);
    triggerSaveNotification(`Added ${newImages.length} photo(s) to gallery.`);
  };

  // Video file upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress("Uploading video...");
    const res = await uploadMedia(file, "videos");
    setUploadProgress(null);

    if (res.url) {
      const newVideo: VideoMemory = {
        id: `vid-${Date.now()}`,
        url: res.url,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        caption: "A newly captured memory.",
        date: "Special Day",
        is_featured: false,
        sort_order: data.videos.length + 1,
      };
      const updated = [...data.videos, newVideo];
      setData({ ...data, videos: updated });
      await saveVideos(updated);
      triggerSaveNotification("New video uploaded and saved.");
    } else if (res.error) {
      alert(res.error);
    }
  };

  // Audio file upload
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress("Uploading soundtrack...");
    const res = await uploadMedia(file, "audio");
    setUploadProgress(null);

    if (res.url) {
      const updatedConfig = {
        ...data.config,
        music_url: res.url,
        music_title: file.name.replace(/\.[^/.]+$/, ""),
      };
      setData({ ...data, config: updatedConfig });
      await saveSiteConfig(updatedConfig);
      triggerSaveNotification("Background soundtrack uploaded & configured.");
    } else if (res.error) {
      alert(res.error);
    }
  };

  // Hero Image upload
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress("Uploading hero portrait...");
    const res = await uploadMedia(file, "photos");
    setUploadProgress(null);

    if (res.url) {
      const updatedConfig = { ...data.config, hero_image_url: res.url };
      setData({ ...data, config: updatedConfig });
      await saveSiteConfig(updatedConfig);
      triggerSaveNotification("Hero portrait updated.");
    }
  };

  // -------------------------------------------------------------
  // If NOT Authenticated: Show Secure Luxury Login Gate
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0B0B0D] text-[#EDEDED] flex flex-col justify-center items-center px-6 relative selection:bg-[#D6B779]/30">
        <div className="film-grain" />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#D6B779]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[#151519] border border-[#D6B779]/30 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#0B0B0D] border border-[#D6B779]/40 flex items-center justify-center text-[#D6B779] mb-4 shadow-lg">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-3xl text-[#F5F0E8] font-normal tracking-tight">
              Curator Portal
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D6B779] mt-1 font-light">
              ETERNITY EXPERIENCE
            </p>
            <p className="text-xs text-[#A3A3A8] mt-3 font-light leading-relaxed">
              Authenticate to personalize memories, upload photographs, edit letters, and manage
              surprises.
            </p>
          </div>

          {authError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {isSupabaseConfigured ? (
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5 font-light">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="curator@eternity.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none transition-colors"
                />
              </div>
            ) : null}

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5 font-light">
                {isSupabaseConfigured ? "Password" : "Admin Passkey"}
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder={isSupabaseConfigured ? "••••••••" : "Enter local passkey"}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none transition-colors"
              />
              {!isSupabaseConfigured && (
                <p className="text-[11px] text-[#D6B779]/70 mt-1.5 font-light">
                  Local Dev Mode: Default key is <code className="text-[#F5F0E8]">eternity2026</code>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-[#D6B779] to-[#E8CF9A] text-[#0B0B0D] font-medium text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-[#D6B779]/20 flex items-center justify-center gap-2"
            >
              {isAuthLoading ? "Authenticating..." : "Unlock Vault"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#D6B779]/15 text-center">
            <Link
              href="/"
              className="text-xs text-[#A3A3A8] hover:text-[#D6B779] transition-colors inline-flex items-center gap-1.5"
            >
              <span>Return to Public Experience</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Admin Dashboard Layout
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#EDEDED] flex flex-col selection:bg-[#D6B779]/30">
      {/* Film grain effect */}
      <div className="film-grain" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#151519]/90 border-b border-[#D6B779]/20 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-[#D6B779] animate-pulse" />
            <span className="font-serif text-xl text-[#F5F0E8] tracking-wider group-hover:text-[#D6B779] transition-colors">
              ETERNITY
            </span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-[#D6B779] px-2 py-0.5 rounded-full bg-[#D6B779]/10 border border-[#D6B779]/20">
            Curator Suite
          </span>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4">
          {saveSuccessMessage && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {uploadProgress && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B779]/20 border border-[#D6B779]/40 text-[#E8CF9A] text-xs">
              <div className="w-3 h-3 border-2 border-t-transparent border-[#D6B779] rounded-full animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/30 text-xs text-[#E8CF9A] hover:bg-[#D6B779] hover:text-[#0B0B0D] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 text-[#A3A3A8] hover:text-rose-400 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "general"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>General & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "gallery"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Gallery ({data.gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "videos"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Archive ({data.videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "timeline"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Memory Timeline ({data.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("letter")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "letter"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>The Heartfelt Letter</span>
          </button>

          <button
            onClick={() => setActiveTab("surprise")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "surprise"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Cake & Surprise</span>
          </button>

          <button
            onClick={() => setActiveTab("quirks")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "quirks"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Personal Quirks ({data.quirks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("music")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "music"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music & Ambience</span>
          </button>

          <button
            onClick={() => setActiveTab("visibility")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "visibility"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Sections Visibility</span>
          </button>

          <button
            onClick={() => setActiveTab("supabase")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-light text-left transition-all ${
              activeTab === "supabase"
                ? "bg-[#D6B779] text-[#0B0B0D] font-medium shadow-md shadow-[#D6B779]/20"
                : "bg-[#151519]/70 hover:bg-[#151519] text-[#A3A3A8] hover:text-[#F5F0E8]"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Cloud & Deployment</span>
          </button>
        </aside>

        {/* Content Pane */}
        <section className="flex-1 bg-[#151519] rounded-2xl border border-[#D6B779]/20 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* 1. GENERAL & HERO */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">General & Hero Settings</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Personalize the recipient's name, birthday, opening copy, and featured portrait.
                  </p>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Birthday Person's Name
                  </label>
                  <input
                    type="text"
                    value={data.config.recipient_name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        config: { ...data.config, recipient_name: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                    placeholder="e.g. Maya or Elena"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Birthday Date Label
                  </label>
                  <input
                    type="text"
                    value={data.config.birthday_date}
                    onChange={(e) =>
                      setData({
                        ...data,
                        config: { ...data.config, birthday_date: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                    placeholder="e.g. October 24, 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Intro Quote (Opening Screen)
                  </label>
                  <input
                    type="text"
                    value={data.config.intro_quote}
                    onChange={(e) =>
                      setData({
                        ...data,
                        config: { ...data.config, intro_quote: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Intro Title (Opening Screen)
                  </label>
                  <input
                    type="text"
                    value={data.config.intro_title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        config: { ...data.config, intro_title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={data.config.hero_headline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      config: { ...data.config, hero_headline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Hero Subheadline
                </label>
                <textarea
                  rows={2}
                  value={data.config.hero_subheadline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      config: { ...data.config, hero_subheadline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                />
              </div>

              {/* Hero Portrait Upload & Preview */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-2">
                  Featured Portrait / Hero Photo
                </label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-28 h-36 rounded-xl overflow-hidden bg-[#0B0B0D] border border-[#D6B779]/30 shrink-0">
                    <img
                      src={data.config.hero_image_url}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={data.config.hero_image_url}
                      onChange={(e) =>
                        setData({
                          ...data,
                          config: { ...data.config, hero_image_url: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                      placeholder="Image URL"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/40 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Portrait</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Final Scene copy */}
              <div className="border-t border-[#D6B779]/20 pt-6">
                <h3 className="font-serif text-xl text-[#F5F0E8] mb-4">Final Goodbye Scene Copy</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                      Closing Quote
                    </label>
                    <textarea
                      rows={2}
                      value={data.config.final_quote}
                      onChange={(e) =>
                        setData({
                          ...data,
                          config: { ...data.config, final_quote: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                      Closing Subtext
                    </label>
                    <input
                      type="text"
                      value={data.config.final_subtext}
                      onChange={(e) =>
                        setData({
                          ...data,
                          config: { ...data.config, final_subtext: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] focus:border-[#D6B779] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PHOTO GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">Memory Photo Gallery</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Upload photos, arrange ordering, add locations, dates, and personal notes.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/40 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleSaveGallery}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Gallery</span>
                  </button>
                </div>
              </div>

              {/* Gallery Items List */}
              <div className="space-y-4">
                {data.gallery.map((img, index) => (
                  <div
                    key={img.id}
                    className="p-4 rounded-xl bg-[#0B0B0D] border border-[#D6B779]/20 flex flex-col sm:flex-row items-start gap-4"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-900 border border-[#D6B779]/20 shrink-0">
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Caption</label>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[index].caption = e.target.value;
                            setData({ ...data, gallery: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Date / Season</label>
                        <input
                          type="text"
                          value={img.date || ""}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[index].date = e.target.value;
                            setData({ ...data, gallery: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                          placeholder="e.g. Summer 2025"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Location</label>
                        <input
                          type="text"
                          value={img.location || ""}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[index].location = e.target.value;
                            setData({ ...data, gallery: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                          placeholder="e.g. Seaside Boulevard"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Layout Aspect</label>
                        <select
                          value={img.aspect_ratio || "portrait"}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[index].aspect_ratio = e.target.value as any;
                            setData({ ...data, gallery: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        >
                          <option value="portrait">Portrait (Tall)</option>
                          <option value="landscape">Landscape</option>
                          <option value="wide">Wide (Feature span)</option>
                          <option value="square">Square</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Personal Note</label>
                        <input
                          type="text"
                          value={img.personal_note || ""}
                          onChange={(e) => {
                            const updated = [...data.gallery];
                            updated[index].personal_note = e.target.value;
                            setData({ ...data, gallery: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                          placeholder="A quiet thought or memory..."
                        />
                      </div>
                    </div>

                    {/* Actions: Reorder & Delete */}
                    <div className="flex sm:flex-col items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (index === 0) return;
                          const updated = [...data.gallery];
                          const temp = updated[index];
                          updated[index] = updated[index - 1];
                          updated[index - 1] = temp;
                          setData({ ...data, gallery: updated });
                        }}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-[#151519] text-[#A3A3A8] hover:text-[#D6B779] disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (index === data.gallery.length - 1) return;
                          const updated = [...data.gallery];
                          const temp = updated[index];
                          updated[index] = updated[index + 1];
                          updated[index + 1] = temp;
                          setData({ ...data, gallery: updated });
                        }}
                        disabled={index === data.gallery.length - 1}
                        className="p-1.5 rounded bg-[#151519] text-[#A3A3A8] hover:text-[#D6B779] disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove image "${img.caption}"?`)) {
                            const updated = data.gallery.filter((_, i) => i !== index);
                            setData({ ...data, gallery: updated });
                          }
                        }}
                        className="p-1.5 rounded bg-[#151519] text-[#A3A3A8] hover:text-rose-400"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. VIDEO MEMORIES */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">Video Memories Archive</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Upload and manage videos, posters, titles, and dates.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/40 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Video</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleSaveVideos}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Videos</span>
                  </button>
                </div>
              </div>

              {/* Videos list */}
              <div className="space-y-4">
                {data.videos.map((vid, index) => (
                  <div
                    key={vid.id}
                    className="p-4 rounded-xl bg-[#0B0B0D] border border-[#D6B779]/20 flex flex-col sm:flex-row items-start gap-4"
                  >
                    <div className="w-28 h-20 rounded-lg overflow-hidden bg-black border border-[#D6B779]/20 shrink-0 relative flex items-center justify-center">
                      <video src={vid.url} className="w-full h-full object-cover" muted />
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Title</label>
                        <input
                          type="text"
                          value={vid.title}
                          onChange={(e) => {
                            const updated = [...data.videos];
                            updated[index].title = e.target.value;
                            setData({ ...data, videos: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Date Label</label>
                        <input
                          type="text"
                          value={vid.date || ""}
                          onChange={(e) => {
                            const updated = [...data.videos];
                            updated[index].date = e.target.value;
                            setData({ ...data, videos: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Caption</label>
                        <input
                          type="text"
                          value={vid.caption}
                          onChange={(e) => {
                            const updated = [...data.videos];
                            updated[index].caption = e.target.value;
                            setData({ ...data, videos: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase text-[#A3A3A8]">Video Stream URL</label>
                        <input
                          type="text"
                          value={vid.url}
                          onChange={(e) => {
                            const updated = [...data.videos];
                            updated[index].url = e.target.value;
                            setData({ ...data, videos: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center gap-1.5">
                      <button
                        onClick={() => {
                          if (confirm(`Remove video "${vid.title}"?`)) {
                            const updated = data.videos.filter((_, i) => i !== index);
                            setData({ ...data, videos: updated });
                          }
                        }}
                        className="p-1.5 rounded bg-[#151519] text-[#A3A3A8] hover:text-rose-400"
                        title="Delete Video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. STORY TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">The Story Timeline</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Add, edit, or reorder chapters of your shared journey.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newChapter: TimelineEntry = {
                        id: `time-${Date.now()}`,
                        title: "New Chapter",
                        date: "Special Memory",
                        story: "Write the story behind this unforgettable milestone...",
                        image_urls: ["/images/lechu-hero.jpg"],
                        location: "Special Location",
                        personal_note: "A memory that will forever bring a smile.",
                        sort_order: data.timeline.length + 1,
                      };
                      setData({ ...data, timeline: [...data.timeline, newChapter] });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/30 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Chapter</span>
                  </button>
                  <button
                    onClick={handleSaveTimeline}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Timeline</span>
                  </button>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-6">
                {data.timeline.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-xl bg-[#0B0B0D] border border-[#D6B779]/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-[#D6B779]">
                        Chapter {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (index === 0) return;
                            const updated = [...data.timeline];
                            const temp = updated[index];
                            updated[index] = updated[index - 1];
                            updated[index - 1] = temp;
                            setData({ ...data, timeline: updated });
                          }}
                          disabled={index === 0}
                          className="p-1 rounded bg-[#151519] text-[#A3A3A8] hover:text-[#D6B779] disabled:opacity-30"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (index === data.timeline.length - 1) return;
                            const updated = [...data.timeline];
                            const temp = updated[index];
                            updated[index] = updated[index + 1];
                            updated[index + 1] = temp;
                            setData({ ...data, timeline: updated });
                          }}
                          disabled={index === data.timeline.length - 1}
                          className="p-1 rounded bg-[#151519] text-[#A3A3A8] hover:text-[#D6B779] disabled:opacity-30"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove chapter "${entry.title}"?`)) {
                              const updated = data.timeline.filter((_, i) => i !== index);
                              setData({ ...data, timeline: updated });
                            }
                          }}
                          className="p-1 rounded bg-[#151519] text-[#A3A3A8] hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8] mb-1">
                          Chapter Title
                        </label>
                        <input
                          type="text"
                          value={entry.title}
                          onChange={(e) => {
                            const updated = [...data.timeline];
                            updated[index].title = e.target.value;
                            setData({ ...data, timeline: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8] mb-1">
                          Date / Milestone
                        </label>
                        <input
                          type="text"
                          value={entry.date}
                          onChange={(e) => {
                            const updated = [...data.timeline];
                            updated[index].date = e.target.value;
                            setData({ ...data, timeline: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#A3A3A8] mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={entry.location || ""}
                          onChange={(e) => {
                            const updated = [...data.timeline];
                            updated[index].location = e.target.value;
                            setData({ ...data, timeline: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#A3A3A8] mb-1">
                        Chapter Story Narrative
                      </label>
                      <textarea
                        rows={2}
                        value={entry.story}
                        onChange={(e) => {
                          const updated = [...data.timeline];
                          updated[index].story = e.target.value;
                          setData({ ...data, timeline: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#A3A3A8] mb-1">
                        Personal Callout Note
                      </label>
                      <input
                        type="text"
                        value={entry.personal_note || ""}
                        onChange={(e) => {
                          const updated = [...data.timeline];
                          updated[index].personal_note = e.target.value;
                          setData({ ...data, timeline: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. THE LETTER */}
          {activeTab === "letter" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">The Heartfelt Letter</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Craft the heartfelt message tucked inside the 3D gold-sealed envelope.
                  </p>
                </div>
                <button
                  onClick={handleSaveLetter}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Letter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Envelope Instruction Text
                  </label>
                  <input
                    type="text"
                    value={data.letter.instruction_text}
                    onChange={(e) =>
                      setData({
                        ...data,
                        letter: { ...data.letter, instruction_text: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Letter Date
                  </label>
                  <input
                    type="text"
                    value={data.letter.date}
                    onChange={(e) =>
                      setData({
                        ...data,
                        letter: { ...data.letter, date: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Greeting / Salutation
                </label>
                <input
                  type="text"
                  value={data.letter.greeting}
                  onChange={(e) =>
                    setData({
                      ...data,
                      letter: { ...data.letter, greeting: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Letter Paragraphs (One per box)
                </label>
                <div className="space-y-3">
                  {data.letter.paragraphs.map((para, pIdx) => (
                    <div key={pIdx} className="flex gap-2">
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => {
                          const updated = [...data.letter.paragraphs];
                          updated[pIdx] = e.target.value;
                          setData({
                            ...data,
                            letter: { ...data.letter, paragraphs: updated },
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] outline-none"
                      />
                      <button
                        onClick={() => {
                          const updated = data.letter.paragraphs.filter((_, i) => i !== pIdx);
                          setData({
                            ...data,
                            letter: { ...data.letter, paragraphs: updated },
                          });
                        }}
                        className="p-2 text-[#A3A3A8] hover:text-rose-400"
                        title="Remove paragraph"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setData({
                        ...data,
                        letter: {
                          ...data.letter,
                          paragraphs: [...data.letter.paragraphs, "A new heartfelt paragraph..."],
                        },
                      });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/30 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#D6B779]/20 pt-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Closing Sentiment
                  </label>
                  <input
                    type="text"
                    value={data.letter.closing}
                    onChange={(e) =>
                      setData({
                        ...data,
                        letter: { ...data.letter, closing: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Signature / Author
                  </label>
                  <input
                    type="text"
                    value={data.letter.signature}
                    onChange={(e) =>
                      setData({
                        ...data,
                        letter: { ...data.letter, signature: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. SURPRISE & CAKE */}
          {activeTab === "surprise" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">Cake & Birthday Surprise</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Configure the wish prompt, candle celebration message, and secret hidden surprise.
                  </p>
                </div>
                <button
                  onClick={handleSaveSurprise}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Surprise</span>
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Wish Prompt (Above Cake)
                </label>
                <input
                  type="text"
                  value={data.surprise.wish_prompt}
                  onChange={(e) =>
                    setData({
                      ...data,
                      surprise: { ...data.surprise, wish_prompt: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Revealed Message (After Candles Are Blown)
                </label>
                <textarea
                  rows={2}
                  value={data.surprise.revealed_message}
                  onChange={(e) =>
                    setData({
                      ...data,
                      surprise: { ...data.surprise, revealed_message: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] outline-none"
                />
              </div>

              <div className="border-t border-[#D6B779]/20 pt-4 space-y-4">
                <h3 className="font-serif text-xl text-[#F5F0E8]">Secret Surprise Details</h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Secret Title
                  </label>
                  <input
                    type="text"
                    value={data.surprise.secret_title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        surprise: { ...data.surprise, secret_title: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Secret Note / Inside Joke / Custom Wish
                  </label>
                  <textarea
                    rows={2}
                    value={data.surprise.secret_note || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        surprise: { ...data.surprise, secret_note: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                    Secret Photo URL
                  </label>
                  <input
                    type="text"
                    value={data.surprise.secret_photo_url || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        surprise: { ...data.surprise, secret_photo_url: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. PERSONAL QUIRKS */}
          {activeTab === "quirks" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">Things That Make You, You</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Personalized quirks, reasons they are cherished, and funny habits.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newQuirk: PersonalQuirk = {
                        id: `q-${Date.now()}`,
                        title: "A New Quirk or Quality",
                        category: "What Makes You Special",
                        message: "Explain what makes this quirk or memory so deeply endearing...",
                        icon_name: "sparkles",
                        sort_order: data.quirks.length + 1,
                      };
                      setData({ ...data, quirks: [...data.quirks, newQuirk] });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/30 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                  <button
                    onClick={handleSaveQuirks}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Collection</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.quirks.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#0B0B0D] border border-[#D6B779]/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <select
                        value={item.icon_name}
                        onChange={(e) => {
                          const updated = [...data.quirks];
                          updated[index].icon_name = e.target.value as any;
                          setData({ ...data, quirks: updated });
                        }}
                        className="px-2 py-1 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#D6B779] outline-none"
                      >
                        <option value="sparkles">✨ Sparkles</option>
                        <option value="heart">❤️ Heart</option>
                        <option value="smile">😊 Smile</option>
                        <option value="coffee">☕ Coffee</option>
                        <option value="music">🎵 Music</option>
                        <option value="camera">📷 Camera</option>
                        <option value="star">⭐ Star</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.title}"?`)) {
                            const updated = data.quirks.filter((_, i) => i !== index);
                            setData({ ...data, quirks: updated });
                          }
                        }}
                        className="p-1 rounded bg-[#151519] text-[#A3A3A8] hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#A3A3A8]">Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const updated = [...data.quirks];
                          updated[index].category = e.target.value;
                          setData({ ...data, quirks: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#A3A3A8]">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...data.quirks];
                          updated[index].title = e.target.value;
                          setData({ ...data, quirks: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-[#A3A3A8]">Message</label>
                      <textarea
                        rows={2}
                        value={item.message}
                        onChange={(e) => {
                          const updated = [...data.quirks];
                          updated[index].message = e.target.value;
                          setData({ ...data, quirks: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-[#151519] border border-[#D6B779]/20 text-xs text-[#F5F0E8] outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. MUSIC & AMBIENCE */}
          {activeTab === "music" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">Atmospheric Soundtrack</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Configure background music. Web Audio synthesizer ambient pad is active by default.
                  </p>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Audio Settings</span>
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Soundtrack Title
                </label>
                <input
                  type="text"
                  value={data.config.music_title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      config: { ...data.config, music_title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                  Audio File URL or Cloud Link
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={data.config.music_url}
                    onChange={(e) =>
                      setData({
                        ...data,
                        config: { ...data.config, music_url: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/20 text-sm text-[#F5F0E8] outline-none"
                    placeholder="Leave empty to use built-in celestial synthesizer pad"
                  />
                  <label className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/40 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload MP3/Audio</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-[#A3A3A8] mt-2 font-light">
                  Tip: If no custom MP3 is uploaded, the site automatically generates an ethereal,
                  royalty-free ambient soundscape using the Web Audio API upon entering!
                </p>
              </div>
            </div>
          )}

          {/* 9. VISIBILITY SETTINGS */}
          {activeTab === "visibility" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D6B779]/20 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8]">Section Visibility</h2>
                  <p className="text-xs text-[#A3A3A8]">
                    Toggle individual sections on or off to tailor the recipient's journey.
                  </p>
                </div>
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B779] text-[#0B0B0D] text-xs uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Visibility</span>
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: "show_gallery", label: "Photo Memory Gallery" },
                  { key: "show_videos", label: "Video Memories Archive" },
                  { key: "show_timeline", label: "Story Timeline" },
                  { key: "show_letter", label: "Heartfelt Letter & 3D Envelope" },
                  { key: "show_cake", label: "Interactive Cake & Surprise" },
                  { key: "show_quirks", label: "Things That Make You, You" },
                ].map((sec) => (
                  <div
                    key={sec.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0B0B0D] border border-[#D6B779]/20"
                  >
                    <span className="text-sm text-[#F5F0E8]">{sec.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(data.config[sec.key as keyof SiteConfig])}
                        onChange={(e) =>
                          setData({
                            ...data,
                            config: {
                              ...data.config,
                              [sec.key]: e.target.checked,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#151519] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D6B779]" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. CLOUD PERSISTENCE & DEPLOYMENT */}
          {activeTab === "supabase" && (
            <div className="space-y-6">
              <div className="border-b border-[#D6B779]/20 pb-4">
                <h2 className="font-serif text-2xl text-[#F5F0E8]">Supabase Cloud Sync & Deployment</h2>
                <p className="text-xs text-[#A3A3A8]">
                  Production cloud database, bucket storage, and live synchronization.
                </p>
              </div>

              {/* Status Banner */}
              <div
                className={`p-5 rounded-xl border flex items-start gap-4 ${
                  isSupabaseConfigured
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : "bg-[#D6B779]/10 border-[#D6B779]/30 text-[#E8CF9A]"
                }`}
              >
                {isSupabaseConfigured ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-medium text-sm">
                    {isSupabaseConfigured
                      ? "Cloud Database & Storage Connected"
                      : "Local Vault Active (Offline Dual-Mode)"}
                  </h4>
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">
                    {isSupabaseConfigured
                      ? "Your project is securely connected to Supabase PostgreSQL and the eternity-media storage bucket. All changes and uploads persist globally."
                      : "The website is currently running in local resilient mode. All uploaded photos, letters, and custom text persist in your browser's persistent store. To deploy to cloud, follow the 2-minute setup instructions below."}
                  </p>
                </div>
              </div>

              {/* Step by step cloud connection guide */}
              <div className="space-y-4 text-xs text-[#A3A3A8] leading-relaxed">
                <h3 className="font-serif text-lg text-[#F5F0E8]">Connecting to Supabase in 2 Minutes</h3>

                <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#D6B779]/20 space-y-3">
                  <p>
                    <strong className="text-[#D6B779]">1. Create a Supabase project</strong>: Go to{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#F5F0E8] underline"
                    >
                      supabase.com
                    </a>{" "}
                    and create a new project.
                  </p>
                  <p>
                    <strong className="text-[#D6B779]">2. Run the SQL Migration</strong>: Copy the
                    schema from <code className="text-[#F5F0E8]">supabase/schema.sql</code> and paste
                    it into your Supabase SQL Editor. It creates all tables, RLS policies, and the{" "}
                    <code className="text-[#F5F0E8]">eternity-media</code> bucket automatically.
                  </p>
                  <p>
                    <strong className="text-[#D6B779]">3. Add credentials to .env.local</strong>:
                  </p>
                  <pre className="p-3 rounded bg-[#151519] text-[#E8CF9A] font-mono text-[11px] overflow-x-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{"\n"}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
                  </pre>
                  <p>
                    <strong className="text-[#D6B779]">4. Restart or Deploy</strong>: Your site will
                    automatically stream all media and stories from your live Supabase cloud!
                  </p>
                </div>
              </div>

              {/* Data Backup & Export JSON */}
              <div className="border-t border-[#D6B779]/20 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-[#F5F0E8]">Export / Backup Data</h4>
                  <p className="text-[11px] text-[#A3A3A8]">
                    Download a complete JSON snapshot of all your personalized memories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `eternity-backup-${Date.now()}.json`;
                    a.click();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#0B0B0D] border border-[#D6B779]/30 text-xs text-[#D6B779] hover:bg-[#D6B779] hover:text-[#0B0B0D] transition-colors"
                >
                  Download JSON Backup
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
