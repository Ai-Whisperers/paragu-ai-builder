/**
 * Three collapsible `<details>` panels on the PDP with vocabulary-light
 * answers to the questions every first-time buyer in this vertical asks
 * before they add to cart:
 *   - "How do I keep this clean / not break it?"
 *   - "What size do I order if I don't know my size?"
 *   - "When does it arrive, how discreetly, and can I return it?"
 *
 * Content is intentionally hard-coded here (not pulled from the
 * per-tenant `content/es.json`) because every fun4me PDP asks the same
 * three questions with the same answers — pushing it into tenant copy
 * would multiply content-entry work without adding flexibility.
 *
 * `<details>` is native, keyboard-accessible, and ships zero JS.
 */

interface Props {
  /** When true, render category-specific guidance. Opt-out default keeps
   *  the copy generic so it's still useful on non-adult stores if the
   *  component ever gets reused. */
  vertical?: 'adult-retail' | 'generic'
}

const PANELS_ADULT: Array<{ title: string; body: string }> = [
  {
    title: 'Cómo cuidar y limpiar',
    body:
      'Agua tibia + jabón neutro, o limpiador específico para juguetes. ' +
      'Silicona y acero: hasta 10 minutos en agua hirviendo. ' +
      'Baterías recargables: usá el cable original y no dejés cargando más de 4 horas. ' +
      'Siempre secar al aire antes de guardar.',
  },
  {
    title: 'Cómo elegir el talle (lencería)',
    body:
      'Si dudás, andá una talla arriba — las marcas Leg Avenue, Dreamgirl y similares tallan más chico que la ropa regular. ' +
      'Plus size empieza en XL. Cada producto tiene la tabla específica en su descripción. ' +
      'Si el talle no te queda, tenés cambio dentro de los 7 días (sin abrir, sin usar).',
  },
  {
    title: 'Envío, privacidad y cambios',
    body:
      'Asunción y GBA: 24-72hs hábiles. Interior: 3-5 días hábiles. ' +
      'Empaque 100% discreto, sin logos ni nombre del rubro en el remito. ' +
      'Pago con tarjeta aparece en el resumen como "F4M Comercial". ' +
      'Envío gratis en compras mayores a Gs 200.000. ' +
      'Cambios dentro de 7 días si viene sin abrir o con defecto.',
  },
]

const PANELS_GENERIC: Array<{ title: string; body: string }> = [
  {
    title: 'Cuidado y mantenimiento',
    body: 'Seguí las indicaciones específicas de la etiqueta del producto.',
  },
  {
    title: 'Envío y cambios',
    body:
      'Despachamos dentro de las 24hs hábiles. ' +
      'Tenés 7 días para cambios si viene sin uso o con defecto.',
  },
]

export function PdpCareGuide({ vertical = 'adult-retail' }: Props) {
  const panels = vertical === 'adult-retail' ? PANELS_ADULT : PANELS_GENERIC
  return (
    <section aria-label="Guías del producto" className="mt-8 space-y-2">
      {panels.map((p) => (
        <details
          key={p.title}
          className="group rounded-lg border border-[color:var(--border,#e5e7eb)] bg-surface open:shadow-sm"
        >
          <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-[color:var(--text,#111)] marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{p.title}</span>
            <span
              aria-hidden="true"
              className="text-[color:var(--text-muted,#9ca3af)] transition-transform group-open:rotate-180"
            >
              ▾
            </span>
          </summary>
          <p className="px-4 pb-4 text-sm leading-relaxed text-[color:var(--text-muted,#4b5563)]">
            {p.body}
          </p>
        </details>
      ))}
    </section>
  )
}
