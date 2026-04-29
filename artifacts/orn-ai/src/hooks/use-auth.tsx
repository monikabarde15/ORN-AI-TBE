import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAuthMe,
  getAuthMeQueryKey,
  useAuthLogin,
  useAuthRegister,
  useAuthLogout,
} from "@workspace/api-client-react";
import type {
  AuthSession,
  AuthUser,
  AuthRegisterRequest,
} from "@workspace/api-client-react";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<AuthSession>;
  register: (input: AuthRegisterRequest) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const meQuery = useAuthMe({
    query: {
      queryKey: getAuthMeQueryKey(),
      retry: false,
      staleTime: 30_000,
    },
  });

  const loginMutation = useAuthLogin();
  const registerMutation = useAuthRegister();
  const logoutMutation = useAuthLogout();

  const user: AuthUser | null = meQuery.data ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: meQuery.isLoading,
      isAuthenticated: !!user,
      login: async (input) => {
        const result = await loginMutation.mutateAsync({ data: input });
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
        return result;
      },
      register: async (input) => {
        const result = await registerMutation.mutateAsync({ data: input });
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
        return result;
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
        queryClient.setQueryData(getAuthMeQueryKey(), null);
        await queryClient.invalidateQueries();
      },
      refresh: async () => {
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
      },
    }),
    [user, meQuery.isLoading, loginMutation, registerMutation, logoutMutation, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
