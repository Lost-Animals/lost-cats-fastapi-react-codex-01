import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <section className="page">
      <div className="hero">
        <span className="tag">Nov akaunt</span>
        <h1>Registraciya za LostCats.</h1>
        <p>Suzdai profil, za da publikuvash obqvi i da poluchavash suobshteniya.</p>
      </div>

      <div className="split">
        <div className="card">
          <h2>Registraciya</h2>
          <form className="form">
            <div className="form-row">
              <label>
                Ime / psevdonim
                <input placeholder="Mila" />
              </label>
              <label>
                Email
                <input type="email" placeholder="name@email.com" />
              </label>
            </div>
            <div className="form-row">
              <label>
                Parola
                <input type="password" placeholder="********" />
              </label>
              <label>
                Telefon (po jelanie)
                <input placeholder="+359" />
              </label>
            </div>
            <label>
              Predpochitan kontakt
              <select defaultValue="IN_PLATFORM_ONLY">
                <option value="IN_PLATFORM_ONLY">IN_PLATFORM_ONLY</option>
                <option value="SHOW_PHONE_OPTIONAL">SHOW_PHONE_OPTIONAL</option>
              </select>
            </label>
            <button className="button" type="button">
              Suzdai akaunt
            </button>
          </form>
        </div>
        <div className="card">
          <h2>Veche imate akaunt?</h2>
          <p>Vlezte, za da upravlyavate obqvite i signalite.</p>
          <Link className="button secondary" to="/login">
            Vhod
          </Link>
        </div>
      </div>
    </section>
  );
}
