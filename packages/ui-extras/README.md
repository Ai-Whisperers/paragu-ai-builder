# @ai-whisperers/ui-extras

Reusable UI components for Ai-Whisperers client sites.

## Installation

```bash
npm install @ai-whisperers/ui-extras
```

## Components

### LoadingBar

Page transition indicator using `history.pushState` hijack.

```tsx
import { LoadingBar } from "@ai-whisperers/ui-extras"

export function Layout({ children }) {
  return (
    <>
      <LoadingBar />
      {children}
    </>
  )
}
```

### ShareWhatsApp

Share-to-WhatsApp button with pre-formatted message.

```tsx
import { ShareWhatsApp } from "@ai-whisperers/ui-extras"

<ShareWhatsApp
  whatsapp="595972000000"
  title="Nuestro nuevo servicio"
  url="https://tusitio.com/servicio"
  siteName="TuNegocio"
/>
```

### EmptyState

Configurable no-results placeholder.

```tsx
import { EmptyState } from "@ai-whisperers/ui-extras"

<EmptyState
  title="No hay productos"
  description="Probá con otra categoría."
  actionText="Ver catálogo completo"
  actionHref="/catalogo"
  emoji="🛍️"
/>
```

### DarkModeToggle

Theme switcher with localStorage persistence.

```tsx
import { DarkModeToggle } from "@ai-whisperers/ui-extras"

<DarkModeToggle
  storageKey="my_theme"
  lightLabel="Activar modo claro"
  darkLabel="Activar modo oscuro"
/>
```

### BottomNav

Mobile-only bottom navigation.

```tsx
import { BottomNav } from "@ai-whisperers/ui-extras"

<BottomNav
  lang="es"
  items={[
    { label: "Inicio", href: "/es", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" },
    { label: "Servicios", href: "/es/servicios", icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
    { label: "WhatsApp", href: "https://wa.me/595972000000", icon: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21", isExternal: true },
  ]}
  hiddenRoutes={["/admin", "/api"]}
/>
```

### PromoCarousel

Auto-rotating promo ticker.

```tsx
import { PromoCarousel } from "@ai-whisperers/ui-extras"

<PromoCarousel
  promotions={[
    { badge: "NUEVO", title: "Tratamiento de keratina", subtitle: "Ahorra 30%" },
    { title: "Pack Novia Completo", badge: "-15%" },
  ]}
  interval={5000}
  lang="es"
  offersHref="/es/ofertas"
  viewOffersLabel="Ver ofertas"
  icons={["🎉", "✨", "🔥"]}
/>
```

## Development

```bash
npm run dev    # Watch mode
npm run build  # Build TypeScript
npm publish    # Publish to npm
```

## License

MIT