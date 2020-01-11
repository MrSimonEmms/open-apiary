/**
 * user.server
 */

/* Node modules */

/* Third-party modules */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { when } from 'jest-when';

/* Files */
import UserService from './user.service';
import User from '../entities/user.entity';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', function () {
  let service: UserService;

  beforeEach(async () => {
    this.configService = {
      get: jest.fn(),
    };

    this.userRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: ConfigService,
        useValue: this.configService,
      }, {
        provide: getRepositoryToken(User),
        useValue: this.userRepo,
      }, UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('#findByEmailAndPassword', () => {
    it('should return undefined if cannot find user by emailAddress', async () => {
      this.userRepo.findOne.mockResolvedValue(undefined);

      const emailAddress = 'test1@test.com';
      const password = 'untested-password';

      expect(await service.findByEmailAndPassword(emailAddress, password)).toBeUndefined();

      expect(this.userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(this.userRepo.findOne).toHaveBeenCalledWith({
        emailAddress,
      });
    });

    it('should return undefined if can find user by emailAddress but not match password', async () => {
      const dbPassword = 'some-db-password';
      this.userRepo.findOne.mockResolvedValue({
        password: dbPassword,
      });

      const emailAddress = 'test2@test.com';
      const password = 'invalid-password';

      (<any> bcrypt.compare).mockResolvedValue(false);

      expect(await service.findByEmailAndPassword(emailAddress, password)).toBeUndefined();

      expect(this.userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(this.userRepo.findOne).toHaveBeenCalledWith({
        emailAddress,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(password, dbPassword);
    });

    it('should return undefined if can find user by emailAddress and match password', async () => {
      const dbPassword = 'valid-password';
      const user = {
        password: dbPassword,
      };
      this.userRepo.findOne.mockResolvedValue(user);

      const emailAddress = 'test3@test.com';
      const password = 'valid-password';

      (<any> bcrypt.compare).mockResolvedValue(true);

      expect(await service.findByEmailAndPassword(emailAddress, password)).toBe(user);

      expect(this.userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(this.userRepo.findOne).toHaveBeenCalledWith({
        emailAddress,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(password, dbPassword);
    });
  });

  describe('#generateUserToken', () => {
    it('should generate the JWT for the user and return the expiry date object', () => {
      const configStubs = {
        expiry: '1 days',
        secret: 'some-secret',
        issuer: 'some-issuer',
      };

      Object.keys(configStubs)
        .forEach((key) => {
          when(this.configService.get)
            .calledWith(`jwt.${key}`)
            .mockReturnValue(configStubs[key]);
        });

      const token = 'some-token';
      (<any> jwt.sign).mockReturnValue(token);

      const user = new User();
      user.id = 23;
      user.name = 'Some User';
      user.emailAddress = 'test@test.com';
      user.password = 'password';

      const result = service.generateUserToken(user);

      /* Might be a bit flakey - if starts failing, mock the date object */
      expect(result.expires.getTime())
        .toBeLessThan(new Date(Date.now() + ms(configStubs.expiry)).getTime());
      expect(result.token).toEqual(token);

      expect(jwt.sign).toHaveBeenCalledWith({
        id: user.id,
        emailAddress: user.emailAddress,
      }, configStubs.secret, {
        expiresIn: configStubs.expiry,
        issuer: configStubs.issuer,
        notBefore: 0,
      });
    });
  });

  describe('#toDTO', () => {
    it('should cast the User object to the DTO', () => {
      const user = new User();
      user.id = 1;
      user.name = 'some-name';
      user.emailAddress = 'test@test.com';
      user.password = 'some-pass';

      const dto = service.toDTO(user);

      expect(dto).not.toHaveProperty('password');
    });
  });
});
