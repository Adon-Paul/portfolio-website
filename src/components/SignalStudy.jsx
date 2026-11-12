import { useState } from "react";

const paths = [
  {
    key: "read",
    label: "Read text",
    engine: "LOCAL / ML KIT",
    title: "A page becomes a voice.",
    detail:
      "Text recognition runs on the device. Reading-order sorting and speech chunks turn a camera frame into a more usable spoken sequence.",
    nodes: ["CAMERA", "LOCAL OCR", "ORDER + CHUNK", "SPEECH"],
  },
  {
    key: "scene",
    label: "Describe a scene",
    engine: "CONFIGURABLE / AI",
    title: "A scene needs context.",
    detail:
      "Scene understanding depends on provider choice. Configured cloud services can fall back to another provider; local models are optional and depend on device capacity.",
    nodes: ["CAMERA", "PROVIDER ROUTE", "DESCRIPTION", "SPEECH"],
  },
  {
    key: "objects",
    label: "Identify objects",
    engine: "DETECTION / YOLO",
    title: "Say what matters. Once.",
    detail:
      "Object detections feed a persistent, debounced announcement path. The intent is to avoid repeating every detection in every frame. Real-world walking behaviour still needs tuning.",
    nodes: ["CAMERA", "DETECTION", "DEBOUNCE", "SPEECH"],
  },
];

export default function SignalStudy({
  id = "signal",
  headingTag: Heading = "h4",
}) {
  const [selected, setSelected] = useState(0);
  const path = paths[selected];
  return (
    <div className={`signal-study signal-${path.key}`}>
      <div className="instrument-label">
        <span>LUMISENSE / SYSTEM STUDY</span>
        <span>INPUT → UNDERSTANDING → VOICE</span>
      </div>
      <div
        className="signal-controls enhanced"
        role="group"
        aria-label="Explore LumiSense processing paths"
      >
        {paths.map((item, i) => (
          <button
            key={item.key}
            aria-pressed={selected === i}
            aria-controls={`${id}-description`}
            onClick={() => setSelected(i)}
          >
            <span aria-hidden="true">0{i + 1}</span> {item.label}
          </button>
        ))}
      </div>
      <div className="signal-stage" aria-hidden="true">
        <svg viewBox="0 0 1000 390" fill="none">
          <defs>
            <linearGradient id={`${id}-light`}>
              <stop stopColor="#ff9a62" stopOpacity="0" />
              <stop offset=".6" stopColor="#ff9a62" stopOpacity=".3" />
              <stop offset="1" stopColor="#ff9a62" stopOpacity=".02" />
            </linearGradient>
          </defs>
          <path d="M52 110L460 164V226L52 305Z" fill={`url(#${id}-light)`} />
          <path d="M480 164L910 82V310L480 226Z" fill={`url(#${id}-light)`} />
          {[86, 119, 152, 185, 218, 251, 284].map((y, i) => (
            <path
              key={y}
              className="signal-ray"
              d={`M52 ${y} L468 ${183 + i * 4} L921 ${y}`}
            />
          ))}
          <path className="signal-axis" d="M20 195H980M470 22V365" />
          {Array.from({ length: 19 }, (_, i) => (
            <ellipse
              key={i}
              cx={470}
              cy={195}
              rx={25 + i * 5.4}
              ry={51 + i * 6.6}
              className="signal-lens"
              transform={`rotate(${(i - 9) * 1.7} 470 195)`}
            />
          ))}
          <circle cx="470" cy="195" r="12" fill="#ff9a62" />
          <path
            className="signal-bracket"
            d="M52 117V87H82M52 273V303H82M132 87H162V117M132 303H162V273"
          />
          <g className="signal-voice">
            {Array.from({ length: 35 }, (_, i) => (
              <path
                key={i}
                className="signal-wave"
                d={`M${750 + i * 5} ${195 - (12 + Math.sin(i * 0.64) * Math.cos(i * 0.23) * 58)}v${(12 + Math.sin(i * 0.64) * Math.cos(i * 0.23) * 58) * 2}`}
              />
            ))}
          </g>
          <circle
            className="signal-packet"
            cx="52"
            cy="195"
            r="4"
            fill="currentColor"
          />
          <text x="52" y="345">
            01 / PERCEIVE
          </text>
          <text x="410" y="380">
            02 / PROCESS
          </text>
          <text x="810" y="345">
            03 / SPEAK
          </text>
        </svg>
        <span className="signal-engine">{path.engine}</span>
      </div>
      <ol className="signal-route" aria-label="Selected processing path">
        {path.nodes.map((node, i) => (
          <li key={`${i}-${node}`}>
            <span>0{i + 1}</span>
            {node}
          </li>
        ))}
      </ol>
      <div
        className="signal-description"
        id={`${id}-description`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <Heading>{path.title}</Heading>
        <p>{path.detail}</p>
      </div>
      <p className="instrument-footnote">
        Architecture illustration · explore how the app is organised
      </p>
    </div>
  );
}
