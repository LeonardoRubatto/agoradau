## Publications Agora Dau

Pour toute demande d’ajout, de correction ou de publication de contenu, lis `AI-INSTRUCTIONS.md` et suis la liste des éléments à recueillir pour la demande en cours. Ce mode d’emploi s’applique à tout assistant qui travaille sur le dépôt.

<!-- design-memory:begin -->
## Design Memory

Library: `C:/.Leonardo/Project/design system (website elements template)`. Before any front-end work read its `AGENTS.md` (skill `design-memory`). Search for ingredients and design references (`references/`, evidence and principles, no code); read `rules/reference-analysis.md` for their use. Declare selected references in the plan and compare saved captures during critique.

**Contract — say it in your first reply, then follow it.** State: the stack (static HTML/CSS/JS unless the brief says otherwise; refuse a starter such as `npm create …`, Next or vinext that conflicts with the requested delivery), where the HTML files live, whether it must open by double-click (`file://`), the languages, the pages. The user corrects it in one line.

**Commands** (run from this folder, by absolute path):
- `node "C:/.Leonardo/Project/design system (website elements template)/scripts/search.mjs" "<need>" --static` · `plan.mjs` · `tokens.mjs`
- `node "C:/.Leonardo/Project/design system (website elements template)/scripts/requests.mjs" list` — the register of what was asked (`requests.md`). Read it after any context compaction and before saying "done".
- `node "C:/.Leonardo/Project/design system (website elements template)/scripts/check-site.mjs" <published-folder> [--portable-root]`, then `browser-check.mjs` (real browser: overflow, console, fonts, cold first visit, interactions).
- `node "C:/.Leonardo/Project/design system (website elements template)/scripts/compare.mjs"` — put fonts, colours and a composition in front of the client before building the site.

"Corrected" from an agent is a claim; a saved check output, screenshot or commit is the proof. Hooks, where installed, are advisory reminders; the commands above are the check that works in every engine.
<!-- design-memory:end -->
