import SelectedCourses from "../learning-path/SelectedCourses";
import PaymentStudentSummary from "../learning-path/PaymentStudentSummary";
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
                removeCourse={() => {}}
                showRemoveButton={false}
            />

            
            <PaymentStudentSummary
                subtotal={subtotal}
                gst={gst}
                total={total}
                paymentLink={paymentLink}
                generatePaymentLink={
                    generatePaymentLink
                }
                showRemoveButton={false}
            />

        </div>
    );
}