# Animation Patterns & Quick Reference

## Framer Motion Imports
```jsx
import { motion, AnimatePresence } from "motion/react";
```

## Basic Component Animation Pattern

### Fade In
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Slide In From Bottom
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
>
  Content
</motion.div>
```

### Staggered List
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {items.map((item, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

## Hover Effects

### Scale and Lift
```jsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### Glow Effect
```jsx
<motion.div
  whileHover={{ 
    boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)"
  }}
>
  Hover Me
</motion.div>
```

### Icon Rotation
```jsx
<motion.button
  whileHover={{ rotate: 180 }}
  transition={{ duration: 0.4 }}
>
  <RotateIcon />
</motion.button>
```

## Continuous Animations

### Pulse
```jsx
<motion.div
  animate={{ opacity: [0.6, 1, 0.6] }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  Pulsing content
</motion.div>
```

### Floating
```jsx
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 3, repeat: Infinity }}
>
  Floating content
</motion.div>
```

### Rotating Spinner
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
/>
```

## Modal/Dropdown Animations

### AnimatePresence for Conditional Rendering
```jsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>
```

## Form Input Animations

### Focus Scale
```jsx
<motion.input
  whileFocus={{ scale: 1.02 }}
  className="input-base"
/>
```

### Focus Ring
```jsx
<motion.div
  animate={{ 
    boxShadow: isFocused ? "0 0 0 3px rgba(99, 102, 241, 0.3)" : "none"
  }}
>
  <input />
</motion.div>
```

## Button States

### Loading Button
```jsx
<motion.button
  disabled={loading}
  whileHover={!loading ? { scale: 1.05 } : {}}
  whileTap={!loading ? { scale: 0.95 } : {}}
>
  {loading ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="spinner"
    />
  ) : (
    'Submit'
  )}
</motion.button>
```

## Common Tailwind Classes with Animations

### Card Hover
```jsx
<motion.div
  whileHover={{ 
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.2)"
  }}
  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
>
  Card content
</motion.div>
```

### Badge Animation
```jsx
<motion.span
  whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
  className="badge-indigo"
>
  Tag
</motion.span>
```

## Transition Easing Options

```jsx
// Smooth, natural motion (recommended for most cases)
transition={{ type: "spring", stiffness: 100, damping: 15 }}

// Bouncy, playful motion
transition={{ type: "spring", stiffness: 200, damping: 10 }}

// Precise, controlled motion
transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}

// Quick, snappy motion
transition={{ duration: 0.2, ease: "easeInOut" }}

// Smooth, eased motion
transition={{ duration: 0.5, ease: "easeOut" }}
```

## Grid/List Item Animations

### With Delay Based on Index
```jsx
<motion.div>
  {items.map((item, idx) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Complex Hover Effects

### Multi-Property Hover
```jsx
<motion.div
  whileHover={{
    scale: 1.05,
    y: -4,
    boxShadow: "0 20px 25px rgba(99, 102, 241, 0.2)",
    backgroundColor: "rgba(99, 102, 241, 0.1)"
  }}
  transition={{ duration: 0.3 }}
>
  Complex hover
</motion.div>
```

## Exit Animations

### Fade Out on Delete
```jsx
<AnimatePresence mode="wait">
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

## Performance Tips

1. **Use GPU-accelerated properties only:**
   - ✅ `transform` (scale, rotate, x, y)
   - ✅ `opacity`
   - ❌ `width`, `height`, `left`, `top`

2. **Reduce motion for accessibility:**
```jsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
>
</motion.div>
```

3. **Use correct transition types:**
   - Spring: Natural, physics-based (best for UI)
   - Tween: Precise control (best for sequences)
   - Inertia: Momentum-based (best for gestures)

## Color Theme Reference

```jsx
// Backgrounds
bg-slate-950     // #0f172a - Main dark background
bg-slate-900     // #1e293b - Secondary background
bg-slate-800/50  // Lighter with transparency

// Text
text-slate-100   // #f1f5f9 - Main text
text-slate-400   // #94a3b8 - Secondary text
text-slate-500   // #64748b - Tertiary text

// Accents
from-indigo-600  // #4f46e5 - Primary accent
to-purple-600    // #9333ea - Secondary accent
text-indigo-400  // #818cf8 - Accent text

// Borders
border-slate-700/50  // Semi-transparent border
border-indigo-500/30 // Accent border

// Hovers
hover:text-indigo-400
hover:bg-white/10
hover:border-indigo-500/30
```

## Component Animation Timeline

**Recommended timing for entrance animations:**
1. Page/Section fade in: 0.5s
2. Header elements: 0.5s with 0.1s stagger
3. Cards/Items: 0.3s with 0.05s stagger
4. Buttons: 0.2s
5. Icons: 0.3s

**Recommended for hover:**
- Scale: 5-10% (1.05-1.1)
- Y translate: 2-4px lift
- Duration: 0.2-0.3s

**Continuous animations:**
- Pulse: 1-2s cycle
- Float: 2-3s cycle
- Rotate: 2-4s per rotation

---

## Quick Copy-Paste Templates

### Page Entry
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Your Page Content
</motion.div>
```

### Card with Hover
```jsx
<motion.div
  whileHover={{ y: -4 }}
  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
>
  Card Content
</motion.div>
```

### Button with States
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
>
  Click Me
</motion.button>
```

### Loading Spinner
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
/>
```

---

**Use these patterns consistently across all components for a cohesive, professional experience!**