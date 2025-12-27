import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { get } from "../app/api";
import type { CatPost } from "../app/types";

export default function ChipLookupPage() {
  const [chipNumber, setChipNumber] = useState("");
  const { data: posts = [], isFetching, refetch } = useQuery({
    queryKey: ["chip", chipNumber],
    queryFn: () => get<CatPost[]>(`/chip/${chipNumber}`),
    enabled: false
  });

  return (
    <section className="page">
      <div className="hero">
        <span className="tag">Chip lookup</span>
        <h1>Proverka po mikrochip nomer.</h1>
        <p>
          Vurni aktivni obqvi, svurzani s tozi chip. Minimalna informaciya i
          buton za kontakt prez platformata.
        </p>
      </div>

      <div className="split">
        <div className="card">
          <h2>Tursene</h2>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (chipNumber) {
                void refetch();
              }
            }}
          >
            <label>
              Mikrochip nomer
              <input
                placeholder="Vavedete nomer"
                value={chipNumber}
                onChange={(event) => setChipNumber(event.target.value)}
              />
            </label>
            <button className="button" type="submit">
              {isFetching ? "Proveryavam..." : "Proveri"}
            </button>
          </form>
        </div>
        <div className="card">
          <h2>Rezultat</h2>
          {posts.length === 0 ? (
            <div className="notice">Nyama aktivni obqvi za tozi chip.</div>
          ) : (
            <div className="grid">
              {posts.map((post) => (
                <div className="card" key={post.id}>
                  <span className="tag">
                    {post.type} • {post.status}
                  </span>
                  <h3>{post.title}</h3>
                  <p>
                    {post.location.location_label} • {post.location.accuracy_radius_m}m
                  </p>
                  <button className="button secondary" type="button">
                    Svurji se
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
