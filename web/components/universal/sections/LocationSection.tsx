/**
 * ANNOTATION: Location
 * 
 * What it is: A location section with an embedded Google Maps iframe, your business address, phone number, opening hours, and a "Get Directions" link that opens Google Maps navigation.
 * 
 * Why your business needs it: Makes it easy for customers to find and physically reach your business, especially important for local service businesses in Paraguay where directions can be unclear.
 * 
 * What AI populates from your data: ParaguAI fills your address, phone, hours, and Google Maps embed URL from your business data.
 * 
 * Your input: Business address, phone number, working hours, and Google Maps location/embed URL.
 * 
 * Plan availability: All plans
 */
import { MapPin, Phone, Clock, Navigation } from "lucide-react"
import { business, waLink, formatHours } from "@/lib/config/config"

export function Location() {
  return (
    <section className="py-20 bg-white">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-widest mb-4">
              <MapPin className="w-4 h-4" /> Ubicación
            </span>
            <h2 className="font-heading text-4xl font-bold text-primary mb-6">
              Encontranos en {business.address?.split(",")[0] || "tu ciudad"}
            </h2>
            <p className="text-foreground-light text-lg mb-8 leading-relaxed">
              Estamos ubicados en una zona accesible. Consultanos por mensaje y te enviamos la ubicación exacta.
            </p>

            {/* Contact details */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">Dirección</p>
                  <p className="text-foreground-light text-sm">{business.address}</p>
                  <a href={waLink("Hola! Quiero saber cómo llegar")} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-secondary font-medium hover:underline mt-1 inline-block">
                    Pedir ubicación exacta →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">Horarios</p>
                  <p className="text-foreground-light text-sm">{formatHours(business.hours ?? {})}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-0.5">WhatsApp</p>
                  <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="text-secondary font-medium hover:underline text-sm">
                    {business.phoneFormatted}
                  </a>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href={waLink("Hola! Cómo llego a su local?")} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary-dark transition-all">
                <Navigation className="w-5 h-5" />
                Cómo Llegar por WhatsApp
              </a>
              <a href={`https://www.google.com/maps?q=${encodeURIComponent(business.address || "")}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary/20 text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-all">
                <MapPin className="w-5 h-5" />
                Abrir en Google Maps
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address || "")}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ubicación ${business.name}`}
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{business.name}</p>
                  <p className="text-xs text-foreground-muted">{business.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}