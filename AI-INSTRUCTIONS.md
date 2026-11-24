# Mettre à jour les contenus d’Agora Dau

Lis `GUIDE-PUBLICATION.md` et un fichier existant du même type avant toute modification.

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
