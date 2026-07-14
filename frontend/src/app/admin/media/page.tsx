/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Search,
  File,
  AlertCircle,
  Upload,
  Loader2,
  Music,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface MediaFile {
  id: string;
  file_name: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  media_type: "image" | "video" | "audio";
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    items: MediaFile[];
    meta: { page: number; limit: number; total: number };
  };
}

const LIMIT = 18;

export default function MediaLibraryManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("media", "write");

  // Library state
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [meta, setMeta] = useState({ page: 1, total: 0, limit: LIMIT });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "audio">("all");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadAlert, setUploadAlert] = useState<{ type: "success" | "error" | "warn"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media from backend
  const fetchMedia = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      if (filterType !== "all") params.set("media_type", filterType);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await api.get<ApiResponse>(`/api/v1/admin/media?${params.toString()}`);
      if (res.success && res.data) {
        setFiles(res.data.items || []);
        setMeta({ page, total: res.data.meta.total, limit: LIMIT });
      }
    } catch (err) {
      console.error("Failed to load media files:", err);
    } finally {
      setLoading(false);
    }
  }, [filterType, searchQuery]);

  useEffect(() => {
    const delay = setTimeout(() => fetchMedia(1), 300);
    return () => clearTimeout(delay);
  }, [fetchMedia]);

  // Copy media ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!canWrite) return;
    if (!confirm("Delete this media file permanently? This cannot be undone.")) return;
    try {
      await api.delete(`/api/v1/admin/media/${id}`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setMeta((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  // File selection (drag or click)
  const pickFile = (file: File) => {
    setUploadAlert(null);
    const sizeMb = file.size / (1024 * 1024);
    if (file.type.startsWith("image/") && sizeMb > 20) {
      setUploadAlert({ type: "error", text: "Images cannot exceed 20 MB." });
      return;
    }
    if (file.type.startsWith("video/") && sizeMb > 200) {
      setUploadAlert({ type: "error", text: "Videos cannot exceed 200 MB." });
      return;
    }
    if (file.type.startsWith("image/") && sizeMb > 5) {
      setUploadAlert({ type: "warn", text: "Image is over 5 MB — consider optimising compression." });
    }
    setUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pickFile(f);
  };

  // Upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !canWrite) return;
    if (!uploadName.trim()) {
      setUploadAlert({ type: "error", text: "File name is required." });
      return;
    }
    setUploading(true);
    setUploadProgress(10);
    setUploadAlert(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("file_name", uploadName.trim());

      // Simulate progress steps while fetch runs
      const progressInterval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 300);

      const res = await api.post<any>("/api/v1/admin/media/upload", formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.success && res.data) {
        setUploadAlert({ type: "success", text: `"${res.data.file_name}" uploaded successfully. Copy its ID from the grid.` });
        setUploadFile(null);
        setUploadName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        // Refresh grid to show new file
        fetchMedia(1);
      }
    } catch (err: any) {
      setUploadAlert({ type: "error", text: err.message || "Upload failed." });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 600);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const totalPages = Math.ceil(meta.total / LIMIT);

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">Media Library</h1>
        <p className="text-sm text-slate-400 font-medium">
          Upload local files · Copy Media ID · Paste into team, product or any admin section
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ─── Left: Upload Panel ─── */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Upload className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Upload File</h3>
          </div>

          {/* Size limits info */}
          <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-[10px] text-slate-400 leading-relaxed font-bold">
            <span className="text-blue-400 uppercase font-black tracking-wide block mb-1">Size Limits</span>
            • Images: warn &gt;5 MB, reject &gt;20 MB<br />
            • Videos: warn &gt;50 MB, reject &gt;200 MB
          </div>

          {/* Alert */}
          {uploadAlert && (
            <div className={`p-3 rounded-2xl border text-xs font-bold flex gap-2 items-start ${
              uploadAlert.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : uploadAlert.type === "warn"
                ? "bg-yellow-500/10 border-yellow-500/25 text-yellow-400"
                : "bg-red-500/10 border-red-500/25 text-red-400"
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadAlert.text}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all p-6 text-center ${
                dragOver
                  ? "border-blue-500/60 bg-blue-500/10"
                  : uploadFile
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-white/10 hover:border-white/20 bg-slate-950/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileInput}
                className="hidden"
              />
              {uploadFile ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    {uploadFile.type.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5 text-emerald-400" />
                    ) : uploadFile.type.startsWith("video/") ? (
                      <Video className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Music className="w-5 h-5 text-emerald-400" />
                    )}
                    <span className="text-xs font-black text-emerald-400 truncate max-w-[160px]">{uploadFile.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{formatBytes(uploadFile.size)}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUploadFile(null); setUploadAlert(null); }}
                    className="mt-1 text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-7 h-7 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Click or drag file here</p>
                  <p className="text-[10px] text-slate-600">Images, Videos, Audio</p>
                </div>
              )}
            </div>

            {/* Mandatory File Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                File Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. arjun-mehta-profile"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                disabled={!canWrite}
                required
                className="w-full px-3 py-2 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/30"
              />
            </div>

            {/* Progress bar */}
            {uploadProgress > 0 && (
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {canWrite && (
              <button
                type="submit"
                disabled={!uploadFile || !uploadName.trim() || uploading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Upload to Library"}
              </button>
            )}
          </form>

          {/* Instruction box */}
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5 text-[10px] text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-black block mb-1">How to use</span>
            1. Upload your file here<br />
            2. Find it in the grid → click <strong className="text-slate-300">Copy ID</strong><br />
            3. Paste the ID in the team member or product photo field
          </div>
        </div>

        {/* ─── Right: Library Grid ─── */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white tracking-wide">
                Asset Browser
                {meta.total > 0 && (
                  <span className="ml-2 text-[10px] font-bold text-slate-500">({meta.total} files)</span>
                )}
              </h3>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500/30"
              />
            </div>
            <div className="flex gap-1.5 shrink-0">
              {(["all", "image", "video", "audio"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all capitalize ${
                    filterType === t ? "bg-white/10 text-white border-white/10" : "text-slate-400 hover:text-white border-transparent"
                  }`}
                >
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Loading library...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs italic border border-dashed border-white/5 rounded-2xl">
              No media files found. Upload one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-3 bg-slate-950/40 border border-white/5 hover:border-slate-700 rounded-2xl flex flex-col gap-2 group transition-all"
                >
                  {/* Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-950 flex items-center justify-center">
                    {file.media_type === "image" ? (
                      <img src={file.public_url} alt="" className="object-cover w-full h-full" />
                    ) : file.media_type === "video" ? (
                      <video src={file.public_url} className="w-full h-full object-cover" preload="metadata" muted />
                    ) : (
                      <Music className="w-7 h-7 text-slate-600" />
                    )}
                    {/* Type badge */}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-black/60 text-slate-300 border border-white/10">
                      {file.media_type}
                    </span>
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-[10px] font-black text-slate-200 truncate leading-none" title={file.file_name}>
                      {file.file_name}
                    </p>
                    <p className="text-[9px] text-slate-600 mt-0.5">{formatBytes(file.size_bytes)}</p>
                  </div>

                  {/* ID preview + Copy */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 rounded-lg px-2 py-1.5">
                    <span className="text-[9px] font-mono text-slate-500 truncate flex-1" title={file.id}>
                      {file.id}
                    </span>
                    <button
                      onClick={() => handleCopyId(file.id)}
                      className="shrink-0 text-slate-400 hover:text-white transition-colors"
                      title="Copy Media ID"
                    >
                      {copiedId === file.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Delete */}
                  {canWrite && (
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold text-red-400 hover:text-white hover:bg-red-500/15 border border-transparent hover:border-red-500/20 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[10px] text-slate-500 font-bold">
                Page {meta.page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => fetchMedia(meta.page - 1)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={meta.page >= totalPages}
                  onClick={() => fetchMedia(meta.page + 1)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
