import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";
import { ApiError } from "@workspace/api-client-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { user, login, isLoading } = useAuth(); // Add user and isLoading from useAuth
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!isLoading && user) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      if (redirect) {
        window.location.href = redirect;
        return;
      }

      const role = user.role;
      if (role === "admin") {
        window.location.href = "/admin";
      } else if (role === "recruiter") {
        window.location.href = "/recruiter";
      } else if (role === "candidate" && user.candidateId) {
        window.location.href = `/candidate/${user.candidateId}/evaluation`;
      } else {
        window.location.href = "/";
      }
    }
  }, [user, isLoading]);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);

    try {
      const session = await login(values);

      toast({
        title: "Welcome back",
        description: `Signed in as ${session.user.email}`,
      });

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      if (redirect) {
        window.location.href = redirect;
        return;
      } else {
        const role = session.user.role;
        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "recruiter") {
          window.location.href = "/recruiter";
        } else if (role === "candidate" && session.user.candidateId) {
          window.location.href = `/candidate/${session.user.candidateId}/evaluation`;
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      const message =
        err instanceof ApiError &&
          typeof err.data === "object" &&
          err.data &&
          "message" in err.data
          ? String((err.data as { message?: string }).message)
          : "Invalid email or password";

      toast({
        title: "Sign-in failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Shell>
        <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50">
          <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6 flex justify-center">
              <Loader2 className="size-8 animate-spin text-[#1652A0]" />
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  // If user is already authenticated, don't show login form (redirect handled by useEffect)
  if (user) {
    return null;
  }

  return (
    <Shell>
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50">
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-[#1652A0] text-white p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg text-white">ORN</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-semibold">AI</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Sign in to ORN-AI</CardTitle>
            <CardDescription className="text-slate-300 text-sm">Access your ORN-AI workspace and talent platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          data-testid="input-login-email"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#1652A0] focus:ring-2 focus:ring-[#1652A0]/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="At least 8 characters"
                          data-testid="input-login-password"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#1652A0] focus:ring-2 focus:ring-[#1652A0]/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full gap-2 bg-[#1652A0] hover:bg-[#124282] text-white font-semibold py-2.5 rounded-lg shadow-sm transition-colors"
                  disabled={submitting}
                  data-testid="button-login-submit"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
                  Sign in
                </Button>
                <p className="text-sm text-gray-600 text-center pt-2">
                  No account yet?{" "}
                  <Link href="/register" className="text-[#1652A0] hover:underline font-semibold">
                    Join the talent pool
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}