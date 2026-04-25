'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'
import { 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

/**
 * Dynamic Form Builder
 * 
 * Universal form system with:
 * - Dynamic field generation from JSON config
 * - Multi-step wizard support
 * - Built-in validation
 * - Progress indicators
 * - File upload support
 * 
 * Works for contact forms, booking, quotes, registrations.
 */

// ============================================
// TYPES
// ============================================

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'tel' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'time' 
  | 'datetime' 
  | 'number' 
  | 'file' 
  | 'rating'

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  options?: FormFieldOption[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
  helpText?: string
  /** Show on specific step (for multi-step) */
  step?: number
  /** Conditional visibility */
  showIf?: {
    field: string
    value: string
  }
}

export interface FormStep {
  title: string
  description?: string
  fields: string[] // Field IDs for this step
}

export interface FormConfig {
  id: string
  title?: string
  description?: string
  fields: FormField[]
  /** Multi-step configuration */
  steps?: FormStep[]
  submitLabel?: string
  successMessage?: string
  /** Redirect after success */
  redirectUrl?: string
}

export interface FormSubmission {
  formId: string
  data: Record<string, string | string[] | File>
  timestamp: string
  metadata?: {
    source: string
    url: string
  }
}

// ============================================
// FORM BUILDER COMPONENT
// ============================================

interface DynamicFormProps {
  config: FormConfig
  /** Submit handler */
  onSubmit: (data: FormSubmission) => Promise<void> | void
  /** Loading state */
  isLoading?: boolean
  className?: string
}

/**
 * Dynamic form builder from JSON configuration.
 * 
 * @example
 * const contactForm: FormConfig = {
 *   id: 'contact',
 *   title: 'Contact Us',
 *   fields: [
 *     { id: 'name', name: 'name', label: 'Full Name', type: 'text', required: true },
 *     { id: 'email', name: 'email', label: 'Email', type: 'email', required: true },
 *     { id: 'message', name: 'message', label: 'Message', type: 'textarea', required: true },
 *   ],
 *   submitLabel: 'Send Message',
 * }
 * 
 * <DynamicForm 
 *   config={contactForm}
 *   onSubmit={handleSubmit}
 * />
 */
export function DynamicForm({
  config,
  onSubmit,
  isLoading = false,
  className,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const isMultiStep = config.steps && config.steps.length > 0
  const totalSteps = isMultiStep ? config.steps!.length : 1
  const currentStepData = isMultiStep ? config.steps![currentStep] : null
  
  // Get visible fields for current step or all fields
  const visibleFields = isMultiStep 
    ? config.fields.filter(f => currentStepData?.fields.includes(f.id))
    : config.fields

  // Validate a single field
  const validateField = (field: FormField, value: string | string[]): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label} is required`
    }
    
    if (field.validation) {
      const strValue = Array.isArray(value) ? value.join('') : value || ''
      
      if (field.validation.minLength && strValue.length < field.validation.minLength) {
        return `${field.label} must be at least ${field.validation.minLength} characters`
      }
      
      if (field.validation.maxLength && strValue.length > field.validation.maxLength) {
        return `${field.label} must be less than ${field.validation.maxLength} characters`
      }
      
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(strValue)) {
        return `${field.label} is invalid`
      }
      
      if (field.type === 'email' && strValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(strValue)) {
          return 'Please enter a valid email address'
        }
      }
      
      if (field.type === 'tel' && strValue) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        if (!phoneRegex.test(strValue)) {
          return 'Please enter a valid phone number'
        }
      }
    }
    
    return null
  }

  // Validate all visible fields
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    visibleFields.forEach(field => {
      const value = formData[field.name] || ''
      const error = validateField(field, value)
      if (error) {
        newErrors[field.name] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field change
  const handleChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  // Handle field blur (validate on blur)
  const handleBlur = (field: FormField) => {
    setTouched(prev => ({ ...prev, [field.name]: true }))
    const value = formData[field.name] || ''
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }))
    }
  }

  // Next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
    }
  }

  // Previous step
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        formId: config.id,
        data: formData,
        timestamp: new Date().toISOString(),
        metadata: {
          source: typeof window !== 'undefined' ? window.location.hostname : '',
          url: typeof window !== 'undefined' ? window.location.href : '',
        },
      })
      
      setIsSuccess(true)
    } catch (error) {
      logger.warn('Form submission failed', {
        action: 'formBuilder.submit',
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render success state
  if (isSuccess) {
    return (
      <div className="rounded-lg bg-[var(--surface-light)] p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--success)]" />
        <h3 className="mt-4 text-lg font-semibold text-[var(--text)]">
          {config.successMessage || 'Thank you!'}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          We&apos;ve received your submission and will get back to you soon.
        </p>
      </div>
    )
  }

  // Render field
  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''
    const error = touched[field.name] ? errors[field.name] : null
    const fieldId = `${config.id}-${field.id}`

    const baseInputClasses = cn(
      'w-full rounded-lg border px-3 py-2 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
      error 
        ? 'border-[var(--error)] focus:border-[var(--error)]' 
        : 'border-[var(--border)]'
    )

    switch (field.type) {
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId} className={cn(field.required && "after:ml-0.5 after:text-[var(--error)] after:content-['*']")}>
              {field.label}
            </Label>
            <textarea
              id={fieldId}
              name={field.name}
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              className={baseInputClasses}
            />
            {error && (
              <p className="flex items-center gap-1 text-sm text-[var(--error)]">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {field.helpText && <p className="text-xs text-[var(--text-muted)]">{field.helpText}</p>}
          </div>
        )

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId} className={cn(field.required && "after:ml-0.5 after:text-[var(--error)] after:content-['*']")}>
              {field.label}
            </Label>
            <select
              id={fieldId}
              name={field.name}
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              required={field.required}
              className={baseInputClasses}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="flex items-center gap-1 text-sm text-[var(--error)]">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id={fieldId}
                name={field.name}
                checked={value === 'true'}
                onChange={(e) => handleChange(field.name, e.target.checked ? 'true' : 'false')}
                required={field.required}
                className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)]"
              />
              <Label htmlFor={fieldId} className="text-sm font-normal">
                {field.label}
                {field.required && <span className="ml-0.5 text-[var(--error)]">*</span>}
              </Label>
            </div>
            {error && (
              <p className="flex items-center gap-1 text-sm text-[var(--error)]">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            <Label className={cn(field.required && "after:ml-0.5 after:text-[var(--error)] after:content-['*']")}>
              {field.label}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${fieldId}-${option.value}`}
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className="h-4 w-4 border-[var(--border)] text-[var(--primary)]"
                  />
                  <Label htmlFor={`${fieldId}-${option.value}`} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {error && (
              <p className="flex items-center gap-1 text-sm text-[var(--error)]">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      case 'rating':
        return (
          <div className="space-y-2">
            <Label className={cn(field.required && "after:ml-0.5 after:text-[var(--error)] after:content-['*']")}>
              {field.label}
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleChange(field.name, String(rating))}
                  className={cn(
                    'h-8 w-8 rounded-full transition-colors',
                    Number(value) >= rating
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--surface-light)] text-[var(--text-muted)] hover:bg-[var(--surface)]'
                  )}
                >
                  ★
                </button>
              ))}
            </div>
            {error && (
              <p className="flex items-center gap-1 text-sm text-[var(--error)]">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      default:
        // text, email, tel, number, date, time, datetime
        return (
          <div className="space-y-2">
            <Label htmlFor={fieldId} className={cn(field.required && "after:ml-0.5 after:text-[var(--error)] after:content-['*']")}>
              {field.label}
            </Label>
            <Input
              id={fieldId}
              type={field.type === 'datetime' ? 'datetime-local' : field.type}
              name={field.name}
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder={field.placeholder}
              required={field.required}
              min={field.validation?.min}
              max={field.validation?.max}
              className={cn(error && 'border-[var(--error)]')}
            />
            {error && (
              <p className="flex items-center gap-1 text-sm text-[var(--error)]">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {field.helpText && <p className="text-xs text-[var(--text-muted)]">{field.helpText}</p>}
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Form header */}
      {config.title && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-[var(--text)]">{config.title}</h3>
          {config.description && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">{config.description}</p>
          )}
        </div>
      )}

      {/* Step indicator */}
      {isMultiStep && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {config.steps!.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                    index < currentStep
                      ? 'bg-[var(--success)] text-white'
                      : index === currentStep
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--surface-light)] text-[var(--text-muted)]'
                  )}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-12',
                      index < currentStep ? 'bg-[var(--success)]' : 'bg-[var(--border)]'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          {currentStepData && (
            <div className="mt-4 text-center">
              <p className="font-medium text-[var(--text)]">{currentStepData.title}</p>
              {currentStepData.description && (
                <p className="text-sm text-[var(--text-muted)]">{currentStepData.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-4">
        {visibleFields.map((field) => (
          <div key={field.id}>{renderField(field)}</div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {isMultiStep && currentStep > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        {isMultiStep && currentStep < totalSteps - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="ml-auto flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="ml-auto flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {config.submitLabel || 'Submit'}
          </Button>
        )}
      </div>
    </form>
  )
}

// ============================================
// FORM FIELD PRESETS
// ============================================

/**
 * Pre-built form field configurations for common use cases.
 */

export const formPresets = {
  /** Contact form fields */
  contact: [
    { id: 'name', name: 'name', label: 'Full Name', type: 'text' as const, required: true },
    { id: 'email', name: 'email', label: 'Email Address', type: 'email' as const, required: true },
    { id: 'phone', name: 'phone', label: 'Phone Number', type: 'tel' as const },
    { id: 'subject', name: 'subject', label: 'Subject', type: 'text' as const },
    { id: 'message', name: 'message', label: 'Message', type: 'textarea' as const, required: true },
  ],

  /** Booking form fields */
  booking: [
    { id: 'name', name: 'name', label: 'Full Name', type: 'text' as const, required: true },
    { id: 'email', name: 'email', label: 'Email', type: 'email' as const, required: true },
    { id: 'phone', name: 'phone', label: 'Phone', type: 'tel' as const, required: true },
    { id: 'service', name: 'service', label: 'Service', type: 'select' as const, required: true },
    { id: 'date', name: 'date', label: 'Preferred Date', type: 'date' as const, required: true },
    { id: 'time', name: 'time', label: 'Preferred Time', type: 'time' as const, required: true },
    { id: 'notes', name: 'notes', label: 'Additional Notes', type: 'textarea' as const },
  ],

  /** Quote/estimate form fields */
  quote: [
    { id: 'name', name: 'name', label: 'Full Name', type: 'text' as const, required: true },
    { id: 'email', name: 'email', label: 'Email', type: 'email' as const, required: true },
    { id: 'phone', name: 'phone', label: 'Phone', type: 'tel' as const },
    { id: 'service_type', name: 'service_type', label: 'Service Type', type: 'select' as const, required: true },
    { id: 'budget', name: 'budget', label: 'Budget Range', type: 'select' as const },
    { id: 'details', name: 'details', label: 'Project Details', type: 'textarea' as const, required: true },
    { id: 'timeline', name: 'timeline', label: 'Desired Timeline', type: 'select' as const },
  ],

  /** Newsletter subscription */
  newsletter: [
    { id: 'email', name: 'email', label: 'Email Address', type: 'email' as const, required: true, placeholder: 'your@email.com' },
    { id: 'name', name: 'name', label: 'First Name (optional)', type: 'text' as const },
  ],

  /** Review/feedback form */
  feedback: [
    { id: 'name', name: 'name', label: 'Your Name', type: 'text' as const, required: true },
    { id: 'email', name: 'email', label: 'Email (optional)', type: 'email' as const },
    { id: 'rating', name: 'rating', label: 'Rating', type: 'rating' as const, required: true },
    { id: 'review', name: 'review', label: 'Your Review', type: 'textarea' as const, required: true },
    { id: 'recommend', name: 'recommend', label: 'Would you recommend us?', type: 'checkbox' as const },
  ],
}

// ============================================
// HELPER: CREATE FORM CONFIG
// ============================================

/**
 * Helper to create a form config from presets.
 * 
 * @example
 * const contactForm = createFormConfig({
 *   id: 'contact',
 *   preset: 'contact',
 *   title: 'Contact Us',
 * })
 */
export function createFormConfig({
  id,
  preset,
  title,
  fields,
  ...rest
}: {
  id: string
  preset?: keyof typeof formPresets
  title?: string
  fields?: FormField[]
  steps?: FormStep[]
  submitLabel?: string
  successMessage?: string
}): FormConfig {
  return {
    id,
    title,
    fields: fields || (preset ? formPresets[preset] : []),
    ...rest,
  }
}
