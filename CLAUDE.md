# liquid-glass-dashboard-kit — contexte pour Claude Code

Écrit à la création du dépôt (2026-11-20), pour qu'une session ouverte ici parte de ce qui a été
décidé au lieu de le redécouvrir.

## Ce que ce dépôt est

Une **couche de thème** « Liquid glass » par-dessus `@michaelthomasjach/liseuse-dashboard-kit`, plus la
vitrine qui la montre. Même architecture, mêmes règles que `../minimal-dashboard-kit` (dont ce dépôt
est parti, et dont le `CLAUDE.md` détaille la décision : couche de thème plutôt que bibliothèque
réécrite ou troisième palette du kit). Le kit garde la logique ; ici on ne décide que de l'apparence.

Demande de Michael (2026-11-20) : « une nouvelle librairie graphique dans ce style Liquid glass, avec
les mêmes composants que liseuse-dashboard-kit, de manière à ce que quand je fais une modification sur
la lib de base elle soit répercutée ». Références visuelles : tableaux de bord crypto en verre fumé
(CryptoNest, ORVIX), sélecteurs de jeton en verre sur fond vert (ZenChain), cartes de verre clair sur
fond bleu (fleur, « Refer & Earn »).

## Comment la couche tient

- `src/theme/liquid-glass.css` redéfinit les variables `--lq-*` sous `.lgk.lq-root[data-lq-palette][data-lq-surface="…"]`
  (0,4,0) et `.lgk.lq-root` (0,2,0) : strictement plus spécifique que le kit, quel que soit l'ordre des imports.
- La classe `lgk` est posée par `LiquidGlassTheme` (`src/theme/index.tsx`), seul point d'entrée.
- Le flou vient de `--lq-surface-backdrop`, variable **ajoutée au kit pour ce thème** (v0.314.0) et lue
  en `backdrop-filter` par Panel, Card, Modal, Popover, ContextMenu et la barre latérale. `none` par défaut.
- Le fond que le verre floute est porté par la racine du thème (`--lgk-backdrop`, ou la prop `backdrop`).
  `SidebarLayout` / `HeaderLayout` y sont rendus transparents (ils peignent `--lq-color-bg` dans le kit).
- Règles hors variables, toutes commentées dans la feuille : fond de racine, gabarits transparents,
  barre de tête collante en verre, liens, verre plus dense pour ce qui flotte (`--lgk-color-float`),
  encre pleine pour l'infobulle (elle écrit son texte en `--lq-color-panel`), repli opaque sans
  `backdrop-filter` ou avec `prefers-reduced-transparency`.
- v0.2.0 (2026-11-20, demande de Michael sur une capture Dribbble de menu en verre) : la barre
  latérale `rail` devient un **îlot flottant** (12 px des bords, rayon 28 px, flou 36 px), dont la
  **largeur** s'anime (le kit, lui, décale la barre par `transform`, ce qui couperait un îlot arrondi) ;
  vignettes passées à gauche des libellés par `order` ; l'épingle devient la pastille « » / « »
  accrochée au bord. La barre haute flotte aussi. `SearchOverlay` : voile de verre épais
  (`--lgk-veil`, flou 48 px) parce que le voile du kit (panneau à 95 %) laissait lire la page à
  travers. Le « liseré liquide » (`--lgk-rim`, anneau de dégradé masqué) et la nappe `--lgk-sheen`
  sont réservés à ces surfaces-marques. Ce sont des règles d'anatomie sur des classes `.lq-…` du kit,
  écrites ici parce qu'elles ne changent que la forme (aucun comportement) : si le kit change la
  structure de `SidebarLayout` ou de `SearchOverlay`, revérifier ces deux sections.
- v0.3.0 (2026-11-20, « encore plus liquid glass ») : tout le kit passe au verre, pas seulement les
  surfaces. Section « v0.3 » en fin de `liquid-glass.css` : matière par surface (`--lgk-glass-*`
  bombé, `--lgk-well*` creusé, `--lgk-thumb*` goutte claire, `--lgk-gloss` reflet du verre teinté,
  `--lgk-surface-sheen` nappe des surfaces) ; boutons en pilule de verre, pleins en verre teinté qui
  rayonne ; champs en puits (erreur/succès gardent la couleur du kit) ; contrôle segmenté et bouton
  enfoncé d'un `ButtonGroup` en goutte claire (pas en accent : le texte du groupe y serait illisible) ;
  interrupteur/case/radio/curseur bombés ; puces givrées ; traînée de lumière sur la ligne survolée ;
  infobulle en verre fumé ; voile flou des modales ; colonne d'outils et boutons des graphiques en
  verre. Ombres de verre et flou des surfaces renforcés (30 px, 190 %). Base en `:where()` pour que
  les états du kit gardent la main. Fond du tracé des graphiques laissé opaque (lisibilité).
- v0.4.0 (2026-11-21, « effet goutte d'eau », d'après des maquettes d'apps mobiles en verre) : section
  « v0.4 » en fin de `liquid-glass.css`. Fond en grandes nappes saturées (rouge, orange, sarcelle,
  violet ; pastels en clair), accent corail (`#ff7a45` encre `#1c0a04` en sombre, `#d9472b` en clair).
  Chaque carte / panneau / carte de position est teinté de l'intérieur par deux lueurs
  (`--lgk-glow-a/b`, tirées de `--lgk-glow-1…4`, qui tournent avec `:nth-child(4n+…)`), rayonne
  derrière elle en ombres colorées (`--lgk-halo`) et porte le ménisque `--lgk-drop-rim` (arête haute
  vive + lueur qui remonte du bas). Une surface dans une surface ne garde que le ménisque. Tout en
  ombres et dégradés : aucun pseudo-élément ni changement de position. Icônes seules en gouttes
  rondes, boutons pleins qui rayonnent, puce choisie allumée à l'accent. Rayon des cartes 28 px.
  Téléphone (≤ 900 px) : barre du menu et barre haute en îlots flottants floutés, tiroir du menu en
  îlot par-dessus les barres (fermé en touchant le voile), flou ramené à 20 px, fond qui défile
  (Safari iOS ignore `background-attachment: fixed`). Débordements de la carte du monde et de
  `HoldingCard` corrigés dans le kit (0.315.1). Vitrine : barre haute resserrée et grilles en
  `minmax(min(Npx, 100%), 1fr)` pour tenir dans 390 px. Contrôle : `scrollWidth` = 390 sur tous les
  écrans de la vitrine.
- Dépendance au kit en `>=0.314.0 <1.0.0` (et non `^`, qui sur 0.x verrouille la mineure) : un
  `npm update` reprend chaque nouvelle version du kit.

## Règles de frontière (identiques à minimal)

| Ce dont il s'agit | Où ça va |
|---|---|
| Logique d'un composant, correctif, composant manquant, variable manquante | **le kit**, `../Dashboard liseuse` |
| Couleur, rayon, espacement, ombre, flou | ici, `src/theme/liquid-glass.css` |
| Écran, navigation, données de démonstration | ici, `src/showcase/` |

Aucun contournement local d'un manque du kit : s'il manque une variable, on l'ajoute au kit (c'est ce
qui a été fait pour `--lq-surface-backdrop`).

## Le langage visuel

Sombre (défaut) : fond `#0b0c12` sous de grandes nappes rouge, orange, sarcelle et violet ; verre
`rgba(255,255,255,.06)` teinté par deux lueurs, liseré `rgba(255,255,255,.15)`, ménisque
`--lgk-drop-rim` ; texte `#f3f6fb` ; accent corail `#ff7a45` (encre `#1c0a04`). Clair : nappes
corail, ambre, lagon et lilas sur fond nacré ; verre `rgba(255,255,255,.42)` ; texte `#0f172a` ;
accent `#d9472b`. Rayons 12 / 16 / 28 px (24 sur téléphone), contrôles de 40 px, Inter partout en
casse de phrase (pas de Montserrat ni de capitales espacées).

## Publication et état

- Dépôt : https://github.com/michaelthomasjach/liquid-glass-dashboard-kit (branche `master`), créé par
  l'API GitHub avec `GITHUB_TOKEN` (`gh` n'est pas installé).
- Paquet : `@michaelthomasjach/liquid-glass-dashboard-kit` sur GitHub Packages, v0.1.0 le 2026-11-20.
  `npm run build:lib` puis `npm publish --ignore-scripts` (depuis PowerShell, où `GITHUB_TOKEN` est exporté).
- Dépôt public depuis le 2026-11-20 (créé privé : la création publique avait été refusée par un
  contrôle de sécurité). Le **paquet**, lui, garde la visibilité de sa première publication (privée) :
  elle ne se change que dans l'interface de GitHub (réglages du paquet), aucune API ne le permet.
- Storybook et vitrine en ligne : https://michaelthomasjach.github.io/liquid-glass-dashboard-kit/
  (vitrine sous `/vitrine/`), par `.github/workflows/deploy-pages.yml`, à chaque push sur master,
  chaque nuit et sur `repository_dispatch` `kit-updated`.
- Ce workflow tourne sur le **runner auto-hébergé du VPS** (Michael l'a demandé : pas de runners
  hébergés de GitHub). Conteneur `mr-runner-liquid-glass` (image `mr-gh-runner`, volumes
  `mr-runner-liquid-glass-state` / `-work`, étiquette `vps`), lancé à la main par `docker run`, **sans**
  le socket Docker (inutile pour construire un site statique). Dépôt public, donc : aucun déclencheur
  `pull_request`, et approbation exigée pour tout workflow d'un contributeur extérieur
  (`fork-pr-contributor-approval` = `all_external_contributors`).
- Vérifié à la création : vitrine construite et rendue dans Edge headless, surfaces sombre et claire
  (Vue d'ensemble, Tableaux, Formulaires) ; captures dans `docs/images/`.

## Conventions

- `npm install` a besoin de `GITHUB_TOKEN` ; `.npmrc` garde `${GITHUB_TOKEN}`, jamais un vrai jeton.
- Commits en conventional commits, corps en français ; on commite et pousse à la fin de chaque tâche.
- Michael écrit en français et attend des réponses en français.
- Vérifier un changement visuel dans un vrai navigateur, pas seulement au typecheck.
