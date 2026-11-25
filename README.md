# Agora Dau

Le site du média étudiant Agora Dau. Pour voir la refonte, ouvre `index.html` à la racine. Le journal, la galerie, les photos et les fichiers audio se trouvent dans le dossier. Une connexion reste nécessaire pour les services externes comme Pages CMS ou FormSubmit.

## Mettre le contenu à jour

- **Pages CMS** reprend les champs existants et ajoute la collection Actualités, les extraits et les transcriptions.
- **Depuis le dépôt** modifie le Markdown dans `_analyses/`, `_actualites/` ou `_podcasts/`. Les médias audio vont dans `media/audio/`. Le guide décrit tous les champs.
- **Avec un assistant IA** donne-lui accès au dépôt selon les rôles du bureau. `AGENTS.md` renvoie au guide commun `AI-INSTRUCTIONS.md`. Si ton outil ne charge pas les consignes du dépôt, joins-lui ce guide ou indique-lui de le lire avant la mise à jour. Il regroupe les questions sur les éléments manquants et intègre les textes et médias validés par la rédaction.

## Copier le site pour le consulter hors ligne

Après une modification de contenu, exécute `npm ci`, puis `npm run build` avec Node.js 22 ou ultérieur. Le build génère les pages dans le dossier même. `npm run check` confirme que le dossier portable correspond aux sources et contrôle les chemins des médias.

Pour servir un aperçu HTTP local, lance `python -m http.server 8765 --bind 127.0.0.1`. Le lecteur du site fonctionne aussi depuis un fichier. L’installation de l’application et son cache hors connexion passent par un service worker sur HTTPS ou localhost.

## Dépôt de production

Cloudflare Pages sert les fichiers HTML générés à la racine de `main`. Tant que le projet Cloudflare est configuré sans commande de build, exécute `npm run build` après chaque modification du contenu ou des modèles et ajoute les pages générées au commit. La limite par fichier est de 25 Mio.

Cloudflare Pages exécute une fonction sur `/media/audio/*` pour répondre aux requêtes de lecture partielle et permettre d’avancer dans un épisode. Après l’ajout ou le remplacement d’un audio, `npm run build` met aussi à jour `functions/_lib/audio-sizes.js`.

Le dépôt reste compatible avec Jekyll. Les HTML portables générés sont exclus du build Jekyll pour laisser les modèles produire les mêmes adresses depuis les sources. Pour vérifier le rendu Jekyll sur un environnement Ruby compatible, utilise le Gemfile et `bundle exec jekyll build`.

La refonte est une livraison locale. Avant la mise en ligne, le bureau doit confirmer les autorisations des personnes visibles sur les photos, compléter les mentions légales signalées sur la page et vérifier la réception FormSubmit avec son adresse.

Voir `GUIDE-PUBLICATION.md` pour publier, `research/migration.md` pour les décisions de contenu et `CREDITS.md` pour les sources et licences.
