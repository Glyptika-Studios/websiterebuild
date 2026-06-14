/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  File,
  AlertCircle,
  FileText,
  Upload,
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

const DEFAULT_FILES: MediaFile[] = [
  {
    id: "media-1",
    file_name: "cluster_node_telemetry.png",
    public_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    mime_type: "image/png",
    size_bytes: 1450200, // 1.38 MB
    media_type: "image",
    created_at: "2026-06-05"
  },
  {
    id: "media-2",
    file_name: "futuristic_server_room.jpg",
    public_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    mime_type: "image/jpeg",
    size_bytes: 4200150, // 4.0 MB
    media_type: "image",
    created_at: "2026-06-08"
  },
  {
    id: "media-3",
    file_name: "data_stream_macro.mp4",
    public_url: "https://assets.mixkit.co/videos/preview/mixkit-data-stream-on-a-screen-closeup-34248-large.mp4",
    mime_type: "video/mp4",
    size_bytes: 48500200, // 46.2 MB
    media_type: "video",
    created_at: "2026-06-10"
  }
];

export default function MediaLibraryManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("media", "write");

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video" | "audio">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload fields
  const [uploadName, setUploadName] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadSize, setUploadSize] = useState("2"); // in MB
  const [uploadType, setUploadType] = useState<"image" | "video" | "audio">("image");
  const [uploadAlert, setUploadAlert] = useState<{ type: "warn" | "reject" | "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_media");
    if (saved) {
      try {
        setFiles(JSON.parse(saved));
      } catch (e) {
        setFiles(DEFAULT_FILES);
      }
    } else {
      setFiles(DEFAULT_FILES);
      localStorage.setItem("glyptika_admin_media", JSON.stringify(DEFAULT_FILES));
    }
  }, []);

  const saveToStorage = (newFiles: MediaFile[]) => {
    setFiles(newFiles);
    localStorage.setItem("glyptika_admin_media", JSON.stringify(newFiles));
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = (id: string) => {
    if (!canWrite) return;
    if (confirm("Are you sure you want to delete this media file?")) {
      const updated = files.filter((f) => f.id !== id);
      saveToStorage(updated);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadAlert(null);

    if (!uploadName.trim() || !uploadUrl.trim()) {
      setUploadAlert({ type: "error", text: "Please enter a file name and URL." });
      return;
    }

    const sizeMb = Number(uploadSize);
    if (isNaN(sizeMb) || sizeMb <= 0) {
      setUploadAlert({ type: "error", text: "Please enter a valid file size." });
      return;
    }

    const sizeBytes = sizeMb * 1024 * 1024;

    // Apply strict size thresholds from Master Spec
    if (uploadType === "image") {
      if (sizeMb > 20) {
        setUploadAlert({ type: "reject", text: "Upload REJECTED: Image files cannot exceed 20 MB." });
        return;
      }
      if (sizeMb > 5) {
        setUploadAlert({ type: "warn", text: "Upload WARNING: Image size is over 5 MB. Retaining file but optimize compression if possible." });
      }
    } else if (uploadType === "video") {
      if (sizeMb > 200) {
        setUploadAlert({ type: "reject", text: "Upload REJECTED: Video files cannot exceed 200 MB." });
        return;
      }
      if (sizeMb > 50) {
        setUploadAlert({ type: "warn", text: "Upload WARNING: Video size is over 50 MB. Bandwidth performance may be impacted." });
      }
    }

    const newFile: MediaFile = {
      id: `media-${Date.now()}`,
      file_name: uploadName.includes(".") ? uploadName : `${uploadName}.${uploadType === "image" ? "jpg" : uploadType === "video" ? "mp4" : "mp3"}`,
      public_url: uploadUrl.trim(),
      mime_type: uploadType === "image" ? "image/jpeg" : uploadType === "video" ? "video/mp4" : "audio/mpeg",
      size_bytes: sizeBytes,
      media_type: uploadType,
      created_at: new Date().toISOString().split("T")[0],
    };

    saveToStorage([newFile, ...files]);
    
    // Clear form
    setUploadName("");
    setUploadUrl("");
    setUploadSize("2");
    
    if (!uploadAlert) {
      setUploadAlert({ type: "success", text: "File registered successfully in media library." });
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" ? true : f.media_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">
          Media Library
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          Upload and manage digital assets referenced on dynamic website panels
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Asset Upload Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between self-start">
          <div className="space-y-5 w-full">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Upload className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Asset Register Tool</h3>
            </div>

            {/* Size Warnings Alert Banner */}
            <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/15 text-[10px] text-slate-400 leading-relaxed font-bold">
              <span className="text-blue-400 uppercase font-black tracking-wide block mb-1">Upload Size Limits</span>
              &bull; Images: Warn &gt;5 MB, Reject &gt;20 MB<br />
              &bull; Videos: Warn &gt;50 MB, Reject &gt;200 MB
            </div>

            {/* Alert banner */}
            {uploadAlert && (
              <div className={`p-4 rounded-2xl border text-xs leading-normal font-bold flex gap-2 items-start ${
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

            {/* Upload form fields */}
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Asset File Name</label>
                <input
                  type="text"
                  placeholder="e.g. adorno_hero_diagram"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  disabled={!canWrite}
                  className="w-full px-3 py-2 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Asset URL link</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  disabled={!canWrite}
                  className="w-full px-3 py-2 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Type Classification</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    disabled={!canWrite}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-350 focus:outline-none"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">File Size (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={uploadSize}
                    onChange={(e) => setUploadSize(e.target.value)}
                    disabled={!canWrite}
                    className="w-full px-3 py-2 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {canWrite && (
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Register File Asset
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Columns: Media Browser */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white tracking-wide">Global Assets Browser</h3>
            </div>
          </div>

          {/* Search/Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div className="flex gap-1.5 shrink-0 overflow-x-auto">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  filterType === "all" ? "bg-white/10 text-white border-white/10" : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("image")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  filterType === "image" ? "bg-white/10 text-white border-white/10" : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setFilterType("video")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  filterType === "video" ? "bg-white/10 text-white border-white/10" : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setFilterType("audio")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  filterType === "audio" ? "bg-white/10 text-white border-white/10" : "text-slate-400 hover:text-white border-transparent"
                }`}
              >
                Audio
              </button>
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 bg-slate-950/40 border border-white/5 hover:border-slate-800 rounded-3xl shadow flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Media Preview Box */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-slate-950 flex items-center justify-center">
                      {file.media_type === "image" ? (
                        <img src={file.public_url} alt="" className="object-cover w-full h-full" />
                      ) : file.media_type === "video" ? (
                        <video src={file.public_url} className="w-full h-full object-cover" preload="metadata" muted />
                      ) : (
                        <File className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-200 truncate leading-none mb-1.5" title={file.file_name}>
                        {file.file_name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">
                        {file.mime_type} &bull; {formatBytes(file.size_bytes)}
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="border-t border-white/5 mt-4 pt-3 flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleCopyLink(file.public_url, file.id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-transparent transition-all"
                      title="Copy Public URL"
                    >
                      {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {canWrite && (
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg border border-transparent transition-all"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs italic">
                No asset matching search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
