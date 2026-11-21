import { useState, type ReactNode } from "react";
import {
  AlertList,
  ArrowRightIcon,
  Badge,
  BarChart,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  DonutChart,
  GaugeChart,
  Input,
  LineAreaChart,
  LiveTile,
  NotificationMenu,
  PriceChangeTag,
  ProgressBar,
  SegmentedControl,
  Select,
  Sparkline,
  StatCard,
  Tag,
  Toggle,
  type NotificationMenuItem,
} from "@michaelthomasjach/liseuse-dashboard-kit";
import { LiquidGlassTheme } from "../../theme";
import { CHURN_TREND, REVENUE_TREND, SIGNUPS_TREND } from "../../showcase/demoData";
import { TOKEN_GROUPS } from "../_docs/TokenTable";
import { openPath, useStorybookIndex, type StorybookIndex } from "./storybookIndex";
import "./accueil.css";

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Au niveau du module, pas à chaque rendu : chaque graphique se redessinerait sinon contre une
// série neuve à chaque changement de surface.
const REVENUE_SERIES = [
  { id: "revenu", label: "Revenu (k€)", data: REVENUE_TREND.map((y, i) => ({ x: i, y })) },
  { id: "objectif", label: "Objectif", data: REVENUE_TREND.map((_, i) => ({ x: i, y: 40 + i * 3.4 })) },
];
const CHANNELS = [
  { id: "direct", label: "Direct", value: 42 },
  { id: "partenaires", label: "Partenaires", value: 27 },
  { id: "recherche", label: "Recherche", value: 19 },
  { id: "autres", label: "Autres", value: 12 },
];
const SIGNUPS_BARS = SIGNUPS_TREND.slice(-6).map((value, i) => ({ id: `m${i}`, label: MONTHS[6 + i], value }));
const NOTIFICATIONS: NotificationMenuItem[] = [
  { id: "1", title: "Facture F-2041 réglée", text: "Atelier Morel — 4 820 €", time: "il y a 5 min", unread: true, tone: "success" },
  { id: "2", title: "Nouveau client", text: "Brasserie du Port a créé son compte.", time: "il y a 1 h", unread: true, tone: "accent" },
  { id: "3", title: "Export terminé", text: "commandes-octobre.csv est prêt.", time: "hier", tone: "info" },
];

/** Les familles du menu, dans l'ordre de la barre latérale (voir `storySort` dans preview.tsx). La
 *  page ouverte au clic est la plus représentative de la famille, pas la première par l'alphabet. */
const FAMILIES: { name: string; lead: string; open: string }[] = [
  { name: "Foundations", lead: "Les variables du thème, la typographie, les icônes et le fournisseur de thème.", open: "Foundations/Variables du thème" },
  { name: "Primitives", lead: "Boutons, cartes, panneaux, onglets, bascules, infobulles : les briques de tout le reste.", open: "Primitives/Button" },
  { name: "Forms", lead: "Champs, listes, dates, masques de saisie, étiquettes, éditeur riche.", open: "Forms/Input/Input" },
  { name: "Feedback", lead: "Notifications, alertes, chargements, progression, visites guidées.", open: "Feedback/Notification" },
  { name: "Charts", lead: "Courbes, barres, anneaux, jauges, cartes de chaleur, chandeliers.", open: "Charts/LineAreaChart" },
  { name: "Map", lead: "Globe interactif, carte tuilée, carte à points, exposition par pays.", open: "Map/Tile Map" },
  { name: "Finance", lead: "Tuiles d'indicateur, tableau de données, variations, comparaisons.", open: "Finance/StatCard" },
  { name: "Finance Widgets", lead: "Portefeuille, liste de surveillance, plus fortes variations.", open: "Finance Widgets/PortfolioSummaryWidget" },
  { name: "Widgets", lead: "Tuiles vivantes, horloges, météo, Kanban, objectifs, base de connaissances.", open: "Widgets/LiveTile" },
  { name: "Dashboard", lead: "Un tableau de bord assemblé de bout en bout avec les widgets.", open: "Dashboard/Maison — tableau de bord" },
  { name: "Layouts", lead: "Barre latérale, barre haute, fil d'Ariane, menu utilisateur.", open: "Layouts/SidebarLayout" },
  { name: "Pages", lead: "Connexion, inscription, profil, facture, verrouillage, erreurs 404 et 500.", open: "Pages/LoginPage" },
  { name: "Audio", lead: "Balance, vumètres et égaliseur.", open: "Audio/Equalizer" },
  { name: "Scheduler", lead: "Planning de ressources, sa fenêtre de tâche, calendrier mensuel.", open: "Scheduler/MonthCalendar" },
];

const SWATCHES = ["--lq-color-bg", "--lq-color-panel", "--lgk-color-text-strong", "--lq-color-text", "--lq-color-text-muted", "--lq-color-border", "--lq-color-accent", "--lq-color-up", "--lq-color-down", "--lq-color-warning", "--lq-color-info", "--lq-color-violet", "--lq-color-sky", "--lq-color-green", "--lq-color-amber", "--lq-color-rose"];
const TYPE_SCALE = [
  { token: "--lq-text-h3", sample: "Titre d'écran" },
  { token: "--lq-text-lg", sample: "Valeur secondaire" },
  { token: "--lq-text-md", sample: "Texte courant, 14 px" },
  { token: "--lq-text-sm", sample: "Légende de graphique" },
];
const SHAPES = ["--lq-radius-sm", "--lq-radius-md", "--lq-radius-lg", "--lq-radius-pill"];
const TOKEN_COUNT = TOKEN_GROUPS.reduce((n, g) => n + g.tokens.length, 0);

const USAGE_SNIPPET = `import { LiquidGlassTheme, Button, Card } from "@michaelthomasjach/liquid-glass-dashboard-kit";
import "@michaelthomasjach/liquid-glass-dashboard-kit/style.css";

export function App() {
  return (
    <LiquidGlassTheme surface="light">
      <Card title="Commandes">
        <Button tone="primary">Exporter</Button>
      </Card>
    </LiquidGlassTheme>
  );
}`;
const FONTS_SNIPPET = `# .npmrc — le paquet est sur GitHub Packages
@michaelthomasjach:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}

npm install @michaelthomasjach/liquid-glass-dashboard-kit react react-dom d3`;
const SHOWCASE_SNIPPET = `npm install      # GITHUB_TOKEN exporté : le kit est sur GitHub Packages
npm run dev      # la vitrine, sur http://localhost:5173
npm run storybook`;

/** La vitrine : publiée sous `vitrine/` à côté de ce Storybook sur GitHub Pages ; en local, le
 *  serveur de `npm run dev`. L'iframe de la story est servie à la racine du Storybook, d'où l'URL
 *  relative. */
const SHOWCASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : new URL("vitrine/", typeof window !== "undefined" ? window.location.href : "http://localhost/").href;

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead: ReactNode }) {
  return (
    <header className="lgk-home__head">
      <span className="lgk-home__eyebrow">{eyebrow}</span>
      <h2 className="lgk-home__title">{title}</h2>
      <p className="lgk-home__lead">{lead}</p>
    </header>
  );
}

/** Un composant vivant et son nom ; seul le nom est un bouton, pour ne pas voler les clics destinés
 *  au composant lui-même (les bascules basculent, les champs se remplissent). */
function Specimen({ name, title, index, wide, children }: { name: string; title: string; index: StorybookIndex; wide?: boolean; children: ReactNode }) {
  return (
    <figure className={["lgk-home__specimen", wide && "lgk-home__specimen--wide"].filter(Boolean).join(" ")}>
      <div className="lgk-home__stage">{children}</div>
      <figcaption>
        <button type="button" className="lgk-home__link" onClick={() => openPath(index.pathOf(title))}>
          {name}
        </button>
      </figcaption>
    </figure>
  );
}

/** Le mini tableau de bord du héros : de vrais composants, avec de vraies données de démonstration. */
function HeroDashboard() {
  return (
    <div className="lgk-home__dash">
      <div className="lgk-home__stats">
        <StatCard label="Revenu mensuel" value={euro(80000)} delta={12.4} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
        <StatCard label="Nouveaux clients" value="31" delta={-6.1} caption="vs. mois précédent" sparklineData={SIGNUPS_TREND} />
        <StatCard label="Attrition" value="4,0 %" delta={-1.2} caption="vs. mois précédent" sparklineData={CHURN_TREND} />
      </div>
      <div className="lgk-home__dash-row">
        <Card title="Revenu sur douze mois" meta="k€">
          <LineAreaChart series={REVENUE_SERIES} height={220} area xType="linear" formatX={(x) => MONTHS[Number(x)] ?? ""} formatY={(y) => `${y}`} />
        </Card>
        <Card title="Canaux d'acquisition" meta="en %">
          <DonutChart data={CHANNELS} size={150} centerValue="42 %" centerCaption="Direct" legendPosition="bottom" />
        </Card>
      </div>
    </div>
  );
}

function FormsSpecimen() {
  const [client, setClient] = useState("Atelier Morel");
  const [statut, setStatut] = useState<string | null>("payee");
  const [period, setPeriod] = useState<"mois" | "trimestre" | "annee">("trimestre");
  const [relance, setRelance] = useState(true);
  const [copie, setCopie] = useState(false);
  return (
    <Card title="Nouvelle facture">
      <div className="lgk-home__form">
        <Input label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
        <Select
          label="Statut"
          value={statut}
          onChange={setStatut}
          options={[
            { value: "brouillon", label: "Brouillon" },
            { value: "envoyee", label: "Envoyée" },
            { value: "payee", label: "Payée" },
          ]}
        />
        <SegmentedControl
          label="Période"
          labelPosition="top"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "mois", label: "Mois" },
            { value: "trimestre", label: "Trimestre" },
            { value: "annee", label: "Année" },
          ]}
        />
        <div className="lgk-home__row">
          <Toggle checked={relance} onChange={setRelance} ariaLabel="Relance automatique" />
          <span>Relance automatique à J+30</span>
        </div>
        <Checkbox checked={copie} onChange={setCopie} label="M'envoyer une copie" />
        <div className="lgk-home__row">
          <Button selected>Enregistrer</Button>
          <Button>Annuler</Button>
        </div>
      </div>
    </Card>
  );
}

export interface AccueilPageProps {
  /** Version du kit dont le Storybook lit le source, affichée dans le surtitre. */
  kitVersion: string;
  /** Nombre de composants du kit documentés (`docgen.json`). */
  componentCount: number;
}

export function AccueilPage({ kitVersion, componentCount }: AccueilPageProps) {
  const index = useStorybookIndex();
  const open = (title: string) => openPath(index.pathOf(title));

  return (
    <div className="lgk-home">
      <header className="lgk-home__hero">
        <span className="lgk-home__eyebrow">Thème « Liquid glass » · kit v{kitVersion}</span>
        <h1 className="lgk-home__hero-title">
          Les composants de la liseuse, <span className="lgk-home__accent">dans du verre dépoli</span>.
        </h1>
        <p className="lgk-home__hero-lead">
          <strong>liquid-glass-dashboard-kit</strong> est une couche de thème posée sur{" "}
          <code>@michaelthomasjach/liseuse-dashboard-kit</code>. Elle ne réécrit aucun composant : elle
          redéfinit les variables <code>--lq-*</code> qu'ils lisent tous, et leur donne le langage d'un
          tableau de bord « Liquid glass » — surfaces de verre translucides et floutées, liseré de lumière,
          grands rayons, accent corail, cartes en gouttes d'eau teintées par le fond et auréolées de sa couleur. Chaque page de ce Storybook rend le composant du kit à travers <code>LiquidGlassTheme</code> :
          c'est ce que verra une application qui l'utilise.
        </p>
        <div className="lgk-home__actions">
          <Button selected icon={<ArrowRightIcon size={15} />} iconPosition="trailing" onClick={() => open("Primitives/Button")}>
            Parcourir les composants
          </Button>
          <Button onClick={() => open("Foundations/Variables du thème")}>Les variables du thème</Button>
          <Button onClick={() => window.open(SHOWCASE_URL, "_blank", "noopener")}>Ouvrir la vitrine</Button>
        </div>
        <p className="lgk-home__hint">
          La vitrine — le tableau de bord, les tableaux, les formulaires, les écrans d'application et une
          planche par famille de composants — est publiée à côté de ce Storybook, et se lance en local avec{" "}
          <code>npm run dev</code>. La bascule <strong>Surface</strong> de la barre d'outils fait passer
          toute cette page, et toutes les autres, du verre fumé (sombre) au verre laiteux (clair).
        </p>
        <div className="lgk-home__stage-frame">
          <HeroDashboard />
        </div>
        <dl className="lgk-home__figures">
          <div>
            <dt>{componentCount}</dt>
            <dd>composants du kit documentés</dd>
          </div>
          <div>
            <dt>{index.pageCount || "—"}</dt>
            <dd>pages dans le menu</dd>
          </div>
          <div>
            <dt>{TOKEN_COUNT}</dt>
            <dd>variables redéfinies par le thème</dd>
          </div>
          <div>
            <dt>0</dt>
            <dd>ligne de logique de composant</dd>
          </div>
        </dl>
      </header>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="Le propos"
          title="Du verre sur de la couleur."
          lead={
            <>
              Le langage <em>liquid glass</em> des tableaux de bord récents : des surfaces translucides qui
              floutent et saturent ce qu'il y a derrière, un liseré de lumière en haut de chaque carte, de
              grands rayons, et un fond de halos colorés pour que le verre ait quelque chose à réfracter.
              Tout passe par les variables du kit : ses composants restent les mêmes, au pixel de logique près.
            </>
          }
        />
        <div className="lgk-home__pillars">
          <article className="lgk-home__pillar">
            <h3>Une valeur, pas un titre</h3>
            <p>Grille typographique courte : sur un tableau de bord, le plus gros texte de l'écran doit être un chiffre.</p>
          </article>
          <article className="lgk-home__pillar">
            <h3>Un seul accent</h3>
            <p>Corail vif sur verre fumé, corail profond sur verre clair : un primaire pour l'action et l'état sélectionné ; les couleurs de série restent aux graphiques.</p>
          </article>
          <article className="lgk-home__pillar">
            <h3>Fait pour l'écran</h3>
            <p>Le kit est à zéro rayon, son allure de papier. Ici, de grands rayons, un flou d'arrière-plan et un reflet d'un pixel qui détachent chaque surface.</p>
          </article>
        </div>
      </section>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="Deux surfaces"
          title="Clair et sombre, une seule feuille."
          lead={
            <>
              Les deux tuiles ci-dessous contiennent les mêmes composants, chacune sous son propre{" "}
              <code>LiquidGlassTheme</code>. Seul l'attribut <code>surface</code> change ; aucune classe
              conditionnelle n'est écrite nulle part.
            </>
          }
        />
        <div className="lgk-home__surfaces">
          {(["light", "dark"] as const).map((surface) => (
            <div key={surface} className="lgk-home__surface">
              <div className="lgk-home__surface-frame">
              <LiquidGlassTheme surface={surface}>
                <div className="lgk-home__surface-body">
                  <StatCard label="Panier moyen" value={euro(2580)} delta={3.8} caption="vs. mois précédent" sparklineData={REVENUE_TREND} />
                  <div className="lgk-home__row">
                    <Badge tone="up">Payée</Badge>
                    <Badge tone="warning">En attente</Badge>
                    <Badge tone="down">Impayée</Badge>
                  </div>
                  <ProgressBar label="Objectif trimestriel" value={72} labelPosition="left" showValue />
                </div>
              </LiquidGlassTheme>
              </div>
              <span className="lgk-home__surface-label">surface="{surface}"</span>
            </div>
          ))}
        </div>
      </section>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="Fondations"
          title="Ce que le thème redéfinit."
          lead="Les couleurs, l'échelle typographique, les rayons et les espacements : tout passe par des variables, lues ici en direct. Changez de surface dans la barre d'outils, elles se repeignent."
        />
        <div className="lgk-home__foundations">
          <section className="lgk-home__found">
            <h3>Couleurs</h3>
            <ul className="lgk-home__swatches">
              {SWATCHES.map((token) => (
                <li key={token}>
                  <span className="lgk-home__chip" style={{ background: `var(${token})` }} />
                  <code>{token.replace(/^--(lq|lgk)-color-/, "")}</code>
                </li>
              ))}
            </ul>
          </section>
          <section className="lgk-home__found">
            <h3>Typographie</h3>
            <ul className="lgk-home__typescale">
              {TYPE_SCALE.map(({ token, sample }) => (
                <li key={token}>
                  <span style={{ fontSize: `var(${token})` }}>{sample}</span>
                  <code>{token}</code>
                </li>
              ))}
              <li>
                <span className="lgk-home__caption-sample">Petit titre de carte</span>
                <code>--lq-caption-*</code>
              </li>
            </ul>
          </section>
          <section className="lgk-home__found">
            <h3>Rayons et ombre</h3>
            <ul className="lgk-home__shapes">
              {SHAPES.map((token) => (
                <li key={token}>
                  <span className="lgk-home__shape" style={{ borderRadius: `var(${token})` }} />
                  <code>{token.replace("--lq-", "")}</code>
                </li>
              ))}
            </ul>
            <button type="button" className="lgk-home__link" onClick={() => open("Foundations/Variables du thème")}>
              Toutes les variables et leurs valeurs calculées
            </button>
          </section>
        </div>
      </section>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="En fonctionnement"
          title="Les composants, vivants, dans le thème."
          lead="Rien de ce qui suit n'est une capture : ce sont les composants du kit, avec leur état. Le nom sous chaque cadre ouvre sa documentation."
        />
        <div className="lgk-home__specimens">
          <Specimen name="LiveTile" title="Widgets/LiveTile" index={index}>
            <LiveTile
              height={190}
              interval={3200}
              faces={[
                { tag: "Vitrine", eyebrow: "npm run dev", title: "Trois écrans de référence", subtitle: "Vue d'ensemble, Tableaux, Formulaires" },
                { tag: "Thème", eyebrow: `${TOKEN_COUNT} variables`, title: "Clair et sombre", subtitle: "Une seule feuille, liquid-glass.css", background: "var(--lq-color-info)" },
                { tag: "Kit", eyebrow: `v${kitVersion}`, title: "La logique reste dans le kit", subtitle: "Ici, on ne décide que de l'apparence", background: "var(--lgk-color-text-strong)" },
              ]}
            />
          </Specimen>
          <Specimen name="BarChart" title="Charts/BarChart" index={index}>
            <BarChart data={SIGNUPS_BARS} height={190} formatValue={(v) => `${v}`} />
          </Specimen>
          <Specimen name="GaugeChart" title="Charts/GaugeChart" index={index}>
            <GaugeChart value={72} size={150} label="Objectif" formatValue={(v) => `${v} %`} />
          </Specimen>
          <Specimen name="NotificationMenu" title="Feedback/NotificationMenu" index={index}>
            <div className="lgk-home__row lgk-home__row--between">
              <span>Trois notifications, deux non lues</span>
              <NotificationMenu items={NOTIFICATIONS} title="Notifications" />
            </div>
          </Specimen>
          <Specimen name="AlertList" title="Feedback/AlertList" index={index} wide>
            <AlertList
              alerts={[
                { id: "a", level: "critical", message: "Trois factures dépassent 60 jours de retard." },
                { id: "b", level: "warning", message: "Le quota d'export mensuel est atteint à 90 %." },
                { id: "c", level: "info", message: "Nouvelle version du kit disponible." },
              ]}
            />
          </Specimen>
          <Specimen name="Sparkline · PriceChangeTag · Tag" title="Charts/Sparkline" index={index}>
            <div className="lgk-home__quotes">
              {[
                { name: "Revenu", data: REVENUE_TREND, delta: 12.4 },
                { name: "Clients", data: SIGNUPS_TREND, delta: -6.1 },
                { name: "Attrition", data: CHURN_TREND, delta: -1.2 },
              ].map((q) => (
                <div key={q.name} className="lgk-home__quote">
                  <span>{q.name}</span>
                  <Sparkline data={q.data} colorByTrend width={80} height={22} />
                  <PriceChangeTag value={q.delta} />
                </div>
              ))}
              <div className="lgk-home__row">
                <Tag>Octobre</Tag>
                <Tag onRemove={() => {}}>Clients actifs</Tag>
              </div>
            </div>
          </Specimen>
        </div>
        <div className="lgk-home__forms">
          <FormsSpecimen />
          <div className="lgk-home__forms-note">
            <h3>Les champs aussi.</h3>
            <p>
              Champs de 32 px à filet d'un pixel, libellés au-dessus, boutons de 35 px : le thème règle
              leurs dimensions par les variables <code>--lq-control-*</code>, <code>--lq-field-*</code> et{" "}
              <code>--lq-button-*</code> que le kit lit avec son propre rendu pour défaut.
            </p>
            <button type="button" className="lgk-home__link" onClick={() => open("Forms/Input/Input")}>
              La famille Forms
            </button>
          </div>
        </div>
      </section>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="Le catalogue"
          title="Le même menu que le kit."
          lead="Ce Storybook affiche les stories du kit elles-mêmes, chargées depuis son code source : mêmes pages, mêmes exemples, mêmes Docs, l'une en e-ink, l'autre dans ce thème. Une story ajoutée au kit apparaît ici d'elle-même. Les comptes ci-dessous sont lus dans le menu lui-même."
        />
        <div className="lgk-home__families">
          {FAMILIES.map((f) => (
            <button key={f.name} type="button" className="lgk-home__family" onClick={() => open(f.open)}>
              <span className="lgk-home__family-head">
                <strong>{f.name}</strong>
                {index.pagesByFamily[f.name] ? <span className="lgk-home__count">{index.pagesByFamily[f.name]}</span> : null}
              </span>
              <span className="lgk-home__family-lead">{f.lead}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="Prise en main"
          title="Un composant autour de l'application."
          lead={
            <>
              Un seul paquet : il ré-exporte tous les composants du kit et ajoute <code>LiquidGlassTheme</code>,
              qui charge la feuille du kit, celle du thème et la police Inter (embarquée — rien n'est
              demandé à Google Fonts) et pose la classe <code>lgk</code> et le fond que le verre floute.
            </>
          }
        />
        <div className="lgk-home__code">
          <CodeBlock code={USAGE_SNIPPET} filename="App.tsx" highlight="javascript" showLineNumbers />
          <div className="lgk-home__code-side">
            <CodeBlock code={FONTS_SNIPPET} language="bash" />
            <CodeBlock code={SHOWCASE_SNIPPET} language="bash" />
          </div>
        </div>
      </section>

      <section className="lgk-home__section">
        <SectionHead
          eyebrow="Sous le capot"
          title="Comment la couche tient."
          lead="Trois règles, et l'architecture entière en découle."
        />
        <div className="lgk-home__pillars">
          <article className="lgk-home__pillar">
            <h3>Strictement plus spécifique</h3>
            <p>
              Le thème redéfinit les variables sous <code>.lgk.lq-root[data-lq-palette][data-lq-surface]</code>,
              un point de spécificité au-dessus du kit : il gagne quel que soit l'ordre de chargement des
              feuilles, que les bundlers réorganisent sans prévenir.
            </p>
          </article>
          <article className="lgk-home__pillar">
            <h3>Des variables optionnelles</h3>
            <p>
              Pour les petits titres, les champs, la barre latérale et les lignes de données, le kit lit
              aussi des variables facultatives (<code>--lq-label-*</code>, <code>--lq-caption-*</code>,{" "}
              <code>--lq-control-*</code>, <code>--lq-sidebar-*</code>…) dont le défaut est son propre rendu.
            </p>
          </article>
          <article className="lgk-home__pillar">
            <h3>La logique reste au kit</h3>
            <p>
              Un correctif, une prop, un composant manquant se font dans le kit ; la couleur, la taille et
              l'espace se font ici. Les stories et leurs tables de props sont celles du kit : elles
              décrivent ce qui est rendu.
            </p>
          </article>
        </div>
      </section>

      <p className="lgk-home__footnote">
        <code>liquid-glass-dashboard-kit</code> · thème « Liquid glass » sur <code>@michaelthomasjach/liseuse-dashboard-kit</code>{" "}
        v{kitVersion}. Ce Storybook lit le source du kit voisin ; la vitrine utilise le paquet publié.
      </p>
    </div>
  );
}
