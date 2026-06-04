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
import RecruiterAddCandidate from "@/pages/RecruiterAddCandidate";
import CoursesAddCandidate from "@/pages/CreateCourseForm";
import EditCourseForm from "@/pages/EditCourseForm";
import VideoPlayer from "@/pages/VideoPlayer";
import CoursePlayer from "./pages/CoursePlayer/CoursePlayer";
import LabDetail from "./pages/LabDetail";
import CourseManagementPage from "@/pages/CourseManagementPage";
import MyFeed from "@/pages/MyFeed";


import AdminDashboard from "@/pages/AdminDashboard";
import TrainingDashboard from "@/pages/TrainingDashboard";
import CandidateTraining from "@/pages/CandidateTraining";
import Pricing from "@/pages/Pricing";
import DataScientce from "@/pages/Data";
import Advancedprograms from "@/pages/Advancedprograms";
import BusinessDataAnalytics from "@/pages/BusinessDataAnalytics";
import TechnologyPrograms from "@/pages/TechnologyPrograms";
import ScienceProgramsD from "@/pages/ScienceProgramsD";


import { Loader2 } from "lucide-react";

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
      <Route path="/register" component={Register} />
      <Route path="/candidate/:id/upload" component={CandidateUpload} />
      <Route path="/candidate/:id/evaluation" component={CandidateEvaluation} />
      <Route path="/candidate/:id/training" component={CandidateTraining} />
      <Route path="/cyber-security" component={Pricing} />
      <Route path="/data-science-ai" component={DataScientce} />
      <Route path="/advanced-programs" component={Advancedprograms} />
      <Route path="/business-analytics" component={BusinessDataAnalytics} />
      <Route path="/technology-programs" component={TechnologyPrograms} />
      <Route path="/science-programs" component={ScienceProgramsD} />
      <Route path="/lab/:id" component={LabDetail} />
      <Route path="/courses" component={MyFeed} />
      <Route path="/recruiter/add">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <RecruiterAddCandidate />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter/course/add">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <CoursesAddCandidate />
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
          <EditCourseForm />
        </ProtectedRoute>
      </Route>
       <Route path="/recruiter/courses">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <CourseManagementPage />
        </ProtectedRoute>
      </Route>
      <Route path="/recruiter">
        <ProtectedRoute roles={["recruiter", "admin"]}>
          <RecruiterDashboard />
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
