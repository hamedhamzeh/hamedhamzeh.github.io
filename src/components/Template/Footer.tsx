import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import work from '@/data/resume/work';

import ThemePortrait from './ThemePortrait';

export default function Footer() {
  const currentRole = `${work[0].position} at ${work[0].name}`;

  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-identity">
          <Link href="/" prefetch={false} className="footer-avatar">
            <ThemePortrait width={80} height={80} />
          </Link>
          <div className="footer-info">
            <p className="footer-name">Hamed Hamzeh</p>
            <p className="footer-role">{currentRole}</p>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <h2 id="footer-links-heading" className="footer-links-label">
              Explore
            </h2>
            <div className="footer-links-grid">
              <Link href="/about" prefetch={false}>
                About
              </Link>
              <Link href="/resume" prefetch={false}>
                Resume
              </Link>
              <Link href="/publications" prefetch={false}>
                Publications
              </Link>
              <Link href="/projects" prefetch={false}>
                Projects
              </Link>
              <Link href="/contact" prefetch={false}>
                Contact
              </Link>
            </div>
          </nav>

          <div
            className="footer-social"
            aria-labelledby="footer-social-heading"
          >
            <h2 id="footer-social-heading" className="footer-social-label">
              Connect
            </h2>
            <ContactIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
