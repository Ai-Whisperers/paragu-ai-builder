# Nexa Paraguay — Social asset library

Inventory of the 6 pre-rendered social templates in
`sites/nexa-paraguay/images/social/`. Each is indexed in
`sites/nexa-paraguay/images.json` under the `social.*` bucket.

These are generic templates (no faces) — safe to ship without consent
forms. See `docs/IMAGE_GENERATION_PROMPTS.md` § ethics for the general
rule about synthetic people in marketing assets.

## Assets

| Manifest key          | Filename                 | Aspect | Recommended platform                                 | Caption angle                                                                 |
| --------------------- | ------------------------ | ------ | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `social.villaMorra`   | `villa-morra.png`        | 1:1    | Instagram Feed (all markets), LinkedIn post          | Neighborhood deep-dive — "Where our clients actually live: Villa Morra."     |
| `social.carmelitas`   | `carmelitas.png`         | 1:1    | Instagram Feed (all markets), Facebook post          | Neighborhood deep-dive — Carmelitas tree-lined boulevard lifestyle angle.    |
| `social.sanBernardino`| `san-bernardino.png`     | 1:1    | Instagram Feed / Story (weekend content)             | Lifestyle — "El fin de semana fuera de Asunción: San Ber, el otro Paraguay." |
| `social.dataTip`      | `data-tip.png`           | 1:1    | LinkedIn, Instagram carousel cover                   | Data / fact angle — territorial tax, 10% corporate, etc. Navy-champagne BG.  |
| `social.btsOffice`    | `bts-office.png`         | 1:1    | Instagram, LinkedIn (team post)                      | Behind-the-scenes — office life, weekly huddle, authenticity angle.          |
| `social.clientJourney`| `client-journey.png`     | 1:1    | LinkedIn, Instagram carousel cover                   | Process narrative — still-life showing the artifacts of a successful case.   |

## Captions — multilingual seeds

The captions below are seeds. Adjust tone to platform and audience.

### Nederlands (nl)
- villaMorra: "Villa Morra: waar veel van onze klanten uiteindelijk landen. Waarom dat geen toeval is."
- carmelitas: "Carmelitas in cijfers: gezinsvriendelijk, compact, internationaal."
- sanBernardino: "Het weekend ademt in San Bernardino. De logistiek begint hier op vrijdagmiddag."
- dataTip: "Territoriaal belastingsysteem + 10% vennootschapsbelasting = voorspelbaarheid."
- btsOffice: "Maandagmorgen, ons team in Asunción. Geen klant zonder face-to-face."
- clientJourney: "Paspoort, cédula, mapje met documenten, sleutel. Zo zie een afgerond traject eruit."

### English (en)
- villaMorra: "Where our European clients actually land: Villa Morra. Here's why."
- carmelitas: "Carmelitas in numbers: family-friendly, walkable, international."
- sanBernardino: "Weekends breathe in San Bernardino. The logistics plan starts Friday afternoon."
- dataTip: "Territorial tax + 10% corporate rate = predictability."
- btsOffice: "Monday morning in our Asunción office. No client without face-to-face."
- clientJourney: "Passport, cédula, a folder of documents, a key. Here's what a closed case looks like."

### Deutsch (de)
- villaMorra: "Villa Morra: Wo unsere europäischen Kunden tatsächlich landen. Warum?"
- carmelitas: "Carmelitas in Zahlen: familienfreundlich, fußläufig, international."
- sanBernardino: "Das Wochenende atmet in San Bernardino. Die Logistik beginnt Freitagnachmittag."
- dataTip: "Territorialsystem + 10% Körperschaftsteuer = Berechenbarkeit."
- btsOffice: "Montagmorgen in unserem Büro in Asunción. Kein Kunde ohne persönlichen Kontakt."
- clientJourney: "Pass, Cédula, Dokumentenmappe, Schlüssel. So sieht ein abgeschlossener Fall aus."

### Español (es)
- villaMorra: "Villa Morra: donde nuestros clientes europeos realmente se instalan. Razones."
- carmelitas: "Carmelitas en datos: familiar, caminable, internacional."
- sanBernardino: "El fin de semana respira en San Bernardino. La logística arranca el viernes."
- dataTip: "Sistema territorial + 10% impuesto corporativo = previsibilidad."
- btsOffice: "Lunes por la mañana en nuestra oficina de Asunción. Ningún cliente sin cara a cara."
- clientJourney: "Pasaporte, cédula, carpeta de documentos, llave. Así se ve un caso cerrado."

## Technical notes

- All assets are 1:1 PNG (best for Instagram Feed + LinkedIn post).
- For Stories / Reels cut a 9:16 version from the same brief on demand.
- Keep type safe within the middle 80% when cropping; platform UI chrome
  eats the outer 10%.
- Related: `docs/ADS_ASSETS.md` for paid creatives and
  `docs/IMAGE_GENERATION_PROMPTS.md` for the generation prompts.
