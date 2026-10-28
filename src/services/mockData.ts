import {
  UserProfile,
  StudyNote,
  CampusEvent,
  CampusAnnouncement,
  ResumeData,
  StudyTask,
  SmartReminder,
  WellbeingEntry,
  QuizAttemptRecord,
} from '../types';

export const INITIAL_DEMO_USER: UserProfile = {
  id: 'usr_demo_01',
  name: 'Maya Lin',
  email: 'maya.lin@student.edu',
  university: 'Pacific Coast University',
  major: 'Computer Science & Cognitive Science',
  graduationYear: '2027',
  academicGoals: [
    'Maintain >= 3.8 GPA',
    'Prepare for Software Engineering Summer Internship',
    'Master Algorithms & Discrete Structures',
    'Balance 8 hours of sleep with study sprints',
  ],
  subjects: ['Data Structures & Algorithms', 'Neurobiology of Memory', 'Linear Algebra', 'Web Systems'],
  preferredLanguage: 'English',
  studyTimePreference: 'morning',
  sessionLengthMinutes: 45,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  isDemoUser: true,
};

export const INITIAL_STUDY_NOTES: StudyNote[] = [
  {
    id: 'note_01',
    title: 'Cellular Respiration & Glycolysis Essentials',
    subject: 'Neurobiology of Memory',
    uploadedAt: '2026-10-27T14:30:00Z',
    wordCount: 384,
    content: `Cellular respiration is a metabolic pathway that breaks down glucose and produces ATP. The stages of cellular respiration include glycolysis, pyruvate oxidation, the citric acid or Krebs cycle, and oxidative phosphorylation.

In glycolysis, glucose undergoes a series of chemical transformations. In the end, it gets converted into two molecules of pyruvate, a three-carbon organic molecule. In these reactions, ATP is made, and NAD+ is converted to NADH.

Glycolysis takes place in the cytosol of a cell, and it can occur without the presence of oxygen (anaerobic). The pathway consists of an energy-requiring investment phase followed by an energy-releasing payoff phase. Overall, glycolysis yields a net of 2 ATP and 2 NADH molecules per glucose molecule.

Pyruvate oxidation converts each pyruvate into acetyl CoA in the mitochondrial matrix, producing NADH and releasing CO2. Acetyl CoA enters the citric acid cycle to generate high-energy electron carriers (NADH, FADH2) which fuel the electron transport chain.`,
    summary: {
      summary: 'Cellular respiration converts glucose into usable ATP through four distinct metabolic phases. Glycolysis operates anaerobically in the cytosol, generating a net yield of 2 ATP and 2 NADH per glucose. Downstream stages (pyruvate oxidation, Krebs cycle, and oxidative phosphorylation) take place inside the mitochondria, converting electron carriers into bulk ATP via chemiosmosis.',
      keyConcepts: [
        { term: 'Glycolysis', definition: 'The cytosolic breakdown of glucose into 2 pyruvate molecules yielding net 2 ATP and 2 NADH.' },
        { term: 'Mitochondrial Matrix', definition: 'The internal chamber where pyruvate oxidation and the citric acid cycle occur.' },
        { term: 'Oxidative Phosphorylation', definition: 'The terminal stage where proton gradients across the inner mitochondrial membrane power ATP synthase.' },
      ],
      flashcards: [
        { front: 'Where in the cell does glycolysis occur?', back: 'In the cytosol (cytoplasm).' },
        { front: 'What is the net yield of ATP per glucose molecule in glycolysis?', back: 'Net 2 ATP (4 produced minus 2 consumed in investment phase).' },
        { front: 'Does glycolysis require oxygen?', back: 'No, it can occur anaerobically.' },
      ],
      studyTip: 'Remember the acronym: OIL RIG (Oxidation Is Loss, Reduction Is Gain of electrons) to easily track NADH and FADH2 transitions.',
      estimatedReadTime: '3 mins',
      isRealAi: false,
      demoNotice: 'Verified academic sample notes summary.',
    },
  },
  {
    id: 'note_02',
    title: 'Graph Traversals: BFS vs DFS Algorithms',
    subject: 'Data Structures & Algorithms',
    uploadedAt: '2026-10-26T10:15:00Z',
    wordCount: 420,
    content: `Graph traversal algorithms visit all vertices in a graph in a systematic manner. The two canonical algorithms are Breadth-First Search (BFS) and Depth-First Search (DFS).

Breadth-First Search (BFS):
- Traversal order: Visits neighbor vertices level-by-level starting from a source vertex.
- Data structure: Implemented using a First-In-First-Out (FIFO) Queue.
- Space Complexity: O(V) where V is the number of vertices.
- Time Complexity: O(V + E) with adjacency lists.
- Key Applications: Shortest path in unweighted graphs, peer-to-peer torrent discovery, web crawlers, finding connected components.

Depth-First Search (DFS):
- Traversal order: Explores as far as possible along each branch before backtracking.
- Data structure: Implemented using a Last-In-First-Out (LIFO) Stack or call-stack recursion.
- Space Complexity: O(h) where h is the maximum path depth / height of the search tree.
- Time Complexity: O(V + E).
- Key Applications: Topological sorting in DAGs, cycle detection, pathfinding in mazes, strongly connected components (Kosaraju / Tarjan).`,
    summary: {
      summary: 'BFS explores vertices layer-by-layer using a Queue, making it the optimal choice for shortest paths in unweighted graphs. DFS plunges deep along branches using recursion/Stack before backtracking, making it ideal for topological sorting, cycle detection, and maze solving.',
      keyConcepts: [
        { term: 'Breadth-First Search (BFS)', definition: 'Level-order traversal using a FIFO queue; finds shortest path in unweighted networks.' },
        { term: 'Depth-First Search (DFS)', definition: 'Deep branch traversal using LIFO stack; ideal for topological sort and cycle detection.' },
        { term: 'Adjacency List', definition: 'Graph representation providing O(V + E) traversal efficiency.' },
      ],
      flashcards: [
        { front: 'Which data structure does BFS rely upon?', back: 'A FIFO Queue.' },
        { front: 'What is the optimal algorithm for finding shortest paths in unweighted graphs?', back: 'Breadth-First Search (BFS).' },
        { front: 'Can DFS detect directed cycles in a graph?', back: 'Yes, by tracking back-edges in the recursion stack.' },
      ],
      studyTip: 'Visualize BFS like ripples in water (expanding rings), and DFS like traversing a labyrinth (following one wall until a dead end).',
      estimatedReadTime: '4 mins',
      isRealAi: false,
      demoNotice: 'Verified academic sample notes summary.',
    },
  },
];

export const INITIAL_CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'evt_01',
    title: 'Fall STEM & Engineering Career Showcase',
    category: 'Career',
    date: 'Thursday, Oct 29',
    time: '1:00 PM – 5:00 PM',
    location: 'Student Union Grand Ballroom',
    description: 'Over 65 tech, biotech, and research organizations seeking interns and full-time grads. Professional dress recommended.',
    attendeesCount: 342,
    isSampleData: true,
  },
  {
    id: 'evt_02',
    title: 'Midterm Calm & Mindful Meditation Hour',
    category: 'Wellness',
    date: 'Friday, Oct 30',
    time: '12:00 PM – 1:00 PM',
    location: 'Campus Amphitheater Lawn',
    description: 'Guided breathwork, free herbal tea, and stress relief techniques hosted by the Student Wellness Coalition.',
    attendeesCount: 88,
    isSampleData: true,
  },
  {
    id: 'evt_03',
    title: 'Peer Study Group: Algorithms & Math Problem Sets',
    category: 'Academic',
    date: 'Saturday, Oct 31',
    time: '2:00 PM – 4:30 PM',
    location: 'Main Library 4th Floor Pod B',
    description: 'Collaborative problem solving on dynamic programming and graph theory before midterms.',
    attendeesCount: 24,
    isSampleData: true,
  },
  {
    id: 'evt_04',
    title: 'Intercollegiate Ultimate Frisbee Semi-Finals',
    category: 'Athletics',
    date: 'Sunday, Nov 1',
    time: '3:00 PM – 5:30 PM',
    location: 'West Campus Sports Field',
    description: 'Come support the university team! Free student admission with campus ID.',
    attendeesCount: 195,
    isSampleData: true,
  },
];

export const INITIAL_ANNOUNCEMENTS: CampusAnnouncement[] = [
  {
    id: 'ann_01',
    title: 'Library 24/7 Extended Study Hours for Midterms',
    date: 'Oct 27, 2026',
    priority: 'High',
    department: 'University Libraries',
    content: 'Starting next Monday through November 15th, Floors 1 and 2 of the Main Library will remain open 24 hours. Coffee carts open until 1:00 AM.',
    isOfficialAnnouncement: false,
  },
  {
    id: 'ann_02',
    title: 'Campus Shuttle North Route Detour Notice',
    date: 'Oct 26, 2026',
    priority: 'Normal',
    department: 'Campus Transportation',
    content: 'Due to steam line maintenance on College Avenue, Shuttle North will stop temporarily at Alumni Gate rather than Engineering Hall.',
    isOfficialAnnouncement: false,
  },
  {
    id: 'ann_03',
    title: 'Undergraduate Research Grant Application Deadline',
    date: 'Oct 25, 2026',
    priority: 'Normal',
    department: 'Office of Student Research',
    content: 'Spring 2027 faculty-mentored research proposals ($2,500 stipend) are due November 10th by 5:00 PM via the portal.',
    isOfficialAnnouncement: false,
  },
];

export const INITIAL_RESUME_DATA: ResumeData = {
  fullName: 'Maya Lin',
  email: 'maya.lin@student.edu',
  phone: '(555) 234-8901',
  linkedin: 'linkedin.com/in/maya-lin-student',
  github: 'github.com/mayalin-dev',
  targetRole: 'Software Engineering Intern',
  summary: 'Motivated Computer Science & Cognitive Science sophomore with hands-on experience building full-stack web applications, data algorithms, and accessible UI. Passionate about applying AI and human-centered design to student productivity.',
  education: {
    institution: 'Pacific Coast University',
    degree: 'B.S. in Computer Science, Minor in Cognitive Science',
    gpa: '3.86 / 4.0',
    expectedGrad: 'June 2027',
    coursework: 'Data Structures, Discrete Mathematics, Web Architecture, Algorithms, Linear Algebra',
  },
  experiences: [
    {
      id: 'exp_1',
      role: 'Undergraduate Research Assistant',
      company: 'Interactive Cognition Lab',
      period: 'Jan 2026 – Present',
      bulletPoints: [
        'Developed interactive experiment modules in React & TypeScript to evaluate student recall under spaced repetition protocols.',
        'Processed and visualized behavioral telemetry data for 250+ participant study sessions using Python and pandas.',
        'Collaborated directly with post-doctoral researchers to co-author an upcoming human-computer interaction conference submission.',
      ],
    },
    {
      id: 'exp_2',
      role: 'Peer Computer Science Tutor',
      company: 'University Academic Success Center',
      period: 'Sept 2025 – Present',
      bulletPoints: [
        'Led weekly 1-on-1 and small group coaching sessions for 40+ introductory programming students.',
        'Helped students debug data structure implementations (linked lists, trees, hash tables) and write unit tests.',
      ],
    },
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'NOVA Study Planner & Knowledge Assistant',
      technologies: 'React, TypeScript, Tailwind CSS, Express, Gemini AI',
      description: 'An integrated personal learning platform combining note summarization, quiz generation, and wellbeing tracking.',
      bullets: [
        'Engineered responsive interface with soft lavender and mint themes, ensuring fast mobile-first interaction.',
        'Integrated Gemini Flash 3.8 API with structured schema outputs for automatic quiz generation and STAR interview evaluation.',
        'Implemented local persistence layer and deterministic scoring logic achieving 100% test coverage.',
      ],
    },
    {
      id: 'proj_2',
      name: 'Campus Transit Real-time Tracker',
      technologies: 'React, Leaflet, Node.js, WebSockets',
      description: 'Live shuttle vehicle tracking system serving 1,200 campus commuters daily.',
      bullets: [
        'Reduced commuter wait time by 18% with dynamic arrival ETA calculations.',
        'Designed lightweight PWA support for offline bus schedules during dead cellular zones.',
      ],
    },
  ],
  skills: [
    { category: 'Languages', items: 'TypeScript, JavaScript, Python, Java, C++, SQL, HTML/CSS' },
    { category: 'Frameworks & Libraries', items: 'React, Vite, Express, Tailwind CSS, Node.js, Jest' },
    { category: 'Tools & Platforms', items: 'Git, GitHub, Docker, Postman, Figma, Linux/Bash' },
  ],
};

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task_1',
    title: 'Review Cellular Respiration Summary & Flashcards',
    subject: 'Neurobiology of Memory',
    dueTime: '11:00 AM',
    completed: true,
    priority: 'High',
    durationMins: 30,
  },
  {
    id: 'task_2',
    title: 'Complete 4-Question Practice Quiz on Graph Traversals',
    subject: 'Data Structures & Algorithms',
    dueTime: '02:30 PM',
    completed: false,
    priority: 'High',
    durationMins: 20,
  },
  {
    id: 'task_3',
    title: 'Draft Project Bullets for Software Internship Resume',
    subject: 'Career Boost',
    dueTime: '04:45 PM',
    completed: false,
    priority: 'Medium',
    durationMins: 45,
  },
  {
    id: 'task_4',
    title: '5-Minute Mindful Breathwork & Screen Break',
    subject: 'Wellbeing',
    dueTime: '06:00 PM',
    completed: true,
    priority: 'Low',
    durationMins: 5,
  },
];

export const INITIAL_REMINDERS: SmartReminder[] = [
  {
    id: 'rem_1',
    title: 'Graph Traversal Quiz Ready',
    message: 'Test your BFS vs DFS recall to keep your 4-day study streak intact.',
    type: 'study',
    timestamp: '15 mins ago',
    read: false,
    enabled: true,
  },
  {
    id: 'rem_2',
    title: 'STEM Career Fair Tomorrow',
    message: 'Over 65 recruiters visiting Student Union. Review your resume draft before 5 PM.',
    type: 'career',
    timestamp: '2 hours ago',
    read: false,
    enabled: true,
  },
  {
    id: 'rem_3',
    title: 'Afternoon Hydration & Posture Reset',
    message: 'Time for a 5-minute movement break. Rest your eyes with the 20-20-20 rule.',
    type: 'wellbeing',
    timestamp: '3 hours ago',
    read: true,
    enabled: true,
  },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttemptRecord[] = [
  {
    id: 'atm_01',
    quizTitle: 'Cellular Respiration Knowledge Check',
    subject: 'Neurobiology of Memory',
    scorePercentage: 100,
    correctCount: 4,
    totalQuestions: 4,
    timestamp: '2026-10-27T15:10:00Z',
    passed: true,
    difficulty: 'Medium',
  },
  {
    id: 'atm_02',
    quizTitle: 'Discrete Logic & Proofs Checkpoint',
    subject: 'Data Structures & Algorithms',
    scorePercentage: 75,
    correctCount: 3,
    totalQuestions: 4,
    timestamp: '2026-10-25T11:20:00Z',
    passed: true,
    difficulty: 'Hard',
  },
];

export const INITIAL_WELLBEING_CHECKINS: WellbeingEntry[] = [
  { date: '2026-10-25', moodRating: 4, energyLevel: 3, stressLevel: 3, completedBreakType: 'Hydration & Posture' },
  { date: '2026-10-26', moodRating: 4, energyLevel: 4, stressLevel: 2, completedBreakType: 'Box Breathing' },
  { date: '2026-10-27', moodRating: 5, energyLevel: 4, stressLevel: 2, completedBreakType: 'Outdoor Walk' },
  { date: '2026-10-28', moodRating: 4, energyLevel: 4, stressLevel: 2, completedBreakType: '20-20-20 Eye Relief' },
];
