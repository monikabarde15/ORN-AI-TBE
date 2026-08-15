import { useRef } from "react";
import { X, Printer, Award, CheckCircle2, Download } from "lucide-react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  completionDate?: string;
  certificateId?: string;
}

const CertificateModal = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  certificateId = `ORN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
}: CertificateModalProps) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
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
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Actions */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">Official Certificate of Completion</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Viewable Body */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 bg-gray-50 flex justify-center">
          <div
            id="printable-certificate"
            ref={certRef}
            className="w-full max-w-3xl bg-white border-[12px] border-double border-[#102B6A] p-8 md:p-12 shadow-xl relative text-center flex flex-col justify-between min-h-[500px]"
          >
            {/* Background Seal Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Award className="w-96 h-96 text-[#102B6A]" />
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
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 tracking-wide">
                CERTIFICATE OF COMPLETION
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-sans tracking-wider uppercase">
                THIS IS PROUDLY PRESENTED TO
              </p>
            </div>

            {/* Student Name */}
            <div className="my-6 relative z-10">
              <h2 className="text-2xl md:text-4xl font-semibold text-[#102B6A] capitalize border-b-2 border-amber-400 inline-block pb-2 px-8">
                {studentName || "Student Learner"}
              </h2>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-3 max-w-xl mx-auto relative z-10">
              <p className="text-sm md:text-base text-gray-600 leading-relaxed font-sans">
                for successfully completing all modules, practical labs, and the final assessment for the course
              </p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 font-sans">
                {courseTitle}
              </h3>
            </div>

            {/* Footer Signatures and Verification */}
            <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 items-end gap-4 text-left relative z-10">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Issue Date</p>
                <p className="text-xs md:text-sm font-semibold text-gray-800">{completionDate}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold mt-2">Certificate ID</p>
                <p className="text-xs font-mono text-gray-600">{certificateId}</p>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 uppercase mt-1 tracking-wider">
                  Verified Authentic
                </span>
              </div>

              <div className="text-right">
                <div className="inline-block border-b border-gray-400 pb-1 px-4 mb-1">
                  <span className="font-serif italic text-lg text-gray-800 font-bold">ORN AI Academy</span>
                </div>
                <p className="text-xs font-semibold text-gray-700">Authorized Signatory</p>
                <p className="text-[10px] text-gray-400">ORN Talent Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
