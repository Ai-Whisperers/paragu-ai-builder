# UX/UI Beautification Components

This document describes the reusable beautification components created for the Paragu-AI Builder project. These components provide gradients, animations, glassmorphism effects, and decorative elements that can be used across all templates.

## Table of Contents

1. [Gradient Components](#gradient-components)
2. [Decorative Elements](#decorative-elements)
3. [Glassmorphism](#glassmorphism)
4. [Animation Components](#animation-components)
5. [Card Effects](#card-effects)
6. [Section Wrappers](#section-wrappers)
7. [CSS Utilities](#css-utilities)
8. [Usage Examples](#usage-examples)

---

## Gradient Components

### `GradientBackground`

Wrapper component for gradient backgrounds with optional patterns and animations.

```tsx
import { GradientBackground } from '@/components/ui/gradient'

// Basic gradient
<GradientBackground variant="primary-secondary">
  <HeroContent />
</GradientBackground>

// Animated gradient with pattern
<GradientBackground
  variant="animated"
  animated
  pattern="dots"
  patternOpacity={0.1}
>
  <CTAContent />
</GradientBackground>
```

**Props:**
- `variant`: `'primary-secondary' | 'secondary-accent' | 'primary-accent' | 'mesh-1' | 'mesh-2' | 'animated'`
- `animated`: Enable animated gradient shift
- `pattern`: `'dots' | 'lines' | 'grid' | 'diagonal' | 'none'`
- `patternOpacity`: Number (0-1)

### `GradientText`

Text with gradient fill, optionally animated.

```tsx
import { GradientText } from '@/components/ui/gradient'

<h1>
  <GradientText animated>Beautiful Headlines</GradientText>
</h1>
```

### `GradientBorder`

Wrapper that adds a gradient border effect.

```tsx
import { GradientBorder } from '@/components/ui/gradient'

<GradientBorder rounded="xl">
  <CardContent />
</GradientBorder>
```

---

## Decorative Elements

### `DecorativeBlob`

Morphing blob shapes perfect for background decoration.

```tsx
import { DecorativeBlob } from '@/components/ui/decorative'

<section className="relative overflow-hidden">
  <DecorativeBlob
    variant="primary"
    size="lg"
    animated
    position="absolute"
    placement={{ top: '-10%', right: '-10%' }}
    blur="xl"
    opacity={0.3}
  />
  <Content />
</section>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'accent' | 'muted'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `animated`: Enable morphing animation
- `position`: `'static' | 'absolute' | 'fixed'`
- `placement`: Object with top/right/bottom/left
- `blur`: `'none' | 'sm' | 'md' | 'lg' | 'xl'`
- `opacity`: Number (0-1)

### `DecorativeCircle`

Simple decorative circles with pulse/float animations.

```tsx
// Pulsing indicator
<DecorativeCircle variant="accent" size={12} pulse />

// Floating decorative
<DecorativeCircle variant="outline" size={100} borderWidth={2} float />
```

### `DecorativeRing`

Concentric rings with optional ripple animation.

```tsx
<DecorativeRing variant="primary" size={200} count={3} ripple />
```

### `DecorativeDots`

Grid of decorative dots.

```tsx
<DecorativeDots rows={5} cols={5} gap={16} size={4} variant="muted" />
```

### `DecorativeLine`

Horizontal or vertical decorative lines with gradient/shimmer.

```tsx
<DecorativeLine variant="horizontal" length="100%" thickness={2} gradient />
```

---

## Glassmorphism

### `GlassCard`

Frosted glass card with backdrop blur.

```tsx
import { GlassCard } from '@/components/ui/glass'

// Basic glass card
<GlassCard>
  <Content />
</GlassCard>

// Dark glass with hover glow
<GlassCard variant="dark" glow hover>
  <Content />
</GlassCard>

// With gradient border
<GlassCard gradientBorder rounded="xl">
  <Content />
</GlassCard>
```

**Props:**
- `variant`: `'light' | 'dark' | 'strong'`
- `rounded`: `'sm' | 'md' | 'lg' | 'xl' | 'full'`
- `glow`: Enable hover glow effect
- `hover`: Enable hover lift effect
- `gradientBorder`: Add gradient border

### `GlassPanel`

Full glass panel for overlays and floating UI.

```tsx
import { GlassPanel } from '@/components/ui/glass'

// Modal overlay
<GlassPanel position="fixed" fullSize blur="xl">
  <ModalContent />
</GlassPanel>

// Floating notification
<GlassPanel
  position="absolute"
  placement={{ top: 20, right: 20 }}
  className="w-80 p-6"
>
  <NotificationCard />
</GlassPanel>
```

### `GlassButton`

Frosted glass button with hover glow.

```tsx
import { GlassButton } from '@/components/ui/glass'

<GlassButton variant="primary" size="lg" glow>
  Get Started
</GlassButton>
```

### `FrostedImage`

Image with frosted glass overlay.

```tsx
import { FrostedImage } from '@/components/ui/glass'

<FrostedImage
  src="/hero.jpg"
  alt="Hero"
  overlayOpacity={0.3}
  rounded="xl"
  parallax
/>
```

---

## Animation Components

### `AnimatedContainer`

Configurable entrance animations with scroll trigger.

```tsx
import { AnimatedContainer } from '@/components/ui/animated'

// Fade up on scroll
<AnimatedContainer animation="fade-up" triggerOnScroll delay={200}>
  <Card />
</AnimatedContainer>

// Slide in immediately
<AnimatedContainer animation="slide-left" duration={0.8} triggerOnScroll={false}>
  <Content />
</AnimatedContainer>
```

**Animations:** `'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right' | 'slide-bottom'`

### `StaggerContainer`

Staggers animations for child elements.

```tsx
import { StaggerContainer, AnimatedContainer } from '@/components/ui/animated'

<StaggerContainer staggerDelay={100} animation="fade-up">
  {items.map((item, i) => (
    <Card key={i}>{item}</Card>
  ))}
</StaggerContainer>
```

### `FloatingElement`

Continuous floating animation.

```tsx
import { FloatingElement } from '@/components/ui/animated'

<FloatingElement amplitude={15} duration={4}>
  <DecorativeIcon />
</FloatingElement>
```

### `PulsingElement`

Continuous pulse (scale + fade) animation.

```tsx
import { PulsingElement } from '@/components/ui/animated'

<PulsingElement scale={0.95} duration={2}>
  <NotificationBadge />
</PulsingElement>
```

### `ParallaxLayer`

Layer that moves at different speed during scroll.

```tsx
import { ParallaxLayer } from '@/components/ui/animated'

<div className="relative h-[800px] overflow-hidden">
  <ParallaxLayer speed={0.5}>
    <BackgroundImage />
  </ParallaxLayer>
  <ParallaxLayer speed={1.2}>
    <ForegroundContent />
  </ParallaxLayer>
</div>
```

### `RevealText`

Character-by-character, word-by-word, or line-by-line text reveal.

```tsx
import { RevealText } from '@/components/ui/animated'

<RevealText
  text="Hello World"
  type="character"
  staggerDelay={50}
  triggerOnScroll
/>
```

### `CountUp`

Number that counts up from 0.

```tsx
import { CountUp } from '@/components/ui/animated'

<CountUp end={1000} duration={2} suffix="+" prefix="$" />
```

---

## Card Effects

### `GlowCard`

Card with dynamic glow that follows mouse position.

```tsx
import { GlowCard } from '@/components/ui/glow'

<GlowCard glowColor="primary" glowIntensity="medium" hover>
  <CardContent />
</GlowCard>
```

**Props:**
- `glowColor`: `'primary' | 'secondary' | 'accent'`
- `glowIntensity`: `'subtle' | 'medium' | 'strong'`
- `hover`: Enable hover glow
- `persistent`: Always show glow

### `SpotlightCard`

Card with spotlight effect on hover.

```tsx
import { SpotlightCard } from '@/components/ui/glow'

<SpotlightCard borderGlow rounded="xl">
  <CardContent />
</SpotlightCard>
```

### `TiltCard`

3D tilt card that responds to mouse movement.

```tsx
import { TiltCard } from '@/components/ui/glow'

<TiltCard maxTilt={10} scale={1.02} glare>
  <CardContent />
</TiltCard>
```

### `MagneticButton`

Button that magnetically attracts to cursor.

```tsx
import { MagneticButton } from '@/components/ui/glow'

<MagneticButton strength={0.3} size="lg" variant="primary">
  Click Me
</MagneticButton>
```

### `MorphingCard`

Card with morphing border radius.

```tsx
import { MorphingCard } from '@/components/ui/glow'

<MorphingCard morphRadius animatedBorder borderColor="primary">
  <CardContent />
</MorphingCard>
```

---

## Section Wrappers

### `SectionWrapper`

Enhanced section wrapper with backgrounds, decorative blobs, and animations.

```tsx
import { SectionWrapper } from '@/components/ui/section-wrapper'

// Basic section with header
<SectionWrapper
  id="services"
  title="Our Services"
  subtitle="What we offer"
  background="default"
  padding="lg"
>
  <ServicesGrid />
</SectionWrapper>

// Gradient with decorative blobs
<SectionWrapper
  background="gradient"
  gradientVariant="primary-secondary"
  decorativeBlobs
  blobColors={['primary', 'accent']}
  padding="xl"
>
  <CTAContent />
</SectionWrapper>

// Pattern background
<SectionWrapper
  background="pattern"
  pattern="dots"
  patternOpacity={0.05}
  padding="lg"
>
  <Content />
</SectionWrapper>
```

**Background options:**
- `default`: Standard background
- `primary`: Primary color background
- `secondary`: Secondary color background
- `gradient`: Gradient background
- `muted`: Muted/light background
- `pattern`: Pattern overlay

### `SplitSection`

Two-column split layout.

```tsx
import { SplitSection } from '@/components/ui/section-wrapper'

<SplitSection
  left={<TextContent />}
  right={<ImageContent />}
  leftWidth="1/2"
  gap="xl"
/>
```

### `FeatureGrid`

Grid of feature cards with icons.

```tsx
import { FeatureGrid } from '@/components/ui/section-wrapper'

<FeatureGrid
  features={[
    { icon: <Icon />, title: 'Feature 1', description: 'Description' },
  ]}
  columns={3}
  cardStyle="glass"
  hoverEffect
/>
```

---

## CSS Utilities

### Gradient Background Classes

```html
<div class="bg-gradient-primary-secondary">...</div>
<div class="bg-gradient-secondary-accent">...</div>
<div class="bg-gradient-primary-accent">...</div>
<div class="bg-gradient-mesh-1">...</div>
<div class="bg-gradient-mesh-2">...</div>
<div class="bg-gradient-animated">...</div>
```

### Animation Classes

```html
<!-- Entrance animations -->
<div class="animate-fade-up">...</div>
<div class="animate-fade-in">...</div>
<div class="animate-scale-in">...</div>
<div class="animate-slide-in-left">...</div>
<div class="animate-slide-in-right">...</div>
<div class="animate-slide-in-bottom">...</div>

<!-- Continuous animations -->
<div class="animate-float">...</div>
<div class="animate-pulse-gentle">...</div>
<div class="animate-spin-slow">...</div>
<div class="animate-shimmer">...</div>
<div class="animate-gradient">...</div>
<div class="animate-blob">...</div>

<!-- With delays -->
<div class="animate-fade-up delay-200">...</div>
<div class="animate-fade-up delay-400">...</div>
```

### Glassmorphism Classes

```html
<div class="glass">...</div>
<div class="glass-dark">...</div>
<div class="glass-strong">...</div>
```

### Glow Effects

```html
<div class="glow-primary">...</div>
<div class="glow-secondary">...</div>
<div class="glow-accent">...</div>
<div class="glow-hover">...</div>
```

### Hover Effects

```html
<div class="hover-lift">...</div>
<div class="hover-scale">...</div>
<div class="hover-glow">...</div>
```

### Pattern Backgrounds

```html
<div class="bg-pattern-dots">...</div>
<div class="bg-pattern-lines">...</div>
<div class="bg-pattern-grid">...</div>
<div class="bg-pattern-diagonal">...</div>
```

### Text Gradients

```html
<span class="text-gradient">Gradient Text</span>
<span class="text-gradient-animated">Animated Gradient</span>
```

---

## Usage Examples

### Hero Section with Gradient and Floating Elements

```tsx
import { GradientBackground } from '@/components/ui/gradient'
import { FloatingElement } from '@/components/ui/animated'
import { DecorativeBlob } from '@/components/ui/decorative'

<section className="relative min-h-[80vh]">
  <GradientBackground variant="animated" animated className="absolute inset-0">
    <DecorativeBlob
      variant="primary"
      size="xl"
      animated
      position="absolute"
      placement={{ top: '10%', right: '-10%' }}
      blur="xl"
      opacity={0.2}
    />
  </GradientBackground>
  
  <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
    <FloatingElement amplitude={20} duration={5}>
      <h1 className="text-5xl font-bold text-gradient-animated">
        Hero Title
      </h1>
    </FloatingElement>
  </div>
</section>
```

### Feature Cards with Glassmorphism

```tsx
import { GlassCard } from '@/components/ui/glass'
import { AnimatedContainer } from '@/components/ui/animated'

<div className="grid grid-cols-3 gap-6">
  {features.map((feature, i) => (
    <AnimatedContainer key={i} animation="fade-up" delay={i * 100}>
      <GlassCard variant="light" glow hover className="p-6">
        <Icon className="w-8 h-8 mb-4" />
        <h3 className="text-lg font-semibold">{feature.title}</h3>
        <p className="text-sm opacity-80">{feature.description}</p>
      </GlassCard>
    </AnimatedContainer>
  ))}
</div>
```

### CTA Section with Spotlight Cards

```tsx
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { SpotlightCard } from '@/components/ui/glow'
import { GradientText } from '@/components/ui/gradient'

<SectionWrapper
  background="gradient"
  gradientVariant="primary-secondary"
  decorativeBlobs
  padding="xl"
>
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold">
      <GradientText>Ready to get started?</GradientText>
    </h2>
  </div>
  
  <div className="grid grid-cols-3 gap-6">
    {plans.map((plan) => (
      <SpotlightCard key={plan.id} borderGlow rounded="xl">
        <div className="p-6">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-2xl font-bold mt-2">{plan.price}</p>
          <ul className="mt-4 space-y-2">
            {plan.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </SpotlightCard>
    ))}
  </div>
</SectionWrapper>
```

### Testimonials with Tilt Cards

```tsx
import { TiltCard } from '@/components/ui/glow'
import { StaggerContainer } from '@/components/ui/animated'

<StaggerContainer staggerDelay={150} animation="scale-in">
  {testimonials.map((t) => (
    <TiltCard key={t.id} maxTilt={5} scale={1.02} glare>
      <div className="p-6 bg-[var(--surface)] rounded-lg">
        <p className="text-lg italic">"{t.quote}"</p>
        <div className="mt-4 flex items-center gap-3">
          <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold">{t.name}</p>
            <p className="text-sm opacity-70">{t.role}</p>
          </div>
        </div>
      </div>
    </TiltCard>
  ))}
</StaggerContainer>
```

### Stats Section with CountUp

```tsx
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { CountUp } from '@/components/ui/animated'
import { DecorativeDots } from '@/components/ui/decorative'

<SectionWrapper
  background="pattern"
  pattern="dots"
  patternOpacity={0.03}
  padding="xl"
>
  <div className="grid grid-cols-4 gap-8 text-center">
    <div>
      <div className="text-4xl font-bold text-[var(--primary)]">
        <CountUp end={1000} suffix="+" />
      </div>
      <p className="mt-2 text-[var(--text-muted)]">Happy Customers</p>
    </div>
    <div>
      <div className="text-4xl font-bold text-[var(--primary)]">
        <CountUp end={50} suffix="+" prefix="$" />
      </div>
      <p className="mt-2 text-[var(--text-muted)]">Million Revenue</p>
    </div>
    {/* More stats... */}
  </div>
  
  <DecorativeDots className="absolute top-8 right-8" rows={4} cols={4} />
</SectionWrapper>
```

---

## Best Practices

1. **Always use CSS variables** - Never hardcode colors
2. **Respect reduced motion** - Animations respect `prefers-reduced-motion`
3. **Use appropriate patterns** - Don't over-decorate, keep it tasteful
4. **Test on mobile** - Many effects are desktop-optimized
5. **Combine thoughtfully** - 1-2 effects per element, not all at once

## Accessibility

All components respect `prefers-reduced-motion`:
- Animations are disabled when user prefers reduced motion
- Scroll behavior becomes instant
- Elements remain visible without animation

## Token Integration

All components use the design token system:
- Colors reference CSS variables like `var(--primary)`
- Gradients are defined in `base.tokens.json`
- Effects can be customized per business type via tokens
