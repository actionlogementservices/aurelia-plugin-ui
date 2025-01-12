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
  /** additional address info @type{string} */ complementAdresse;
  /** city code @type{string} */ codeCommune;
  /** old city name @type{string | undefined} */ oldCommune;
}

ValidationRules.ensure('numero')
  .required()
  .maxLength(8)

  .ensure('nomVoie')
  .required()
  .maxLength(100)

  .ensure('codePostal')
  .required()
  .maxLength(10)

  .ensure('commune')
  .required()
  .maxLength(100)

  .ensure('complementAdresse')
  .maxLength(100)

  .ensure('paysCode')
  .required()

  .on(Adresse);
