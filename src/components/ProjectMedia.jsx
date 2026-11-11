// Silent recordings have adjacent scene-by-scene text alternatives.
import { useState, useRef, useEffect } from "react";

export default function ProjectMedia({ project }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef(null);
  const downloadRef = useRef(null);
  useEffect(() => {
    if (playing && !failed) videoRef.current?.focus();
    if (failed && document.activeElement === document.body)
      downloadRef.current?.focus();
  }, [playing, failed]);
  function pauseOtherDemos(event) {
    document.querySelectorAll("video[data-project-demo]").forEach((video) => {
      if (video !== event.currentTarget) video.pause();
    });
  }
  if (!project.video) return null;
  return (
    <figure className="demo">
      <div className="demo-screen">
        {playing && !failed ? (
          <video
            data-project-demo
            src={project.video}
            poster={project.poster}
            ref={videoRef}
            tabIndex={0}
            muted
            controls
            autoPlay
            playsInline
            preload="none"
            onPlay={pauseOtherDemos}
            onError={() => setFailed(true)}
            aria-label={`${project.title} interface demonstration`}
          />
        ) : (
          <img
            src={project.poster}
            alt={`${project.title} prototype recording`}
            width="1280"
            height="720"
            loading="lazy"
          />
        )}
        {failed && (
          <button
            className="demo-play enhanced"
            onClick={() => setFailed(false)}
          >
            Retry {project.title} demo <span aria-hidden="true">↻</span>
          </button>
        )}
        {!playing && (
          <button
            className="demo-play enhanced"
            onClick={() => setPlaying(true)}
          >
            Play {project.title} demo <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      <figcaption>
        {failed ? (
          <span role="status">The video could not load. </span>
        ) : (
          "Prototype recording · visual walkthrough · no narration. "
        )}
        <a ref={downloadRef} href={project.video}>
          Download the demo
        </a>
      </figcaption>
      <details className="demo-transcript">
        <summary>Read the demo walkthrough</summary>
        <ol>
          {project.demoSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
