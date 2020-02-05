/**
 * apiary
 */

/* Node modules */

/* Third-party modules */

/* Files */

export enum QueenMarked {
  WHITE = 'white', // year ending 1 or 6
  YELLOW = 'yellow', // 2 or 7
  RED = 'red', // 3 or 8
  GREEN = 'green', // 4 or 9
  BLUE = 'blue', // 5 or 0
}

export interface IBrood {
  eggs: boolean;
  pattern: boolean;
  frames: number;
}

export interface IFeed {
  quantity: number;
  type: string;
}

export interface IHealth {
  ok: boolean;
  diseases: string[];
}

export interface IQueen {
  seen: boolean;
  clipped: boolean;
  marked: QueenMarked | boolean;
}

export interface IQueenCell {
  removed: number;
  left: number;
}

export interface IWeather {
  temp: number;
  desc: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IInspection {
  id: number;
  date: Date;
  stores: number;
  room: number;
  temper: number;
  supers: number;
  varroa: string;
  notes: string;
  queen: IQueen;
  queenCell: IQueenCell;
  brood: IBrood;
  health: IHealth;
  feed: IFeed[];
  weather: IWeather;
  hive: IHive;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHive {
  id: number;
  apiaryCount: number;
  uuid: string;
  establishedDate: Date;
  origin: string;
  inspections: IInspection[];
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
