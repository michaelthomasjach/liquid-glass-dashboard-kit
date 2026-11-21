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

### v1 (2026-11-21) — refonte complète

Michael n'aimait pas le rendu « verre » des 0.x (« c'est vraiment pas joli ») et a demandé de **tout
refaire et de changer la manière dont c'est réalisé**, d'après quatre références : « Organized. »
(trois panneaux photo arrondis sur fond sombre, bouton pilule blanc), « Bespoke Architecture Studio »
(carrousel incurvé), « Space Voyage » (menu en pilule en haut à droite, liste flottante à gauche avec un
point sur l'entrée active), « The Next Layer of Intelligence » (contenu décollé des bords de la fenêtre
par un liseré, coins arrondis). Sobre mais moderne, boutons arrondis, police moderne, menu du haut qui ne
prend pas toute la largeur, menu flottant à gauche, contenu décollé des bords.

- **Variables d'abord.** L'ancienne feuille (`liquid-glass.css`, 1 569 lignes de verre, lueurs, ménisques)
  est supprimée. Trois feuilles : `src/theme/tokens.css` (les variables `--lq-*`, y compris les
  optionnelles listées en fin du `tokens.css` du kit), `shell.css` (cadre, îlots du menu du haut,
  `FloatingNav`, rail, ce qui flotte), `details.css` (pilules des boutons / onglets / contrôle segmenté,
  matière des champs). Règles de base en `:where(.lgk)` pour que les états du kit gardent la main.
- Sélecteurs : `.lgk.lq-root[data-lq-palette][data-lq-surface="…"]` (0,4,0) et `.lgk.lq-root` (0,2,0),
  strictement plus spécifiques que le kit quel que soit l'ordre des imports.
- **Cadre** : `LiquidGlassTheme frame` (défaut true) rend `.lgk-canvas` (marge du liseré) et
  `.lgk-bezel`, anneau `position: fixed` qui peint le liseré par une ombre portée de 100vmax autour d'un
  rectangle arrondi transparent (z-index 1980 : sous les modales, au-dessus du contenu). Le défilement
  reste celui de la fenêtre. Couper le cadre (`frame={false}`) pour un thème posé dans une page (pages
  Docs du Storybook, aperçus intégrés). Ne pas réutiliser le nom de classe `lgk-frame` : la vitrine
  l'emploie déjà pour ses cadres à hauteur fixe.
- **Coquille prévue** : `HeaderLayout` en trois îlots (marque, sections en pilule centrées, actions),
  collés à `--lgk-bar-top` sous le cadre ; `FloatingNav` (kit 0.316) en îlot à gauche, rangée de
  pastilles en bas sur téléphone. `SidebarLayout` reste habillé (entrée active en pilule d'encre).
- Composants ajoutés au kit pour cette refonte (0.316.0) : `CurvedCarousel`, `TriptychScroll`,
  `FloatingNav`. `TriptychScroll` (0.316.1) fait basculer chaque section entière passé son seuil.
- Police : Geist (`@fontsource-variable/geist`, fichier variable), Inter retirée. La prop `backdrop`
  a disparu avec le verre (v1.0.0, changement cassant).
- Vitrine : menu du haut = sections (Accueil, Tableau de bord, Données, Applications, Composants) tirées
  du registre (`sectionOf` dans `screens/index.tsx`), menu flottant = écrans de la section. Nouvel
  écran « Accueil » (`Home.tsx`) : carrousel incurvé, indicateurs, sections désynchronisées. Tuiles du
  tableau de bord en photos Unsplash (`photos.ts`), `LiveTile tone="dark"` sur photo (le ton par
  défaut, accent = encre blanche, y poserait un voile clair et un texte noir).
- Contrôles faits le 2026-11-21 : vitrine et Storybook dans Edge headless, sombre et clair, 1440 et
  390 px (aucun débordement horizontal).

### Historique 0.x (verre)

v0.1–0.4 (2026-11-20/21) : surfaces de verre dépoli (`--lq-surface-backdrop`, variable ajoutée au kit en
0.314.0 et toujours disponible), rail en îlot flottant, effet « goutte d'eau ». Abandonné en v1.

## Règles de frontière (identiques à minimal)

| Ce dont il s'agit | Où ça va |
|---|---|
| Logique d'un composant, correctif, composant manquant, variable manquante | **le kit**, `../Dashboard liseuse` |
| Couleur, rayon, espacement, ombre, flou | ici, `src/theme/liquid-glass.css` |
| Écran, navigation, données de démonstration | ici, `src/showcase/` |

Aucun contournement local d'un manque du kit : s'il manque une variable, on l'ajoute au kit (c'est ce
qui a été fait pour `--lq-surface-backdrop`).

## Le langage visuel

Sombre (défaut) : fond `#08090b`, surfaces `#111215` à filet `rgba(255,255,255,.06)`, cadre `#18191d`,
texte `#f4f4f5` / `#8e8f98`, accent = l'encre (`#f4f4f5`, contraste `#0a0a0c`). Clair : fond `#f5f5f3`,
cartes blanches, cadre `#e3e2de`, texte et accent `#0e0e11`. Couleur réservée aux données (hausse
`#4fd18b`, baisse `#ff6b6b`, séries ambre / ciel / violet / rose). Rayons 10 / 14 / 22 px, pilules
partout où l'on clique, contrôles de 40 px, Geist en casse de phrase, titres serrés (-0,03 à -0,045 em).

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
