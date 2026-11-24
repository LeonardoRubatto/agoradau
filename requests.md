# Requests

The register of what was asked for this project: one entry per request, with its target and the proof that it was done.
Managed by `node C:/.Leonardo/Project/design system (website elements template)/scripts/requests.mjs` (add, replace, verify, check); hand edits are fine if each entry keeps its `## R-nnn · status · title` heading and its `- key: value` lines.
Statuses: `active` (to do), `waiting` (blocked on something outside), `verified` (proof recorded), `replaced` (a later request supersedes it), `dropped`.

## R-001 · verified · Refondre dans le dossier, avec le design system et tous les contenus existants
- asked: 2026-11-24 · by Leonardo
- target: Site Agora Dau
- request: Refondre dans le dossier, avec le design system et tous les contenus existants
- done-when: Pages statiques générées et vérifiées, inventaire relié
- proof: research/verification.md sha256:b49c5377e0c2e511
- note: verified 2026-11-24

## R-002 · verified · Reprendre le hero, le défilement automatique, les boutons et l’en-tête léger. R…
- asked: 2026-11-24 · by Leonardo
- target: Accueil et pages intérieures
- request: Reprendre le hero, le défilement automatique, les boutons et l’en-tête léger. Réécrire les compositions intérieures.
- done-when: Captures et tests d’interaction
- proof: qa/layout-final.json sha256:a6c81008235508dd
- note: verified 2026-11-24

## R-003 · verified · Employer la composition gallery-right-image du design system
- asked: 2026-11-24 · by Leonardo
- target: Visionneuse photo
- request: Employer la composition gallery-right-image du design system
- done-when: Déroulé vérifié pour chaque vignette et capture du dialogue
- proof: qa/interactions-final.json sha256:d88fb2dffc7aab0b
- note: verified 2026-11-24

## R-004 · verified · Faciliter les articles, actualités et extraits depuis le dépôt
- asked: 2026-11-24 · by Leonardo
- target: Édition
- request: Faciliter les articles, actualités et extraits depuis le dépôt
- done-when: Test d’ajout isolé et guide d’édition
- proof: qa/services-et-extrait.json sha256:89ba5ef6d683a0a9
- note: verified 2026-11-24
