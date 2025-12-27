import { useState } from "react";
import { useForm } from "react-hook-form";

import { post } from "../app/api";
import type { CatPost, CatPostCreate } from "../app/types";

const toOptionalBoolean = (value: string) => {
  if (value === "unknown") {
    return null;
  }
  return value === "true";
};

export default function PostCreatePage() {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<CatPostCreate>({
    defaultValues: {
      type: "LOST",
      status: "ACTIVE",
      event_datetime_precision: "EXACT",
      location: {
        accuracy_radius_m: 500
      },
      cat_profile: {
        sex: "UNKNOWN",
        age_group: "UNKNOWN",
        size: "UNKNOWN",
        fur_length: "UNKNOWN",
        pattern: "UNKNOWN",
        primary_color: ""
      }
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitStatus(null);

    const payload: CatPostCreate = {
      ...data,
      event_datetime: new Date(data.event_datetime).toISOString(),
      found_care_info:
        data.found_care_info &&
        (data.found_care_info.is_sheltered !== null ||
          data.found_care_info.needs_vet !== null)
          ? data.found_care_info
          : undefined
    };

    await post<CatPost>("/posts", payload);
    setSubmitStatus("Obqvata e publikuvana.");
    reset();
  });

  return (
    <section className="page">
      <div className="hero">
        <span className="tag">Nova obqva</span>
        <h1>Publikuvai obqva za izgubena ili namerena kotka.</h1>
        <p>
          Populni osnovnite danni, lokaciya i opisanie. Snimkite sa do 5, a
          mikrochip e po jelanie.
        </p>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <div className="split">
          <div className="card">
            <h2>Osnovni danni</h2>
            <div className="form">
              <div className="form-row">
                <label>
                  Tip
                  <select {...register("type")}>
                    <option value="LOST">LOST</option>
                    <option value="FOUND">FOUND</option>
                  </select>
                </label>
                <label>
                  Status
                  <select {...register("status")}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </label>
              </div>
              <label>
                Avtor ID
                <input placeholder="User UUID" {...register("author_user_id")} required />
              </label>
              <label>
                Zaglavie
                <input placeholder="Izgubena kotka v Mladost" {...register("title")} required />
              </label>
              <label>
                Opisanie
                <textarea
                  placeholder="Opis, harakteristiki, kontakt prez platformata."
                  {...register("description")}
                  required
                />
              </label>
              <div className="form-row">
                <label>
                  Data i chas
                  <input type="datetime-local" {...register("event_datetime")} required />
                </label>
                <label>
                  Tochnost
                  <select {...register("event_datetime_precision")}>
                    <option value="EXACT">EXACT</option>
                    <option value="APPROXIMATE">APPROXIMATE</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Lokaciya</h2>
            <div className="form">
              <div className="form-row">
                <label>
                  Shirochina
                  <input
                    placeholder="42.698"
                    type="number"
                    step="0.000001"
                    {...register("location.latitude", { valueAsNumber: true })}
                    required
                  />
                </label>
                <label>
                  Daljina
                  <input
                    placeholder="23.319"
                    type="number"
                    step="0.000001"
                    {...register("location.longitude", { valueAsNumber: true })}
                    required
                  />
                </label>
              </div>
              <label>
                Etiket / rayon
                <input placeholder="Mladost, Sofia" {...register("location.location_label")} required />
              </label>
              <label>
                Radius (m)
                <input
                  placeholder="500"
                  type="number"
                  {...register("location.accuracy_radius_m", { valueAsNumber: true })}
                  required
                />
              </label>
            </div>
          </div>
        </div>

        <div className="split">
          <div className="card">
            <h2>Profil na kotkata</h2>
            <div className="form">
              <div className="form-row">
                <label>
                  Ime (po jelanie)
                  <input placeholder="Maca" {...register("cat_profile.name")} />
                </label>
                <label>
                  Pol
                  <select {...register("cat_profile.sex")}>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Vuzrast
                  <select {...register("cat_profile.age_group")}>
                    <option value="KITTEN">KITTEN</option>
                    <option value="ADULT">ADULT</option>
                    <option value="SENIOR">SENIOR</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </label>
                <label>
                  Razmer
                  <select {...register("cat_profile.size")}>
                    <option value="SMALL">SMALL</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LARGE">LARGE</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Dulgina na kozina
                  <select {...register("cat_profile.fur_length")}>
                    <option value="SHORT">SHORT</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LONG">LONG</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </label>
                <label>
                  Sharaka
                  <select {...register("cat_profile.pattern")}>
                    <option value="SOLID">SOLID</option>
                    <option value="TABBY">TABBY</option>
                    <option value="TUXEDO">TUXEDO</option>
                    <option value="CALICO">CALICO</option>
                    <option value="OTHER">OTHER</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Osnoven cvyat
                  <input placeholder="Siv" {...register("cat_profile.primary_color")} required />
                </label>
                <label>
                  Dopalnitelen cvyat
                  <input placeholder="Byal" {...register("cat_profile.secondary_color")} />
                </label>
              </div>
              <label>
                Otlichitelni belezi
                <textarea placeholder="Beli lapichki, zelni ochi." {...register("cat_profile.distinctive_marks")} />
              </label>
            </div>
          </div>

          <div className="card">
            <h2>Dopalnitelni danni</h2>
            <div className="form">
              <div className="form-row">
                <label>
                  Mikrochip
                  <input placeholder="15-cifren nomer" {...register("chip_number")} />
                </label>
                <label>
                  Pasport
                  <input placeholder="Nomera na pasport" {...register("passport_number")} />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Kastrirana
                  <select
                    defaultValue="unknown"
                    {...register("cat_profile.is_neutered", {
                      setValueAs: toOptionalBoolean
                    })}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                    <option value="unknown">unknown</option>
                  </select>
                </label>
                <label>
                  Nujda ot vet
                  <select
                    defaultValue="unknown"
                    {...register("found_care_info.needs_vet", {
                      setValueAs: toOptionalBoolean
                    })}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                    <option value="unknown">unknown</option>
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label>
                  Priyutena
                  <select
                    defaultValue="unknown"
                    {...register("found_care_info.is_sheltered", {
                      setValueAs: toOptionalBoolean
                    })}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                    <option value="unknown">unknown</option>
                  </select>
                </label>
              </div>
              <label>
                Zdravejni belejki
                <textarea placeholder="Nabludeni problemi ili opazeni nuzhdi." {...register("cat_profile.health_notes")} />
              </label>
              <div className="notice">
                Found obqvite iziskvat dopulnitelna informaciya za priyut i vet.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Snimki (do 5)</h2>
          <div className="photo-grid">
            <div className="photo" />
            <div className="photo" />
            <div className="photo" />
            <div className="photo" />
            <div className="photo" />
          </div>
        </div>

        <button className="button" type="submit">
          Publikuvai
        </button>
      </form>

      {submitStatus ? <div className="notice">{submitStatus}</div> : null}
    </section>
  );
}
