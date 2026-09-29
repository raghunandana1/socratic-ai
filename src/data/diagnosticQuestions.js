// Authentic Socratic Diagnostic Question Bank
// Real syllabus questions for JEE Main, JEE Advanced, and NEET UG

export const EXAM_DIAGNOSTIC_QUESTIONS = {
  "JEE Main": [
    {
      id: "jm-1",
      subject: "Mathematics",
      topic: "Algebra — Location of Roots",
      difficulty: 6.8,
      problem: "For what values of k are both roots of the quadratic equation x² - 2kx + (k² + k - 5) = 0 real and less than 5?",
      options: [
        { id: "A", text: "k ∈ [4, 5]", isCorrect: false, hint: "Check the boundary value f(5) > 0 alongside the vertex condition x_v < 5." },
        { id: "B", text: "k < 4", isCorrect: true, hint: "Spot on! Combining D ≥ 0 (k ≤ 5), vertex < 5 (k < 5), and f(5) > 0 (k < 4 or k > 5) gives k < 4." },
        { id: "C", text: "k ≤ 5", isCorrect: false, hint: "D ≥ 0 ensures real roots exist, but does not constrain both roots to lie to the left of 5!" },
        { id: "D", text: "k > 5", isCorrect: false, hint: "If k > 5, the vertex is to the right of 5, which directly violates the condition." }
      ],
      socraticFeedback: "Location of roots requires 3 simultaneous conditions: Discriminant non-negative (D ≥ 0), vertex position relative to 5 (x_v < 5), and positive boundary value f(5) > 0."
    },
    {
      id: "jm-2",
      subject: "Mathematics",
      topic: "Coordinate Geometry — Parabola Tangency",
      difficulty: 5.8,
      problem: "If the straight line y = mx + 1 is tangent to the standard parabola y² = 4x, what is the value of m?",
      options: [
        { id: "A", text: "m = 1/2", isCorrect: false, hint: "Recall the tangency condition for y² = 4ax: c = a / m." },
        { id: "B", text: "m = 1", isCorrect: true, hint: "Correct! For y² = 4ax, tangency condition is c = a / m. Here a = 1, c = 1 ⟹ 1 = 1 / m ⟹ m = 1." },
        { id: "C", text: "m = 2", isCorrect: false, hint: "If m = 2, c = 1 ≠ 1 / 2, so the line intersects in two distinct points." },
        { id: "D", text: "m = 4", isCorrect: false, hint: "Check your formula for a in y² = 4ax where 4a = 4." }
      ],
      socraticFeedback: "For parabola y² = 4ax and line y = mx + c, the discriminant of the resulting quadratic vanishes when c = a / m."
    },
    {
      id: "jm-3",
      subject: "Mathematics",
      topic: "Calculus — Definite Integration & King's Rule",
      difficulty: 6.2,
      problem: "Evaluate the definite integral I = ∫₀^(π/2) (sin³ x) / (sin³ x + cos³ x) dx.",
      options: [
        { id: "A", text: "π / 2", isCorrect: false, hint: "Remember to divide by 2 when adding the transformed integral to the original (2I)!" },
        { id: "B", text: "π / 4", isCorrect: true, hint: "Flawless! Using King's property x ➔ π/2 - x gives 2I = ∫₀^(π/2) 1 dx = π/2 ⟹ I = π/4." },
        { id: "C", text: "1", isCorrect: false, hint: "The integrand reduces to 1 upon addition, but integrate over [0, π/2] then divide by 2." },
        { id: "D", text: "0", isCorrect: false, hint: "The integrand is strictly positive throughout (0, π/2)." }
      ],
      socraticFeedback: "King's property f(a+b-x) swaps sin and cos without changing the denominator, allowing symmetric reduction."
    },
    {
      id: "jm-4",
      subject: "Mathematics",
      topic: "Matrices & Determinants — Adjoint Properties",
      difficulty: 6.5,
      problem: "Let A be a 3 × 3 invertible matrix such that |A| = 4. What is the value of |adj(2A)|?",
      options: [
        { id: "A", text: "64", isCorrect: false, hint: "Recall |adj(B)| = |B|^(n-1) where n = 3 and B = 2A." },
        { id: "B", text: "256", isCorrect: false, hint: "For a 3x3 matrix, |2A| = 2³ × |A| = 8 × 4 = 32. Now square it!" },
        { id: "C", text: "1024", isCorrect: true, hint: "Exact! |2A| = 2³ |A| = 8 × 4 = 32. For n = 3, |adj(B)| = |B|² = 32² = 1024." },
        { id: "D", text: "512", isCorrect: false, hint: "Did you compute 2³ × 4 = 32, then raise 32 to power 2?" }
      ],
      socraticFeedback: "For any n × n matrix B, |adj(B)| = |B|^(n-1). When scaling B = kA, remember |kA| = k^n |A|."
    },
    {
      id: "jm-5",
      subject: "Physics",
      topic: "Mechanics — Kinematics Trajectory",
      difficulty: 5.5,
      problem: "A projectile is launched from ground level with speed 20 m/s at θ = 30° to the horizontal. What is its maximum vertical height reached? (g = 9.8 m/s²)",
      options: [
        { id: "A", text: "10.2 m", isCorrect: false, hint: "Remember only the vertical velocity u_y = u sin(30°) = 10 m/s contributes to height." },
        { id: "B", text: "5.1 m", isCorrect: true, hint: "Correct! u_y = 20 × sin(30°) = 10 m/s. H_max = u_y² / (2g) = 100 / 19.6 ≈ 5.1 m." },
        { id: "C", text: "20.4 m", isCorrect: false, hint: "That would be the height if launched vertically at 90°, not 30°!" },
        { id: "D", text: "40.8 m", isCorrect: false, hint: "Check your kinematic equation: v_y² = u_y² - 2gh." }
      ],
      socraticFeedback: "Projectile maximum height is governed purely by the vertical component: H = (u sin θ)² / (2g)."
    },
    {
      id: "jm-6",
      subject: "Physics",
      topic: "Current Electricity — Meter Bridge",
      difficulty: 5.4,
      problem: "In a balanced meter bridge experiment, the null point is obtained at 40 cm from the left end. If a standard resistor of 6 Ω is in the right gap, find the unknown resistance in the left gap.",
      options: [
        { id: "A", text: "9 Ω", isCorrect: false, hint: "At balance, R / S = l₁ / (100 - l₁). Notice l₁ = 40, so 100 - l₁ = 60." },
        { id: "B", text: "4 Ω", isCorrect: true, hint: "Accurate! R / 6 = 40 / (100 - 40) = 40 / 60 = 2/3 ⟹ R = 6 × (2/3) = 4 Ω." },
        { id: "C", text: "6 Ω", isCorrect: false, hint: "If R was 6 Ω, the null point would be at the midpoint 50 cm." },
        { id: "D", text: "2.4 Ω", isCorrect: false, hint: "Check the ratio: R / 6 = 40 / 60." }
      ],
      socraticFeedback: "The Wheatstone bridge condition balances resistance per unit length: R_unknown / R_standard = l / (100 - l)."
    },
    {
      id: "jm-7",
      subject: "Physics",
      topic: "Modern Physics — Photoelectric Effect",
      difficulty: 5.6,
      problem: "The work function of a metal surface is 2.5 eV. Monochromatic light with photon energy 4.0 eV shines on the metal. What is the stopping potential V₀?",
      options: [
        { id: "A", text: "4.0 V", isCorrect: false, hint: "Stopping potential depends on the maximum kinetic energy, not total incident photon energy." },
        { id: "B", text: "1.5 V", isCorrect: true, hint: "Great! Einstein's equation: K_max = hν - Φ = 4.0 - 2.5 = 1.5 eV. Since K_max = e V₀, V₀ = 1.5 V." },
        { id: "C", text: "2.5 V", isCorrect: false, hint: "2.5 V corresponds to the work function threshold." },
        { id: "D", text: "6.5 V", isCorrect: false, hint: "Subtract the work function from incident photon energy, do not add them!" }
      ],
      socraticFeedback: "Stopping potential measures the kinetic energy of the most energetic photoelectrons: e V₀ = hν - Φ."
    },
    {
      id: "jm-8",
      subject: "Physics",
      topic: "Thermodynamics — Carnot Engine Efficiency",
      difficulty: 5.5,
      problem: "A Carnot heat engine operates between temperatures of 500 K and 300 K. If it absorbs 1000 J of heat from the high-temperature reservoir, what is the work produced per cycle?",
      options: [
        { id: "A", text: "600 J", isCorrect: false, hint: "600 J is the heat rejected to the sink Q_c = Q_h × (300/500)." },
        { id: "B", text: "400 J", isCorrect: true, hint: "Spot on! Carnot efficiency η = 1 - T_c/T_h = 1 - 300/500 = 0.40. Work W = η × Q_h = 0.40 × 1000 = 400 J." },
        { id: "C", text: "500 J", isCorrect: false, hint: "Efficiency is (500 - 300) / 500 = 40%, not 50%." },
        { id: "D", text: "200 J", isCorrect: false, hint: "Check your temperature difference: ΔT = 200 K, so η = 200/500." }
      ],
      socraticFeedback: "Carnot efficiency represents the theoretical maximum: η = 1 - T_sink / T_source = W / Q_absorbed."
    },
    {
      id: "jm-9",
      subject: "Chemistry",
      topic: "Chemical Kinetics — First-Order Half-Life",
      difficulty: 5.8,
      problem: "A first-order decomposition reaction has rate constant k = 6.93 × 10⁻³ s⁻¹. How long does it take for the reactant concentration to fall to 25% of its initial value?",
      options: [
        { id: "A", text: "100 s", isCorrect: false, hint: "100 s is the time for ONE half-life (50% remaining)." },
        { id: "B", text: "200 s", isCorrect: true, hint: "Perfect! t_half = 0.693 / (6.93 × 10⁻³) = 100 s. Falling to 25% (1/4 = (1/2)²) takes exactly 2 half-lives = 200 s." },
        { id: "C", text: "150 s", isCorrect: false, hint: "First-order decay is logarithmic: 100% ➔ 50% (100 s) ➔ 25% (another 100 s)." },
        { id: "D", text: "300 s", isCorrect: false, hint: "3 half-lives (300 s) would leave 12.5% reactant." }
      ],
      socraticFeedback: "For any first-order process, each successive half-life reduces the remaining reactant by half: [A] = [A]₀ × (1/2)^n."
    },
    {
      id: "jm-10",
      subject: "Chemistry",
      topic: "Organic Chemistry — Aldol vs Cannizzaro",
      difficulty: 6.0,
      problem: "Which of the following carbonyl compounds does NOT undergo self-aldol condensation when warmed with dilute aqueous NaOH?",
      options: [
        { id: "A", text: "Acetaldehyde (CH₃CHO)", isCorrect: false, hint: "Acetaldehyde has 3 α-hydrogens on the methyl group, readily forming enolate." },
        { id: "B", text: "Acetone (CH₃COCH₃)", isCorrect: false, hint: "Acetone has 6 α-hydrogens, undergoing self-condensation to diacetone alcohol." },
        { id: "C", text: "Benzaldehyde (C₆H₅CHO)", isCorrect: true, hint: "Exactly! Benzaldehyde has no α-hydrogen on the carbonyl carbon; hence it undergoes the Cannizzaro reaction instead!" },
        { id: "D", text: "Propanal (CH₃CH₂CHO)", isCorrect: false, hint: "Propanal has 2 α-hydrogens on the -CH₂- carbon adjacent to -CHO." }
      ],
      socraticFeedback: "Aldol condensation requires enolate formation via α-deprotonation. Carbonyls lacking α-hydrogens undergo Cannizzaro disproportionation."
    },
    {
      id: "jm-11",
      subject: "Chemistry",
      topic: "Inorganic Chemistry — Coordination Magnetic Moment",
      difficulty: 6.4,
      problem: "What is the spin-only magnetic moment of the high-spin complex [Fe(H₂O)₆]²⁺? (Fe atomic number = 26)",
      options: [
        { id: "A", text: "0 BM", isCorrect: false, hint: "Fe²⁺ has 6 d-electrons; H₂O is a weak-field ligand so electrons remain unpaired in high spin." },
        { id: "B", text: "2.84 BM", isCorrect: false, hint: "2.84 BM corresponds to 2 unpaired electrons (e.g. Ni²⁺)." },
        { id: "C", text: "4.90 BM", isCorrect: true, hint: "Excellent! Fe²⁺ is 3d⁶. With weak field H₂O: t₂g⁴ eg², giving n = 4 unpaired electrons. μ = √(4 × 6) = √24 ≈ 4.90 BM." },
        { id: "D", text: "5.92 BM", isCorrect: false, hint: "5.92 BM corresponds to 5 unpaired electrons (Fe³⁺ d⁵)." }
      ],
      socraticFeedback: "Spin-only magnetic moment μ = √(n(n+2)) BM. High-spin d⁶ splits into 4 unpaired electrons in an octahedral weak field."
    },
    {
      id: "jm-12",
      subject: "Mathematics",
      topic: "3D Geometry — Skew Lines Condition",
      difficulty: 6.2,
      problem: "Two non-parallel spatial lines r₁ = a₁ + λ b₁ and r₂ = a₂ + μ b₂ intersect in 3D space if and only if:",
      options: [
        { id: "A", text: "b₁ × b₂ = 0", isCorrect: false, hint: "b₁ × b₂ = 0 is the condition for parallel lines, not intersecting lines." },
        { id: "B", text: "(a₂ - a₁) · (b₁ × b₂) = 0", isCorrect: true, hint: "Correct! The scalar triple product equals zero when the two lines are coplanar, meaning they intersect." },
        { id: "C", text: "a₁ · a₂ = 0", isCorrect: false, hint: "Dot product of position vectors indicates perpendicularity from origin, not intersection." },
        { id: "D", text: "b₁ · b₂ = 0", isCorrect: false, hint: "b₁ · b₂ = 0 means the direction vectors are orthogonal, not necessarily coplanar." }
      ],
      socraticFeedback: "Shortest distance between two lines is d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|. Distance vanishes when the scalar triple product is zero."
    }
  ],

  "JEE Advanced": [
    {
      id: "ja-1",
      subject: "Calculus",
      topic: "Limits & High-Order Taylor Expansion",
      difficulty: 8.8,
      problem: "Evaluate the high-order limit: lim_(x→0) [sin(x) - x + x³/6] / x⁵.",
      options: [
        { id: "A", text: "1 / 24", isCorrect: false, hint: "Recall the Taylor expansion of sin(x): x - x³/3! + x⁵/5! - ..." },
        { id: "B", text: "1 / 120", isCorrect: true, hint: "Flawless! sin(x) = x - x³/6 + x⁵/120 - O(x⁷). Thus [sin(x) - x + x³/6] / x⁵ = 1 / 120." },
        { id: "C", text: "1 / 6", isCorrect: false, hint: "The cubic term cancels out completely with -x³/6." },
        { id: "D", text: "0", isCorrect: false, hint: "The limit is finite and non-zero because the 5th derivative at x = 0 is 1." }
      ],
      socraticFeedback: "In JEE Advanced, high-degree polynomial limits are solved in seconds using Taylor expansions rather than 5 repeated L'Hopital iterations."
    },
    {
      id: "ja-2",
      subject: "Mechanics",
      topic: "Rigid Body Dynamics — Incline Acceleration",
      difficulty: 8.4,
      problem: "A uniform solid cylinder of mass M and radius R rolls without slipping down an incline of angle θ. What is the linear acceleration of its center of mass?",
      options: [
        { id: "A", text: "g sin θ", isCorrect: false, hint: "g sin θ is the acceleration of a frictionless point particle without rotation." },
        { id: "B", text: "(2/3) g sin θ", isCorrect: true, hint: "Brilliant! For rolling without slipping: a = (g sin θ) / (1 + I / MR²). Since I = 1/2 MR², a = (g sin θ) / (1 + 1/2) = (2/3) g sin θ." },
        { id: "C", text: "(1/2) g sin θ", isCorrect: false, hint: "Check the inertia term: 1 + 1/2 = 3/2, which inverts to 2/3." },
        { id: "D", text: "(5/7) g sin θ", isCorrect: false, hint: "(5/7) g sin θ is the acceleration of a solid sphere (I = 2/5 MR²), not a cylinder!" }
      ],
      socraticFeedback: "In pure rolling down an incline, static friction exerts torque that consumes part of gravitational potential energy into rotational inertia."
    },
    {
      id: "ja-3",
      subject: "Electrodynamics",
      topic: "Electromagnetic Induction — Rail with Capacitor",
      difficulty: 9.2,
      problem: "A conducting rod of mass m and length L slides without friction on horizontal rails in a uniform vertical magnetic field B. A capacitor C is connected across the rails. If a constant horizontal force F pulls the rod, what is its acceleration?",
      options: [
        { id: "A", text: "a = F / m", isCorrect: false, hint: "Did you account for the magnetic opposing force F_B = i L B caused by charging current?" },
        { id: "B", text: "a = F / (m + B² L² C)", isCorrect: true, hint: "Mastery! EMF = BLv, charge q = CBLv, current i = dq/dt = CBLa. Magnetic drag F_mag = iLB = (B²L²C)a. F - F_mag = ma ⟹ a = F / (m + B²L²C)." },
        { id: "C", text: "a = F / (m - B² L² C)", isCorrect: false, hint: "Lenz's law opposes motion, so the inertia term must add, not subtract!" },
        { id: "D", text: "a = F / (B² L² C)", isCorrect: false, hint: "Mass m of the rod cannot be neglected." }
      ],
      socraticFeedback: "The capacitor dynamically stores energy from the rod's kinetic work, manifesting as an effective 'electro-magnetic mass' equal to B² L² C."
    },
    {
      id: "ja-4",
      subject: "Calculus",
      topic: "Differential Equations — Integrating Factor",
      difficulty: 8.6,
      problem: "Find the general solution to the first-order differential equation x (dy/dx) + 2y = x² ln(x) for x > 0.",
      options: [
        { id: "A", text: "y = (x²/4) ln(x) - x²/16 + C/x²", isCorrect: true, hint: "Outstanding! Rewrite as dy/dx + (2/x)y = x ln(x). IF = e^(∫ 2/x dx) = x². Then y x² = ∫ x³ ln(x) dx = (x⁴/4) ln(x) - x⁴/16 + C." },
        { id: "B", text: "y = x² ln(x) - x² + C", isCorrect: false, hint: "Integrating factor is x², so divide the integral result by x²." },
        { id: "C", text: "y = (x²/2) ln(x) - x²/4 + C", isCorrect: false, hint: "Check your integration by parts on ∫ x³ ln(x) dx: u = ln(x), dv = x³ dx." },
        { id: "D", text: "y = ln(x)/x² + C", isCorrect: false, hint: "Check the degree of x in the particular solution." }
      ],
      socraticFeedback: "Dividing by x puts the ODE into standard linear form dy/dx + P(x)y = Q(x), solved via integrating factor IF = exp(∫ P dx)."
    },
    {
      id: "ja-5",
      subject: "Organic Chemistry",
      topic: "Reaction Mechanisms — Pinacol Rearrangement",
      difficulty: 8.9,
      problem: "When 1-methylcyclohexane-1,2-diol is heated with concentrated H₂SO₄, pinacol-pinacolone rearrangement occurs. What is the major product?",
      options: [
        { id: "A", text: "1-Methylcyclohexan-2-one", isCorrect: false, hint: "Protonation occurs at the tertiary -OH because it yields the more stable 3° carbocation intermediate." },
        { id: "B", text: "2-Methylcyclohexanone", isCorrect: true, hint: "Exact! Tertiary 1-OH is protonated and leaves as H₂O to form a 3° carbocation at C1. A 1,2-hydride shift from C2 generates the resonance-stabilized oxonium ion, yielding 2-methylcyclohexanone." },
        { id: "C", text: "Cycloheptanone", isCorrect: false, hint: "Ring expansion is less favorable here because a simple 1,2-hydride shift directly yields the resonance-stabilized carbonyl." },
        { id: "D", text: "2,2-Dimethylcyclopentanone", isCorrect: false, hint: "Ring contraction to a 5-membered ring is energetically less favorable than a hydride shift." }
      ],
      socraticFeedback: "Carbocation formation is regioselective for the tertiary hydroxyl, followed by a thermodynamically driven 1,2-hydride shift to form the C=O double bond."
    },
    {
      id: "ja-6",
      subject: "Thermodynamics",
      topic: "Real Gas — van der Waals Inversion Temperature",
      difficulty: 9.0,
      problem: "For a gas obeying the van der Waals equation (P + a/V²)(V - b) = RT, what is the Boyle temperature T_B at which the second virial coefficient vanishes?",
      options: [
        { id: "A", text: "T_B = a / (R b)", isCorrect: true, hint: "Precision! Expanding Z = 1 + (b - a/(RT))(1/V) + ... Setting the second virial coefficient b - a/(RT) = 0 yields T_B = a / (Rb)." },
        { id: "B", text: "T_B = 2a / (R b)", isCorrect: false, hint: "2a / (Rb) is the Joule-Thomson inversion temperature T_i, which is twice the Boyle temperature!" },
        { id: "C", text: "T_B = 8a / (27 R b)", isCorrect: false, hint: "8a / (27 R b) is the Critical Temperature T_c, not the Boyle temperature." },
        { id: "D", text: "T_B = a / (2 R b)", isCorrect: false, hint: "Check your virial expansion terms." }
      ],
      socraticFeedback: "At the Boyle temperature T_B = a / (Rb), attractive molecular forces (a) precisely balance repulsive excluded volume (b) over moderate pressures."
    },
    {
      id: "ja-7",
      subject: "Wave Optics",
      topic: "Interference — Thin Sheet Fringe Shift",
      difficulty: 8.3,
      problem: "In Young's double slit experiment, inserting a transparent mica sheet of refractive index μ = 1.6 in front of one slit shifts the fringe pattern by 6 bright fringe widths (λ = 500 nm). What is the thickness of the sheet?",
      options: [
        { id: "A", text: "3.0 μm", isCorrect: false, hint: "Optical path difference introduced is Δx = (μ - 1) t. Equate to 6λ." },
        { id: "B", text: "5.0 μm", isCorrect: true, hint: "Flawless! Optical path introduced is (μ - 1) t = 6 λ ⟹ (1.6 - 1) t = 6 × 500 nm ⟹ 0.6 t = 3000 nm ⟹ t = 5000 nm = 5.0 μm." },
        { id: "C", text: "2.5 μm", isCorrect: false, hint: "Check: 3000 / 0.6 = 5000 nm, not 2500 nm." },
        { id: "D", text: "6.0 μm", isCorrect: false, hint: "Did you divide 3000 nm by (μ - 1) = 0.6?" }
      ],
      socraticFeedback: "Introducing a transparent plate of thickness t increases optical path length by (μ - 1)t, shifting the central white fringe by Δy = D(μ - 1)t / d."
    },
    {
      id: "ja-8",
      subject: "Calculus",
      topic: "Definite Integration — Leibniz Rule & Series",
      difficulty: 9.4,
      problem: "Let f(x) = ∫₀^x [t² / √(1 + t⁴)] dt. Evaluate the limit: lim_(x→0) [f(x) - x³/3] / x⁷.",
      options: [
        { id: "A", text: "-1 / 14", isCorrect: true, hint: "Extraordinary! By binomial expansion: (1 + t⁴)^(-1/2) = 1 - (1/2)t⁴ + ... Integrand is t² - (1/2)t⁶. Integrating: f(x) = x³/3 - x⁷/14 + ... Hence [f(x) - x³/3]/x⁷ = -1/14." },
        { id: "B", text: "1 / 14", isCorrect: false, hint: "The binomial coefficient of (1+u)^(-1/2) is -1/2, so the sign must be negative." },
        { id: "C", text: "-1 / 7", isCorrect: false, hint: "Remember the integral of t⁶ is t⁷ / 7, multiplied by (-1/2) gives -1/14." },
        { id: "D", text: "0", isCorrect: false, hint: "The cubic term is subtracted, leaving the non-zero septic term x⁷." }
      ],
      socraticFeedback: "Expanding the integrand into a power series before integrating converts complex integral limits into elementary polynomial evaluations."
    },
    {
      id: "ja-9",
      subject: "Inorganic Chemistry",
      topic: "Coordination Chemistry — Jahn-Teller Distortion",
      difficulty: 8.7,
      problem: "Which of the following octahedral transition metal complexes displays significant Jahn-Teller distortion due to asymmetric electron distribution in eg orbitals?",
      options: [
        { id: "A", text: "[Cr(H₂O)₆]³⁺ (d³)", isCorrect: false, hint: "Cr³⁺ has configuration t₂g³ eg⁰, which is half-filled and completely symmetrical." },
        { id: "B", text: "[Mn(H₂O)₆]²⁺ (high spin d⁵)", isCorrect: false, hint: "High-spin d⁵ has configuration t₂g³ eg², completely spherically symmetrical." },
        { id: "C", text: "[Cu(H₂O)₆]²⁺ (d⁹)", isCorrect: true, hint: "Bingo! Cu²⁺ has d⁹ configuration: t₂g⁶ eg³. The asymmetric occupancy of eg (dz² vs dx²-y²) causes pronounced tetragonal elongation along the z-axis!" },
        { id: "D", text: "[Fe(CN)₆]⁴⁻ (low spin d⁶)", isCorrect: false, hint: "Low-spin Fe²⁺ is t₂g⁶ eg⁰, with completely filled t₂g and empty eg." }
      ],
      socraticFeedback: "Jahn-Teller theorem states any non-linear molecular system in a degenerate electronic state will undergo geometrical distortion to remove degeneracy."
    },
    {
      id: "ja-10",
      subject: "Mechanics",
      topic: "Rotation & Dynamics — Vertical Rod Hinge Force",
      difficulty: 9.1,
      problem: "A uniform rod of length L and mass M is hinged at one end and released from rest in a horizontal position. What is the horizontal component of the reaction force at the hinge as it passes the vertical position?",
      options: [
        { id: "A", text: "0", isCorrect: true, hint: "Brilliant insight! In the vertical position, gravity acts purely along the rod (zero torque about hinge). Therefore angular acceleration α = 0. Tangential acceleration of CM is zero, meaning net horizontal force is zero!" },
        { id: "B", text: "Mg / 2", isCorrect: false, hint: "Torque about the pivot is τ = Mg(L/2) sin(0°) = 0, so horizontal acceleration is zero." },
        { id: "C", text: "3Mg / 2", isCorrect: false, hint: "Centripetal acceleration is purely vertical, contributing only to the vertical reaction force." },
        { id: "D", text: "3Mg", isCorrect: false, hint: "The vertical reaction force is (5/2)Mg, but the question specifically asks for the horizontal component!" }
      ],
      socraticFeedback: "Always decompose forces into tangential and radial axes: horizontal acceleration requires non-zero angular acceleration, which vanishes at vertical orientation."
    },
    {
      id: "ja-11",
      subject: "Mathematics",
      topic: "Probability & Combinatorics — Derangements",
      difficulty: 8.5,
      problem: "Five addressed letters are placed randomly into five corresponding envelopes. What is the exact probability that exactly two letters are placed into their correct envelopes?",
      options: [
        { id: "A", text: "1 / 6", isCorrect: true, hint: "Perfect! Ways to choose 2 correct letters: C(5,2) = 10. Remaining 3 letters must be deranged: D₃ = 3!(1 - 1 + 1/2! - 1/3!) = 2. Favorable = 10 × 2 = 20. Total = 5! = 120. P = 20/120 = 1/6." },
        { id: "B", text: "1 / 12", isCorrect: false, hint: "Check the number of derangements of 3 objects: D₃ = 2." },
        { id: "C", text: "1 / 24", isCorrect: false, hint: "Did you forget the combination factor C(5, 2) = 10?" },
        { id: "D", text: "1 / 4", isCorrect: false, hint: "Favorable outcomes are 20 out of 120." }
      ],
      socraticFeedback: "Problems of partial matching require combining selection C(n, k) with derangement D_(n-k) of the remaining mismatched items."
    },
    {
      id: "ja-12",
      subject: "Electrodynamics",
      topic: "Magnetism — Concentric Loops Mutual Inductance",
      difficulty: 8.9,
      problem: "Two concentric coplanar circular single-turn loops of radii R and r (where r ≪ R) carry currents. What is the mutual inductance M between the two loops?",
      options: [
        { id: "A", text: "M = (μ₀ π r²) / (2 R)", isCorrect: true, hint: "Mastery! Current I in the outer loop generates center magnetic field B = μ₀ I / (2R). Since r ≪ R, field is uniform over inner loop. Flux Φ = B (π r²) = (μ₀ π r² I)/(2R). Thus M = Φ/I = (μ₀ π r²)/(2R)." },
        { id: "B", text: "M = (μ₀ π R²) / (2 r)", isCorrect: false, hint: "Mutual inductance must depend on the area of the smaller loop, not the larger one!" },
        { id: "C", text: "M = (μ₀ r²) / (4 R)", isCorrect: false, hint: "Check the area factor: π r² and the center field formula μ₀ I / (2R)." },
        { id: "D", text: "M = (μ₀ π r) / (2 R²)", isCorrect: false, hint: "Dimensionally check inductance: Henry = Wb / A." }
      ],
      socraticFeedback: "By reciprocity theorem M₁₂ = M₂₁. It is always simpler to compute flux through the small loop produced by the larger loop's center field."
    }
  ],

  "NEET UG": [
    {
      id: "nu-1",
      subject: "Biology",
      topic: "Molecular Basis of Inheritance — Lac Operon",
      difficulty: 5.8,
      problem: "In the Lac operon of Escherichia coli, lactose (allolactose) functions as an inducer by binding directly to which regulatory component?",
      options: [
        { id: "A", text: "Promoter gene (P)", isCorrect: false, hint: "RNA polymerase binds to the promoter gene, not the inducer molecule." },
        { id: "B", text: "Operator gene (O)", isCorrect: false, hint: "The repressor binds to the operator, blocking RNA polymerase." },
        { id: "C", text: "Repressor protein", isCorrect: true, hint: "Correct! Lactose acts as an inducer by binding to the active repressor protein, causing a conformational change that prevents it from binding to the operator gene." },
        { id: "D", text: "RNA Polymerase", isCorrect: false, hint: "RNA polymerase transcribes the structural genes z, y, and a." }
      ],
      socraticFeedback: "Allolactose inactivates the repressor through allosteric conformational shift, freeing the operator and allowing transcription."
    },
    {
      id: "nu-2",
      subject: "Biology",
      topic: "Genetics — Dihybrid Test Cross Ratio",
      difficulty: 5.2,
      problem: "In a classical test cross of a dihybrid heterozygous pea plant (AaBb × aabb), what is the expected phenotypic ratio of progeny assuming independent assortment?",
      options: [
        { id: "A", text: "9 : 3 : 3 : 1", isCorrect: false, hint: "9:3:3:1 is the phenotypic ratio of a dihybrid self-cross (AaBb × AaBb), not a test cross!" },
        { id: "B", text: "1 : 1 : 1 : 1", isCorrect: true, hint: "Spot on! The heterozygous parent AaBb produces 4 gamete types (AB, Ab, aB, ab) in equal 1:1:1:1 proportion, while the tester aabb produces only ab gametes." },
        { id: "C", text: "3 : 1", isCorrect: false, hint: "3:1 is a monohybrid F2 phenotypic ratio." },
        { id: "D", text: "1 : 2 : 1", isCorrect: false, hint: "1:2:1 is a monohybrid genotypic ratio." }
      ],
      socraticFeedback: "A test cross with a homozygous double recessive individual directly reveals the parental gametic output proportions."
    },
    {
      id: "nu-3",
      subject: "Biology",
      topic: "Plant Physiology — Calvin Cycle Energetics",
      difficulty: 6.2,
      problem: "How many molecules of ATP and NADPH are consumed to synthesize one net molecule of Glucose (C₆H₁₂O₆) in the Calvin (C₃) cycle?",
      options: [
        { id: "A", text: "12 ATP and 12 NADPH", isCorrect: false, hint: "12 ATP is consumed in reduction, but regeneration of 6 RuBP consumes additional ATP!" },
        { id: "B", text: "18 ATP and 12 NADPH", isCorrect: true, hint: "Flawless! For 1 CO₂: 2 ATP (reduction) + 1 ATP (regeneration) = 3 ATP, and 2 NADPH. To form 1 glucose (6 CO₂): 6 × 3 = 18 ATP and 6 × 2 = 12 NADPH." },
        { id: "C", text: "36 ATP and 24 NADPH", isCorrect: false, hint: "Do not confuse Calvin cycle consumption with cellular respiration ATP yield." },
        { id: "D", text: "18 ATP and 18 NADPH", isCorrect: false, hint: "Regeneration of RuBP requires ATP only, not NADPH." }
      ],
      socraticFeedback: "Every turn of the C₃ cycle consumes 3 ATP and 2 NADPH. Multiplying by 6 turns gives 18 ATP and 12 NADPH per hexose."
    },
    {
      id: "nu-4",
      subject: "Biology",
      topic: "Human Physiology — Medullary Osmotic Gradient",
      difficulty: 5.9,
      problem: "The osmotic concentration gradient in the renal medullary interstitium (from 300 to 1200 mOsmol/L) is primarily established and maintained by which two solutes?",
      options: [
        { id: "A", text: "Glucose and Urea", isCorrect: false, hint: "Glucose is completely reabsorbed in the proximal convoluted tubule (PCT)." },
        { id: "B", text: "NaCl and Urea", isCorrect: true, hint: "Accurate! The counter-current mechanism between the loop of Henle (transporting NaCl) and collecting duct (recycling urea into medullary interstitium) maintains the gradient." },
        { id: "C", text: "NaCl and Potassium", isCorrect: false, hint: "Potassium is primarily regulated via secretion in DCT and collecting duct." },
        { id: "D", text: "Creatinine and Uric Acid", isCorrect: false, hint: "Creatinine and uric acid are waste products excreted in urine." }
      ],
      socraticFeedback: "The counter-current multiplier in the loop of Henle and counter-current exchanger in vasa recta concentrate NaCl and urea to draw water out of collecting tubules."
    },
    {
      id: "nu-5",
      subject: "Chemistry",
      topic: "Organic Chemistry — Kharasch Peroxide Effect",
      difficulty: 5.6,
      problem: "What is the major product obtained when Propene (CH₃-CH=CH₂) is reacted with HBr in the presence of Benzoyl Peroxide?",
      options: [
        { id: "A", text: "2-Bromopropane", isCorrect: false, hint: "In the presence of peroxides, addition occurs via free radicals (Anti-Markovnikov), not carbocations!" },
        { id: "B", text: "1-Bromopropane", isCorrect: true, hint: "Exact! The peroxide effect causes free-radical addition where Br• attacks the terminal C=C carbon to yield the more stable 2° radical intermediate, giving 1-bromopropane." },
        { id: "C", text: "1,2-Dibromopropane", isCorrect: false, hint: "Dibromoalkane requires elemental Br₂, not HBr!" },
        { id: "D", text: "2,2-Dibromopropane", isCorrect: false, hint: "Only a single addition of HBr takes place across the alkene." }
      ],
      socraticFeedback: "The peroxide effect operates strictly for HBr because both propagation steps are exothermic, whereas for HCl and HI one step is endothermic."
    },
    {
      id: "nu-6",
      subject: "Chemistry",
      topic: "Solutions — Freezing Point Depression & van 't Hoff",
      difficulty: 6.0,
      problem: "Which of the following 0.10 M aqueous solutions will show the lowest freezing point?",
      options: [
        { id: "A", text: "0.10 M Glucose", isCorrect: false, hint: "Glucose is non-electrolyte: i = 1, effective concentration = 0.10 M." },
        { id: "B", text: "0.10 M NaCl", isCorrect: false, hint: "NaCl dissociates into 2 ions: i = 2, effective concentration = 0.20 M." },
        { id: "C", text: "0.10 M CaCl₂", isCorrect: false, hint: "CaCl₂ dissociates into 3 ions: i = 3, effective concentration = 0.30 M." },
        { id: "D", text: "0.10 M Al₂(SO₄)₃", isCorrect: true, hint: "Perfect! Depression in freezing point ΔT_f = i K_f m. Al₂(SO₄)₃ gives 2 Al³⁺ + 3 SO₄²⁻ (i = 5). Highest ΔT_f produces the lowest freezing point!" }
      ],
      socraticFeedback: "Colligative properties depend on the total number of solute particles: larger van 't Hoff factor i produces greater freezing point depression."
    },
    {
      id: "nu-7",
      subject: "Chemistry",
      topic: "Equilibrium — Buffer Solution pH Calculation",
      difficulty: 5.3,
      problem: "What is the pH of an equimolar buffer solution containing 0.1 M CH₃COOH and 0.1 M CH₃COONa? (pK_a of acetic acid = 4.74)",
      options: [
        { id: "A", text: "7.00", isCorrect: false, hint: "An equimolar weak acid / conjugate base buffer does not neutralize to 7." },
        { id: "B", text: "4.74", isCorrect: true, hint: "Spot on! Henderson-Hasselbalch equation: pH = pK_a + log([Salt]/[Acid]). Since [Salt] = [Acid] = 0.1 M, log(1) = 0 ⟹ pH = pK_a = 4.74." },
        { id: "C", text: "5.74", isCorrect: false, hint: "pH would be 5.74 if the salt to acid ratio were 10:1." },
        { id: "D", text: "3.74", isCorrect: false, hint: "pH would be 3.74 if the acid to salt ratio were 10:1." }
      ],
      socraticFeedback: "When conjugate acid and base concentrations are equal in a buffer, pH equals pK_a exactly."
    },
    {
      id: "nu-8",
      subject: "Chemistry",
      topic: "Inorganic Chemistry — Lanthanoid Contraction",
      difficulty: 5.7,
      problem: "The atomic and covalent radii of Zirconium (Zr, 4d) and Hafnium (Hf, 5d) are virtually identical (160 pm vs 159 pm) due to:",
      options: [
        { id: "A", text: "Diagonal relationship", isCorrect: false, hint: "Diagonal relationship occurs in second and third periods (e.g. Li-Mg, Be-Al)." },
        { id: "B", text: "Lanthanoid contraction", isCorrect: true, hint: "Great! Filling of the 4f subshell before the 5d series introduces 14 poorly shielding f-electrons, increasing effective nuclear charge and neutralizing the expected group size expansion." },
        { id: "C", text: "Similar electronic configuration", isCorrect: false, hint: "Zr is [Kr] 4d² 5s² while Hf has a filled 4f¹⁴ shell." },
        { id: "D", text: "Inert pair effect", isCorrect: false, hint: "Inert pair effect pertains to reluctance of s-electrons to bond in heavier p-block elements." }
      ],
      socraticFeedback: "Poor shielding of 4f electrons causes continuous shrinkage in atomic radii across lanthanoids, making 4d and 5d row congeners identical in size."
    },
    {
      id: "nu-9",
      subject: "Physics",
      topic: "Ray Optics — Lens Immersed in Liquid",
      difficulty: 6.4,
      problem: "A biconvex glass lens (refractive index μ_g = 1.5) has focal length 20 cm in air. What will be its new focal length when completely immersed in water (μ_w = 4/3)?",
      options: [
        { id: "A", text: "20 cm", isCorrect: false, hint: "Focal length increases significantly because the relative refractive index difference decreases." },
        { id: "B", text: "40 cm", isCorrect: false, hint: "Check the ratio: (1.5 - 1) / (1.5 / (4/3) - 1)." },
        { id: "C", text: "80 cm", isCorrect: true, hint: "Outstanding! 1/f_air = (1.5 - 1) K = 0.5 K. In water: 1/f_w = (1.5 / (4/3) - 1) K = (9/8 - 1) K = (1/8) K. f_w / f_air = 0.5 / (1/8) = 4 ⟹ f_w = 4 × 20 = 80 cm." },
        { id: "D", text: "-80 cm", isCorrect: false, hint: "The focal length remains positive since μ_glass > μ_water." }
      ],
      socraticFeedback: "Lens maker's formula 1/f = (μ_lens/μ_medium - 1)(1/R₁ - 1/R₂). Decreasing optical contrast quadruples focal length in water."
    },
    {
      id: "nu-10",
      subject: "Physics",
      topic: "Fluid Mechanics — Terminal Velocity Ratio",
      difficulty: 5.5,
      problem: "Two spherical raindrops of radii r and 2r fall through still air under viscous Stokes drag. What is the ratio of their terminal velocities v₁ / v₂?",
      options: [
        { id: "A", text: "1 : 2", isCorrect: false, hint: "Terminal velocity depends on r², not r." },
        { id: "B", text: "1 : 4", isCorrect: true, hint: "Correct! Stokes' Law terminal velocity: v_t = 2 r² (ρ - σ) g / (9 η) ∝ r². Thus v₁ / v₂ = (r / 2r)² = 1 / 4." },
        { id: "C", text: "1 : 8", isCorrect: false, hint: "Mass scales with r³, but drag scales with r, leaving v_t scaling as r²." },
        { id: "D", text: "1 : √2", isCorrect: false, hint: "Check Stokes' balance: 6πηrv = mg = (4/3)πr³ρg." }
      ],
      socraticFeedback: "Terminal velocity equates gravity force ((4/3)πr³ρg) with viscous drag (6πηrv_t), yielding v_t proportional to the square of the radius."
    },
    {
      id: "nu-11",
      subject: "Physics",
      topic: "Oscillations & SHM — Kinetic & Potential Energy",
      difficulty: 5.0,
      problem: "A particle executes simple harmonic motion of amplitude A. At what displacement x from the mean position does its kinetic energy equal its potential energy?",
      options: [
        { id: "A", text: "x = A / 2", isCorrect: false, hint: "At x = A/2, PE is 1/4 of total energy, so KE is 3/4." },
        { id: "B", text: "x = A / √2", isCorrect: true, hint: "Exact! PE = 1/2 k x² and KE = 1/2 k (A² - x²). Equating them: x² = A² - x² ⟹ 2x² = A² ⟹ x = A / √2." },
        { id: "C", text: "x = A / 4", isCorrect: false, hint: "Check your energy formula: total mechanical energy is 1/2 k A²." },
        { id: "D", text: "x = A √3 / 2", isCorrect: false, hint: "At x = A √3 / 2, PE is 3/4 and KE is 1/4." }
      ],
      socraticFeedback: "In SHM, energy oscillates between kinetic and potential, matching exactly at x = ± A / √2 ≈ 0.707 A."
    },
    {
      id: "nu-12",
      subject: "Biology",
      topic: "Biotechnology — Restriction Endonuclease Cleavage",
      difficulty: 5.4,
      problem: "The restriction endonuclease enzyme EcoRI recognizes and cleaves which specific palindromic DNA sequence?",
      options: [
        { id: "A", text: "5'-GAATTC-3'", isCorrect: true, hint: "Flawless! EcoRI recognizes the hexanucleotide sequence 5'-G↓AATTC-3' and cleaves between G and A, producing sticky cohesive ends." },
        { id: "B", text: "5'-GGATCC-3'", isCorrect: false, hint: "5'-GGATCC-3' is the recognition site for BamHI." },
        { id: "C", text: "5'-AAGCTT-3'", isCorrect: false, hint: "5'-AAGCTT-3' is the recognition sequence for HindIII." },
        { id: "D", text: "5'-CTGCAG-3'", isCorrect: false, hint: "5'-CTGCAG-3' is the recognition sequence for PstI." }
      ],
      socraticFeedback: "Restriction enzymes recognize specific palindromic base sequences with twofold rotational symmetry, cleaving phosphodiester backbones."
    }
  ]
};
