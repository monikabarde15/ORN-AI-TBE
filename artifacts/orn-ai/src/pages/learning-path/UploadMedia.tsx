import { useState } from "react";
import {
  ImageIcon,
  Video,
  UploadCloud,
} from "lucide-react";

interface Props {
  setThumbnail: (file: File | null) => void;
  setVideo: (file: File | null) => void;
}

export default function UploadMedia({
  setThumbnail,
  setVideo,
}: Props) {
  const [thumbnailPreview, setThumbnailPreview] =
    useState("");

  const [videoName, setVideoName] =
    useState("");

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);

    setThumbnailPreview(
      URL.createObjectURL(file)
    );
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideo(file);

    setVideoName(file.name);
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      <div className="border-b bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <UploadCloud size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Media Upload
            </h2>

            <p className="text-sm text-violet-100">
              Upload thumbnail & intro video
            </p>
          </div>

        </div>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">

        {/* Thumbnail */}
        <label className="group cursor-pointer">
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />

          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all group-hover:border-blue-500 group-hover:bg-blue-50">

            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="h-40 w-full rounded-2xl object-cover"
              />
            ) : (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <ImageIcon
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  Upload Thumbnail
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  PNG, JPG, JPEG
                </p>

                <span className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                  Choose Image
                </span>
              </>
            )}

          </div>
        </label>

        {/* Video */}
        <label className="group cursor-pointer">
          <input
            hidden
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />

          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all group-hover:border-purple-500 group-hover:bg-purple-50">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Video
                size={30}
                className="text-purple-600"
              />
            </div>

            <h3 className="text-lg font-semibold">
              Upload Intro Video
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {videoName || "MP4, MOV, WEBM"}
            </p>

            <span className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white">
              Choose Video
            </span>

          </div>
        </label>

      </div>

    </div>
  );
}
