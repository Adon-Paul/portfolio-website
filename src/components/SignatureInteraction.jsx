import { useState } from "react";
export default function SignatureInteraction() {
  const [open, setOpen] = useState(false);
  return (
    <div className={`melody-surface ${open ? "is-inspecting" : ""}`}>
      <div className="surface-top">
        <span className="eyebrow">01 / The listening room</span>
        <button
          className="inspect enhanced"
          aria-expanded={open}
          aria-controls="engineering-notes"
          onClick={() => setOpen(!open)}
        >
          {open ? "Back to the surface" : "Under the hood"}{" "}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </div>
      <div className="record" aria-hidden="true">
        <div className="record-label">
          m
          <span>
            MELODY
            <br />
            SIDE A / LOCAL MUSIC
          </span>
        </div>
      </div>
      <div className="phone">
        <img
          src="/media/melody-phone.webp"
          width="214"
          height="478"
          loading="lazy"
          alt="Melody prototype showing device music and favorites"
        />
      </div>
      <div className="surface-caption">
        <span aria-hidden="true">↳</span> Your library.
        <br />
        Your own rhythm.
      </div>
      <div id="engineering-notes" className="engineering-notes" hidden={!open}>
        <span className="eyebrow">Inside the build</span>
        <h3>One queue, two views.</h3>
        <p>
          The mini player and full player share playback state through Provider.
          The interface changes; the listening session stays connected.
        </p>
        <div
          className="state-diagram"
          aria-label="Library feeds shared playback state, used by mini player and full player"
        >
          <span>Library</span>
          <b aria-hidden="true">↓</b>
          <span>Shared playback state</span>
          <b aria-hidden="true">↙ ↘</b>
          <span>Mini player + Full player</span>
        </div>
      </div>
      <span className="surface-foot eyebrow">
        Flutter · Provider · just_audio
      </span>
    </div>
  );
}
