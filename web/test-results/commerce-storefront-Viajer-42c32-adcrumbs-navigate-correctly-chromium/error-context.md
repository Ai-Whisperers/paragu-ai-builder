# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: commerce-storefront.test.ts >> Viajero Comercio - Storefront >> breadcrumbs navigate correctly
- Location: tests/e2e/commerce-storefront.test.ts:25:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('nav[aria-label="Breadcrumb"] a').first()
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('nav[aria-label="Breadcrumb"] a').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Saltar al contenido principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "El Viajero Comercio" [ref=e6] [cursor=pointer]:
          - /url: /s/es/viajero-comercio
        - navigation [ref=e7]:
          - search [ref=e8]:
            - img [ref=e9]
            - generic [ref=e11]: Buscar productos
            - searchbox "Buscar productos" [ref=e12]
          - link "Tienda" [ref=e13] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda
          - link "Mis favoritos" [ref=e14] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/favoritos
            - img [ref=e15]
            - generic [ref=e17]: Favoritos
          - link "Mi orden" [ref=e18] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/buscar-orden
          - button "Carrito (0)" [ref=e19] [cursor=pointer]:
            - img [ref=e20]
    - dialog:
      - banner:
        - heading [level=2]: Tu carrito
        - button:
          - img
      - generic:
        - generic:
          - paragraph: Tu carrito está vacío.
          - button: Seguir comprando
    - navigation "Migas de pan" [ref=e22]:
      - list [ref=e23]:
        - listitem [ref=e24]:
          - link "El Viajero Comercio" [ref=e25] [cursor=pointer]:
            - /url: /s/es/viajero-comercio
        - listitem [ref=e26]:
          - generic [ref=e27]: /
          - generic [ref=e28]: Tienda
    - main [ref=e29]:
      - heading "Nuestra tienda" [level=1] [ref=e30]
      - generic [ref=e31]:
        - img "Camping al aire libre" [ref=e33]
        - generic [ref=e35]:
          - heading "Equipate para tu proxima aventura" [level=1] [ref=e36]
          - paragraph [ref=e37]: Camping, pesca, equipo tactico, accesorios para auto y moto. Todo lo que necesitas para tu proxima escapada.
          - generic [ref=e38]:
            - link "Ver Catalogo" [ref=e39] [cursor=pointer]:
              - /url: "#catalogo"
              - img [ref=e40]
              - text: Ver Catalogo
            - link "Hablanos por WhatsApp" [ref=e42] [cursor=pointer]:
              - /url: "#"
              - img [ref=e43]
              - text: Hablanos por WhatsApp
          - navigation "Categorias rapidas" [ref=e45]:
            - link "Camping" [ref=e46] [cursor=pointer]:
              - /url: /s/es/viajero-comercio/tienda?category=Camping
            - link "Pesca" [ref=e47] [cursor=pointer]:
              - /url: /s/es/viajero-comercio/tienda?category=Pesca
            - link "Tactico" [ref=e48] [cursor=pointer]:
              - /url: /s/es/viajero-comercio/tienda?category=Tactico%2FDefensa
            - link "Automoviles" [ref=e49] [cursor=pointer]:
              - /url: /s/es/viajero-comercio/tienda?category=Automoviles
            - link "Motos" [ref=e50] [cursor=pointer]:
              - /url: /s/es/viajero-comercio/tienda?category=Motos
            - link "Campo" [ref=e51] [cursor=pointer]:
              - /url: /s/es/viajero-comercio/tienda?category=Campo
      - complementary "Nuestras promesas" [ref=e52]:
        - generic [ref=e53]:
          - generic [ref=e54]: 🚚
          - generic [ref=e55]:
            - paragraph [ref=e56]: Envio gratis desde Gs. 300.000
            - paragraph [ref=e57]: Asuncion y area metropolitana en 24-48 hs.
        - generic [ref=e58]:
          - generic [ref=e59]: 💬
          - generic [ref=e60]:
            - paragraph [ref=e61]: Pedi por WhatsApp
            - paragraph [ref=e62]: Consulta disponibilidad antes de comprar.
        - generic [ref=e63]:
          - generic [ref=e64]: 🔒
          - generic [ref=e65]:
            - paragraph [ref=e66]: Pago seguro
            - paragraph [ref=e67]: Efectivo, transferencia, Bancard, Mercado Pago.
        - generic [ref=e68]:
          - generic [ref=e69]: 🔙
          - generic [ref=e70]:
            - paragraph [ref=e71]: Cambios hasta 7 dias
            - paragraph [ref=e72]: Producto sin usar con su empaque original.
      - navigation "Categorias principales" [ref=e73]:
        - generic [ref=e74]:
          - link "Acc. Personales Mochilas, cuchillos, brujulas · 16" [ref=e75] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Acc.%20Personales
            - img [ref=e80]
            - paragraph [ref=e83]: Acc. Personales
            - paragraph [ref=e84]: Mochilas, cuchillos, brujulas · 16
          - link "Automoviles Dashcams, GPS, infladores · 16" [ref=e85] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Automoviles
            - img [ref=e90]
            - paragraph [ref=e95]: Automoviles
            - paragraph [ref=e96]: Dashcams, GPS, infladores · 16
          - link "Camping Carpas, bolsas, colchones · 32" [ref=e97] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Camping
            - img [ref=e102]
            - paragraph [ref=e105]: Camping
            - paragraph [ref=e106]: Carpas, bolsas, colchones · 32
          - link "Campo y Granja Herramientas, cercas, bebederos · 17" [ref=e107] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Campo
            - img [ref=e112]
            - paragraph [ref=e115]: Campo y Granja
            - paragraph [ref=e116]: Herramientas, cercas, bebederos · 17
          - link "Motos Cascos, guantes, GPS · 12" [ref=e117] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Motos
            - img [ref=e122]
            - paragraph [ref=e126]: Motos
            - paragraph [ref=e127]: Cascos, guantes, GPS · 12
          - link "Pesca Canas, reels, senuelos · 19" [ref=e128] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Pesca
            - img [ref=e133]
            - paragraph [ref=e138]: Pesca
            - paragraph [ref=e139]: Canas, reels, senuelos · 19
          - link "Tactico y Defensa Cuchillos, linternas, gas · 14" [ref=e140] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/tienda?category=Tactico%2FDefensa
            - img [ref=e145]
            - paragraph [ref=e149]: Tactico y Defensa
            - paragraph [ref=e150]: Cuchillos, linternas, gas · 14
      - note "Aviso para administradores" [ref=e151]:
        - generic [ref=e152]: ⚠
        - generic [ref=e153]:
          - text: Catálogo demo —
          - code [ref=e154]: isSeed
          - text: sin reemplazar.
      - generic "Filtros rápidos" [ref=e155]:
        - button "🔥 En oferta" [ref=e156] [cursor=pointer]
        - button "💰 Hasta Gs 100.000" [ref=e157] [cursor=pointer]
        - button "💰 Gs 100.000 – 300.000" [ref=e158] [cursor=pointer]
        - button "💰 Gs 300.000+" [ref=e159] [cursor=pointer]
        - button "✅ Solo en stock" [ref=e160] [cursor=pointer]
      - generic [ref=e161]:
        - generic [ref=e162]:
          - search [ref=e163]:
            - generic [ref=e164]:
              - generic [ref=e165]: Buscar productos
              - img [ref=e166]
              - searchbox "Buscar productos" [ref=e168]
            - button "Buscar" [ref=e169] [cursor=pointer]
          - generic [ref=e171]:
            - generic [ref=e172]: "Ordenar:"
            - combobox "Ordenar:" [ref=e173]:
              - option "Más nuevos" [selected]
              - option "Más vendidos"
              - option "Mejor valorados"
              - 'option "Precio: menor a mayor"'
              - 'option "Precio: mayor a menor"'
              - option "Nombre A→Z"
        - generic [ref=e174]:
          - group "Categoría" [ref=e175]:
            - generic [ref=e176]: Categoría
            - button "Acc. Personales(16)" [ref=e177] [cursor=pointer]:
              - text: 🎒Acc. Personales
              - generic [ref=e178]: (16)
            - button "Automoviles(16)" [ref=e179] [cursor=pointer]:
              - text: 🚗Automoviles
              - generic [ref=e180]: (16)
            - button "Camping(32)" [ref=e181] [cursor=pointer]:
              - text: 🏔️Camping
              - generic [ref=e182]: (32)
            - button "Campo(17)" [ref=e183] [cursor=pointer]:
              - text: 🌿Campo
              - generic [ref=e184]: (17)
            - button "Motos(12)" [ref=e185] [cursor=pointer]:
              - text: 🏍️Motos
              - generic [ref=e186]: (12)
            - button "Pesca(19)" [ref=e187] [cursor=pointer]:
              - text: 🎣Pesca
              - generic [ref=e188]: (19)
            - button "Tactico/Defensa(14)" [ref=e189] [cursor=pointer]:
              - text: 🗡️Tactico/Defensa
              - generic [ref=e190]: (14)
          - group "Marca:" [ref=e191]:
            - generic [ref=e192]: "Marca:"
            - button "Coleman" [ref=e193] [cursor=pointer]
            - button "Garmin" [ref=e194] [cursor=pointer]
            - button "LS2" [ref=e195] [cursor=pointer]
            - button "Shimano" [ref=e196] [cursor=pointer]
            - button "Smith & Wesson" [ref=e197] [cursor=pointer]
            - button "Tramontina" [ref=e198] [cursor=pointer]
          - generic [ref=e199]:
            - generic [ref=e200]:
              - group "Precio (Gs):" [ref=e201]:
                - generic [ref=e202]: "Precio (Gs):"
                - textbox "Precio mínimo" [ref=e203]:
                  - /placeholder: Mín
                - generic [ref=e204]: –
                - textbox "Precio máximo" [ref=e205]:
                  - /placeholder: Máx
              - button "Aplicar" [ref=e206] [cursor=pointer]
            - generic [ref=e207]:
              - generic [ref=e208]:
                - checkbox "Solo en stock" [ref=e209]
                - generic [ref=e210]: Solo en stock
              - generic [ref=e211]:
                - checkbox "En oferta" [ref=e212]
                - generic [ref=e213]: En oferta
        - generic [ref=e215]: Mostrando 12 de 126
      - generic [ref=e216]:
        - article [ref=e217]:
          - link "Guantes tacticos antideslizantes Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Guantes Tacticos Antideslizantes Talla M-XXL Guardar Guantes Tacticos Antideslizantes Talla M-XXL en favoritos" [ref=e218] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/guantes-tacticos-antideslizantes
            - generic [ref=e219]:
              - generic [ref=e220]:
                - img "Guantes tacticos antideslizantes" [ref=e221]
                - generic [ref=e222]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Guantes Tacticos Antideslizantes Talla M-XXL" [ref=e223]:
                - img [ref=e224]
                - text: Vista rápida
              - button "Guardar Guantes Tacticos Antideslizantes Talla M-XXL en favoritos" [ref=e227]:
                - img [ref=e228]
          - generic [ref=e230]:
            - paragraph [ref=e231]: Smith & Wesson
            - heading "Guantes Tacticos Antideslizantes Talla M-XXL" [level=3] [ref=e232]
            - generic [ref=e233]:
              - generic [ref=e235]: Gs 35.000
              - button "Agregar al carrito" [ref=e236] [cursor=pointer]
        - article [ref=e237]:
          - link "Cuchillo tactico tanto Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Cuchillo Tactico Tanto Fijo 25cm Acero 440C Guardar Cuchillo Tactico Tanto Fijo 25cm Acero 440C en favoritos Descuento del 27 por ciento" [ref=e238] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/cuchillo-tactico-tanto
            - generic [ref=e239]:
              - generic [ref=e240]:
                - img "Cuchillo tactico tanto" [ref=e241]
                - generic [ref=e242]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Cuchillo Tactico Tanto Fijo 25cm Acero 440C" [ref=e243]:
                - img [ref=e244]
                - text: Vista rápida
              - button "Guardar Cuchillo Tactico Tanto Fijo 25cm Acero 440C en favoritos" [ref=e247]:
                - img [ref=e248]
              - generic "Descuento del 27 por ciento" [ref=e250]: −27%
          - generic [ref=e251]:
            - paragraph [ref=e252]: Smith & Wesson
            - heading "Cuchillo Tactico Tanto Fijo 25cm Acero 440C" [level=3] [ref=e253]
            - generic [ref=e254]:
              - generic [ref=e255]:
                - generic [ref=e256]: Gs 95.000
                - generic [ref=e257]: Gs 130.000
              - button "Agregar al carrito" [ref=e258] [cursor=pointer]
        - article [ref=e259]:
          - link "Picana electrica defensa personal Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Picana Electrica Defensa Personal 1M Volt Guardar Picana Electrica Defensa Personal 1M Volt en favoritos" [ref=e260] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/picana-electrica-defensa
            - generic [ref=e261]:
              - generic [ref=e262]:
                - img "Picana electrica defensa personal" [ref=e263]
                - generic [ref=e264]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Picana Electrica Defensa Personal 1M Volt" [ref=e265]:
                - img [ref=e266]
                - text: Vista rápida
              - button "Guardar Picana Electrica Defensa Personal 1M Volt en favoritos" [ref=e269]:
                - img [ref=e270]
          - generic [ref=e272]:
            - paragraph [ref=e273]: Smith & Wesson
            - heading "Picana Electrica Defensa Personal 1M Volt" [level=3] [ref=e274]
            - generic [ref=e275]:
              - generic [ref=e277]: Gs 85.000
              - button "Agregar al carrito" [ref=e278] [cursor=pointer]
        - article [ref=e279]:
          - link "Baston tactico extensible Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Baston Tactico Extensible Acero 21 Pulgadas Guardar Baston Tactico Extensible Acero 21 Pulgadas en favoritos" [ref=e280] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/baston-tactico-extensible
            - generic [ref=e281]:
              - generic [ref=e282]:
                - img "Baston tactico extensible" [ref=e283]
                - generic [ref=e284]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Baston Tactico Extensible Acero 21 Pulgadas" [ref=e285]:
                - img [ref=e286]
                - text: Vista rápida
              - button "Guardar Baston Tactico Extensible Acero 21 Pulgadas en favoritos" [ref=e289]:
                - img [ref=e290]
          - generic [ref=e292]:
            - paragraph [ref=e293]: Smith & Wesson
            - heading "Baston Tactico Extensible Acero 21 Pulgadas" [level=3] [ref=e294]
            - generic [ref=e295]:
              - generic [ref=e297]: Gs 75.000
              - button "Agregar al carrito" [ref=e298] [cursor=pointer]
        - article [ref=e299]:
          - link "Brujula tactica militar Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Brujula Tactica Militar Profesional Guardar Brujula Tactica Militar Profesional en favoritos" [ref=e300] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/brújula-tactica-militar
            - generic [ref=e301]:
              - generic [ref=e302]:
                - img "Brujula tactica militar" [ref=e303]
                - generic [ref=e304]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Brujula Tactica Militar Profesional" [ref=e305]:
                - img [ref=e306]
                - text: Vista rápida
              - button "Guardar Brujula Tactica Militar Profesional en favoritos" [ref=e309]:
                - img [ref=e310]
          - generic [ref=e312]:
            - paragraph [ref=e313]: Smith & Wesson
            - heading "Brujula Tactica Militar Profesional" [level=3] [ref=e314]
            - generic [ref=e315]:
              - generic [ref=e317]: Gs 45.000
              - button "Agregar al carrito" [ref=e318] [cursor=pointer]
        - article [ref=e319]:
          - link "Mochila tactica de asalto Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Mochila Tactica Asalto 35L Molle Guardar Mochila Tactica Asalto 35L Molle en favoritos" [ref=e320] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/mochila-tactica-asalto-35l
            - generic [ref=e321]:
              - generic [ref=e322]:
                - img "Mochila tactica de asalto" [ref=e323]
                - generic [ref=e324]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Mochila Tactica Asalto 35L Molle" [ref=e325]:
                - img [ref=e326]
                - text: Vista rápida
              - button "Guardar Mochila Tactica Asalto 35L Molle en favoritos" [ref=e329]:
                - img [ref=e330]
          - generic [ref=e332]:
            - paragraph [ref=e333]: Smith & Wesson
            - heading "Mochila Tactica Asalto 35L Molle" [level=3] [ref=e334]
            - generic [ref=e335]:
              - generic [ref=e337]: Gs 150.000
              - button "Agregar al carrito" [ref=e338] [cursor=pointer]
        - article [ref=e339]:
          - link "Cuchillo tactico plegable Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Cuchillo Tactico Plegable Con Seguro Guardar Cuchillo Tactico Plegable Con Seguro en favoritos" [ref=e340] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/cuchillo-tactico-plegable
            - generic [ref=e341]:
              - generic [ref=e342]:
                - img "Cuchillo tactico plegable" [ref=e343]
                - generic [ref=e344]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Cuchillo Tactico Plegable Con Seguro" [ref=e345]:
                - img [ref=e346]
                - text: Vista rápida
              - button "Guardar Cuchillo Tactico Plegable Con Seguro en favoritos" [ref=e349]:
                - img [ref=e350]
          - generic [ref=e352]:
            - paragraph [ref=e353]: Smith & Wesson
            - heading "Cuchillo Tactico Plegable Con Seguro" [level=3] [ref=e354]
            - generic [ref=e355]:
              - generic [ref=e357]: Gs 65.000
              - button "Agregar al carrito" [ref=e358] [cursor=pointer]
        - article [ref=e359]:
          - link "Navaja multiuso tactica Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Navaja Tactica Multiuso 18 Herramientas Acero Inoxidable Guardar Navaja Tactica Multiuso 18 Herramientas Acero Inoxidable en favoritos" [ref=e360] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/naveja-multiuso-tactica
            - generic [ref=e361]:
              - generic [ref=e362]:
                - img "Navaja multiuso tactica" [ref=e363]
                - generic [ref=e364]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Navaja Tactica Multiuso 18 Herramientas Acero Inoxidable" [ref=e365]:
                - img [ref=e366]
                - text: Vista rápida
              - button "Guardar Navaja Tactica Multiuso 18 Herramientas Acero Inoxidable en favoritos" [ref=e369]:
                - img [ref=e370]
          - generic [ref=e372]:
            - paragraph [ref=e373]: Smith & Wesson
            - heading "Navaja Tactica Multiuso 18 Herramientas Acero Inoxidable" [level=3] [ref=e374]
            - generic [ref=e375]:
              - generic [ref=e377]: Gs 55.000
              - button "Agregar al carrito" [ref=e378] [cursor=pointer]
        - article [ref=e379]:
          - link "Linterna tactica LED Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Linterna Tactica LED 2000lm Recargable USB Guardar Linterna Tactica LED 2000lm Recargable USB en favoritos Descuento del 23 por ciento" [ref=e380] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/linterna-tactica-led
            - generic [ref=e381]:
              - generic [ref=e382]:
                - img "Linterna tactica LED" [ref=e383]
                - generic [ref=e384]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Linterna Tactica LED 2000lm Recargable USB" [ref=e385]:
                - img [ref=e386]
                - text: Vista rápida
              - button "Guardar Linterna Tactica LED 2000lm Recargable USB en favoritos" [ref=e389]:
                - img [ref=e390]
              - generic "Descuento del 23 por ciento" [ref=e392]: −23%
          - generic [ref=e393]:
            - paragraph [ref=e394]: Smith & Wesson
            - heading "Linterna Tactica LED 2000lm Recargable USB" [level=3] [ref=e395]
            - generic [ref=e396]:
              - generic [ref=e397]:
                - generic [ref=e398]: Gs 85.000
                - generic [ref=e399]: Gs 110.000
              - button "Agregar al carrito" [ref=e400] [cursor=pointer]
        - article [ref=e401]:
          - link "Linterna frontal tactica Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Linterna Frontal Tactica LED 800lm Recargable Guardar Linterna Frontal Tactica LED 800lm Recargable en favoritos" [ref=e402] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/linterna-frontal-tactica
            - generic [ref=e403]:
              - generic [ref=e404]:
                - img "Linterna frontal tactica" [ref=e405]
                - generic [ref=e406]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Linterna Frontal Tactica LED 800lm Recargable" [ref=e407]:
                - img [ref=e408]
                - text: Vista rápida
              - button "Guardar Linterna Frontal Tactica LED 800lm Recargable en favoritos" [ref=e411]:
                - img [ref=e412]
          - generic [ref=e414]:
            - paragraph [ref=e415]: Smith & Wesson
            - heading "Linterna Frontal Tactica LED 800lm Recargable" [level=3] [ref=e416]
            - generic [ref=e417]:
              - generic [ref=e419]: Gs 55.000
              - button "Agregar al carrito" [ref=e420] [cursor=pointer]
        - article [ref=e421]:
          - link "Walkie talkie profesional Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Walkie Talkie Profesional 16 Canales 5km Guardar Walkie Talkie Profesional 16 Canales 5km en favoritos" [ref=e422] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/walkie-talkie-profesional
            - generic [ref=e423]:
              - generic [ref=e424]:
                - img "Walkie talkie profesional" [ref=e425]
                - generic [ref=e426]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Walkie Talkie Profesional 16 Canales 5km" [ref=e427]:
                - img [ref=e428]
                - text: Vista rápida
              - button "Guardar Walkie Talkie Profesional 16 Canales 5km en favoritos" [ref=e431]:
                - img [ref=e432]
          - generic [ref=e434]:
            - paragraph [ref=e435]: Smith & Wesson
            - heading "Walkie Talkie Profesional 16 Canales 5km" [level=3] [ref=e436]
            - generic [ref=e437]:
              - generic [ref=e439]: Gs 140.000
              - button "Agregar al carrito" [ref=e440] [cursor=pointer]
        - article [ref=e441]:
          - link "Chaleco tactico Ejemplo Equipo tactico vista detalle Ejemplo Vista rápida de Chaleco Tactico Multibolsillos Ajustable Guardar Chaleco Tactico Multibolsillos Ajustable en favoritos Descuento del 25 por ciento" [ref=e442] [cursor=pointer]:
            - /url: /s/es/viajero-comercio/producto/chaleco-tactico-multibolsillos
            - generic [ref=e443]:
              - generic [ref=e444]:
                - img "Chaleco tactico" [ref=e445]
                - generic [ref=e446]: Ejemplo
              - generic:
                - generic:
                  - img "Equipo tactico vista detalle"
                  - generic: Ejemplo
              - button "Vista rápida de Chaleco Tactico Multibolsillos Ajustable" [ref=e447]:
                - img [ref=e448]
                - text: Vista rápida
              - button "Guardar Chaleco Tactico Multibolsillos Ajustable en favoritos" [ref=e451]:
                - img [ref=e452]
              - generic "Descuento del 25 por ciento" [ref=e454]: −25%
          - generic [ref=e455]:
            - paragraph [ref=e456]: Smith & Wesson
            - heading "Chaleco Tactico Multibolsillos Ajustable" [level=3] [ref=e457]
            - generic [ref=e458]:
              - generic [ref=e459]:
                - generic [ref=e460]: Gs 120.000
                - generic [ref=e461]: Gs 160.000
              - button "Agregar al carrito" [ref=e462] [cursor=pointer]
      - generic [ref=e463]:
        - button "Cargar mas productos" [ref=e464] [cursor=pointer]:
          - img [ref=e465]
          - text: Cargar mas productos
        - paragraph [ref=e467]: Mostrando 12 de 132 productos
    - contentinfo [ref=e468]:
      - generic [ref=e469]:
        - generic [ref=e470]:
          - generic [ref=e471]:
            - heading [level=3]
            - paragraph [ref=e472]:
              - generic [ref=e473]: Av. Mariscal Lopez 1234, Asuncion
          - generic [ref=e474]:
            - heading "El Viajero" [level=4] [ref=e475]
            - list [ref=e476]:
              - listitem [ref=e477]:
                - link "Inicio" [ref=e478] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio
              - listitem [ref=e479]:
                - link "Tienda" [ref=e480] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/tienda
              - listitem [ref=e481]:
                - link "Blog" [ref=e482] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/blog
              - listitem [ref=e483]:
                - link "Nosotros" [ref=e484] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/nosotros
              - listitem [ref=e485]:
                - link "Contacto" [ref=e486] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/contacto
          - generic [ref=e487]:
            - heading "Ayuda" [level=4] [ref=e488]
            - list [ref=e489]:
              - listitem [ref=e490]:
                - link "FAQ" [ref=e491] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/faq
              - listitem [ref=e492]:
                - link "Envios" [ref=e493] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/faq
              - listitem [ref=e494]:
                - link "Cambios y devoluciones" [ref=e495] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/faq
              - listitem [ref=e496]:
                - link "Medios de pago" [ref=e497] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/faq
          - generic [ref=e498]:
            - heading "Legales" [level=4] [ref=e499]
            - list [ref=e500]:
              - listitem [ref=e501]:
                - link "Privacidad" [ref=e502] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/privacidad
              - listitem [ref=e503]:
                - link "Terminos" [ref=e504] [cursor=pointer]:
                  - /url: /s/es/viajero-comercio/terminos
          - generic [ref=e505]:
            - heading "Contact" [level=4] [ref=e506]
            - list [ref=e507]:
              - listitem [ref=e508]:
                - link "+595 981 234 567" [ref=e509] [cursor=pointer]:
                  - /url: tel:+595 981 234 567
        - generic [ref=e510]:
          - text: © 2026 . All rights reserved.
          - generic [ref=e511]: vdev
  - generic [ref=e516] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e517]:
      - img [ref=e518]
    - generic [ref=e521]:
      - button "Open issues overlay" [ref=e522]:
        - generic [ref=e523]:
          - generic [ref=e524]: "0"
          - generic [ref=e525]: "1"
        - generic [ref=e526]: Issue
      - button "Collapse issues badge" [ref=e527]:
        - img [ref=e528]
  - alert [ref=e530]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('Viajero Comercio - Storefront', () => {
  4   |   const BASE = '/s/es/viajero-comercio'
  5   | 
  6   |   test('tienda page loads with category tiles and product grid', async ({ page }) => {
  7   |     await page.goto(`${BASE}/tienda`)
  8   | 
  9   |     // Page title
  10  |     await expect(page).toHaveTitle(/Tienda/)
  11  | 
  12  |     // Category tiles render (at least 3 tiles visible)
  13  |     const tiles = page.locator('nav[aria-label="Categorias principales"] a')
  14  |     await expect(tiles.first()).toBeVisible()
  15  |     const tileCount = await tiles.count()
  16  |     expect(tileCount).toBeGreaterThanOrEqual(3)
  17  | 
  18  |     // Product grid has items
  19  |     const products = page.locator('article')
  20  |     await expect(products.first()).toBeVisible({ timeout: 10000 })
  21  |     const productCount = await products.count()
  22  |     expect(productCount).toBeGreaterThan(0)
  23  |   })
  24  | 
  25  |   test('breadcrumbs navigate correctly', async ({ page }) => {
  26  |     await page.goto(`${BASE}/tienda`)
  27  | 
  28  |     // Click "El Viajero Comercio" breadcrumb
  29  |     const homeLink = page.locator('nav[aria-label="Breadcrumb"] a')
> 30  |     await expect(homeLink.first()).toBeVisible()
      |                                    ^ Error: expect(locator).toBeVisible() failed
  31  |   })
  32  | 
  33  |   test('search filters products', async ({ page }) => {
  34  |     await page.goto(`${BASE}/tienda`)
  35  | 
  36  |     // Type in search
  37  |     const searchInput = page.locator('input[type="search"]')
  38  |     await expect(searchInput).toBeVisible()
  39  |     await searchInput.fill('carpa')
  40  |     await searchInput.press('Enter')
  41  | 
  42  |     // URL should have q=carpa
  43  |     await expect(page).toHaveURL(/q=carpa/)
  44  | 
  45  |     // Products should be filtered
  46  |     await page.waitForTimeout(1000)
  47  |   })
  48  | 
  49  |   test('category filter works', async ({ page }) => {
  50  |     await page.goto(`${BASE}/tienda`)
  51  | 
  52  |     // Find and click a category chip in the toolbar
  53  |     const campingChip = page.locator('button[aria-pressed]', { hasText: 'Camping' })
  54  |     if (await campingChip.isVisible()) {
  55  |       await campingChip.click()
  56  |       await expect(page).toHaveURL(/category=/)
  57  |     }
  58  |   })
  59  | 
  60  |   test('quick filters toggle', async ({ page }) => {
  61  |     await page.goto(`${BASE}/tienda`)
  62  | 
  63  |     // Click "En oferta" quick filter
  64  |     const onSaleBtn = page.locator('button[aria-pressed]', { hasText: 'En oferta' })
  65  |     if (await onSaleBtn.isVisible()) {
  66  |       await onSaleBtn.click()
  67  |       await expect(page).toHaveURL(/on_sale=1/)
  68  |     }
  69  |   })
  70  | 
  71  |   test('sort products by price', async ({ page }) => {
  72  |     await page.goto(`${BASE}/tienda`)
  73  | 
  74  |     const sortSelect = page.locator('select')
  75  |     if (await sortSelect.isVisible()) {
  76  |       await sortSelect.selectOption('price-asc')
  77  |       await expect(page).toHaveURL(/sort=price-asc/)
  78  |     }
  79  |   })
  80  | 
  81  |   test('pagination works when enough products', async ({ page }) => {
  82  |     await page.goto(`${BASE}/tienda`)
  83  | 
  84  |     // Check if pagination exists (need > 12 products)
  85  |     const nextBtn = page.locator('button', { hasText: 'Siguiente' })
  86  |     if (await nextBtn.isVisible()) {
  87  |       await nextBtn.click()
  88  |       await expect(page).toHaveURL(/page=2/)
  89  |     }
  90  |   })
  91  | 
  92  |   test('product detail page from grid', async ({ page }) => {
  93  |     await page.goto(`${BASE}/tienda`)
  94  | 
  95  |     // Click first product link
  96  |     const firstProduct = page.locator('article a').first()
  97  |     await expect(firstProduct).toBeVisible()
  98  |     const href = await firstProduct.getAttribute('href')
  99  |     await firstProduct.click()
  100 | 
  101 |     // Should be on PDP
  102 |     await expect(page).toHaveURL(/producto\//)
  103 |     // PDP should have product name visible
  104 |     await expect(page.locator('h1')).toBeVisible()
  105 |   })
  106 | 
  107 |   test('trust strip shows shipping info', async ({ page }) => {
  108 |     await page.goto(`${BASE}/tienda`)
  109 | 
  110 |     // Trust strip should exist and show free shipping
  111 |     const trustStrip = page.locator('aside[aria-label="Nuestras promesas"]')
  112 |     await expect(trustStrip).toBeVisible()
  113 |     await expect(trustStrip).toContainText('Envio gratis')
  114 |     await expect(trustStrip).toContainText('WhatsApp')
  115 |     await expect(trustStrip).toContainText('Pago seguro')
  116 |   })
  117 | })
  118 | 
```