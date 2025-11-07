# EV CAR LISTING WEBSITE - CLAUDE CODE PROMPTS
## Sequential Implementation with Framer Motion Animations

---

## 📋 PROMPT 1: Project Setup, Theme System, Mock Data & Framer Motion

```
Create a Next.js 14+ EV car listing website with TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.
The design should be premium, cinematic, and modern with smooth animations throughout.

PROJECT STRUCTURE:
ev-car-listing/
├── app/
│   ├── page.tsx
│   ├── car/[id]/page.tsx
│   ├── compare/page.tsx
│   ├── find-your-ev/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn)
│   ├── theme/
│   ├── car/
│   └── layout/
├── lib/
│   ├── mock-data.ts
│   ├── types.ts
│   ├── utils.ts
│   └── animations.ts
└── public/
    └── assets/ (car-1.jpg to car-10.jpg)

SETUP STEPS:

1. Initialize:
```bash
npx create-next-app@latest ev-car-listing --typescript --tailwind --app
cd ev-car-listing
npx shadcn-ui@latest init
npm install next-themes lucide-react framer-motion
npx shadcn-ui@latest add button card badge select dialog tabs separator scroll-area radio-group
```

2. Create lib/types.ts:
```typescript
export interface EVCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  category: 'Sedan' | 'SUV' | 'Hatchback' | 'Crossover';
  specs: {
    range: number; // km
    battery: number; // kWh
    charging: string;
    topSpeed: number; // km/h
    acceleration: string; // 0-100 km/h
    seats: number;
    power: number; // hp
  };
  features: string[];
  description: string;
}

export interface UserPreferences {
  budget: string;
  carType: string;
  range: string;
  usage: string;
  features: string[];
  seating: string;
  charging: string;
  brand: string;
  performance: string;
  priority: string;
}
```

3. Create lib/mock-data.ts with 10 real EV cars (Tesla Model 3, BYD Atto 3, Nissan Leaf, Hyundai Ioniq 5, VW ID.4, Kia EV6, Polestar 2, MG ZS EV, BMW iX, Chevy Bolt EUV) - use images /assets/car-1.jpg to car-10.jpg

4. Create lib/animations.ts:
```typescript
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};
```

5. Setup theme provider with next-themes (dark theme default)
6. Create ThemeToggle component with Framer Motion hover effects
7. Update tailwind.config for dark mode
```

---

## 📋 PROMPT 2: Homepage with Animated Grid & Filters

```
Create homepage with premium animated grid layout using Framer Motion.

HOMEPAGE (app/page.tsx):
- Animated header (slides down)
- Hero section with floating particles
- Filter bar (category + price range)
- Stagger animated car grid (3 columns desktop)
- Empty state animation

COMPONENTS:

1. Header.tsx:
   - Sticky header with backdrop blur
   - Logo with rotation animation on hover
   - Navigation links
   - "Get Recommendations" CTA button
   - Theme toggle

2. Hero.tsx:
   - Gradient background (blue->purple->pink)
   - Animated heading (fade in + slide)
   - Description text with delay
   - Two CTA buttons with hover scale
   - 5 floating particle animations
   - Gradient overlay from bottom

3. FilterBar.tsx:
   - Two select dropdowns (Category, Price Range)
   - Filter icon
   - Smooth fade-in animation
   - Updates grid in real-time

4. CarCard.tsx:
   - Card lifts on hover (y: -8)
   - Image zooms on hover
   - Badge slides in from right
   - Price fades in
   - Specs with individual hover scales
   - Button with arrow that slides right on hover
   - Use shadcn Card, Badge, Button

ANIMATIONS:
- Header: initial={{ y: -100 }}, animate={{ y: 0 }}
- Grid: Stagger children animation
- Cards: Lift on hover, image zoom
- Particles: Random floating motion with opacity pulse

STYLING:
- Dark theme default
- Premium glassmorphism effects
- Generous spacing
- Smooth transitions (duration: 0.3-0.5s)
```

---

## 📋 PROMPT 3: Car Detail Page with Animated Specs

```
Create detailed car page with tabs, full specs, and comparison option.

CAR DETAIL PAGE (app/car/[id]/page.tsx):

LAYOUT:
- Back button (top-left, animated)
- Hero image section (full-width, parallax effect)
- Car name + price (fade in)
- Category badge
- Tabs: Overview, Specs, Features
- "Compare This Car" sticky button

COMPONENTS:

1. CarDetailHero.tsx:
   - Large image (800px height)
   - Parallax scroll effect with Framer Motion
   - Overlay gradient
   - Car name + brand (stagger animation)
   - Price with scale-in animation
   - Category badge

2. CarTabs.tsx (use shadcn Tabs):
   
   OVERVIEW TAB:
   - Description paragraph
   - Key highlights (4 boxes grid)
   - Each box: Icon, Value, Label
   - Stagger fade-in animation
   
   SPECS TAB:
   - Specifications grid (2 columns)
   - Each spec: Label + Value
   - Progress bars for battery/range
   - Animated on tab switch
   - Use Gauge, Battery, Zap, Users icons
   
   FEATURES TAB:
   - Features list (3 columns)
   - Each feature: Checkmark + Text
   - Stagger animation
   - Hover effect (scale + glow)

3. CompareButton.tsx:
   - Sticky bottom-right
   - "Compare This Car" text
   - GitCompare icon
   - Pulse animation
   - Click navigates to /compare?car1={id}

ANIMATIONS:
- Hero image: useScroll + useTransform for parallax
- Tabs content: AnimatePresence for smooth transitions
- Specs: Stagger reveal on mount
- Features: Grid stagger with scale effect
- Button: Continuous pulse animation

RESPONSIVE:
- Mobile: Single column, smaller image
- Tablet: 2-column specs
- Desktop: Full layout
```

---

## 📋 PROMPT 4: Compare Page (Side-by-Side)

```
Create comparison page for two EV cars side-by-side.

COMPARE PAGE (app/compare/page.tsx):

FEATURES:
- Select 2 cars using dropdowns
- Side-by-side comparison table
- Highlight better specs in green
- Animated transitions when changing cars
- "Winner" indicators

LAYOUT:
```
┌─────────────┬─────────────┐
│   Car 1     │   Car 2     │
│  Selector   │  Selector   │
├─────────────┼─────────────┤
│   Image     │   Image     │
├─────────────┼─────────────┤
│   Specs     │   Specs     │
│  (table)    │  (table)    │
└─────────────┴─────────────┘
```

COMPONENTS:

1. CarSelector.tsx:
   - Two select dropdowns (left & right)
   - "vs" text in center
   - Swap button (switch cars)
   - AnimatePresence for car changes

2. ComparisonTable.tsx:
   - Rows: Price, Range, Battery, Charging, Top Speed, Acceleration, Seats, Power
   - Columns: Spec Name | Car 1 Value | Car 2 Value
   - Highlight better value with green bg
   - Trophy icon for winner in each category
   - Stagger reveal animation

3. WinnerBadge.tsx:
   - Shows which car "wins" overall
   - Counts better specs
   - Animated crown icon
   - Pulse effect

COMPARISON LOGIC:
```typescript
const compareSpecs = (car1: EVCar, car2: EVCar) => {
  // Compare each spec
  // Return winner for each category
  // Higher range = better
  // Lower price = better
  // Faster acceleration = better
};
```

ANIMATIONS:
- Car change: Fade out old, fade in new
- Table rows: Stagger from top
- Winner highlights: Scale + glow effect
- Swap button: Rotate 180deg on click

STYLING:
- Clean table design
- Green highlights for winners
- Red/neutral for losers
- Responsive: Stack on mobile
```

---

## 📋 PROMPT 5: Find Your EV (Preference Form & Recommendations)

```
Create preference form (10 questions) with AI-like recommendations.

FIND YOUR EV PAGE (app/find-your-ev/page.tsx):

FLOW:
1. Show form with 10 questions
2. User fills preferences
3. Click "Find My Perfect EV"
4. Animated loading (2 seconds)
5. Show 3-4 recommended cars
6. Ability to compare from recommendations

10 QUESTIONS (use shadcn RadioGroup, Select):

1. What's your budget?
   - Under $30,000
   - $30,000 - $50,000
   - Over $50,000
   - No budget limit

2. Preferred car type?
   - Sedan
   - SUV  
   - Hatchback
   - Crossover

3. Minimum range needed?
   - Under 300km
   - 300-400km
   - 400-500km
   - Over 500km

4. Primary usage?
   - City driving
   - Highway commute
   - Mixed usage
   - Long road trips

5. Must-have features? (multi-select)
   - Autopilot/Self-driving
   - Fast charging
   - Panoramic roof
   - Premium audio
   - 360° camera

6. How many seats?
   - 5 seats
   - 7+ seats

7. Charging preference?
   - Home charging (overnight)
   - Fast charging (30 mins)
   - Don't mind either

8. Preferred brand? (select)
   - Tesla
   - BYD
   - Nissan
   - Hyundai
   - Any

9. Performance priority?
   - Economy/Efficiency
   - Balanced
   - High performance

10. What matters most?
    - Range
    - Price
    - Features
    - Brand
    - Performance

COMPONENTS:

1. PreferenceForm.tsx:
   - 10 question cards
   - Each card: fade-in animation
   - Progress indicator (1/10, 2/10...)
   - "Find My EV" submit button
   - Form validation

2. LoadingAnimation.tsx:
   - Car icon bouncing
   - "Analyzing preferences..." text
   - Progress bar animation
   - 3 dots pulsing
   - 2 second duration

3. RecommendationResults.tsx:
   - Header: "We found X perfect matches!"
   - Grid of 3-4 recommended cards
   - Each card shows: Image, Name, Price, Match Score (85%)
   - "Why we recommend this" explanation
   - CTA buttons: "View Details", "Add to Compare"
   - Stagger reveal animation

RECOMMENDATION LOGIC (lib/recommendations.ts):
```typescript
export const getRecommendations = (prefs: UserPreferences): EVCar[] => {
  let scored = mockEVCars.map(car => ({
    car,
    score: calculateScore(car, prefs)
  }));
  
  // Sort by score, return top 3-4
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.car);
};

const calculateScore = (car: EVCar, prefs: UserPreferences): number => {
  let score = 0;
  
  // Budget match (+30 points)
  if (matchesBudget(car.price, prefs.budget)) score += 30;
  
  // Category match (+20 points)
  if (car.category === prefs.carType) score += 20;
  
  // Range match (+20 points)
  if (matchesRange(car.specs.range, prefs.range)) score += 20;
  
  // Feature matches (+5 per feature)
  prefs.features.forEach(f => {
    if (car.features.some(cf => cf.includes(f))) score += 5;
  });
  
  // Brand preference (+15 points)
  if (prefs.brand === car.brand) score += 15;
  
  return score;
};
```

ANIMATIONS:
- Questions: Fade-in one by one (stagger)
- Submit button: Ripple effect on click
- Loading: Smooth transition to loading state
- Results: Slide up with stagger
- Match score: Count-up animation (0% -> 85%)

COMPARISON FEATURE:
- Checkboxes to select cars
- "Compare Selected" floating button
- Navigate to /compare with selected IDs
- Pass via URL params: /compare?car1=1&car2=3

RESPONSIVE:
- Mobile: Single column, large touch targets
- Tablet: 2 column grid for results
- Desktop: 4 column results grid
```

---

## 🎨 FRAMER MOTION BEST PRACTICES

Use throughout the app:

1. **Page Transitions:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.5 }}
>
```

2. **Hover Effects:**
```typescript
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  whileTap={{ scale: 0.95 }}
>
```

3. **Stagger Children:**
```typescript
<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map(item => (
    <motion.div variants={fadeInUp} />
  ))}
</motion.div>
```

4. **AnimatePresence for Exits:**
```typescript
<AnimatePresence mode="wait">
  {showContent && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

5. **Scroll Animations:**
```typescript
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
```

---

## 🎯 IMPLEMENTATION ORDER

Execute prompts sequentially:
1. **Setup** (30 mins) → Project, theme, mock data, Framer Motion
2. **Homepage** (45 mins) → Grid, filters, animated cards
3. **Car Detail** (45 mins) → Tabs, specs, features, parallax
4. **Compare** (40 mins) → Side-by-side, winner highlighting
5. **Recommendations** (50 mins) → Form, algorithm, results

**Total estimated time: ~3.5 hours**

---

## 📝 NOTES FOR CLAUDE CODE

✅ **INCLUDE:**
- Framer Motion on every page
- Hover animations on all interactive elements
- Stagger animations for lists/grids
- Smooth page transitions
- Loading states with animations
- Dark theme as default
- Responsive design (mobile-first)
- Premium, cinematic feel

✅ **USE THESE PATTERNS:**
- `motion.div` for animated containers
- `whileHover` for interactive elements
- `AnimatePresence` for conditional rendering
- `variants` for complex animations
- `useScroll` + `useTransform` for parallax
- shadcn components as base (wrap with motion)

❌ **AVOID:**
- No database (use mock data)
- No authentication
- No real API calls
- Don't use external car APIs
- Keep bundle size reasonable

🎯 **GOAL:**
Working UI prototype with stunning animations, demonstrating all features with mock data. Should feel premium and production-ready from a visual standpoint.