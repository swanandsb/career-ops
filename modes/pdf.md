# Modo: pdf — Generación de PDF ATS-Optimizado

## Pipeline completo

1. Lee `cv.md` como fuentes de verdad
2. Pide al usuario el JD si no está en contexto (texto o URL)
3. Extrae 15-20 keywords del JD
4. Detecta idioma del JD → idioma del CV (EN default)
5. Detecta ubicación empresa → formato papel:
   - US/Canada → `letter`
   - Resto del mundo → `a4`
6. Detecta arquetipo del rol → adapta framing
7. Reescribe Professional Summary en 2-3 oraciones naturales (sin listas ni keyword dumping). Oracion 1: que hace la persona y donde lo ha hecho. Oracion 2: 1-2 resultados concretos con metricas. Oracion 3: senal de portfolio o trabajo tecnico relevante.
8. Selecciona top 3-4 proyectos más relevantes para la oferta
9. Dentro de cada rol, reordena bullets por relevancia al JD si aplica; **nunca** reordenes los bloques de trabajo: el orden de empresas/roles sigue siempre la fecha (paso obligatorio abajo).
10. Construye competency grid desde requisitos del JD (6-8 keyword phrases)
11. Inyecta keywords naturalmente en logros existentes (NUNCA inventa)
12. Genera HTML completo desde template + contenido personalizado
13. Lee `name` de `config/profile.yml` → normaliza a kebab-case lowercase (e.g. "John Doe" → "john-doe") → `{candidate}`
14. Escribe HTML a `/tmp/cv-{candidate}-{company}.html`
15. Ejecuta: `node generate-pdf.mjs /tmp/cv-{candidate}-{company}.html output/cv-{candidate}-{company}-{YYYY-MM-DD}.pdf --format={letter|a4}`
15. Reporta: ruta del PDF, nº páginas, % cobertura de keywords

## Reglas ATS (parseo limpio)

- Layout single-column (sin sidebars, sin columnas paralelas)
- Headers estándar: "Professional Summary", "Work Experience", "Education", "Skills", "Certifications", "Projects"
- Sin texto en imágenes/SVGs
- Sin info crítica en headers/footers del PDF (ATS los ignora)
- UTF-8, texto seleccionable (no rasterizado)
- Sin tablas anidadas
- Keywords del JD distribuidas: Summary (top 5), primer bullet de cada rol, Skills section
- **Work Experience (orden obligatorio):** los bloques `.job` deben listarse en **orden cronologico inverso estricto por fecha de inicio** (el rol mas reciente primero). Esta regla **anula** cualquier otro criterio (relevancia al JD, impacto, narrativa). No reordenar roles por keywords del JD.
- Visa: no incluir estado de visa en el CV (ni `{{SUMMARY_TEXT}}`, ni contacto, ni ninguna seccion). El candidato lo comenta en conversacion.
- Title aliasing: mantener el titulo original como principal y agregar 1-2 equivalentes estandar entre parentesis. Ejemplo: `Applied AI Consultant (AI Engineer / ML Engineer)`.
- Acronym expansion (primera aparicion): usar `Retrieval-Augmented Generation (RAG)`, `Large Language Model (LLM)`, `Model Context Protocol (MCP)`; en apariciones siguientes usar solo sigla.
- Bullet length: maximo 140 caracteres por bullet; si excede, dividir en dos bullets.
- One achievement per bullet: si un bullet une varias clausulas con `;` o `and`, partirlo en bullets separados. Maximo un metric / logro por bullet.
- Production keywords: en al menos 2 bullets en total (entre todos los roles), usar de forma genuina `production environment` o `production deployment` (no forzar si el trabajo no fue produccion).
- Skills additions: en la seccion Skills, incluir estas etiquetas si aun no aparecen (en lineas por categoria): `Vector Databases`, `Embeddings`, `Semantic Search`, `Model Evaluation`, `Scalable Systems`.
- Experience technologies line: despues de los bullets de cada rol, agregar una linea `Technologies: ...` autoextraida de los bullets.
- Project naming: agregar descripcion funcional entre parentesis despues del nombre del proyecto. Ejemplo: `OpenClaw Foundry (zero-trust multi-agent AI platform)`.
- Project bullets: cada proyecto como lista de 2-3 bullets (`<ul><li>...</li></ul>`), no parrafo unico; cada bullet = una decision tecnica o un resultado.
- Post-validacion: despues de escribir el HTML, ejecutar `node scripts/validate-resume.mjs /path/to/cv-....html` y corregir fallos antes de `generate-pdf.mjs`.

### Empresas tier-1 AI (Anthropic, OpenAI, etc.): ingenieria practica y fiabilidad

- Lenguaje de estrategia: evitar frases tipo "owned AI strategy", "set AI strategy", "drove strategy". Sustituir por verbos de ejecucion: "designed and deployed", "built and operated", "led implementation of", "shipped".
- Primer bullet del rol mas reciente: debe destacar sistemas en produccion, flujos LLM o sistemas agenticos con un resultado medible o comprobable. Sin abrebocas vagos ("focused on", "worked on" sin outcome).
- Senal de evaluation: incluir al menos un bullet (en cualquier rol) que mencione model evaluation, failure modes, fiabilidad (reliability), o guardrails, solo si hay trabajo real que lo respalde.
- Proyectos: evitar tono de marketing. No usar "not a demo", "production-grade showcase". Preferir "built for production use" o formulaciones sobre reliability cuando aplique.
- Skills: fusionar categorias redundantes; no crear seccion aparte (p. ej. "ML Fundamentals") si esos terminos ya estan en Applied AI / LLMs. Mantener visibles: LLMs, RAG, APIs, deployment, evaluation, vector databases, embeddings (segun verdad del CV).
- Tono: tecnico y basado en hechos. Sin superlativos, sin lenguaje comercial, sin autopromocion; que hablen metricas y decisiones tecnicas.

## Diseño del PDF

- **Fonts**: Space Grotesk (headings, 600-700) + DM Sans (body, 400-500)
- **Fonts self-hosted**: `fonts/`
- **Header**: nombre en Space Grotesk 24px bold + línea gradiente `linear-gradient(to right, hsl(187,74%,32%), hsl(270,70%,45%))` 2px + fila de contacto
- **Section headers**: Space Grotesk 13px, uppercase, letter-spacing 0.05em, color cyan primary
- **Body**: DM Sans 11px, line-height 1.5
- **Company names**: color accent purple `hsl(270,70%,45%)`
- **Márgenes**: 0.6in
- **Background**: blanco puro

## Orden de secciones (optimizado "6-second recruiter scan")

1. Header (nombre grande, gradiente, contacto, link portfolio)
2. Professional Summary (2-3 oraciones naturales: rol/contexto, resultados con metricas, portfolio signal)
3. Skills (lineas por categoria, sin pills ni grid)
4. Work Experience (cronologico inverso **por fecha de inicio**; sin excepciones)
5. Projects
6. Education
7. Certifications

## Estrategia de keyword injection (ético, basado en verdad)

Ejemplos de reformulación legítima:
- JD dice "RAG pipelines" y CV dice "LLM workflows with retrieval" → cambiar a "RAG pipeline design and LLM orchestration workflows"
- JD dice "MLOps" y CV dice "observability, evals, error handling" → cambiar a "MLOps and observability: evals, error handling, cost monitoring"
- JD dice "stakeholder management" y CV dice "collaborated with team" → cambiar a "stakeholder management across engineering, operations, and business"

**NUNCA añadir skills que el candidato no tiene. Solo reformular experiencia real con el vocabulario exacto del JD.**

## Template HTML

Usar el template en `cv-template.html`. Reemplazar los placeholders `{{...}}` con contenido personalizado:

| Placeholder | Contenido |
|-------------|-----------|
| `{{LANG}}` | `en` o `es` |
| `{{PAGE_WIDTH}}` | `8.5in` (letter) o `210mm` (A4) |
| `{{NAME}}` | (from profile.yml) |
| `{{PHONE}}` | (from profile.yml — include with its separator only when `profile.yml` has a non-empty `phone` value; omit both `<span>` and `<span class="separator">` otherwise) |
| `{{EMAIL}}` | (from profile.yml) |
| `{{LINKEDIN_URL}}` | [from profile.yml] |
| `{{LINKEDIN_DISPLAY}}` | [from profile.yml] |
| `{{PORTFOLIO_URL}}` | [from profile.yml] (o /es según idioma) |
| `{{PORTFOLIO_DISPLAY}}` | [from profile.yml] (o /es según idioma) |
| `{{LOCATION}}` | [from profile.yml] |
| `{{SECTION_SUMMARY}}` | Professional Summary / Resumen Profesional |
| `{{SUMMARY_TEXT}}` | Summary de 2-3 oraciones naturales (rol/contexto, metricas, portfolio signal; sin listas de terminos) |
| `{{SECTION_EXPERIENCE}}` | Work Experience / Experiencia Laboral |
| `{{EXPERIENCE}}` | HTML de cada trabajo con bullets reordenados |
| `{{SECTION_PROJECTS}}` | Projects / Proyectos |
| `{{PROJECTS}}` | HTML de proyectos con nombre + descripcion funcional en parentesis |
| `{{SECTION_EDUCATION}}` | Education / Formación |
| `{{EDUCATION}}` | HTML de educación |
| `{{SECTION_CERTIFICATIONS}}` | Certifications / Certificaciones |
| `{{CERTIFICATIONS}}` | HTML de certificaciones |
| `{{SECTION_SKILLS}}` | Skills / Competencias |
| `{{SKILLS}}` | HTML de skills en lineas por categoria |

## Canva CV Generation (optional)

If `config/profile.yml` has `canva_resume_design_id` set, offer the user a choice before generating:
- **"HTML/PDF (fast, ATS-optimized)"** — existing flow above
- **"Canva CV (visual, design-preserving)"** — new flow below

If the user has no `canva_resume_design_id`, skip this prompt and use the HTML/PDF flow.

### Canva workflow

#### Step 1 — Duplicate the base design

a. `export-design` the base design (using `canva_resume_design_id`) as PDF → get download URL
b. `import-design-from-url` using that download URL → creates a new editable design (the duplicate)
c. Note the new `design_id` for the duplicate

#### Step 2 — Read the design structure

a. `get-design-content` on the new design → returns all text elements (richtexts) with their content
b. Map text elements to CV sections by content matching:
   - Look for the candidate's name → header section
   - Look for "Summary" or "Professional Summary" → summary section
   - Look for company names from cv.md → experience sections
   - Look for degree/school names → education section
   - Look for skill keywords → skills section
c. If mapping fails, show the user what was found and ask for guidance

#### Step 3 — Generate tailored content

Same content generation as the HTML flow (Steps 1-11 above):
- Rewrite Professional Summary with JD keywords + exit narrative
- Reorder experience bullets by JD relevance
- Select top competencies from JD requirements
- Inject keywords naturally (NEVER invent)

**IMPORTANT — Character budget rule:** Each replacement text MUST be approximately the same length as the original text it replaces (within ±15% character count). If tailored content is longer, condense it. The Canva design has fixed-size text boxes — longer text causes overlapping with adjacent elements. Count the characters in each original element from Step 2 and enforce this budget when generating replacements.

#### Step 4 — Apply edits

a. `start-editing-transaction` on the duplicate design
b. `perform-editing-operations` with `find_and_replace_text` for each section:
   - Replace summary text with tailored summary
   - Replace each experience bullet with reordered/rewritten bullets
   - Replace competency/skills text with JD-matched terms
   - Replace project descriptions with top relevant projects
c. **Reflow layout after text replacement:**
   After applying all text replacements, the text boxes auto-resize but neighboring elements stay in place. This causes uneven spacing between work experience sections. Fix this:
   1. Read the updated element positions and dimensions from the `perform-editing-operations` response
   2. For each work experience section (top to bottom), calculate where the bullets text box ends: `end_y = top + height`
   3. The next section's header should start at `end_y + consistent_gap` (use the original gap from the template, typically ~30px)
   4. Use `position_element` to move the next section's date, company name, role title, and bullets elements to maintain even spacing
   5. Repeat for all work experience sections
d. **Verify layout before commit:**
   - `get-design-thumbnail` with the transaction_id and page_index=1
   - Visually inspect the thumbnail for: text overlapping, uneven spacing, text cut off, text too small
   - If issues remain, adjust with `position_element`, `resize_element`, or `format_text`
   - Repeat until layout is clean
d. Show the user the final preview and ask for approval
e. `commit-editing-transaction` to save (ONLY after user approval)

#### Step 5 — Export and download PDF

a. `export-design` the duplicate as PDF (format: a4 or letter based on JD location)
b. **IMMEDIATELY** download the PDF using Bash:
   ```bash
   curl -sL -o "output/cv-{candidate}-{company}-canva-{YYYY-MM-DD}.pdf" "{download_url}"
   ```
   The export URL is a pre-signed S3 link that expires in ~2 hours. Download it right away.
c. Verify the download:
   ```bash
   file output/cv-{candidate}-{company}-canva-{YYYY-MM-DD}.pdf
   ```
   Must show "PDF document". If it shows XML or HTML, the URL expired — re-export and retry.
d. Report: PDF path, file size, Canva design URL (for manual tweaking)

#### Error handling

- If `import-design-from-url` fails → fall back to HTML/PDF pipeline with message
- If text elements can't be mapped → warn user, show what was found, ask for manual mapping
- If `find_and_replace_text` finds no matches → try broader substring matching
- Always provide the Canva design URL so the user can edit manually if auto-edit fails

## Post-generación

Actualizar tracker si la oferta ya está registrada: cambiar PDF de ❌ a ✅.
