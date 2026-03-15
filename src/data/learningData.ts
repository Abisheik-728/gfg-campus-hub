import { allCourses } from "./coursesData";
import { additionalCourses } from "./coursesData2";

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  language: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; output: string; hidden?: boolean }[];
  tag?: string;
  constraints?: string[];
  inputFormat?: string;
  outputFormat?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  explanation: string;
  syntax: string;
  exampleCode: string;
  exampleOutput: string;
  practiceProblemIds: string[];
  quiz?: QuizQuestion[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  topics: LearningTopic[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: LearningModule[];
}

// ─── Practice Problems Database ──────────────────────
export const practiceProblems: PracticeProblem[] = [
  {
    id: "p1", title: "Print Numbers 1 to N", difficulty: "Easy", topic: "Loops", language: "Python",
    description: "Write a program that takes an integer N as input and prints all numbers from 1 to N, each on a new line.",
    sampleInput: "5", sampleOutput: "1\n2\n3\n4\n5",
    testCases: [
      { input: "5", output: "1\n2\n3\n4\n5" },
      { input: "3", output: "1\n2\n3", hidden: true },
    ]
  },
  {
    id: "p2", title: "Find Factorial", difficulty: "Medium", topic: "Loops", language: "Python",
    description: "Write a program that calculates the factorial of a given positive integer N.",
    sampleInput: "5", sampleOutput: "120",
    testCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1", hidden: true },
      { input: "6", output: "720", hidden: true },
    ]
  },
  {
    id: "p3", title: "Multiplication Table", difficulty: "Easy", topic: "Loops", language: "Python",
    description: "Print the multiplication table of a given number N up to 10. Format: N x i = result",
    sampleInput: "3",
    sampleOutput: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30",
    testCases: [
      { input: "3", output: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30" }
    ]
  },
  {
    id: "p4", title: "Reverse a String", difficulty: "Easy", topic: "Strings", language: "Python",
    description: "Write a program that takes a string and prints it reversed.",
    sampleInput: "hello", sampleOutput: "olleh",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "Python", output: "nohtyP", hidden: true },
    ]
  },
  {
    id: "p5", title: "Check Palindrome", difficulty: "Easy", topic: "Strings", language: "Python",
    description: "Write a program that checks if a given string is a palindrome (reads the same forwards and backwards).",
    sampleInput: "racecar", sampleOutput: "True",
    testCases: [
      { input: "racecar", output: "True" },
      { input: "hello", output: "False", hidden: true },
    ]
  },
  {
    id: "p6", title: "Sum of Array", difficulty: "Easy", topic: "Arrays", language: "Python",
    description: "Write a program that takes an array of integers and prints their sum.",
    sampleInput: "1 2 3 4 5", sampleOutput: "15",
    testCases: [
      { input: "1 2 3 4 5", output: "15" },
      { input: "10 20 30", output: "60", hidden: true },
    ]
  }
];

// ─── Learning Paths Database (all 10 courses) ────────
export const learningPaths: LearningPath[] = [
  ...allCourses,
  ...additionalCourses,
];

// ─── Progress Tracking & Certificates ────────────────
const PROGRESS_KEY = "gfg_learning_progress";

export interface UserProgress {
  completedTopics: string[];
  enrolledPaths: string[];
}

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  date: string;
  certificateId: string;
}

export function getUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : { completedTopics: [], enrolledPaths: [] };
  } catch {
    return { completedTopics: [], enrolledPaths: [] };
  }
}

export function saveUserProgress(progress: UserProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markTopicComplete(topicId: string) {
  const progress = getUserProgress();
  if (!progress.completedTopics.includes(topicId)) {
    progress.completedTopics.push(topicId);
    saveUserProgress(progress);
  }
}

export function getPathProgress(pathId: string): number {
  const path = learningPaths.find(p => p.id === pathId);
  if (!path) return 0;
  
  const allTopics = path.modules.flatMap(m => m.topics);
  if (allTopics.length === 0) return 0;
  
  const progress = getUserProgress();
  const completedInPath = allTopics.filter(t => progress.completedTopics.includes(t.id)).length;
  
  return Math.round((completedInPath / allTopics.length) * 100);
}

export function getIssuedCertificates(): Certificate[] {
  try {
    const data = localStorage.getItem("gfg_certificates");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function issueCertificate(cert: Certificate) {
  const certs = getIssuedCertificates();
  if (!certs.some(c => c.certificateId === cert.certificateId)) {
    certs.push(cert);
    localStorage.setItem("gfg_certificates", JSON.stringify(certs));
  }
}

export function verifyCertificate(certificateId: string): Certificate | null {
  const certs = getIssuedCertificates();
  return certs.find(c => c.certificateId === certificateId) || null;
}
