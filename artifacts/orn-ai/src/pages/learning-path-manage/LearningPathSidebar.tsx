import SelectedCourses from "../learning-path/SelectedCourses";
import PaymentSummary from "../learning-path/PaymentSummary";
interface LearningPathSidebarProps {
    selectedCourses: any[];
    removeCourse: (
        id: string
    ) => void;

    saving: boolean;
    saveLearningPath: () => void;

    editingId: string | null;

    subtotal: number;
    gst: number;
    total: number;

    paymentLink: string;

    generatePaymentLink: () => void;
}

export default function LearningPathSidebar({
    selectedCourses,
    removeCourse,

    saving,
    saveLearningPath,

    editingId,

    subtotal,
    gst,
    total,

    paymentLink,

    generatePaymentLink,
}: LearningPathSidebarProps) {
    return (
        <div className="sticky top-6 space-y-6">

            <SelectedCourses
                courses={selectedCourses}
                removeCourse={removeCourse}
            />

            <button
                onClick={saveLearningPath}
                disabled={saving}
                className="
    w-full
    rounded-xl
    bg-blue-900
    py-3.5
    text-base
    font-semibold
    text-white
    disabled:opacity-70
    disabled:cursor-not-allowed
    flex
    items-center
    justify-center
    gap-3
    transition
  hover:bg-blue-800
  "
            >
                {saving ? (
                    <>
                        <svg
                            className="h-5 w-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />

                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>

                        Saving...
                    </>
                ) : editingId ? (
                    "Update Learning Path"
                ) : (
                    "Create Learning Path"
                )}
            </button>

            <PaymentSummary
                subtotal={subtotal}
                gst={gst}
                total={total}
                paymentLink={paymentLink}
                generatePaymentLink={
                    generatePaymentLink
                }
            />

        </div>
    );
}