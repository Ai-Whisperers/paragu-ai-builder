import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'

export interface ContactSectionProps {
  title: string
  address?: string
  neighborhood?: string
  city: string
  phone?: string
  email?: string
  whatsapp?: string
  googleMapsUrl?: string
  hours?: Record<string, string>
}

export function ContactSection({
  title,
  address,
  neighborhood,
  city,
  phone,
  email,
  whatsapp,
  googleMapsUrl,
  hours,
}: ContactSectionProps) {
  return (
    <section id="contacto" className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <div className="mb-12 text-center">
          <Heading level={2}>{title}</Heading>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Address */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Direccion</h3>
              <p className="text-[var(--text-muted)]">
                {address && <span>{address}<br /></span>}
                {neighborhood && <span>{neighborhood}, </span>}
                {city}
              </p>
            </div>

            {/* Phone / WhatsApp */}
            {(phone || whatsapp) && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Telefono</h3>
                {phone && (
                  <a href={`tel:${phone}`} className="block text-[var(--secondary)] hover:underline">
                    {phone}
                  </a>
                )}
                {whatsapp && (
                  <Button
                    variant="primary"
                    size="sm"
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    className="mt-2"
                  >
                    WhatsApp
                  </Button>
                )}
              </div>
            )}

            {/* Email */}
            {email && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Email</h3>
                <a href={`mailto:${email}`} className="text-[var(--secondary)] hover:underline">
                  {email}
                </a>
              </div>
            )}

            {/* Hours */}
            {hours && Object.keys(hours).length > 0 && (
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Horarios</h3>
                <dl className="space-y-1">
                  {Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <dt className="text-[var(--text)]">{day}</dt>
                      <dd className="text-[var(--text-muted)]">{time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="min-h-[300px] overflow-hidden rounded-lg bg-[var(--surface-light)]">
            {googleMapsUrl ? (
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="100%"
                className="min-h-[300px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${city}`}
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-[var(--text-muted)]">
                <p>{address ? `${address}, ${city}` : city}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
