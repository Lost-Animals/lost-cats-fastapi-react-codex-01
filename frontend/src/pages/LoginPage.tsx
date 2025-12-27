import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <section className="page">
      <div className="hero">
        <span className="tag">Profil</span>
        <h1>Vhod v LostCats.</h1>
        <p>Vlezte s email i parola, za da publikuvate obqvi ili da izpratite signal.</p>
      </div>

      <div className="split">
        <div className="card">
          <h2>Vhod</h2>
          <form className="form">
            <label>
              Email
              <input type="email" placeholder="name@email.com" />
            </label>
            <label>
              Parola
              <input type="password" placeholder="********" />
            </label>
            <button className="button" type="button">
              Vlezi
            </button>
          </form>
        </div>
        <div className="card">
          <h2>Nov potrebitel?</h2>
          <p>Registrirai se, za da publikuvash obqvi i da poluchavash izvestiya.</p>
          <Link className="button secondary" to="/register">
            Registraciya
          </Link>
        </div>
      </div>
    </section>
  );
}
