import { appendWhatsAppLink } from '@/lib/whatsapp'

export default function WhatsAppFloating() {
  const message = 'Hola! Vi Paragu-ai y me gustaría saber más sobre sus servicios.'
  appendWhatsAppLink(message)
  return null
}
