import { useState } from "react";
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
  const { login } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
  setSubmitting(true);

  try {
    const session = await login(values);

    toast({
      title: "Welcome back",
      description: `Signed in as ${session.user.email}`,
    });

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

  return (
    <Shell>
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Access your ORN-AI workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          data-testid="input-login-email"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          placeholder="At least 8 characters"
                          data-testid="input-login-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={submitting}
                  data-testid="button-login-submit"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
                  Sign in
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  No account yet?{" "}
                  <Link href="/register" className="text-primary hover:underline">
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
