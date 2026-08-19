import { useRef, useState } from "react";
import { Award, Printer, CheckCircle2, Video, BarChart2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

interface CertificatePerformanceViewProps {
  course: any;
  sections: any[];
}

const CertificatePerformanceView = ({
  course,
  sections = [],
}: CertificatePerformanceViewProps) => {
  const { user } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);

  // Calculate statistics
  let totalLessons = 0;
  let completedLessons = 0;
  let totalQuizzes = 0;
  let completedQuizzes = 0;
  let totalDurationMinutes = 0;

  const parseDuration = (val: any): number => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const str = String(val).trim();
    if (str.includes(":")) {
      const parts = str.split(":");
      if (parts.length === 2) {
        return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
      }
    }
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  sections.forEach((section) => {
    section.lessons?.forEach((lesson: any) => {
      totalLessons++;
      if (lesson.completed) {
        completedLessons++;
      }
      if (lesson.quizzes && lesson.quizzes.length > 0) {
        totalQuizzes++;
        if (lesson.quizCompleted) {
          completedQuizzes++;
        }
      }
      totalDurationMinutes += parseDuration(lesson.duration);
    });
  });

  const studentName = user?.name || user?.email || "Student Learner";
  const courseTitle = course?.courseName || course?.title || "Learning Course";
  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certificateId = `ORN-${course?.id?.substring(0, 4).toUpperCase() || "LMS"}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);
      const node = certRef.current;
      
      const dataUrl = await htmlToImage.toPng(node, { 
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate ratio to fit both width and height inside the A4 page
      const ratio = Math.min(pdfPageWidth / width, pdfPageHeight / height);
      
      const imgWidth = width * ratio;
      const imgHeight = height * ratio;
      
      // Center the image on the PDF page
      const marginX = (pdfPageWidth - imgWidth) / 2;
      const marginY = (pdfPageHeight - imgHeight) / 2;
      
      pdf.addImage(dataUrl, "PNG", marginX, marginY, imgWidth, imgHeight);
      pdf.save(`${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
      alert("PDF download failed. Please try again. Error: " + (error as Error)?.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-8 bg-[#F7F8FA] min-h-screen">
      {/* Styles for printing only the certificate */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: 12px double #102B6A !important;
          }
        }
      `}</style>

      {/* Header and Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Congratulations, {studentName}!</h1>
          <p className="text-gray-500 mt-1">You have successfully completed the course.</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className={`flex items-center justify-center gap-2 px-5 py-3 ${isDownloading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white font-semibold rounded-lg transition-colors shadow-md w-full sm:w-auto`}
        >
          <Printer className="w-5 h-5" />
          {isDownloading ? 'Downloading...' : 'Download Certificate (PDF)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Certificate Container */}
        <div className="lg:col-span-2">
          <div
            id="printable-certificate"
            ref={certRef}
            className="w-full bg-white border-[12px] border-double border-[#102B6A] p-6 sm:p-10 md:p-12 shadow-lg relative text-center flex flex-col justify-between min-h-[500px]"
          >
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Award className="w-80 h-80 text-[#102B6A]" />
            </div>

            {/* Corner Decorative Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

            {/* Certificate Header */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-[#102B6A] text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100">
                  ORN-AI Learning Platform
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-wide">
                CERTIFICATE OF COMPLETION
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-sans tracking-wider uppercase">
                THIS IS PROUDLY PRESENTED TO
              </p>
            </div>

            {/* Student Name */}
            <div className="my-6 relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#102B6A] capitalize border-b-2 border-amber-400 inline-block pb-2 px-8">
                {studentName}
              </h3>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-3 max-w-xl mx-auto relative z-10">
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed font-sans">
                for successfully completing all modules, practical labs, and the assessment requirements for the course
              </p>
              <h4 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 font-sans">
                {courseTitle}
              </h4>
            </div>

            {/* Footer Signatures and Verification */}
            <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 items-end gap-4 text-left relative z-10">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Issue Date</p>
                <p className="text-xs font-semibold text-gray-800">{completionDate}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold mt-2">Certificate ID</p>
                <p className="text-xs font-mono text-gray-600">{certificateId}</p>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-[9px] font-bold text-amber-700 uppercase mt-1 tracking-wider">
                  Verified Authentic
                </span>
              </div>

              <div className="text-right">
                <div className="inline-block border-b border-gray-400 pb-1 px-4 mb-1">
                  <span className="font-serif italic text-base text-gray-800 font-bold">ORN AI Academy</span>
                </div>
                <p className="text-[10px] font-semibold text-gray-700">Authorized Signatory</p>
                <p className="text-[9px] text-gray-400">ORN Talent Platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-red-600" />
              Your Performance Stats
            </h3>

            <div className="divide-y divide-gray-100">
              {/* Videos Watched / Views */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Lessons Watched</p>
                    <h4 className="text-sm font-semibold text-gray-800">
                      Completed: {completedLessons}
                      {totalLessons - completedLessons > 0 && ` | Pending: ${totalLessons - completedLessons}`}
                    </h4>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {completedLessons}/{totalLessons}
                </span>
              </div>

              {/* Assessment Quizzes & Sahi / Galat */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Assessment Quizzes</p>
                    <h4 className="text-sm font-semibold text-gray-800">
                      Total: {totalQuizzes || completedQuizzes || 1} | Sahi / Galat
                    </h4>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {completedQuizzes || 1} Sahi ✅
                </span>
              </div>

              {/* Watch Duration */}
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Total Duration</p>
                    <h4 className="text-sm font-semibold text-gray-800">Watch Minutes</h4>
                  </div>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {Math.round(totalDurationMinutes)} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePerformanceView;
