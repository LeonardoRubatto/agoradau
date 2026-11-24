# Publier sur Agora Dau

Ouvre [Pages CMS](https://app.pagescms.org/) avec ton compte GitHub et sélectionne le dépôt Agora Dau. Pour un accès éditeur, transmets ton identifiant GitHub au bureau en passant par l’espace rédaction.

## Article ou analyse

Dans **Analyses**, crée un article. Complète le titre, le chapô, l’auteur, la date, l’image de couverture et la description. Utilise les titres de niveau 2 pour les parties, les citations pour les passages cités et le champ Sources pour les références. Renseigne le texte alternatif si l’image apporte une information.

Dans le dépôt, une analyse est un fichier Markdown de `_analyses/`. Choisis un nom sans accent, en minuscules, séparé par des tirets. Conserve le nom et le champ `permalink` d’une publication déjà publiée pour préserver son lien. Le contenu figure sous le second séparateur `---` ou dans le champ `body` existant.

## Actualité de l’association

Utilise **Actualités** dans Pages CMS ou ajoute un fichier dans `_actualites/`. Champs nécessaires pour l’édition : `title`, `dek`, `author`, `date` et le texte. L’image est facultative. L’actualité apparaît dans le journal, dans le filtre Vie de l’asso et dans le sitemap. Le classement est du plus récent au plus ancien.

## Épisode et extraits audio

1. Ajoute le fichier à **Audio**, ou dépose-le dans `media/audio/`. Le MP3 est préférable pour la compatibilité. M4A, WAV, OGG et OGA sont également acceptés. Le nom doit être simple, sans espaces ni accents. Cloudflare Pages accepte jusqu’à 25 Mio par fichier. Vise moins de 24 Mio par épisode ou extrait.
2. Dans **Podcasts**, renseigne le titre, le numéro unique, la date, le chapô et le fichier. Ajoute les invité·es, la durée et les notes selon les éléments disponibles.
3. Pour un extrait, ouvre le même épisode puis ajoute un élément dans **Extraits** avec son titre et son fichier. Durée et transcription sont facultatives. Chaque extrait dispose de son propre lecteur.

Dans le dépôt, un fichier Markdown de `_podcasts/` peut contenir les champs suivants. Remplace les exemples par les informations fournies par la rédaction.

```yaml
---
title: "Titre fourni par la rédaction"
episode: 2
date: 2026-11-24
dek: "Chapô fourni avec l’épisode"
duration: "32 min"
audio: /media/audio/episode-02.mp3
excerpts:
  - title: "Titre de l’extrait validé"
    audio: /media/audio/episode-02-extrait.mp3
    duration: "1 min"
---
Notes validées de l’épisode.
```

L’interface utilise le lecteur natif si aucune forme d’onde n’a été préparée. Avec FFmpeg installé, `npm run waveform -- media/audio/episode-02.mp3` ajoute les échantillons du fichier à `_data/waveforms.json`. Les transcriptions validées peuvent être ajoutées au niveau de l’épisode ou de chaque extrait.

## Vérifier

Pour rafraîchir la copie locale, lance `npm run build`, puis `npm run check`. Ouvre ensuite l’accueil et la nouvelle publication ou l’épisode. Vérifie le son, les liens, la couverture et les métadonnées. Les membres gardent les mêmes champs dans Pages CMS. La charte éditoriale s’applique à tout article, visuel et transcription.
