import { inject } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationRules } from 'aurelia-validation';

import { ToastService } from 'core/toast-service/toast-service';

/** @typedef {{ name: string; email: string; age: number, height: number, money: number, password: string, year: number, years: Array<number>, date: string }} FormData */

@inject(ToastService, ValidationControllerFactory)
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
    date: null
  };

  /**
   * @param {ToastService} toast
   * @param {ValidationControllerFactory} validationControllerFactory
   */
  constructor(toast, validationControllerFactory) {
    this.toast = toast;
    this.validationController = validationControllerFactory.createForCurrentScope();

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
      .on(this.formData);
  }

  async handleSubmit() {
    const { valid } = await this.validationController.validate();
    if (valid) {
      this.toast.success('Form submitted successfully!');
    } else {
      this.toast.error('Form has errors. Please fix them before submitting.');
    }
  }
}
