import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Student, students as mockStudents, saveRegisteredUser, getRegisteredPasswords } from "@/data/mockData";

const SESSION_KEY = "gfg_current_user";

interface AuthContextType {
  user: Student | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  loginWithGoogle: (userData: { email: string, name: string, picture: string }) => void;
  signup: (data: { name: string; email: string; department: string; year: number; password: string }) => { success: boolean; message: string };
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Load persisted user session from localStorage
function loadSession(): Student | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const parsed: Student = JSON.parse(stored);
    // Verify the user still exists in the students array
    const found = mockStudents.find((s) => s.email === parsed.email);
    return found || null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Student | null>(() => loadSession());

  // Persist user session whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const login = (email: string, password: string) => {
    // Admin login
    if (email === "admin@gfgclub.com" && password === "admin123") {
      const admin = mockStudents.find((s) => s.role === "admin")!;
      setUser(admin);
      return { success: true, message: "Welcome, Admin!" };
    }

    // Check if this is a registered user (signed up via the app)
    const registeredPasswords = getRegisteredPasswords();
    if (registeredPasswords[email]) {
      if (registeredPasswords[email] === password) {
        const student = mockStudents.find((s) => s.email === email && s.role === "student");
        if (student) {
          setUser(student);
          return { success: true, message: `Welcome, ${student.name}!` };
        }
      }
      return { success: false, message: "Incorrect email or password" };
    }

    // Fallback: mock students can log in with any password
    const student = mockStudents.find((s) => s.email === email && s.role === "student");
    if (student) {
      setUser(student);
      return { success: true, message: `Welcome, ${student.name}!` };
    }

    return { success: false, message: "Incorrect email or password" };
  };

  const loginWithGoogle = (userData: { email: string, name: string, picture: string }) => {
    // Check if user exists
    let student = mockStudents.find((s) => s.email === userData.email);
    
    // Auto-signup if not found
    if (!student) {
      student = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        department: "General", // Default for Google Sign In
        year: 1, // Default
        problemsSolved: 0,
        codingPoints: 0,
        codingStreak: 0,
        eventsJoined: 0,
        achievements: [],
        role: "student",
        avatar: userData.name[0].toUpperCase(),
      };
      // Add to in-memory array
      mockStudents.push(student);
      // Persist them with a dummy password since they use Google
      saveRegisteredUser(student, "google-auth-auto-generated"); 
    }
    
    setUser(student);
  };

  const signup = (data: { name: string; email: string; department: string; year: number; password: string }) => {
    if (mockStudents.find((s) => s.email === data.email)) {
      return { success: false, message: "Email already registered" };
    }
    const newStudent: Student = {
      id: String(Date.now()), // Use timestamp for unique IDs
      name: data.name,
      email: data.email,
      department: data.department,
      year: data.year,
      problemsSolved: 0,
      codingPoints: 0,
      codingStreak: 0,
      eventsJoined: 0,
      achievements: [],
      role: "student",
      avatar: data.name[0].toUpperCase(),
    };
    // Add to in-memory array
    mockStudents.push(newStudent);
    // Persist to localStorage so it survives refresh
    saveRegisteredUser(newStudent, data.password);
    setUser(newStudent);
    return { success: true, message: "Account created successfully!" };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};
