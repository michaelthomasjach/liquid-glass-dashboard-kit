import { useNavigate } from "react-router-dom";
import { Button, Card, CurvedCarousel, Sparkline, StatCard, TriptychScroll } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ARCHITECTURE_PHOTOS, INTERIOR_PHOTOS, LANDSCAPE_PHOTOS, photoUrl } from "../photos";

const CAROUSEL = [...INTERIOR_PHOTOS, ...ARCHITECTURE_PHOTOS].map((p) => ({
  id: p.id,
  src: photoUrl(p.id, 600, 720),
  alt: p.title,
  title: p.title,
  caption: p.caption,
}));

const KPIS = [
  { label: "Chiffre d'affaires", value: "1,24 M€", delta: 8.2, data: [4, 6, 5, 7, 8, 9, 11, 12] },
  { label: "Clients actifs", value: "18 420", delta: 3.1, data: [9, 9, 10, 10, 11, 12, 12, 13] },
  { label: "Panier moyen", value: "67,40 €", delta: -1.4, data: [8, 7, 7, 6, 7, 6, 6, 6] },
  { label: "Satisfaction", value: "4,7 / 5", delta: 0.9, data: [7, 7, 8, 8, 8, 9, 9, 9] },
];

const WORDS = ["Organisé.", "Relié.", "Lisible.", "Serein."];

const photo = (id: string, alt: string) => <img src={photoUrl(id, 900, 1400)} alt={alt} draggable={false} loading="lazy" />;

/** Une vue de la colonne du centre : une note courte et sa tendance, sur la surface du thème. */
function Note({ eyebrow, text, data }: { eyebrow: string; text: string; data: number[] }) {
  return (
    <div className="lgk-home__note">
      <span className="lgk-home__eyebrow">{eyebrow}</span>
      <p>{text}</p>
      <Sparkline data={data} height={70} width={300} area colorByTrend />
    </div>
  );
}

const FEATURES = [
  { title: "Un cadre arrondi", text: "Le contenu ne touche jamais les bords de la fenêtre : un liseré l'entoure, ses coins restent ronds pendant le défilement." },
  { title: "Un menu en pilule", text: "Les sections tiennent dans un îlot accroché en haut, la section ouverte en pilule pleine. La marque et les actions ont chacune le leur." },
  { title: "Un menu flottant", text: "À gauche, les écrans de la section ouverte, l'actif marqué d'un point. Sur téléphone, une rangée de pastilles en bas de l'écran." },
];

/**
 * L'accueil de la vitrine : ce que le thème change, montré plutôt que listé — une ouverture avec le
 * carrousel incurvé, une rangée d'indicateurs, puis les trois sections désynchronisées.
 */
export function Home() {
  const navigate = useNavigate();
  return (
    <div className="lgk-home">
      <section className="lgk-home__hero">
        <span className="lgk-home__pill">Liquid · v1</span>
        <h1 className="lgk-home__title">Des tableaux de bord clairs, sans rien perdre du détail.</h1>
        <p className="lgk-home__lead">
          Les composants de liseuse-dashboard-kit, dans un habillage sobre et moderne : grands arrondis, boutons en pilule, une seule voix.
        </p>
        <div className="lgk-home__cta">
          <Button tone="primary" onClick={() => navigate("/tableau-de-bord")}>
            Ouvrir le tableau de bord
          </Button>
          <Button variant="outline" onClick={() => navigate("/composants/primitives")}>
            Voir les composants
          </Button>
        </div>
      </section>

      <CurvedCarousel items={CAROUSEL} cardWidth={232} cardHeight={300} curvature={0.6} speed={30} ariaLabel="Réalisations" />

      <section className="lgk-home__kpis" aria-label="Indicateurs">
        {KPIS.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={k.delta} sparklineData={k.data} />
        ))}
      </section>

      <TriptychScroll
        className="lgk-home__triptych"
        ariaLabel="Présentation"
        height="calc(100vh - 2 * var(--lgk-frame-gap) - 120px)"
        stickyTop="calc(var(--lgk-frame-gap) + var(--lgk-bar-top) + var(--lgk-bar-height) + 14px)"
        gap={10}
        sections={[
          LANDSCAPE_PHOTOS.slice(0, 4).map((p) => photo(p.id, p.title)),
          [
            <Note key="a" eyebrow="Ce trimestre" text="Les ventes en ligne progressent pour le cinquième mois de suite." data={[3, 4, 5, 5, 6, 7, 8]} />,
            <Note key="b" eyebrow="À surveiller" text="Le panier moyen recule : les petites commandes vont plus vite que les grandes." data={[8, 7, 7, 6, 6, 6, 5]} />,
            <Note key="c" eyebrow="Prochaine étape" text="Relancer les clients inactifs depuis trois mois." data={[2, 3, 3, 4, 4, 5, 6]} />,
            <Note key="d" eyebrow="Bilan" text="Objectif annuel atteint à 92 %, trois semaines avant la clôture." data={[3, 4, 6, 6, 7, 8, 9]} />,
          ],
          LANDSCAPE_PHOTOS.slice(4, 8).map((p) => photo(p.id, p.title)),
        ]}
        overlay={({ step }) => (
          <div className="lgk-home__overlay">
            <div className="lgk-home__overlay-copy">
              <span>Faites défiler : chaque section avance à son tour, la gauche, puis la droite, puis le centre.</span>
              <Button tone="primary" onClick={() => navigate("/tableau-de-bord")}>
                Commencer
              </Button>
            </div>
            <div className="lgk-home__overlay-word">
              <strong>{WORDS[Math.min(step, WORDS.length - 1)]}</strong>
              <em>Pour que vous n'ayez pas à l'être.</em>
            </div>
          </div>
        )}
      />

      <section className="lgk-home__features">
        {FEATURES.map((f) => (
          <Card key={f.title} title={f.title}>
            {f.text}
          </Card>
        ))}
      </section>
    </div>
  );
}
