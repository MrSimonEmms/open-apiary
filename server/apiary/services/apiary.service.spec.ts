/**
 * apiary.service.spec
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, HttpModule, HttpService } from '@nestjs/common';
import { LoggerModule, PinoLogger } from 'nestjs-pino/dist';

/* Files */
import ApiaryService from './apiary.service';
import Apiary from '../entities/apiary.entity';
import { IWeatherTypes } from '../interfaces/apiary';

describe('ApiaryService', function () {
  let service: ApiaryService;

  const weatherUrl = 'http://openweather';

  beforeEach(async () => {
    // @todo see if there's a better way of stubbing a DB to CRUD Service
    this.apiaryRepo = {
      metadata: {
        columns: [],
        relations: [],
        connection: {
          options: {
            type: '',
          },
        },
      },
    };

    this.configService = {
      get: jest.fn(),
    };

    this.httpSrv = {
      get: jest.fn(),
    };

    this.configService.get.mockReturnValueOnce(weatherUrl);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        CacheModule.register(),
        HttpModule,
        LoggerModule,
      ],
      providers: [{
        provide: getRepositoryToken(Apiary),
        useValue: this.apiaryRepo,
      }, {
        provide: ConfigService,
        useValue: this.configService,
      }, {
        provide: HttpService,
        useValue: this.httpSrv,
      }, {
        provide: PinoLogger,
        useValue: {
          info: jest.fn(),
          error: jest.fn(),
        },
      }, ApiaryService],
    }).compile();

    service = module.get<ApiaryService>(ApiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect((<any> service).repo).toBe(this.apiaryRepo);
  });

  describe('#getWeather', () => {
    it('should error and return the default data', async () => {
      this.httpSrv.get.mockReturnValue({
        toPromise: jest.fn().mockRejectedValue(new Error('test error')),
      });

      const apiKey = 'some-api-key';
      const lat = 1;
      const lon = 2;

      this.configService.get.mockReturnValueOnce(apiKey);

      expect(await service.getWeather(lat, lon)).toEqual({
        desc: IWeatherTypes.FAIR,
        temp: 12,
      });

      expect(this.httpSrv.get).toBeCalledWith('/data/2.5/weather', {
        baseURL: weatherUrl,
        params: {
          lat,
          lon,
          units: 'metric',
          appid: apiKey,
        },
      });
    });

    it('should return empty weather data and return the default data', async () => {
      const temp = 3.6;

      this.httpSrv.get.mockReturnValue({
        toPromise: jest.fn().mockResolvedValue({
          data: {
            weather: [],
            main: {
              temp,
            },
          },
        }),
      });

      const apiKey = 'some-api-key1';
      const lat = 11;
      const lon = 22;

      this.configService.get.mockReturnValueOnce(apiKey);

      expect(await service.getWeather(lat, lon)).toEqual({
        desc: IWeatherTypes.FAIR,
        temp: Math.round(temp),
      });

      expect(this.httpSrv.get).toBeCalledWith('/data/2.5/weather', {
        baseURL: weatherUrl,
        params: {
          lat,
          lon,
          units: 'metric',
          appid: apiKey,
        },
      });
    });

    it('should return the weather data with no weather type set', async () => {
      const temp = 3.4;

      this.httpSrv.get.mockReturnValue({
        toPromise: jest.fn().mockResolvedValue({
          data: {
            weather: [{
              id: 800,
            }],
            main: {
              temp,
            },
          },
        }),
      });

      const apiKey = 'some-api-key2';
      const lat = 12;
      const lon = 23;

      this.configService.get.mockReturnValueOnce(apiKey);

      expect(await service.getWeather(lat, lon)).toEqual({
        desc: IWeatherTypes.SUN,
        temp: Math.round(temp),
      });

      expect(this.httpSrv.get).toBeCalledWith('/data/2.5/weather', {
        baseURL: weatherUrl,
        params: {
          lat,
          lon,
          units: 'metric',
          appid: apiKey,
        },
      });
    });
  });

  describe('#convertToWeatherTypes', () => {
    it('should return null if weatherId is null', () => {
      expect(ApiaryService.convertToWeatherTypes(null)).toBeNull();
    });

    it('should return Storm if in range', () => {
      for (let i = 200; i <= 232; i += 1) {
        expect(ApiaryService.convertToWeatherTypes(i)).toEqual(IWeatherTypes.STORM);
      }
    });

    it('should return Rain if in range', () => {
      for (let i = 300; i <= 321; i += 1) {
        expect(ApiaryService.convertToWeatherTypes(i)).toEqual(IWeatherTypes.RAIN);
      }

      for (let i = 500; i <= 531; i += 1) {
        expect(ApiaryService.convertToWeatherTypes(i)).toEqual(IWeatherTypes.RAIN);
      }
    });

    it('should return Snow if in range', () => {
      for (let i = 600; i <= 622; i += 1) {
        expect(ApiaryService.convertToWeatherTypes(i)).toEqual(IWeatherTypes.SNOW);
      }
    });

    it('should return Sun if in range', () => {
      for (let i = 800; i <= 802; i += 1) {
        expect(ApiaryService.convertToWeatherTypes(i)).toEqual(IWeatherTypes.SUN);
      }
    });

    it('should return Fair if in range', () => {
      expect(ApiaryService.convertToWeatherTypes(803)).toEqual(IWeatherTypes.FAIR);
    });

    it('should return Cloud if in range', () => {
      expect(ApiaryService.convertToWeatherTypes(804)).toEqual(IWeatherTypes.CLOUD);
    });

    it('should return null if unrecognised range', () => {
      expect(ApiaryService.convertToWeatherTypes(999)).toBeNull();
    });
  });
});
