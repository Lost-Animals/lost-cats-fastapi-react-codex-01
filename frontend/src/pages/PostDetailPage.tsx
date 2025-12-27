import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { get } from "../app/api";
import type { CatPost } from "../app/types";

export default function PostDetailPage() {
  const { id } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => get<CatPost>(`/posts/${id}`),
    enabled: Boolean(id)
  });

  if (isLoading) {
    return (
      <section className="page">
        <div className="hero">
          <h1>Zarejdane...</h1>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page">
        <div className="hero">
          <h1>Obqvata ne e namerena.</h1>
          <Link className="button" to="/">
            Kum obqvite
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="hero">
        <span className="tag">
          {post.type} • {post.status}
        </span>
        <h1>{post.title}</h1>
        <p>
          Publikuvana na {new Date(post.created_at).toLocaleDateString()} • Radius
          {" "}{post.location.accuracy_radius_m}m
        </p>
        <div className="hero-actions">
          <Link className="button" to="/posts/new">
            Izprati signal
          </Link>
          <button className="button secondary" type="button">
            Svurji se chrez platformata
          </button>
        </div>
      </div>

      <div className="split">
        <div className="card">
          <h2>Opisanie</h2>
          <p>{post.description}</p>
          <div className="notice">
            Kontaktut se osushtestvyava samo prez platformata.
          </div>
        </div>
        <div className="card">
          <h2>Osnovni danni</h2>
          <div className="form">
            <div className="form-row">
              <label>
                Data
                <input value={new Date(post.event_datetime).toLocaleString()} readOnly />
              </label>
              <label>
                Tochnost
                <input value={post.event_datetime_precision} readOnly />
              </label>
            </div>
            <div className="form-row">
              <label>
                Pol
                <input value={post.cat_profile.sex} readOnly />
              </label>
              <label>
                Vuzrast
                <input value={post.cat_profile.age_group} readOnly />
              </label>
            </div>
            <div className="form-row">
              <label>
                Cvyat
                <input
                  value={`${post.cat_profile.primary_color}${post.cat_profile.secondary_color ? ` / ${post.cat_profile.secondary_color}` : ""}`}
                  readOnly
                />
              </label>
              <label>
                Sharaka
                <input value={post.cat_profile.pattern} readOnly />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Snimki</h2>
        <div className="photo-grid">
          <div className="photo" />
          <div className="photo" />
          <div className="photo" />
        </div>
      </div>
    </section>
  );
}
