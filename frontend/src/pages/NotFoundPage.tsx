import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page">
      <div className="hero">
        <span className="tag">404</span>
        <h1>Stranicata ne e namerena.</h1>
        <p>Vurni se kum osnovnite obqvi ili proveri mikrochip.</p>
        <div className="hero-actions">
          <Link className="button" to="/">
            Kum obqvite
          </Link>
          <Link className="button secondary" to="/chip">
            Chip proverka
          </Link>
        </div>
      </div>
    </section>
  );
}
