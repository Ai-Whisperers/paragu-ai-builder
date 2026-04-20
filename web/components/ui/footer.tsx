'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  Share2,
  Globe
} from 'lucide-react'

/**
 * Universal Footer System
 * 
 * Configurable footer patterns for all business types:
 * - Multi-tier footer (4 columns, newsletter, social)
 * - Simple footer (minimal)
 * - Business footer (hours, contact, map)
 * - E-commerce footer (payment methods, trust badges)
 */

// ============================================
// TYPES
// ============================================

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'whatsapp' | 'tiktok'
  href: string
  label?: string
}

export interface BusinessHours {
  day: string
  hours: string
  isOpen?: boolean
}

export interface ContactInfo {
  address?: string
  phone?: string
  email?: string
  mapUrl?: string
}

export interface NewsletterConfig {
  title?: string
  description?: string
  buttonText?: string
  placeholder?: string
  privacyText?: string
}

// ============================================
// SOCIAL ICONS
// ============================================

// Social media icons (SVG since lucide-react 1.8.0 doesn't include them)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const socialIcons: Record<string, React.FC> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  whatsapp: WhatsappIcon,
  tiktok: TiktokIcon,
}

// ============================================
// UNIVERSAL FOOTER (Multi-tier)
// ============================================

interface UniversalFooterProps {
  /** Logo or brand name */
  logo?: React.ReactNode
  /** Footer columns (max 4 recommended) */
  columns?: FooterColumn[]
  /** Social media links */
  social?: SocialLink[]
  /** Newsletter subscription */
  newsletter?: NewsletterConfig
  /** Show newsletter section */
  showNewsletter?: boolean
  /** Bottom bar content */
  bottomBar?: {
    copyright?: string
    legalLinks?: FooterLink[]
    paymentMethods?: React.ReactNode
  }
  /** Background variant */
  variant?: 'default' | 'dark' | 'primary' | 'gradient'
  /** Include structured data */
  includeSchema?: boolean
  className?: string
}

/**
 * Universal Multi-Tier Footer
 * 
 * Supports up to 4 columns, newsletter, social links, and bottom bar.
 * Works for all business types.
 * 
 * @example
 * <UniversalFooter
 *   logo={<Logo />}
 *   columns={[
 *     { title: 'Services', links: [...] },
 *     { title: 'Company', links: [...] },
 *     { title: 'Support', links: [...] },
 *   ]}
 *   social={[
 *     { platform: 'facebook', href: 'https://facebook.com/...' },
 *     { platform: 'instagram', href: 'https://instagram.com/...' },
 *   ]}
 *   newsletter={{
 *     title: 'Subscribe to our newsletter',
 *     description: 'Get updates on new services and offers',
 *   }}
 * />
 */
export function UniversalFooter({
  logo,
  columns = [],
  social,
  newsletter,
  showNewsletter = false,
  bottomBar,
  variant = 'default',
  includeSchema = true,
  className,
}: UniversalFooterProps) {
  const variantClasses = {
    default: 'bg-[var(--surface-light)]',
    dark: 'bg-[var(--text)] text-[var(--background)]',
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
    gradient: 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)]',
  }

  const textColorClasses = {
    default: 'text-[var(--text)]',
    dark: 'text-[var(--background)]',
    primary: 'text-[var(--primary-foreground)]',
    gradient: 'text-[var(--primary-foreground)]',
  }

  const mutedTextClasses = {
    default: 'text-[var(--text-muted)]',
    dark: 'text-[var(--background)]/70',
    primary: 'text-[var(--primary-foreground)]/80',
    gradient: 'text-[var(--primary-foreground)]/80',
  }

  // Schema.org Organization JSON-LD
  const schemaData = includeSchema ? {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: typeof logo === 'string' ? logo : undefined,
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    sameAs: social?.map(s => s.href),
  } : null

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      
      <footer className={cn(variantClasses[variant], className)}>
        {/* Main footer content */}
        <Container>
          <div className="py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Logo & description column */}
              <div className="lg:col-span-4">
                {logo && <div className="mb-4">{logo}</div>}
                
                {/* Social links */}
                {social && social.length > 0 && (
                  <div className="mt-6">
                    <p className={cn('mb-3 text-sm font-medium', mutedTextClasses[variant])}>
                      Follow us
                    </p>
                    <div className="flex gap-3">
                      {social.map((item) => {
                        const Icon = socialIcons[item.platform]
                        return (
                          <a
                            key={item.platform}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                              variant === 'default' 
                                ? 'bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]'
                                : 'bg-white/10 hover:bg-white/20'
                            )}
                            aria-label={item.label || item.platform}
                          >
                            <Icon />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Link columns */}
              <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
                {columns.map((column) => (
                  <div key={column.title}>
                    <h3 className={cn('mb-4 text-sm font-semibold uppercase tracking-wide', textColorClasses[variant])}>
                      {column.title}
                    </h3>
                    <ul className="space-y-3">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              'text-sm transition-colors hover:text-[var(--primary)]',
                              mutedTextClasses[variant]
                            )}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Newsletter column */}
              {showNewsletter && newsletter && (
                <div className="lg:col-span-3">
                  <h3 className={cn('mb-4 text-sm font-semibold uppercase tracking-wide', textColorClasses[variant])}>
                    {newsletter.title || 'Newsletter'}
                  </h3>
                  <p className={cn('mb-4 text-sm', mutedTextClasses[variant])}>
                    {newsletter.description || 'Subscribe to get updates'}
                  </p>
                  <form 
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      // Handle newsletter submission
                    }}
                  >
                    <Input
                      type="email"
                      placeholder={newsletter.placeholder || 'Your email'}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Send size={16} />
                    </Button>
                  </form>
                  {newsletter.privacyText && (
                    <p className={cn('mt-2 text-xs', mutedTextClasses[variant])}>
                      {newsletter.privacyText}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Bottom bar */}
        {bottomBar && (
          <div className={cn(
            'border-t',
            variant === 'default' ? 'border-[var(--border)]' : 'border-white/10'
          )}>
            <Container>
              <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
                {/* Copyright */}
                {bottomBar.copyright && (
                  <p className={cn('text-sm', mutedTextClasses[variant])}>
                    {bottomBar.copyright}
                  </p>
                )}

                {/* Legal links */}
                {bottomBar.legalLinks && (
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
                    {bottomBar.legalLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn('text-sm transition-colors hover:text-[var(--primary)]', mutedTextClasses[variant])}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Payment methods */}
                {bottomBar.paymentMethods && (
                  <div className="flex items-center gap-2">
                    {bottomBar.paymentMethods}
                  </div>
                )}
              </div>
            </Container>
          </div>
        )}
      </footer>
    </>
  )
}

// ============================================
// BUSINESS FOOTER (With hours & contact)
// ============================================

interface BusinessFooterProps {
  logo?: React.ReactNode
  businessName: string
  description?: string
  contact: ContactInfo
  hours?: BusinessHours[]
  social?: SocialLink[]
  quickLinks?: FooterLink[]
  showMap?: boolean
  variant?: 'default' | 'dark' | 'primary'
  className?: string
}

/**
 * Business Footer with contact info, hours, and map.
 * Perfect for salons, clinics, restaurants, shops.
 * 
 * @example
 * <BusinessFooter
 *   businessName="Studio Hair"
 *   description="Premium hair styling services"
 *   contact={{
 *     address: '123 Main St, City',
 *     phone: '+1 234 567 890',
 *     email: 'info@studio.com',
 *   }}
 *   hours={[
 *     { day: 'Mon-Fri', hours: '9:00 - 18:00', isOpen: true },
 *     { day: 'Sat', hours: '10:00 - 16:00', isOpen: true },
 *     { day: 'Sun', hours: 'Closed', isOpen: false },
 *   ]}
 * />
 */
export function BusinessFooter({
  logo,
  businessName,
  description,
  contact,
  hours,
  social,
  quickLinks,
  showMap = false,
  variant = 'default',
  className,
}: BusinessFooterProps) {
  const variantClasses = {
    default: 'bg-[var(--surface-light)]',
    dark: 'bg-[var(--text)] text-[var(--background)]',
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
  }

  const textColorClasses = {
    default: 'text-[var(--text)]',
    dark: 'text-[var(--background)]',
    primary: 'text-[var(--primary-foreground)]',
  }

  const mutedTextClasses = {
    default: 'text-[var(--text-muted)]',
    dark: 'text-[var(--background)]/70',
    primary: 'text-[var(--primary-foreground)]/80',
  }

  return (
    <footer className={cn(variantClasses[variant], className)}>
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Business info */}
            <div className="lg:col-span-4">
              {logo || <h3 className={cn('text-xl font-bold', textColorClasses[variant])}>{businessName}</h3>}
              {description && (
                <p className={cn('mt-3 text-sm', mutedTextClasses[variant])}>{description}</p>
              )}

              {/* Contact info */}
              <div className="mt-6 space-y-3">
                {contact.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className={cn('mt-0.5 flex-shrink-0', mutedTextClasses[variant])} />
                    <span className={cn('text-sm', textColorClasses[variant])}>{contact.address}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className={cn('flex-shrink-0', mutedTextClasses[variant])} />
                    <a href={`tel:${contact.phone}`} className={cn('text-sm hover:text-[var(--primary)]', textColorClasses[variant])}>
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} className={cn('flex-shrink-0', mutedTextClasses[variant])} />
                    <a href={`mailto:${contact.email}`} className={cn('text-sm hover:text-[var(--primary)]', textColorClasses[variant])}>
                      {contact.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social links */}
              {social && social.length > 0 && (
                <div className="mt-6 flex gap-3">
                  {social.map((item) => {
                    const Icon = socialIcons[item.platform]
                    return (
                      <a
                        key={item.platform}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                          variant === 'default' 
                            ? 'bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]'
                            : 'bg-white/10 hover:bg-white/20'
                        )}
                      >
                        <Icon />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Business hours */}
            {hours && hours.length > 0 && (
              <div className="lg:col-span-3">
                <h4 className={cn('mb-4 text-sm font-semibold uppercase tracking-wide', textColorClasses[variant])}>
                  Hours
                </h4>
                <ul className="space-y-2">
                  {hours.map((item) => (
                    <li key={item.day} className="flex items-center justify-between text-sm">
                      <span className={textColorClasses[variant]}>{item.day}</span>
                      <span className={cn(
                        item.isOpen === false ? 'text-[var(--error)]' : mutedTextClasses[variant]
                      )}>
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick links */}
            {quickLinks && quickLinks.length > 0 && (
              <div className="lg:col-span-2">
                <h4 className={cn('mb-4 text-sm font-semibold uppercase tracking-wide', textColorClasses[variant])}>
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn('text-sm transition-colors hover:text-[var(--primary)]', mutedTextClasses[variant])}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map */}
            {showMap && contact.mapUrl && (
              <div className="lg:col-span-3">
                <h4 className={cn('mb-4 text-sm font-semibold uppercase tracking-wide', textColorClasses[variant])}>
                  Location
                </h4>
                <div className="aspect-video overflow-hidden rounded-lg">
                  <iframe
                    src={contact.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Business Location"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Copyright bar */}
      <div className={cn(
        'border-t',
        variant === 'default' ? 'border-[var(--border)]' : 'border-white/10'
      )}>
        <Container>
          <div className="py-6 text-center">
            <p className={cn('text-sm', mutedTextClasses[variant])}>
              © {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}

// ============================================
// SIMPLE FOOTER (Minimal)
// ============================================

interface SimpleFooterProps {
  logo?: React.ReactNode
  copyright: string
  links?: FooterLink[]
  social?: SocialLink[]
  variant?: 'default' | 'dark'
  className?: string
}

/**
 * Simple minimal footer - just copyright and links.
 * 
 * @example
 * <SimpleFooter
 *   copyright="© 2024 Company Name"
 *   links={[
 *     { label: 'Privacy', href: '/privacy' },
 *     { label: 'Terms', href: '/terms' },
 *   ]}
 * />
 */
export function SimpleFooter({
  logo,
  copyright,
  links,
  social,
  variant = 'default',
  className,
}: SimpleFooterProps) {
  const variantClasses = {
    default: 'bg-[var(--surface-light)]',
    dark: 'bg-[var(--text)] text-[var(--background)]',
  }

  return (
    <footer className={cn(variantClasses[variant], className)}>
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <div className="flex items-center gap-4">
            {logo}
            <p className={cn(
              'text-sm',
              variant === 'default' ? 'text-[var(--text-muted)]' : 'text-[var(--background)]/70'
            )}>
              {copyright}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {links?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors',
                  variant === 'default' 
                    ? 'text-[var(--text-muted)] hover:text-[var(--text)]'
                    : 'text-[var(--background)]/70 hover:text-[var(--background)]'
                )}
              >
                {link.label}
              </Link>
            ))}

            {social && social.length > 0 && (
              <div className="flex items-center gap-2 border-l pl-6">
                {social.map((item) => {
                  const Icon = socialIcons[item.platform]
                  return (
                    <a
                      key={item.platform}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'p-2 transition-colors',
                        variant === 'default'
                          ? 'text-[var(--text-muted)] hover:text-[var(--text)]'
                          : 'text-[var(--background)]/70 hover:text-[var(--background)]'
                      )}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  )
}
