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

Sombre (défaut) : fond `#090d16` sous des halos vert, violet et bleu ; verre `rgba(255,255,255,.07)`,
liseré `rgba(255,255,255,.14)`, reflet `inset 0 1px 0 rgba(255,255,255,.16)` ; texte `#f3f6fb` ;
accent citron vert `#c8f04a` (encre `#0b1016`). Clair : ciel bleu, lilas et lagon ; verre
`rgba(255,255,255,.42)` ; texte `#0f172a` ; accent indigo `#4f46e5`. Rayons 12 / 16 / 24 px, contrôles
de 40 px, Inter partout en casse de phrase (pas de Montserrat ni de capitales espacées).

## Publication et état

- Dépôt : https://github.com/michaelthomasjach/liquid-glass-dashboard-kit (branche `master`), créé par
  l'API GitHub avec `GITHUB_TOKEN` (`gh` n'est pas installé).
- Paquet : `@michaelthomasjach/liquid-glass-dashboard-kit` sur GitHub Packages, v0.1.0 le 2026-11-20.
  `npm run build:lib` puis `npm publish --ignore-scripts` (depuis PowerShell, où `GITHUB_TOKEN` est exporté).
- Pas de workflow GitHub Pages : les runners hébergés de GitHub étaient bloqués sur ce compte
  (facturation) à la création. Celui de minimal (`.github/workflows/deploy-pages.yml`) peut être
  repris tel quel le jour où ils remarchent.
- Vérifié à la création : vitrine construite et rendue dans Edge headless, surfaces sombre et claire
  (Vue d'ensemble, Tableaux, Formulaires) ; captures dans `docs/images/`.

## Conventions

- `npm install` a besoin de `GITHUB_TOKEN` ; `.npmrc` garde `${GITHUB_TOKEN}`, jamais un vrai jeton.
- Commits en conventional commits, corps en français ; on commite et pousse à la fin de chaque tâche.
- Michael écrit en français et attend des réponses en français.
- Vérifier un changement visuel dans un vrai navigateur, pas seulement au typecheck.
