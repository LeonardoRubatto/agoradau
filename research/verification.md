# Vérification de la refonte

## Contenus et publication

- L’inventaire relie les pages historiques, les citations, les textes des formats et pôles, l’épisode, les visuels et les 23 photos du Drive à leurs destinations. Le contrôle `inventory.mjs check` passe.
- Les modèles source conservent les cinq routes `/analyses/…/`, les pages Charte, Newsletter, Espace rédaction et App et le sitemap. Le texte de l’introduction, des formats, du recrutement et du podcast provient du site d’Agora Dau.
- Dans une copie isolée, l’ajout d’une actualité a produit sa page, son entrée dans le journal, son filtre, son URL de sitemap et sa route dans l’application. Un MP3 de test de quatre secondes a été lu dans le lecteur d’extraits. Aucun contenu de test ne figure dans la copie à remettre.
- Le build portable `npm run build` et son contrôle de fidélité `npm run check` passent. L’architecture Jekyll conserve les collections et les champs de Pages CMS. L’exécution de Jekyll natif sur ce poste a été bloquée par la stratégie Windows de chargement de Ruby. Aucun build GitHub Pages ni déploiement n’a été lancé.

## Rendu et interactions

- Ouverture directe depuis le HTML à la racine dans Chromium, puis contrôle des pages à 320, 390, 768 et 1 440 px selon le type de page. Les sources affichées sont des images locales et les polices sont livrées avec le site.
- Rotation du hero avec pause, sélection et clavier. Vérification en mouvement réduit. Lecture et pause depuis l’accueil. Les notes et les sources se déplient au clavier.
- Contrôle des 17 liens de la galerie. Chacun ouvre l’image qui lui correspond. Vérification du filtre, de la flèche de progression, d’Échap et du retour du focus. Captures de la visionneuse au format de la fenêtre dans `qa/visionneuse-390.png` et `qa/visionneuse-1440.png`.
- Recherche du journal testée par auteur et sujet sans accent, puis sans résultat. Progression et section courante testées dans un article long. Les observations des deux revues graphiques ont conduit à réécrire la une, alléger la navigation, revoir les couvertures, corriger la colonne mobile et distinguer la rotation des images de l’écoute.
- La PWA a activé son service worker sur localhost et retrouvé sa vue podcast après rechargement en mode hors connexion. Le test FormSubmit a simulé les réponses succès et erreur sans envoyer de message. La réception réelle reste à valider lors de la mise en service.
- Les couples texte et fond principaux ont été calculés en WCAG et APCA. Le texte courant crème/encre atteint 16,93:1 et Lc 95,3. Le rouge de texte sur crème atteint 6,36:1 et Lc 73,4. Le contour interactif du filtre atteint 3,88:1 sur crème.

## Périmètre du contrôle statique

Le scanner portable relève l’appel AJAX des deux formulaires et les requêtes internes du service worker. Le premier est réservé à la soumission sur une origine HTTP et le second à l’application installable. Le site et les lecteurs ont été ouverts à partir de `file://`, où ces chemins de code restent désactivés. Le crème suit explicitement le brief de l’association.

Avant publication, le bureau doit confirmer les autorisations de diffusion des photos et compléter les champs signalés dans les mentions légales. La transcription de l’épisode d’origine reste à fournir par la rédaction.

