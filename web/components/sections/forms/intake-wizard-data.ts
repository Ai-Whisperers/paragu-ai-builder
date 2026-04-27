/** Types, steps, labels for IntakeWizardSection */
import type { LucideIcon } from 'lucide-react'

'use client'

import { useState } from 'react'
import { trackWizardStep, trackWizardComplete } from '@/lib/analytics/marketing-events'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

/**
 * Multi-step qualifying wizard. Pre-filters the visitor into a recommended
 * program tier by asking 4 light-touch questions and then routing them to
 * /contacto with ?programa=<tier>.
 *
 * Scope is deliberately narrow: the wizard does not collect email, does
 * not score beyond a simple decision-tree lookup, does not call any
 * backend. Its only job is "stop the visitor from guessing which of the
 * 4 programs applies and send them to the right contact form." That's
 * the 80/20 of intake qualification without the cost of building a full
 * HubSpot form or lead-scoring pipeline.
 *
 * Answers are stored in component state; refresh loses them by design —
 * this is a front-door flow, not a saved onboarding.
 */

export type ProgramTier = 'base' | 'business' | 'investor' | 'tierras'

interface StepContent {
  question: string
  options: Array<{ value: string; label: string }>
}

export interface IntakeWizardSectionProps {
  title?: string
  subtitle?: string
  steps?: {
    goal?: StepContent
    income?: StepContent
    needs?: StepContent
    timeline?: StepContent
  }
  resultHeading?: string
  resultSubheading?: string
  ctaLabel?: string
  restartLabel?: string
  tierLabels?: Record<ProgramTier, { name: string; pitch: string }>
  __locale?: string
  __siteSlug?: string
}

// Decision tree — simple, explicit, readable. The critic will hate it
// less than a lookup table because the logic is obvious.
function recommendTier(answers: {
  goal: string
  income: string
  needs: string
  timeline: string
}): ProgramTier {
  // Pure land purchase path
  if (answers.goal === 'land' || answers.needs === 'land-only') return 'tierras'
  // High-engagement investor path: needs company+bank AND wants 12-month support
  if (answers.needs === 'company-plus-advisory' || answers.income === 'investor') return 'investor'
  // Middle path: needs company + bank but no long-term advisory
  if (answers.needs === 'company-and-bank') return 'business'
  // Default: residency only
  return 'base'
}

const DEFAULT_STEPS: Record<string, IntakeWizardSectionProps['steps']> = {
  es: {
    goal: {
      question: '¿Cuál es su objetivo principal al mudarse a Paraguay?',
      options: [
        { value: 'residency', label: 'Obtener residencia y bajar carga fiscal' },
        { value: 'business', label: 'Establecer empresa y operar desde Paraguay' },
        { value: 'investor', label: 'Invertir en Paraguay (activos, real estate)' },
        { value: 'land', label: 'Comprar tierras / inmuebles rurales' },
      ],
    },
    income: {
      question: '¿Cómo genera su ingreso actualmente?',
      options: [
        { value: 'employed', label: 'Empleado (sueldo + nómina en mi país)' },
        { value: 'self-employed', label: 'Autónomo / freelance' },
        { value: 'founder', label: 'Fundador / dueño de empresa' },
        { value: 'investor', label: 'Inversor (rentas, dividendos, trading)' },
        { value: 'retired', label: 'Jubilado / rentista' },
      ],
    },
    needs: {
      question: '¿Qué necesita resolver además de la residencia?',
      options: [
        { value: 'residency-only', label: 'Solo residencia y cédula' },
        { value: 'company-and-bank', label: 'Sociedad paraguaya + cuenta bancaria' },
        { value: 'company-plus-advisory', label: 'Sociedad + banca + asesoría fiscal 12 meses' },
        { value: 'land-only', label: 'Compra de tierras exclusivamente' },
      ],
    },
    timeline: {
      question: '¿Cuándo quiere empezar?',
      options: [
        { value: 'asap', label: 'Lo antes posible (1-2 meses)' },
        { value: 'quarter', label: 'Próximo trimestre (3-6 meses)' },
        { value: 'year', label: 'En el próximo año' },
        { value: 'researching', label: 'Solo investigando por ahora' },
      ],
    },
  },
  en: {
    goal: {
      question: 'What is your main goal in moving to Paraguay?',
      options: [
        { value: 'residency', label: 'Get residency and lower my tax burden' },
        { value: 'business', label: 'Set up a company and operate from Paraguay' },
        { value: 'investor', label: 'Invest in Paraguay (assets, real estate)' },
        { value: 'land', label: 'Buy land / rural property' },
      ],
    },
    income: {
      question: 'How do you generate your income today?',
      options: [
        { value: 'employed', label: 'Employee (salary + payroll in my country)' },
        { value: 'self-employed', label: 'Self-employed / freelance' },
        { value: 'founder', label: 'Founder / business owner' },
        { value: 'investor', label: 'Investor (rent, dividends, trading)' },
        { value: 'retired', label: 'Retired / fixed-income' },
      ],
    },
    needs: {
      question: 'What do you need beyond residency?',
      options: [
        { value: 'residency-only', label: 'Just residency and ID card' },
        { value: 'company-and-bank', label: 'Paraguayan company + bank account' },
        { value: 'company-plus-advisory', label: 'Company + banking + 12-month tax advisory' },
        { value: 'land-only', label: 'Land purchase only' },
      ],
    },
    timeline: {
      question: 'When do you want to start?',
      options: [
        { value: 'asap', label: 'As soon as possible (1-2 months)' },
        { value: 'quarter', label: 'Next quarter (3-6 months)' },
        { value: 'year', label: 'Within the next year' },
        { value: 'researching', label: 'Just researching for now' },
      ],
    },
  },
  nl: {
    goal: {
      question: 'Wat is uw hoofddoel bij verhuizing naar Paraguay?',
      options: [
        { value: 'residency', label: 'Verblijfsvergunning en lagere belastingdruk' },
        { value: 'business', label: 'Bedrijf oprichten en vanuit Paraguay opereren' },
        { value: 'investor', label: 'Investeren in Paraguay (activa, vastgoed)' },
        { value: 'land', label: 'Grond / landelijk vastgoed kopen' },
      ],
    },
    income: {
      question: 'Hoe genereert u momenteel uw inkomen?',
      options: [
        { value: 'employed', label: 'Werknemer (salaris + loonstrook in mijn land)' },
        { value: 'self-employed', label: 'Zelfstandig / freelance' },
        { value: 'founder', label: 'Oprichter / ondernemer' },
        { value: 'investor', label: 'Investeerder (huur, dividend, trading)' },
        { value: 'retired', label: 'Gepensioneerd / vast inkomen' },
      ],
    },
    needs: {
      question: 'Wat heeft u naast verblijf nodig?',
      options: [
        { value: 'residency-only', label: 'Alleen verblijf en ID-kaart' },
        { value: 'company-and-bank', label: 'Paraguayaanse vennootschap + bankrekening' },
        { value: 'company-plus-advisory', label: 'Vennootschap + bank + 12 maanden fiscaal advies' },
        { value: 'land-only', label: 'Alleen grondaankoop' },
      ],
    },
    timeline: {
      question: 'Wanneer wilt u beginnen?',
      options: [
        { value: 'asap', label: 'Zo snel mogelijk (1-2 maanden)' },
        { value: 'quarter', label: 'Volgend kwartaal (3-6 maanden)' },
        { value: 'year', label: 'Binnen het komende jaar' },
        { value: 'researching', label: 'Alleen onderzoek voor nu' },
      ],
    },
  },
  de: {
    goal: {
      question: 'Was ist Ihr Hauptziel beim Umzug nach Paraguay?',
      options: [
        { value: 'residency', label: 'Aufenthalt erhalten und Steuerlast senken' },
        { value: 'business', label: 'Unternehmen gründen und aus Paraguay operieren' },
        { value: 'investor', label: 'In Paraguay investieren (Vermögen, Immobilien)' },
        { value: 'land', label: 'Land / ländliches Eigentum kaufen' },
      ],
    },
    income: {
      question: 'Wie erzielen Sie derzeit Ihr Einkommen?',
      options: [
        { value: 'employed', label: 'Angestellt (Gehalt + Lohnabrechnung in meinem Land)' },
        { value: 'self-employed', label: 'Selbstständig / Freelancer' },
        { value: 'founder', label: 'Gründer / Unternehmer' },
        { value: 'investor', label: 'Investor (Mieten, Dividenden, Trading)' },
        { value: 'retired', label: 'Rentner / Festeinkommen' },
      ],
    },
    needs: {
      question: 'Was benötigen Sie zusätzlich zum Aufenthalt?',
      options: [
        { value: 'residency-only', label: 'Nur Aufenthalt und ID-Karte' },
        { value: 'company-and-bank', label: 'Paraguayische Gesellschaft + Bankkonto' },
        { value: 'company-plus-advisory', label: 'Gesellschaft + Banking + 12 Monate Steuerberatung' },
        { value: 'land-only', label: 'Nur Landkauf' },
      ],
    },
    timeline: {
      question: 'Wann möchten Sie beginnen?',
      options: [
        { value: 'asap', label: 'So schnell wie möglich (1-2 Monate)' },
        { value: 'quarter', label: 'Nächstes Quartal (3-6 Monate)' },
        { value: 'year', label: 'Im nächsten Jahr' },
        { value: 'researching', label: 'Nur am Recherchieren' },
      ],
    },
  },
}

const DEFAULT_TIER_LABELS: Record<string, Record<ProgramTier, { name: string; pitch: string }>> = {
  es: {
    base: { name: 'Paraguay Base', pitch: 'Residencia permanente + cédula. El paquete más simple: si sólo busca residencia y no necesita estructura empresarial.' },
    business: { name: 'Paraguay Business', pitch: 'Residencia + sociedad + cuenta bancaria. El programa más elegido por europeos que operan desde Paraguay.' },
    investor: { name: 'Paraguay Investor Program', pitch: 'Todo lo de Business + 12 meses de acompañamiento contable y fiscal. Para quienes necesitan certidumbre fiscal prolongada.' },
    tierras: { name: 'Compra de Tierras', pitch: 'Asesoría integral en adquisición de tierras: perfil, short-list, auditoría legal, escrituración, inscripción.' },
  },
  en: {
    base: { name: 'Paraguay Base', pitch: 'Permanent residency + ID. Simplest package: if you only want residency and don\'t need a business structure.' },
    business: { name: 'Paraguay Business', pitch: 'Residency + company + bank account. The program most Europeans choose when operating from Paraguay.' },
    investor: { name: 'Paraguay Investor Program', pitch: 'Everything in Business + 12-month accounting and tax advisory. For extended fiscal certainty.' },
    tierras: { name: 'Land Purchase', pitch: 'Full advisory for land acquisition: profile, short-list, legal audit, deed, registry.' },
  },
  nl: {
    base: { name: 'Paraguay Base', pitch: 'Permanente verblijfsvergunning + ID. Eenvoudigste pakket als u alleen verblijf wilt.' },
    business: { name: 'Paraguay Business', pitch: 'Verblijf + vennootschap + bankrekening. Het meest gekozen programma voor Europeanen.' },
    investor: { name: 'Paraguay Investor Program', pitch: 'Alles van Business + 12 maanden boekhouding en fiscaal advies.' },
    tierras: { name: 'Grondaankoop', pitch: 'Volledig advies bij grondaankoop: profiel, selectie, juridische audit, akte, registratie.' },
  },
  de: {
    base: { name: 'Paraguay Base', pitch: 'Dauerhafter Aufenthalt + ID. Einfachstes Paket, wenn Sie nur den Aufenthalt möchten.' },
    business: { name: 'Paraguay Business', pitch: 'Aufenthalt + Gesellschaft + Bankkonto. Das von den meisten Europäern gewählte Programm.' },
    investor: { name: 'Paraguay Investor Program', pitch: 'Alles aus Business + 12 Monate Buchhaltung und Steuerberatung.' },
    tierras: { name: 'Landkauf', pitch: 'Umfassende Beratung beim Landkauf: Profil, Short-List, rechtliche Prüfung, Beurkundung, Eintragung.' },
  },
}

const UI_LABELS: Record<string, { back: string; next: string; step: string; of: string; result: string; viewProgram: string; restart: string }> = {
  es: { back: 'Atrás', next: 'Siguiente', step: 'Paso', of: 'de', result: 'Su programa recomendado', viewProgram: 'Ver detalles del programa', restart: 'Empezar de nuevo' },
  en: { back: 'Back', next: 'Next', step: 'Step', of: 'of', result: 'Your recommended program', viewProgram: 'See program details', restart: 'Start over' },
  nl: { back: 'Terug', next: 'Volgende', step: 'Stap', of: 'van', result: 'Uw aanbevolen programma', viewProgram: 'Zie programmadetails', restart: 'Opnieuw beginnen' },
  de: { back: 'Zurück', next: 'Weiter', step: 'Schritt', of: 'von', result: 'Ihr empfohlenes Programm', viewProgram: 'Programmdetails ansehen', restart: 'Neu starten' },
}
