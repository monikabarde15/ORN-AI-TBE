import {
  Sparkles,
  Loader2,
  ArrowUp,
  Paperclip,
  Mic,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIHeroSearchProps } from "../types";
import AISearchSuggestions from "./AISearchSuggestions";

export default function AIHeroSearch({
  value,
  loading,
  onChange,
  onSearch,
}: AIHeroSearchProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

const [listening, setListening] = useState(false);
const [recordingTime, setRecordingTime] = useState(0);

const timerRef = useRef<NodeJS.Timeout | null>(null);

const recognitionRef = useRef<any>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [preview, setPreview] = useState<string>("");
const startVoice = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onstart = () => {
    setListening(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  recognition.onresult = (event: any) => {
    let transcript = "";

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    onChange(transcript);
  };

  recognition.onend = () => {
    setListening(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  recognition.start();

  recognitionRef.current = recognition;
};
const stopVoice = () => {
  recognitionRef.current?.stop();

  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  setListening(false);
};
  return (
    <div className="flex items-center justify-center min-h-[82vh] px-6">
      <div className="w-full max-w-[1350px] mx-auto">

        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center">
          Find the perfect candidate
        </h1>

        <p className="text-center mt-4 text-lg text-muted-foreground">
          Describe your hiring requirement and let AI find the best talent.
        </p>
        <br/>
        <div className="w-full max-w-[1250px] mx-auto">
        <div className="relative w-full rounded-[32px] border bg-white shadow-2xl p-7">
            {selectedFile && (
              <div className="mb-3 inline-flex items-center gap-3 rounded-xl border bg-muted p-2">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
                    📄
                  </div>
                )}

                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview("");
                  }}
                >
                  ✕
                </Button>
              </div>
            )}
           {listening && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2 mb-3">

                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />

                <span className="font-medium text-red-600">
                  Recording...
                </span>

                <span className="ml-auto font-mono">
                  {Math.floor(recordingTime / 60)
                    .toString()
                    .padStart(2, "0")}
                  :
                  {(recordingTime % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>

              </div>
            )}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
             onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSearch();
                }
              }}
            placeholder="Message AI Recruiter..."
            className="min-h-[180px] resize-none border-0 shadow-none focus-visible:ring-0 pr-32 pb-14 text-base"
          />

          {/* Left */}
          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setSelectedFile(file);

              if (file.type.startsWith("image/")) {
                setPreview(URL.createObjectURL(file));
              } else {
                setPreview("");
              }
            }}
          />
            <Button
              variant="ghost"
              size="icon"
                title="Attach file"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          {/* Right */}
          <div className="absolute bottom-5 right-5 flex items-center gap-2">
         {listening ? (
            <Button
              size="icon"
              variant="destructive"
              title="Stop recording"
              onClick={stopVoice}
            >
              ■
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
                title="Voice"
              onClick={startVoice}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}

            <Button
              onClick={onSearch}
              disabled={loading}
              className="rounded-full w-10 h-10 p-0"
              title="Submit"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
}