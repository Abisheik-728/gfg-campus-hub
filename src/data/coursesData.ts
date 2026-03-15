import type { LearningPath } from "./learningData";

// ─── Python Course (10 modules) ─────────────────────
const pythonCourse: LearningPath = {
  id: "python", title: "Python Programming",
  description: "Learn Python from scratch — perfect for AI, Data Science, and Web Development.",
  icon: "🐍", color: "bg-blue-500/10",
  modules: [
    { id: "py-m1", title: "Module 1 – Introduction to Python", description: "Getting started", topics: [
      { id:"py-t1", title:"What is Python?", explanation:"Python is a high-level, interpreted language known for readability and simplicity. Created by Guido van Rossum in 1991, it supports multiple paradigms including procedural, OOP, and functional programming.", syntax:"print('Hello, World!')", exampleCode:'print("Hello, World!")\nprint("Python is awesome!")', exampleOutput:"Hello, World!\nPython is awesome!", practiceProblemIds:["p1"],
        quiz:[{id:"py-q1",question:"Who created Python?",options:["James Gosling","Guido van Rossum","Dennis Ritchie","Bjarne Stroustrup"],correctAnswer:1},{id:"py-q2",question:"Python is a...",options:["Compiled language","Interpreted language","Assembly language","Machine language"],correctAnswer:1}] },
      { id:"py-t2", title:"Setting up Python", explanation:"Install Python from python.org. Use IDLE, VS Code, or PyCharm as your IDE. Run scripts with 'python filename.py' from the terminal.", syntax:"python --version\npython filename.py", exampleCode:'import sys\nprint("Python version:", sys.version)', exampleOutput:"Python version: 3.10.0", practiceProblemIds:[] }
    ]},
    { id: "py-m2", title: "Module 2 – Variables and Data Types", description: "Understanding data", topics: [
      { id:"py-t3", title:"Variables in Python", explanation:"Variables store data values. Python has no command for declaring a variable — it's created when you assign a value. Variable names are case-sensitive and must start with a letter or underscore.", syntax:"variable_name = value", exampleCode:'name = "Alice"\nage = 20\nheight = 5.6\nis_student = True\nprint(name, "is", age, "years old.")', exampleOutput:"Alice is 20 years old.", practiceProblemIds:[] },
      { id:"py-t4", title:"Data Types", explanation:"Python has several built-in data types: int, float, str, bool, list, tuple, dict, set. Use type() to check.", syntax:"type(variable)", exampleCode:'x = 42\ny = 3.14\nz = "Hello"\nprint(type(x), type(y), type(z))', exampleOutput:"<class 'int'> <class 'float'> <class 'str'>", practiceProblemIds:[],
        quiz:[{id:"py-q3",question:"Which is NOT a Python data type?",options:["int","float","char","bool"],correctAnswer:2}] }
    ]},
    { id: "py-m3", title: "Module 3 – Conditional Statements", description: "Decision making", topics: [
      { id:"py-t5", title:"If-Else Statements", explanation:"Conditional statements let your program make decisions. Python uses if, elif, and else keywords. Indentation is crucial — it defines the code block.", syntax:"if condition:\n    # code\nelif condition:\n    # code\nelse:\n    # code", exampleCode:'score = 85\nif score >= 90:\n    print("Grade A")\nelif score >= 80:\n    print("Grade B")\nelse:\n    print("Grade C")', exampleOutput:"Grade B", practiceProblemIds:[] },
      { id:"py-t6", title:"Nested & Ternary Conditions", explanation:"You can nest if statements inside others. Python also supports ternary (conditional) expressions for one-line conditionals.", syntax:"result = value_if_true if condition else value_if_false", exampleCode:'age = 18\nstatus = "Adult" if age >= 18 else "Minor"\nprint(status)', exampleOutput:"Adult", practiceProblemIds:[] }
    ]},
    { id: "py-m4", title: "Module 4 – Loops", description: "Repetition structures", topics: [
      { id:"py-t7", title:"For and While Loops", explanation:"Loops let you repeat code. 'for' loops iterate over sequences; 'while' loops repeat while a condition is true. Use 'break' to exit and 'continue' to skip iterations.", syntax:"for i in range(n):\n    # code\n\nwhile condition:\n    # code", exampleCode:'for i in range(5):\n    print(i)', exampleOutput:"0\n1\n2\n3\n4", practiceProblemIds:["p1","p2"],
        quiz:[{id:"py-q4",question:"What does range(5) generate?",options:["1 to 5","0 to 5","0 to 4","1 to 4"],correctAnswer:2}] }
    ]},
    { id: "py-m5", title: "Module 5 – Functions", description: "Reusable code blocks", topics: [
      { id:"py-t8", title:"Defining Functions", explanation:"Functions are reusable blocks of code defined with 'def'. They can accept parameters and return values. Functions help organize code and avoid repetition.", syntax:"def function_name(params):\n    # code\n    return value", exampleCode:'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Admin"))', exampleOutput:"Hello, Admin!", practiceProblemIds:[] },
      { id:"py-t9", title:"Lambda & Built-in Functions", explanation:"Lambda functions are small anonymous functions. Python has many built-in functions like len(), max(), min(), sorted(), map(), filter().", syntax:"lambda args: expression", exampleCode:'square = lambda x: x ** 2\nnums = [1, 2, 3, 4, 5]\nsquared = list(map(square, nums))\nprint(squared)', exampleOutput:"[1, 4, 9, 16, 25]", practiceProblemIds:[] }
    ]},
    { id: "py-m6", title: "Module 6 – Lists and Dictionaries", description: "Collection types", topics: [
      { id:"py-t10", title:"Lists", explanation:"Lists are ordered, mutable collections. They can contain mixed types. Common operations: append, insert, remove, pop, sort, reverse, slicing.", syntax:"my_list = [1, 2, 3]\nmy_list.append(4)", exampleCode:'fruits = ["apple", "banana", "cherry"]\nfruits.append("mango")\nprint(fruits)\nprint(fruits[1:3])', exampleOutput:'["apple", "banana", "cherry", "mango"]\n["banana", "cherry"]', practiceProblemIds:[] },
      { id:"py-t11", title:"Dictionaries", explanation:"Dictionaries store key-value pairs. Keys must be unique and immutable. Access values by key, add new pairs, update existing ones.", syntax:'my_dict = {"key": "value"}', exampleCode:'student = {"name": "John", "age": 20, "grade": "A"}\nprint(student["name"])\nstudent["city"] = "Delhi"\nprint(student)', exampleOutput:'John\n{"name": "John", "age": 20, "grade": "A", "city": "Delhi"}', practiceProblemIds:[] }
    ]},
    { id: "py-m7", title: "Module 7 – File Handling", description: "Working with files", topics: [
      { id:"py-t12", title:"Reading and Writing Files", explanation:"Python can read, write, and append to files using the open() function. The 'with' statement ensures proper file handling. Modes: 'r' (read), 'w' (write), 'a' (append).", syntax:"with open('file.txt', 'r') as f:\n    content = f.read()", exampleCode:'# Writing to a file\nwith open("test.txt", "w") as f:\n    f.write("Hello, File!")\n\n# Reading from a file\nwith open("test.txt", "r") as f:\n    print(f.read())', exampleOutput:"Hello, File!", practiceProblemIds:[] }
    ]},
    { id: "py-m8", title: "Module 8 – Exception Handling", description: "Error management", topics: [
      { id:"py-t13", title:"Try-Except Blocks", explanation:"Exceptions are runtime errors. Use try-except blocks to handle them gracefully. You can catch specific exceptions and use finally for cleanup code.", syntax:"try:\n    # code\nexcept ExceptionType:\n    # handler\nfinally:\n    # cleanup", exampleCode:'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\nfinally:\n    print("Execution complete.")', exampleOutput:"Cannot divide by zero!\nExecution complete.", practiceProblemIds:[],
        quiz:[{id:"py-q5",question:"Which block always executes?",options:["try","except","finally","else"],correctAnswer:2}] }
    ]},
    { id: "py-m9", title: "Module 9 – OOP in Python", description: "Object-oriented programming", topics: [
      { id:"py-t14", title:"Classes and Objects", explanation:"OOP organizes code into classes (blueprints) and objects (instances). Classes contain attributes (data) and methods (functions). Python supports inheritance, polymorphism, and encapsulation.", syntax:"class ClassName:\n    def __init__(self):\n        pass", exampleCode:'class Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    def bark(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Buddy", "Labrador")\nprint(dog.bark())', exampleOutput:"Buddy says Woof!", practiceProblemIds:[] }
    ]},
    { id: "py-m10", title: "Module 10 – Mini Project", description: "Build a project", topics: [
      { id:"py-t15", title:"Calculator Project", explanation:"Build a simple calculator that performs basic arithmetic operations. This project combines functions, loops, conditionals, and error handling.", syntax:"# Combine all concepts learned", exampleCode:'def calculator():\n    print("Simple Calculator")\n    a = float(input("Enter first number: "))\n    op = input("Enter operator (+,-,*,/): ")\n    b = float(input("Enter second number: "))\n    if op == "+": print(f"Result: {a + b}")\n    elif op == "-": print(f"Result: {a - b}")\n    elif op == "*": print(f"Result: {a * b}")\n    elif op == "/": print(f"Result: {a / b}" if b != 0 else "Cannot divide by zero")\n    else: print("Invalid operator")\n\nprint("Calculator ready!")', exampleOutput:"Calculator ready!", practiceProblemIds:["p1","p2","p3"] }
    ]}
  ]
};

// ─── Java Course (8 modules) ────────────────────────
const javaCourse: LearningPath = {
  id: "java", title: "Java Programming",
  description: "Master object-oriented programming with Java — the enterprise language.",
  icon: "☕", color: "bg-orange-500/10",
  modules: [
    { id:"j-m1", title:"Module 1 – Introduction to Java", description:"Java basics", topics:[
      { id:"j-t1", title:"Hello Java", explanation:"Java is a class-based, OOP language. Every Java program needs a main method inside a class. Compile with javac, run with java.", syntax:"public class Main {\n  public static void main(String[] args) {}\n}", exampleCode:'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}', exampleOutput:"Hello, Java!", practiceProblemIds:[], quiz:[{id:"j-q1",question:"Java is a...",options:["Functional-only language","Class-based OOP language","Scripting language","Markup language"],correctAnswer:1}] }
    ]},
    { id:"j-m2", title:"Module 2 – Variables & Types", description:"Data types in Java", topics:[
      { id:"j-t2", title:"Primitive Data Types", explanation:"Java has 8 primitive types: byte, short, int, long, float, double, char, boolean. Each has a specific size and range.", syntax:"int x = 10;\ndouble pi = 3.14;\nboolean flag = true;", exampleCode:'public class Main {\n    public static void main(String[] args) {\n        int age = 25;\n        double gpa = 3.8;\n        char grade = \'A\';\n        boolean passed = true;\n        System.out.println("Age: " + age);\n        System.out.println("GPA: " + gpa);\n    }\n}', exampleOutput:"Age: 25\nGPA: 3.8", practiceProblemIds:[] }
    ]},
    { id:"j-m3", title:"Module 3 – Control Flow", description:"Decisions and loops", topics:[
      { id:"j-t3", title:"If-Else & Switch", explanation:"Java uses if-else for decisions and switch for multi-way branching. Curly braces define code blocks.", syntax:"if (condition) {\n  // code\n} else {\n  // code\n}", exampleCode:'public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 90) System.out.println("A");\n        else if (score >= 80) System.out.println("B");\n        else System.out.println("C");\n    }\n}', exampleOutput:"B", practiceProblemIds:[] },
      { id:"j-t4", title:"Loops in Java", explanation:"Java supports for, while, and do-while loops. Enhanced for-each loop is used for collections.", syntax:"for (int i = 0; i < n; i++) {\n  // code\n}", exampleCode:'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n    }\n}', exampleOutput:"Count: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5", practiceProblemIds:[] }
    ]},
    { id:"j-m4", title:"Module 4 – Methods", description:"Functions in Java", topics:[
      { id:"j-t5", title:"Defining Methods", explanation:"Methods are blocks of code that perform specific tasks. They have return types, names, and parameters. Static methods belong to the class, not instances.", syntax:"public static returnType name(params) {\n  return value;\n}", exampleCode:'public class Main {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        System.out.println("Sum: " + add(5, 3));\n    }\n}', exampleOutput:"Sum: 8", practiceProblemIds:[] }
    ]},
    { id:"j-m5", title:"Module 5 – Arrays & Strings", description:"Collections basics", topics:[
      { id:"j-t6", title:"Arrays", explanation:"Arrays are fixed-size, ordered collections of same-type elements. Declare with type[], create with new keyword or initializer.", syntax:"int[] arr = new int[5];\nint[] arr = {1,2,3};", exampleCode:'public class Main {\n    public static void main(String[] args) {\n        int[] nums = {10, 20, 30, 40, 50};\n        for (int n : nums) {\n            System.out.println(n);\n        }\n    }\n}', exampleOutput:"10\n20\n30\n40\n50", practiceProblemIds:[] }
    ]},
    { id:"j-m6", title:"Module 6 – OOP Concepts", description:"Classes, inheritance, polymorphism", topics:[
      { id:"j-t7", title:"Classes and Objects", explanation:"Java is fully OOP. Classes have fields and methods. Objects are instances of classes. Constructors initialize objects.", syntax:"class MyClass {\n  int x;\n  MyClass(int x) { this.x = x; }\n}", exampleCode:'class Car {\n    String brand;\n    Car(String b) { brand = b; }\n    void display() { System.out.println("Car: " + brand); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Car c = new Car("Toyota");\n        c.display();\n    }\n}', exampleOutput:"Car: Toyota", practiceProblemIds:[], quiz:[{id:"j-q2",question:"What keyword creates an object?",options:["class","new","create","init"],correctAnswer:1}] }
    ]},
    { id:"j-m7", title:"Module 7 – Exception Handling", description:"Error management", topics:[
      { id:"j-t8", title:"Try-Catch-Finally", explanation:"Java uses try-catch blocks for exception handling. The finally block executes regardless. Custom exceptions extend Exception class.", syntax:"try {\n  // code\n} catch (Exception e) {\n  // handler\n}", exampleCode:'public class Main {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n        } catch (ArithmeticException e) {\n            System.out.println("Error: " + e.getMessage());\n        }\n    }\n}', exampleOutput:"Error: / by zero", practiceProblemIds:[] }
    ]},
    { id:"j-m8", title:"Module 8 – Collections & Generics", description:"Advanced data structures", topics:[
      { id:"j-t9", title:"ArrayList & HashMap", explanation:"Java Collections Framework provides ArrayList (resizable array), HashMap (key-value store), HashSet (unique elements), and more.", syntax:"ArrayList<String> list = new ArrayList<>();\nHashMap<String, Integer> map = new HashMap<>();", exampleCode:'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        list.add("Java"); list.add("Python");\n        System.out.println(list);\n    }\n}', exampleOutput:"[Java, Python]", practiceProblemIds:[] }
    ]}
  ]
};

// ─── C Programming (8 modules) ──────────────────────
const cCourse: LearningPath = {
  id: "c", title: "C Programming",
  description: "The mother of all languages. Build strong fundamentals with C.",
  icon: "🅲", color: "bg-blue-400/10",
  modules: [
    { id:"c-m1", title:"Module 1 – Introduction to C", description:"C basics", topics:[
      { id:"c-t1", title:"Hello C", explanation:"C is a general-purpose, procedural programming language developed by Dennis Ritchie in 1972. It provides low-level memory access and is the foundation for many modern languages.", syntax:'#include <stdio.h>\nint main() {\n  printf("Hello");\n  return 0;\n}', exampleCode:'#include <stdio.h>\nint main() {\n    printf("Hello, C!\\n");\n    printf("C is powerful!\\n");\n    return 0;\n}', exampleOutput:"Hello, C!\nC is powerful!", practiceProblemIds:[], quiz:[{id:"c-q1",question:"Who developed C?",options:["James Gosling","Dennis Ritchie","Bjarne Stroustrup","Guido van Rossum"],correctAnswer:1}] }
    ]},
    { id:"c-m2", title:"Module 2 – Variables & Data Types", description:"Data in C", topics:[
      { id:"c-t2", title:"C Data Types", explanation:"C has basic types: int, float, double, char. Use sizeof() to check sizes. Variables must be declared before use.", syntax:"int x = 10;\nfloat f = 3.14;\nchar c = 'A';", exampleCode:'#include <stdio.h>\nint main() {\n    int age = 25;\n    float gpa = 3.8;\n    char grade = \'A\';\n    printf("Age: %d, GPA: %.1f, Grade: %c\\n", age, gpa, grade);\n    return 0;\n}', exampleOutput:"Age: 25, GPA: 3.8, Grade: A", practiceProblemIds:[] }
    ]},
    { id:"c-m3", title:"Module 3 – Control Flow", description:"Branching and loops", topics:[
      { id:"c-t3", title:"If-Else & Loops", explanation:"C uses if-else for decisions, for/while/do-while for loops. Switch-case for multi-branch decisions.", syntax:"for (int i=0; i<n; i++) {\n  // code\n}", exampleCode:'#include <stdio.h>\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        printf("%d ", i);\n    }\n    printf("\\n");\n    return 0;\n}', exampleOutput:"1 2 3 4 5", practiceProblemIds:[] }
    ]},
    { id:"c-m4", title:"Module 4 – Functions", description:"Modular code", topics:[
      { id:"c-t4", title:"Functions in C", explanation:"Functions promote code reuse. Declare with return type, name, and parameters. C passes arguments by value; use pointers for pass-by-reference.", syntax:"returnType functionName(params) {\n  return value;\n}", exampleCode:'#include <stdio.h>\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\nint main() {\n    printf("5! = %d\\n", factorial(5));\n    return 0;\n}', exampleOutput:"5! = 120", practiceProblemIds:[] }
    ]},
    { id:"c-m5", title:"Module 5 – Arrays & Strings", description:"Sequential data", topics:[
      { id:"c-t5", title:"Arrays", explanation:"Arrays store multiple values of same type contiguously. Access via index (0-based). Strings are char arrays ending with '\\0'.", syntax:"int arr[5] = {1,2,3,4,5};\nchar str[] = \"Hello\";", exampleCode:'#include <stdio.h>\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    for (int i = 0; i < 5; i++) {\n        printf("%d ", arr[i]);\n    }\n    return 0;\n}', exampleOutput:"10 20 30 40 50", practiceProblemIds:[] }
    ]},
    { id:"c-m6", title:"Module 6 – Pointers", description:"Memory access", topics:[
      { id:"c-t6", title:"Pointer Basics", explanation:"Pointers store memory addresses. Use & for address-of, * for dereferencing. Essential for dynamic memory allocation and data structures.", syntax:"int *ptr;\nptr = &variable;\nprintf(\"%d\", *ptr);", exampleCode:'#include <stdio.h>\nint main() {\n    int x = 42;\n    int *ptr = &x;\n    printf("Value: %d\\n", *ptr);\n    printf("Address: %p\\n", (void*)ptr);\n    return 0;\n}', exampleOutput:"Value: 42\nAddress: 0x7ffd...", practiceProblemIds:[], quiz:[{id:"c-q2",question:"What does * do with a pointer?",options:["Gets address","Dereferences","Multiplies","Declares"],correctAnswer:1}] }
    ]},
    { id:"c-m7", title:"Module 7 – Structures", description:"Custom data types", topics:[
      { id:"c-t7", title:"Structs in C", explanation:"Structures group related variables of different types. Defined with 'struct' keyword. Access members with dot (.) operator.", syntax:"struct Student {\n  char name[50];\n  int age;\n};", exampleCode:'#include <stdio.h>\nstruct Student {\n    char name[50];\n    int age;\n};\nint main() {\n    struct Student s = {"Alice", 20};\n    printf("Name: %s, Age: %d\\n", s.name, s.age);\n    return 0;\n}', exampleOutput:"Name: Alice, Age: 20", practiceProblemIds:[] }
    ]},
    { id:"c-m8", title:"Module 8 – File I/O", description:"File operations", topics:[
      { id:"c-t8", title:"File Handling in C", explanation:"Use fopen() to open files, fprintf()/fscanf() for formatted I/O, fclose() to close. Modes: r, w, a, r+, w+, a+.", syntax:'FILE *fp = fopen("file.txt", "w");\nfprintf(fp, "Hello");\nfclose(fp);', exampleCode:'#include <stdio.h>\nint main() {\n    FILE *fp = fopen("test.txt", "w");\n    if (fp) {\n        fprintf(fp, "Hello from C!\\n");\n        fclose(fp);\n        printf("File written successfully!\\n");\n    }\n    return 0;\n}', exampleOutput:"File written successfully!", practiceProblemIds:[] }
    ]}
  ]
};

// ─── C++ Course (8 modules) ─────────────────────────
const cppCourse: LearningPath = {
  id: "cpp", title: "C++ Programming",
  description: "Learn C++ for competitive programming and systems development.",
  icon: "⚡", color: "bg-blue-600/10",
  modules: [
    { id:"cpp-m1", title:"Module 1 – Introduction to C++", description:"C++ basics", topics:[
      { id:"cpp-t1", title:"Hello C++", explanation:"C++ is an extension of C with OOP features. It's used in game development, systems programming, and competitive programming.", syntax:"#include <iostream>\nusing namespace std;\nint main() { return 0; }", exampleCode:'#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}', exampleOutput:"Hello, C++!", practiceProblemIds:[] }
    ]},
    { id:"cpp-m2", title:"Module 2 – Variables & I/O", description:"Input/Output", topics:[
      { id:"cpp-t2", title:"cin and cout", explanation:"C++ uses cin for input and cout for output. The insertion (<<) and extraction (>>) operators handle I/O.", syntax:"cout << value;\ncin >> variable;", exampleCode:'#include <iostream>\nusing namespace std;\nint main() {\n    string name = "Coder";\n    int age = 20;\n    cout << name << " is " << age << " years old." << endl;\n    return 0;\n}', exampleOutput:"Coder is 20 years old.", practiceProblemIds:[] }
    ]},
    { id:"cpp-m3", title:"Module 3 – Control Structures", description:"Flow control", topics:[
      { id:"cpp-t3", title:"If-Else & Loops", explanation:"C++ control structures are similar to C. For loops, while loops, and switch-case statements control program flow.", syntax:"for (int i=0; i<n; i++) {\n  // code\n}", exampleCode:'#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << i << " ";\n    }\n    cout << endl;\n    return 0;\n}', exampleOutput:"1 2 3 4 5", practiceProblemIds:[] }
    ]},
    { id:"cpp-m4", title:"Module 4 – Functions & Overloading", description:"Reusable code", topics:[
      { id:"cpp-t4", title:"Functions", explanation:"C++ supports function overloading (same name, different parameters), default parameters, and pass-by-reference with &.", syntax:"int add(int a, int b) { return a+b; }\ndouble add(double a, double b) { return a+b; }", exampleCode:'#include <iostream>\nusing namespace std;\nint add(int a, int b) { return a + b; }\ndouble add(double a, double b) { return a + b; }\nint main() {\n    cout << add(3, 4) << endl;\n    cout << add(3.5, 4.5) << endl;\n    return 0;\n}', exampleOutput:"7\n8", practiceProblemIds:[] }
    ]},
    { id:"cpp-m5", title:"Module 5 – OOP in C++", description:"Object-oriented design", topics:[
      { id:"cpp-t5", title:"Classes & Inheritance", explanation:"C++ supports encapsulation, inheritance, and polymorphism. Access modifiers: public, private, protected.", syntax:"class Base {\npublic:\n  virtual void show() {}\n};", exampleCode:'#include <iostream>\nusing namespace std;\nclass Animal {\npublic:\n    virtual void sound() { cout << "..." << endl; }\n};\nclass Dog : public Animal {\npublic:\n    void sound() override { cout << "Woof!" << endl; }\n};\nint main() {\n    Dog d;\n    d.sound();\n    return 0;\n}', exampleOutput:"Woof!", practiceProblemIds:[], quiz:[{id:"cpp-q1",question:"Which keyword enables polymorphism?",options:["static","virtual","const","friend"],correctAnswer:1}] }
    ]},
    { id:"cpp-m6", title:"Module 6 – STL Basics", description:"Standard Template Library", topics:[
      { id:"cpp-t6", title:"Vectors & Maps", explanation:"STL provides powerful containers: vector (dynamic array), map (sorted key-value), set (unique elements), stack, queue, and more.", syntax:"vector<int> v;\nmap<string, int> m;", exampleCode:'#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> v = {5, 2, 8, 1, 9};\n    sort(v.begin(), v.end());\n    for (int x : v) cout << x << " ";\n    cout << endl;\n    return 0;\n}', exampleOutput:"1 2 5 8 9", practiceProblemIds:[] }
    ]},
    { id:"cpp-m7", title:"Module 7 – Pointers & Memory", description:"Dynamic memory", topics:[
      { id:"cpp-t7", title:"new and delete", explanation:"C++ uses new/delete for dynamic memory. Smart pointers (unique_ptr, shared_ptr) in modern C++ prevent memory leaks.", syntax:"int* p = new int(5);\ndelete p;", exampleCode:'#include <iostream>\nusing namespace std;\nint main() {\n    int* arr = new int[5]{1,2,3,4,5};\n    for (int i = 0; i < 5; i++)\n        cout << arr[i] << " ";\n    delete[] arr;\n    cout << endl;\n    return 0;\n}', exampleOutput:"1 2 3 4 5", practiceProblemIds:[] }
    ]},
    { id:"cpp-m8", title:"Module 8 – Templates & Advanced", description:"Generic programming", topics:[
      { id:"cpp-t8", title:"Templates", explanation:"Templates enable generic programming. Function templates and class templates work with any data type.", syntax:"template <typename T>\nT maxVal(T a, T b) { return (a>b)?a:b; }", exampleCode:'#include <iostream>\nusing namespace std;\ntemplate <typename T>\nT maxVal(T a, T b) { return (a > b) ? a : b; }\nint main() {\n    cout << maxVal(10, 20) << endl;\n    cout << maxVal(3.14, 2.71) << endl;\n    return 0;\n}', exampleOutput:"20\n3.14", practiceProblemIds:[] }
    ]}
  ]
};

// ─── JavaScript Course (10 modules) ─────────────────
const jsCourse: LearningPath = {
  id: "js", title: "JavaScript",
  description: "The language of the Web. Master client-side and server-side scripting.",
  icon: "🟨", color: "bg-yellow-500/10",
  modules: [
    { id:"js-m1", title:"Module 1 – Introduction", description:"JS basics", topics:[
      { id:"js-t1", title:"What is JavaScript?", explanation:"JavaScript is a dynamic, interpreted language primarily used for web development. It runs in browsers and on servers (Node.js). It's prototype-based with first-class functions.", syntax:'console.log("Hello");', exampleCode:'console.log("Hello, JavaScript!");\nconsole.log("JS runs everywhere!");', exampleOutput:"Hello, JavaScript!\nJS runs everywhere!", practiceProblemIds:[], quiz:[{id:"js-q1",question:"JavaScript runs in...",options:["Only browsers","Only servers","Browsers and servers","Only desktop apps"],correctAnswer:2}] }
    ]},
    { id:"js-m2", title:"Module 2 – Variables & Types", description:"let, const, var", topics:[
      { id:"js-t2", title:"Variables", explanation:"Use let for mutable variables, const for constants, avoid var. JS has dynamic typing. Types: number, string, boolean, null, undefined, object, symbol.", syntax:"let x = 10;\nconst PI = 3.14;", exampleCode:'let name = "Alice";\nconst age = 25;\nlet scores = [90, 85, 78];\nconsole.log(`${name} is ${age} years old`);\nconsole.log("Scores:", scores);', exampleOutput:"Alice is 25 years old\nScores: [90, 85, 78]", practiceProblemIds:[] }
    ]},
    { id:"js-m3", title:"Module 3 – Control Flow", description:"Conditionals and loops", topics:[
      { id:"js-t3", title:"If-Else & Loops", explanation:"JS uses if/else, switch for conditionals. for, while, do-while, for...of, for...in for iteration.", syntax:"for (let i = 0; i < n; i++) {\n  // code\n}", exampleCode:'for (let i = 1; i <= 5; i++) {\n    console.log(`Number: ${i}`);\n}', exampleOutput:"Number: 1\nNumber: 2\nNumber: 3\nNumber: 4\nNumber: 5", practiceProblemIds:[] }
    ]},
    { id:"js-m4", title:"Module 4 – Functions", description:"Function types", topics:[
      { id:"js-t4", title:"Functions & Arrow Functions", explanation:"JS supports function declarations, expressions, and arrow functions. Arrow functions have lexical 'this' binding.", syntax:"const fn = (params) => expression;\nfunction name(params) { }", exampleCode:'const greet = (name) => `Hello, ${name}!`;\nconst add = (a, b) => a + b;\nconsole.log(greet("World"));\nconsole.log("Sum:", add(3, 4));', exampleOutput:"Hello, World!\nSum: 7", practiceProblemIds:[] }
    ]},
    { id:"js-m5", title:"Module 5 – Arrays & Objects", description:"Data structures", topics:[
      { id:"js-t5", title:"Array Methods", explanation:"JS arrays have powerful methods: map, filter, reduce, forEach, find, some, every, sort. Objects store key-value pairs.", syntax:"arr.map(x => x * 2)\narr.filter(x => x > 5)", exampleCode:'const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = nums.filter(n => n % 2 === 0);\nconsole.log("Doubled:", doubled);\nconsole.log("Evens:", evens);', exampleOutput:"Doubled: [2, 4, 6, 8, 10]\nEvens: [2, 4]", practiceProblemIds:[] }
    ]},
    { id:"js-m6", title:"Module 6 – DOM Manipulation", description:"Web interactions", topics:[
      { id:"js-t6", title:"Selecting & Modifying Elements", explanation:"The DOM (Document Object Model) lets JS interact with HTML. Use querySelector, getElementById to select elements. Modify text, attributes, styles.", syntax:'document.querySelector(".class")\nelement.textContent = "new text"', exampleCode:'// Example DOM manipulation\nconst element = document.createElement("div");\nelement.textContent = "Hello DOM!";\nelement.style.color = "green";\nconsole.log("Element created:", element.textContent);', exampleOutput:"Element created: Hello DOM!", practiceProblemIds:[] }
    ]},
    { id:"js-m7", title:"Module 7 – Async JavaScript", description:"Promises and async/await", topics:[
      { id:"js-t7", title:"Promises & Async/Await", explanation:"JS is single-threaded but handles async operations with callbacks, promises, and async/await. Promises represent future values.", syntax:"async function fetchData() {\n  const res = await fetch(url);\n  return res.json();\n}", exampleCode:'const delay = (ms) => new Promise(r => setTimeout(r, ms));\nasync function main() {\n    console.log("Start");\n    await delay(1000);\n    console.log("Done after 1 second");\n}\nmain();\nconsole.log("This runs first (async)");', exampleOutput:"Start\nThis runs first (async)\nDone after 1 second", practiceProblemIds:[], quiz:[{id:"js-q2",question:"async/await works with...",options:["Callbacks","Promises","Events","Threads"],correctAnswer:1}] }
    ]},
    { id:"js-m8", title:"Module 8 – ES6+ Features", description:"Modern JavaScript", topics:[
      { id:"js-t8", title:"Destructuring & Spread", explanation:"ES6 introduced destructuring (extract values from arrays/objects), spread/rest operators, template literals, modules, and more.", syntax:"const {a, b} = obj;\nconst [...rest] = arr;", exampleCode:'const person = { name: "Bob", age: 30, city: "NYC" };\nconst { name, ...rest } = person;\nconsole.log(name);\nconsole.log(rest);', exampleOutput:'Bob\n{ age: 30, city: "NYC" }', practiceProblemIds:[] }
    ]},
    { id:"js-m9", title:"Module 9 – Error Handling", description:"Try-catch", topics:[
      { id:"js-t9", title:"Try-Catch-Finally", explanation:"Handle runtime errors gracefully with try-catch. Throw custom errors. Finally block always executes.", syntax:"try {\n  // code\n} catch (e) {\n  console.error(e);\n}", exampleCode:'function divide(a, b) {\n    if (b === 0) throw new Error("Cannot divide by zero!");\n    return a / b;\n}\ntry {\n    console.log(divide(10, 0));\n} catch (e) {\n    console.log("Error:", e.message);\n}', exampleOutput:"Error: Cannot divide by zero!", practiceProblemIds:[] }
    ]},
    { id:"js-m10", title:"Module 10 – Mini Project", description:"Build with JS", topics:[
      { id:"js-t10", title:"Todo List Project", explanation:"Build a simple todo list that uses arrays, functions, objects, and DOM concepts. Practice everything learned so far.", syntax:"// Combine all JS concepts", exampleCode:'class TodoList {\n    constructor() { this.todos = []; }\n    add(task) { this.todos.push({task, done: false}); }\n    complete(i) { this.todos[i].done = true; }\n    list() { return this.todos.map((t,i) => `${i+1}. [${t.done?"✓":" "}] ${t.task}`).join("\\n"); }\n}\nconst app = new TodoList();\napp.add("Learn JS"); app.add("Build project");\napp.complete(0);\nconsole.log(app.list());', exampleOutput:'1. [✓] Learn JS\n2. [ ] Build project', practiceProblemIds:[] }
    ]}
  ]
};

export const allCourses: LearningPath[] = [
  pythonCourse, javaCourse, cCourse, cppCourse, jsCourse
];
