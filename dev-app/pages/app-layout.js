export class AppLayout {
  userMenuItems = [
    { label: 'Mes informations', icon: 'bi-person', href: '#' },
    { label: 'Administration', icon: 'bi-person-badge', href: '#' },
    { label: 'Déconnexion', icon: 'bi-x-circle', click: () => console.log('Déconnexion') }
  ];

  footerLinks = [
    { text: 'Qui sommes-nous', url: 'https://example.com' },
    { text: 'Contact', url: 'https://example.com/contact' }
  ];
}
