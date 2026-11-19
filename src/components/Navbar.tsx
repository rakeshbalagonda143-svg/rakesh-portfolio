import { useEffect, useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Python Lab', href: '#python-lab', id: 'python-lab' },
  { label: 'Education', href: '#education', id: 'education' },
  { label: 'Contact', href: '#contact', id: 'contact' },
] as const;

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollPosition = window.scrollY + 140;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_LINKS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'border-b border-[#151515]/15 bg-[#F5F0E7]/92 backdrop-blur-md'
          : 'border-b border-[#151515]/10 bg-[#F5F0E7]/85 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-6 lg:px-12">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="font-condensed text-2xl tracking-wide text-[#151515] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48] rounded-sm"
        >
          {PERSONAL_INFO.brandName}
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6 lg:gap-7">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`relative py-1 text-xs font-medium tracking-wide uppercase transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48] rounded-sm ${
                  isActive ? 'text-[#151515]' : 'text-[#5C574F] hover:text-[#151515]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#C96D48] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={PERSONAL_INFO.resumePath}
            download={PERSONAL_INFO.resumeFilename}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#151515] px-4 py-2 text-xs font-semibold text-[#F5F0E7] transition-colors duration-150 hover:bg-[#C96D48] hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Resume PDF</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#151515]/20 bg-[#FAF7F2] text-[#151515] transition-colors hover:border-[#C96D48] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C96D48]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#151515]/15 bg-[#F5F0E7] md:hidden">
          <nav aria-label="Mobile Navigation" className="mx-auto flex max-w-[1440px] flex-col px-6 py-4">
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`flex min-h-[44px] items-center justify-between border-b border-[#151515]/10 py-3 text-sm font-medium transition-colors last:border-b-0 ${
                    isActive ? 'text-[#A8502D] font-semibold' : 'text-[#151515] hover:text-[#A8502D]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="text-xs text-[#A8502D]">Active</span>}
                </a>
              );
            })}
            <a
              href={PERSONAL_INFO.resumePath}
              download={PERSONAL_INFO.resumeFilename}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[#151515] px-4 py-2.5 text-sm font-semibold text-[#F5F0E7] transition-colors hover:bg-[#C96D48]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download Resume (PDF)</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
