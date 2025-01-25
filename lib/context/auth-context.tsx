"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      const { getAuth } = await import("firebase/auth");
      const { app } = await import("@/lib/firebase/firebase");
      const authInstance = getAuth(app);
      setAuth(authInstance);

      return authInstance.onAuthStateChanged(async (user) => {
        setUser(user);
        setLoading(false);

        if (user) {
          const idToken = await user.getIdToken();
          document.cookie = `auth=${idToken}; path=/`;
          router.push("/dashboard");
        } else {
          document.cookie =
            "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
      });
    };

    initAuth().then((unsubscribe) => {
      return () => unsubscribe();
    });
  }, [router]);

  const signIn = async (email: string, password: string) => {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import(
      "firebase/auth"
    );
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
