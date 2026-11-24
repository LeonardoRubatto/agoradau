## Intent
Faire entrer dans le média par ce qu’il produit, puis rendre possibles la lecture, l’écoute et la participation dès la première page.

## Directions
- A — Le micro ouvert · la table d’enregistrement de l’épisode de Rocinha · une image de studio dans l’ovale de la marque, traversée par le titre, ouvre trois chemins.
- B — La table d’impression · les affiches des analyses réalisées par Agora Dau · les pages du journal traversent une rotative en aplats crème.
- C — Le lieu de rencontre · les portraits des pôles et les photos de soirée · la page se lit comme une planche-contact, avec des passages du groupe à la rédaction.
Obvious version: slogan à gauche, photo à droite, trois cartes sous l’introduction.
Examined: captures du premier dessin aux deux tailles, trois essais typographiques de .source/compare.html, planche du studio, des portraits et de la soirée dans .source/hero-options.jpg.
Chosen: A — un vrai enregistrement, un micro et la forme du logo permettent de comprendre le média immédiatement. Les trois accès répondent à des intentions distinctes.

## Concept
L’ovale du logo Agora ouvre sur une photo d’Agora Dau en soirée. Sur téléphone, la prise de vue déborde jusqu’aux bords de l’écran et le hero occupe la hauteur disponible. Trois commandes changent le plan. Un lien souligné donne accès à la rubrique correspondante.
Swap test: il faudrait remplacer ensemble la forme héritée du logo, la prise de vue, le son réel du premier épisode et les documents de la rédaction.

## Signature
Dans le premier écran, le titre « À vous la parole » recouvre une partie de l’image du studio. Les touches au bord du cadre font apparaître l’affiche, le studio ou le bureau dans la même ouverture.

## Not this
La première version alignait un slogan et une photo à deux colonnes. Pas de triptyque de cartes, de numbered-index décoratif ni de révélation de chaque titre. Crème conservé pour le journal par fidélité à l’identité.

## Dials
- hero: full-bleed
- grid: broken
- nav: top-bar
- type-voice: wide
- type-scale: extreme
- surface: mixed
- color: one-accent
- image: collage
- motion: cinematic
- voice: plain

## Layout
Plateau plein cadre sombre, titre chevauchant la prise de vue, sélecteur de plans au bord de la scène. Le journal se lit en deux temps, l’affiche en grand puis les articles en liste. L’espace radio se compose à partir des prises de vue du studio. L’association présente son projet, ses formats, son bureau et ses archives visuelles. Les pages de service ont des compositions de lettre, de communiqué et de manuel.
Reference: reference/hugotoro-com | lesson: tenir une ouverture très typographique sur de l’image et faire du changement de fond un passage | fit: l’arrivée au journal après la prise de parole | avoid: introduction bloquante et vidéo en boucle
Reference: reference/insidy-com | lesson: travailler la rupture de surface et la taille des visuels selon le chapitre | fit: séparer lecture, écoute et participation | avoid: arches, lilas et diaporama automatique
Reference: reference/mbsdesign-fr | lesson: aligner les départs des images et préserver le rapport des affiches | fit: coupes littérales des couvertures | avoid: densité marchande et commandes flottantes
Reference: reference/helenelacombe-co | lesson: montrer les rubriques sous des intitulés courts à côté du signe de marque | fit: supprimer l’encadrement et le bouton générique de l’en-tête | avoid: menus mobiles cachés et page sans texte
Reference: reference/uchronia-fr | lesson: associer le fond d’une présentation à l’image réellement affichée | fit: tons des couvertures et aplats proches des prises de vue du studio | avoid: écran d’attente et fonds flous au défilement

## Type
Archivo Black pour la voix du premier écran, Barlow Condensed pour l’édition et Source Sans 3 pour les textes et commandes. Essais sur les mots éditoriaux et l’enregistrement réel.

## Color
Crème #F0EDE6 et encre #0A0A0A fournis. Rouge #FF3B30 pour les accents et la signalétique. Texte rouge dérivé à 28° OKLCH. La photo de soirée garde le bleu des néons. Une ombre locale donne le contraste au texte posé sur la photographie.

## Motion
160ms et 240ms pour interactions, 360ms pour la galerie et 560ms pour l’ouverture ovale sur changement de plan. Révélation des images sous la ligne de flottaison en 480ms quand leur parent arrive. Easing cubic-bezier(.22, 1, .36, 1). Rotation des plans après 7 secondes, pause visible, arrêt au focus et sans rotation en mouvement réduit. La lecture audio reste déclenchée au clic.
Grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120.

## Items
- architecture/csv-json-content-pipeline — contrat d’édition de type BDE adapté aux fichiers Markdown et à Jekyll.
- gallery-carousel/shapes-slideshow — masque ovale sur ordinateur et coupe horizontale sur téléphone, image sortante immobile et commandes au clavier.
- navigation/hover-grid — aperçu directionnel des sujets dans l’index détaillé du journal, au pointeur et au focus.
- navigation/scroll-index — progression et section active dans les lectures longues, liens d’ancre natifs.
- primitives/button-hover-styles — Hyperion conservé dans l’inversion du filet, typographie et fond adaptés au journal.
- scroll/sticky-sections — affiche accompagnant l’index sur bureau, dans le flux sans défilement forcé.
- example gallery-right-image — visionneuse plein écran sans panneau, flèches latérales en bureau et en bas sur téléphone, FLIP au clic, filtres et retour de focus.
- example section-transitions — dévoilement des images sous le plateau, sans retard pour les ancres et le focus.
- example text-over-image — contraste local sous le titrage. Sur téléphone, le titre s’imprime au pied de la photographie et la légende passe dans le flux.

Reference: The Lighthouse — une photographie bord à bord porte le titre de l’accueil mobile. ISANA Paris — la photographie rythme les changements de sujet. Le film d’Agora Dau alterne portrait de soirée sous les néons bleus, illustration d’un article et photo d’équipe. Les trois rubriques partagent une ligne typographique. Les formats de la rédaction prennent la forme d’un sommaire ouvert, en regard du titre sur ordinateur.

