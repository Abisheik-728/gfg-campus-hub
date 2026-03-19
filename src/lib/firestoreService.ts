// ─────────────────────────────────────────────────────────────
//  Firestore Service Layer
//  All reads/writes to Firebase go through here.
// ─────────────────────────────────────────────────────────────

import {
  doc, getDoc, setDoc, collection,
  getDocs, addDoc, deleteDoc, updateDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Types ────────────────────────────────────────────────────

export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  role: "student" | "admin";
  department: string;
  year: number;
  problemsSolved: number;
  codingPoints: number;
  codingStreak: number;
  eventsJoined: number;
  achievements: string[];
  avatar: string;
  createdAt?: Timestamp;
}

export interface FSEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "contest" | "hackathon" | "workshop" | "seminar" | "meetup";
  capacity: number;
  registeredCount: number;
  organizer: string;
  tags: string[];
  prizeMoney?: string;
  isPast: boolean;
  createdAt?: Timestamp;
}

export interface FSProblem {
  id?: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  createdAt?: Timestamp;
}

// ── User / Auth ──────────────────────────────────────────────

/** Create or update a user profile in Firestore */
export async function saveUserProfile(uid: string, data: Partial<FirestoreUser>): Promise<void> {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

/** Fetch a user profile by UID */
export async function getUserProfile(uid: string): Promise<FirestoreUser | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return { uid, ...snap.data() } as FirestoreUser;
  } catch {
    return null;
  }
}

/** Fetch all students from Firestore */
export async function getAllStudents(): Promise<FirestoreUser[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs
      .map(d => ({ uid: d.id, ...d.data() } as FirestoreUser))
      .filter(u => u.role === "student");
  } catch {
    return [];
  }
}

// ── Events ───────────────────────────────────────────────────

export async function getEvents(): Promise<FSEvent[]> {
  try {
    const snap = await getDocs(query(collection(db, "events"), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FSEvent));
  } catch {
    return [];
  }
}

export async function createEvent(data: Omit<FSEvent, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "events"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, "events", id));
}

// ── Problems ─────────────────────────────────────────────────

export async function getProblems(): Promise<FSProblem[]> {
  try {
    const snap = await getDocs(query(collection(db, "problems"), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FSProblem));
  } catch {
    return [];
  }
}

export async function createProblem(data: Omit<FSProblem, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "problems"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteProblem(id: string): Promise<void> {
  await deleteDoc(doc(db, "problems", id));
}

// ── Admin: Add a student account entry ───────────────────────

export async function adminAddStudent(data: Omit<FirestoreUser, "uid" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "users"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function adminDeleteStudent(uid: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid));
}
