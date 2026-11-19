import ThemeToggle from "@/components/ThemeToggle";
import Motion from "@/components/Motion";
import CopyEmail from "@/components/CopyEmail";
import ProjectDiagram from "@/components/ProjectDiagram";
import {
  site, philosophy, projects, capabilities, experience,
  education, certifications, outsideWork, learning
} from "@/data/content";

const navigation = [
  ["Work", "#work"], ["Expertise", "#expertise"], ["Experience", "#experience"],
  ["About", "#about"], ["Contact", "#contact"]
];

function Arrow({ diagonal = false }) {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {diagonal ? <path d="M5 19 19 5M7 5h12v12" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
  </svg>;
}

function SectionHead({ id, index, kicker, title, italic, description, invert = false }) {
  return <div className={`section-heading reveal${invert ? " section-heading-invert" : ""}`}>
    <div className="section-number"><span>{index}</span><span>{kicker}</span></div>
    <div className="section-heading-main">
      <h2 id={id}>{title} {italic && <em>{italic}</em>}</h2>
      {description && <p>{description}</p>}
    </div>
  </div>;
}

function Tags({ items, light = false }) {
  return <ul className={`tags${light ? " tags-light" : ""}`} aria-label="Technologies">
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>;
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "Person", name: site.name,
    jobTitle: site.role, url: site.url, sameAs: [site.linkedin],
    homeLocation: { "@type": "Place", name: site.location },
    knowsAbout: ["Quality Engineering", "Playwright", "Software testing", "Performance testing", "CI/CD"]
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <a className="skip-link" href="#main">Skip to content</a>

    <Motion />
    <header className="site-header">
      <div className="shell nav-shell">
        <a className="wordmark" href="#top" aria-label="Rupinder Kaur, back to top">
          <span className="wordmark-box">RK<span>.</span></span>
          <span className="wordmark-name">Rupinder Kaur</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="header-cta" href={`mailto:${site.email}`}>Say hello <Arrow diagonal /></a>
          <details className="mobile-nav">
            <summary>Menu <span className="menu-lines" aria-hidden="true"><i /><i /></span></summary>
            <nav aria-label="Mobile navigation">
              {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
            </nav>
          </details>
        </div>
      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </header>

    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="shell">
          <div className="hero-overline">
            <p className="eyebrow"><span className="eyebrow-mark" /> QUALITY ENGINEERING <span aria-hidden="true">/</span> OTTAWA, CANADA</p>
            <span className="hero-edition" aria-hidden="true">RK — PORTFOLIO / 2026</span>
          </div>

          <div className="hero-masthead">
            <h1 id="hero-title">
              <span className="hero-line" style={{ "--d": "0ms" }}>Good software</span>
              <span className="hero-line" style={{ "--d": "140ms" }}>isn&apos;t an <em className="hero-accent">accident.<svg className="hero-underline" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 16 C 60 6, 130 4, 190 10 S 270 20, 296 8" pathLength="1" /></svg></em></span>
            </h1>
            <span className="hero-asterisk" aria-hidden="true">✳</span>
          </div>

          <div className="hero-understory">
            <div className="hero-introduction hero-fade">
              <p className="hero-lead">It starts with better questions, an eye for risk, and tests built with intention.</p>
              <p className="hero-intro">I&apos;m <strong>Rupinder Kaur</strong>, a Software Engineer in Test connecting automation, performance, and thoughtful release decisions.</p>
              <div className="hero-buttons">
                <a href="#work" className="button button-primary">Explore my work <Arrow diagonal /></a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="button button-plain">LinkedIn <Arrow diagonal /></a>
              </div>
            </div>

            <div className="method-notes hero-fade is-running" id="how-i-think" aria-labelledby="method-heading">
              <div className="method-heading-line">
                <span className="method-overline">A FIELD GUIDE TO QUALITY</span>
                <h2 id="method-heading">How I <em>think.</em></h2>
              </div>
              <ol className="method-grid">
                {philosophy.map((step, i) => <li className="method-note" key={step.number} style={{ "--t": `${900 + i * 650}ms` }}>
                  <span className="method-number">{step.number}
                    <span className="run-status" aria-hidden="true">
                      <span className="run-pending">○ queued</span>
                      <span className="run-active"><i className="run-spinner" /> running</span>
                      <span className="run-pass">✓ passed · {[184, 241, 362, 297][i]}ms</span>
                    </span>
                  </span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>)}
              </ol>
              <div className="run-summary" style={{ "--t": `${900 + philosophy.length * 650}ms` }}>
                <span className="run-summary-text"><b>{philosophy.length} passed</b> · 0 failed · how-i-think.spec</span>
                <button type="button" className="run-again" data-rerun="how-i-think">↻ Re-run</button>
              </div>
            </div>
          </div>
          <div className="hero-baseline hero-fade"><span>ENGINEERING PRECISION <span aria-hidden="true">/</span> HUMAN CURIOSITY</span><a href="#work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
        </div>
      </section>

      <section className="work-section section-space" id="work" aria-labelledby="work-title">
        <div className="shell">
          <SectionHead id="work-title" index="01 / 05" kicker="SELECTED WORK" title="The work behind" italic="the confidence." description="A closer look at the engineering challenges I work on. Client and project details are kept appropriately high-level." />
          <div className="project-list">
            {projects.map(project => <article className={`project reveal project-${project.theme}`} key={project.number}>
              <div className="project-left">
                <div className="project-label"><span>{project.number}</span><span>{project.category}</span></div>
                <ProjectDiagram number={project.number} />
              </div>
              <div className="project-right">
                <h3>{project.title}</h3>
                <p className="project-summary">{project.overview}</p>
                <Tags items={project.tools} />
                <details className="project-details">
                  <summary>Explore the engineering approach <span aria-hidden="true">+</span></summary>
                  <div className="project-detail-grid">
                    <div><h4>The challenge</h4><p>{project.challenge}</p></div>
                    <div><h4>My contribution</h4><p>{project.contribution}</p></div>
                  </div>
                  <p className="project-focus"><strong>Quality focus</strong> {project.focus}</p>
                </details>
              </div>
            </article>)}
          </div>
          <p className="project-disclaimer">Project descriptions summarize previously published experience. Quantified outcomes and confidential client specifics are intentionally omitted until validated.</p>
        </div>
      </section>

      <section id="expertise" className="expertise-section section-space" aria-labelledby="expertise-title">
        <div className="shell">
          <SectionHead id="expertise-title" index="02 / 05" kicker="CAPABILITIES" title="Craft, meet" italic="method." invert description="A practical toolkit for navigating complex applications, changing requirements and the realities of shipping software." />
          <div className="capabilities-grid">
            {capabilities.map((capability, i) => <article className="capability reveal spotlight" style={{ "--i": i % 2 }} key={capability.number}>
              <span className="capability-index">{capability.number} <span>{String(capability.tools.length).padStart(2, "0")} TOOLS</span></span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <Tags items={capability.tools} light />
            </article>)}
          </div>
          <div className="learning-row reveal"><span>LOOKING FORWARD</span><p>{learning.join(" / ")}</p></div>
        </div>
      </section>

      <section id="experience" className="experience-section section-space" aria-labelledby="experience-title">
        <div className="shell">
          <SectionHead id="experience-title" index="03 / 05" kicker="EXPERIENCE" title="A path shaped by" italic="curiosity." description="From software development and modernization to a growing focus on reliable product experiences." />
          <div className="timeline">
            {experience.map((role, i) => <article className={`role reveal${i === 0 ? " role-current" : ""}`} key={`${role.company}-${role.period}`}>
              <div className="role-index"><span className="role-dot" /><span>0{i + 1}</span></div>
              <div className="role-main"><h3>{role.role}</h3><p className="role-company">{role.company}</p>
                {role.highlights.length > 0 && <ul className="role-highlights">{role.highlights.map(item => <li key={item}>{item}</li>)}</ul>}
              </div>
              <div className="role-side"><span>{role.period}</span><span>{role.location}</span></div>
            </article>)}
          </div>
          <div className="credentials reveal">
            <div className="credential-block"><p className="small-label">EDUCATION</p>{education.map(item => <div className="education-entry" key={item.school}><h3>{item.school}</h3><p>{item.degree}</p><span>{item.period}</span></div>)}</div>
            <div className="credential-block"><p className="small-label">CERTIFICATIONS & TRAINING</p><ul className="certifications">{certifications.map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section section-space" aria-labelledby="about-title">
        <div className="shell">
          <SectionHead id="about-title" index="04 / 05" kicker="A LITTLE MORE" title="An engineer with" italic="other interests." />
          <div className="about-layout reveal">
            <div className="about-statement"><span className="quote-mark" aria-hidden="true">“</span><p>I believe the best testing goes beyond finding defects. It asks better questions about how people, systems and assumptions interact.</p></div>
            <div className="about-copy"><p>My background combines Quality Assurance with Business Analysis exposure, which helps me think about both technical behaviour and the intent behind it.</p><p>I enjoy learning new approaches to scalable test automation and exploring how AI can support — not replace — sound engineering judgment.</p><p>Outside work, creative routines keep me curious.</p></div>
          </div>
          <div className="interests-grid">{outsideWork.map((item, i) => <div className="interest reveal" style={{ "--i": i }} key={item.title}><span className="interest-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>
        </div>
      </section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="shell contact-inner">
          <div className="contact-head"><span>05 / 05</span><span>LET'S CONNECT</span></div>
          <p className="contact-kicker reveal">GOOD WORK STARTS WITH A CONVERSATION.</p>
          <h2 id="contact-title" className="reveal">Have something<br />worth <em>testing?</em></h2>
          <p className="contact-description">I'm interested in thoughtful conversations about test automation, software quality and the engineering behind dependable products.</p>
          <div className="contact-actions"><a className="contact-mail" href={`mailto:${site.email}`}>Start a conversation <Arrow diagonal /></a><a className="contact-link" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a>
            {site.resume && <a className="contact-link" href={site.resume} target="_blank" rel="noopener noreferrer">Résumé <Arrow diagonal /></a>}
          </div>
          <div className="contact-footer"><CopyEmail email={site.email} /><span>{site.location}</span></div>
        </div>
      </section>
    </main>

    <footer className="site-footer"><div className="shell footer-layout"><a href="#top" className="footer-brand">RK<span>.</span></a><p>© {new Date().getFullYear()} {site.name}. Built with intention.</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
