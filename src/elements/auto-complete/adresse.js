import { ValidationRules } from 'aurelia-validation';
import { fromObject } from '../../core/decorators';

/**
 * Implements the BAN (Base Adresse Nationale) model.
 * @category autocomplete
 */

@fromObject
export class Adresse {
  /** internal id @type{string} */ id;
  /** BAN id @type{string} */ banId;
  /** country code @type{string} */ paysCode;
  /** house number @type{string} */ numero;
  /** street name @type{string} */ nomVoie;
  /** INSEE city code @type{string} */ codeInsee;
  /** zip code @type{string} */ codePostal;
  /** city @type{string} */ commune;
  /** departement & region @type{string} */ context;
  /** full adress @type{string} */ label;
  /** additional address info @type{string} */ complement;
  /** city code @type{string} */ codeCommune;
  /** old city name @type{string | undefined} */ oldCommune;

  // /**
  //  * Applies the aurelia validation rules.
  //  * @returns {Adresse} current instance.
  //  */
  // applyValidationRule() {
  //   ValidationRules.ensure(x => x.numero)
  //     .required()
  //     .maxLength(8)
  //     .ensure(x => x.nomVoie)
  //     .required()
  //     .maxLength(100)
  //     .ensure(x => x.codePostal)
  //     .required()
  //     .maxLength(10)
  //     .ensure(x => x.commune)
  //     .required()
  //     .maxLength(100)
  //     .ensure(x => x.complement)
  //     .maxLength(100)
  //     .on(this);
  //   return this;
  // }

  constructor() {
    ValidationRules.ensure(x => x.numero)
      .required()
      .maxLength(8)
      .ensure(x => x.nomVoie)
      .required()
      .maxLength(100)
      .ensure(x => x.codePostal)
      .required()
      .maxLength(10)
      .ensure(x => x.commune)
      .required()
      .maxLength(100)
      .ensure(x => x.complement)
      .maxLength(100)
      .on(this);
  }
}
