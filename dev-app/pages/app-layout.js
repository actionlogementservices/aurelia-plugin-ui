import { BindingEngine, inject, NewInstance } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';

import { ToastService } from 'core/toast-service/toast-service';
import { AutoCompleteController } from 'resources/elements/auto-complete/auto-complete-controller';

/** @typedef {{ name: string; email: string; age: number, height: number, money: number, password: string, year: number, years: Array<number>, date: string, civility: string, terms: boolean, interests: Array<string>, comment: string, document: FileList, source: string, sourceOther: string, city: string, startDate: string, endDate: string }} FormData */

/**
 * Day of an ISO date, ignoring the time.
 * @param {string} isoDate ISO date
 * @returns {number} timestamp of the day at midnight, local time
 */
const day = isoDate => new Date(isoDate).setHours(0, 0, 0, 0);

const CITIES = [
  { code: '75056', name: 'Paris' },
  { code: '13055', name: 'Marseille' },
  { code: '69123', name: 'Lyon' },
  { code: '31555', name: 'Toulouse' },
  { code: '06088', name: 'Nice' },
  { code: '44109', name: 'Nantes' },
  { code: '67482', name: 'Strasbourg' },
  { code: '34172', name: 'Montpellier' },
  { code: '33063', name: 'Bordeaux' },
  { code: '59350', name: 'Lille' }
];

@inject(ToastService, ValidationControllerFactory, NewInstance.of(AutoCompleteController), BindingEngine)
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

  yearOptions = Array.from({ length: 11 }, (_, i) => ({ label: `Année ${2017 + i}`, value: 2017 + i }));

  /** @type {FormData} */
  formData = {
    name: '',
    email: '',
    age: 20,
    height: 0,
    money: 0,
    password: '',
    year: null,
    years: [2026],
    date: null,
    civility: null,
    terms: false,
    interests: [],
    comment: '',
    document: undefined,
    source: null,
    sourceOther: '',
    city: undefined,
    startDate: null,
    endDate: null
  };

  sourceOptions = [
    { label: 'Internet', value: 'web' },
    { label: 'Bouche-à-oreille', value: 'word-of-mouth' },
    { label: 'Autre', value: 'other' }
  ];

  interestOptions = [
    { label: 'Sport', value: 'sport' },
    { label: 'Culture', value: 'culture' },
    { label: 'Voyage', value: 'voyage' }
  ];

  civilityOptions = [
    { label: 'Madame', value: 'MME' },
    { label: 'Monsieur', value: 'M' }
  ];

  /**
   * @param {ToastService} toast
   * @param {ValidationControllerFactory} validationControllerFactory
   * @param {AutoCompleteController} cityController
   * @param {BindingEngine} bindingEngine
   */
  constructor(toast, validationControllerFactory, cityController, bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.toast = toast;
    this.validationController = validationControllerFactory.createForCurrentScope();
    this.cityController = cityController;
    this.cityController.configure(
      async text => CITIES.filter(city => city.name.toUpperCase().includes(text.toUpperCase())),
      undefined,
      async codes => CITIES.filter(city => codes.includes(city.code))
    );

    const minDate = new Date();
    const maxDate = new Date();
    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 1);
    this.mindateString = minDate.toISOString();
    this.maxDateString = maxDate.toISOString();

    ValidationRules.ensure('name')
      .required()
      .ensure('email')
      .required()
      .email()
      .ensure('age')
      .required()
      .range(18, 150)
      .ensure('height')
      .required()
      .min(0)
      .ensure('money')
      .required()
      .min(0)
      .ensure('password')
      .required()
      .minLength(8)
      .ensure('year')
      .required()
      .ensure('years')
      .minItems(1)
      .ensure('date')
      .required()
      .ensure('civility')
      .required()
      .ensure('terms')
      .satisfies(value => value === true)
      .withMessage("Vous devez accepter les conditions d'utilisation.")
      .ensure('interests')
      .minItems(1)
      .ensure('comment')
      .required()
      .maxLength(200)
      .ensure('document')
      .satisfies(files => files?.length > 0)
      .withMessage('Veuillez sélectionner un fichier.')
      .then()
      .satisfies(files => files[0].size <= 2 * 1024 * 1024)
      .withMessage('Le fichier ne doit pas dépasser 2 Mo.')
      .ensure('source')
      .required()
      .ensure('sourceOther')
      .required()
      .when(data => data.source === 'other')
      .ensure('city')
      .required()
      .ensure('startDate')
      .required()
      .ensure('endDate')
      .required()
      .satisfies((endDate, data) => !data.startDate || day(endDate) >= day(data.startDate))
      .withMessage('La date de fin ne peut pas être antérieure à la date de début.')
      .on(this.formData);
  }

  activate() {
    // cross-field rule: the end date depends on the start date, revalidate it when the start date changes
    this.startDateSubscription = this.bindingEngine
      .propertyObserver(this.formData, 'startDate')
      .subscribe(
        () =>
          this.formData.endDate &&
          this.validationController.validate({ object: this.formData, propertyName: 'endDate' })
      );
  }

  deactivate() {
    this.startDateSubscription.dispose();
  }

  /** Fills the form with valid values, then validates it to clear the displayed errors. */
  fillForm() {
    const files = new DataTransfer();
    files.items.add(new File(['demo'], 'justificatif.pdf', { type: 'application/pdf' }));
    // Aurelia does not push `files` from the model to the input: set it on both
    this.documentInput.files = files.files;

    Object.assign(this.formData, {
      name: 'Jean Dupont',
      email: 'jean.dupont@exemple.fr',
      age: 35,
      height: 1.8,
      money: 1500,
      password: 'motdepasse',
      year: 2024,
      years: [2025, 2026],
      date: new Date().toISOString(),
      civility: 'M',
      terms: true,
      interests: ['sport', 'culture'],
      comment: 'Commentaire de démonstration.',
      document: files.files,
      source: 'other',
      sourceOther: 'Salon du logement',
      city: '69123',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
    });
    return this.validationController.validate();
  }

  async handleSubmit() {
    const { valid } = await this.validationController.validate();
    if (!valid) {
      this.toast.error('Form has errors. Please fix them before submitting.');
      return;
    }

    // simulated server call: the error returned by the server is displayed by als-field like a local one
    await new Promise(resolve => setTimeout(resolve, 300));
    if (this.formData.email === 'deja@utilise.fr') {
      this.validationController.addError('Cet email est déjà utilisé.', this.formData, 'email');
      this.toast.error('Le serveur a refusé le formulaire.');
      return;
    }

    this.toast.success('Form submitted successfully!');
  }
}
