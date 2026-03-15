import type { LearningPath } from "./learningData";

// ─── HTML Course (8 modules) ────────────────────────
const htmlCourse: LearningPath = {
  id: "html", title: "HTML",
  description: "Learn the backbone of the web — structure every page with semantic HTML.",
  icon: "🌐", color: "bg-orange-400/10",
  modules: [
    { id:"html-m1", title:"Module 1 – Introduction to HTML", description:"What is HTML?", topics:[
      { id:"html-t1", title:"HTML Basics", explanation:"HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to define elements like headings, paragraphs, links, and images.", syntax:"<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body></body>\n</html>", exampleCode:'<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body>\n  <h1>Hello, HTML!</h1>\n  <p>This is my first web page.</p>\n</body>\n</html>', exampleOutput:"Renders: Hello, HTML! heading and a paragraph", practiceProblemIds:[], quiz:[{id:"html-q1",question:"HTML stands for?",options:["Hyper Text Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyperlinks Text Mark Language"],correctAnswer:0}] }
    ]},
    { id:"html-m2", title:"Module 2 – Text & Headings", description:"Text formatting", topics:[
      { id:"html-t2", title:"Headings and Paragraphs", explanation:"HTML provides h1-h6 for headings (h1 being largest), p for paragraphs, br for line breaks, hr for horizontal rules. Use strong for bold, em for italic.", syntax:"<h1>Heading</h1>\n<p>Paragraph</p>\n<strong>Bold</strong>", exampleCode:'<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>\n<hr>\n<p>Another section starts here.</p>', exampleOutput:"Renders headings, styled text, and a horizontal line", practiceProblemIds:[] }
    ]},
    { id:"html-m3", title:"Module 3 – Links & Images", description:"Media and navigation", topics:[
      { id:"html-t3", title:"Anchor Tags & Images", explanation:"Use <a> for hyperlinks with href attribute. Use <img> for images with src and alt attributes. Target attribute controls where links open.", syntax:'<a href="url">Link</a>\n<img src="image.jpg" alt="desc">', exampleCode:'<a href="https://google.com" target="_blank">Visit Google</a>\n<br>\n<img src="photo.jpg" alt="A beautiful sunset" width="300">', exampleOutput:"Renders a clickable link and an image", practiceProblemIds:[] }
    ]},
    { id:"html-m4", title:"Module 4 – Lists & Tables", description:"Structured data", topics:[
      { id:"html-t4", title:"Lists and Tables", explanation:"Use <ul> for unordered lists, <ol> for ordered lists, <li> for list items. Tables use <table>, <tr>, <th>, <td> elements.", syntax:"<ul>\n  <li>Item</li>\n</ul>\n<table>\n  <tr><td>Cell</td></tr>\n</table>", exampleCode:'<h3>Shopping List</h3>\n<ul>\n  <li>Milk</li>\n  <li>Eggs</li>\n  <li>Bread</li>\n</ul>\n<h3>Grades</h3>\n<table border="1">\n  <tr><th>Subject</th><th>Grade</th></tr>\n  <tr><td>Math</td><td>A</td></tr>\n  <tr><td>Science</td><td>B+</td></tr>\n</table>', exampleOutput:"Renders a bullet list and a 2-column table", practiceProblemIds:[] }
    ]},
    { id:"html-m5", title:"Module 5 – Forms", description:"User input", topics:[
      { id:"html-t5", title:"HTML Forms", explanation:"Forms collect user input. Key elements: <form>, <input>, <textarea>, <select>, <button>. Input types: text, email, password, number, checkbox, radio.", syntax:'<form action="/submit">\n  <input type="text" name="name">\n  <button type="submit">Send</button>\n</form>', exampleCode:'<form>\n  <label>Name: <input type="text" placeholder="Enter name"></label><br>\n  <label>Email: <input type="email" placeholder="Enter email"></label><br>\n  <label>Message: <textarea rows="3"></textarea></label><br>\n  <button type="submit">Submit</button>\n</form>', exampleOutput:"Renders a form with name, email, message, and submit button", practiceProblemIds:[] }
    ]},
    { id:"html-m6", title:"Module 6 – Semantic HTML", description:"Meaningful markup", topics:[
      { id:"html-t6", title:"Semantic Elements", explanation:"Semantic elements describe their meaning: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>. They improve accessibility and SEO.", syntax:"<header>...</header>\n<nav>...</nav>\n<main>\n  <article>...</article>\n</main>\n<footer>...</footer>", exampleCode:'<header>\n  <h1>My Website</h1>\n  <nav><a href="/">Home</a> | <a href="/about">About</a></nav>\n</header>\n<main>\n  <article>\n    <h2>Blog Post Title</h2>\n    <p>Content goes here...</p>\n  </article>\n</main>\n<footer><p>&copy; 2024 My Website</p></footer>', exampleOutput:"Renders a semantic page layout", practiceProblemIds:[], quiz:[{id:"html-q2",question:"Which is a semantic element?",options:["<div>","<span>","<article>","<b>"],correctAnswer:2}] }
    ]},
    { id:"html-m7", title:"Module 7 – Multimedia", description:"Audio and video", topics:[
      { id:"html-t7", title:"Audio & Video Elements", explanation:"HTML5 introduced <audio> and <video> elements for embedding media without plugins. Use <source> for multiple formats.", syntax:'<video src="video.mp4" controls></video>\n<audio src="audio.mp3" controls></audio>', exampleCode:'<video width="400" controls>\n  <source src="movie.mp4" type="video/mp4">\n  Your browser does not support video.\n</video>\n<br>\n<audio controls>\n  <source src="song.mp3" type="audio/mpeg">\n</audio>', exampleOutput:"Renders video and audio players with controls", practiceProblemIds:[] }
    ]},
    { id:"html-m8", title:"Module 8 – HTML5 APIs", description:"Modern HTML features", topics:[
      { id:"html-t8", title:"Canvas, LocalStorage & More", explanation:"HTML5 APIs: <canvas> for graphics, localStorage for data persistence, Geolocation API, Drag and Drop API. These extend HTML beyond markup.", syntax:'<canvas id="myCanvas" width="200" height="100"></canvas>\nlocalStorage.setItem("key", "value")', exampleCode:'<!-- Canvas Example -->\n<canvas id="myCanvas" width="200" height="100" style="border:1px solid black;"></canvas>\n<script>\n  const ctx = document.getElementById("myCanvas").getContext("2d");\n  ctx.fillStyle = "green";\n  ctx.fillRect(10, 10, 80, 80);\n</script>', exampleOutput:"Renders a canvas with a green rectangle", practiceProblemIds:[] }
    ]}
  ]
};

// ─── CSS Course (8 modules) ─────────────────────────
const cssCourse: LearningPath = {
  id: "css", title: "CSS",
  description: "Style your websites with beautiful layouts, animations, and responsive design.",
  icon: "🎨", color: "bg-purple-500/10",
  modules: [
    { id:"css-m1", title:"Module 1 – CSS Basics", description:"Getting started", topics:[
      { id:"css-t1", title:"Introduction to CSS", explanation:"CSS (Cascading Style Sheets) controls the visual presentation of HTML. Apply styles inline, in <style> tags, or external .css files. Selectors target elements.", syntax:"selector {\n  property: value;\n}", exampleCode:'h1 {\n  color: #2563eb;\n  font-size: 36px;\n  text-align: center;\n}\np {\n  color: #555;\n  line-height: 1.6;\n}', exampleOutput:"Styles headings blue and centered, paragraphs gray with spacing", practiceProblemIds:[] }
    ]},
    { id:"css-m2", title:"Module 2 – Selectors & Specificity", description:"Targeting elements", topics:[
      { id:"css-t2", title:"CSS Selectors", explanation:"Selectors: element (p), class (.name), ID (#name), attribute ([type='text']), pseudo-classes (:hover), pseudo-elements (::before). Specificity determines which styles win.", syntax:".class { }\n#id { }\nelement:hover { }", exampleCode:'.card {\n  background: white;\n  border-radius: 12px;\n  padding: 20px;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 25px rgba(0,0,0,0.15);\n}', exampleOutput:"A card that lifts on hover with shadow", practiceProblemIds:[], quiz:[{id:"css-q1",question:"Which has highest specificity?",options:["Element selector","Class selector","ID selector","Universal selector"],correctAnswer:2}] }
    ]},
    { id:"css-m3", title:"Module 3 – Box Model", description:"Layout fundamentals", topics:[
      { id:"css-t3", title:"Margin, Padding, Border", explanation:"Every element is a box with content, padding, border, and margin. Use box-sizing: border-box to include padding/border in width calculations.", syntax:"box-sizing: border-box;\nmargin: 10px;\npadding: 20px;\nborder: 1px solid #ccc;", exampleCode:'.box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid #22c55e;\n  margin: 16px auto;\n  box-sizing: border-box;\n  background: #f0fdf4;\n  text-align: center;\n}', exampleOutput:"A centered green-bordered box with padding", practiceProblemIds:[] }
    ]},
    { id:"css-m4", title:"Module 4 – Flexbox", description:"1D layout", topics:[
      { id:"css-t4", title:"Flexbox Layout", explanation:"Flexbox is a 1D layout system. Set display: flex on parent. Use justify-content for main axis, align-items for cross axis. flex-wrap, gap, and flex shorthand.", syntax:"display: flex;\njustify-content: center;\nalign-items: center;\ngap: 16px;", exampleCode:'.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  padding: 20px;\n}\n.item {\n  flex: 1;\n  padding: 20px;\n  background: #dbeafe;\n  border-radius: 8px;\n  text-align: center;\n}', exampleOutput:"Three equal-width items spread across a row", practiceProblemIds:[] }
    ]},
    { id:"css-m5", title:"Module 5 – CSS Grid", description:"2D layout", topics:[
      { id:"css-t5", title:"Grid Layout", explanation:"CSS Grid is a 2D layout system. Define rows and columns with grid-template. Place items with grid-column/row. fr units distribute free space.", syntax:"display: grid;\ngrid-template-columns: 1fr 1fr 1fr;\ngap: 20px;", exampleCode:'.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n  padding: 20px;\n}\n.grid-item {\n  background: #fef3c7;\n  padding: 30px;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}', exampleOutput:"A 3-column grid with equal-width items", practiceProblemIds:[] }
    ]},
    { id:"css-m6", title:"Module 6 – Responsive Design", description:"Mobile-first", topics:[
      { id:"css-t6", title:"Media Queries", explanation:"Responsive design adapts layouts to different screen sizes using media queries. Mobile-first: start with small screens, add complexity for larger ones.", syntax:"@media (min-width: 768px) {\n  /* tablet styles */\n}\n@media (min-width: 1024px) {\n  /* desktop styles */\n}", exampleCode:'.container {\n  padding: 16px;\n}\n.grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n}\n@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 1024px) {\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}', exampleOutput:"Grid changes from 1 to 2 to 3 columns as screen widens", practiceProblemIds:[] }
    ]},
    { id:"css-m7", title:"Module 7 – Animations", description:"Motion and effects", topics:[
      { id:"css-t7", title:"Transitions & Keyframes", explanation:"CSS transitions animate property changes smoothly. @keyframes define multi-step animations. Use animation shorthand for duration, timing, and iteration.", syntax:"transition: all 0.3s ease;\n@keyframes name {\n  from { } to { }\n}", exampleCode:'.button {\n  background: #22c55e;\n  color: white;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n.button:hover {\n  transform: scale(1.05);\n  box-shadow: 0 4px 15px rgba(34,197,94,0.4);\n}\n@keyframes pulse {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.5; }\n}', exampleOutput:"A button that scales up and glows on hover", practiceProblemIds:[] }
    ]},
    { id:"css-m8", title:"Module 8 – CSS Variables & Modern CSS", description:"Custom properties", topics:[
      { id:"css-t8", title:"CSS Custom Properties", explanation:"CSS variables (custom properties) enable reusable values. Define with --name, use with var(). Scope to :root for global or any selector for local.", syntax:":root {\n  --primary: #22c55e;\n}\n.el { color: var(--primary); }", exampleCode:':root {\n  --primary: #22c55e;\n  --bg: #f0fdf4;\n  --radius: 12px;\n}\n.card {\n  background: var(--bg);\n  border: 2px solid var(--primary);\n  border-radius: var(--radius);\n  padding: 24px;\n}', exampleOutput:"A card using CSS variables for consistent theming", practiceProblemIds:[], quiz:[{id:"css-q2",question:"How do you access a CSS variable?",options:["use(--name)","var(--name)","get(--name)","$(--name)"],correctAnswer:1}] }
    ]}
  ]
};

// ─── SQL Course (8 modules) ─────────────────────────
const sqlCourse: LearningPath = {
  id: "sql", title: "SQL",
  description: "Master database querying — from basic SELECT to complex JOINs and subqueries.",
  icon: "🗄️", color: "bg-cyan-500/10",
  modules: [
    { id:"sql-m1", title:"Module 1 – Introduction to SQL", description:"Database basics", topics:[
      { id:"sql-t1", title:"What is SQL?", explanation:"SQL (Structured Query Language) is used to manage and query relational databases. It's used with MySQL, PostgreSQL, SQLite, SQL Server, and Oracle.", syntax:"SELECT column FROM table;", exampleCode:'SELECT * FROM students;', exampleOutput:"Returns all rows and columns from the students table", practiceProblemIds:[], quiz:[{id:"sql-q1",question:"SQL stands for?",options:["Simple Query Language","Structured Query Language","Standard Query Logic","Sequential Query Language"],correctAnswer:1}] }
    ]},
    { id:"sql-m2", title:"Module 2 – SELECT & WHERE", description:"Querying data", topics:[
      { id:"sql-t2", title:"Filtering Data", explanation:"SELECT retrieves data. WHERE filters rows based on conditions. Use =, !=, <, >, BETWEEN, LIKE, IN, IS NULL for conditions.", syntax:"SELECT col1, col2\nFROM table\nWHERE condition;", exampleCode:"SELECT name, age, grade\nFROM students\nWHERE age >= 18 AND grade = 'A'\nORDER BY name;", exampleOutput:"Returns students aged 18+ with grade A, sorted by name", practiceProblemIds:[] }
    ]},
    { id:"sql-m3", title:"Module 3 – INSERT, UPDATE, DELETE", description:"Modifying data", topics:[
      { id:"sql-t3", title:"Data Manipulation", explanation:"INSERT adds new rows, UPDATE modifies existing rows, DELETE removes rows. Always use WHERE with UPDATE/DELETE to avoid affecting all rows.", syntax:"INSERT INTO table (cols) VALUES (vals);\nUPDATE table SET col=val WHERE condition;\nDELETE FROM table WHERE condition;", exampleCode:"INSERT INTO students (name, age, grade)\nVALUES ('Alice', 20, 'A');\n\nUPDATE students\nSET grade = 'A+'\nWHERE name = 'Alice';\n\nDELETE FROM students\nWHERE age < 16;", exampleOutput:"Inserts Alice, updates her grade, deletes students under 16", practiceProblemIds:[] }
    ]},
    { id:"sql-m4", title:"Module 4 – JOINs", description:"Combining tables", topics:[
      { id:"sql-t4", title:"INNER, LEFT, RIGHT JOIN", explanation:"JOINs combine rows from two+ tables based on related columns. INNER JOIN returns matching rows. LEFT/RIGHT JOIN includes unmatched rows from one side.", syntax:"SELECT a.col, b.col\nFROM tableA a\nJOIN tableB b ON a.id = b.a_id;", exampleCode:"SELECT s.name, c.course_name, e.grade\nFROM students s\nINNER JOIN enrollments e ON s.id = e.student_id\nINNER JOIN courses c ON e.course_id = c.id\nORDER BY s.name;", exampleOutput:"Returns student names with their courses and grades", practiceProblemIds:[], quiz:[{id:"sql-q2",question:"INNER JOIN returns...",options:["All left rows","All right rows","Only matching rows","All rows from both"],correctAnswer:2}] }
    ]},
    { id:"sql-m5", title:"Module 5 – Aggregate Functions", description:"Summarizing data", topics:[
      { id:"sql-t5", title:"COUNT, SUM, AVG, GROUP BY", explanation:"Aggregate functions: COUNT, SUM, AVG, MIN, MAX. GROUP BY groups rows for aggregation. HAVING filters groups (like WHERE for groups).", syntax:"SELECT col, COUNT(*)\nFROM table\nGROUP BY col\nHAVING COUNT(*) > 5;", exampleCode:"SELECT department, \n       COUNT(*) as total_students,\n       AVG(gpa) as avg_gpa\nFROM students\nGROUP BY department\nHAVING avg_gpa > 3.0\nORDER BY avg_gpa DESC;", exampleOutput:"Returns departments with avg GPA > 3.0, sorted descending", practiceProblemIds:[] }
    ]},
    { id:"sql-m6", title:"Module 6 – Subqueries", description:"Nested queries", topics:[
      { id:"sql-t6", title:"Subqueries & CTEs", explanation:"Subqueries are queries inside queries. Used in WHERE, FROM, or SELECT. CTEs (Common Table Expressions) with WITH are readable alternatives.", syntax:"SELECT * FROM table\nWHERE col IN (SELECT col FROM other_table);\n\nWITH cte AS (\n  SELECT ...\n)\nSELECT * FROM cte;", exampleCode:"WITH top_students AS (\n  SELECT name, gpa\n  FROM students\n  WHERE gpa > (SELECT AVG(gpa) FROM students)\n)\nSELECT * FROM top_students\nORDER BY gpa DESC;", exampleOutput:"Returns students with above-average GPA", practiceProblemIds:[] }
    ]},
    { id:"sql-m7", title:"Module 7 – Table Design", description:"Creating tables", topics:[
      { id:"sql-t7", title:"CREATE TABLE & Constraints", explanation:"CREATE TABLE defines structure. Constraints: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK, DEFAULT. Good schema design prevents data issues.", syntax:"CREATE TABLE name (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);", exampleCode:"CREATE TABLE courses (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  instructor VARCHAR(100),\n  credits INT CHECK (credits > 0),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);", exampleOutput:"Creates a courses table with constraints and auto-increment", practiceProblemIds:[] }
    ]},
    { id:"sql-m8", title:"Module 8 – Indexes & Optimization", description:"Performance tuning", topics:[
      { id:"sql-t8", title:"Indexes & Query Optimization", explanation:"Indexes speed up queries by creating efficient lookup structures. Use EXPLAIN to analyze query plans. Avoid SELECT *, use specific columns.", syntax:"CREATE INDEX idx_name ON table(column);\nEXPLAIN SELECT ...;", exampleCode:"-- Create an index\nCREATE INDEX idx_student_name ON students(name);\n\n-- Optimized query\nSELECT name, gpa\nFROM students\nWHERE name LIKE 'A%'\nORDER BY gpa DESC\nLIMIT 10;", exampleOutput:"Creates an index and runs an optimized query for names starting with A", practiceProblemIds:[] }
    ]}
  ]
};

// ─── DSA Course (10 modules) ────────────────────────
const dsaCourse: LearningPath = {
  id: "dsa", title: "Data Structures & Algorithms",
  description: "Core CS concepts for cracking top tech interviews and competitive programming.",
  icon: "🌳", color: "bg-emerald-500/10",
  modules: [
    { id:"dsa-m1", title:"Module 1 – Arrays", description:"Linear storage", topics:[
      { id:"dsa-t1", title:"Array Operations", explanation:"Arrays store elements contiguously. O(1) access by index, O(n) insert/delete. Common operations: traversal, search, sort, reverse, rotation.", syntax:"int arr[5] = {1,2,3,4,5};\narr[i] // access", exampleCode:'def reverse_array(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n    return arr\n\nprint(reverse_array([1, 2, 3, 4, 5]))', exampleOutput:"[5, 4, 3, 2, 1]", practiceProblemIds:[], quiz:[{id:"dsa-q1",question:"Array access time complexity?",options:["O(n)","O(1)","O(log n)","O(n²)"],correctAnswer:1}] }
    ]},
    { id:"dsa-m2", title:"Module 2 – Strings", description:"Character sequences", topics:[
      { id:"dsa-t2", title:"String Manipulation", explanation:"Strings are sequences of characters. Common problems: palindrome check, anagram detection, substring search, string reversal, character frequency.", syntax:'s = "hello"\ns[::-1]  # reverse\ns.count("l")  # frequency', exampleCode:'def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]\n\nprint(is_palindrome("racecar"))  \nprint(is_palindrome("hello"))', exampleOutput:"True\nFalse", practiceProblemIds:[] }
    ]},
    { id:"dsa-m3", title:"Module 3 – Linked Lists", description:"Pointer-based structure", topics:[
      { id:"dsa-t3", title:"Singly & Doubly Linked Lists", explanation:"Linked lists use nodes with data and pointers. O(1) insert/delete at head. Types: singly, doubly, circular. No random access (O(n)).", syntax:"class Node:\n  def __init__(self, data):\n    self.data = data\n    self.next = None", exampleCode:'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    def append(self, data):\n        node = Node(data)\n        if not self.head:\n            self.head = node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = node\n    def display(self):\n        curr = self.head\n        while curr:\n            print(curr.data, end=" -> ")\n            curr = curr.next\n        print("None")\n\nll = LinkedList()\nll.append(1); ll.append(2); ll.append(3)\nll.display()', exampleOutput:"1 -> 2 -> 3 -> None", practiceProblemIds:[] }
    ]},
    { id:"dsa-m4", title:"Module 4 – Stacks & Queues", description:"LIFO & FIFO", topics:[
      { id:"dsa-t4", title:"Stack and Queue", explanation:"Stack: LIFO (Last In First Out). Queue: FIFO (First In First Out). Stack uses push/pop, Queue uses enqueue/dequeue. Both have O(1) operations.", syntax:"stack.append(x)  # push\nstack.pop()      # pop\nqueue.append(x)  # enqueue\nqueue.popleft()  # dequeue", exampleCode:'from collections import deque\n\n# Stack\nstack = []\nstack.append(1); stack.append(2); stack.append(3)\nprint("Stack pop:", stack.pop())\n\n# Queue\nqueue = deque()\nqueue.append("A"); queue.append("B"); queue.append("C")\nprint("Queue dequeue:", queue.popleft())', exampleOutput:"Stack pop: 3\nQueue dequeue: A", practiceProblemIds:[] }
    ]},
    { id:"dsa-m5", title:"Module 5 – Trees", description:"Hierarchical data", topics:[
      { id:"dsa-t5", title:"Binary Trees & BST", explanation:"Trees have nodes with children. Binary tree: max 2 children. BST: left < root < right. Traversals: inorder, preorder, postorder. Height = O(log n) balanced.", syntax:"class TreeNode:\n  def __init__(self, val):\n    self.val = val\n    self.left = None\n    self.right = None", exampleCode:'class TreeNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = self.right = None\n\ndef inorder(root):\n    if root:\n        inorder(root.left)\n        print(root.val, end=" ")\n        inorder(root.right)\n\nroot = TreeNode(4)\nroot.left = TreeNode(2)\nroot.right = TreeNode(6)\nroot.left.left = TreeNode(1)\nroot.left.right = TreeNode(3)\ninorder(root)', exampleOutput:"1 2 3 4 6", practiceProblemIds:[], quiz:[{id:"dsa-q2",question:"BST inorder traversal gives?",options:["Random order","Sorted order","Reverse order","Level order"],correctAnswer:1}] }
    ]},
    { id:"dsa-m6", title:"Module 6 – Graphs", description:"Networks", topics:[
      { id:"dsa-t6", title:"BFS & DFS", explanation:"Graphs consist of vertices and edges. BFS uses a queue (level-order), DFS uses a stack (depth-first). Used for shortest paths, connectivity, cycle detection.", syntax:"graph = {node: [neighbors]}\n# BFS: queue\n# DFS: recursion/stack", exampleCode:'from collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    result = []\n    while queue:\n        node = queue.popleft()\n        result.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return result\n\ngraph = {0:[1,2], 1:[0,3], 2:[0,3], 3:[1,2]}\nprint("BFS:", bfs(graph, 0))', exampleOutput:"BFS: [0, 1, 2, 3]", practiceProblemIds:[] }
    ]},
    { id:"dsa-m7", title:"Module 7 – Sorting Algorithms", description:"Ordering data", topics:[
      { id:"dsa-t7", title:"Sorting Techniques", explanation:"Common sorts: Bubble O(n²), Selection O(n²), Merge O(n log n), Quick O(n log n) avg. Merge sort is stable, Quick sort is in-place.", syntax:"# Merge Sort: divide and conquer\n# Quick Sort: partition around pivot", exampleCode:'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    result, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            result.append(l[i]); i += 1\n        else:\n            result.append(r[j]); j += 1\n    result.extend(l[i:])\n    result.extend(r[j:])\n    return result\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))', exampleOutput:"[3, 9, 10, 27, 38, 43, 82]", practiceProblemIds:[] }
    ]},
    { id:"dsa-m8", title:"Module 8 – Searching", description:"Finding elements", topics:[
      { id:"dsa-t8", title:"Binary Search", explanation:"Binary search works on sorted arrays. O(log n) time. Compare middle element, eliminate half. Variants: lower bound, upper bound, search in rotated array.", syntax:"def binary_search(arr, target):\n    lo, hi = 0, len(arr)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        ...", exampleCode:'def binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\narr = [2, 5, 8, 12, 16, 23, 38, 56, 72]\nprint("Found at index:", binary_search(arr, 23))', exampleOutput:"Found at index: 5", practiceProblemIds:[] }
    ]},
    { id:"dsa-m9", title:"Module 9 – Dynamic Programming", description:"Optimization", topics:[
      { id:"dsa-t9", title:"DP Fundamentals", explanation:"DP solves problems by breaking them into overlapping subproblems. Use memoization (top-down) or tabulation (bottom-up). Classic: Fibonacci, knapsack, LCS.", syntax:"# Memoization\ndp = {}\ndef solve(n):\n    if n in dp: return dp[n]\n    dp[n] = ...\n    return dp[n]", exampleCode:'def fibonacci(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n    return memo[n]\n\nfor i in range(10):\n    print(fibonacci(i), end=" ")', exampleOutput:"0 1 1 2 3 5 8 13 21 34", practiceProblemIds:[], quiz:[{id:"dsa-q3",question:"DP is useful when subproblems...",options:["Are independent","Overlap","Are unsolvable","Are trivial"],correctAnswer:1}] }
    ]},
    { id:"dsa-m10", title:"Module 10 – Greedy & Backtracking", description:"Algorithmic strategies", topics:[
      { id:"dsa-t10", title:"Greedy & Backtracking", explanation:"Greedy makes locally optimal choices (e.g., activity selection, Huffman coding). Backtracking explores all possibilities and prunes invalid branches (e.g., N-Queens, Sudoku).", syntax:"# Greedy: sort + pick best\n# Backtracking: try, check, undo", exampleCode:'def activity_selection(activities):\n    activities.sort(key=lambda x: x[1])\n    selected = [activities[0]]\n    for i in range(1, len(activities)):\n        if activities[i][0] >= selected[-1][1]:\n            selected.append(activities[i])\n    return selected\n\nacts = [(1,4), (3,5), (0,6), (5,7), (3,9), (5,9), (6,10), (8,11)]\nprint("Selected:", activity_selection(acts))', exampleOutput:"Selected: [(1, 4), (5, 7), (8, 11)]", practiceProblemIds:[] }
    ]}
  ]
};

// ─── Git & GitHub Course (8 modules) ────────────────
const gitCourse: LearningPath = {
  id: "git", title: "Git & GitHub",
  description: "Version control mastery — from commits to pull requests and CI/CD.",
  icon: "🔀", color: "bg-gray-500/10",
  modules: [
    { id:"git-m1", title:"Module 1 – Introduction to Git", description:"Version control basics", topics:[
      { id:"git-t1", title:"What is Git?", explanation:"Git is a distributed version control system. It tracks changes to files, enables collaboration, and maintains history. Created by Linus Torvalds in 2005.", syntax:"git init\ngit status\ngit log", exampleCode:'# Initialize a new repository\ngit init\n\n# Check status\ngit status\n\n# View history\ngit log --oneline', exampleOutput:"Initialized empty Git repository\nOn branch main\nnothing to commit", practiceProblemIds:[], quiz:[{id:"git-q1",question:"Who created Git?",options:["Bill Gates","Linus Torvalds","Mark Zuckerberg","Tim Berners-Lee"],correctAnswer:1}] }
    ]},
    { id:"git-m2", title:"Module 2 – Basic Commands", description:"Add, commit, push", topics:[
      { id:"git-t2", title:"Staging & Committing", explanation:"Three stages: working directory → staging area → repository. Use 'git add' to stage, 'git commit' to save, 'git push' to upload to remote.", syntax:"git add .\ngit commit -m \"message\"\ngit push origin main", exampleCode:'# Stage all changes\ngit add .\n\n# Commit with message\ngit commit -m "Initial commit: add project files"\n\n# Push to remote\ngit push origin main', exampleOutput:"[main abc1234] Initial commit: add project files\n 3 files changed, 150 insertions(+)", practiceProblemIds:[] }
    ]},
    { id:"git-m3", title:"Module 3 – Branching", description:"Parallel development", topics:[
      { id:"git-t3", title:"Branches & Merging", explanation:"Branches allow parallel development. Create feature branches, work independently, then merge back. Git uses pointers (HEAD) to track current branch.", syntax:"git branch feature-name\ngit checkout feature-name\ngit merge feature-name", exampleCode:'# Create and switch to new branch\ngit checkout -b feature/login\n\n# Make changes and commit\ngit add .\ngit commit -m "Add login feature"\n\n# Switch back and merge\ngit checkout main\ngit merge feature/login', exampleOutput:"Switched to new branch 'feature/login'\nMerge made by 'ort' strategy.", practiceProblemIds:[] }
    ]},
    { id:"git-m4", title:"Module 4 – Remote Repositories", description:"GitHub basics", topics:[
      { id:"git-t4", title:"Working with GitHub", explanation:"GitHub hosts Git repositories online. Clone repos, fork for contribution, create pull requests. SSH keys or HTTPS for authentication.", syntax:"git clone url\ngit remote add origin url\ngit pull origin main", exampleCode:'# Clone a repository\ngit clone https://github.com/user/repo.git\n\n# Add remote\ngit remote add origin https://github.com/user/repo.git\n\n# Pull latest changes\ngit pull origin main', exampleOutput:"Cloning into 'repo'...\nAlready up to date.", practiceProblemIds:[] }
    ]},
    { id:"git-m5", title:"Module 5 – Pull Requests", description:"Code review workflow", topics:[
      { id:"git-t5", title:"Creating PRs", explanation:"Pull Requests (PRs) are how you propose changes. Create a branch, push it, open a PR on GitHub. Reviewers can comment, request changes, or approve.", syntax:"# Push branch then open PR on GitHub\ngit push origin feature-branch", exampleCode:'# Push your feature branch\ngit push origin feature/new-header\n\n# On GitHub:\n# 1. Click "Compare & pull request"\n# 2. Add title and description\n# 3. Request reviewers\n# 4. Create pull request', exampleOutput:"Branch pushed. PR created on GitHub for review.", practiceProblemIds:[], quiz:[{id:"git-q2",question:"What is a Pull Request?",options:["Downloading code","Proposing changes for review","Deleting a branch","Reverting commits"],correctAnswer:1}] }
    ]},
    { id:"git-m6", title:"Module 6 – Resolving Conflicts", description:"Merge conflicts", topics:[
      { id:"git-t6", title:"Conflict Resolution", explanation:"Conflicts occur when two branches modify the same lines. Git marks conflicts with <<<<<<<, =======, >>>>>>>. Manually resolve, then stage and commit.", syntax:"<<<<<<< HEAD\nyour changes\n=======\ntheir changes\n>>>>>>> branch", exampleCode:'# When merge has conflicts:\ngit merge feature-branch\n# CONFLICT in file.txt\n\n# Open file, resolve conflicts manually\n# Remove conflict markers\n\n# Stage resolved file\ngit add file.txt\ngit commit -m "Resolve merge conflict"', exampleOutput:"Auto-merging file.txt\nCONFLICT: Merge conflict in file.txt\nResolved and committed.", practiceProblemIds:[] }
    ]},
    { id:"git-m7", title:"Module 7 – Git Advanced", description:"Rebase, stash, tags", topics:[
      { id:"git-t7", title:"Rebase, Stash & Tags", explanation:"Rebase replays commits on top of another branch (linear history). Stash temporarily saves changes. Tags mark release points.", syntax:"git rebase main\ngit stash\ngit stash pop\ngit tag v1.0", exampleCode:'# Stash current changes\ngit stash save "WIP: login page"\n\n# Do other work...\ngit stash pop  # restore changes\n\n# Rebase feature onto main\ngit checkout feature\ngit rebase main\n\n# Tag a release\ngit tag -a v1.0 -m "Version 1.0 release"', exampleOutput:"Saved working directory\nApplied stash\nSuccessfully rebased\nCreated tag 'v1.0'", practiceProblemIds:[] }
    ]},
    { id:"git-m8", title:"Module 8 – GitHub Actions & CI/CD", description:"Automation", topics:[
      { id:"git-t8", title:"GitHub Actions", explanation:"GitHub Actions automate workflows: CI/CD, testing, deployment. Define workflows in .github/workflows/ YAML files. Triggered by events like push or PR.", syntax:"# .github/workflows/ci.yml\nname: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps: ...", exampleCode:'# .github/workflows/ci.yml\nname: CI Pipeline\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\njobs:\n  build-and-test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n      - run: npm install\n      - run: npm test\n      - run: npm run build', exampleOutput:"Workflow triggered on push\n✓ Build successful\n✓ All tests passed", practiceProblemIds:[] }
    ]}
  ]
};

export const additionalCourses: LearningPath[] = [
  htmlCourse, cssCourse, sqlCourse, dsaCourse, gitCourse
];
