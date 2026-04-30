#!/usr/bin/env python3
"""Translate Dayah LitWorks Spanish content to English using inline mapping for key fields + copy for structure."""
import json, re, os

SRC = "/tmp/pab-work/sites/dayah-litworks/content/es.json"
DST = "/tmp/pab-work/sites/dayah-litworks/content/en.json"

with open(SRC) as f:
    es = json.load(f)

# Recursive translation of string values
TRANSLATIONS = {
    # Meta
    "Diseño de tapas de libros — del manuscrito a la portada que vende": "Book cover design — from manuscript to cover that sells",
    # Navigation
    "Inicio": "Home",
    "Servicios": "Services",
    "Catálogo": "Catalog",
    "Sobre": "About",
    "Preguntas": "FAQ",
    "Contacto": "Contact",
    "Contactanos": "Contact Us",
    "Idioma": "Language",
    "Español": "Spanish",
    "Inglés": "English",
    # Hero
    "Portadas que venden.": "Covers that sell.",
    "Diseño profesional de portadas de libros para autores independientes. Del manuscripto a la portada que vende.": "Professional book cover design for indie authors. From manuscript to cover that sells.",
    "Ver Catálogo": "View Catalog",
    # Stats
    "Años de experiencia": "Years of experience",
    "Portadas diseñadas": "Covers designed",
    "Clientes satisfechos": "Satisfied clients",
    "Géneros diferentes": "Different genres",
    # Services
    "Nuestros Servicios": "Our Services",
    "Planes para cada proyecto": "Plans for every project",
    "Portada Personalizada — eBook": "Custom Cover — eBook",
    "Portada Personalizada — Tapa Blanda": "Custom Cover — Paperback",
    "Portada Paperback & eBook": "Paperback & eBook Cover",
    "Premade eBook": "Premade eBook",
    "Premade eBook & Paperback": "Premade eBook & Paperback",
    "Maquetación eBook": "eBook Layout",
    "Maquetación Paperback": "Paperback Layout",
    "Maquetación eBook & Paperback": "eBook & Paperback Layout",
    "Portada de libro electrónica exclusiva": "Exclusive eBook cover design",
    "Portada completa (frente, lomo y contra) para impresión": "Full cover (front, spine, back) for print",
    "Combo completo: portada eBook + tapa blanda": "Full combo: eBook cover + paperback",
    "Portada premade para eBook con personalización": "Premade eBook cover with customization",
    "Portada premade completa con versión tapa blanda": "Complete premade cover with paperback version",
    "Diseño interior para libro electrónico": "Professional interior layout for eBook",
    "Diseño interior para libro impreso": "Professional interior layout for print",
    "Diseño interior completo para ambas versiones": "Complete interior layout for both versions",
    # Addons
    "Servicios adicionales": "Additional Services",
    "Extras que podés sumar a cualquier paquete.": "Extras you can add to any package.",
    # Process
    "Proceso": "Process",
    "Brief + referencias": "Brief + references",
    "Cuéntame sobre tu libro, envíame referencias visuales y define tu presupuesto.": "Tell me about your book, send visual references, and set your budget.",
    "Diseño": "Design",
    "Creación de la portada con revisiones incluidas hasta tu aprobación final.": "Cover creation with revisions included until your final approval.",
    "Entrega final": "Final Delivery",
    "Archivos en alta resolución para tu plataforma: eBook cover JPG/PDF, título en PNG, banners de reveal, 2 mockups. Listos para subir.": "High-resolution files for your platform: eBook cover JPG/PDF, title PNG, reveal banners, 2 mockups. Ready to upload.",
    # CTA
    "¿Listo para la portada perfecta?": "Ready for the perfect cover?",
    "Contactame y hagamos que tu libro destaque": "Contact me and let's make your book stand out",
    "Escribime por WhatsApp": "Write me on WhatsApp",
    "Iniciar mi proceso": "Start my process",
    # FAQ
    "Preguntas Frecuentes": "Frequently Asked Questions",
    # Portfolio
    "Trabajos Recientes": "Recent Work",
    "Todos": "All",
    "Branding": "Branding",
    "Editorial": "Editorial",
    "Ilustración": "Illustration",
    # Blog
    "Blog": "Blog",
    "Tips, tendencias y recursos para autores": "Tips, trends and resources for authors",
    # Contact
    "Contame de tu libro": "Tell me about your book",
    "Newsletter para autores": "Newsletter for authors",
    # Footer
    "ENLACES": "LINKS",
    "CONTACTO": "CONTACT",
    "Dirección": "Address",
    "Términos": "Terms",
    "Términos y Condiciones": "Terms & Conditions",
    "Privacidad": "Privacy",
    "Política de Privacidad": "Privacy Policy",
    "Portafolio": "Portfolio",
    # About page
    "Sobre Dayah LitWorks": "About Dayah LitWorks",
    # Currency
    "USD": "USD",
    "PYG": "PYG",
    # Months
    "enero": "January", "febrero": "February", "marzo": "March", "abril": "April",
    "mayo": "May", "junio": "June", "julio": "July", "agosto": "August",
    "septiembre": "September", "octubre": "October", "noviembre": "November", "diciembre": "December",
    # Blog
    "Diseño": "Design",
    "5 min": "5 min",
    "4 min": "4 min",
    "No escribo blog posts todavía.": "I don't write blog posts yet.",
    "Solo newsletter por ahora": "Newsletter only for now",
    "Suscribirme al newsletter": "Subscribe to the newsletter",
    "Seguirme en Instagram": "Follow me on Instagram",
    "Preguntar por WhatsApp": "Ask on WhatsApp",
    # Site
    "Dayah LitWorks": "Dayah LitWorks",
    "Asunción": "Asunción",
    "Paraguay": "Paraguay",
}

def translate_text(text):
    if not isinstance(text, str):
        return text
    # Direct match
    if text in TRANSLATIONS:
        return TRANSLATIONS[text]
    # Try to translate individual lines/paragraphs
    return text  # fallback

def translate_json(obj):
    if isinstance(obj, dict):
        return {k: translate_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [translate_json(item) for item in obj]
    elif isinstance(obj, str):
        return translate_text(obj)
    else:
        return obj

en = translate_json(es)

# Fix: keep business name as-is
en["siteName"] = "Dayah LitWorks"
en["navigation"]["businessName"] = "Dayah LitWorks"
en["placeholders"]["businessName"] = "Dayah LitWorks"

# For blog posts - keep slugs, translate titles
# For blogPost content - keep as-is (full article text)

# Remove PYG pricing in English version (keep USD only)
def remove_pyg(obj):
    if isinstance(obj, dict):
        if "pricePYG" in obj:
            del obj["pricePYG"]
        for v in obj.values():
            remove_pyg(v)
    elif isinstance(obj, list):
        for item in obj:
            remove_pyg(item)
remove_pyg(en)

with open(DST, "w") as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

import os
print(f"en.json created: {os.path.getsize(DST)} bytes")
print(f"Keys: {list(en.keys())}")
