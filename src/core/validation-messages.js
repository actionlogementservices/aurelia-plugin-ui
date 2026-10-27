/**
 * French messages of the standard aurelia-validation rules. The field label is displayed above the control,
 * so the messages do not repeat the property display name.
 * @module
 * @category forms
 */

/** @type {Record<string, string>} */
export const frenchValidationMessages = {
  default: "La valeur n'est pas valide.",
  required: 'Ce champ est obligatoire.',
  matches: "Le format n'est pas valide.",
  email: "L'adresse email n'est pas valide.",
  minLength: 'Ce champ doit contenir au moins ${$config.length} caractère${$config.length > 1 ? "s" : ""}.',
  maxLength: 'Ce champ ne peut pas dépasser ${$config.length} caractère${$config.length > 1 ? "s" : ""}.',
  minItems: 'Veuillez sélectionner au moins ${$config.count} élément${$config.count > 1 ? "s" : ""}.',
  maxItems: 'Veuillez sélectionner au plus ${$config.count} élément${$config.count > 1 ? "s" : ""}.',
  min: 'La valeur minimum est ${$config.constraint}.',
  max: 'La valeur maximum est ${$config.constraint}.',
  range: 'La valeur doit être comprise entre ${$config.min} et ${$config.max}.',
  between: 'La valeur doit être strictement comprise entre ${$config.min} et ${$config.max}.',
  equals: 'La valeur doit être ${$config.expectedValue}.'
};
