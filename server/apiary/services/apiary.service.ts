/**
 * apiary.service
 */

/* Node modules */

/* Third-party modules */
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

/* Files */
import Apiary from '../entities/apiary.entity';
import { ICurrentWeather } from '../interfaces/openWeather';
import { IWeather, IWeatherTypes } from '../interfaces/apiary';

function numberBetween(target: number, min: number, max: number) : boolean {
  return target >= min && target <= max;
}

@Injectable()
export default class ApiaryService extends TypeOrmCrudService<Apiary> {
  protected weatherApi: string;

  constructor(
    @InjectRepository(Apiary) protected repo,
    protected configService: ConfigService,
    protected readonly httpService: HttpService,
    protected logger: PinoLogger,
  ) {
    super(repo);

    this.weatherApi = this.configService.get('weather.url', 'https://api.openweathermap.org');
  }

  async getWeather(lat: number, lon: number) : Promise<IWeather> {
    /* Default to FAIR and 12°C */
    let desc: IWeatherTypes = IWeatherTypes.FAIR;
    const temp = 12;

    try {
      const { data } = await this.httpService.get<ICurrentWeather>('/data/2.5/weather', {
        baseURL: this.weatherApi,
        params: {
          lat,
          lon,
          units: 'metric',
          appid: this.configService.get('weather.apiKey'),
        },
      }).toPromise();

      const [weather] = data.weather;

      const weatherId: number | null = (weather && weather.id) ? weather.id : null;

      const weatherType = ApiaryService.convertToWeatherTypes(weatherId);

      if (weatherType !== null) {
        desc = weatherType;
      }

      const output = {
        desc,
        temp: Math.round(data.main.temp),
      };

      this.logger.info({
        output,
      }, 'Returning weather data');

      return output;
    } catch (err) {
      this.logger.error({
        err,
      }, 'Failed to get weather data');

      /* Return default */
      return {
        desc,
        temp,
      };
    }
  }

  static convertToWeatherTypes(weatherId: number | null) : IWeatherTypes | null {
    let desc : IWeatherTypes | null = null;

    if (weatherId !== null) {
      /*
        Select the weather types

        @link https://openweathermap.org/weather-conditions
       */
      if (numberBetween(weatherId, 200, 232)) {
        desc = IWeatherTypes.STORM;
      } else if (numberBetween(weatherId, 300, 321) || numberBetween(weatherId, 500, 531)) {
        desc = IWeatherTypes.RAIN;
      } else if (numberBetween(weatherId, 600, 622)) {
        desc = IWeatherTypes.SNOW;
      } else if (numberBetween(weatherId, 800, 802)) {
        /* Slight liberty here - anything under 50% cloud cover is "sunny" */
        desc = IWeatherTypes.SUN;
      } else if (weatherId === 803) {
        /* 50%-75% cloud is FAIR */
        desc = IWeatherTypes.FAIR;
      } else if (weatherId === 804) {
        /* 75%-100% cloud is CLOUD */
        desc = IWeatherTypes.CLOUD;
      }
    }

    return desc;
  }
}
