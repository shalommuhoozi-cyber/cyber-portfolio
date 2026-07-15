const networkTools = [
  "GNS3",
  "MikroTik RouterOS",
  "Ubuntu Linux",
  "Open vSwitch",
  "Snort IDS",
  "BGP",
  "IPsec VPN",
  "PKI / TLS",
  "DNS",
  "Apache",
  "SMTP",
  "SSH",
  "NAT",
  "Bash",
];

const capabilityGroups = [
  {
    code: "SEC",
    title: "Cybersecurity & networks",
    items: [
      "Network security",
      "Firewall design",
      "IDS / Snort",
      "Threat analysis",
      "Wireshark",
      "Linux CLI",
    ],
  },
  {
    code: "DEV",
    title: "Programming & data",
    items: ["Python", "SQL", "Java", "JavaScript", "Bash", "Database design"],
  },
  {
    code: "ADV",
    title: "Strategy & communication",
    items: [
      "Risk assessment",
      "Market research",
      "Digital channel analysis",
      "Stakeholder reporting",
      "Cross-functional delivery",
    ],
  },
];

const credentials = [
  {
    year: "2024—2026",
    title: "Bachelor of Information Technology",
    meta: "Cybersecurity · Monash University, Melbourne",
    detail: "Distinction WAM · Graduating December 2026",
  },
  {
    year: "2022—2023",
    title: "Monash University Foundation Year",
    meta: "Monash College, Melbourne",
    detail: "High Distinctions in English, Mathematics and Accounting",
  },
  {
    year: "2020—2022",
    title: "International GCSE",
    meta: "Galaxy International School Uganda, Kampala",
    detail: "A* Environmental Management · A Mathematics · A Physics",
  },
];

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Shalom Rubaramira, home">
          <span className="brand-mark">SR</span>
          <span className="brand-copy">
            <strong>SHALOM RUBARAMIRA</strong>
            <small>CYBERSECURITY · MELBOURNE</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#capabilities">Capabilities</a>
          <a className="nav-contact" href="#contact">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy" id="content">
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            FINAL-YEAR CYBERSECURITY STUDENT · GRADUATING 2026
          </div>

          <h1 id="hero-title">
            Secure systems.
            <br />
            <span>Clear thinking.</span>
          </h1>

          <p className="hero-intro">
            I&apos;m Shalom—a Monash cybersecurity student turning network
            architecture, risk assessment and technical research into resilient,
            explainable outcomes.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore selected work <span aria-hidden="true">↓</span>
            </a>
            <a
              className="button button-secondary"
              href="/Shalom-Rubaramira-Resume.pdf"
              download
            >
              Download résumé <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="system-card" aria-label="Professional profile summary">
          <div className="system-card-head">
            <span>SYS.PROFILE / 01</span>
            <span className="system-live">ONLINE</span>
          </div>

          <div className="network-map" aria-hidden="true">
            <div className="node node-core">SR</div>
            <div className="node node-a">NET</div>
            <div className="node node-b">RISK</div>
            <div className="node node-c">DATA</div>
            <div className="node node-d">COMMS</div>
            <span className="link link-a" />
            <span className="link link-b" />
            <span className="link link-c" />
            <span className="link link-d" />
            <span className="scan-line" />
          </div>

          <div className="system-metrics">
            <div>
              <strong>03</strong>
              <span>campus network</span>
            </div>
            <div>
              <strong>09</strong>
              <span>access scenarios</span>
            </div>
            <div>
              <strong>D</strong>
              <span>Monash WAM</span>
            </div>
          </div>

          <div className="system-card-foot">
            <span>CARLTON, MELBOURNE VIC</span>
            <span>UTC+10</span>
          </div>
        </div>

        <div className="hero-index" aria-hidden="true">
          <span>01</span>
          <span>PORTFOLIO / 2026</span>
        </div>
      </section>

      <section className="section profile-section" aria-labelledby="profile-title">
        <div className="section-label">
          <span>01</span>
          <p>PROFILE</p>
        </div>
        <div className="profile-content">
          <h2 id="profile-title">
            Technical depth,
            <br />
            <span>translated clearly.</span>
          </h2>
          <div className="profile-copy">
            <p>
              I combine hands-on delivery in network security architecture,
              systems documentation and risk assessment with experience creating
              strategy and stakeholder-facing work for an early-stage AI product.
            </p>
            <p>
              My approach is analytical and evidence-led: understand the system,
              test the assumptions, document the result, then make it useful to the
              people making decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading-row">
          <div className="section-label">
            <span>02</span>
            <p>SELECTED WORK</p>
          </div>
          <p className="section-note">PROJECTS / SIMULATIONS / 2025—2026</p>
        </div>

        <article className="feature-project">
          <div className="project-number">01</div>
          <div className="project-main">
            <div className="project-kicker">
              <span>MONASH UNIVERSITY · 2026</span>
              <span>NETWORK SECURITY</span>
            </div>
            <h2 id="work-title">Secure multi-campus enterprise network</h2>
            <p className="project-lead">
              Architected and deployed a simulated three-campus enterprise network
              with segmented LANs, resilient routing, encrypted tunnels and
              practical intrusion detection.
            </p>

            <div className="project-outcomes">
              <div>
                <span className="outcome-marker">A</span>
                <p>
                  Built BGP inter-campus routing, site-to-site IPsec and remote
                  access VPNs with split tunnelling.
                </p>
              </div>
              <div>
                <span className="outcome-marker">B</span>
                <p>
                  Enforced least privilege with restrictive firewall policies
                  across nine service-level access scenarios.
                </p>
              </div>
              <div>
                <span className="outcome-marker">C</span>
                <p>
                  Deployed a complete PKI, TLS-enabled services and Snort IDS with
                  custom rules for scan and DoS-style activity.
                </p>
              </div>
              <div>
                <span className="outcome-marker">D</span>
                <p>
                  Validated routing, tunnels, controls and live alerting, capturing
                  the results as client-ready technical evidence.
                </p>
              </div>
            </div>

            <div className="tag-list" aria-label="Project tools">
              {networkTools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="secondary-project">
          <div className="project-number">02</div>
          <div>
            <div className="project-kicker">
              <span>MASTERCARD · FORAGE · 2025</span>
              <span>SECURITY AWARENESS</span>
            </div>
            <h3>Security awareness analyst simulation</h3>
          </div>
          <p>
            Assessed phishing vulnerabilities and control effectiveness, analysed
            behaviour patterns for social-engineering risk, and translated the
            findings into clear recommendations for non-technical stakeholders.
          </p>
        </article>
      </section>

      <section
        className="section experience-section"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="section-heading-row">
          <div className="section-label">
            <span>03</span>
            <p>EXPERIENCE</p>
          </div>
          <p className="section-note">FIELD LOG</p>
        </div>

        <div className="experience-grid">
          <div className="experience-title-block">
            <p className="mono-line">CURRENT ROLE</p>
            <h2 id="experience-title">AI Marketing Strategy Intern</h2>
            <p className="experience-company">Tagline · Jun 2026—Present</p>
          </div>
          <div className="experience-copy">
            <p>
              Contributing to growth strategy for an AI-powered personal branding
              platform, using structured research to understand competitors,
              channels, users and market position.
            </p>
            <ul>
              <li>
                Researching AI writing, personal branding and content workflow
                products to identify differentiated positioning.
              </li>
              <li>
                Analysing TikTok, Instagram Reels, YouTube Shorts, LinkedIn, Reddit
                and Threads for organic growth opportunities.
              </li>
              <li>
                Translating AI-assisted product features into clear messages for
                students, professionals and startup teams.
              </li>
              <li>
                Collaborating across strategy, campaign concepts, creative assets
                and presentation deliverables.
              </li>
            </ul>
          </div>
        </div>

        <div className="experience-bridge">
          <span>BEYOND THE SCREEN</span>
          <p>
            Volunteer, Catering & Shelter Support · Duke of Edinburgh&apos;s Award,
            Mauritius · February 2022
          </p>
          <small>
            Community service · Cross-cultural teamwork · Practical adaptability
          </small>
        </div>
      </section>

      <section
        className="section capability-section"
        id="capabilities"
        aria-labelledby="capabilities-title"
      >
        <div className="section-heading-row">
          <div className="section-label">
            <span>04</span>
            <p>CAPABILITIES</p>
          </div>
          <p className="section-note">TOOLS + METHODS</p>
        </div>

        <div className="capability-intro">
          <h2 id="capabilities-title">A toolkit built across systems and people.</h2>
          <p>
            Security works best when the technical controls, evidence and human
            context all connect.
          </p>
        </div>

        <div className="capability-grid">
          {capabilityGroups.map((group) => (
            <article key={group.code} className="capability-card">
              <div className="capability-code">{group.code}</div>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section education-section" aria-labelledby="education-title">
        <div className="section-heading-row">
          <div className="section-label">
            <span>05</span>
            <p>EDUCATION</p>
          </div>
          <p className="section-note">LEARNING RECORD</p>
        </div>

        <h2 id="education-title" className="visually-hidden">
          Education and certifications
        </h2>

        <div className="education-list">
          {credentials.map((credential) => (
            <article key={credential.title}>
              <p className="education-year">{credential.year}</p>
              <div>
                <h3>{credential.title}</h3>
                <p>{credential.meta}</p>
              </div>
              <p className="education-detail">{credential.detail}</p>
            </article>
          ))}
        </div>

        <div className="certification-grid">
          <div>
            <span>2025</span>
            <p>Mastercard Cybersecurity Virtual Experience</p>
            <small>FORAGE</small>
          </div>
          <div>
            <span>2024</span>
            <p>Red Bull Wings for Life Charity Run</p>
            <small>TOP 100 NATIONALLY · MELBOURNE</small>
          </div>
          <div>
            <span>2022</span>
            <p>Duke of Edinburgh&apos;s Award</p>
            <small>BRONZE CERTIFICATION</small>
          </div>
          <div>
            <span>2021—22</span>
            <p>Preservation of the School Environment</p>
            <small>BEST IN CATEGORY</small>
          </div>
        </div>
      </section>

      <footer id="contact" className="contact-section">
        <div className="contact-radar" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className="contact-content">
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            OPEN TO CYBERSECURITY, DIGITAL SYSTEMS & DATA OPPORTUNITIES
          </div>
          <h2>
            Let&apos;s build something
            <br />
            <span>worth securing.</span>
          </h2>
          <p>
            I&apos;m based in Carlton, Melbourne and graduating at the end of 2026.
          </p>
          <div className="contact-links">
            <a href="mailto:shalommuhoozi@gmail.com">
              <small>EMAIL</small>
              <span>shalommuhoozi@gmail.com ↗</span>
            </a>
            <a href="tel:+61404541339">
              <small>PHONE</small>
              <span>0404 541 339 ↗</span>
            </a>
          </div>
        </div>
        <div className="footer-meta">
          <span>© 2026 SHALOM RUBARAMIRA</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
