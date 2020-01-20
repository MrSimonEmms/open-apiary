/**
 * apiary
 */

/* Node modules */

/* Third-party modules */

/* Files */

export interface ILocation {
  lat: number;
  long: number;
  w3w: string;
}

export interface IHive {
  id: number;
  apiary: IApiary;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiary {
  id: number;
  name: string;
  image?: number;
  location?: ILocation,
  hives: IHive[];
  createdAt: Date;
  updatedAt: Date;
}
