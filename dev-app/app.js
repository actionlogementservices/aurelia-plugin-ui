export class App {
  configureRouter(config, router) {
    config.title = 'Dev App';
    config.options.pushState = true;
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'pages/home', title: 'Home' },
      { route: 'pre-login', name: 'pre-login', moduleId: 'pages/pre-login', title: 'Pre login' }
    ]);

    this.router = router;
  }
}
