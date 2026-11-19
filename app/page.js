import ThemeToggle from "@/components/ThemeToggle";
import Motion from "@/components/Motion";
import CopyEmail from "@/components/CopyEmail";
import Loader from "@/components/Loader";
import HeroScan from "@/components/HeroScan";
import NoiseStrip from "@/components/NoiseStrip";
import SpotTheBug from "@/components/SpotTheBug";
import ToolMarquee from "@/components/ToolMarquee";
import Metrics from "@/components/Metrics";
import SelectedWork from "@/components/SelectedWork";
import {
  site, philosophy, projects, capabilities, experience,
  education, certifications, outsideWork, learning, toolbelt, metrics
} from "@/data/content";

const navigation = [
  ["Expertise", "#expertise"], ["Work", "#work"], ["Experience", "#experience"],
  ["About", "#about"], ["Contact", "#contact"]
];

function Arrow({ diagonal = false }) {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {diagonal ? <path d="M5 19 19 5M7 5h12v12" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
  </svg>;
}

/** Section title styled like a Figma frame: layer name above, title inside. */
function SectionHead({ id, index, layer, title, italic, description, invert = false }) {
  return <div className={`section-heading reveal${invert ? " is-invert" : ""}`}>
    <p className="layer-name"><span className="layer-icon" aria-hidden="true">#</span>{layer}<span className="layer-index">{index}</span></p>
    <div className="section-heading-main">
      <h2 id={id}>{title} {italic && <em>{italic}</em>}</h2>
      {description && <p>{description}</p>}
    </div>
  </div>;
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "Person", name: site.name,
    jobTitle: site.role, url: site.url, sameAs: [site.linkedin],
    homeLocation: { "@type": "Place", name: site.location },
    knowsAbout: ["Quality Engineering", "Playwright", "Software testing", "Performance testing", "CI/CD"]
  };
  const shownMetrics = metrics.filter(m => m.value !== null && m.source);

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <a className="skip-link" href="#main">Skip to content</a>
    <Loader />
    <Motion />
    <span className="scroll-progress" aria-hidden="true" />

    <header className="site-header">
      <div className="toolbar">
        <a className="wordmark" href="#top" aria-label="Rupinder Kaur, back to top">RK<span>.</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <ThemeToggle />
        <a className="header-cta" href={`mailto:${site.email}`}>Say hello</a>
        <details className="mobile-nav">
          <summary>Menu <span className="menu-lines" aria-hidden="true"><i /><i /></span></summary>
          <nav aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          </nav>
        </details>
      </div>
    </header>

    <main id="main">
      {/* HERO — bordered frame grid */}
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-frame">
          <div className="hf-cell hf-tag"><span className="pill">QA DISCOVERY · ©2026</span></div>
          <div className="hf-cell hf-role"><span>{site.name.toUpperCase()}</span><span>{site.role.toUpperCase()}</span></div>
          <div className="hf-cell hf-kicker">FINDING WHAT OTHERS MISS</div>

          <div className="hf-cell hero-copy">
            <div className="hero-masthead">
              <h1 id="hero-title">
                <span className="hl" style={{ "--d": 0 }}>Spot what</span>
                <span className="hl" style={{ "--d": 1 }}>everyone else</span>
                <span className="hl" style={{ "--d": 2 }}><span className="lint">overlooks.
                  <svg className="lint-squiggle" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 q 6 -7 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0 t 12 0" /></svg>
                  <svg className="lint-fixed" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 8 H398" pathLength="1" /></svg>
                  <span className="lint-pin" aria-hidden="true"><span className="lint-found">#001 FOUND</span><span className="lint-ok">FIXED ✓</span></span>
                </span></span>
              </h1>
            </div>
            <p className="hero-sub">I&apos;m Rupinder Kaur, a Software Engineer in Test. I hunt the quiet defects: the edge case, the drifted pixel, the slow query. Then I stay with them until they&apos;re fixed.</p>
          </div>
          <div className="hf-cell hero-visual"><HeroScan /></div>

          <div className="hf-cell hf-noise"><NoiseStrip /></div>
          <div className="hf-cell hf-game selection"><SpotTheBug /><span className="handles" aria-hidden="true"><i /><i /><i /><i /></span><span className="selection-size" aria-hidden="true">Frame · 12 items</span></div>
          <div className="hf-cell hf-cta">
            <a href="#work" className="button button-solid">Explore my work <Arrow diagonal /></a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="button button-line">LinkedIn <Arrow diagonal /></a>
            <p className="hf-location"><span className="status-led" /> {site.location} · open to conversations</p>
          </div>
        </div>
      </section>

      {/* HOW I THINK — a live test run */}
      <section className="process section-space" aria-labelledby="method-heading">
        <div className="shell">
          <div className="method-notes is-running" id="how-i-think" data-run-on-view>
            <div className="method-heading-line">
              <p className="layer-name"><span className="layer-icon" aria-hidden="true">#</span>A field guide to quality<span className="layer-index">00</span></p>
              <h2 id="method-heading">How I <em>think.</em></h2>
            </div>
            <ol className="method-grid">
              {philosophy.map((step, i) => <li className="method-note" key={step.number} style={{ "--t": `${700 + i * 650}ms` }}>
                <span className="method-number">{step.number}
                  <span className="run-status" aria-hidden="true">
                    <span className="run-pending">○ queued</span>
                    <span className="run-active"><i className="run-spinner" /> running</span>
                    <span className="run-pass">✓ passed · {[184, 241, 362, 297][i]}ms</span>
                  </span>
                </span>
                <h3>{step.title}</h3><p>{step.description}</p>
              </li>)}
            </ol>
            <div className="run-summary" style={{ "--t": `${700 + philosophy.length * 650}ms` }}>
              <span className="run-summary-text"><b>{philosophy.length} passed</b> · 0 failed · how-i-think.spec</span>
              <button type="button" className="run-again" data-rerun="how-i-think">↻ Re-run</button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE — toolkit marquee, capabilities, metrics */}
      <section id="expertise" className="night expertise-section" aria-labelledby="expertise-title">
        <div className="marquee-band">
          <p className="band-label"><span className="asterisk" aria-hidden="true">✱</span> Tools I test, build and ship with <span className="band-hint">scroll or drag</span></p>
          <ToolMarquee tools={toolbelt} />
        </div>
        <div className="shell section-space">
          <SectionHead id="expertise-title" index="01" layer="Capabilities" title="Craft, meet" italic="method." invert description="A practical toolkit for complex applications, changing requirements and the realities of shipping software." />
          <div className="capabilities-grid">
            {capabilities.map((capability, i) => <article className="capability reveal spotlight" style={{ "--i": i % 2 }} key={capability.number}>
              <span className="capability-index">{capability.number} <span>{String(capability.tools.length).padStart(2, "0")} TOOLS</span></span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
              <ul className="chip-list" aria-label="Technologies">{capability.tools.map(t => <li key={t}>{t}</li>)}</ul>
            </article>)}
          </div>
          <div className="learning-row reveal"><span>LOOKING FORWARD</span><p>{learning.join(" / ")}</p></div>
          <Metrics items={shownMetrics} />
        </div>
      </section>

      {/* SELECTED WORK — interactive cards */}
      <section className="night work-section section-space" id="work" aria-labelledby="work-title">
        <div className="shell">
          <SectionHead id="work-title" index="02" layer="Selected work" title="The work behind" italic="the confidence." invert description="Move across each card. Open a case file for the challenge, my contribution and the quality focus. Client details stay high-level." />
          <SelectedWork projects={projects} />
          <p className="project-disclaimer">Project descriptions summarize previously published experience. Quantified outcomes and confidential client specifics are intentionally omitted until validated.</p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="experience-section section-space" aria-labelledby="experience-title">
        <div className="shell">
          <SectionHead id="experience-title" index="03" layer="Experience" title="A path shaped by" italic="curiosity." description="From software development and modernization to a growing focus on reliable product experiences." />
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

      {/* ABOUT */}
      <section id="about" className="about-section section-space" aria-labelledby="about-title">
        <div className="shell">
          <SectionHead id="about-title" index="04" layer="A little more" title="An engineer with" italic="other interests." />
          <div className="about-layout reveal">
            <div className="about-statement"><span className="quote-mark" aria-hidden="true">“</span><p>I believe the best testing goes beyond finding defects. It asks better questions about how people, systems and assumptions interact.</p></div>
            <div className="about-copy"><p>My background combines Quality Assurance with Business Analysis exposure, which helps me think about both technical behaviour and the intent behind it.</p><p>I enjoy learning new approaches to scalable test automation and exploring how AI can support, not replace, sound engineering judgment.</p><p>Outside work, creative routines keep me curious.</p></div>
          </div>
          <div className="interests-grid">{outsideWork.map((item, i) => <div className="interest reveal" style={{ "--i": i }} key={item.title}><span className="interest-number">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="night contact-section" aria-labelledby="contact-title">
        <div className="shell contact-inner">
          <div className="contact-head"><span>05 / CONTACT</span><span>GOOD WORK STARTS WITH A CONVERSATION</span></div>
          <h2 id="contact-title" className="reveal">Have something worth <em>testing?</em></h2>
          <p className="contact-description">I&apos;m interested in thoughtful conversations about test automation, software quality and the engineering behind dependable products.</p>
          <div className="contact-actions"><a className="button button-solid button-invert" href={`mailto:${site.email}`}>Start a conversation <Arrow diagonal /></a><a className="button button-line button-line-invert" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a>
            {site.resume && <a className="button button-line button-line-invert" href={site.resume} target="_blank" rel="noopener noreferrer">Résumé <Arrow diagonal /></a>}
          </div>
          <div className="contact-footer"><CopyEmail email={site.email} /><span>{site.location}</span></div>
        </div>
      </section>
    </main>

    <footer className="site-footer"><div className="shell footer-layout"><a href="#top" className="footer-brand">RK<span>.</span></a><p>© {new Date().getFullYear()} {site.name}. Built and tested with intention.</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
