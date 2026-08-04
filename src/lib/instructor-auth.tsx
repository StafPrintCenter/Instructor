import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, CURRENT_INSTRUCTOR_ID, type Instructor } from "@/lib/api";

const STORAGE_KEY = "spc.instructor.session";

interface StoredSession {
  token: string;
  instructor_id: string;
  instructor: Instructor;
}

function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

/** Identité utilisée par les loaders (SSR : instructeur de démonstration). */
export function getSessionInstructorId(): string {
  return readSession()?.instructor_id ?? CURRENT_INSTRUCTOR_ID;
}

interface InstructorAuthValue {
  instructor: Instructor | null;
  instructorId: string;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const InstructorAuthContext = createContext<InstructorAuthValue | null>(null);

export function InstructorAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { instructor, token } = await authApi.login(email, password);
    const next: StoredSession = { token, instructor_id: instructor.id, instructor };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const refresh = useCallback(async () => {
    const current = readSession();
    if (!current) return;
    const instructor = await authApi.me(current.instructor_id);
    const next = { ...current, instructor };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const value = useMemo<InstructorAuthValue>(
    () => ({
      instructor: session?.instructor ?? null,
      instructorId: session?.instructor_id ?? CURRENT_INSTRUCTOR_ID,
      isAuthenticated: !!session,
      isReady,
      login,
      logout,
      refresh,
    }),
    [session, isReady, login, logout, refresh],
  );

  return <InstructorAuthContext.Provider value={value}>{children}</InstructorAuthContext.Provider>;
}

export function useInstructorAuth() {
  const ctx = useContext(InstructorAuthContext);
  if (!ctx) throw new Error("useInstructorAuth doit être utilisé dans InstructorAuthProvider");
  return ctx;
}
