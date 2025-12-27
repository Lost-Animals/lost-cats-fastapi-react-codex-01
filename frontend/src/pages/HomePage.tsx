import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { get } from "../app/api";
import type { CatPost } from "../app/types";

export default function HomePage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => get<CatPost[]>("/posts")
  });

  return (
    <section className="page">
      <div className="hero">
        <span className="tag">LostCats platforma</span>
        <h1>Obiavi za izgubeni i namereni kotki.</h1>
        <p>
          Publikuvaite obqvi, proverete mikrochip i namerete suvpadenie po lokaciya,
          vreme i atributi. Kontaktut ostava zashiten v platformata.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/posts/new">
            Publikuvai obqva
          </Link>
          <Link className="button secondary" to="/chip">
            Proveri mikrochip
          </Link>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <h2>Izgubena kotka</h2>
          <p>
            Populni osnovnite danni, data na zaguba, lokaciya i snimki. Sistemata shte
            pokaje predlojeni suvpadenia.
          </p>
        </div>
        <div className="card">
          <h2>Namerena kotka</h2>
          <p>
            Opishete kada e namerena, kude, kak izglejda i dali ima nujda ot vet.
            Platformata vruzva namereni i izgubeni obqvi.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Tursene i filtri</h3>
        <div className="form">
          <div className="form-row">
            <label>
              Tip obqva
              <select defaultValue="LOST">
                <option value="LOST">LOST</option>
                <option value="FOUND">FOUND</option>
              </select>
            </label>
            <label>
              Status
              <select defaultValue="ACTIVE">
                <option value="ACTIVE">ACTIVE</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </label>
            <label>
              Radius (km)
              <select defaultValue="5">
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Grad / rayon
              <input placeholder="Mladost, Plovdiv" />
            </label>
            <label>
              Ot data
              <input type="date" />
            </label>
            <label>
              Do data
              <input type="date" />
            </label>
          </div>
        </div>
      </div>

      <div className="grid two">
        {isLoading ? (
          <div className="card">
            <h3>Zarejdam obqvi...</h3>
          </div>
        ) : posts.length === 0 ? (
          <div className="card">
            <h3>Nyama aktivni obqvi</h3>
            <p>Budete purvite, koito publikuvat obqva.</p>
          </div>
        ) : (
          posts.slice(0, 2).map((post) => (
            <div className="card" key={post.id}>
              <span className="tag">
                {post.type} • {post.status}
              </span>
              <h3>{post.title}</h3>
              <p>
                {post.location.location_label} • {post.location.accuracy_radius_m}m
              </p>
              <Link className="button secondary" to={`/posts/${post.id}`}>
                Vizualizirai obqva
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
