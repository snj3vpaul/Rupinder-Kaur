import { Icon } from "@/components/Icons";
import Reveal from "@/components/Reveal";
import {
  profile,
  links,
  about,
  hobbies,
  skills,
  experience,
  projects,
  certifications,
  education,
} from "@/data/content";

export default function Home() {
  const hasLinks = links.email || links.linkedin || links.github || links.resume;

  return (
    <>
      <Reveal />

      {/* NAV */}
      <nav className="nav">
        <a href="#top" className="nav-logo">
          {profile.initials}<span className="dot">.</span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="hero">
        <div className="hero-mesh" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="hero-tag reveal">{profile.role} — {profile.location}</p>
            <h1 className="reveal d1">
              {profile.name.split(" ")[0]}
              <br />
              <span className="line2">{profile.name.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="hero-sub reveal d2">{profile.intro}</p>
            <div className="hero-meta reveal d3">
              <span className="chip">SDET</span>
              <span className="chip">Automation</span>
              <span className="chip">Quality Engineering</span>
              <span className="chip">CI/CD</span>
            </div>
            <div className="hero-cta reveal d4">
              <a href="#work" className="btn">
                See my work <Icon name="arrow" size={18} />
              </a>
              <a href="#contact" className="btn ghost">Get in touch</a>
            </div>
          </div>

          <div className="monogram reveal d2">
            <div className="monogram-ring" />
            <div className="monogram-ring r2" />
            <div className="monogram-core">
              <span>{profile.initials}</span>
            </div>
            <span className="badge b1">{"{ test }"}</span>
            <span className="badge b2">automate()</span>
            <span className="badge b3">ship ✓</span>
          </div>
        </div>
      </header>

      {/* ABOUT + HOBBIES */}
      <section id="about">
        <div className="wrap">
          <span className="eyebrow reveal">Who I am</span>
          <h2 className="section-title reveal d1">
            Engineering quality, <em>with character.</em>
          </h2>
          <div className="about-grid" style={{ marginTop: "46px" }}>
            <div className="about-body reveal d2">
              {about.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="hobby-list">
              {hobbies.map((h, i) => (
                <div className={`hobby reveal d${i + 1}`} key={h.title}>
                  <div className="hobby-icon">
                    <Icon name={h.icon} size={26} />
                  </div>
                  <div>
                    <h3>{h.title}</h3>
                    <p>{h.blurb}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="skills">
        <div className="wrap">
          <span className="eyebrow reveal">Toolbox</span>
          <h2 className="section-title reveal d1">
            Skills &amp; <em>tech stack</em>
          </h2>
          <div className="skills-grid">
            {skills.map((s, i) => (
              <div className={`skill-card reveal d${(i % 4) + 1}`} key={s.group}>
                <h3>{s.group}</h3>
                <div className="tags">
                  {s.items.map((it) => (
                    <span className="tag" key={it}>{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="wrap">
          <span className="eyebrow reveal">The journey</span>
          <h2 className="section-title reveal d1">
            Experience <em>timeline</em>
          </h2>
          <div className="timeline">
            {experience.map((e, i) => (
              <div className={`tl-item reveal d${(i % 3) + 1}`} key={e.company + e.period}>
                <div className="tl-head">
                  <div>
                    <div className="tl-role">{e.role}</div>
                    <div className="tl-company">{e.company}</div>
                    <div className="tl-loc">
                      <Icon name="pin" /> {e.location}
                    </div>
                  </div>
                  <div className="tl-period">{e.period}</div>
                </div>
                {e.points.length > 0 && (
                  <ul className="tl-points">
                    {e.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="work" className="projects">
        <div className="wrap">
          <span className="eyebrow reveal">Selected work</span>
          <h2 className="section-title reveal d1">
            Projects <em>showcase</em>
          </h2>
          <div className="proj-grid">
            {projects.map((p, i) => (
              <div className={`proj-card reveal d${(i % 4) + 1}`} key={p.title}>
                <span className="proj-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.blurb}</p>
                <div className="proj-stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRAS */}
      <section id="extras">
        <div className="wrap">
          <div className="extras-grid">
            <div>
              <span className="eyebrow reveal">Credentials</span>
              <h2 className="section-title reveal d1" style={{ fontSize: "2rem" }}>
                Certifications
              </h2>
              <div className="cert-list">
                {certifications.map((c, i) => (
                  <div className={`cert reveal d${(i % 4) + 1}`} key={c}>
                    <span className="star"><Icon name="star" /></span>
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="eyebrow reveal">Foundations</span>
              <h2 className="section-title reveal d1" style={{ fontSize: "2rem" }}>
                Education
              </h2>
              <div className="edu">
                {education.map((e, i) => (
                  <div className={`edu-item reveal d${i + 1}`} key={e.school}>
                    <h4>{e.school}</h4>
                    <div className="deg">{e.degree}</div>
                    <div className="per">{e.period}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="wrap">
          <span className="eyebrow reveal" style={{ display: "inline-flex" }}>Say hello</span>
          <h2 className="reveal d1">
            Let&apos;s build something <em>reliable.</em>
          </h2>
          <p className="reveal d2">
            Open to conversations about quality engineering, automation, and the
            craft of shipping software people can trust.
          </p>
          <div className="contact-links reveal d3">
            {links.email && (
              <a className="btn" href={`mailto:${links.email}`}>
                <Icon name="mail" size={18} /> Email
              </a>
            )}
            {links.linkedin && (
              <a className="btn ghost" href={links.linkedin} target="_blank" rel="noreferrer">
                <Icon name="linkedin" size={18} /> LinkedIn
              </a>
            )}
            {links.github && (
              <a className="btn ghost" href={links.github} target="_blank" rel="noreferrer">
                <Icon name="github" size={18} /> GitHub
              </a>
            )}
            {links.resume && (
              <a className="btn ghost" href={links.resume} target="_blank" rel="noreferrer">
                <Icon name="doc" size={18} /> Resume
              </a>
            )}
            {!hasLinks && (
              <span className="chip mono">Links coming soon — edit data/content.js</span>
            )}
          </div>
        </div>
      </section>

      <footer className="wrap">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="mono">Designed &amp; built with care · {profile.initials}.</span>
      </footer>
    </>
  );
}
