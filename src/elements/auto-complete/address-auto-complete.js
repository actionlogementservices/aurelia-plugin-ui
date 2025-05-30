import { inject, Factory, bindable, bindingMode, NewInstance, observable, TaskQueue } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { AureliaConfiguration } from 'aurelia-configuration';
import { generateUniqueId } from '../../core/functions';
import { Adresse } from './adresse';
import { AutoCompleteController } from './auto-complete-controller';

/** @typedef {import('types').AddressMode} AddressMode */
/** @typedef {Record<AddressMode, import('types').AutoCompleteControllerConfiguration<Adresse>>} AddressAutoCompleteControllerConfigurations */
/** @typedef { () => HttpClient} HttpClientFactory */
/** @typedef {import('types').BanAddress} BanAddress */
/** @typedef {import('geojson').FeatureCollection} FeatureCollection */

/**
 * Autocomplete controller configurations per address mode for requesting the BAN (*Base Adresse Nationale*) api.
 * @type {AddressAutoCompleteControllerConfigurations}
 */
const options = {
  zipCode: {
    requestFactory: callback => text => callback(text, 'municipality', 5),
    buildItemModel: item => {
      if (!item) return;
      const firstLine = item.commune && item.codePostal ? `${item.commune} (${item.codePostal})` : undefined;
      return Object.assign(item, { firstLine });
    }
  },
  address: {
    requestFactory: callback => text =>
      callback(text, 'housenumber', 5).then(result => result.filter(a => a.numero)),
    buildItemModel: item => {
      if (!item) return;
      const firstLine =
        item.numero && item.nomVoie && item.codePostal && item.commune
          ? `${item.numero} ${item.nomVoie} ${item.codePostal} ${item.commune}`
          : undefined;
      return Object.assign(item, { firstLine });
    }
  }
};

/**
 * Implements the **`address-auto-complete` custom element** that provides auto completion upon the BAN (*Base Adresse Nationale*) api.
 * @category autocomplete
 */
@inject(
  AureliaConfiguration,
  TaskQueue,
  Factory.of(HttpClient),
  NewInstance.of(AutoCompleteController),
  NewInstance.of(AutoCompleteController)
)
export class AddressAutoComplete {
  /** Unique id to identify the custom element instance. @type {string} */
  uniqueId = generateUniqueId();

  /** The query mode of the BAN api. @type {AddressMode} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  mode = 'address';

  /** The resulting selected address. @type {Adresse} */
  @bindable({ defaultBindingMode: bindingMode.twoWay })
  value;

  /** @type {Adresse} */
  @observable
  addressCity;

  /** The place holder text. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  placeholder;

  /** Enable/Disable the custom element to prevent user modification. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  disabled = false;

  /** Autosize width of the dropdown to the parent's width. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  autosize = false;

  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  manualEntry = false;

  /** @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  showIcon = true;

  /** @type {HttpClient} */ _client;
  /** @type {AutoCompleteController<Adresse>} */ addressAutoCompleteController;
  /** @type {AutoCompleteController<Adresse>} */ zipCodeAutoCompleteController;

  /**
   * Creates an instance of the `address-auto-complete` custom element.
   * @param {AureliaConfiguration} configuration application configuration
   * @param {TaskQueue} taskqueue aurelia asynchronous task queue
   * @param {HttpClientFactory} createHttpClient http client factory
   * @param {AutoCompleteController} addressController autocomplete controller that retrieves data on the fly
   * @param {AutoCompleteController} zipCodeController autocomplete controller that retrieves data on the fly
   */
  constructor(configuration, taskqueue, createHttpClient, addressController, zipCodeController) {
    this._client = createHttpClient();
    this._taskqueue = taskqueue;
    const url = configuration.get('api.address');
    this._client.configure(httpClientConfiguration =>
      httpClientConfiguration.withBaseUrl(url).withDefaults({ headers: { Accept: 'application/json' } })
    );
    this.addressAutoCompleteController = addressController;
    this.zipCodeAutoCompleteController = zipCodeController;
  }

  /**
   * Defines the query mode.
   */
  setMode() {
    this.configureAutoComplete(this.mode, this.addressAutoCompleteController);
    this.configureAutoComplete('zipCode', this.zipCodeAutoCompleteController);
  }

  configureAutoComplete(mode, controller) {
    const { requestFactory, buildItemModel } = options[mode];
    const search = requestFactory(this.searchAdresse.bind(this));
    controller.configure(search, buildItemModel);
  }

  get isManualEntryEnabled() {
    return this.manualEntry && this.mode === 'address';
  }

  /**
   * Queries the BAN api.
   * @param {string} query text to search for
   * @param {string} type type of query
   * @param {number} limit max number of responses
   * @param {string} postcode zip code
   * @param {string} cityCode city code
   * @returns {Promise<Adresse[]>} the list of corresponding address
   */
  async searchAdresse(query, type, limit, postcode, cityCode) {
    let url = '/search/?q=' + query;
    if (type) url = url + '&type=' + type;
    if (limit) url = url + '&limit=' + limit;
    if (postcode) url = url + '&postcode=' + postcode;
    if (cityCode) url = url + '&citycode=' + cityCode;
    url = encodeURI(url);
    if (!this._client) return;
    /** @type {FeatureCollection} */
    const result = await this._client.fetch(url).then(response => response.json());
    return result.features.map(feature => {
      const banAddress = /** @type {BanAdress} */ feature.properties;
      // @ts-ignore
      return Adresse.fromObject({
        banId: banAddress.id,
        numero: banAddress.housenumber,
        nomVoie: banAddress.street,
        codeInsee: banAddress.citycode,
        codePostal: banAddress.postcode,
        codeCommune: banAddress.citycode,
        commune: banAddress.city,
        oldCommune: banAddress.oldcity,
        context: banAddress.context,
        label: banAddress.label
      });
    });
  }

  addressCityChanged(newValue, oldValue) {
    Object.assign(this.value, {
      codePostal: newValue?.codePostal,
      codeCommune: newValue?.codeCommune,
      commune: newValue?.commune
    });
  }

  addressNotListedChanged() {
    this._taskqueue.queueTask(() => {
      this.value = Object.assign(new Adresse(), {
        complemet: this.value?.complement,
        isAddressNotListed: this.value?.isAddressNotListed
      });
      // @ts-ignore
      this.addressCity = new Adresse();
    });
  }

  bind() {
    this.setMode();
    if (this.value?.isAddressNotListed) {
      this.addressCity = Object.assign(new Adresse(), this.value);
    }
  }
}
