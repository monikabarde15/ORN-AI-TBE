import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import CandidateUpload from "@/pages/CandidateUpload";
import CandidateEvaluation from "@/pages/CandidateEvaluation";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import RecruiterHistoryDashboard from "@/pages/RecruiterHistoryDashboard";
import RecruiterAddCandidate from "@/pages/RecruiterAddCandidate";
import BlogAdd from "@/pages/BlogAdd";

import CreateCourse from "@/pages/CreateCourse";
import EditCoursePage from "@/pages/EditCoursePage";
import VideoPlayer from "@/pages/VideoPlayer";
import CoursePlayer from "./pages/CoursePlayer/CoursePlayer";
import LabDetail from "./pages/LabDetail";
import CourseManagementPage from "@/pages/CoursesListPage";
import CourseCategoryManagement from "@/pages/CourseCategoryManagement";

import MyFeed from "@/pages/MyFeed";


import AdminDashboard from "@/pages/AdminDashboard";
import TrainingDashboard from "@/pages/TrainingDashboard";
import CandidateTraining from "@/pages/CandidateTraining";
import Pricing from "@/pages/Pricing"; 
import JoinLearningPath from "@/pages/JoinLearningPath ";
import LearningPath from "@/pages/LearningPath";

import PaymentPage from "@/pages/PaymentPage";
import PaymentSuccess from "@/pages/PaymentSuccess";
import LiveSessionCourses from "@/pages/LiveSessionCourses";
import LearningPathStudent from "@/pages/LearningPathStudent";

import LearningPathList from "@/pages/LearningPathList";
import LearningStudentPathList from "@/pages/LearningStudentPathList";

import DataScientce from "@/pages/Data";
import Advancedprograms from "@/pages/Advancedprograms";
import BusinessDataAnalytics from "@/pages/BusinessDataAnalytics";
import TechnologyPrograms from "@/pages/TechnologyPrograms";
import ScienceProgramsD from "@/pages/ScienceProgramsD";
import SciencePrograms from "@/pages/SciencePrograms";
import AboutUs from "@/pages/AboutUs";
import ContactPage from "@/pages/ContactPage";
import BlogList from "@/pages/BlogList";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsCondition from "@/pages/TermsCondition";
import Support from "@/pages/Support";
import RefoundPolicy from "@/pages/RefoundPolicy";

import BlogDetail from "@/pages/BlogDetail";
import UserPermissions from "@/pages/UserPermissions";


import { MCQExamPortal } from "./pages/MCQExamPortal";

import { Loader2 } from "lucide-react";

import LearningPathManage from "./pages/LearningPathManage";
import LearningPathStudentViewManage from "./pages/LearningPathStudentViewManage";
import { MCQAdminPanel } from "./pages/MCQAdminPanel";
import CandidateMaskedCV from "@/pages/CandidateMaskedCV";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Role = "candidate" | "recruiter" | "admin";

function ProtectedRoute({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Redirect to="/login" />;
  if (!roles.includes(user.role)) return <Redirect to="/" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/profile">
        <ProtectedRoute roles={["candidate", "recruiter", "admin"]}>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/register" component={Register} />
      <Route path="/candidate/:id/upload" component={CandidateUpload} />
      <Route path="/candidate/:id/evaluation" component={CandidateEvaluation} />
      <Route path="/candidate/:id/learning-student-path-list" component={CandidateTraining} />
      <Route path="/cyber-security" component={Pricing} />
      <Route path="/data-science-ai" component={DataScientce} />
      <Route path="/advanced-programs" component={Advancedprograms} />
      <Route path="/business-analytics" component={BusinessDataAnalytics} />
      <Route path="/technology-programs" component={TechnologyPrograms} />
      <Route path="/science-programs" component={SciencePrograms} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact-us" component={ContactPage} />
      <Route path="/blogs" component={BlogList} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-and-conditions" component={TermsCondition} />
      <Route path="/refund-policy" component={RefoundPolicy} />
      <Route
          path="/candidate/:id/masked-cv"
          component={CandidateMaskedCV}
      />

      <Route path="/support" component={Support} />
      <Route path="/blogs/:id" component={BlogDetail} />

      <Route path="/lab/:id" component={LabDetail} />
      <Route path="/courses" component={MyFeed} />

      <Route path="/recruiter/test-assignment"><MCQExamPortal /></Route>
      <Route path="/admin-test-assignment" component={MCQAdminPanel}/>


      <Route path="/recruiter/add">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <RecruiterAddCandidate />
        </ProtectedRoute>
      </Route>
      <Route path="/join/:learningPathId">
        <JoinLearningPath />
      </Route>
      <Route path="/recruiter/learning-path">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <LearningPath />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter/learning-path-list">
        <ProtectedRoute roles={["recruiter","admin"]}>
          <LearningPathList  />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter/learning-path-manage/:id">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <LearningPathManage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/recruiter/learning-path-manage-view/:id">
          <LearningPathStudentViewManage />
      </Route>
      
      <Route path="/admin/permissons">
        <ProtectedRoute roles={["admin"]}>
          <UserPermissions />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/candidates">
        <ProtectedRoute roles={["admin"]}>
          <UserPermissions showCandidates />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter/learning-student-path-list">
          <LearningStudentPathList  />
      </Route>
       <Route path="/recruiter/live-session">
        {/* <ProtectedRoute roles={["candidate"]}> */}
          <LiveSessionCourses  />
        {/* </ProtectedRoute> */}
      </Route>
      <Route path="/recruiter/student-live-session">
        {/* <ProtectedRoute roles={["candidate"]}> */}
          <LearningPathStudent  />
        {/* </ProtectedRoute> */}
      </Route>
      <Route path="/payment/:paymentId">
        {/* <ProtectedRoute roles={["candidate"]}> */}
          <PaymentPage  />
        {/* </ProtectedRoute> */}
      </Route>
      <Route
          path="payment-success/:paymentId"
        >
          <PaymentSuccess />
        </Route>
       <Route path="/admin/blog/add">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <BlogAdd />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter/course/add">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <CreateCourse />
        </ProtectedRoute>
      </Route>
      {/* <Route path="/recruiter/course/details/:id">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <VideoPlayer />
        </ProtectedRoute>
      </Route> */}
      {/* <Route path="/course/details/:id" component={VideoPlayer} /> */}
      <Route path="/course/details/:id" component={CoursePlayer} />
      <Route path="/recruiter/course/edit/:id">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <EditCoursePage />
        </ProtectedRoute>
      </Route>
       <Route path="/recruiter/courses">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <CourseManagementPage />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter/categories">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <CourseCategoryManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <RecruiterDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter-history">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <RecruiterHistoryDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute roles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/training">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <TrainingDashboard />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
          <SonnerToaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
