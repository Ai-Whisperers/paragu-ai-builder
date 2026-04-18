'use client'

import { useState } from 'react'

interface WhatsAppButtonProps {
  phone: string
  message?: string
  position?: 'bottom-right' | 'bottom-left' | 'floating'
  showLabel?: boolean
  label?: string
}

export default function WhatsAppButton({
  phone,
  message = 'Hola! Me gustaría más información sobre sus servicios',
  position = 'bottom-right',
  showLabel = true,
  label = 'Envíanos un mensaje'
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank')
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'floating': 'bottom-6 right-6'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {showLabel && (
        <div className={`mb-2 bg-white rounded-lg shadow-lg px-4 py-2 ${position === 'bottom-right' ? 'mr-4' : 'ml-4'}`}>
          <p className="text-sm text-gray-700 whitespace-nowrap font-medium">
            {label}
          </p>
        </div>
      )}
      
      <button
        onClick={handleClick}
        className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full py-3 px-5 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a5.26 5.26 0 01-2.876-1.037l-.21-.289-3.81 1.003 1.005-3.699-.257-.207a5.214 5.214 0 01-1.065-2.887c0-.297.05-.597.14-.889l.49-1.67c.115-.394.06-.835-.115-1.196-.175-.361-.872-.788-1.826-.788H5.156c-.868 0-1.402.566-1.615.994-.213.428-.213 1.073 0 1.5l2.18 3.708c.214.366.427.732.61 1.024.183.292.395.578.795.892.4.314 1.07.697 1.867.697.796 0 1.467-.383 1.867-.697.4-.314.612-.6.795-.892.183-.292.396-.658.61-1.024l.61-.764c.114-.146.115-.328.084-.5-.03-.172-.11-.317-.24-.445-.13-.128-.872-.624-1.15-1.003-.276-.379-.467-.757-.467-1.236 0-.478.38-1.044.963-1.414 1.11-.703 2.616-1.132 3.87-1.132 1.253 0 2.76.43 3.87 1.132.584.37.964.936.964 1.414 0 .48-.19.858-.468 1.237-.277.378-.919 1.003-1.15 1.003z"/>
        </svg>
        <span className="font-medium hidden sm:inline">WhatsApp</span>
      </button>
    </div>
  )
}