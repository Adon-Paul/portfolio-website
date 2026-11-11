const credentials = [
  {
    title: "NASA Space Apps Challenge",
    issuer: "NASA International Space Apps Challenge",
    type: "Participation",
    date: "2025",
    detail:
      "Participated in the 4–5 October 2025 challenge. The certificate recognises participation as a Galactic Problem Solver.",
    image: "space-apps-2025",
    alt: "NASA Space Apps 2025 participation certificate issued to Adon Paul",
  },
  {
    title: "Wireless & 5G Security",
    issuer: "IEEE SJCET",
    type: "Webinar participation",
    date: "2024",
    detail:
      "Participated in the Wireless and 5G Security webinar on 28 September 2024.",
    image: "wireless-security",
    alt: "Wireless and 5G Security webinar participation certificate issued to Adon Paul Tomy",
  },
  {
    title: "WeCodeLife internship",
    issuer: "WeCodeLife",
    type: "Internship",
    date: "2023",
    detail:
      "Completed a short internship from 2–16 May 2023. The certificate recognises participation and work during the programme.",
    image: "wecodelife",
    alt: "WeCodeLife internship certificate issued to Adon Paul Tomy for 2 to 16 May 2023",
  },
];
export default function Credentials() {
  return (
    <section className="credentials" aria-labelledby="credentials-title">
      <div className="credentials-heading">
        <div>
          <span className="eyebrow">A FEW MILESTONES</span>
          <h3 id="credentials-title">Beyond the repository.</h3>
        </div>
        <p>Experiences that sit alongside the work.</p>
      </div>
      {credentials.map((item) => (
        <details className="credential" key={item.image}>
          <summary>
            <span className="credential-date">{item.date}</span>
            <span className="credential-title">
              {item.title}
              <span>{item.type}</span>
            </span>
            <span className="disclosure-icon" aria-hidden="true" />
          </summary>
          <div className="credential-body">
            <div>
              <span className="eyebrow">{item.issuer}</span>
              <p>{item.detail}</p>
              <a
                className="inline-link"
                href={`/media/credentials/${item.image}.webp`}
              >
                Open certificate <span aria-hidden="true">↗</span>
              </a>
            </div>
            <img
              src={`/media/credentials/${item.image}.webp`}
              alt={item.alt}
              loading="lazy"
              width="1400"
              height={item.image === "space-apps-2025" ? 1082 : 990}
            />
          </div>
        </details>
      ))}
    </section>
  );
}
