# Runbook — Timbrado y facturación SET para Fun4Me

**Audience:** Fun4Me owner + ParaguAI accounting liaison
**Goal:** E-invoicing compliant with Paraguay's SET (Secretaría Tributaria).

## Prerequisites

Fun4Me must have:
- RUC (Registro Único del Contribuyente) — active
- Timbrado vigente (authorization to issue invoices)
- Software de facturación homologado por SET

## Current state

**To be determined.** Fun4Me has been operating since 2018 so likely has RUC + Timbrado manual. Need to verify:

- [ ] RUC activo — consultar en SET.gov.py
- [ ] Timbrado vigente y qué tipo (manual, auto-impresor, electrónico)
- [ ] Régimen tributario (RESIMPLE, IRE General, IRP)
- [ ] Ha presentado declaraciones IVA al día

**Action:** owner onboarding questionnaire Parte E recolecta esto.

## Migración a facturación electrónica (obligatoria)

Paraguay avanza hacia facturación electrónica obligatoria para todos los contribuyentes. Plazo final estimado: 2027 para todas las categorías, ya obligatorio para grandes contribuyentes.

**Fun4Me debería migrar ahora** para:
- Cumplir con tendencia regulatoria
- Reducir costos (no papel, no imprentas)
- Permitir integración con e-commerce

## Opciones de software SET-homologado

Lista de proveedores aceptados por SET:

| Proveedor | Costo/mes | Pros | Cons |
|---|---|---|---|
| **Facturé** | Gs. 150k | LatAm focus, API decent | Docs regulares |
| **Bizagi** | Gs. 200k | Grande, soporte 24/7 | Más caro |
| **Genexus Invoice** | Gs. 180k | Stack PY-first | Menos flexible |
| **Custom + SET API directa** | N/A (engineering) | Total control | Alto esfuerzo inicial |

**Recommendation:** Facturé — relación costo/features más balanceada, API suficiente para integrar con paragu-ai-builder.

## Integración con paragu-ai-builder

Platform commerce layer (web/lib/commerce/) necesita hook post-pago para generar factura electrónica:

1. Pago confirmado (webhook Pagopar) →
2. Sistema llama a API del proveedor de facturación →
3. Proveedor emite factura, devuelve CDC (Código de Control)
4. Cliente recibe email con PDF de factura + XML
5. Si el cliente solicitó razón social específica (ver "Facturación discreta"), usamos esa.

Estimated engineering: 2-3 días para integrar primer proveedor.

Files to create:
- `web/lib/invoicing/` nuevo módulo
- `web/lib/invoicing/facture-adapter.ts`
- `web/lib/invoicing/types.ts`
- Webhook en `web/app/api/invoicing/webhook/route.ts`

## Facturación discreta (razón social alternativa)

Fun4Me publicita "el cargo aparece como F4M COMERCIAL". Esto aplica a:

1. **Statement descriptor Pagopar** — ya cubierto en runbook Pagopar.
2. **Factura electrónica**:
   - Nombre fiscal real: **Fun4Me Comercial** (lo que aparece en RUC).
   - No se puede cambiar el nombre fiscal en la factura — es dato obligatorio.
   - Pero SÍ se puede usar "nombre de fantasía" o descripciones neutras en los conceptos ("artículo de consumo", "producto de salud personal").

**Recommendation:**
- Concepto en factura genérico: "Artículo de salud y bienestar personal" en vez de "Vibrador marca X".
- Validar con contador: algunos clasificadores NCM pueden requerir descripción más específica.

## Régimen tributario recomendado

Dado facturación estimada 2026 (Gs. 300-800M/año proyectado con el nuevo canal online):

- **RESIMPLE**: solo si facturación < Gs. 80M/año (pequeño contribuyente).
- **IRE General**: si factura > Gs. 80M — probable.
- IVA al 10% aplicable a la mayoría de productos.
- IRP (Impuesto a la Renta Personal) para el titular si persona física.

**Consult with contador PY** for specific fit. Do not assume.

## Conservación de documentos

SET exige conservar facturas emitidas por **5 años** + 30 días.

Nuestro sistema debe:
- Guardar XML de cada factura indefinidamente (o al menos 6 años)
- Respaldar en 2 ubicaciones (Supabase + S3/R2)
- Permitir export masivo en caso de auditoría SET

## Consulta profesional

**Contador PY requerido** para:
- Elección de régimen tributario
- Determinación de tasa de IVA aplicable (mayoría 10%, algunos productos pueden ser otra)
- Presentación mensual de IVA
- Declaración jurada anual

**Referido sugerido:** contadores con experiencia en e-commerce PY. Fee típico: Gs. 500-1.500k/mes según tamaño.

## Calendario de compliance

| Tarea | Frecuencia |
|---|---|
| Declaración IVA | Mensual (día 10-15) |
| Declaración renta | Anual (marzo/abril) |
| Formulario 120 (retenciones) | Mensual si aplica |
| Actualización de timbrado | Cuando vence (cada 2 años aprox) |
| Reporte a UIF (Unidad de Información Financiera) | Ad-hoc si hay operaciones sospechosas > Gs. X |

## Priority

**Phase 4 (month 3-4).** No bloquea launch técnico pero sí el lanzamiento fiscal limpio.

## Open questions para owner

- ¿RUC y Timbrado están activos?
- ¿Qué contador actualmente manejas?
- ¿Estás interesado en migrar a facturación electrónica ahora o después del launch online?
- ¿Tu contador acepta integrarse con herramienta de facturación tipo Facturé?
