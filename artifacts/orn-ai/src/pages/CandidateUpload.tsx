import { useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadCv, useGetCandidate, getGetCandidateQueryKey, useRunEvaluation } from "@workspace/api-client-react";
import { FileUp, FileText, Loader2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CandidateUpload() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: candidate, isLoading: isLoadingCandidate } = useGetCandidate(id || "", {
    query: { enabled: !!id, queryKey: getGetCandidateQueryKey(id || "") }
  });

  const uploadCvMutation = useUploadCv();
  const runEvaluationMutation = useRunEvaluation();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    // Only accept PDF or Docx usually, but we'll accept anything for the demo
    setFile(selectedFile);
    
    // Auto-upload the metadata
    uploadCvMutation.mutate(
      {
        id: id as string,
        data: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          contentSummary: "Candidate uploaded CV document."
        }
      },
      {
        onSuccess: () => {
          toast.success("CV uploaded successfully!");
        },
        onError: () => {
          toast.error("Failed to upload CV details.");
          setFile(null); // reset on error
        }
      }
    );
  };

  const handleRunEvaluation = () => {
    runEvaluationMutation.mutate(
      { id: id as string },
      {
        onSuccess: () => {
          setLocation(`/candidate/${id}/evaluation`);
        },
        onError: () => {
          toast.error("Failed to run evaluation.");
        }
      }
    );
  };

  if (!id || isLoadingCandidate) {
    return (
      <Shell>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Your CV</h1>
          <p className="text-muted-foreground text-lg">
            Welcome, {candidate?.fullName}. Upload your most recent CV to start the AI evaluation process.
          </p>
        </div>

        <Card className="border-muted shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload-zone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`
                    p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors border-2 border-dashed m-4 rounded-xl
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/10 hover:bg-muted/30 hover:border-primary/50'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <FileUp className="size-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Click to upload or drag and drop</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    PDF, DOC, or DOCX up to 10MB
                  </p>
                  <Button variant="outline" className="pointer-events-none">Select File</Button>
                </motion.div>
              ) : (
                <motion.div
                  key="file-uploaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8"
                >
                  <div className="flex items-start gap-6 bg-muted/20 p-6 rounded-xl border">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="size-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg truncate pr-4">{file.name}</h3>
                        <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {uploadCvMutation.isPending && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin mr-2" /> Uploading metadata...
                        </div>
                      )}
                      
                      {uploadCvMutation.isSuccess && (
                        <div className="flex items-center text-sm text-green-600 font-medium">
                          Successfully ingested. Ready for evaluation.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button 
                      size="lg" 
                      className="bg-primary text-primary-foreground font-semibold"
                      onClick={handleRunEvaluation}
                      disabled={uploadCvMutation.isPending || runEvaluationMutation.isPending}
                    >
                      {runEvaluationMutation.isPending ? (
                        <><Loader2 className="mr-2 size-5 animate-spin" /> Evaluating Profile...</>
                      ) : (
                        <><Sparkles className="mr-2 size-5" /> Run AI Evaluation <ArrowRight className="ml-2 size-5" /></>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {runEvaluationMutation.isPending && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-muted/30 rounded-xl border text-center"
          >
            <div className="flex justify-center mb-4">
              <Sparkles className="size-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-medium mb-2">Analyzing Candidate Profile</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Our AI engine is currently evaluating technical skills, English proficiency, and European job market readiness...
            </p>
            <div className="w-full max-w-md mx-auto mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
            </div>
          </motion.div>
        )}
      </div>
    </Shell>
  );
}