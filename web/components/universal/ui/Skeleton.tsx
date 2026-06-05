/**
 * ANNOTATION: Skeleton
 * 
 * What it is: A loading skeleton placeholder component with configurable shape types (text, circle, rectangle, image) and a shimmer animation effect. Shows while actual content is loading.
 * 
 * Why your business needs it: Prevents layout shift and gives visitors visual feedback that content is loading, making your site feel faster and more professional than showing blank spaces.
 * 
 * What AI populates from your data: ParaguAI renders skeleton placeholders automatically while fetching business data, then replaces them with real content once loaded.
 * 
 * Your input: Nothing — works automatically during page and data loading.
 * 
 * Plan availability: All plans
 */
"use client"

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
  variant?: "text" | "circular" | "rectangular"
}

export function Skeleton({ className = "", style, variant = "rectangular" }: SkeletonProps) {
  const base = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded"
  const variantClass = variant === "circular" ? "rounded-full" : variant === "text" ? "rounded h-4" : "rounded-lg"
  return <div className={`${base} ${variantClass} ${className}`} style={style} />
}

// Service card skeleton for loading states
export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton className="h-5 w-32" variant="text" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-3/4" variant="text" />
        <Skeleton className="h-4 w-1/2" variant="text" />
      </div>
    </div>
  )
}

// Booking form skeleton
export function BookingFormSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-1/3 ml-auto" />
    </div>
  )
}

// Hero section skeleton — full viewport height with shimmer center
export function HeroSkeleton() {
  return (
    <div className="h-[92vh] min-h-[580px] max-h-[900px] bg-foreground/5 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 w-full space-y-6">
        <div className="h-8 w-48 mx-auto animate-shimmer rounded-lg bg-foreground/5" />
        <div className="h-16 w-3/4 mx-auto animate-shimmer rounded-lg bg-foreground/5" />
        <div className="h-6 w-1/2 mx-auto animate-shimmer rounded-lg bg-foreground/5" />
        <div className="flex justify-center gap-4 pt-4">
          <div className="h-14 w-48 rounded-full animate-shimmer bg-foreground/5" />
          <div className="h-14 w-40 rounded-full animate-shimmer bg-foreground/5" />
        </div>
      </div>
    </div>
  )
}

// Service card skeleton
export function ServiceCardSkeletonSC() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="h-5 w-20 animate-shimmer rounded bg-foreground/5" />
      <div className="h-6 w-3/4 animate-shimmer rounded bg-foreground/5" />
      <div className="h-4 w-full animate-shimmer rounded bg-foreground/5" />
      <div className="h-4 w-1/2 animate-shimmer rounded bg-foreground/5" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-7 w-24 animate-shimmer rounded bg-foreground/5" />
        <div className="h-9 w-28 rounded-full animate-shimmer bg-foreground/5" />
      </div>
    </div>
  )
}

// Services grid skeleton
export function ServicesGridSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((cat) => (
        <div key={cat} className="space-y-4">
          <div className="h-8 w-48 animate-shimmer rounded bg-foreground/5" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <ServiceCardSkeletonSC key={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Testimonial card skeleton
export function TestimonialCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full animate-shimmer bg-foreground/5" />
        <div className="space-y-2">
          <div className="h-4 w-28 animate-shimmer rounded bg-foreground/5" />
          <div className="h-3 w-20 animate-shimmer rounded bg-foreground/5" />
        </div>
      </div>
      <div className="h-4 w-full animate-shimmer rounded bg-foreground/5" />
      <div className="h-4 w-5/6 animate-shimmer rounded bg-foreground/5" />
      <div className="h-4 w-2/3 animate-shimmer rounded bg-foreground/5" />
    </div>
  )
}