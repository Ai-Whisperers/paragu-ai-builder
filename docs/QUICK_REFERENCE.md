# Quick Visual Reference

## Animation Classes

### Entrance Animations
```
.animate-fade-up      → Fade in + slide up
.animate-fade-in      → Simple fade in
.animate-scale-in     → Scale from 0.9 to 1
.animate-slide-in-left  → Slide from left
.animate-slide-in-right → Slide from right
.animate-slide-in-bottom → Slide from bottom
```

**With delays:**
```
.delay-100 through .delay-800
```

### Continuous Animations
```
.animate-float        → Gentle up/down floating
.animate-pulse-gentle → Scale + fade pulse
.animate-spin-slow    → Slow 8s rotation
.animate-shimmer      → Shimmer effect
.animate-gradient     → Animated gradient shift
.animate-blob         → Morphing blob shape
```

## Gradient Classes

```
.bg-gradient-primary-secondary  → Primary to secondary
.bg-gradient-secondary-accent   → Secondary to accent
.bg-gradient-primary-accent     → Primary to accent
.bg-gradient-mesh-1             → 3-color mesh gradient
.bg-gradient-mesh-2             → Alt mesh gradient
.bg-gradient-animated           → Animated shifting gradient
```

## Glassmorphism Classes

```
.glass         → Light frosted glass
.glass-dark    → Dark frosted glass
.glass-strong  → Strong blur glass
```

## Glow Effects

```
.glow-primary    → Primary color glow
.glow-secondary  → Secondary color glow
.glow-accent     → Accent color glow
.glow-hover      → Glow on hover
```

## Hover Effects

```
.hover-lift   → Lift up on hover (-8px)
.hover-scale  → Scale up on hover (1.05)
.hover-glow   → Add glow on hover
```

## Pattern Backgrounds

```
.bg-pattern-dots     → Dot grid
.bg-pattern-lines    → Vertical lines
.bg-pattern-grid     → Grid lines
.bg-pattern-diagonal → Diagonal stripes
```

## Text Effects

```
.text-gradient          → Static gradient text
.text-gradient-animated → Animated gradient text
```

## Section Helpers

```
.section-divider    → Gradient line divider
.section-fade       → Fade in on scroll
.section-gradient   → Gradient background wrapper
```

## Card Effects

```
.card-glow      → Gradient border glow
```

---

## Component Quick Reference

### GradientBackground
```tsx
<GradientBackground variant="primary-secondary" animated pattern="dots">
  <Content />
</GradientBackground>
```

### DecorativeBlob
```tsx
<DecorativeBlob variant="primary" size="lg" animated position="absolute" 
  placement={{top: '-10%', right: '-10%'}} blur="xl" opacity={0.3} />
```

### GlassCard
```tsx
<GlassCard variant="light" glow hover gradientBorder rounded="xl">
  <Content />
</GlassCard>
```

### AnimatedContainer
```tsx
<AnimatedContainer animation="fade-up" delay={200} duration={0.6} triggerOnScroll>
  <Card />
</AnimatedContainer>
```

### TiltCard
```tsx
<TiltCard maxTilt={10} scale={1.02} glare>
  <CardContent />
</TiltCard>
```

### GlowCard
```tsx
<GlowCard glowColor="primary" glowIntensity="medium" hover>
  <Content />
</GlowCard>
```

### SectionWrapper
```tsx
<SectionWrapper 
  background="gradient"
  gradientVariant="primary-secondary"
  decorativeBlobs
  blobColors={['primary', 'accent']}
  title="Section Title"
  subtitle="Section description"
>
  <Content />
</SectionWrapper>
```

---

## Common Combinations

### Hero with Gradient + Blobs
```tsx
<section className="relative min-h-[70vh] overflow-hidden">
  <GradientBackground variant="animated" animated className="absolute inset-0" />
  <DecorativeBlob variant="primary" size="xl" animated position="absolute" 
    placement={{top: '-20%', right: '-10%'}} blur="xl" opacity={0.2} />
  <div className="relative z-10">Content</div>
</section>
```

### Glass Cards with Stagger
```tsx
<StaggerContainer staggerDelay={100} animation="fade-up">
  {items.map(item => (
    <GlassCard key={item.id} glow hover className="p-6">
      {item.content}
    </GlassCard>
  ))}
</StaggerContainer>
```

### Spotlight Grid
```tsx
<div className="grid grid-cols-3 gap-6">
  {cards.map(card => (
    <SpotlightCard key={card.id} borderGlow rounded="xl">
      <div className="p-6">{card.content}</div>
    </SpotlightCard>
  ))}
</div>
```

### Floating Elements
```tsx
<div className="relative">
  <FloatingElement amplitude={15} duration={4}>
    <Icon />
  </FloatingElement>
  <FloatingElement amplitude={10} duration={3} delay={1}>
    <Badge />
  </FloatingElement>
</div>
```

### Count Up Stats
```tsx
<div className="text-center">
  <div className="text-4xl font-bold text-[var(--primary)]">
    <CountUp end={1000} suffix="+" duration={2} />
  </div>
  <p>Happy Customers</p>
</div>
```

---

## CSS-Only Patterns (No Components Needed)

### Gradient Button
```html
<button class="bg-gradient-primary-secondary text-white px-6 py-3 rounded-lg 
  hover:shadow-lg hover:-translate-y-0.5 transition-all">
  Click Me
</button>
```

### Glass Card (CSS only)
```html
<div class="glass rounded-xl p-6 hover-lift">
  <h3 class="text-gradient">Title</h3>
  <p>Content</p>
</div>
```

### Pattern Section
```html
<section class="relative bg-[var(--background)] py-20">
  <div class="absolute inset-0 bg-pattern-dots opacity-5" />
  <div class="relative z-10">Content</div>
</section>
```

### Animated Gradient Text
```html
<h1 class="text-5xl font-bold text-gradient-animated">
  Animated Title
</h1>
```

### Floating Badge
```html
<span class="animate-float px-3 py-1 bg-[var(--accent)] rounded-full text-sm">
  New
</span>
```

---

## Color Variable Reference

```css
/* Main colors */
var(--primary)           /* Primary brand color */
var(--secondary)         /* Secondary brand color */
var(--accent)            /* Accent color */

/* RGB for opacity */
var(--primary-rgb)       /* 37, 99, 235 */
var(--secondary-rgb)     /* 100, 116, 139 */
var(--accent-rgb)        /* 245, 158, 11 */

/* Surfaces */
var(--background)        /* Page background */
var(--surface)           /* Card/surface background */
var(--surface-light)     /* Lighter surface variant */

/* Text */
var(--text)              /* Main text */
var(--text-light)        /* Secondary text */
var(--text-muted)        /* Muted/disabled text */

/* UI */
var(--border)            /* Border color */
var(--success)           /* Success state */
var(--error)             /* Error state */
```

---

## Spacing Quick Reference

```
py-8   → Small section (32px)
py-12  → Medium section (48px)
py-16  → Large section (64px)
py-20  → XL section (80px)
```

```
gap-6   → Grid gap 24px
gap-8   → Grid gap 32px
gap-12  → Grid gap 48px
```

---

## Responsive Patterns

### Mobile-First Grid
```html
<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <!-- Cards -->
</div>
```

### Responsive Section Padding
```html
<section class="py-12 sm:py-16 lg:py-20">
  <!-- Content -->
</section>
```

### Responsive Font Sizes
```html
<h2 class="text-2xl sm:text-3xl lg:text-4xl">Title</h2>
```

---

## Accessibility Checklist

- [ ] Animations respect `prefers-reduced-motion`
- [ ] All interactive elements have focus states
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Glassmorphism doesn't affect text readability
- [ ] Hover effects also work on focus
- [ ] No content is only conveyed through animation
