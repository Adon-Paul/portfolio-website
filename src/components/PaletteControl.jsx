import { useEffect, useRef, useState } from "react";
import {
  paletteTokens,
  originalPalette,
  paletteCSS,
  normalizeColor,
  validatePalette,
  readPalette,
  applyPalette,
  presets,
  PALETTE_KEY,
  SAVED_KEY,
} from "../content/palette";
import "./PaletteControl.css";
export function PaletteDefaults() {
  return <style data-palette-defaults>{paletteCSS}</style>;
}
function readSaved() {
  try {
    const data = JSON.parse(localStorage.getItem(SAVED_KEY));
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (x) =>
          typeof x?.name === "string" &&
          x.name.length > 0 &&
          x.name.length <= 40 &&
          validatePalette(x),
      )
      .slice(0, 8);
  } catch {
    return [];
  }
}
function ColorField({ token, value, onChange, resetKey }) {
  const [draft, setDraft] = useState(value);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setDraft(value);
    setInvalid(false);
  }, [value, resetKey]);
  const alpha = value.length === 9 ? value.slice(7) : "";
  function commit() {
    const valid = normalizeColor(draft);
    if (valid) {
      setInvalid(false);
      onChange(valid);
    } else setInvalid(true);
  }
  return (
    <div className="palette-field">
      <label htmlFor={`palette-${token.key}`}>{token.label}</label>
      <div className="palette-inputs">
        <input
          type="color"
          aria-label={`${token.label} picker`}
          value={value.slice(0, 7)}
          onChange={(e) => onChange(e.target.value + alpha)}
        />
        <input
          id={`palette-${token.key}`}
          aria-label={`${token.label} HEX`}
          aria-invalid={invalid}
          aria-describedby={invalid ? `palette-error-${token.key}` : undefined}
          value={draft}
          maxLength={9}
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
      </div>
      {invalid && (
        <p id={`palette-error-${token.key}`} className="palette-error">
          Use #RGB, #RRGGBB or a hex colour with alpha.
        </p>
      )}
    </div>
  );
}
export default function PaletteControl() {
  const [revision, setRevision] = useState(0);
  const [colors, setColors] = useState({ ...originalPalette });
  const [saved, setSaved] = useState([]);
  const [name, setName] = useState("");
  const [json, setJSON] = useState("");
  const [message, setMessage] = useState("");
  const [preset, setPreset] = useState("original");
  const [chosen, setChosen] = useState("");
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    const next = readPalette();
    setColors(next);
    applyPalette(next);
    setSaved(readSaved());
    setPreset(
      Object.keys(presets).find(
        (key) => JSON.stringify(presets[key].colors) === JSON.stringify(next),
      ) || "custom",
    );
  }, []);
  function update(next, label = "custom", resetFields = true) {
    if (resetFields) setRevision((value) => value + 1);
    setChosen("");
    setColors({ ...next });
    setPreset(label);
    applyPalette(next);
    setMessage("");
    try {
      localStorage.setItem(
        PALETTE_KEY,
        JSON.stringify({ version: 1, colors: next }),
      );
    } catch {
      setMessage(
        "Preview applied. Browser storage is unavailable; export JSON to keep it.",
      );
    }
  }
  function save() {
    const title = name.trim();
    if (!title) {
      setMessage("Enter a name for this combination.");
      return;
    }
    const next = [
      ...saved.filter((item) => item.name !== title),
      { name: title, version: 1, colors: { ...colors } },
    ].slice(-8);
    setSaved(next);
    setChosen(title);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setMessage(`Saved “${title}” in this browser.`);
    } catch {
      setMessage("Saved for this visit. Export JSON to keep this combination.");
    }
  }
  function importJSON() {
    try {
      const next = validatePalette(JSON.parse(json));
      if (!next) throw Error();
      update(next);
      setMessage("Palette imported.");
    } catch {
      setMessage(
        "Invalid palette. Import a complete exported palette with valid hex colours.",
      );
    }
  }
  function exportJSON() {
    const data = JSON.stringify({ version: 1, colors }, null, 2);
    setJSON(data);
    setMessage("Current palette is ready in the JSON field.");
    return data;
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([exportJSON()], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "adon-palette.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <button
        ref={trigger}
        className="palette-launch enhanced"
        aria-label="Open palette controls"
        onClick={() => {
          dialog.current.showModal();
          setMessage("");
        }}
      >
        Palette <span aria-hidden="true" className="palette-launch-swatch" />
      </button>
      <dialog
        ref={dialog}
        className="palette-dialog"
        aria-labelledby="palette-title"
        onClose={() => trigger.current?.focus()}
      >
        <div className="palette-top">
          <h2 id="palette-title">Palette studio</h2>
          <button
            onClick={() => dialog.current.close()}
            aria-label="Close palette controls"
          >
            Close
          </button>
        </div>
        <p className="palette-help">
          Preview colours in your browser. Visitors keep the published palette.
          Reset restores every original value.
        </p>
        <div className="palette-actions">
          <label>
            Preset
            <select
              aria-label="Preset"
              value={preset}
              onChange={(e) => {
                setChosen("");
                update(presets[e.target.value].colors, e.target.value);
              }}
            >
              <option value="custom" disabled>
                Custom
              </option>
              {Object.entries(presets).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => {
              setChosen("");
              update(originalPalette, "original");
            }}
          >
            Reset to original
          </button>
        </div>
        <fieldset className="palette-core">
          <legend>Main colours</legend>
          {paletteTokens
            .filter((t) => t.group === "Core")
            .map((t) => (
              <ColorField
                key={t.key}
                token={t}
                resetKey={revision}
                value={colors[t.key]}
                onChange={(value) =>
                  update({ ...colors, [t.key]: value }, "custom", false)
                }
              />
            ))}
        </fieldset>
        <details className="palette-advanced">
          <summary>All detail colours</summary>
          <p className="palette-help">
            Eight-digit hex values include opacity. Artwork, borders and text
            follow these values; photos, videos and PDFs keep their original
            colours.
          </p>
          {["Text", "Lines", "Artwork", "Utilities"].map((group) => (
            <fieldset key={group}>
              <legend>{group}</legend>
              {paletteTokens
                .filter((t) => t.group === group)
                .map((t) => (
                  <ColorField
                    key={t.key}
                    token={t}
                    resetKey={revision}
                    value={colors[t.key]}
                    onChange={(value) =>
                      update({ ...colors, [t.key]: value }, "custom", false)
                    }
                  />
                ))}
            </fieldset>
          ))}
        </details>
        <fieldset>
          <legend>Your combinations</legend>
          <label>
            Combination name
            <input
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight blue"
            />
          </label>
          <button onClick={save}>Save combination</button>
          <label>
            Saved combination
            <select
              aria-label="Saved combination"
              value={chosen}
              onChange={(e) => {
                const item = saved.find((x) => x.name === e.target.value);
                if (item) update(item.colors);
                setChosen(e.target.value);
              }}
            >
              <option value="">Choose a saved combination</option>
              {saved.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          {chosen && (
            <button
              onClick={() => {
                const next = saved.filter((item) => item.name !== chosen);
                setSaved(next);
                setChosen("");
                try {
                  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
                } catch {
                  setMessage("Removed for this visit only.");
                }
              }}
            >
              Delete saved combination
            </button>
          )}
        </fieldset>
        <details className="palette-transfer">
          <summary>Import / export</summary>
          <div className="palette-actions">
            <button onClick={exportJSON}>Export JSON</button>
            <button onClick={download}>Download JSON</button>
          </div>
          <label>
            Palette JSON
            <textarea
              aria-label="Palette JSON"
              value={json}
              onChange={(e) => setJSON(e.target.value)}
              spellCheck={false}
              maxLength={20000}
              rows={6}
            />
          </label>
          <button onClick={importJSON}>Import JSON</button>
          <p className="palette-help">
            Export a combination to use it on another device or make it the
            published default later.
          </p>
        </details>
        <p className="palette-message" role="status" aria-live="polite">
          {message}
        </p>
      </dialog>
    </>
  );
}
