import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

const links = [
  { text: 'Contact', url: 'https://example.fr/contact' },
  { text: 'Qui sommes-nous ?', url: 'https://example.fr/qui' }
];

/**
 * Describes the links of the footer.
 * @param {string} [selector] selector of the links
 * @returns {Array<{ name: string, href: string }>} accessible name and url of each link
 */
const describeLinks = (selector = 'als-footer a') =>
  [...document.querySelectorAll(selector)].map(link => ({
    name: link.getAttribute('aria-label'),
    href: link.getAttribute('href')
  }));

// contains the visible text of the logo link (WCAG 2.5.3 label in name)
const logoName =
  "Action Logement, faciliter le logement pour favoriser l'emploi (ouvre dans un nouvel onglet)";

describe('als-footer', () => {
  let component;

  /**
   * Renders the footer.
   * @param {string} [attributes] attributes of the element
   */
  const render = async (attributes = '') => {
    component = StageComponent.withResources([PLATFORM.moduleName('elements/als-footer/als-footer')])
      .inView(`<als-footer links.bind="links" ${attributes}></als-footer>`)
      .boundTo({ links });
    await component.create(bootstrap);
  };

  afterEach(() => component.dispose());

  test('default: the logo, the social media links, then the accessibility and the custom links in a navigation', async () => {
    await render();
    expect(describeLinks('als-footer a:not(nav a)')).toEqual([
      {
        name: logoName,
        href: 'https://www.actionlogement.fr/entreprise'
      },
      {
        name: 'LinkedIn (ouvre dans un nouvel onglet)',
        href: 'https://www.linkedin.com/company/action-logement/mycompany/verification'
      },
      { name: 'X (ouvre dans un nouvel onglet)', href: 'https://x.com/actionlogement' },
      { name: 'YouTube (ouvre dans un nouvel onglet)', href: 'https://www.youtube.com/@actionlogement' }
    ]);
    expect(document.querySelector('als-footer nav').getAttribute('aria-label')).toBe(
      'Navigation du pied de page'
    );
    expect(describeLinks('als-footer nav a')).toEqual([
      {
        name: 'Accessibilité : non conforme (ouvre dans un nouvel onglet)',
        href: 'https://www.actionlogement.fr/schema-pluriannuel-accessibilite-numerique'
      },
      { name: 'Contact (ouvre dans un nouvel onglet)', href: 'https://example.fr/contact' },
      { name: 'Qui sommes-nous ? (ouvre dans un nouvel onglet)', href: 'https://example.fr/qui' }
    ]);
  });

  test('compact: the logo, the accessibility and the custom links, without social media links nor navigation', async () => {
    await render('type="compact"');
    expect(document.querySelector('als-footer footer').classList).toContain('compact');
    expect(document.querySelector('als-footer nav')).toBeNull();
    expect(document.querySelector('als-footer .social-media-icon')).toBeNull();
    expect(describeLinks().map(link => link.name)).toEqual([
      logoName,
      'Accessibilité : non conforme (ouvre dans un nouvel onglet)',
      'Contact (ouvre dans un nouvel onglet)',
      'Qui sommes-nous ? (ouvre dans un nouvel onglet)'
    ]);
  });

  test.each(['default', 'compact'])(
    '%s: every link opens in a new tab without access to the page',
    async type => {
      await render(`type="${type}"`);
      for (const link of document.querySelectorAll('als-footer a')) {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        expect(link.getAttribute('title')).toBe(link.getAttribute('aria-label'));
      }
    }
  );

  test('displays the copyright of the current year', async () => {
    // only the date is faked: aurelia keeps its real timers
    jest.useFakeTimers({
      now: new Date(2031, 4, 1),
      doNotFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
        'queueMicrotask',
        'nextTick',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'requestIdleCallback',
        'cancelIdleCallback',
        'hrtime',
        'performance'
      ]
    });
    try {
      await render();
    } finally {
      jest.useRealTimers();
    }
    expect(document.querySelector('als-footer nav').textContent).toContain('©2031 Action Logement');
  });

  test('hides the social media links', async () => {
    await render('hide-social-media-links.bind="true"');
    expect(document.querySelector('als-footer .social-media-icon')).toBeNull();
    expect(document.querySelector('als-footer nav')).not.toBeNull();
  });

  test('uses the specified urls and accessibility text', async () => {
    await render(
      'logo-url="https://logo.fr" accessibility-text="Accessibilité : partiellement conforme" accessibility-url="https://a11y.fr" linkedin-url="https://in.fr" twitter-url="https://x.fr" youtube-url="https://yt.fr"'
    );
    expect(describeLinks().map(link => link.href)).toEqual([
      'https://logo.fr',
      'https://in.fr',
      'https://x.fr',
      'https://yt.fr',
      'https://a11y.fr',
      'https://example.fr/contact',
      'https://example.fr/qui'
    ]);
    expect(document.querySelector('als-footer nav a').textContent.trim()).toBe(
      'Accessibilité : partiellement conforme'
    );
  });
});
