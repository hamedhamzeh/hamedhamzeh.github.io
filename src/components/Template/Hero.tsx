import Link from 'next/link';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={160} height={160} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Hamed Hamzeh</span>
        </h1>

        <p className="hero-tagline">
          AI Engineer and applied researcher focused on computer vision,
          intelligent systems, and MLOps, with experience translating ideas into
          models, pipelines, and deployable products.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">Applied AI</span>
          <span className="hero-chip">Computer Vision</span>
          <span className="hero-chip">MLOps</span>
          <span className="hero-chip">R&D</span>
        </div>

        <div className="hero-cta">
          <Link href="/about" className="button">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            My Resume
          </Link>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
}
