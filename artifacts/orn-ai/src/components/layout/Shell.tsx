import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Network, Search, FileText, UserPlus, Presentation, Settings2, BarChart3, Database, GraduationCap } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isDashboard =
    location.startsWith("/recruiter") ||
    location.startsWith("/admin") ||
    location.startsWith("/training") ||
    /^\/candidate\/[^/]+\/training$/.test(location);

  if (isDashboard) {
    return (
      <div className="min-h-[100dvh] flex w-full bg-muted/30">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-background flex flex-col fixed inset-y-0 z-10">
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg">
              <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                <Network className="size-5" />
              </div>
              <span>ORN-AI</span>
            </Link>
          </div>
          
          <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
            <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recruitment
            </div>
            <Link href="/recruiter" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/recruiter" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <Search className="size-4" />
              Talent Search
            </Link>

            <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Career Transformation
            </div>
            <Link
              href="/training"
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location.startsWith("/training") || /^\/candidate\/[^/]+\/training$/.test(location) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              data-testid="link-nav-training"
            >
              <GraduationCap className="size-4" />
              Training Pipeline
            </Link>

            <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Platform
            </div>
            <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${location === "/admin" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <BarChart3 className="size-4" />
              Overview
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed">
              <Database className="size-4" />
              Data Sources
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed">
              <Settings2 className="size-4" />
              Settings
            </div>
          </div>
        </aside>
        
        <main className="flex-1 pl-64 flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  // Public pages (landing, demo, candidate flows)
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <Network className="size-5" />
            </div>
            <span>ORN-AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Platform</Link>
            <Link href="/recruiter" className="text-muted-foreground hover:text-foreground transition-colors">Recruiters</Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/demo" className="hidden sm:inline-flex">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                <Presentation className="size-4" />
                Investor Demo
              </Button>
            </Link>
            <Link href="/register">
              <Button className="gap-2">
                <UserPlus className="size-4" />
                Join Talent Pool
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg mb-4">
                <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                  <Network className="size-5" />
                </div>
                <span>ORN-AI</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-sm">
                Building Eastern & Central Europe's next-generation AI-enabled talent infrastructure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Platform</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/recruiter" className="hover:text-foreground">Recruiter Access</Link></li>
                <li><Link href="/admin" className="hover:text-foreground">Admin Pipeline</Link></li>
                <li><Link href="/demo" className="hover:text-foreground">Investor Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Talent</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-foreground">Join Network</Link></li>
                <li><span className="cursor-not-allowed opacity-50">Evaluation Criteria</span></li>
                <li><span className="cursor-not-allowed opacity-50">Upskilling Partners</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} ORN-AI Infrastructure. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="cursor-not-allowed hover:text-foreground">Privacy</span>
              <span className="cursor-not-allowed hover:text-foreground">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}