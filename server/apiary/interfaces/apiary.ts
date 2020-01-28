/**
 * apiary
 */

/* Node modules */

/* Third-party modules */

/* Files */

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IHive {
  id: number;
  apiaryCount: number;
  uuid: string;
  establishedDate: Date;
  origin: string;
  apiary: IApiary;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiary {
  id: number;
  name: string;
  image?: number;
  location: ILocation,
  hives: IHive[];
  createdAt: Date;
  updatedAt: Date;
}
