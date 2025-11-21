import { Difficulty, Module, Badge, Project } from './types';

export const XP_PER_LESSON = 50;
export const XP_PER_PROJECT = 200;

export const BADGES: Badge[] = [
  {
    id: 'b1-initiate',
    name: 'Mara Initiate',
    description: 'Complete your first Python lesson.',
    icon: '🌱'
  },
  {
    id: 'b2-streak',
    name: 'Musoma Momentum',
    description: 'Reach a 3-day learning streak.',
    icon: '🔥'
  },
  {
    id: 'b3-mod1',
    name: 'Serengeti Scripter',
    description: 'Complete the Introduction module.',
    icon: '🦁'
  },
  {
    id: 'b4-master',
    name: 'Kilimanjaro Coder',
    description: 'Reach Level 5 (500 XP).',
    icon: '🗻'
  },
  {
    id: 'b5-builder',
    name: 'Lake Victoria Builder',
    description: 'Complete your first project.',
    icon: '🛠️'
  }
];

export const LEADERBOARD_MOCK = [
  { name: "Erick Wambura", xp: 15400, badge: "🦁" },
  { name: "Sarah J.", xp: 1200, badge: "🌱" },
  { name: "David M.", xp: 850, badge: "🔥" },
  { name: "Amani K.", xp: 600, badge: "🌱" }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1-calc',
    title: 'Serengeti Market Calculator',
    description: 'Create a robust calculator for a shopkeeper in Musoma to total prices, apply discounts, and calculate change.',
    difficulty: Difficulty.BEGINNER,
    objectives: [
      "Create variables for item prices.",
      "Use input() (simulated) or hardcoded values for payment.",
      "Apply a 10% discount if total is over 10,000.",
      "Print a formatted receipt."
    ],
    starterCode: `# Serengeti Market System
# Prices
ugali_flour = 2000
sugar = 2500
tea_leaves = 500

# Quantity
qty_ugali = 2
qty_sugar = 1

# 1. Calculate Total Cost
# 2. Check if total > 5000 for Discount
# 3. Print Receipt
`
  },
  {
    id: 'p2-game',
    title: 'Guess the Number (Safal)',
    description: 'Build a game where the computer picks a random number between 1 and 20, and the user has to guess it.',
    difficulty: Difficulty.BEGINNER,
    objectives: [
      "Import the random module.",
      "Use a while loop to keep asking for guesses.",
      "Use if/else to give 'Too High' or 'Too Low' hints.",
      "Break the loop when guessed correctly."
    ],
    starterCode: `import random

secret_number = random.randint(1, 20)
print("I am thinking of a number between 1 and 20...")

# Write your loop here
# Note: Since we can't do real-time input in this demo, 
# simulate a list of guesses like: guesses = [5, 10, 15]
`
  },
  {
    id: 'p3-budget',
    title: 'Safari Expense Tracker',
    description: 'Manage a list of expenses for a trip to Arusha using Lists and Dictionaries.',
    difficulty: Difficulty.INTERMEDIATE,
    objectives: [
      "Create a list of dictionaries, where each dictionary is an expense (item, cost).",
      "Write a function to add an expense.",
      "Write a function to calculate total cost.",
      "Write a function to find the most expensive item."
    ],
    starterCode: `expenses = [
    {"item": "Bus Ticket", "cost": 35000},
    {"item": "Lunch", "cost": 5000}
]

def add_expense(item, cost):
    # Add code here
    pass

def get_total():
    # Add code here
    pass

# Test your functions below
add_expense("Dinner", 8000)
print("Total:", get_total())`
  },
  {
    id: 'p4-api',
    title: 'Tanzania Tourism Data API',
    description: 'Simulate a backend API class that handles tourist data processing.',
    difficulty: Difficulty.ADVANCED,
    objectives: [
      "Create a 'TourismData' class.",
      "Implement methods to 'filter_by_country' and 'average_spend'.",
      "Handle potential errors if data is missing."
    ],
    starterCode: `class TourismData:
    def __init__(self, data):
        self.data = data

    def get_visitors_from(self, country):
        # Return list of names
        pass

    def average_spend(self):
        # Return float
        pass

# Mock Data
tourists = [
    {"name": "Alice", "country": "USA", "spend": 200},
    {"name": "Bob", "country": "UK", "spend": 150},
    {"name": "Charlie", "country": "USA", "spend": 300}
]

app = TourismData(tourists)
print("USA Visitors:", app.get_visitors_from("USA"))`
  }
];

export const CURRICULUM: Module[] = [
  {
    id: 'm1-intro',
    title: 'Introduction to Python',
    description: 'Start your journey in Musoma. Learn syntax, variables, and types.',
    difficulty: Difficulty.BEGINNER,
    lessons: [
      {
        id: 'l1-hello',
        title: 'Hello, Musoma!',
        content: [
          "Karibu! Welcome to WamburaCode. I'm Erick, and I'll guide you through Python.",
          "Python is as vast and beautiful as Lake Victoria. We start by printing text to the screen using the `print()` function.",
          "Text must be wrapped in quotes."
        ],
        codeExample: `print("Hello, Musoma!")
print('Tanzania is beautiful.')`,
        miniTask: {
          description: "Write a program that prints 'Jambo Erick' to the console.",
          starterCode: `# Write your code below\n`,
          expectedOutput: "Jambo Erick"
        },
        quiz: [
          {
            id: 'q1',
            text: "Which function is used to output text in Python?",
            options: ["console.log()", "print()", "echo()", "write()"],
            correctAnswer: 1,
            explanation: "Python uses print() to send output to the standard output device."
          }
        ]
      },
      {
        id: 'l2-vars',
        title: 'Variables from Mara',
        content: [
          "Variables are like containers. Imagine a basket in a market in Mara storing different goods.",
          "You can store names (Strings), numbers (Integers), or decimals (Floats).",
          "No need to declare the type; Python figures it out."
        ],
        codeExample: `name = "Erick"       # String
home_region = "Mara" # String
age = 25             # Integer
temp_musoma = 28.5   # Float

print(name)
print("From: " + home_region)`,
        miniTask: {
          description: "Create a variable called 'city' with the value 'Musoma' and print it.",
          starterCode: `# Create variable and print it\n`,
          expectedOutput: "Musoma"
        },
        quiz: [
          {
            id: 'q2',
            text: "How do you create a variable in Python?",
            options: ["var x = 5", "int x = 5", "x = 5", "declare x = 5"],
            correctAnswer: 2,
            explanation: "In Python, you simply assign a value to a name using the = operator."
          }
        ]
      }
    ]
  },
  {
    id: 'm2-control',
    title: 'Control Flow Safari',
    description: 'Master logic with conditionals and loops.',
    difficulty: Difficulty.BEGINNER,
    lessons: [
      {
        id: 'l3-if',
        title: 'If...Else Conditionals',
        content: [
          "Logic helps us make decisions. Like choosing a path in the Serengeti.",
          "Indentation (whitespace) is crucial in Python. It defines the scope of the code block."
        ],
        codeExample: `location = "Serengeti"

if location == "Serengeti":
    print("Watch out for lions!")
else:
    print("Safe for now.")`,
        miniTask: {
          description: "Check if 'speed' is greater than 80. If so, print 'Slow down'. Variable speed is set to 100.",
          starterCode: `speed = 100\n# Write your if statement here\n`,
          expectedOutput: "Slow down"
        },
        quiz: [
          {
            id: 'q3',
            text: "What indicates a block of code in Python?",
            options: ["Curly brackets {}", "Indentation", "Parentheses ()", "Semicolons ;"],
            correctAnswer: 1,
            explanation: "Python uses indentation (usually 4 spaces) to define scope."
          }
        ]
      }
    ]
  },
  {
    id: 'm3-structures',
    title: 'Data Structures',
    description: 'Lists, Dictionaries, and Sets.',
    difficulty: Difficulty.INTERMEDIATE,
    lessons: [
       {
        id: 'l4-lists',
        title: 'Lists of Regions',
        content: [
          "Lists let us store multiple items. Let's store a list of regions in Tanzania.",
          "Lists are ordered and changeable."
        ],
        codeExample: `regions = ["Mara", "Arusha", "Mwanza"]
print(regions[0]) # Access Mara
regions.append("Kilimanjaro") # Add item
print(regions)`,
        miniTask: {
          description: "Create a list named 'cities' with 'Dar' and 'Dodoma'. Add 'Mbeya' to it. Print the list.",
          starterCode: `# Write your code here\n`,
          expectedOutput: "['Dar', 'Dodoma', 'Mbeya']"
        },
        quiz: [
          {
            id: 'q4',
            text: "Which method adds an item to the end of a list?",
            options: ["add()", "insert()", "append()", "push()"],
            correctAnswer: 2,
            explanation: "The append() method appends an element to the end of the list."
          }
        ]
      }
    ]
  },
  {
    id: 'm4-advanced',
    title: 'Advanced Concepts',
    description: 'OOP, APIs, and Data Science basics.',
    difficulty: Difficulty.ADVANCED,
    lessons: [
      {
        id: 'l5-classes',
        title: 'Classes & Objects',
        content: [
          "Python is Object-Oriented. A Class is a blueprint.",
          "Imagine a blueprint for a 'SafariGuide'. Every guide has a name and experience level."
        ],
        codeExample: `class SafariGuide:
  def __init__(self, name, experience):
    self.name = name
    self.experience = experience

guide1 = SafariGuide("Erick", "Expert")
print(guide1.name)`,
        miniTask: {
          description: "Define a class 'Lion' with an __init__ method taking 'name'. Create an instance named 'Simba' and print its name.",
          starterCode: `class Lion:\n    # Define __init__\n\n# Create instance and print`,
          expectedOutput: "Simba"
        },
        quiz: [
          {
            id: 'q5',
            text: "What is the correct name of the constructor method in Python?",
            options: ["init()", "__init__", "constructor()", "def()"],
            correctAnswer: 1,
            explanation: "__init__ is a special method known as the constructor."
          }
        ]
      }
    ]
  }
];