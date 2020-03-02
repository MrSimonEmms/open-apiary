/**
 * openWeather
 *
 * These interfaces are only the relevant pieces we
 * need. There will be additional pieces of data that
 * are returned that we're not interested in.
 */

/* Node modules */

/* Third-party modules */

/* Files */

// @link https://openweathermap.org/current#current_JSON
export interface ICurrentWeather {
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
  };
}
