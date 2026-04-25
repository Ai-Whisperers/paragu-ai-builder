'use client'

import { useState } from 'react'

interface Testimonial {
  quote: string
  author: string
  rating?: number
  role?: string
  image?: string
  date?: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  googleReviewsUrl?: string
  showGoogleReviews?: boolean
  title?: string
}

export default function Testimonials({
  testimonials,
  googleReviewsUrl,
  showGoogleReviews = true,
  title = 'Lo que dicen nuestros clientes'
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8 text-[var(--primary)]">{title}</h2>
      
      {testimonials.length === 1 ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            {testimonials[0].rating && (
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonials[0].rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
            <blockquote className="text-lg text-gray-700 italic mb-4">
              &ldquo;{testimonials[0].quote}&rdquo;
            </blockquote>
            <div className="font-medium text-[var(--primary)]">
              {testimonials[0].author}
              {testimonials[0].role && (
                <span className="text-gray-500 text-sm block">{testimonials[0].role}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative max-w-2xl mx-auto">
          <div className="overflow-hidden">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              {testimonials[currentIndex].rating && (
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
              <blockquote className="text-lg text-gray-700 italic mb-4 text-center">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </blockquote>
              <div className="text-center font-medium text-[var(--primary)]">
                {testimonials[currentIndex].author}
                {testimonials[currentIndex].role && (
                  <span className="text-gray-500 text-sm block">{testimonials[currentIndex].role}</span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
          >
            ‹
          </button>
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
          >
            ›
          </button>
          
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-[var(--primary)]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      
      {showGoogleReviews && googleReviewsUrl && (
        <div className="text-center mt-8">
          <a 
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Ver más reseñas en Google
          </a>
        </div>
      )}
    </div>
  )
}