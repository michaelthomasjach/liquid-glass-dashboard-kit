import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  BellIcon,
  FloatingNav,
  HeaderLayout,
  LayersIcon,
  MoonIcon,
  NotificationMenu,
  type NotificationMenuItem,
  SearchIcon,
  SearchOverlay,
  SunIcon,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { LiquidGlassTheme } from "../theme";
import { GROUP_ICONS, SCREENS, SECTIONS, sectionOf, type Screen } from "./screens";
import { searchComponents, searchScreens } from "./searchIndex";
import "./showcase.css";

type Surface = "light" | "dark";

const NOTIFICATIONS: NotificationMenuItem[] = [
  { id: "n1", title: "Camille Leroy", meta: "a partagé un document", text: "Le rapport trimestriel des ventes est prêt à relire.", time: "il y a 5 min", unread: true },
  { id: "n2", title: "Facturation", meta: "3 factures en retard", text: "Groupe Vallée, Studio Bélier et Cabinet Roux dépassent 30 jours.", time: "il y a 1 h", unread: true, tone: "danger" },
  { id: "n3", title: "Déploiement", meta: "terminé", text: "La version 1.0 est en production.", time: "hier", tone: "success" },
  { id: "n4", title: "Hugo Mercier", meta: "vous a mentionné", text: "« On regarde le tableau de bord ensemble demain ? »", time: "hier" },
];

/** La cloche et sa liste : l'état lu / non lu est tenu ici, comme le veut le kit. */
function Notifications() {
  const [items, setItems] = useState(NOTIFICATIONS);
  return (
    <NotificationMenu
      items={items}
      icon={<BellIcon size={18} />}
      label="Notifications"
      badge="dot"
      onToggleRead={(item) => setItems((all) => all.map((n) => (n.id === item.id ? { ...n, unread: !n.unread } : n)))}
      onMarkAllRead={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
    />
  );
}

/** La marque : une pastille et le nom, dans l'îlot de gauche de la barre. */
function Brand() {
  return (
    <a className="lgk-brand" href="#/" aria-label="Liquid — accueil">
      <span className="lgk-brand__mark" aria-hidden="true" />
      <span className="lgk-logo">liquid</span>
    </a>
  );
}

/** L'îlot de droite : recherche, notifications, surface, avatar. */
function Actions({ surface, onSurface, onSearch }: { surface: Surface; onSurface: (next: Surface) => void; onSearch: () => void }) {
  return (
    <>
      <button type="button" className="lgk-action" onClick={onSearch} aria-label="Rechercher (ou tapez n'importe où)">
        <SearchIcon size={17} />
      </button>
      <Notifications />
      <button
        type="button"
        className="lgk-action"
        onClick={() => onSurface(surface === "dark" ? "light" : "dark")}
        aria-label={surface === "dark" ? "Passer en clair" : "Passer en sombre"}
      >
        {surface === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
      </button>
      <span className="lgk-avatar">
        <Avatar name="Camille Leroy" size={32} />
      </span>
    </>
  );
}

/**
 * La recherche : les écrans par leur nom ou leur groupe, et les composants par leur nom d'export — un
 * composant mène à l'écran qui le montre. Entrée ouvre le premier résultat. Elle s'ouvre par la loupe,
 * ou en tapant une lettre n'importe où dans la page.
 */
function Search({ open, onOpen, onClose }: { open: boolean; onOpen: () => void; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const screens = searchScreens(query);
  const components = searchComponents(query);

  const close = () => {
    onClose();
    setQuery("");
  };
  const go = (screen: Screen) => {
    navigate(`/${screen.path}`);
    close();
  };

  return (
    <SearchOverlay
      open={open}
      onClose={close}
      query={query}
      onQueryChange={setQuery}
      onTypeToOpen={(first) => {
        setQuery(first);
        onOpen();
      }}
      onSubmit={() => {
        const first = screens[0] ?? components[0]?.screen;
        if (first) go(first);
      }}
      brand={<span className="lgk-logo">liquid</span>}
      placeholder="Rechercher…"
      hint="Entrée ouvre le premier résultat · Échap ferme"
      emptyText="Aucun écran ni composant ne porte ce nom."
      sections={[
        {
          id: "screens",
          title: `Écrans : ${query}`,
          results: screens.map((screen) => ({
            id: screen.id,
            label: screen.label,
            details: screen.group,
            avatar: GROUP_ICONS[screen.group],
            onSelect: () => go(screen),
          })),
        },
        {
          id: "components",
          title: `Composants : ${query}`,
          results: components.slice(0, 12).map((c) => ({
            id: c.name,
            label: c.name,
            details: `dans « ${c.screen.label} »`,
            avatar: <LayersIcon />,
            avatarColor: "var(--lq-color-info)",
            onSelect: () => go(c.screen),
          })),
        },
      ]}
    />
  );
}

/**
 * La coquille du thème : le menu du haut en îlots (marque, sections en pilule, actions), et le menu
 * flottant de gauche, qui liste les écrans de la section ouverte.
 *
 * Elle ne connaît aucun écran par son nom — elle lit le registre (`screens/index.tsx`), d'où sortent
 * à la fois les entrées des deux menus et les routes.
 */
function Shell({ surface, onSurface }: { surface: Surface; onSurface: (next: Surface) => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.replace(/^\//, "");
  const screen = SCREENS.find((s) => s.path === current) ?? SCREENS[0];
  const section = sectionOf(screen);
  const siblings = SCREENS.filter((s) => sectionOf(s).id === section.id);
  const [searchOpen, setSearchOpen] = useState(false);

  // Un nouvel écran s'ouvre en haut de page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <HeaderLayout
      logo={<Brand />}
      navItems={SECTIONS.map((s) => ({
        id: s.id,
        label: s.label,
        active: s.id === section.id,
        onClick: () => navigate(`/${SCREENS.find((x) => sectionOf(x).id === s.id)!.path}`),
      }))}
      actions={<Actions surface={surface} onSurface={onSurface} onSearch={() => setSearchOpen(true)} />}
    >
      {siblings.length > 1 && (
        <FloatingNav
          title={section.label}
          ariaLabel={`Écrans : ${section.label}`}
          items={siblings.map((s) => ({ id: s.id, label: s.label, active: s.id === screen.id, onClick: () => navigate(`/${s.path}`) }))}
        />
      )}
      <div className={siblings.length > 1 ? "lgk-main lgk-main--indexed" : "lgk-main"}>
        <Search open={searchOpen} onOpen={() => setSearchOpen(true)} onClose={() => setSearchOpen(false)} />
        <Routes>
          {SCREENS.map((s) => (
            <Route key={s.id} path={`/${s.path}`} element={s.render()} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HeaderLayout>
  );
}

/**
 * `HashRouter` et non `BrowserRouter` : la vitrine est un site statique, et un rafraîchissement sur
 * `/tableaux` renvoie un 404 chez tout hébergeur qui ne sait pas réécrire vers `index.html` —
 * GitHub Pages le premier. Le dièse évite ce piège sans configuration.
 */
export function App() {
  const [surface, setSurface] = useState<Surface>("dark");
  return (
    <LiquidGlassTheme surface={surface} style={{ minHeight: "100vh" }}>
      <HashRouter>
        <Shell surface={surface} onSurface={setSurface} />
      </HashRouter>
    </LiquidGlassTheme>
  );
}
