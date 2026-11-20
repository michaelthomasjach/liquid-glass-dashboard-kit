import type { CSSProperties, ReactNode } from "react";
import { LqThemeProvider, type LqSurface } from "@michaelthomasjach/liseuse-dashboard-kit";
import "@michaelthomasjach/liseuse-dashboard-kit/style.css";
// Inter, servie avec l'application plutôt que par Google Fonts : rien n'est demandé à un tiers au
// chargement de la page. Le verre se lit mieux avec une seule voix, sans capitales espacées.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./liquid-glass.css";

/**
 * Le thème « Liquid glass », posé sur un sous-arbre.
 *
 * C'est l'unique point d'entrée de cette couche : la feuille du kit, la feuille de variables de ce
 * thème (`liquid-glass.css`), et la classe `lgk` qui donne à la seconde la spécificité qu'il lui
 * faut pour gagner sur la première, quel que soit l'ordre des imports.
 *
 * Le verre a besoin de quelque chose à flouter : la racine du thème porte un fond (dégradés colorés
 * par défaut, ou l'image passée dans `backdrop`), et les surfaces du kit — cartes, panneaux,
 * modales, menus, barre latérale — sont translucides avec un flou d'arrière-plan
 * (`--lq-surface-backdrop`, kit ≥ 0.314). Donnez à l'élément qui reçoit le thème la hauteur de la
 * page (`style={{ minHeight: "100vh" }}`) pour que le fond la couvre.
 *
 * `palette` n'est pas exposé : ce thème remplace les deux palettes du kit. Il reste fixé à
 * « color » pour que les composants qui se demandent s'ils sont sur une liseuse répondent non.
 */
export interface LiquidGlassThemeProps {
  /** `"dark"` (défaut, verre fumé sur un fond profond) ou `"light"` (verre clair sur un ciel pâle). */
  surface?: LqSurface;
  /** Appelé quand un composant du kit bascule la surface (`useLqTheme().setSurface`). */
  onSurfaceChange?: (surface: LqSurface) => void;
  /**
   * Ce que le verre floute : une valeur CSS `background-image` (« url(/montagnes.jpg) », un
   * dégradé…). Par défaut, les dégradés de la surface (`--lgk-backdrop`).
   */
  backdrop?: string;
  /** Classe ajoutée à `lgk` sur la racine ; elle suit aussi dans les portails. */
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function LiquidGlassTheme({ surface = "dark", onSurfaceChange, backdrop, className, style, children }: LiquidGlassThemeProps) {
  const rootStyle = backdrop ? ({ ...style, "--lgk-backdrop": backdrop } as CSSProperties) : style;
  return (
    <LqThemeProvider
      palette="color"
      surface={surface}
      font="inter"
      onSurfaceChange={onSurfaceChange}
      className={className ? `lgk ${className}` : "lgk"}
      style={rootStyle}
    >
      {children}
    </LqThemeProvider>
  );
}
