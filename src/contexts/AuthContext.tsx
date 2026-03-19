// ─────────────────────────────────────────────────────────────
//  AuthContext — Firebase Authentication + Firestore
//  Fixed: name "User" race condition in signup & login
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, saveUserProfile, FirestoreUser } from "@/lib/firestoreService";

// ── Types ────────────────────────────────────────────────────

export type AppUser = FirestoreUser;

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    department: string;
    year: number;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string; role?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ── Session cache (survives refresh, cleared on tab close) ───
const CACHE_KEY = "gfg_user_cache";

function loadCache(): AppUser | null {
  try {
    const s = sessionStorage.getItem(CACHE_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}
function saveCache(u: AppUser | null) {
  if (u) sessionStorage.setItem(CACHE_KEY, JSON.stringify(u));
  else sessionStorage.removeItem(CACHE_KEY);
}

// ── Helper: best display name from available sources ─────────
function resolveName(
  fbDisplayName: string | null,
  email: string | null,
  firestoreName?: string
): string {
  // Prefer Firestore name if it's real (not the "User" placeholder)
  if (firestoreName && firestoreName !== "User") return firestoreName;
  // Use Firebase Auth display name
  if (fbDisplayName && fbDisplayName.trim()) return fbDisplayName.trim();
  // Derive from email prefix
  if (email) return email.split("@")[0];
  return "User";
}

// ── Provider ─────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(loadCache);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to carry the freshly-built profile from signup()
  // so onAuthStateChanged can use it instead of the stale Firebase state
  const pendingProfileRef = useRef<AppUser | null>(null);

  // ── Listen to Firebase Auth state ──────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        setUser(null);
        saveCache(null);
        setIsLoading(false);
        return;
      }

      // ── If signup() already built the profile, use it directly ──
      if (pendingProfileRef.current && pendingProfileRef.current.uid === fbUser.uid) {
        const profile = pendingProfileRef.current;
        pendingProfileRef.current = null;
        setUser(profile);
        saveCache(profile);
        setIsLoading(false);
        return;
      }

      // ── Otherwise, fetch from Firestore ─────────────────────
      try {
        const profile = await getUserProfile(fbUser.uid);

        if (profile) {
          // Fix: heal any profile where name is still the "User" placeholder
          const resolvedName = resolveName(fbUser.displayName, fbUser.email, profile.name);
          if (resolvedName !== profile.name) {
            profile.name = resolvedName;
            // Silently fix in Firestore so it doesn't happen again
            await saveUserProfile(fbUser.uid, { name: resolvedName });
          }
          setUser(profile);
          saveCache(profile);
        } else {
          // No Firestore doc yet — create one with the best name we have
          const name = resolveName(fbUser.displayName, fbUser.email);
          const fallback: AppUser = {
            uid: fbUser.uid,
            name,
            email: fbUser.email || "",
            role: "student",
            department: "General",
            year: 1,
            problemsSolved: 0,
            codingPoints: 0,
            codingStreak: 0,
            eventsJoined: 0,
            achievements: [],
            avatar: name[0].toUpperCase(),
          };
          await saveUserProfile(fbUser.uid, fallback);
          setUser(fallback);
          saveCache(fallback);
        }
      } catch {
        // Firestore unavailable — use session cache if uid matches
        const cached = loadCache();
        if (cached && cached.uid === fbUser.uid) setUser(cached);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will call getUserProfile → sets real name
      return { success: true, message: "Logged in successfully!" };
    } catch (err: any) {
      const msg =
        err.code === "auth/user-not-found"         ? "No account found with this email." :
        err.code === "auth/wrong-password"         ? "Incorrect password." :
        err.code === "auth/invalid-credential"     ? "Incorrect email or password." :
        err.code === "auth/too-many-requests"      ? "Too many attempts. Try again later." :
        err.code === "auth/network-request-failed" ? "Network error. Check your connection." :
        "Login failed. Please try again.";
      return { success: false, message: msg };
    }
  };

  // ── Signup ────────────────────────────────────────────────
  const signup = async (data: {
    name: string; email: string; password: string; department: string; year: number;
  }) => {
    try {
      // Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = cred.user.uid;

      // Build the complete profile with the real name
      const profile: AppUser = {
        uid,
        name: data.name.trim(),
        email: data.email,
        role: "student",
        department: data.department,
        year: data.year,
        problemsSolved: 0,
        codingPoints: 0,
        codingStreak: 0,
        eventsJoined: 0,
        achievements: [],
        avatar: data.name.trim()[0].toUpperCase(),
      };

      // Store in the ref BEFORE async calls so onAuthStateChanged
      // (which may have already fired) can see it on next check
      pendingProfileRef.current = profile;

      // Set Firebase Auth display name
      await updateProfile(cred.user, { displayName: data.name.trim() });

      // Save to Firestore
      await saveUserProfile(uid, profile);

      // Directly update state — overrides any "User" that onAuthStateChanged
      // may have already set during the race window
      setUser(profile);
      saveCache(profile);
      pendingProfileRef.current = null;

      return { success: true, message: `Welcome, ${data.name}! Account created.` };
    } catch (err: any) {
      pendingProfileRef.current = null;
      const msg =
        err.code === "auth/email-already-in-use"   ? "An account with this email already exists." :
        err.code === "auth/weak-password"           ? "Password should be at least 6 characters." :
        err.code === "auth/invalid-email"           ? "Invalid email address." :
        err.code === "auth/network-request-failed"  ? "Network error. Check your connection." :
        "Signup failed. Please try again.";
      return { success: false, message: msg };
    }
  };

  // ── Google Sign-In ────────────────────────────────────────
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string; role?: string }> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const uid    = fbUser.uid;

      // Check if Firestore profile already exists
      let profile = await getUserProfile(uid);

      if (!profile) {
        // First-time Google user — create profile with role: "student"
        const name = fbUser.displayName || fbUser.email?.split("@")[0] || "User";
        profile = {
          uid,
          name,
          email: fbUser.email || "",
          role: "student",
          department: "General",
          year: 1,
          problemsSolved: 0,
          codingPoints: 0,
          codingStreak: 0,
          eventsJoined: 0,
          achievements: [],
          avatar: name[0].toUpperCase(),
        };
        await saveUserProfile(uid, profile);
      } else {
        // Heal name if needed
        const resolvedName = resolveName(fbUser.displayName, fbUser.email, profile.name);
        if (resolvedName !== profile.name) {
          profile.name = resolvedName;
          await saveUserProfile(uid, { name: resolvedName });
        }
      }

      // Directly set state — don't wait for onAuthStateChanged
      setUser(profile);
      saveCache(profile);

      return { success: true, message: `Welcome, ${profile.name}!`, role: profile.role };
    } catch (err: any) {
      // User closed popup — not a real error
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        return { success: false, message: "" };
      }
      const msg =
        err.code === "auth/popup-blocked"          ? "Popup was blocked. Please allow popups for this site." :
        err.code === "auth/network-request-failed" ? "Network error. Check your connection." :
        err.code === "auth/unauthorized-domain"    ? "Domain not authorized. Contact the admin." :
        "Google sign-in failed. Please try again.";
      return { success: false, message: msg };
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    saveCache(null);
    pendingProfileRef.current = null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      isLoading,
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
      loginWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
