# Agora Dau

Le site du média étudiant Agora Dau. Pour voir la refonte, ouvre `index.html` à la racine. Le journal, la galerie, les photos et les fichiers audio se trouvent dans le dossier. Une connexion reste nécessaire pour les services externes comme Pages CMS ou FormSubmit.

## Mettre le contenu à jour

- **Pages CMS** reprend les champs existants et ajoute la collection Actualités, les extraits et les transcriptions.
- **Depuis le dépôt** modifie le Markdown dans `_analyses/`, `_actualites/` ou `_podcasts/`. Les médias audio vont dans `media/audio/`. Le guide décrit tous les champs.
- **Pour Claude ou un autre assistant** donne-lui un accès au dépôt selon les rôles du bureau et indique-lui de lire `AI-INSTRUCTIONS.md`. Fournis les textes et les médias prêts à publier.

## Copier le site pour le consulter hors ligne

Après une modification de contenu, exécute `npm ci`, puis `npm run build` avec Node.js 22 ou ultérieur. Le build génère les pages dans le dossier même. `npm run check` confirme que le dossier portable correspond aux sources et contrôle les chemins des médias.

Pour servir un aperçu HTTP local, lance `python -m http.server 8765 --bind 127.0.0.1`. Le lecteur du site fonctionne aussi depuis un fichier. L’installation de l’application et son cache hors connexion passent par un service worker sur HTTPS ou localhost.

## Dépôt de production

Le site actuel est configuré pour GitHub Pages à la racine de `main`, avec Jekyll et le domaine `agoradau.fr`. Les collections et les modèles Liquid de ce dossier sont destinés à ce même circuit. Les HTML portables générés sont exclus du build Jekyll pour laisser les modèles produire les mêmes adresses depuis les sources. Conserve le fichier `CNAME`. Pour valider avec le moteur de production sur un environnement Ruby compatible, utilise le Gemfile et `bundle exec jekyll build`.

La refonte est une livraison locale. Avant la mise en ligne, le bureau doit confirmer les autorisations des personnes visibles sur les photos, compléter les mentions légales signalées sur la page et vérifier la réception FormSubmit avec son adresse.

Voir `GUIDE-PUBLICATION.md` pour publier, `research/migration.md` pour les décisions de contenu et `CREDITS.md` pour les sources et licences.
