// import { createContext, useContext, useMemo, type ReactNode } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import {
//   useAuthMe,
//   getAuthMeQueryKey,
//   useAuthLogin,
//   useAuthRegister,
//   useAuthLogout,
// } from "@workspace/api-client-react";
// import type {
//   AuthSession,
//   AuthUser,
//   AuthRegisterRequest,
// } from "@workspace/api-client-react";

// interface AuthContextValue {
//   user: AuthUser | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (input: { email: string; password: string }) => Promise<AuthSession>;
//   register: (input: AuthRegisterRequest) => Promise<AuthSession>;
//   logout: () => Promise<void>;
//   refresh: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const queryClient = useQueryClient();
//   const meQuery = useAuthMe({
//     query: {
//       queryKey: getAuthMeQueryKey(),
//       retry: false,
//       staleTime: 30_000,
//     },
//   });

//   const loginMutation = useAuthLogin();
//   const registerMutation = useAuthRegister();
//   const logoutMutation = useAuthLogout();

//   const user: AuthUser | null = meQuery.data ?? null;

//   const value = useMemo<AuthContextValue>(
//     () => ({
//       user,
//       isLoading: meQuery.isLoading,
//       isAuthenticated: !!user,
//       login: async (input) => {
//         const result = await loginMutation.mutateAsync({ data: input });
//         await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
//         return result;
//       },
//       register: async (input) => {
//         const result = await registerMutation.mutateAsync({ data: input });
//         await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
//         return result;
//       },
//       logout: async () => {
//         await logoutMutation.mutateAsync();
//         queryClient.setQueryData(getAuthMeQueryKey(), null);
//         await queryClient.invalidateQueries();
//       },
//       refresh: async () => {
//         await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
//       },
//     }),
//     [user, meQuery.isLoading, loginMutation, registerMutation, logoutMutation, queryClient],
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth(): AuthContextValue {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside <AuthProvider>");
//   }
//   return ctx;
// }



import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
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

  // 🟢 FIX 1: Ek local state rakho jo turant render ho sake
  // 🟢 FIX 1: Ek local state rakho jo turant render ho sake
  const [storedUser, setStoredUser] = useState<AuthUser | null>(() => {
    // Pehle localStorage check karo (taaki page load par turant data mil jaye)
    const saved = localStorage.getItem("user");

    // 🟢 SAFE FIX: Agar saved null hai, ya "undefined" string hai, toh null return karo aur clean karo
    if (!saved || saved === "undefined" || saved === "null") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      // Agar corrupt data hai toh use delete kar do
      console.warn("Corrupt user data cleared from localStorage", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  });

  // API se data fetch karo (Background mein)
  const meQuery = useAuthMe({
    query: {
      queryKey: getAuthMeQueryKey(),
      retry: false,
      staleTime: 30_000,
      // 🟢 FIX 2: Agar API response aata hai, toh usko localStorage mein sync karo
      onSuccess: (data) => {
        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          setStoredUser(data);
        } else {
          localStorage.removeItem("user");
          setStoredUser(null);
        }
      },
      onError: () => {
        // Agar API fail ho jaaye, toh localStorage se data utha lo (fallback)
        const saved = localStorage.getItem("user");
        if (saved) {
          setStoredUser(JSON.parse(saved));
        }
      }
    },
  });

  const loginMutation = useAuthLogin();
  const registerMutation = useAuthRegister();
  const logoutMutation = useAuthLogout();

  // 🟢 FIX 3: Agar API loading hai, lekin localStorage mein user hai, toh woh user dikhao
  const user: AuthUser | null = meQuery.data ?? storedUser;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      // 🟢 FIX 4: Agar localStorage mein user hai, toh jaldi loading false karo
      isLoading: meQuery.isLoading && !storedUser,
      isAuthenticated: !!user,

      login: async (input) => {
        const result = await loginMutation.mutateAsync({ data: input });

        // 🟢 FIX 5: Login ke turant baad localStorage mein save karo
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token); // Agar token backend se aata hai
        setStoredUser(result.user);

        // Backend cache update karo
        queryClient.setQueryData(getAuthMeQueryKey(), result.user);
        return result;
      },

      register: async (input) => {
        const result = await registerMutation.mutateAsync({ data: input });
        // Register ke baad bhi agar auto-login hota hai toh save karo:
        localStorage.setItem("user", JSON.stringify(result.user));
        if (result.token) localStorage.setItem("token", result.token);
        setStoredUser(result.user);
        queryClient.setQueryData(getAuthMeQueryKey(), result.user);
        return result;
      },

      // AuthContext.tsx ke andar logout function

      logout: async () => {
        try {
          // Pehle backend ko logout attempt bhejo (Fail ho sakta hai)
          await logoutMutation.mutateAsync();
        } catch (error) {
          // 🟢 Isko ignore kar do! Agar backend fail bhi hua, toh humein local session saaf karna hai.
          console.warn("Logout API failed, but clearing local session anyway:", error);
        } finally {
          // 🟢 HAMESHA (Chahe API pass ho ya fail) Local Storage aur React State saaf karo.
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setStoredUser(null);
          queryClient.setQueryData(getAuthMeQueryKey(), null);
          await queryClient.invalidateQueries();

          // 🟢 Add: Logout ke baad turant login page par bhejo
          window.location.href = "/login";
        }
      },

      refresh: async () => {
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
      },
    }),
    [user, meQuery.isLoading, storedUser, loginMutation, registerMutation, logoutMutation, queryClient],
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
