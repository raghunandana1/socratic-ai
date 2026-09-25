// Exam-Specific Hero Problems
export const HERO_PROBLEMS = {
  "JEE Main": {
    equation: "x² - 2kx + (k² + k - 5) = 0  (roots < 5)",
    topic: "Algebra — Location of Roots (JEE Main)",
    steps: [
      {
        id: 1,
        title: "Socratic Hint 01",
        hint: "For both roots to be real, what inequality must the discriminant D = b² - 4ac satisfy?",
        badge: "Real Roots Condition",
        type: "guided_question"
      },
      {
        id: 2,
        title: "Socratic Hint 02",
        hint: "Since both roots lie strictly to the left of 5, where must the parabola's vertex x_v = -b / (2a) be positioned?",
        badge: "Vertex Boundary",
        type: "guided_question"
      },
      {
        id: 3,
        title: "Breakthrough",
        hint: "Combining D ≥ 0 (k ≤ 5), vertex k < 5, and boundary f(5) > 0 (k < 4) ⟹ Range is k ∈ (-∞, 4)",
        badge: "Mastery Achieved",
        type: "solution_reveal"
      }
    ]
  },
  "JEE Advanced": {
    equation: "∫[0 to π/2] (sinⁿ x) / (sinⁿ x + cosⁿ x) dx",
    topic: "Definite Calculus — King's Property (JEE Advanced)",
    steps: [
      {
        id: 1,
        title: "Socratic Hint 01",
        hint: "Apply King's property f(x) ➔ f(a + b - x). What does sin(π/2 - x) simplify to?",
        badge: "Calculus Transformation",
        type: "guided_question"
      },
      {
        id: 2,
        title: "Socratic Hint 02",
        hint: "Notice that swapping sin and cos leaves the denominator completely invariant.",
        badge: "Symmetry Exploitation",
        type: "guided_question"
      },
      {
        id: 3,
        title: "Breakthrough",
        hint: "Add original and transformed integrals ⟹ 2I = ∫[0 to π/2] 1 dx = π/2 ⟹ I = π/4",
        badge: "Mastery Achieved",
        type: "solution_reveal"
      }
    ]
  },
  "NEET UG": {
    equation: "CH₃-CH=CH₂ + HBr ➔ ?",
    topic: "Organic Chemistry — Markovnikov Addition (NEET UG)",
    steps: [
      {
        id: 1,
        title: "Socratic Hint 01",
        hint: "Where will electrophile H⁺ attack first to generate the more stable carbocation intermediate?",
        badge: "Carbocation Stability",
        type: "guided_question"
      },
      {
        id: 2,
        title: "Socratic Hint 02",
        hint: "Why is a 2° carbocation (CH₃-CH⁺-CH₃) significantly more stable than a 1° carbocation?",
        badge: "Hyperconjugation",
        type: "guided_question"
      },
      {
        id: 3,
        title: "Breakthrough",
        hint: "Nucleophilic Br⁻ attacks C2 carbocation ⟹ Major Product is 2-Bromopropane!",
        badge: "Mastery Achieved",
        type: "solution_reveal"
      }
    ]
  }
};

// Exam-Specific Guidance Engine Scenarios
export const GUIDANCE_SCENARIOS = {
  "JEE Main": {
    subject: "Algebra — Location of Roots",
    problemText: "For what values of k are both roots of x² - 2kx + (k² + k - 5) = 0 less than 5?",
    badge: "JEE Main Target",
    hints: [
      {
        level: 1,
        title: "Socratic Hint 01 — Discriminant Constraint",
        question: "For real roots to exist, the discriminant D must be non-negative. What range of k does D = (-2k)² - 4(1)(k² + k - 5) ≥ 0 give?",
        thought: "Expanding gives 4k² - 4k² - 4k + 20 ≥ 0 ⟹ -4k + 20 ≥ 0 ⟹ k ≤ 5.",
        chip: "Condition 1: D ≥ 0"
      },
      {
        level: 2,
        title: "Socratic Hint 02 — Vertex Position",
        question: "Since both roots are less than 5 and the parabola opens upward (a = 1 > 0), where must the vertex x = -b / (2a) lie relative to 5?",
        thought: "Vertex is at x = 2k / 2 = k. Therefore, we must have k < 5.",
        chip: "Condition 2: Vertex < 5"
      },
      {
        level: 3,
        title: "Socratic Hint 03 — Boundary Value Test",
        question: "For both roots to stay to the left of 5, what sign must f(5) have if a > 0?",
        thought: "f(5) = 25 - 10k + k² + k - 5 = k² - 9k + 20 > 0 ⟹ (k - 4)(k - 5) > 0 ⟹ k < 4 or k > 5.",
        chip: "Condition 3: f(5) > 0"
      }
    ],
    breakthrough: {
      title: "Cognitive Breakthrough Achieved!",
      mathResult: "Intersection of (k ≤ 5), (k < 5), and (k < 4 or k > 5) ⟹ k ∈ (-∞, 4)",
      reward: "+150 Diagnostic XP Earned"
    }
  },
  "JEE Advanced": {
    subject: "Calculus — Definite Integration",
    problemText: "Evaluate I = ∫₀^(π/2) (sinⁿ x) / (sinⁿ x + cosⁿ x) dx",
    badge: "JEE Advanced Target",
    hints: [
      {
        level: 1,
        title: "Socratic Hint 01 — King's Property",
        question: "What property simplifies integrals with symmetric bounds [0, a]?",
        thought: "Try substituting x ➔ (π/2 - x).",
        chip: "f(a - x) Rule"
      },
      {
        level: 2,
        title: "Socratic Hint 02 — Trigo Transformation",
        question: "How does sin(π/2 - x) transform in the integrand?",
        thought: "sin(π/2 - x) = cos(x) and cos(π/2 - x) = sin(x).",
        chip: "Co-Function Identity"
      },
      {
        level: 3,
        title: "Socratic Hint 03 — System Addition",
        question: "If you add original integral I and transformed integral I, what is (sinⁿx + cosⁿx)/(sinⁿx + cosⁿx)?",
        thought: "Integrand simplifies to 1!",
        chip: "Integrand Reduction"
      }
    ],
    breakthrough: {
      title: "Calculus Mastery Achieved!",
      mathResult: "2I = ∫₀^(π/2) 1 dx = π/2 ⟹ I = π/4",
      reward: "+150 Diagnostic XP Earned"
    }
  },
  "NEET UG": {
    subject: "Organic Chemistry — Electrophilic Addition",
    problemText: "Predict major product of Propene (CH₃-CH=CH₂) + HBr",
    badge: "NEET UG Target",
    hints: [
      {
        level: 1,
        title: "Socratic Hint 01 — Electrophile Addition",
        question: "Which carbon will H⁺ attack first to generate the carbocation?",
        thought: "Check C1 vs C2 carbocation stability.",
        chip: "Carbocation Search"
      },
      {
        level: 2,
        title: "Socratic Hint 02 — Hyperconjugation",
        question: "Why is a secondary carbocation CH₃-CH⁺-CH₃ more stable than a primary carbocation?",
        thought: "+I effect and 6 alpha hydrogens stabilize 2° carbocation.",
        chip: "Stability Order"
      },
      {
        level: 3,
        title: "Socratic Hint 03 — Nucleophile Attack",
        question: "Where will Br⁻ attack the 2° carbocation?",
        thought: "Br⁻ attacks C2 to yield Markovnikov product.",
        chip: "Product Formation"
      }
    ],
    breakthrough: {
      title: "NEET Chemistry Mastery Achieved!",
      mathResult: "CH₃-CH=CH₂ + HBr ➔ CH₃-CH(Br)-CH₃ (2-Bromopropane)",
      reward: "+110 Diagnostic XP Earned"
    }
  }
};

export const PROBLEM_CARDS = [
  {
    id: "01",
    stat: "12–24 HOURS",
    title: "Waiting for a doubt",
    description: "Traditional coaching leaves students stuck overnight waiting for doubt sessions, killing momentum and retention.",
    tag: "Traditional Bottleneck",
    accentColor: "from-rose-500/20 to-violet-500/10",
    borderColor: "hover:border-rose-500/40"
  },
  {
    id: "02",
    stat: "FINAL ANSWER",
    title: "Answer dumping",
    description: "Generic AI chatbots copy-paste full step-by-step solutions instantly. You get the answer, but gain zero cognitive muscle.",
    tag: "Passive Learning Trap",
    accentColor: "from-amber-500/20 to-purple-500/10",
    borderColor: "hover:border-amber-500/40"
  },
  {
    id: "03",
    stat: "ONE-SIZE-FITS-ALL",
    title: "No personalization",
    description: "Static question banks give identical difficulty curves to everyone, ignoring concept blindspots and cognitive speed.",
    tag: "Suboptimal Growth",
    accentColor: "from-cyan-500/20 to-violet-500/10",
    borderColor: "hover:border-cyan-500/40"
  }
];

export const VISION_PRESETS = [
  {
    id: "chemistry",
    stream: "NEET UG",
    title: "Sample 1: Electrophilic Addition (Organic Chemistry - NEET UG)",
    handwrittenText: "Propene + HBr → ? Identify Markovnikov major product and carbocation intermediate stability.",
    params: [
      { label: "Reactant", value: "CH₃-CH=CH₂ (Propene)", verified: true },
      { label: "Reagent", value: "HBr (Hydrobromic Acid)", verified: true },
      { label: "Intermediate", value: "2° Carbocation (CH₃-CH⁺-CH₃)", verified: true },
      { label: "Major Product", value: "2-Bromopropane", verified: true }
    ],
    displayFormula: {
      left: "Major Product",
      numerator: "CH₃—CH(Br)—CH₃",
      denominator: "via 2° Carbocation Intermediate"
    },
    variableBreakdown: [
      { symbol: "H⁺ Attack", symbolDesc: "Electrophile H⁺ adds to CH₂ carbon to form more stable 2° carbocation" },
      { symbol: "Br⁻ Attack", symbolDesc: "Nucleophilic Br⁻ attacks carbocation at C2 position" },
      { symbol: "Markovnikov Rule", symbolDesc: "Rich gets richer — H goes to carbon with more hydrogens" }
    ],
    studentExplanation: "Secondary carbocations are more stable than primary carbocations due to hyperconjugation (+I effect of two methyl groups).",
    insight: "Protonation occurs at the less substituted carbon to form the more stable 2° carbocation intermediate prior to bromide nucleophilic attack."
  },
  {
    id: "projectile",
    stream: "JEE Advanced",
    title: "Sample 2: Projectile Kinematics (Physics - JEE / NEET)",
    handwrittenText: "A projectile launched from ground with v₀ = 20 m/s at θ = 30° to horizontal. Find H_max. (g = 9.8 m/s²)",
    params: [
      { label: "Initial Velocity (v₀)", value: "20 m/s", verified: true },
      { label: "Launch Angle (θ)", value: "30°", verified: true },
      { label: "Gravitational Acc. (g)", value: "9.8 m/s²", verified: true },
      { label: "Target Parameter", value: "Max Height (H_max)", verified: true }
    ],
    displayFormula: {
      left: "H_max",
      numerator: "v₀² · sin²(θ)",
      denominator: "2g"
    },
    variableBreakdown: [
      { symbol: "H_max", meaning: "Maximum vertical height reached by the ball (in meters)" },
      { symbol: "v₀", meaning: "Initial speed of projection (20 m/s)" },
      { symbol: "θ", meaning: "Angle with the horizontal ground (30°)" },
      { symbol: "g", meaning: "Downward acceleration due to gravity (9.8 m/s²)" }
    ],
    studentExplanation: "At the highest point, vertical speed becomes zero. The ball converts kinetic energy into potential energy (mgh = ½m v_y²).",
    insight: "The vertical component of velocity decreases linearly to 0 at peak trajectory. Energy conservation dictates kinetic to potential energy conversion."
  },
  {
    id: "calculus",
    stream: "JEE Main",
    title: "Sample 3: Definite Integration (Math - JEE Main)",
    handwrittenText: "Evaluate ∫[0 to π/2] (sin^n x) / (sin^n x + cos^n x) dx using King's Property.",
    params: [
      { label: "Lower Limit (a)", value: "0", verified: true },
      { label: "Upper Limit (b)", value: "π/2", verified: true },
      { label: "Integrand Property", value: "King's Rule f(a+b-x)", verified: true },
      { label: "Symmetry Result", value: "2I = ∫[0 to π/2] 1 dx = π/2", verified: true }
    ],
    displayFormula: {
      left: "I",
      numerator: "∫₀^(π/2) sinⁿ(x) dx",
      denominator: "sinⁿ(x) + cosⁿ(x)"
    },
    variableBreakdown: [
      { symbol: "King's Property", symbolDesc: "∫[a to b] f(x) dx = ∫[a to b] f(a+b-x) dx" },
      { symbol: "sin(π/2 - x)", symbolDesc: "Converts to cos(x)" },
      { symbol: "Symmetry Addition", symbolDesc: "Adding I + I yields 2I = ∫[0 to π/2] 1 dx = π/2 ⟹ I = π/4" }
    ],
    studentExplanation: "King's property flips sin and cos without altering the denominator. Adding original and flipped equations simplifies the integrand to 1.",
    insight: "Applying King's property replaces x with (π/2 - x), swapping sin and cos in the integrand. Adding original and transformed integrals yields a constant 1."
  }
];

export const DEMO_QUESTION = {
  question: "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is its maximum height?",
  subtext: "Neglect air resistance. Take g = 9.8 m/s².",
  options: [
    { id: "A", label: "A. 10.2 m", isCorrect: false },
    { id: "B", label: "B. 20.4 m", isCorrect: true },
    { id: "C", label: "C. 30.6 m", isCorrect: false },
    { id: "D", label: "D. 40.8 m", isCorrect: false }
  ],
  socraticResponses: {
    A: {
      feedback: "Not quite 10.2 m. Let's inspect the vertical motion kinematics equation:",
      hint: "Remember: v² = u² - 2gh. What is the final velocity v at the maximum height point?",
      questionToStudent: "At peak height, does the ball temporarily stop climbing?",
      nextStep: "Try applying u = 20 m/s and v = 0 into v² = u² - 2gh."
    },
    B: {
      feedback: "Spot on! Let me verify why your intuition worked:",
      hint: "At maximum height, vertical velocity v = 0. Using 0 = (20)² - 2(9.8)h ⟹ 19.6h = 400 ⟹ h ≈ 20.41 m.",
      questionToStudent: "Notice how energy conservation (½m u² = mgh) yields the exact same expression h = u² / 2g?",
      nextStep: "You're ready for JEE Advanced multi-concept projectile problems!"
    },
    C: {
      feedback: "30.6 m is higher than the actual peak height. Let's re-check the numbers:",
      hint: "Recall: h_max = u² / (2g). Note that 20² = 400, and 2 × 9.8 = 19.6.",
      questionToStudent: "What is 400 divided by 19.6?",
      nextStep: "Divide 400 by 19.6 and select the closest matching option."
    },
    D: {
      feedback: "40.8 m is double the actual height. Did you forget to divide by 2 in kinetic energy / kinematics?",
      hint: "Recall: h_max = u² / (2g). Check if you omitted the factor of 2 in the denominator: 400 / 9.8 vs 400 / 19.6.",
      questionToStudent: "Can you re-evaluate 400 / (2 × 9.8)?",
      nextStep: "Adjust your calculation and try again!"
    }
  }
};

// Independent Exam Calculations & Dynamic Difficulty Curve Profiles
export const SEPARATE_EXAM_DATA = {
  "JEE Main": {
    examName: "JEE Main Diagnostic Model",
    targetAccuracy: 88,
    baseDifficulty: 7.2,
    curveType: "Dynamic S-Curve (High-Speed Calibration)",
    recommendedDifficulty: "HARD (Concept Isolation)",
    predictedScore: "245 / 300 (99.4 Percentile)",
    themeColor: "brand-cyan",
    strokeColor: "#00F0FF",
    fillGradient: ["#00F0FF", "#7928CA"],
    subtopics: [
      { name: "Calculus & Functions", score: 92, weight: "28%" },
      { name: "Mechanics & Gravitation", score: 86, weight: "24%" },
      { name: "Physical Chemistry", score: 85, weight: "22%" },
      { name: "Electromagnetism", score: 89, weight: "26%" }
    ],
    milestones: [
      {
        id: "p1",
        stage: "Stage 01",
        title: "NCERT Baseline",
        difficulty: 3.2,
        concept: "Standard Formula Substitution & Units",
        cognitiveSkill: "Basic Retrieval",
        scaffolding: "Full Micro-Scaffolding Active"
      },
      {
        id: "p2",
        stage: "Stage 02",
        title: "Single-Concept Application",
        difficulty: 5.2,
        concept: "Quadratic Roots & Projectile Trajectories",
        cognitiveSkill: "Formula Coupling",
        scaffolding: "Guiding Questions Available"
      },
      {
        id: "p3",
        stage: "Stage 03",
        title: "Calibrated RL Pivot",
        difficulty: 7.2,
        concept: "Discriminant Boundary Constraints & Work-Energy",
        cognitiveSkill: "Boundary Conditions",
        scaffolding: "Socratic First-Principles Only"
      },
      {
        id: "p4",
        stage: "Stage 04",
        title: "Multi-Step Trap Resistance",
        difficulty: 8.4,
        concept: "Eliminating Common Algebraic Traps in Limits",
        cognitiveSkill: "Error Detection",
        scaffolding: "Zero Crutches Permitted"
      },
      {
        id: "p5",
        stage: "Stage 05",
        title: "AIR Rank Decider",
        difficulty: 9.3,
        concept: "Combined Mechanics & Conic Section Optimization",
        cognitiveSkill: "High-Speed Synthesis",
        scaffolding: "Timed Exam Environment"
      }
    ]
  },
  "JEE Advanced": {
    examName: "JEE Advanced Diagnostic Model",
    targetAccuracy: 81,
    baseDifficulty: 9.0,
    curveType: "Exponential Multi-Concept Spline",
    recommendedDifficulty: "JEE ADVANCED (Multi-Concept Depth)",
    predictedScore: "198 / 360 (AIR < 800 Target)",
    themeColor: "brand-purple",
    strokeColor: "#A855F7",
    fillGradient: ["#A855F7", "#EC4899"],
    subtopics: [
      { name: "Rotational Dynamics & Fluids", score: 79, weight: "30%" },
      { name: "Coordinate Geometry & Conics", score: 83, weight: "24%" },
      { name: "Organic Synthesis & Mechanism", score: 82, weight: "22%" },
      { name: "Modern Physics & Quantum Optics", score: 80, weight: "24%" }
    ],
    milestones: [
      {
        id: "p1",
        stage: "Stage 01",
        title: "Rigorous Mechanics Core",
        difficulty: 4.2,
        concept: "Variable Mass Systems & Moment of Inertia",
        cognitiveSkill: "Calculus Modeling",
        scaffolding: "Conceptual Framing Active"
      },
      {
        id: "p2",
        stage: "Stage 02",
        title: "Definite Integral Invariance",
        difficulty: 6.8,
        concept: "King's Rule Symmetry & Series Reductions",
        cognitiveSkill: "Symmetry Exploitation",
        scaffolding: "Guided Micro-Questions"
      },
      {
        id: "p3",
        stage: "Stage 03",
        title: "Calibrated RL Pivot",
        difficulty: 8.8,
        concept: "Coupled Electro-Mechanics & Angular Impulse",
        cognitiveSkill: "Multi-Domain Coupling",
        scaffolding: "Socratic First-Principles"
      },
      {
        id: "p4",
        stage: "Stage 04",
        title: "Multi-Concept Synthesis",
        difficulty: 9.5,
        concept: "Matrix Transformations in Optics & Wave Superposition",
        cognitiveSkill: "Deep Structural Abstraction",
        scaffolding: "Zero Crutches / Full Autonomy"
      },
      {
        id: "p5",
        stage: "Stage 05",
        title: "Top 500 AIR Decider",
        difficulty: 9.9,
        concept: "Multi-Stage Organic Stereochemistry Cascades",
        cognitiveSkill: "Olympiad Level Heuristics",
        scaffolding: "Pure Cognitive Breakthrough"
      }
    ]
  },
  "NEET UG": {
    examName: "NEET UG Diagnostic Model",
    targetAccuracy: 94,
    baseDifficulty: 6.4,
    curveType: "Precision Plateau Curve (Zero-Error Target)",
    recommendedDifficulty: "NEET SPEED & ACCURACY TARGET",
    predictedScore: "685 / 720 (Target Top GMC)",
    themeColor: "brand-emerald",
    strokeColor: "#10B981",
    fillGradient: ["#10B981", "#06B6D4"],
    subtopics: [
      { name: "Human Physiology & Genetics", score: 96, weight: "35%" },
      { name: "Organic Reaction Mechanisms", score: 92, weight: "25%" },
      { name: "Ray & Wave Optics", score: 91, weight: "20%" },
      { name: "Plant Diversity & Cell Biology", score: 97, weight: "20%" }
    ],
    milestones: [
      {
        id: "p1",
        stage: "Stage 01",
        title: "NCERT Direct Retrieval",
        difficulty: 2.8,
        concept: "Biomolecule Classifications & Direct Genetics",
        cognitiveSkill: "Instant Recall",
        scaffolding: "Micro-Scaffolding Active"
      },
      {
        id: "p2",
        stage: "Stage 02",
        title: "Reaction Pathways",
        difficulty: 4.8,
        concept: "Markovnikov Carbocation Intermediate Stability",
        cognitiveSkill: "Mechanistic Logic",
        scaffolding: "Guided Intermediate Hints"
      },
      {
        id: "p3",
        stage: "Stage 03",
        title: "Calibrated RL Pivot",
        difficulty: 6.4,
        concept: "Complex Optics Ray Diagrams & Bio Energetics",
        cognitiveSkill: "Error Prevention",
        scaffolding: "Socratic First-Principles"
      },
      {
        id: "p4",
        stage: "Stage 04",
        title: "High-Speed Elimination",
        difficulty: 7.6,
        concept: "Rapid 45-Second Assertion-Reasoning Traps",
        cognitiveSkill: "Rapid Disambiguation",
        scaffolding: "Zero Crutches"
      },
      {
        id: "p5",
        stage: "Stage 05",
        title: "Top GMC Target (700+)",
        difficulty: 8.6,
        concept: "Multi-Step Equilibrium & Pedigree Analysis",
        cognitiveSkill: "Zero-Margin Accuracy",
        scaffolding: "Speed Benchmark Simulation"
      }
    ]
  }
};
