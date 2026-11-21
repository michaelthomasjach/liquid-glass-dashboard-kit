import type { CSSProperties, ReactNode } from "react";
import { LqThemeProvider, type LqSurface } from "@michaelthomasjach/liseuse-dashboard-kit";
import "@michaelthomasjach/liseuse-dashboard-kit/style.css";
// Geist, servie avec l'application (fichier variable, toutes les graisses) : rien n'est demandé à
// un tiers au chargement de la page.
import "@fontsource-variable/geist/wght.css";
import "./tokens.css";
import "./shell.css";
import "./details.css";

/**
 * Le thème « Liquid », posé sur un sous-arbre — v1 : sobre et moderne, grands rayons, boutons en
 * pilule, menu du haut en îlots, cadre arrondi décollé des bords de la fenêtre.
 *
 * C'est l'unique point d'entrée de cette couche : la feuille du kit, les trois feuilles du thème
 * (`tokens.css`, `shell.css`, `details.css`) et la classe `lgk` qui leur donne la spécificité qu'il
 * leur faut pour gagner sur le kit, quel que soit l'ordre des imports.
 *
 * `palette` n'est pas exposé : ce thème remplace les deux palettes du kit. Il reste fixé à « color »
 * pour que les composants qui se demandent s'ils sont sur une liseuse répondent non.
 */
export interface LiquidGlassThemeProps {
  /** `"dark"` (défaut, presque noir) ou `"light"` (blanc cassé). */
  surface?: LqSurface;
  /** Appelé quand un composant du kit bascule la surface (`useLqTheme().setSurface`). */
  onSurfaceChange?: (surface: LqSurface) => void;
  /**
   * Le cadre : un liseré entre la fenêtre et le contenu, aux coins arrondis, qui reste en place
   * pendant le défilement. Défaut true. À couper pour un thème posé sur une partie de page (un
   * aperçu, une carte) plutôt que sur l'application entière.
   */
  frame?: boolean;
  /** Classe ajoutée à `lgk` sur la racine ; elle suit aussi dans les portails. */
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function LiquidGlassTheme({ surface = "dark", onSurfaceChange, frame = true, className, style, children }: LiquidGlassThemeProps) {
  return (
    <LqThemeProvider
      palette="color"
      surface={surface}
      font="inter"
      onSurfaceChange={onSurfaceChange}
      className={className ? `lgk ${className}` : "lgk"}
      style={style}
    >
      {frame ? (
        <>
          <div className="lgk-canvas">{children}</div>
          <div className="lgk-bezel" aria-hidden="true" />
        </>
      ) : (
        children
      )}
    </LqThemeProvider>
  );
}
