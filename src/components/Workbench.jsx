import { useState } from "react";
const tracks = ["Track 01", "Track 02", "Track 03"];
const sample =
  "A camera sees a frame. A person needs context. The interesting part is deciding what happens between the two.";
function describeText(text) {
  const words = text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
  const sentences = text
    .split(/[.!?]+/u)
    .filter((part) => /[\p{L}\p{N}]/u.test(part)).length;
  return {
    words: words.length,
    sentences,
    average: sentences ? Number((words.length / sentences).toFixed(1)) : 0,
  };
}
export default function Workbench() {
  const [track, setTrack] = useState(0);
  const [text, setText] = useState(sample);
  const metrics = describeText(text);
  return (
    <section className="workbench" aria-labelledby="workbench-title">
      <div className="workbench-heading">
        <div>
          <span className="eyebrow">SMALL INTERACTIONS. BIGGER QUESTIONS.</span>
          <h3 id="workbench-title">Open the workings.</h3>
        </div>
        <p>
          Two hands-on studies of ideas inside the projects.
          <br />
          Built for this portfolio. Yours to play with.
        </p>
      </div>
      <div className="study-grid">
        <article className="queue-study">
          <div className="study-label">
            <span>STUDY 01 / MELODY</span>
            <span>STATE</span>
          </div>
          <h4 id="queue-study">
            Two views.
            <br />
            <em>One source of truth.</em>
          </h4>
          <p>
            A music app has more than one player view. Select a track and watch
            the full player and mini player agree.
          </p>
          <div className="queue-model">
            <div className="queue-full" data-testid="queue-full">
              <span className="eyebrow">FULL PLAYER</span>
              <div className="record-glyph" aria-hidden="true" />
              <strong>{tracks[track]}</strong>
              <span className="queue-track-note">
                Synthetic queue · interface study
              </span>
            </div>
            <div
              className="queue-options enhanced"
              role="group"
              aria-label="Select a synthetic queue item"
            >
              {tracks.map((name, i) => (
                <button
                  key={name}
                  aria-label={`Select ${name}`}
                  aria-pressed={track === i}
                  onClick={() => setTrack(i)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="queue-mini" data-testid="queue-mini">
              <div>
                <span className="eyebrow">MINI PLAYER</span>
                <strong>{tracks[track]}</strong>
              </div>
              <button
                className="enhanced"
                onClick={() => setTrack((track + 1) % tracks.length)}
                aria-label="Next track"
              >
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <p className="study-takeaway">
            <strong>The decision:</strong> share playback state, rather than
            keeping a separate queue in each screen. Melody uses Provider to
            connect the views.
          </p>
          <a className="inline-link" href="/work/melody/">
            Inside Melody <span aria-hidden="true">↗</span>
          </a>
        </article>
        <article className="text-study">
          <div className="study-label">
            <span>STUDY 02 / STYLE TRANSFER AI</span>
            <span>LANGUAGE</span>
          </div>
          <h4 id="language-study">
            A voice has
            <br />
            <em>a rhythm.</em>
          </h4>
          <p>
            Long sentences wander. Short ones land. Edit this passage to see how
            a few simple measurements change.
          </p>
          <div className="text-model">
            <label htmlFor="study-text">Text to inspect</label>
            <textarea
              id="study-text"
              className="enhanced"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={4000}
              spellCheck={false}
            />
            <p className="static-sample">{sample}</p>
            <dl className="text-metrics" aria-live="polite" aria-atomic="true">
              <div>
                <dt>WORDS</dt>
                <dd data-testid="word-count">{metrics.words}</dd>
              </div>
              <div>
                <dt>SENTENCES</dt>
                <dd data-testid="sentence-count">{metrics.sentences}</dd>
              </div>
              <div>
                <dt>WORDS / SENTENCE</dt>
                <dd data-testid="sentence-length">{metrics.average}</dd>
              </div>
            </dl>
            <p className="text-method">
              Local text counts · punctuation-based sentence boundaries
              <br />
              Your text stays in this page.
            </p>
          </div>
          <p className="study-takeaway">
            <strong>The next layer:</strong> Style Transfer AI combines
            statistical and model-assisted analysis into writing profiles. These
            counts are a starting point, not a full description of a voice.
          </p>
          <a className="inline-link" href="/work/style-transfer-ai/">
            Inside the writing tool <span aria-hidden="true">↗</span>
          </a>
        </article>
      </div>
    </section>
  );
}
