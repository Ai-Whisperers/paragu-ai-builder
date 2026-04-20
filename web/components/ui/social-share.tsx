'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { 
  Link2, 
  Share2, 
  Check,
  MessageCircle,
  Send,
  Mail
} from 'lucide-react'

// Social media icons (SVG since lucide-react 1.8.0 doesn't include them)
const FacebookIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
)

const LinkedinIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

/**
 * Social Sharing System
 * 
 * Universal social sharing with:
 * - Share buttons for major platforms
 * - Copy link functionality
 * - Share counts (where available)
 * - Native share API (mobile)
 * - QR code generation
 * - Email sharing
 * 
 * Works for all content types: pages, services, products, blog posts.
 */

// ============================================
// TYPES
// ============================================

export type SharePlatform = 
  | 'facebook' 
  | 'twitter' 
  | 'linkedin' 
  | 'whatsapp' 
  | 'telegram'
  | 'email'
  | 'copy'

export interface ShareData {
  url: string
  title: string
  description?: string
  image?: string
}

export interface ShareButtonProps {
  platform: SharePlatform
  data: ShareData
  /** Show label with icon */
  showLabel?: boolean
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

// ============================================
// SHARE URL GENERATORS
// ============================================

const shareUrls = {
  facebook: (data: ShareData) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
  
  twitter: (data: ShareData) => 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`,
  
  linkedin: (data: ShareData) => 
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,
  
  whatsapp: (data: ShareData) => 
    `https://wa.me/?text=${encodeURIComponent(`${data.title} ${data.url}`)}`,
  
  telegram: (data: ShareData) => 
    `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`,
  
  email: (data: ShareData) => 
    `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.description || ''}\n\n${data.url}`)}`,
}

// ============================================
// INDIVIDUAL SHARE BUTTONS
// ============================================

const platformConfig: Record<Exclude<SharePlatform, 'copy'>, { icon: React.FC<{ className?: string }>; label: string; color: string }> = {
  facebook: {
    icon: FacebookIcon,
    label: 'Facebook',
    color: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
  },
  twitter: {
    icon: TwitterIcon,
    label: 'Twitter',
    color: 'bg-[#1DA1F2] hover:bg-[#1a91da] text-white',
  },
  linkedin: {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    color: 'bg-[#0A66C2] hover:bg-[#0958a8] text-white',
  },
  whatsapp: {
    icon: MessageCircle,
    label: 'WhatsApp',
    color: 'bg-[#25D366] hover:bg-[#21b858] text-white',
  },
  telegram: {
    icon: Send,
    label: 'Telegram',
    color: 'bg-[#26A5E4] hover:bg-[#1d94ce] text-white',
  },
  email: {
    icon: Mail,
    label: 'Email',
    color: 'bg-[var(--text-muted)] hover:bg-[var(--text)] text-white',
  },
}

/**
 * Individual share button for a specific platform.
 * 
 * @example
 * <ShareButton 
 *   platform="facebook" 
 *   data={{ url: 'https://site.com/page', title: 'My Page' }}
 * />
 */
export function ShareButton({
  platform,
  data,
  showLabel = false,
  size = 'md',
  variant = 'default',
  className,
}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const config = platform !== 'copy' ? platformConfig[platform] : null
  const Icon = config?.icon

  const handleClick = () => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(data.url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } else if (platform === 'email') {
      window.location.href = shareUrls.email(data)
    } else {
      const url = shareUrls[platform](data)
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  if (variant === 'ghost') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-light)] hover:text-[var(--text)]',
          className
        )}
        title={platform === 'copy' ? 'Copy link' : `Share on ${config?.label || platform}`}
      >
        {platform === 'copy' ? (
          isCopied ? <Check className="h-5 w-5 text-[var(--success)]" /> : <Link2 className="h-5 w-5" />
        ) : (
          Icon && <Icon className="h-5 w-5" />
        )}
        {showLabel && (
          <span className="text-sm">
            {platform === 'copy' ? (isCopied ? 'Copied!' : 'Copy link') : (config?.label || platform)}
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110',
        config?.color || 'bg-[var(--surface)] text-[var(--text)]',
        sizeClasses[size],
        showLabel && 'w-auto px-4 gap-2',
        className
      )}
      title={platform === 'copy' ? 'Copy link' : `Share on ${config?.label || platform}`}
    >
      {platform === 'copy' ? (
        isCopied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />
      ) : (
        Icon && <Icon />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {platform === 'copy' ? (isCopied ? 'Copied!' : 'Copy') : (config?.label || platform)}
        </span>
      )}
    </button>
  )
}

// ============================================
// SHARE BUTTONS GROUP
// ============================================

interface ShareButtonsProps {
  data: ShareData
  /** Which platforms to show */
  platforms?: SharePlatform[]
  /** Show labels on buttons */
  showLabels?: boolean
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Layout direction */
  direction?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * Group of share buttons.
 * 
 * @example
 * <ShareButtons
 *   data={{ url: 'https://site.com/page', title: 'My Page' }}
 *   platforms={['facebook', 'twitter', 'whatsapp', 'copy']}
 *   direction="horizontal"
 * />
 */
export function ShareButtons({
  data,
  platforms = ['facebook', 'twitter', 'whatsapp', 'copy'],
  showLabels = false,
  size = 'md',
  direction = 'horizontal',
  className,
}: ShareButtonsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        direction === 'vertical' && 'flex-col',
        className
      )}
    >
      {platforms.map((platform) => (
        <ShareButton
          key={platform}
          platform={platform}
          data={data}
          showLabel={showLabels}
          size={size}
        />
      ))}
    </div>
  )
}

// ============================================
// SHARE DROPDOWN
// ============================================

interface ShareDropdownProps {
  data: ShareData
  /** Button trigger text/icon */
  trigger?: React.ReactNode
  className?: string
}

/**
 * Share dropdown menu with all platforms.
 * 
 * @example
 * <ShareDropdown
 *   data={{ url: 'https://site.com/page', title: 'My Page' }}
 *   trigger={<Button>Share</Button>}
 * />
 */
export function ShareDropdown({
  data,
  trigger,
  className,
}: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(data.url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleShare = (platform: SharePlatform) => {
    if (platform === 'copy') {
      handleCopy()
    } else if (platform === 'email') {
      window.location.href = shareUrls.email(data)
    } else {
      const url = shareUrls[platform](data)
      window.open(url, '_blank', 'width=600,height=400')
    }
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-light)]"
      >
        {trigger || (
          <>
            <Share2 className="h-4 w-4" />
            Share
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg">
            <div className="p-2">
              <div className="mb-2 px-2 py-1 text-xs font-medium text-[var(--text-muted)]">
                Share this page
              </div>
              
              {(Object.keys(platformConfig) as Exclude<SharePlatform, 'copy'>[]).map((platform) => {
                const config = platformConfig[platform]
                const Icon = config.icon
                
                return (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface-light)]"
                  >
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-white', config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {config.label}
                  </button>
                )
              })}

              <div className="my-2 border-t border-[var(--border)]" />
              
              <button
                onClick={handleCopy}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface-light)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-light)]">
                  {isCopied ? (
                    <Check className="h-4 w-4 text-[var(--success)]" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </div>
                {isCopied ? 'Link copied!' : 'Copy link'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// NATIVE SHARE (Mobile)
// ============================================

interface NativeShareProps {
  data: ShareData
  children: React.ReactNode
  /** Fallback if native share not available */
  fallback?: React.ReactNode
  className?: string
}

/**
 * Native Web Share API wrapper for mobile devices.
 * Falls back to share buttons on desktop.
 * 
 * @example
 * <NativeShare
 *   data={{ url: 'https://site.com/page', title: 'My Page', description: 'Check this out' }}
 * >
 *   <Button>Share</Button>
 * </NativeShare>
 */
export function NativeShare({
  data,
  children,
  fallback,
  className,
}: NativeShareProps) {
  const [isNativeAvailable, setIsNativeAvailable] = useState(false)

  useState(() => {
    setIsNativeAvailable(typeof navigator !== 'undefined' && 'share' in navigator)
  })

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: data.url,
        })
      } catch (error) {
        // User cancelled or share failed — treat as debug; not an error
        logger.debug('Web Share dismissed', {
          action: 'socialShare.share',
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  if (isNativeAvailable) {
    return (
      <button onClick={handleShare} className={className}>
        {children}
      </button>
    )
  }

  return fallback || (
    <ShareDropdown data={data} trigger={children} className={className} />
  )
}

// ============================================
// SOCIAL FEED EMBED
// ============================================

interface SocialFeedProps {
  platform: 'instagram' | 'facebook' | 'twitter'
  /** Embed URL or handle */
  handle: string
  /** Number of posts to show */
  limit?: number
  className?: string
}

/**
 * Social media feed embed component.
 * Note: Requires appropriate embed scripts loaded.
 * 
 * @example
 * <SocialFeed platform="instagram" handle="@mybusiness" limit={6} />
 */
export function SocialFeed({
  platform,
  handle,
  limit = 6,
  className,
}: SocialFeedProps) {
  // This is a placeholder - actual implementation would require
  // platform-specific embed scripts/widgets
  return (
    <div className={cn('rounded-lg bg-[var(--surface-light)] p-4', className)}>
      <div className="mb-4 flex items-center gap-2">
        {platform === 'instagram' && <div className="h-5 w-5 rounded bg-gradient-to-br from-purple-500 to-pink-500" />}
        {platform === 'facebook' && <div className="h-5 w-5 rounded bg-[#1877F2]" />}
        {platform === 'twitter' && <div className="h-5 w-5 rounded bg-[#1DA1F2]" />}
        <span className="font-medium">{handle}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: limit }).map((_, i) => (
          <div 
            key={i} 
            className="aspect-square rounded bg-[var(--surface)] animate-pulse"
          />
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
        Follow us on {platform} for more updates
      </p>
    </div>
  )
}

// ============================================
// SOCIAL PROOF NOTIFICATION
// ============================================

interface SocialProofProps {
  /** Recent activity items */
  items: Array<{
    action: string
    location: string
    time: string
    avatar?: string
  }>
  /** Show notification toast */
  showToast?: boolean
  className?: string
}

/**
 * Social proof notifications - "Someone just booked" style.
 * 
 * @example
 * <SocialProof
 *   items={[
 *     { action: 'booked a haircut', location: 'Asunción', time: '2 min ago' },
 *     { action: 'purchased a package', location: 'Luque', time: '5 min ago' },
 *   ]}
 *   showToast
 * />
 */
export function SocialProof({
  items,
  showToast = true,
  className,
}: SocialProofProps) {
  // Placeholder - would need animation logic
  return (
    <div className={cn('space-y-2', className)}>
      {items.slice(0, 3).map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg bg-[var(--surface-light)] p-3 text-sm"
        >
          <div className="h-8 w-8 rounded-full bg-[var(--primary)]" />
          <div className="flex-1">
            <p className="text-[var(--text)]">
              Someone from {item.location} {item.action}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
