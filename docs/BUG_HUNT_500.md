# ParaguAI Bug Hunt & Polish Plan — 500 items

> **Generated 2026-04-21.** A complete, prioritized inventory of everything
> wrong, missing, or improvable across tenants, demos, marketing site, code,
> infra, and docs. Treat as the source-of-truth backlog until launch.
>
> **Format:** `[NNN] [P0|P1|P2|P3 · category · effort] Description`
>
> - **Priority:** P0=blocks launch · P1=should fix before launch · P2=should
>   fix this quarter · P3=nice-to-have
> - **Effort:** 5m / 30m / 1h / 2h / 4h / 1d / 2d
> - **Category:** content · infra · code · seo · ux · admin · data · auth ·
>   email · cron · perf · a11y · obs · test · docs · brand · legal
>
> **Scope:** 5 real tenants + ~110 demo tenants + ~140 marketing routes +
> ~25 admin/API routes + cron + DB + ops.

---

## Section A · Real-tenant content (1–60)

### A1 · Nexa Paraguay (1–18)

```
[001] [P0 · content · 30m] Verify the deployed `595982515138` matches a real
        WhatsApp Business and is monitored — call it from a clean phone.
[002] [P0 · content · 30m] Replace `nl` page hero/lead — currently auto-
        translated; should be human-quality Dutch or remove until paid.
[003] [P0 · content · 1h] German (`de`) locale flagged machine-translated
        in CI — pay for human translation OR remove `de` from `locales` in
        sites/nexa-paraguay/site.json.
[004] [P0 · content · 30m] Verify all four `/s/{es,en,nl,de}/nexa-paraguay`
        render every page (home, programas, por-que-paraguay, proceso, sobre,
        faq, blog, contacto, privacidad) without missing-key errors.
[005] [P1 · brand · 4h] Replace placeholder hero image
        `/sites/nexa-paraguay/images/hero/hero-bg.jpg` with a real Asunción
        cityscape (per AI Assets Plan: Flux Pro generation).
[006] [P1 · content · 1h] Audit for typos and accent drift in es.json
        (e.g. `Asuncion` → `Asunción`, `Republica` → `República`).
[007] [P1 · content · 2h] Match copy length across locales — currently
        en.json sections vary in word count, breaking visual parity.
[008] [P1 · seo · 30m] Add `hreflang` x-default to point to /s/en/ for
        international visitors (current default-locale=en is good but
        x-default is missing).
[009] [P1 · content · 1h] FAQ section claims "Nexa works in 4 idiomas" —
        verify the actual language match for each program.
[010] [P1 · seo · 1h] Schema.org Organization in head needs `sameAs` array
        pointing to verified social profiles.
[011] [P2 · brand · 2h] Real Nexa logo SVG — currently text wordmark in
        BusinessHeader. Get from team or generate via Recraft.
[012] [P2 · content · 2h] Programas page: validate price ranges quoted
        ("USD 35,000 base") match current Nexa offer or anonymize.
[013] [P2 · ux · 30m] Por-qué-Paraguay section claims "EU exit fastest" —
        cite source or soften.
[014] [P2 · content · 1h] Add testimonial section — currently Nexa has
        `testimonials: false` in features. Get 1-2 real quotes.
[015] [P2 · content · 2h] Blog has no posts — start with one anchored
        post per quarter ("Q1 2026: changes in PY residency requirements").
[016] [P2 · perf · 1h] hero-bg.jpg is multi-MB; convert to WebP, set
        explicit width/height, add `priority` flag.
[017] [P3 · ux · 1h] Booking CTA points to calendly.com/nexaparaguay/
        consulta — verify the link works and intake form is set up.
[018] [P3 · seo · 2h] Add per-locale OG images (currently shared) so
        WhatsApp shares of /s/nl/nexa-paraguay show Dutch preview text.
```

### A2 · Nexa Uruguay (19–28)

```
[019] [P0 · content · 30m] Verify ctaHref WhatsApp matches the shared
        `595982515138` and works.
[020] [P0 · seo · 30m] Add Nexa-Uruguay-specific Schema.org address (UY
        country code) — currently inherited from Paraguay shape.
[021] [P1 · content · 1h] EN content was backfilled in PR #93; review
        all home.* sections for missing keys (the PR title literally says
        "backfill missing home.* refs in en locale").
[022] [P1 · content · 1h] Audit es.json for "Paraguay" leftover from the
        PY copy — should say "Uruguay" everywhere.
[023] [P1 · content · 30m] Hero subhead specific to UY value prop
        (gas+commerce regs differ from PY).
[024] [P1 · brand · 1h] Tokens.json color palette — should it differ from
        Paraguay's, or share the Nexa family identity?
[025] [P2 · content · 2h] Programs page UY-specific (residency by deposit
        is different from PY's investor visa).
[026] [P2 · content · 1h] Replace Asunción references with Montevideo.
[027] [P2 · seo · 1h] Sitemap entries for nexa-uruguay routes (currently
        skipped per PRERENDER_SKIP_SITES).
[028] [P3 · ux · 1h] Add Spanish + English locale switcher on tenant
        header (already wired generically — verify).
```

### A3 · Nexa Propiedades (29–38)

```
[029] [P0 · content · 30m] Replace inspirational "500 propiedades" claim
        already done — verify on prod after deploy.
[030] [P0 · data · 4h] Listings page renders 2 hardcoded properties
        ("Casa Moderna en Asunción", "Departamento de Lujo"). Either
        connect to a real source (CSV import, manual admin) or label
        them as "ejemplos".
[031] [P1 · content · 1h] Calculadora de Hipoteca — verify the rate
        assumption (PY mortgage rates differ from US/EU defaults).
[032] [P1 · content · 30m] Phone in contact section is `+595 981 234 567`
        — placeholder. Replace with `595982515138`.
[033] [P1 · content · 30m] Email `info@nexapropiedades.com` — verify
        domain is set up to receive mail and someone monitors it.
[034] [P1 · brand · 2h] Distinct brand identity vs Nexa Paraguay/Uruguay
        — same family, different role. Tokens.json colors mostly inherit.
[035] [P1 · seo · 1h] PropertyType, RealEstateAgent Schema.org per
        listing. Currently emits LocalBusiness only.
[036] [P2 · content · 2h] Three locales (es/en/pt) — verify pt renders
        without missing-key errors. Brazil is the natural pt audience.
[037] [P2 · ux · 2h] Per-property gallery + "agendar visita" CTA per
        listing.
[038] [P3 · brand · 1h] Property images — currently SVG placeholders.
        Stock photos or AI-generated until real listings.
```

### A4 · Dayah Litworks (39–48)

```
[039] [P0 · content · 30m] Tagline rewritten in PR #84 — verify on prod.
[040] [P0 · content · 30m] Phone `+595981000000` placeholder still in
        contact section field — replace with `595986868241`.
[041] [P1 · content · 1h] Pricing strategy: user wants USD + Gs based on
        visitor location. Implement geo-IP detection + currency switcher.
[042] [P1 · content · 2h] 6 demo book covers ("Susurros del Bosque" etc.)
        — replace with Dayah's real portfolio.
[043] [P1 · brand · 4h] Real Dayah logo SVG — get from her or generate.
[044] [P1 · ux · 2h] Encargo process — currently "Contactanos" only.
        Add a multi-step intake form (genre, deadline, budget, brief).
[045] [P2 · content · 1h] Testimonios section has 2 generic quotes —
        replace with real authors who Dayah has worked with.
[046] [P2 · seo · 1h] Schema.org: switch from LocalBusiness to
        ProfessionalService or LocalBusiness with subtype Designer.
[047] [P2 · content · 1h] Instagram handle `@dayah.litworks` — verify
        it's the real one and active.
[048] [P3 · ux · 30m] Add visible "trabajo en USD" badge in hero.
```

### A5 · De Abasto a Casa (49–60)

```
[049] [P0 · content · 30m] WhatsApp `595981324569` (shared with
        ParaguAI) — confirm with Iván this is intentional or get his.
[050] [P0 · content · 30m] Verify the menu prices in es.json
        ("250.000 Gs/semana") are current.
[051] [P1 · content · 2h] Weekly menu rotation: who updates it and how
        often? Currently a static list. Build a /admin/menu editor or
        accept that admin manually edits content.
[052] [P1 · content · 1h] Service tiers (Nivel 1 Basico/Completo, Nivel
        2 Individual) need clearer differentiation copy.
[053] [P1 · ux · 2h] Pre-formatted WhatsApp checkout: when user picks
        items, message generates with the cart pre-filled.
[054] [P1 · brand · 4h] Logo (currently text wordmark).
[055] [P1 · content · 1h] About section — Iván's story, why meal prep
        for Asunción.
[056] [P2 · content · 2h] FAQ specific to meal prep (delivery zones,
        substitution policy, dietary restrictions).
[057] [P2 · ux · 2h] Subscription model — weekly auto-recurring vs
        per-week opt-in. Iván's stated model is per-week.
[058] [P2 · content · 1h] Photos of actual dishes — currently no
        imageUrl set on items.
[059] [P2 · seo · 1h] Schema.org: FoodService or Restaurant with
        deliveryAvailable=true.
[060] [P3 · content · 2h] Customer testimonials + photos.
```

---

## Section B · Demo tenants polish (61–320) — ~20 items per demo × 13 priority demos

> The 110 demo dirs created by `batch-create-demos.ts` need triage. Phase 1
> polishes the 13 templates that the marketing site links from `/p/[rubro]`
> (the ones a prospect will actually click). Phase 2 expands.

### B1 · salon-maria (peluquería · 61–80)

```
[061] [P0 · content · 30m] Replace `+595981234567` placeholder phone in
        demo-data.ts (this is the original test number).
[062] [P0 · brand · 1h] Add visible "DEMO" badge — without it prospects
        may think it's a real client.
[063] [P0 · content · 1h] Realistic Asunción address (currently
        "Av. Mcal. Lopez 3245").
[064] [P1 · content · 2h] Service prices reflect current Asunción
        peluquería rates (Gs 80K corte dama is reasonable, verify).
[065] [P1 · brand · 2h] Logo SVG — Recraft generation per AI Assets Plan.
[066] [P1 · brand · 4h] Hero image — Flux Pro: warm interior of a
        Paraguayan peluquería, golden hour lighting.
[067] [P1 · brand · 2h] 4 service photos: corte, color, balayage,
        keratina (Flux Pro).
[068] [P1 · content · 1h] Team bios: 3 members with realistic
        Paraguayan names + 3-line bios (already exists, polish length).
[069] [P1 · content · 1h] Testimonials: 3 quotes that don't sound
        AI-generic (Maria, Patricia, Sofia all 5 stars feels staged).
[070] [P1 · ux · 1h] Hours block — currently OK; add a "now
        open/closed" computed indicator.
[071] [P2 · ux · 2h] Booking flow with date/time picker — currently
        the section component exists; wire to a fake calendar.
[072] [P2 · content · 1h] FAQ specific to peluquerías ("¿necesito
        reservar?", "¿aceptan Mercado Pago?").
[073] [P2 · content · 1h] Instagram + Facebook handles — verifiable
        fake or omit.
[074] [P2 · seo · 30m] Schema.org BeautySalon (already correct?).
[075] [P2 · perf · 30m] Hero image WebP + lazy-load below-fold images.
[076] [P2 · ux · 1h] WhatsApp pre-filled message: "Hola Salon Maria,
        quiero reservar [servicio]".
[077] [P2 · ux · 1h] Gallery section — 8-12 hair-style examples.
[078] [P3 · content · 1h] Promotions banner: "10% off martes".
[079] [P3 · content · 1h] Loyalty / referral text in footer.
[080] [P3 · a11y · 30m] Alt text for all images.
```

### B2 · gymfit-py (gimnasio · 81–100)

```
[081] [P0 · content · 30m] Replace +595987654321 placeholder.
[082] [P0 · brand · 1h] DEMO badge.
[083] [P0 · content · 1h] Realistic address + neighborhood (currently
        "Av. Espana 1234, Centro").
[084] [P1 · brand · 4h] Hero photo — Flux Pro: bright modern PY gym.
[085] [P1 · brand · 2h] Logo (Recraft).
[086] [P1 · content · 1h] Class schedule (lunes 7am crossfit, etc.) —
        currently no schedule rendered.
[087] [P1 · content · 2h] Membership pricing: realistic vs Asunción
        market (Gs 150K/mes musculación reads OK).
[088] [P1 · content · 1h] Trainer profiles (3 staff) with specialty.
[089] [P1 · ux · 1h] "Probá una clase gratis" lead form CTA.
[090] [P2 · brand · 2h] Equipment photos (4-6).
[091] [P2 · content · 1h] Group class types (yoga, spinning, hiit).
[092] [P2 · content · 1h] Membership tier matrix (basic / full / family).
[093] [P2 · ux · 2h] Before/after testimonials (consent caveat for
        demo: clearly fictional).
[094] [P2 · content · 1h] Hours per day of week + holiday calendar.
[095] [P2 · seo · 30m] Schema.org SportsActivityLocation +
        HealthAndBeautyBusiness.
[096] [P2 · ux · 1h] Inscription form (name + age + goal).
[097] [P3 · content · 1h] FAQ (cancellation, freezing, guest passes).
[098] [P3 · ux · 1h] Trial-class CTA in floating WhatsApp.
[099] [P3 · brand · 1h] Logo on towels / bottles for visual richness.
[100] [P3 · perf · 30m] Image sizes.
```

### B3 · studio-belleza (salón de belleza · 101–115)

```
[101] [P0 · content · 30m] No tenant exists at sites/studio-belleza yet
        — verify or create.
[102] [P0 · brand · 1h] DEMO badge.
[103] [P0 · content · 1h] Realistic name + address.
[104] [P1 · brand · 4h] Logo + hero (Recraft + Flux Pro).
[105] [P1 · content · 2h] Service categories: cabello, uñas,
        depilación, facial, paquetes.
[106] [P1 · content · 1h] Combo packages — explicit Gs pricing.
[107] [P1 · content · 1h] Team (5 members across categories).
[108] [P2 · brand · 2h] Service photos (8-10 across categories).
[109] [P2 · content · 1h] Testimonios specific to multi-service salon.
[110] [P2 · ux · 1h] "Reservar para varios servicios" multi-pick UI.
[111] [P2 · content · 1h] Trayectoria / years in business stat.
[112] [P2 · seo · 30m] BeautySalon Schema.
[113] [P3 · content · 1h] Loyalty program copy.
[114] [P3 · ux · 1h] Gift card section.
[115] [P3 · content · 30m] Languages spoken (English-friendly badge).
```

### B4 · spa-serenidad (spa · 116–130)

```
[116] [P0 · content · 30m] Verify tenant exists / create scaffold.
[117] [P0 · brand · 1h] DEMO badge with serene palette.
[118] [P0 · content · 1h] Realistic address (Asunción · Villa Morra).
[119] [P1 · brand · 4h] Hero — minimalist, warm wood + plants.
[120] [P1 · content · 2h] Tratamientos premium pricing (Gs 250K-1M
        range for paquete completo).
[121] [P1 · content · 1h] Paquetes section (día completo, parejas).
[122] [P1 · content · 1h] Equipo: 4 terapeutas con especialidad.
[123] [P2 · ux · 2h] Reservas con seña (Mercado Pago) — currently
        section component exists; wire it.
[124] [P2 · brand · 2h] 6 photos of treatments + space.
[125] [P2 · content · 1h] Testimonios.
[126] [P2 · content · 1h] Productos para llevar a casa.
[127] [P2 · seo · 30m] HealthAndBeautyBusiness Schema.
[128] [P3 · ux · 1h] Gift cards section.
[129] [P3 · content · 1h] Origin story (founder's wellness journey).
[130] [P3 · perf · 30m] Image optimization.
```

### B5 · barberia-clasica (barbería · 131–145)

```
[131] [P0 · content · 30m] Verify / create.
[132] [P0 · brand · 1h] DEMO badge.
[133] [P0 · content · 1h] Realistic address (CDE or San Lorenzo per
        city distribution).
[134] [P1 · brand · 4h] Hero — leather chairs, vintage barber pole.
[135] [P1 · content · 1h] Services: corte clásico, fade, barba,
        afeitada con navaja.
[136] [P1 · content · 1h] Team: 3 barberos con galería personal.
[137] [P1 · content · 1h] Pricing — typical PY barbería rates.
[138] [P2 · brand · 2h] Cut gallery (10-12 photos).
[139] [P2 · ux · 1h] Walk-in vs appointment policy clear.
[140] [P2 · content · 1h] FAQ specific to barbería.
[141] [P2 · content · 30m] Hours (early close on Sun + Mon).
[142] [P2 · seo · 30m] HairSalon Schema.
[143] [P3 · ux · 1h] Loyalty card "10º corte gratis".
[144] [P3 · content · 30m] Membership / monthly subscription.
[145] [P3 · brand · 30m] Color scheme matches old-school barber
        aesthetic.
```

### B6 · unas-y-mas (uñas · 146–160)

```
[146] [P0 · content · 30m] Verify / create.
[147] [P0 · brand · 1h] DEMO badge.
[148] [P0 · content · 1h] Realistic address.
[149] [P1 · brand · 4h] Hero with Instagram-friendly aesthetics.
[150] [P1 · content · 1h] Service types: acrílico, gel, semi,
        decorado, pies.
[151] [P1 · content · 30m] Pricing per service + tiempo estimado.
[152] [P1 · brand · 2h] Designs gallery (15-20) with category filter.
[153] [P2 · content · 1h] Team (2-3 nail artists with style).
[154] [P2 · ux · 2h] Reserva con seña por Mercado Pago to reduce no-shows.
[155] [P2 · content · 1h] Política de cambios / cancelaciones.
[156] [P2 · content · 1h] Testimonios.
[157] [P2 · seo · 30m] NailSalon Schema.
[158] [P3 · ux · 30m] Instagram embed of recent posts.
[159] [P3 · content · 30m] Hours for Sun (closed?).
[160] [P3 · brand · 30m] Pink/lavender palette intensity.
```

### B7 · tinta-viva (tatuajes · 161–175)

```
[161] [P0 · content · 30m] Verify / create.
[162] [P0 · brand · 1h] DEMO badge.
[163] [P0 · content · 1h] Realistic address.
[164] [P1 · brand · 4h] Hero — moody studio aesthetic.
[165] [P1 · content · 2h] Per-artist portfolio (3 artists × 5 pieces).
[166] [P1 · content · 1h] Process: consulta gratuita → diseño →
        sesión → cuidados.
[167] [P1 · content · 1h] Higiene/safety section (autoclave,
        agujas selladas).
[168] [P2 · content · 1h] Style categories: realismo, blackwork, color,
        japonés.
[169] [P2 · content · 1h] Reference pricing (small/medium/large).
[170] [P2 · ux · 1h] "Agendar consulta" form (artist + style + idea).
[171] [P2 · content · 1h] FAQ (dolor, cuidados, retoque incluido).
[172] [P2 · seo · 30m] TattooParlor Schema.
[173] [P3 · brand · 30m] Dark theme tokens.
[174] [P3 · content · 30m] Edad mínima / política consentimiento.
[175] [P3 · ux · 30m] Galería con filtros por estilo.
```

### B8 · belleza-integral (estética · 176–190)

```
[176] [P0 · content · 30m] Verify / create.
[177] [P0 · brand · 1h] DEMO badge.
[178] [P0 · content · 1h] Realistic address.
[179] [P1 · brand · 4h] Hero — clinical-warm aesthetic.
[180] [P1 · content · 1h] Tratamientos: limpieza profunda, peeling,
        radiofrecuencia, dermapen.
[181] [P1 · content · 1h] Antes/después gallery (con consentimiento
        — para demo, cara difuminada).
[182] [P1 · content · 30m] Pricing matrix per tratamiento.
[183] [P2 · content · 1h] Equipo (2-3 esteticistas certificadas).
[184] [P2 · ux · 1h] Booking + consulta gratuita primer turno.
[185] [P2 · content · 1h] Testimonios + resultados.
[186] [P2 · seo · 30m] HealthAndBeautyBusiness Schema.
[187] [P2 · content · 30m] Productos para llevar.
[188] [P3 · brand · 30m] Soft palette (lavender / mint).
[189] [P3 · content · 30m] Garantía sobre tratamientos.
[190] [P3 · perf · 30m] Image sizes.
```

### B9 · pestanas-flore (pestañas y cejas · 191–205)

```
[191] [P0 · content · 30m] Verify / create.
[192] [P0 · brand · 1h] DEMO badge.
[193] [P0 · content · 1h] Address.
[194] [P1 · brand · 4h] Hero — close-up of eyes (AI generated, no
        real model rights issues).
[195] [P1 · content · 1h] Style catalog: clásico, volumen, mega volumen,
        híbrido.
[196] [P1 · content · 30m] Duración por estilo + precio.
[197] [P1 · content · 30m] Mantenimiento info.
[198] [P2 · brand · 2h] Style gallery 12-15 photos.
[199] [P2 · ux · 1h] Booking + seña.
[200] [P2 · content · 1h] FAQ pestañas (alergia, retiro, cuidados).
[201] [P2 · content · 30m] Cejas section (laminado, micro, henna).
[202] [P2 · seo · 30m] BeautySalon Schema.
[203] [P3 · brand · 30m] Pink-purple palette.
[204] [P3 · content · 30m] Promociones (combo cejas+pestañas).
[205] [P3 · ux · 30m] Instagram link.
```

### B10 · depilacion-perfecta (depilación · 206–220)

```
[206] [P0 · content · 30m] Verify / create.
[207] [P0 · brand · 1h] DEMO badge.
[208] [P0 · content · 1h] Address.
[209] [P1 · brand · 4h] Hero — clean clinical aesthetic.
[210] [P1 · content · 1h] Zonas + precio por sesión.
[211] [P1 · content · 1h] Paquetes (6 sesiones con descuento).
[212] [P1 · content · 30m] Tipos: laser, cera, IPL.
[213] [P2 · ux · 1h] Booking flow + zona selector.
[214] [P2 · content · 1h] FAQ (cuántas sesiones, dolor, embarazo).
[215] [P2 · content · 30m] Promociones por zona del mes.
[216] [P2 · seo · 30m] HealthAndBeautyBusiness Schema.
[217] [P3 · content · 1h] Testimonios.
[218] [P3 · brand · 30m] Calm clinical palette.
[219] [P3 · ux · 30m] Calculator: total para "todo el cuerpo".
[220] [P3 · content · 30m] Cuidados pre y post.
```

### B11 · la-trattoria (restaurante · 221–235)

```
[221] [P0 · content · 30m] Verify / create.
[222] [P0 · brand · 1h] DEMO badge.
[223] [P0 · content · 1h] Address (Asunción · Carmelitas o Las Lomas).
[224] [P1 · brand · 4h] Hero — warm interior, wood + candles.
[225] [P1 · content · 2h] Menú estructurado: entradas, pastas, carnes,
        postres con precios Gs.
[226] [P1 · brand · 2h] 6 platos hero photography.
[227] [P1 · content · 1h] Wine list (categorías + precios).
[228] [P2 · ux · 2h] Reserva online (date/time/people).
[229] [P2 · content · 1h] Hours por día (lunch/dinner split).
[230] [P2 · content · 1h] Eventos privados / catering.
[231] [P2 · seo · 30m] Restaurant + Schema acceptsReservations.
[232] [P3 · content · 1h] Chef's story.
[233] [P3 · ux · 1h] Delivery por WhatsApp + pedidos para llevar.
[234] [P3 · brand · 30m] Italian-inspired palette.
[235] [P3 · content · 30m] Política BYOB / corkage.
```

### B12 · sakura-sushi (sushi bar · 236–250)

```
[236] [P0 · content · 30m] Verify / create.
[237] [P0 · brand · 1h] DEMO badge.
[238] [P0 · content · 1h] Address.
[239] [P1 · brand · 4h] Hero — minimal Japanese aesthetic.
[240] [P1 · content · 2h] Menú by category (nigiri, maki, especiales,
        tablas, postres).
[241] [P1 · brand · 2h] Hero shots of 6 dishes.
[242] [P1 · content · 1h] Combos (para 2, para 4, para llevar).
[243] [P2 · ux · 1h] Delivery por WhatsApp con menú interactivo.
[244] [P2 · content · 1h] Hours.
[245] [P2 · content · 1h] About the chef + technique.
[246] [P2 · seo · 30m] Restaurant + servesCuisine: Japanese.
[247] [P3 · ux · 30m] Allergens/contiene crudo warning.
[248] [P3 · content · 30m] Política reservas.
[249] [P3 · brand · 30m] Black + red palette intensity.
[250] [P3 · content · 30m] Sake / Asahi pairings.
```

### B13 · kaiten-express (sushi cinta · 251–260)

```
[251] [P0 · content · 30m] Verify / create.
[252] [P0 · brand · 1h] DEMO badge.
[253] [P0 · content · 1h] Address.
[254] [P1 · brand · 4h] Hero — kaiten conveyor belt aesthetic.
[255] [P1 · content · 1h] Color-coded plate pricing (azul Gs X,
        rojo Gs Y, oro Gs Z).
[256] [P1 · content · 1h] Sucursales (multi-location).
[257] [P2 · brand · 2h] Photos of plates by color.
[258] [P2 · content · 1h] Promociones (todo lo que puedas comer).
[259] [P2 · seo · 30m] Restaurant Schema with multiple locations.
[260] [P3 · ux · 1h] Reserva por sucursal.
```

### B14 · The 97 batch-created demos (261–290)

> 110 total demo dirs exist; 13 are linked from `/p/[rubro]`. The other ~97
> were generated by `web/scripts/batch-create-demos.ts` and aren't visible
> from the marketing site yet. Triage:

```
[261] [P0 · data · 1h] Audit `sites/demo-*` dirs vs registry types — list
        which are stub-only vs which have full content.
[262] [P0 · data · 1h] Verify the batch-create script idempotent (re-run
        without overwriting hand-edited content).
[263] [P0 · seo · 1h] Decide: are these 97 indexed? If yes, they need
        DEMO badge + noindex policy.
[264] [P1 · ux · 4h] Add a `/demos` index page listing all demos by
        vertical for browsing.
[265] [P1 · code · 2h] PRERENDER_SKIP_SITES likely needs to include all
        of them, or build will OOM at 110 × N pages.
[266] [P1 · content · 8h] Per-demo audit: name, address, hours, services,
        prices, contact info — flag any with placeholder data.
[267] [P1 · content · 4h] Run validate-content + validate-sites against
        all 110 — fix every error.
[268] [P1 · brand · 8h] Theme tokens per demo — ensure each has a unique
        color story (110 distinct palettes is overkill; 10-15 base
        palettes assigned by vertical is enough).
[269] [P2 · seo · 2h] Sitemap entries for the surface that should be
        indexed (probably none of the 97).
[270] [P2 · code · 2h] Add a banner component "Esta es una demostración
        — el sitio real puede ser tuyo en 48h. Pedí tu demo."
[271] [P2 · perf · 4h] Image generation pipeline: at scale, AI image
        cost is real ($0.04/image × ~10 images × 110 demos = ~$45 once).
[272] [P2 · content · 4h] Translate top demos to EN (Nexa pattern only
        for relocation/property/professional).
[273] [P2 · code · 2h] Generator script should produce a stub data_json
        per demo that admin can edit.
[274] [P2 · content · 2h] WhatsApp pre-fill template per demo.
[275] [P2 · ux · 1h] CTA on every demo: "Pedí tu demo personalizada"
        going to /demo qualifier.
[276] [P3 · content · 4h] Hours + holiday calendars per vertical.
[277] [P3 · seo · 2h] Per-demo Schema.org type (correct for vertical).
[278] [P3 · brand · 4h] Logo per demo (manual would be tedious; consider
        generated wordmark from name).
[279] [P3 · ux · 2h] Per-demo gallery section.
[280] [P3 · content · 2h] FAQ template per vertical, copied into all
        same-vertical demos.
[281] [P3 · perf · 4h] Static export of demo HTML for fast first-paint.
[282] [P3 · obs · 1h] Track demo-page views in analytics_events tagged
        with demo:true.
[283] [P3 · code · 2h] Promote a demo to real-tenant flow: rename slug,
        replace data, set tenant.is_demo=false.
[284] [P3 · code · 2h] Demote a real tenant to demo flow: opposite.
[285] [P3 · ux · 1h] "Volver al builder" sticky button on every demo
        — drives prospect back to /demo or /precios.
[286] [P3 · code · 2h] One-shot smoke test: HEAD every demo URL, fail
        on 4xx/5xx.
[287] [P3 · seo · 30m] robots.txt: should /demo-* paths be excluded?
[288] [P3 · perf · 1h] Memoize loadSite() across requests for demos.
[289] [P3 · content · 2h] Every demo gets a "Last updated" footer.
[290] [P3 · obs · 1h] Sentry breadcrumb when a demo render fails.
```

### B15 · DEMO badge implementation (291–305)

```
[291] [P0 · ux · 2h] Build `<DemoBadge>` component — corner banner
        "DEMO · pedí el tuyo en 48h".
[292] [P0 · code · 1h] Wire `<DemoBadge>` into universal page layout
        gated by `site.is_demo` flag in tenant config.
[293] [P0 · data · 30m] Add `is_demo: boolean` to site.json schema +
        validator.
[294] [P0 · data · 1h] Set `is_demo: true` on all 110 demo dirs.
[295] [P0 · data · 30m] Set `is_demo: false` on 5 real tenants
        explicitly (so the absence isn't ambiguous).
[296] [P1 · ux · 1h] Demo banner CTA links to `/demo` pre-filled with
        the visited rubro.
[297] [P1 · seo · 30m] Demo pages emit `<meta name="robots" content=
        "noindex,nofollow">` so they don't compete in search.
[298] [P1 · ux · 30m] Demo banner is dismissible per-session.
[299] [P1 · obs · 30m] Track "demo_banner_clicked" event.
[300] [P2 · ux · 1h] Demo "screenshot mode" — query param to hide
        banner for clean screenshots in sales decks.
[301] [P2 · code · 1h] DemoBadge has zero JS payload when is_demo=false.
[302] [P2 · ux · 30m] Mobile-friendly placement (don't overlap CTAs).
[303] [P2 · a11y · 30m] Banner is readable for screen readers.
[304] [P3 · ux · 1h] A/B test banner copy: "DEMO" vs "EJEMPLO" vs
        "MUESTRA — pedí el tuyo".
[305] [P3 · obs · 30m] Heatmap of demo-page interactions.
```

### B16 · Demo content quality patterns (306–320)

```
[306] [P0 · content · 4h] Style guide: pricing format, address format,
        phone format, hour format, currency. Apply to all demos.
[307] [P0 · content · 2h] Verify no demo uses real businesses' names
        without permission (legal exposure).
[308] [P1 · content · 4h] Vertical-specific terminology lexicon
        ("turno" vs "cita" vs "reserva" by region).
[309] [P1 · content · 2h] Spanish accent audit across all 110 demos
        (es-PY uses voseo: "vos" not "tú").
[310] [P1 · content · 2h] Hours format: 24h vs 12h, AM/PM, "lunes" vs
        "L" — pick one and apply.
[311] [P1 · content · 1h] Currency format: "Gs 80.000" vs "₲ 80,000"
        vs "Gs. 80.000".
[312] [P1 · content · 1h] Phone format: "+595 981 234 567" vs
        "0981 234 567".
[313] [P1 · content · 1h] Address format: ALL UPPER vs Title Case.
[314] [P2 · content · 2h] Service description voice: 2-3 lines max,
        action-first verbs, no "estamos aquí para servirte" filler.
[315] [P2 · content · 1h] Testimonial format: 1-2 sentences, real
        first-name + last-initial, location, optional photo.
[316] [P2 · ux · 1h] FAQ format: 6-8 questions max, action-oriented
        answers, link to next step.
[317] [P2 · content · 1h] About section: 3 paragraphs max — origin,
        team, promise.
[318] [P3 · content · 2h] Tagline pattern: <verb> + <outcome> + <where>
        (e.g. "Cortes precisos para hombres en Asunción").
[319] [P3 · content · 1h] CTA verb consistency: "Reservar" vs
        "Agendar" vs "Pedir turno".
[320] [P3 · content · 1h] Footer pattern: address, hours, phone,
        social, copyright, ParaguAI attribution if free tier.
```

---

## Section C · Marketing site polish (321–380)

### C1 · Landing page (321–340)

```
[321] [P0 · content · 30m] Verify hero h1/h2 don't have widow words on
        mobile breakpoint.
[322] [P0 · content · 30m] Confirm "Plantillas por rubro" copy reflects
        what's actually shipped.
[323] [P0 · ux · 30m] Test mobile menu on small viewports (320px).
[324] [P1 · ux · 1h] Sticky mobile CTA — verify it doesn't cover the
        WhatsApp floating button.
[325] [P1 · ux · 1h] Hero variant chip (debug=1) doesn't show in
        production for non-admins.
[326] [P1 · content · 1h] Activity ticker — verify all 5 client links
        work in incognito.
[327] [P1 · content · 1h] FAQ accordion — first question expanded by
        default for prospect convenience.
[328] [P1 · ux · 1h] Pricing section: replace any leftover "16
        plantillas" copy with current value.
[329] [P1 · ux · 1h] CTA text consistency: "Pedir demo gratis" used
        everywhere.
[330] [P1 · perf · 30m] Hero animations don't trigger CLS.
[331] [P2 · seo · 1h] Sticky CTA bar should not block "skip to main
        content" link for keyboard users.
[332] [P2 · a11y · 1h] Color contrast pass (WCAG AA) on all CTAs.
[333] [P2 · ux · 1h] Newsletter form — wire to /api/newsletter
        (Mailchimp deferred per Q8.2 but form should at least log).
[334] [P2 · ux · 1h] Animated background shapes don't impact LCP.
[335] [P2 · ux · 1h] Logo strip — link each to the /casos page if
        the case study exists.
[336] [P2 · content · 30m] CTA "Ver demo" → "Ver demos en vivo" or
        "Ver clientes reales" — pick one.
[337] [P2 · perf · 1h] Lazy-load Sections below first viewport.
[338] [P3 · ux · 30m] Smooth-scroll to anchored sections.
[339] [P3 · obs · 30m] Track scroll depth (25/50/75/100%) in analytics.
[340] [P3 · content · 1h] Add a "How it works" video block once
        recorded.
```

### C2 · Vertical landings (/p/[rubro]) (341–355)

```
[341] [P0 · content · 30m] All 16 verticals render without missing
        copy or 404 demo links.
[342] [P0 · seo · 30m] Each /p/[rubro] has unique title + description
        (currently auto-generated from template).
[343] [P0 · ux · 30m] "Ver demo en vivo" CTA visibility — clear
        contrast with primary CTA.
[344] [P1 · seo · 1h] Schema.org Service per vertical (already
        implemented PR #82, verify).
[345] [P1 · content · 1h] Sister-vertical recommendations are
        deduplicated and excluded current vertical.
[346] [P1 · ux · 1h] Mobile: stacked CTAs vs side-by-side.
[347] [P1 · ux · 1h] Hero stat chip: "Mercado PY: 2,393 negocios" —
        verify the leads number matches the leads repo.
[348] [P2 · perf · 1h] Per-vertical OG image renders fast (under 2s).
[349] [P2 · seo · 1h] Per-vertical breadcrumb structured data.
[350] [P2 · ux · 1h] Add a "¿No es tu rubro?" link to /p index.
[351] [P2 · content · 1h] FAQ per vertical (3-4 questions).
[352] [P2 · ux · 1h] Sticky sub-nav within long verticals.
[353] [P3 · content · 1h] Customer logo strip per vertical.
[354] [P3 · seo · 1h] hreflang on each vertical landing.
[355] [P3 · content · 1h] "Por qué elegir ParaguAI para [rubro]" copy
        differentiated per vertical.
```

### C3 · City landings (/c/[ciudad]) (356–365)

```
[356] [P0 · content · 30m] All 5 cities render.
[357] [P0 · content · 1h] Per-city numbers (3,200 negocios, 74% sin
        web) — replace estimates with real leads-repo numbers.
[358] [P1 · ux · 1h] Per-city "top verticals" cards link to
        /c/[city]/[vertical] not /p/[vertical].
[359] [P1 · content · 1h] Per-city unique paragraph (not just
        positioning swap).
[360] [P1 · seo · 1h] Per-city Schema.org Place + serves area.
[361] [P2 · content · 2h] Per-city case studies if a tenant exists
        in that city.
[362] [P2 · ux · 1h] Map embed of city with clients pinned.
[363] [P3 · seo · 1h] Per-city breadcrumb + JSON-LD.
[364] [P3 · content · 1h] Per-city FAQ (eg "¿hacen sitios para
        Encarnación?" yes).
[365] [P3 · content · 1h] City × vertical interlinking matrix.
```

### C4 · /demo qualifier (366–380)

```
[366] [P0 · ux · 30m] Verify all 3 steps render on mobile.
[367] [P0 · ux · 30m] Form validation: can't submit empty.
[368] [P0 · obs · 30m] Verify lead_created event fires on completion
        (already wired, smoke test pending).
[369] [P0 · ux · 30m] WhatsApp message includes correct phone +
        readable Spanish.
[370] [P1 · ux · 1h] Save partial progress to localStorage so reloads
        don't lose state.
[371] [P1 · ux · 1h] Back button works between steps.
[372] [P1 · content · 30m] If user picks a "no demo yet" rubro
        (Maquillaje, Inmobiliaria, etc.), message says "we'll build
        the first one for you".
[373] [P1 · obs · 1h] Track step drop-off rate per option.
[374] [P2 · ux · 1h] Step 4: optional contact (email + name) before
        WhatsApp open — captures email even if WhatsApp doesn't fire.
[375] [P2 · ux · 1h] Visual progress indicator (1/3, 2/3, 3/3).
[376] [P2 · email · 2h] Welcome email autoresponder via Resend on
        completion.
[377] [P2 · ux · 1h] After WhatsApp clicked, redirect to a thank-you
        page with next-step expectations.
[378] [P3 · ux · 1h] Skip ahead: "Ya sé qué quiero — ir directo a
        precios".
[379] [P3 · ux · 30m] Pre-fill rubro from referrer (if came from /p).
[380] [P3 · obs · 30m] A/B test 3-step vs 1-form layout.
```

---

## Section D · Code quality, lint, typecheck (381–420)

```
[381] [P0 · code · 30m] Pre-existing typecheck error in
        components/sections/hero-section.tsx:206 (Container size "2xl"
        not allowed).
[382] [P0 · code · 30m] Pre-existing typecheck error in
        components/sections/hero-section.tsx:256 (same).
[383] [P0 · code · 30m] Pre-existing typecheck error in
        components/sections/why-destination-section.tsx:39 (style prop
        on Lucide icon — Lucide doesn't accept style).
[384] [P0 · code · 30m] Five pre-existing typecheck errors in
        lib/schemas/commerce/{order,product,transaction}.ts (Zod v4
        z.record arity).
[385] [P0 · code · 30m] Two pre-existing typecheck errors in
        app/api/cron/commerce-email-flush/route.ts (resendAdapter
        sendTransactional possibly undefined).
[386] [P1 · code · 30m] lib/supabase/scoped.ts:78 prefer-const lint
        error.
[387] [P1 · code · 1h] react-hooks/purity violations across:
        components/sections/testimonials-section.tsx,
        web/components/landing/* (Date.now/Math.random in render).
[388] [P1 · code · 30m] Unused vars warnings in:
        leads/page.tsx (_citiesError, _typesError),
        tests/unit/* files.
[389] [P1 · code · 1h] react-hooks/set-state-in-effect violations
        in 5+ component files.
[390] [P1 · code · 1h] Duplicate logger.* call patterns — promote
        to a shared error-handler middleware.
[391] [P1 · code · 30m] LOG_FORMAT env var not documented in
        ENV_VARS.md.
[392] [P1 · code · 1h] withRequestLog middleware: ensure all routes
        wrapped (find unwrapped routes).
[393] [P1 · code · 1h] Dead imports across web/app/* — run an
        auto-removal pass.
[394] [P2 · code · 2h] Section components have inconsistent prop
        shapes — write a contract test per section.
[395] [P2 · code · 1h] Centralize error boundaries — currently 1
        global, no per-route.
[396] [P2 · code · 2h] Migrate from `any` to typed (count: ~40
        files have any).
[397] [P2 · code · 1h] Bundle analysis to find unused exports.
[398] [P2 · code · 1h] CSS-in-JS perf: ensure styled props don't
        regenerate on every render.
[399] [P2 · code · 2h] Section composition error UX: "section X
        failed to render" → friendly "Sorry, that block didn't load".
[400] [P3 · code · 1h] Replace remaining `class` with `className`
        legacy.
[401] [P3 · code · 1h] Standardize component file naming
        (kebab-case enforced).
[402] [P3 · code · 1h] Remove TODO/FIXME comments older than
        3 months.
[403] [P3 · code · 2h] Stricter tsconfig: noUncheckedIndexedAccess,
        exactOptionalPropertyTypes.
[404] [P3 · code · 1h] Lint rule for "no template literals in className".
[405] [P3 · code · 2h] Visual regression test snapshots for
        section components.
[406] [P3 · code · 1h] Pre-commit hook: prettier + eslint --fix.
[407] [P3 · code · 1h] Storybook for section components.
[408] [P3 · code · 1h] Auto-generate OpenAPI spec from API routes.
[409] [P3 · code · 1h] Public type exports from lib/landing for
        external consumers (mobile app, CLI).
[410] [P3 · code · 2h] Migration runner: db/migrations/* vs
        supabase/migrations/* — pick one, retire the other.
[411] [P3 · code · 1h] Document the static-config sharded data
        pipeline.
[412] [P3 · code · 1h] Remove deprecated demo-data.ts after
        DemoBadge migration.
[413] [P3 · code · 1h] Convert all `module.exports` to ESM.
[414] [P3 · code · 30m] Lint rule: no `<a target="_blank">` without
        rel="noopener".
[415] [P3 · code · 1h] Audit dependencies: list packages with no
        in-code import.
[416] [P3 · code · 1h] Tighten ts-paths: prevent ../../ relative
        imports.
[417] [P3 · code · 30m] Fail CI on console.log in app code.
[418] [P3 · code · 1h] Fail CI on /// @ts-ignore without explanation.
[419] [P3 · code · 1h] Pre-merge bundle-size budget check.
[420] [P3 · code · 30m] React 19 hydration mismatch warnings — silence
        or fix.
```

---

## Section E · Infra, ops, observability (421–460)

```
[421] [P0 · obs · 30m] Verify daily leads-digest cron actually fires
        at 12:00 UTC tomorrow.
[422] [P0 · obs · 30m] Verify weekly sitemap-ping fires next Mon.
[423] [P0 · infra · 30m] Cold-start latency on /api/analytics/track
        — first POST timed out 504. Add a /api/health pinger to keep
        warm or migrate to Edge runtime.
[424] [P0 · infra · 1h] DNS pointing for the 5 client domains —
        currently optional per launch decision; verify staging works
        for now.
[425] [P0 · obs · 30m] Sentry verifies events arrive in prod.
[426] [P0 · auth · 30m] Test admin login as `weissvanderpol.ivan@gmail.com`
        — confirm requireAdmin allows access.
[427] [P0 · auth · 30m] Test admin login as random Google user —
        confirm /unauthorized redirect.
[428] [P1 · infra · 1h] Backup verification: restore a test
        database snapshot.
[429] [P1 · infra · 1h] VPS disk free: 386GB total, 57.2% used.
        Set up alerting at 80%.
[430] [P1 · infra · 1h] 21 zombie processes on VPS at last check —
        track down + kill.
[431] [P1 · infra · 1h] Memory swap usage 18% — investigate.
[432] [P1 · obs · 1h] Add a synthetic check: ping 10 routes every
        5min, alert on 5xx.
[433] [P1 · obs · 1h] Track real conversion funnel events:
        page_view → /demo opened → step 1 done → step 2 done →
        step 3 done → WhatsApp clicked.
[434] [P1 · obs · 1h] /admin/analytics dashboard — surface variant
        A/B exposure + conversion.
[435] [P1 · email · 1h] Test newsletter form against Mailchimp once
        env is set.
[436] [P1 · cron · 1h] Add a /api/cron/health cron that pings each
        cron route + alerts on consecutive failures.
[437] [P1 · perf · 1h] Cloudflare cache rules: HTML edge-cache TTL
        for marketing routes only.
[438] [P1 · perf · 1h] /api/analytics/track Edge runtime migration
        for sub-100ms response.
[439] [P2 · obs · 2h] Metrics dashboard: rps, p95 latency, 5xx
        rate per route.
[440] [P2 · obs · 1h] Slow query log on Supabase analyzed weekly.
[441] [P2 · infra · 2h] CDN purge automation on deploy.
[442] [P2 · infra · 1h] Auto-renew Let's Encrypt certs verification.
[443] [P2 · email · 1h] Resend webhook to log bounces/complaints
        per recipient.
[444] [P2 · cron · 2h] Idempotency keys per cron run so re-firing is
        safe.
[445] [P2 · cron · 1h] Cron retry policy: 3 attempts with exponential
        backoff before alerting.
[446] [P2 · obs · 1h] Real-user-monitoring (RUM) — already shipped
        per recent commits, verify dashboards.
[447] [P2 · auth · 1h] Magic-link login UX (currently password?).
[448] [P2 · auth · 1h] Login rate-limiting per IP.
[449] [P2 · infra · 1h] Document rollback procedure for prod.
[450] [P2 · infra · 1h] Pin Docker image tags per deploy (currently
        :prod and :staging are mutable).
[451] [P3 · infra · 1h] Move secrets out of `docker service inspect`
        output (use Docker secrets instead of env-add).
[452] [P3 · infra · 2h] Multi-region deploy plan (sa-east-1 already
        for Resend; consider read-replica).
[453] [P3 · infra · 1h] Image registry: ghcr.io vs Docker Hub plan.
[454] [P3 · obs · 1h] Annual cost dashboard (Hostinger, Supabase,
        Resend, etc.).
[455] [P3 · obs · 1h] Tenant-level metrics (per-tenant uptime,
        traffic, conversion).
[456] [P3 · email · 1h] Resend templates as MJML, not raw HTML
        strings.
[457] [P3 · cron · 1h] Cron schedule timezone: explicit UTC vs
        America/Asuncion.
[458] [P3 · auth · 2h] OAuth: Google login wired (currently?).
[459] [P3 · auth · 1h] Session timeout after inactivity.
[460] [P3 · auth · 1h] CSRF token verification on admin POST routes.
```

---

## Section F · Tests + a11y + perf + docs (461–500)

```
[461] [P0 · test · 1h] One end-to-end test: /demo qualifier completion
        → analytics_events row exists.
[462] [P0 · test · 1h] One end-to-end test: tenant page renders
        (sample 3 random demos).
[463] [P0 · test · 30m] Lighthouse score on landing > 80.
[464] [P0 · a11y · 30m] axe scan on landing — fix any criticals.
[465] [P1 · test · 2h] Section component contract tests (every
        section accepts standard props without crash).
[466] [P1 · test · 1h] Snapshot test on /precios so layout
        regressions caught at PR.
[467] [P1 · test · 1h] Mock Supabase tests for admin pages.
[468] [P1 · a11y · 2h] Full axe scan on /demo, /p, /casos pages.
[469] [P1 · a11y · 1h] Keyboard nav: every CTA reachable via Tab.
[470] [P1 · perf · 1h] Lighthouse on top 5 routes; doc target
        scores.
[471] [P1 · perf · 1h] Image optimization audit (WebP, responsive
        srcset).
[472] [P1 · perf · 1h] Font loading: avoid FOIT.
[473] [P1 · perf · 1h] CLS: hero shifts during load? measure.
[474] [P2 · test · 2h] Visual regression: chromatic or playwright
        snapshots.
[475] [P2 · test · 1h] Cron tests: assertion on email count after
        cron POST.
[476] [P2 · test · 1h] Webhook tests for Mercado Pago, WhatsApp
        Business API.
[477] [P2 · test · 1h] Supabase migration test — apply forward
        + back without errors.
[478] [P2 · a11y · 1h] Color contrast in dark mode (if implemented).
[479] [P2 · a11y · 1h] Skip-to-content link tested.
[480] [P2 · a11y · 1h] Screen reader test of /demo qualifier.
[481] [P2 · perf · 2h] Bundle analyzer: drop unused Next.js features.
[482] [P2 · perf · 1h] Edge cache headers per route.
[483] [P3 · docs · 30m] Update README with current state.
[484] [P3 · docs · 1h] Architecture diagram (tenants → engine →
        renderer → output).
[485] [P3 · docs · 1h] Onboarding doc: "Adding a new vertical".
[486] [P3 · docs · 1h] Onboarding doc: "Adding a new tenant".
[487] [P3 · docs · 1h] Onboarding doc: "Promoting a demo to a
        real tenant".
[488] [P3 · docs · 1h] Onboarding doc: "Rotating a secret".
[489] [P3 · docs · 1h] Decision log: keep history of "why we
        picked X over Y".
[490] [P3 · docs · 1h] Customer-facing playbook: "Cómo trabajamos
        con vos durante los 3-7 meses Profesional".
[491] [P3 · docs · 1h] Sales playbook: objection-handling per
        vertical.
[492] [P3 · docs · 1h] Demo-give-away script for prospect calls.
[493] [P3 · docs · 1h] Internal glossary: "Plantilla" vs
        "Vertical" vs "Tenant" vs "Demo" vs "Site".
[494] [P3 · test · 2h] Load test: how many concurrent renders before
        Hostinger VPS croaks.
[495] [P3 · test · 1h] Cron health alert when no events written for
        N hours.
[496] [P3 · perf · 1h] Pre-render the top 50 routes; ISR for the
        long tail.
[497] [P3 · perf · 1h] Service Worker for offline fallback (PWA?).
[498] [P3 · a11y · 1h] WCAG 2.2 AAA on the landing (stretch goal).
[499] [P3 · docs · 1h] Public changelog at /changelog.
[500] [P3 · docs · 30m] This document — keep it updated as items
        close. Mark with strikethrough; add new items in an
        "Added 2026-MM-DD" appendix.
```

---

## How to use this list

1. **Don't try to do all 500.** Triage P0 + P1 only for launch.
2. **Pick a tier per work session.** "Today I'm doing 5 P0 demo polish."
3. **Mark done with strikethrough** + commit the change with the item ID
   in the message: `feat: refresh salon-maria phone (closes #061)`.
4. **Add new items in an appendix** below — preserve numbering.
5. **Re-prioritize quarterly.** What was P3 might become P0 after launch.

## Quick wins (under 30 min each, biggest leverage)

001, 029, 032, 040, 049, 061, 081, 261, 291–294, 321–323, 341–343, 366–369,
381–385, 421–427, 461–464.

That's 30 items. **Doing the 30 quick wins ships 80% of launch readiness.**

## Effort sum (rough)

- P0: ~110 items, ~80 hours
- P1: ~170 items, ~250 hours
- P2: ~140 items, ~250 hours
- P3: ~80 items, ~140 hours

Total: ~720 hours of work. **Don't try to do this alone or all at once.**

---

> Generated 2026-04-21. Review quarterly. The bug-hunt is never done.
