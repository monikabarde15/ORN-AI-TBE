import {
  ImageIcon,
  Video,
  UploadCloud,
} from "lucide-react";

interface Props {
  setThumbnail: (
    file: File | null
  ) => void;

  setVideo: (
    file: File | null
  ) => void;

  thumbnailPreview?: string;
  videoPreview?: string;

  setThumbnailPreview?: (
    value: string
  ) => void;

  setVideoPreview?: (
    value: string
  ) => void;
}

export default function UploadMedia({
  setThumbnail,
  setVideo,
  thumbnailPreview,
  videoPreview,
  setThumbnailPreview,
  setVideoPreview,
}: Props) {
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setThumbnail(file);

    if (setThumbnailPreview) {
      setThumbnailPreview(
        URL.createObjectURL(file)
      );
    }
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setVideo(file);

    if (setVideoPreview) {
      setVideoPreview(
        URL.createObjectURL(file)
      );
    }
  };

  return (
    <div className="pt-0">

      <div className="mb-6 border-t border-slate-200 pt-6">

        <h3 className="text-xl font-semibold text-slate-900">
          Upload Media
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Add thumbnail and introduction video for this learning path.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Thumbnail */}
        <label className="group cursor-pointer">
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={
              handleThumbnailChange
            }
          />

          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all group-hover:border-blue-500 group-hover:bg-blue-50">

            {thumbnailPreview ? (
              <img
                src={
                  thumbnailPreview
                }
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
            onChange={
              handleVideoChange
            }
          />

          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-all group-hover:border-purple-500 group-hover:bg-purple-50">

            {videoPreview ? (
              <video
                controls
                className="h-40 w-full rounded-2xl object-cover"
              >
                <source
                  src={videoPreview}
                />
              </video>
            ) : (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Video
                    size={30}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  Upload Intro Video
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  MP4, MOV, WEBM
                </p>

                <span className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                  Choose Video
                </span>
              </>
            )}

          </div>
        </label>

      </div>
    </div>
  );
}