import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Register from "@/pages/Register";
import CandidateUpload from "@/pages/CandidateUpload";
import CandidateEvaluation from "@/pages/CandidateEvaluation";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import DemoJourney from "@/pages/DemoJourney";
import TrainingDashboard from "@/pages/TrainingDashboard";
import CandidateTraining from "@/pages/CandidateTraining";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/register" component={Register} />
      <Route path="/candidate/:id/upload" component={CandidateUpload} />
      <Route path="/candidate/:id/evaluation" component={CandidateEvaluation} />
      <Route path="/candidate/:id/training" component={CandidateTraining} />
      <Route path="/recruiter" component={RecruiterDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/training" component={TrainingDashboard} />
      <Route path="/demo" component={DemoJourney} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;