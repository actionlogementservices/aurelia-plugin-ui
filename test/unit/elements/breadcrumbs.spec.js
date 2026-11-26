import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { Router } from 'aurelia-router';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Builds a navigation instruction of the fake router.
 * @param {string | string[]} route route pattern(s)
 * @param {string} [title] title of the route
 * @returns {any} navigation instruction
 */
const instruction = (route, title) => ({ router, config: { route, name: title, navModel: { title } } });

const router = {
  navigate: jest.fn(),
  navigateToRoute: jest.fn(),
  isNavigating: false,
  currentInstruction: {
    getAllInstructions: () => [
      instruction(['', 'home'], 'Home'),
      instruction('contrats', 'Contrats'),
      instruction('details'),
      instruction('contrats/:id', 'Contrat')
    ]
  }
};

describe('breadcrumbs', () => {
  let component;

  beforeEach(async () => {
    component = StageComponent.withResources([PLATFORM.moduleName('elements/breadcrumbs/breadcrumbs')]).inView(
      '<breadcrumbs></breadcrumbs>'
    );
    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(Router, router);
    });
    await component.create(bootstrap);
    await flush();
  });

  afterEach(() => {
    component.dispose();
    jest.clearAllMocks();
  });

  test('displays the home link, then the steps with a title except the default route', () => {
    const items = [...document.querySelectorAll('.breadcrumb-item')].map(item => item.textContent.trim());
    expect(items).toEqual(['Accueil', 'Contrats', 'Contrat']);
  });

  test('is a navigation named in French', () => {
    expect(document.querySelector('nav').getAttribute('aria-label')).toBe("Fil d'Ariane");
  });

  test('the last step is the current page, the other steps are keyboard reachable links', () => {
    const [home, step, current] = document.querySelectorAll('.breadcrumb-item');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.querySelector('a')).toBeNull();
    expect(step.getAttribute('aria-current')).toBeNull();
    expect(home.querySelector('a').getAttribute('href')).toBe('#');
    expect(step.querySelector('a').getAttribute('href')).toBe('#');
  });

  test('navigates to the root on the home link, to the route of the step on a step link', () => {
    const [home, step] = document.querySelectorAll('.breadcrumb-item a');
    home.click();
    expect(router.navigate).toHaveBeenCalledWith('');
    step.click();
    expect(router.navigateToRoute).toHaveBeenCalledWith('Contrats');
  });
});
