# Mettre à jour les contenus d’Agora Dau

Ce guide s’adresse à tout assistant IA chargé d’une mise à jour d’Agora Dau. Lis `GUIDE-PUBLICATION.md` et un fichier existant du même type avant toute modification.

## Éléments à recueillir avant l’intégration

Si une demande est courte, commence par relever les informations déjà présentes dans le message, les pièces jointes et les fichiers que la rédaction désigne. Demande en un seul message les éléments indispensables qui manquent. Si tous sont fournis, commence l’intégration. Pour une correction, demande seulement l’identification du contenu et les modifications souhaitées lorsque ces informations manquent.

| Demande | Éléments indispensables | Éléments à demander s’ils s’appliquent |
| --- | --- | --- |
| Ajouter une analyse ou un article | Titre, texte final, auteur·rice, date de publication, chapô, description pour le partage et image de couverture validée | Texte alternatif d’une image informative, crédit et légende des visuels, sources citées, rubrique ou partenaire |
| Ajouter une actualité | Titre, texte final, auteur·rice, date et chapô | Visuel validé, texte alternatif et crédit, lien utile ou description pour le partage |
| Ajouter un épisode | Titre, numéro unique, date, accroche et fichier audio final pour une écoute directe, ou lien d’écoute validé pour une publication externe uniquement | Invité·es, couverture, notes, transcription et autres liens d’écoute. Calcule la durée à partir du fichier quand il est disponible. |
| Ajouter un extrait | Épisode concerné, titre de l’extrait et fichier audio final | Transcription validée. Calcule la durée à partir du fichier quand il est disponible. |
| Ajouter une photo à la galerie | Fichier validé et description de ce qu’il montre, ou titre et texte alternatif fournis | Crédit, légende ou catégorie si la rédaction les impose |

Si la demande « ajouter un article » désigne manifestement une annonce ou un compte rendu de l’association, utilise la collection Actualités. Si le choix de collection reste ambigu et change la page de publication, demande une précision. Propose les champs facultatifs pertinents en les signalant comme tels. Pour chaque audio, vérifie la limite Cloudflare Pages de 25 Mio par fichier.

## Fichiers à modifier

| Demande | Source à modifier |
| --- | --- |
| Ajouter ou corriger un article | `_analyses/nom-de-l-article.md` |
| Ajouter une actualité | `_actualites/nom-de-l-actualite.md` |
| Ajouter un épisode | `_podcasts/nom-de-l-episode.md` et `media/audio/` |
| Ajouter un extrait | Liste `excerpts` de l’épisode et `media/audio/` |
| Changer l’article à la une | Champ `featured` dans `_data/site.yml` |
| Ajouter ou retirer une photo de l’association | `_data/galerie.yml`, médias et variantes dans `assets/photos/` |

La rédaction fournit et valide les textes, informations de publication, transcriptions et médias. La charte d’Agora Dau interdit la production éditoriale par IA. L’assistance sert à intégrer les fichiers, remplir les métadonnées fournies et vérifier les pages.

Pour une mise à jour de contenu, garde les URL existantes, les noms de champs Pages CMS et les modèles partagés. Ne modifie un HTML généré qu’en régénérant le site avec `npm run build`. Vérifie avec `npm run check` et ouvre la page concernée. Une mise en ligne sur `main` doit être demandée par une personne autorisée.
