# Paragu-AI Builder

Monorepo de componentes compartidos para sitios cliente de Ai-Whisperers.

## Estructura

```
paragu-ai-builder/
├── packages/
│   └── ui-extras/          # Componentes UI reutilizables
│       ├── src/
│       │   ├── loading-bar.tsx
│       │   ├── share-whatsapp.tsx
│       │   ├── empty-state.tsx
│       │   ├── dark-mode-toggle.tsx
│       │   ├── bottom-nav.tsx
│       │   ├── promo-carousel.tsx
│       │   ├── packages.tsx
│       │   └── services-with-packages.tsx
│       └── package.json
└── scripts/
    └── migrate-to-ui-extras.sh  # Script de migración automática
```

## Paquetes

### @ai-whisperers/ui-extras

Componentes UI reutilizables para todos los sitios cliente.

#### Componentes Disponibles

1. **LoadingBar** - Barra de carga transición de páginas
2. **ShareWhatsApp** - Botón compartir en WhatsApp
3. **EmptyState** - Estado vacío genérico
4. **DarkModeToggle** - Toggle tema claro/oscuro
5. **BottomNav** - Navegación inferior mobile
6. **PromoCarousel** - Carrusel de promociones auto-rotativo
7. **Packages** - Sección de packages/combos
8. **ServicesWithPackages** - Servicios + combos en un solo componente

#### Instalación

```bash
npm install @ai-whisperers/ui-extras@^1.0.0
```

#### Uso Ejemplo

```tsx
import { LoadingBar, DarkModeToggle, BottomNav, ServicesWithPackages } from "@ai-whisperers/ui-extras"

export default function Layout({ children }) {
  return (
    <>
      <LoadingBar />
      <DarkModeToggle storageKey="theme" />
      {children}
      <BottomNav
        lang="es"
        items={[
          { label: "Inicio", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" },
          { label: "Servicios", href: "/servicios", icon: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" },
          { label: "WhatsApp", href: "https://wa.me/595972000000", icon: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21", isExternal: true },
        ]}
      />
    </>
  )
}
```

## Script de Migración

### Migrar Todos los Sitios

```bash
cd /root/paragu-ai-builder
./scripts/migrate-to-ui-extras.sh --all
```

### Migrar un Sitio Específico

```bash
./scripts/migrate-to-ui-extras.sh --site magnolia-peluqueria
```

### Dry Run (Ver Cambios sin Aplicar)

```bash
./scripts/migrate-to-ui-extras.sh --dry-run --all
```

### Qué Hace el Script

1. Detecta si el sitio usa componentes locales (loading-bar, share-whatsapp, etc.)
2. Agrega `@ai-whisperers/ui-extras@^1.0.0` a package.json
3. Reemplaza imports locales con imports del package:
   - `import { LoadingBar } from "@/components/loading-bar"` → `import { LoadingBar } from "@ai-whisperers/ui-extras"`
4. Opcionalmente elimina archivos locales después de la migración

## Plan de Rollout por Fases

### Fase 1 (Semana 1)
- Magnolia Peluquería ✓ (origen de componentes)
- Leticia Carballo
- **Vertical:** Hair/Makeup

### Fase 2 (Semana 2)
- XXGym
- Cronos Academy
- **Vertical:** Gym/Fitness

### Fase 3 (Semana 3)
- Barbye Nails
- Avani Belleza
- Clau Bellino
- Viviesteticpy
- **Vertical:** Beauty/Nails

### Fase 4 (Semana 4)
- Nutrifit Spa
- HidroBaby Spa
- **Vertical:** Spa/Wellness

## Sitios Cliente

| Sitio | Status | Vertical | Dominio |
|-------|--------|----------|---------|
| magnolia-peluqueria | ✓ Migrado | Hair | magnolia-peluqueria.paragu-ai.com |
| leticia-carballo | ⏳ Pendiente | Makeup | leticia-carballo.paragu-ai.com |
| xxgym | ⏳ Pendiente | Gym | xxgym.paragu-ai.com |
| cronos-academy | ⏳ Pendiente | Gym | cronos-academy.paragu-ai.com |
| barbye-nails | ⏳ Pendiente | Nails | barbye-nails.paragu-ai.com |
| avani-belleza | ⏳ Pendiente | Beauty | avani-belleza.paragu-ai.com |
| clau-bellino | ⏳ Pendiente | Beauty | clau-bellino.paragu-ai.com |
| viviesteticpy | ⏳ Pendiente | Beauty | viviesteticpy.paragu-ai.com |
| nutrifit-spa | ⏳ Pendiente | Spa | nutrifit-spa.paragu-ai.com |
| hidrobaby-spa | ⏳ Pendiente | Spa | hidrobaby-spa.paragu-ai.com |

## Template Actualizado

`/root/template-nextjs-client/` incluye ahora:
- `@ai-whisperers/ui-extras` en dependencies
- LoadingBar, DarkModeToggle, BottomNav en layout.tsx
- Ejemplo de uso de ServicesWithPackages (documentado en código)

## Próximos Pasos

1. **Publicar package a npm**
   ```bash
   cd /root/paragu-ai-builder/packages/ui-extras
   npm publish
   ```

2. **Ejecutar migración en todos los sitios**
   ```bash
   ./scripts/migrate-to-ui-extras.sh --all
   ```

3. **Actualizar template con documentación completa**

4. **Deploy y verificación**
   - Test cada sitio mobile (bottom-nav)
   - Test dark mode toggle
   - Test loading bar transiciones

## Mantenimiento

Para agregar un nuevo componente:
1. Crear archivo en `packages/ui-extras/src/`
2. Exportar desde `packages/ui-extras/src/index.ts`
3. Actualizar package.json con nueva versión
4. Actualizar script de migración si aplica
5. Publicar: `npm publish`

## Issues & Soporte

- Reportar bugs: GitHub Issues
- Documentación: packages/ui-extras/README.md