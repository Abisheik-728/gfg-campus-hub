export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  problemsSolved: number;
  codingPoints: number;
  codingStreak: number;
  eventsJoined: number;
  achievements: string[];
  role: "student" | "admin";
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "contest" | "hackathon" | "workshop" | "seminar" | "meetup";
  registrationLink?: string;
  isPast: boolean;
  image?: string;
  capacity: number;
  registeredCount: number;
  organizer: string;
  tags: string[];
  prizeMoney?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
  isPinned: boolean;
  category: "general" | "event" | "result" | "deadline" | "achievement";
  author: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "dsa" | "webdev" | "aiml" | "cp" | "python" | "database" | "devops" | "sysdesign";
  link: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  testCases: { input: string; output: string; hidden?: boolean }[];
  tag?: "daily" | "weekly";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  team: "faculty" | "lead" | "technical" | "event";
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: "ai" | "programming" | "webdev" | "datascience" | "cybersecurity" | "technews" | "event" | "tip" | "internship" | "story";
  tags: string[];
  image?: string;
  status: "published" | "draft";
  updatedAt?: string;
}

// Helper functions to persist registered users in localStorage
const REGISTERED_USERS_KEY = "gfg_registered_users";
const REGISTERED_PASSWORDS_KEY = "gfg_registered_passwords";

export function getRegisteredUsers(): Student[] {
  try {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getRegisteredPasswords(): Record<string, string> {
  try {
    const stored = localStorage.getItem(REGISTERED_PASSWORDS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveRegisteredUser(student: Student, password: string): void {
  const users = getRegisteredUsers();
  // Avoid duplicates
  if (!users.find((u) => u.email === student.email)) {
    users.push(student);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }
  const passwords = getRegisteredPasswords();
  passwords[student.email] = password;
  localStorage.setItem(REGISTERED_PASSWORDS_KEY, JSON.stringify(passwords));
}

const defaultStudents: Student[] = [
  { id: "1", name: "Abisheik", email: "abisheik@gfg.com", department: "CSE", year: 3, problemsSolved: 120, codingPoints: 540, codingStreak: 7, eventsJoined: 3, achievements: ["50 Problems", "Week Streak", "Hackathon Winner"], role: "student", avatar: "A" },
  { id: "2", name: "Priya Sharma", email: "priya@gfg.com", department: "IT", year: 2, problemsSolved: 200, codingPoints: 890, codingStreak: 14, eventsJoined: 5, achievements: ["100 Problems", "Month Streak", "Contest Top 10"], role: "student", avatar: "P" },
  { id: "3", name: "Rahul Verma", email: "rahul@gfg.com", department: "CSE", year: 4, problemsSolved: 310, codingPoints: 1200, codingStreak: 30, eventsJoined: 8, achievements: ["300 Problems", "Month Streak", "Top Coder"], role: "student", avatar: "R" },
  { id: "4", name: "Sneha Patel", email: "sneha@gfg.com", department: "ECE", year: 2, problemsSolved: 95, codingPoints: 420, codingStreak: 5, eventsJoined: 2, achievements: ["50 Problems", "Week Streak"], role: "student", avatar: "S" },
  { id: "5", name: "Arjun Nair", email: "arjun@gfg.com", department: "CSE", year: 3, problemsSolved: 180, codingPoints: 780, codingStreak: 21, eventsJoined: 6, achievements: ["100 Problems", "3-Week Streak", "Workshop Lead"], role: "student", avatar: "A" },
  { id: "6", name: "Kavya Reddy", email: "kavya@gfg.com", department: "IT", year: 1, problemsSolved: 45, codingPoints: 200, codingStreak: 3, eventsJoined: 1, achievements: ["First Problem"], role: "student", avatar: "K" },
  { id: "7", name: "Vikram Singh", email: "vikram@gfg.com", department: "CSE", year: 4, problemsSolved: 250, codingPoints: 1050, codingStreak: 10, eventsJoined: 7, achievements: ["200 Problems", "Contest Winner"], role: "student", avatar: "V" },
  { id: "8", name: "Ananya Gupta", email: "ananya@gfg.com", department: "MECH", year: 2, problemsSolved: 70, codingPoints: 310, codingStreak: 4, eventsJoined: 2, achievements: ["50 Problems"], role: "student", avatar: "A" },
  { id: "admin", name: "Admin", email: "admin@gfgclub.com", department: "Admin", year: 0, problemsSolved: 0, codingPoints: 0, codingStreak: 0, eventsJoined: 0, achievements: [], role: "admin", avatar: "★" },
];

// Merge hardcoded students with any registered users from localStorage
const registeredUsers = getRegisteredUsers();
const mergedEmails = new Set(defaultStudents.map((s) => s.email));
for (const user of registeredUsers) {
  if (!mergedEmails.has(user.email)) {
    defaultStudents.push(user);
    mergedEmails.add(user.email);
  }
}

export const students: Student[] = defaultStudents;

export const events: Event[] = [
  // Upcoming events
  { id: "1", title: "Code Sprint 2026", description: "24-hour competitive coding marathon. Solve algorithmic challenges across 5 difficulty tiers and win exciting prizes! Teams of 1-3 allowed.", date: "2026-04-15", time: "09:00 AM", location: "CS Lab 301", type: "contest", isPast: false, capacity: 200, registeredCount: 143, organizer: "GfG Technical Team", tags: ["DSA", "Algorithms", "Competitive"], prizeMoney: "₹50,000" },
  { id: "2", title: "HackCampus 2026", description: "36-hour hackathon to build innovative solutions for real campus problems. Mentorship from industry experts. Free food & swag!", date: "2026-05-01", time: "06:00 PM", location: "Innovation Center", type: "hackathon", isPast: false, capacity: 150, registeredCount: 98, organizer: "GfG Events Team", tags: ["Hackathon", "Innovation", "Teamwork"], prizeMoney: "₹1,00,000" },
  { id: "3", title: "DSA Workshop Series — Part 3", description: "Learn advanced data structures including Segment Trees, Fenwick Trees, and Tries from FAANG engineers. Hands-on coding sessions included.", date: "2026-04-20", time: "02:00 PM", location: "Seminar Hall B", type: "workshop", isPast: false, capacity: 80, registeredCount: 72, organizer: "Arjun Nair", tags: ["DSA", "Advanced", "Interview Prep"] },
  { id: "4", title: "Web Dev Bootcamp", description: "3-day intensive bootcamp covering React 19, Next.js 15, and cloud deployment with Vercel. Build a full-stack app from scratch!", date: "2026-03-25", time: "10:00 AM", location: "CS Lab 201", type: "workshop", isPast: false, capacity: 60, registeredCount: 55, organizer: "Kavya Reddy", tags: ["React", "Next.js", "Full-Stack"] },
  { id: "5", title: "AI/ML Seminar: LLMs & Beyond", description: "Deep dive into Large Language Models, RAG architectures, and fine-tuning techniques. Guest speaker from Google Research.", date: "2026-04-10", time: "11:00 AM", location: "Main Auditorium", type: "seminar", isPast: false, capacity: 300, registeredCount: 187, organizer: "Prof. Meena Iyer", tags: ["AI", "Machine Learning", "LLM"] },
  { id: "6", title: "Open Source Contribution Day", description: "Learn how to contribute to open source projects. We'll guide you through your first PR on popular GitHub repositories!", date: "2026-04-05", time: "10:00 AM", location: "CS Lab 102", type: "meetup", isPast: false, capacity: 50, registeredCount: 32, organizer: "Vikram Singh", tags: ["Open Source", "Git", "GitHub"] },
  { id: "7", title: "System Design Masterclass", description: "Learn how to design scalable systems like Netflix, Uber, and Instagram. Perfect for placement preparation.", date: "2026-04-25", time: "03:00 PM", location: "Seminar Hall A", type: "seminar", isPast: false, capacity: 120, registeredCount: 89, organizer: "Rahul Verma", tags: ["System Design", "Scalability", "Placements"] },
  { id: "8", title: "Competitive Programming Meetup", description: "Weekly CP practice session. Solve Codeforces Div 2 problems together and discuss optimal approaches.", date: "2026-03-28", time: "05:00 PM", location: "CS Lab 301", type: "meetup", isPast: false, capacity: 40, registeredCount: 28, organizer: "Priya Sharma", tags: ["CP", "Codeforces", "Practice"] },
  // Past events
  { id: "9", title: "Coding Contest #12", description: "Monthly coding contest with problems from easy to hard difficulty. 120 participants competed across 6 problems.", date: "2026-02-10", time: "10:00 AM", location: "Online", type: "contest", isPast: true, capacity: 200, registeredCount: 120, organizer: "GfG Technical Team", tags: ["Contest", "Monthly"] },
  { id: "10", title: "AI/ML Workshop", description: "Introduction to Machine Learning with hands-on projects using scikit-learn and TensorFlow.", date: "2026-01-15", time: "02:00 PM", location: "Seminar Hall A", type: "workshop", isPast: true, capacity: 100, registeredCount: 85, organizer: "Prof. Meena Iyer", tags: ["AI", "ML", "Workshop"] },
  { id: "11", title: "Resume Building Workshop", description: "Craft the perfect tech resume with tips from HR managers at top MNCs.", date: "2026-01-28", time: "11:00 AM", location: "Placement Cell", type: "workshop", isPast: true, capacity: 150, registeredCount: 142, organizer: "Sneha Patel", tags: ["Career", "Resume", "Placements"] },
  { id: "12", title: "HackCampus 2025", description: "The previous edition of our flagship hackathon. 45 teams built amazing projects over 36 hours.", date: "2025-11-15", time: "06:00 PM", location: "Innovation Center", type: "hackathon", isPast: true, capacity: 150, registeredCount: 135, organizer: "GfG Events Team", tags: ["Hackathon", "Innovation"], prizeMoney: "₹75,000" },
];

export const announcements: Announcement[] = [
  { id: "a1", title: "🏆 HackCampus 2026 Registrations Now Open!", content: "The biggest hackathon of the year is here! Register your team of 2-4 members before April 20th. Early bird registrations get exclusive swag kits. Prize pool worth ₹1,00,000!", date: "2026-03-14", priority: "high", isPinned: true, category: "event", author: "GfG Events Team" },
  { id: "a2", title: "📋 Code Sprint 2026 — Rules & Eligibility", content: "All registered students from any department can participate. Teams of 1-3 members allowed. Participants must bring their own laptops. Internet access will be provided. No use of AI tools during the contest.", date: "2026-03-12", priority: "high", isPinned: true, category: "event", author: "GfG Technical Team" },
  { id: "a3", title: "🎉 Coding Contest #12 Results Announced!", content: "Congratulations to all participants! 🥇 Rahul Verma (Score: 580), 🥈 Priya Sharma (Score: 540), 🥉 Arjun Nair (Score: 520). Full results are available on the leaderboard.", date: "2026-02-12", priority: "medium", isPinned: false, category: "result", author: "GfG Technical Team" },
  { id: "a4", title: "⏰ DSA Workshop Series — Registration Deadline Extended", content: "Due to overwhelming demand, we have extended the registration deadline for the DSA Workshop Series Part 3 to April 18th. Only 8 seats remaining!", date: "2026-03-10", priority: "medium", isPinned: false, category: "deadline", author: "Arjun Nair" },
  { id: "a5", title: "🌟 GfG Campus Club Crosses 300+ Active Members!", content: "We're proud to announce that our coding community has grown to 342 active coders! Thank you for being part of this amazing journey. Special shoutout to our top contributors this month.", date: "2026-03-08", priority: "low", isPinned: false, category: "achievement", author: "Rahul Verma" },
  { id: "a6", title: "📢 Venue Change — Web Dev Bootcamp", content: "The Web Dev Bootcamp scheduled for March 25th has been moved from CS Lab 201 to CS Lab 301 due to higher registration numbers. Please take note of the updated venue.", date: "2026-03-13", priority: "medium", isPinned: false, category: "general", author: "Kavya Reddy" },
  { id: "a7", title: "🏅 Priya Sharma Achieves 200 Problems Milestone!", content: "Huge congratulations to Priya Sharma for solving 200+ problems on our platform! She is now the 2nd highest problem solver in our community. Keep inspiring! 🚀", date: "2026-03-06", priority: "low", isPinned: false, category: "achievement", author: "GfG Technical Team" },
];



export const resources: Resource[] = [
  // DSA
  { id: "1", title: "Arrays & Strings Masterclass", description: "Complete guide to array manipulation, two pointers, and sliding window techniques.", category: "dsa", link: "https://www.geeksforgeeks.org/array-data-structure/", difficulty: "beginner" },
  { id: "2", title: "Graph Algorithms Deep Dive", description: "BFS, DFS, Dijkstra, topological sort and more with visual explanations.", category: "dsa", link: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", difficulty: "advanced" },
  { id: "3", title: "Dynamic Programming Patterns", description: "Master the 5 key DP patterns: knapsack, LCS, LIS, matrix chain, and trees.", category: "dsa", link: "https://www.geeksforgeeks.org/dynamic-programming/", difficulty: "intermediate" },
  { id: "11", title: "Linked List Complete Guide", description: "Singly, doubly, and circular linked lists with insertion, deletion, and reversal.", category: "dsa", link: "https://www.geeksforgeeks.org/data-structures/linked-list/", difficulty: "beginner" },
  { id: "12", title: "Tree & Binary Search Tree", description: "Traversals, BST operations, AVL trees, and segment trees explained.", category: "dsa", link: "https://www.geeksforgeeks.org/binary-tree-data-structure/", difficulty: "intermediate" },
  { id: "13", title: "Sorting & Searching Algorithms", description: "Quick sort, merge sort, binary search, and their time complexities.", category: "dsa", link: "https://www.geeksforgeeks.org/sorting-algorithms/", difficulty: "beginner" },
  { id: "14", title: "Stack & Queue Fundamentals", description: "LIFO & FIFO structures, monotonic stacks, deque, and priority queues.", category: "dsa", link: "https://www.geeksforgeeks.org/stack-data-structure/", difficulty: "beginner" },
  { id: "15", title: "Hashing & Hash Maps", description: "Hash functions, collision handling, and solving problems with hash maps.", category: "dsa", link: "https://www.geeksforgeeks.org/hashing-data-structure/", difficulty: "intermediate" },

  // Web Dev
  { id: "4", title: "React Complete Guide", description: "Build modern web apps with React, hooks, context, and routing.", category: "webdev", link: "https://react.dev/learn", difficulty: "beginner" },
  { id: "5", title: "Full-Stack with Node.js", description: "REST APIs, authentication, database integration with Express and MongoDB.", category: "webdev", link: "https://www.geeksforgeeks.org/nodejs/", difficulty: "intermediate" },
  { id: "6", title: "CSS Grid & Flexbox", description: "Master modern CSS layouts with practical examples and projects.", category: "webdev", link: "https://css-tricks.com/snippets/css/complete-guide-grid/", difficulty: "beginner" },
  { id: "16", title: "JavaScript ES6+ Features", description: "Arrow functions, destructuring, promises, async/await, modules, and more.", category: "webdev", link: "https://www.geeksforgeeks.org/introduction-to-es6/", difficulty: "beginner" },
  { id: "17", title: "TypeScript for Beginners", description: "Type safety, interfaces, generics, and integrating TypeScript with React.", category: "webdev", link: "https://www.typescriptlang.org/docs/handbook/intro.html", difficulty: "intermediate" },
  { id: "18", title: "Next.js Full-Stack Framework", description: "Server-side rendering, API routes, static generation, and deployment.", category: "webdev", link: "https://nextjs.org/learn", difficulty: "advanced" },

  // AI / ML
  { id: "7", title: "Intro to Machine Learning", description: "Supervised and unsupervised learning with scikit-learn.", category: "aiml", link: "https://www.geeksforgeeks.org/machine-learning/", difficulty: "beginner" },
  { id: "8", title: "Neural Networks from Scratch", description: "Build neural networks using NumPy, then transition to PyTorch.", category: "aiml", link: "https://pytorch.org/tutorials/beginner/basics/intro.html", difficulty: "advanced" },
  { id: "19", title: "Natural Language Processing", description: "Text processing, tokenization, sentiment analysis, and transformers.", category: "aiml", link: "https://www.geeksforgeeks.org/natural-language-processing-overview/", difficulty: "intermediate" },
  { id: "20", title: "Deep Learning with TensorFlow", description: "CNNs, RNNs, transfer learning, and model deployment with TensorFlow.", category: "aiml", link: "https://www.tensorflow.org/tutorials", difficulty: "advanced" },

  // Competitive Programming
  { id: "9", title: "Competitive Programming Handbook", description: "Essential algorithms, math, and techniques for CP contests.", category: "cp", link: "https://cses.fi/book/book.pdf", difficulty: "intermediate" },
  { id: "10", title: "Codeforces Problem Set", description: "Curated 100 problems from Codeforces rated 800–2000.", category: "cp", link: "https://codeforces.com/problemset", difficulty: "advanced" },
  { id: "21", title: "LeetCode Top Interview 150", description: "Must-do problems covering arrays, trees, graphs, DP, and more for interviews.", category: "cp", link: "https://leetcode.com/studyplan/top-interview-150/", difficulty: "intermediate" },
  { id: "22", title: "CSES Problem Set", description: "300 curated problems ranging from introductory to advanced graph and math.", category: "cp", link: "https://cses.fi/problemset/", difficulty: "advanced" },

  // Python
  { id: "23", title: "Python for Beginners", description: "Variables, loops, functions, OOP, file handling, and error handling in Python.", category: "python", link: "https://www.geeksforgeeks.org/python-programming-language-tutorial/", difficulty: "beginner" },
  { id: "24", title: "Python Data Science Libraries", description: "NumPy, Pandas, Matplotlib — data manipulation and visualization essentials.", category: "python", link: "https://www.geeksforgeeks.org/data-science-with-python-tutorial/", difficulty: "intermediate" },
  { id: "25", title: "Automate with Python", description: "Web scraping, file automation, email bots, and scripting real-world tasks.", category: "python", link: "https://automatetheboringstuff.com/", difficulty: "beginner" },

  // Database
  { id: "26", title: "SQL Fundamentals", description: "SELECT, JOIN, GROUP BY, subqueries, indexing, and database design basics.", category: "database", link: "https://www.geeksforgeeks.org/sql-tutorial/", difficulty: "beginner" },
  { id: "27", title: "MongoDB & NoSQL Guide", description: "Document databases, CRUD operations, aggregation pipelines, and schema design.", category: "database", link: "https://www.geeksforgeeks.org/mongodb-tutorial/", difficulty: "intermediate" },
  { id: "28", title: "Database Management Systems", description: "Normalization, ER diagrams, transactions, ACID properties, and concurrency.", category: "database", link: "https://www.geeksforgeeks.org/dbms/", difficulty: "advanced" },

  // DevOps & Cloud
  { id: "29", title: "Git & GitHub Essentials", description: "Version control, branching, merging, pull requests, and collaboration workflows.", category: "devops", link: "https://www.geeksforgeeks.org/git-tutorial/", difficulty: "beginner" },
  { id: "30", title: "Docker for Developers", description: "Containers, images, Dockerfile, Docker Compose, and deploying applications.", category: "devops", link: "https://docs.docker.com/get-started/", difficulty: "intermediate" },
  { id: "31", title: "Linux Command Line", description: "Essential Linux commands, shell scripting, file permissions, and process management.", category: "devops", link: "https://www.geeksforgeeks.org/linux-tutorial/", difficulty: "beginner" },

  // System Design
  { id: "32", title: "System Design Primer", description: "Scalability, load balancing, caching, database sharding, and microservices.", category: "sysdesign", link: "https://www.geeksforgeeks.org/system-design-tutorial/", difficulty: "advanced" },
  { id: "33", title: "API Design Best Practices", description: "RESTful APIs, GraphQL, authentication, rate limiting, and API versioning.", category: "sysdesign", link: "https://www.geeksforgeeks.org/rest-api-introduction/", difficulty: "intermediate" },
  { id: "34", title: "Object-Oriented Design Patterns", description: "Singleton, Factory, Observer, Strategy, and other essential design patterns.", category: "sysdesign", link: "https://www.geeksforgeeks.org/software-design-patterns/", difficulty: "intermediate" },
];

export const problems: Problem[] = [
  // ─── DAILY PROBLEMS (5) ─────────────────────────────
  {
    id: "d1", title: "Two Sum", difficulty: "Easy", tag: "daily",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    inputFormat: "First line: n (size of array)\nSecond line: n space-separated integers\nThird line: target integer",
    outputFormat: "Two space-separated indices (0-indexed)",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    constraints: "2 ≤ n ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9",
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1" },
      { input: "3\n3 2 4\n6", output: "1 2" },
      { input: "2\n3 3\n6", output: "0 1", hidden: true },
      { input: "4\n1 5 3 7\n8", output: "1 2", hidden: true },
    ],
  },
  {
    id: "d2", title: "Reverse a String", difficulty: "Easy", tag: "daily",
    description: "Write a program that reads a string and prints it reversed.",
    inputFormat: "A single line containing the string",
    outputFormat: "The reversed string",
    sampleInput: "hello",
    sampleOutput: "olleh",
    constraints: "1 ≤ s.length ≤ 10^5",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "world", output: "dlrow" },
      { input: "abcdef", output: "fedcba", hidden: true },
      { input: "racecar", output: "racecar", hidden: true },
    ],
  },
  {
    id: "d3", title: "FizzBuzz", difficulty: "Easy", tag: "daily",
    description: "Given an integer n, print numbers from 1 to n. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', and for both print 'FizzBuzz'.",
    inputFormat: "A single integer n",
    outputFormat: "n lines, each containing the number, Fizz, Buzz, or FizzBuzz",
    sampleInput: "5",
    sampleOutput: "1\n2\nFizz\n4\nBuzz",
    constraints: "1 ≤ n ≤ 10^4",
    testCases: [
      { input: "5", output: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { input: "3", output: "1\n2\nFizz", hidden: true },
      { input: "1", output: "1", hidden: true },
    ],
  },
  {
    id: "d4", title: "Palindrome Check", difficulty: "Easy", tag: "daily",
    description: "Given a string, determine if it is a palindrome. Print 'YES' if it is, 'NO' otherwise. Consider only alphanumeric characters and ignore cases.",
    inputFormat: "A single line containing the string",
    outputFormat: "YES or NO",
    sampleInput: "racecar",
    sampleOutput: "YES",
    constraints: "1 ≤ s.length ≤ 10^5",
    testCases: [
      { input: "racecar", output: "YES" },
      { input: "hello", output: "NO" },
      { input: "madam", output: "YES", hidden: true },
      { input: "abcba", output: "YES", hidden: true },
      { input: "abcde", output: "NO", hidden: true },
    ],
  },
  {
    id: "d5", title: "Sum of Digits", difficulty: "Easy", tag: "daily",
    description: "Given a non-negative integer n, find the sum of its digits.",
    inputFormat: "A single integer n",
    outputFormat: "A single integer — sum of digits",
    sampleInput: "1234",
    sampleOutput: "10",
    constraints: "0 ≤ n ≤ 10^18",
    testCases: [
      { input: "1234", output: "10" },
      { input: "9999", output: "36" },
      { input: "0", output: "0", hidden: true },
      { input: "100", output: "1", hidden: true },
    ],
  },

  // ─── WEEKLY PROBLEMS (35) ───────────────────────────
  {
    id: "w1", title: "Maximum Subarray", difficulty: "Medium", tag: "weekly",
    description: "Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum (Kadane's Algorithm).",
    inputFormat: "First line: n\nSecond line: n space-separated integers",
    outputFormat: "A single integer — the maximum subarray sum",
    sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
    sampleOutput: "6",
    constraints: "1 ≤ n ≤ 10^5\n-10^4 ≤ nums[i] ≤ 10^4",
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "1\n1", output: "1" },
      { input: "5\n-1 -2 -3 -4 -5", output: "-1", hidden: true },
      { input: "3\n5 -2 3", output: "6", hidden: true },
    ],
  },
  {
    id: "w2", title: "Longest Common Subsequence", difficulty: "Hard", tag: "weekly",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    inputFormat: "Two lines, each containing a string",
    outputFormat: "A single integer — length of LCS",
    sampleInput: "abcde\nace",
    sampleOutput: "3",
    constraints: "1 ≤ text1.length, text2.length ≤ 1000",
    testCases: [
      { input: "abcde\nace", output: "3" },
      { input: "abc\ndef", output: "0" },
      { input: "abc\nabc", output: "3", hidden: true },
      { input: "abcba\nabca", output: "4", hidden: true },
    ],
  },
  {
    id: "w3", title: "Binary Search", difficulty: "Easy", tag: "weekly",
    description: "Given a sorted array of n integers and a target value, return the index of target if found, otherwise return -1.",
    inputFormat: "First line: n\nSecond line: n space-separated sorted integers\nThird line: target",
    outputFormat: "Index of target or -1",
    sampleInput: "5\n1 3 5 7 9\n5",
    sampleOutput: "2",
    constraints: "1 ≤ n ≤ 10^5",
    testCases: [
      { input: "5\n1 3 5 7 9\n5", output: "2" },
      { input: "5\n1 3 5 7 9\n6", output: "-1" },
      { input: "1\n5\n5", output: "0", hidden: true },
      { input: "3\n1 2 3\n1", output: "0", hidden: true },
    ],
  },
  {
    id: "w4", title: "Fibonacci Number", difficulty: "Easy", tag: "weekly",
    description: "Given n, return the nth Fibonacci number. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
    inputFormat: "A single integer n",
    outputFormat: "The nth Fibonacci number",
    sampleInput: "10",
    sampleOutput: "55",
    constraints: "0 ≤ n ≤ 45",
    testCases: [
      { input: "10", output: "55" },
      { input: "0", output: "0" },
      { input: "1", output: "1", hidden: true },
      { input: "20", output: "6765", hidden: true },
    ],
  },
  {
    id: "w5", title: "Count Vowels", difficulty: "Easy", tag: "weekly",
    description: "Given a string, count the number of vowels (a, e, i, o, u) in it. Case-insensitive.",
    inputFormat: "A single line containing the string",
    outputFormat: "An integer — count of vowels",
    sampleInput: "Hello World",
    sampleOutput: "3",
    constraints: "1 ≤ s.length ≤ 10^5",
    testCases: [
      { input: "Hello World", output: "3" },
      { input: "aeiou", output: "5" },
      { input: "bcdfg", output: "0", hidden: true },
      { input: "AEIOU", output: "5", hidden: true },
    ],
  },
  {
    id: "w6", title: "Factorial", difficulty: "Easy", tag: "weekly",
    description: "Given a non-negative integer n, compute n! (n factorial).",
    inputFormat: "A single integer n",
    outputFormat: "n! as an integer",
    sampleInput: "5",
    sampleOutput: "120",
    constraints: "0 ≤ n ≤ 20",
    testCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
      { input: "1", output: "1", hidden: true },
      { input: "10", output: "3628800", hidden: true },
    ],
  },
  {
    id: "w7", title: "Prime Number Check", difficulty: "Easy", tag: "weekly",
    description: "Given a number n, determine if it is a prime number. Print 'YES' if prime, 'NO' otherwise.",
    inputFormat: "A single integer n",
    outputFormat: "YES or NO",
    sampleInput: "7",
    sampleOutput: "YES",
    constraints: "1 ≤ n ≤ 10^6",
    testCases: [
      { input: "7", output: "YES" },
      { input: "4", output: "NO" },
      { input: "1", output: "NO", hidden: true },
      { input: "2", output: "YES", hidden: true },
      { input: "97", output: "YES", hidden: true },
    ],
  },
  {
    id: "w8", title: "Array Rotation", difficulty: "Easy", tag: "weekly",
    description: "Given an array of n integers and a number k, rotate the array to the left by k positions. Print the rotated array.",
    inputFormat: "First line: n k\nSecond line: n space-separated integers",
    outputFormat: "The rotated array as space-separated integers",
    sampleInput: "5 2\n1 2 3 4 5",
    sampleOutput: "3 4 5 1 2",
    constraints: "1 ≤ n ≤ 10^5\n0 ≤ k ≤ n",
    testCases: [
      { input: "5 2\n1 2 3 4 5", output: "3 4 5 1 2" },
      { input: "4 1\n10 20 30 40", output: "20 30 40 10" },
      { input: "3 0\n1 2 3", output: "1 2 3", hidden: true },
      { input: "3 3\n1 2 3", output: "1 2 3", hidden: true },
    ],
  },
  {
    id: "w9", title: "Merge Two Sorted Arrays", difficulty: "Easy", tag: "weekly",
    description: "Given two sorted arrays, merge them into a single sorted array.",
    inputFormat: "First line: n m\nSecond line: n sorted integers\nThird line: m sorted integers",
    outputFormat: "Space-separated merged sorted array",
    sampleInput: "3 3\n1 3 5\n2 4 6",
    sampleOutput: "1 2 3 4 5 6",
    constraints: "1 ≤ n, m ≤ 10^4",
    testCases: [
      { input: "3 3\n1 3 5\n2 4 6", output: "1 2 3 4 5 6" },
      { input: "2 3\n1 4\n2 3 5", output: "1 2 3 4 5" },
      { input: "1 1\n1\n2", output: "1 2", hidden: true },
    ],
  },
  {
    id: "w10", title: "GCD of Two Numbers", difficulty: "Easy", tag: "weekly",
    description: "Given two positive integers a and b, find their Greatest Common Divisor (GCD).",
    inputFormat: "Two space-separated integers a and b",
    outputFormat: "A single integer — GCD of a and b",
    sampleInput: "12 8",
    sampleOutput: "4",
    constraints: "1 ≤ a, b ≤ 10^9",
    testCases: [
      { input: "12 8", output: "4" },
      { input: "100 75", output: "25" },
      { input: "7 13", output: "1", hidden: true },
      { input: "6 6", output: "6", hidden: true },
    ],
  },
  {
    id: "w11", title: "Bubble Sort", difficulty: "Easy", tag: "weekly",
    description: "Given an array of n integers, sort the array using bubble sort and print the sorted array.",
    inputFormat: "First line: n\nSecond line: n space-separated integers",
    outputFormat: "Space-separated sorted array",
    sampleInput: "5\n5 3 8 1 2",
    sampleOutput: "1 2 3 5 8",
    constraints: "1 ≤ n ≤ 1000",
    testCases: [
      { input: "5\n5 3 8 1 2", output: "1 2 3 5 8" },
      { input: "3\n3 1 2", output: "1 2 3" },
      { input: "4\n4 3 2 1", output: "1 2 3 4", hidden: true },
    ],
  },
  {
    id: "w12", title: "Matrix Transpose", difficulty: "Easy", tag: "weekly",
    description: "Given a matrix of dimensions n x m, print its transpose.",
    inputFormat: "First line: n m\nNext n lines: m space-separated integers each",
    outputFormat: "m lines, each with n space-separated integers",
    sampleInput: "2 3\n1 2 3\n4 5 6",
    sampleOutput: "1 4\n2 5\n3 6",
    constraints: "1 ≤ n, m ≤ 100",
    testCases: [
      { input: "2 3\n1 2 3\n4 5 6", output: "1 4\n2 5\n3 6" },
      { input: "1 3\n1 2 3", output: "1\n2\n3" },
      { input: "2 2\n1 2\n3 4", output: "1 3\n2 4", hidden: true },
    ],
  },
  {
    id: "w13", title: "Power of Two", difficulty: "Easy", tag: "weekly",
    description: "Given an integer n, determine if it is a power of two. Print 'YES' or 'NO'.",
    inputFormat: "A single integer n",
    outputFormat: "YES or NO",
    sampleInput: "16",
    sampleOutput: "YES",
    constraints: "1 ≤ n ≤ 10^18",
    testCases: [
      { input: "16", output: "YES" },
      { input: "12", output: "NO" },
      { input: "1", output: "YES", hidden: true },
      { input: "1024", output: "YES", hidden: true },
    ],
  },
  {
    id: "w14", title: "Second Largest Element", difficulty: "Easy", tag: "weekly",
    description: "Given an array of n integers, find the second largest element.",
    inputFormat: "First line: n\nSecond line: n space-separated integers",
    outputFormat: "The second largest element",
    sampleInput: "5\n10 20 4 45 99",
    sampleOutput: "45",
    constraints: "2 ≤ n ≤ 10^5",
    testCases: [
      { input: "5\n10 20 4 45 99", output: "45" },
      { input: "3\n5 5 5", output: "5" },
      { input: "4\n1 2 3 4", output: "3", hidden: true },
    ],
  },
  {
    id: "w15", title: "Count Words in String", difficulty: "Easy", tag: "weekly",
    description: "Given a string, count the number of words in it. Words are separated by spaces.",
    inputFormat: "A single line containing the string",
    outputFormat: "An integer — number of words",
    sampleInput: "Hello World from GfG",
    sampleOutput: "4",
    constraints: "1 ≤ s.length ≤ 10^5",
    testCases: [
      { input: "Hello World from GfG", output: "4" },
      { input: "SingleWord", output: "1" },
      { input: "a b c d e", output: "5", hidden: true },
    ],
  },
  {
    id: "w16", title: "Remove Duplicates", difficulty: "Medium", tag: "weekly",
    description: "Given a sorted array of n integers, remove duplicates in-place and print the resulting array.",
    inputFormat: "First line: n\nSecond line: n sorted space-separated integers",
    outputFormat: "Space-separated array without duplicates",
    sampleInput: "7\n1 1 2 2 3 4 4",
    sampleOutput: "1 2 3 4",
    constraints: "1 ≤ n ≤ 10^5",
    testCases: [
      { input: "7\n1 1 2 2 3 4 4", output: "1 2 3 4" },
      { input: "3\n1 1 1", output: "1" },
      { input: "5\n1 2 3 4 5", output: "1 2 3 4 5", hidden: true },
    ],
  },
  {
    id: "w17", title: "Move Zeroes", difficulty: "Medium", tag: "weekly",
    description: "Given an array of n integers, move all zeroes to the end while maintaining the order of non-zero elements.",
    inputFormat: "First line: n\nSecond line: n space-separated integers",
    outputFormat: "Space-separated array with zeroes moved to end",
    sampleInput: "5\n0 1 0 3 12",
    sampleOutput: "1 3 12 0 0",
    constraints: "1 ≤ n ≤ 10^5",
    testCases: [
      { input: "5\n0 1 0 3 12", output: "1 3 12 0 0" },
      { input: "1\n0", output: "0" },
      { input: "4\n1 2 3 4", output: "1 2 3 4", hidden: true },
      { input: "3\n0 0 1", output: "1 0 0", hidden: true },
    ],
  },
  {
    id: "w18", title: "Valid Parentheses", difficulty: "Medium", tag: "weekly",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Print 'YES' or 'NO'.",
    inputFormat: "A single line containing the bracket string",
    outputFormat: "YES or NO",
    sampleInput: "()[]{}", 
    sampleOutput: "YES",
    constraints: "1 ≤ s.length ≤ 10^4",
    testCases: [
      { input: "()[]{}", output: "YES" },
      { input: "(]", output: "NO" },
      { input: "((()))", output: "YES", hidden: true },
      { input: "({[]})", output: "YES", hidden: true },
      { input: "(()", output: "NO", hidden: true },
    ],
  },
  {
    id: "w19", title: "Longest Palindromic Substring", difficulty: "Medium", tag: "weekly",
    description: "Given a string s, return the longest palindromic substring in s.",
    inputFormat: "A single string s",
    outputFormat: "The longest palindromic substring",
    sampleInput: "babad",
    sampleOutput: "bab",
    constraints: "1 ≤ s.length ≤ 1000",
    testCases: [
      { input: "babad", output: "bab" },
      { input: "cbbd", output: "bb" },
      { input: "a", output: "a", hidden: true },
      { input: "racecar", output: "racecar", hidden: true },
    ],
  },
  {
    id: "w20", title: "Climbing Stairs", difficulty: "Medium", tag: "weekly",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    inputFormat: "A single integer n",
    outputFormat: "Number of distinct ways",
    sampleInput: "5",
    sampleOutput: "8",
    constraints: "1 ≤ n ≤ 45",
    testCases: [
      { input: "5", output: "8" },
      { input: "3", output: "3" },
      { input: "1", output: "1", hidden: true },
      { input: "10", output: "89", hidden: true },
    ],
  },
  {
    id: "w21", title: "String Anagram Check", difficulty: "Medium", tag: "weekly",
    description: "Given two strings s and t, determine if t is an anagram of s. Print 'YES' or 'NO'.",
    inputFormat: "Two lines, each containing a string",
    outputFormat: "YES or NO",
    sampleInput: "anagram\nnagaram",
    sampleOutput: "YES",
    constraints: "1 ≤ s.length, t.length ≤ 10^5",
    testCases: [
      { input: "anagram\nnagaram", output: "YES" },
      { input: "rat\ncar", output: "NO" },
      { input: "listen\nsilent", output: "YES", hidden: true },
      { input: "abc\nabcd", output: "NO", hidden: true },
    ],
  },
  {
    id: "w22", title: "Find Missing Number", difficulty: "Medium", tag: "weekly",
    description: "Given an array containing n distinct numbers from 0 to n, find the missing number.",
    inputFormat: "First line: n\nSecond line: n space-separated integers from range [0, n]",
    outputFormat: "The missing number",
    sampleInput: "3\n3 0 1",
    sampleOutput: "2",
    constraints: "1 ≤ n ≤ 10^4",
    testCases: [
      { input: "3\n3 0 1", output: "2" },
      { input: "2\n0 1", output: "2" },
      { input: "1\n0", output: "1", hidden: true },
      { input: "4\n0 1 3 4", output: "2", hidden: true },
    ],
  },
  {
    id: "w23", title: "Product of Array Except Self", difficulty: "Medium", tag: "weekly",
    description: "Given an integer array nums, return an array where each element is the product of all elements except itself. Do not use division.",
    inputFormat: "First line: n\nSecond line: n space-separated integers",
    outputFormat: "Space-separated product array",
    sampleInput: "4\n1 2 3 4",
    sampleOutput: "24 12 8 6",
    constraints: "2 ≤ n ≤ 10^5",
    testCases: [
      { input: "4\n1 2 3 4", output: "24 12 8 6" },
      { input: "3\n2 3 4", output: "12 8 6" },
      { input: "5\n-1 1 0 -3 3", output: "0 0 9 0 0", hidden: true },
    ],
  },
  {
    id: "w24", title: "Container With Most Water", difficulty: "Medium", tag: "weekly",
    description: "Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container that holds the most water.",
    inputFormat: "First line: n\nSecond line: n space-separated heights",
    outputFormat: "Maximum area of water",
    sampleInput: "9\n1 8 6 2 5 4 8 3 7",
    sampleOutput: "49",
    constraints: "2 ≤ n ≤ 10^5",
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49" },
      { input: "2\n1 1", output: "1" },
      { input: "3\n1 2 1", output: "2", hidden: true },
    ],
  },
  {
    id: "w25", title: "3Sum", difficulty: "Medium", tag: "weekly",
    description: "Given an array of n integers, find the count of unique triplets that sum to zero.",
    inputFormat: "First line: n\nSecond line: n space-separated integers",
    outputFormat: "Number of unique triplets summing to 0",
    sampleInput: "6\n-1 0 1 2 -1 -4",
    sampleOutput: "2",
    constraints: "3 ≤ n ≤ 3000",
    testCases: [
      { input: "6\n-1 0 1 2 -1 -4", output: "2" },
      { input: "3\n0 0 0", output: "1" },
      { input: "4\n1 2 -2 -1", output: "0", hidden: true },
    ],
  },
  {
    id: "w26", title: "Rotate Matrix 90°", difficulty: "Medium", tag: "weekly",
    description: "Given an n x n matrix, rotate it 90 degrees clockwise and print the result.",
    inputFormat: "First line: n\nNext n lines: n space-separated integers each",
    outputFormat: "n lines of the rotated matrix",
    sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    sampleOutput: "7 4 1\n8 5 2\n9 6 3",
    constraints: "1 ≤ n ≤ 100",
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3" },
      { input: "2\n1 2\n3 4", output: "3 1\n4 2" },
      { input: "1\n5", output: "5", hidden: true },
    ],
  },
  {
    id: "w27", title: "Linked List Cycle Detection", difficulty: "Medium", tag: "weekly",
    description: "Given an array representing linked list values and a position (0-indexed) where the last node connects to, determine if there is a cycle. Print 'YES' or 'NO'. Position -1 means no cycle.",
    inputFormat: "First line: n pos\nSecond line: n space-separated node values",
    outputFormat: "YES or NO",
    sampleInput: "4 1\n3 2 0 -4",
    sampleOutput: "YES",
    constraints: "1 ≤ n ≤ 10^4\n-1 ≤ pos < n",
    testCases: [
      { input: "4 1\n3 2 0 -4", output: "YES" },
      { input: "3 -1\n1 2 3", output: "NO" },
      { input: "1 -1\n1", output: "NO", hidden: true },
      { input: "2 0\n1 2", output: "YES", hidden: true },
    ],
  },
  {
    id: "w28", title: "Level Order Traversal", difficulty: "Medium", tag: "weekly",
    description: "Given a binary tree represented as an array (using -1 for null), print its level order traversal. Print each level on a new line.",
    inputFormat: "First line: n (number of elements)\nSecond line: n space-separated values (-1 for null)",
    outputFormat: "Level order values, each level on a new line",
    sampleInput: "7\n3 9 20 -1 -1 15 7",
    sampleOutput: "3\n9 20\n15 7",
    constraints: "1 ≤ n ≤ 1000",
    testCases: [
      { input: "7\n3 9 20 -1 -1 15 7", output: "3\n9 20\n15 7" },
      { input: "1\n1", output: "1" },
      { input: "3\n1 2 3", output: "1\n2 3", hidden: true },
    ],
  },
  {
    id: "w29", title: "Topological Sort", difficulty: "Hard", tag: "weekly",
    description: "Given a directed acyclic graph with V vertices and E edges, print a valid topological ordering.",
    inputFormat: "First line: V E\nNext E lines: two integers u v (edge from u to v)",
    outputFormat: "Space-separated topological order",
    sampleInput: "4 4\n0 1\n0 2\n1 3\n2 3",
    sampleOutput: "0 1 2 3",
    constraints: "1 ≤ V ≤ 10^4",
    testCases: [
      { input: "4 4\n0 1\n0 2\n1 3\n2 3", output: "0 1 2 3" },
      { input: "2 1\n0 1", output: "0 1" },
      { input: "3 2\n0 1\n0 2", output: "0 1 2", hidden: true },
    ],
  },
  {
    id: "w30", title: "Dijkstra's Shortest Path", difficulty: "Hard", tag: "weekly",
    description: "Given a weighted directed graph, find the shortest distance from source vertex 0 to all other vertices. Print -1 if unreachable.",
    inputFormat: "First line: V E\nNext E lines: u v w (edge from u to v with weight w)",
    outputFormat: "Space-separated shortest distances from vertex 0",
    sampleInput: "3 3\n0 1 4\n0 2 1\n2 1 2",
    sampleOutput: "0 3 1",
    constraints: "1 ≤ V ≤ 10^4\n0 ≤ w ≤ 10^6",
    testCases: [
      { input: "3 3\n0 1 4\n0 2 1\n2 1 2", output: "0 3 1" },
      { input: "2 1\n0 1 5", output: "0 5" },
      { input: "3 2\n0 1 1\n1 2 2", output: "0 1 3", hidden: true },
    ],
  },
  {
    id: "w31", title: "N-Queens", difficulty: "Hard", tag: "weekly",
    description: "Given an integer n, return the number of distinct solutions to the N-Queens puzzle.",
    inputFormat: "A single integer n",
    outputFormat: "Number of solutions",
    sampleInput: "4",
    sampleOutput: "2",
    constraints: "1 ≤ n ≤ 12",
    testCases: [
      { input: "4", output: "2" },
      { input: "1", output: "1" },
      { input: "8", output: "92", hidden: true },
      { input: "5", output: "10", hidden: true },
    ],
  },
  {
    id: "w32", title: "Coin Change", difficulty: "Hard", tag: "weekly",
    description: "Given an array of coin denominations and a total amount, find the minimum number of coins needed to make that amount. Return -1 if not possible.",
    inputFormat: "First line: n amount\nSecond line: n coin denominations",
    outputFormat: "Minimum number of coins or -1",
    sampleInput: "3 11\n1 5 6",
    sampleOutput: "2",
    constraints: "1 ≤ n ≤ 12\n1 ≤ amount ≤ 10^4",
    testCases: [
      { input: "3 11\n1 5 6", output: "2" },
      { input: "3 3\n2 5 10", output: "-1" },
      { input: "1 0\n1", output: "0", hidden: true },
      { input: "3 6\n1 2 5", output: "2", hidden: true },
    ],
  },
  {
    id: "w33", title: "Word Search in Grid", difficulty: "Hard", tag: "weekly",
    description: "Given an m x n grid of characters and a word, determine if the word exists in the grid. The word can be constructed from sequentially adjacent cells. Print 'YES' or 'NO'.",
    inputFormat: "First line: m n\nNext m lines: n characters each (space-separated)\nLast line: the word",
    outputFormat: "YES or NO",
    sampleInput: "3 4\nA B C E\nS F C S\nA D E E\nABCCED",
    sampleOutput: "YES",
    constraints: "1 ≤ m, n ≤ 200",
    testCases: [
      { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", output: "YES" },
      { input: "3 4\nA B C E\nS F C S\nA D E E\nSEE", output: "YES" },
      { input: "1 1\nA\nB", output: "NO", hidden: true },
    ],
  },
  {
    id: "w34", title: "Edit Distance", difficulty: "Hard", tag: "weekly",
    description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. Allowed operations: insert, delete, replace a character.",
    inputFormat: "Two lines, each containing a string",
    outputFormat: "Minimum number of operations",
    sampleInput: "horse\nros",
    sampleOutput: "3",
    constraints: "0 ≤ word1.length, word2.length ≤ 500",
    testCases: [
      { input: "horse\nros", output: "3" },
      { input: "intention\nexecution", output: "5" },
      { input: "abc\nabc", output: "0", hidden: true },
      { input: "a\nb", output: "1", hidden: true },
    ],
  },
  {
    id: "w35", title: "Median of Two Sorted Arrays", difficulty: "Hard", tag: "weekly",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    inputFormat: "First line: m n\nSecond line: m sorted integers\nThird line: n sorted integers",
    outputFormat: "The median (as a number, use .5 if needed)",
    sampleInput: "2 1\n1 3\n2",
    sampleOutput: "2",
    constraints: "0 ≤ m, n ≤ 10^5",
    testCases: [
      { input: "2 1\n1 3\n2", output: "2" },
      { input: "2 2\n1 2\n3 4", output: "2.5" },
      { input: "1 1\n1\n2", output: "1.5", hidden: true },
      { input: "3 3\n1 3 5\n2 4 6", output: "3.5", hidden: true },
    ],
  },
];

export const teamMembers: TeamMember[] = [
  { id: "1", name: "Dr. Ramesh Kumar", role: "Faculty Coordinator", team: "faculty", image: "" },
  { id: "2", name: "Prof. Meena Iyer", role: "Faculty Advisor", team: "faculty", image: "" },
  { id: "3", name: "Rahul Verma", role: "Club Lead", team: "lead", image: "" },
  { id: "4", name: "Priya Sharma", role: "Vice Lead", team: "lead", image: "" },
  { id: "5", name: "Arjun Nair", role: "Tech Lead", team: "technical", image: "" },
  { id: "6", name: "Vikram Singh", role: "Backend Developer", team: "technical", image: "" },
  { id: "7", name: "Kavya Reddy", role: "Frontend Developer", team: "technical", image: "" },
  { id: "8", name: "Sneha Patel", role: "Event Coordinator", team: "event", image: "" },
  { id: "9", name: "Ananya Gupta", role: "Social Media Manager", team: "event", image: "" },
];

export { getPublishedBlogs as getBlogPosts, getAdminBlogs, saveAdminBlogs, defaultBlogPosts } from "./blogData";
import { getPublishedBlogs } from "./blogData";
export const blogPosts: BlogPost[] = getPublishedBlogs();

export const campusStats = {
  totalActiveCoders: 342,
  mostPopularLanguage: "Python",
  weeklyActivity: [
    { day: "Mon", problems: 45 },
    { day: "Tue", problems: 62 },
    { day: "Wed", problems: 38 },
    { day: "Thu", problems: 71 },
    { day: "Fri", problems: 55 },
    { day: "Sat", problems: 89 },
    { day: "Sun", problems: 34 },
  ],
  languageDistribution: [
    { name: "Python", value: 40 },
    { name: "C++", value: 30 },
    { name: "Java", value: 20 },
    { name: "JavaScript", value: 10 },
  ],
};
