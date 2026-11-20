/**
 * Le paquet publié : tous les composants du kit, plus le thème qui les habille.
 *
 * Ré-exporter le kit en entier plutôt que de laisser l'application l'importer à côté : une
 * application n'a ainsi qu'une dépendance à déclarer et qu'un nom de paquet à écrire, et elle ne
 * peut pas se retrouver avec une version du thème calée sur une autre version du kit que celle
 * qu'il habille. Les composants restent ceux du kit — ce paquet n'en définit aucun.
 *
 * ```tsx
 * import { LiquidGlassTheme, Card, DataTable } from "@michaelthomasjach/liquid-glass-dashboard-kit";
 * import "@michaelthomasjach/liquid-glass-dashboard-kit/style.css";
 * ```
 */
export * from "@michaelthomasjach/liseuse-dashboard-kit";
export { LiquidGlassTheme } from "./theme";
export type { LiquidGlassThemeProps } from "./theme";
