declare type Mandatory<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export type DialogServiceParameter = {
  viewModel: any;
  view?: any;
  model?: any;
  locked?: boolean;
  fullscreen?: boolean;
};

export type DataSource = {
  data: any[];
  totalElements: number;
};

export enum EnvironmentTypeEnum {
  dev,
  recette,
  preprod,
  prod
}

export type EnvironmentType = 'dev' | 'recette' | 'preprod' | 'prod';

export type EnvironmentDescriptor = {
  type: EnvironmentType;
  name: string;
};

export type RibbonPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type ThemeColor = 'info' | 'warning' | 'danger' | 'success' | 'primary' | 'secondary';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export type AddressMode = 'zipCode' | 'address';

export type DisplayValueFormater<T> = (item: T) => string;

export type ItemModelBuilder<T, U> = (item: T) => T | U;

export type Search<T> = (text: string, ...params) => Promise<T[]>;

export type AutoCompleteControllerConfiguration<T> = {
  requestFactory: (callback: Search<T>) => Search<T>;
  buildItemModel: (item: T) => T;
};

declare type SupportedFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';

declare type DateFormatValidator = {
  regexp: RegExp;
  matches: {
    day: number;
    month: number;
    year: number;
  };
  output?: {
    culture: Intl.LocalesArgument;
    options: Intl.DateTimeFormatOptions;
  }

};

/**
 * The BAN (*Base Adresse Nationale*) api address model
 */
export type BanAddress = {
  /** full address */ label: string; // "8 Boulevard du Port 80000 Amiens"
  /** correspondance score */ score: number; // 0.49159121588068583
  /** house number */ housenumber: string; // "8"
  /** BAN id */ id: string; // "80021_6590_00008"
  /** result type */ type: string; // "housenumber"
  /** street name */ name: string; // "8 Boulevard du Port"
  /** zip code */ postcode: string; // "80000"
  /** INSEE city code */ citycode: string; // "80021"
  /** geographic position */ x: number; // 648952.58
  /** geographic position */ y: number; // 6977867.25
  /** city name */ city: string; // "Amiens"
  /** old city name */ oldcity?: string; // "Amiens"
  /** departement & region */ context: string; // "80, Somme, Hauts-de-France"
  /** technical field */ importance: number; // 0.6706612694243868
  /** street name */ street: string; // "Boulevard du Port"
};
