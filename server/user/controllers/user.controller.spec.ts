/**
 * user.controller.spec
 */

/* Node modules */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, RequestMethod } from '@nestjs/common';

/* Files */
import UserController from './user.controller';
import UserService from '../services/user.service';

describe('User Controller', function () {
  let controller: UserController;

  beforeEach(async () => {
    this.mockUserService = {
      findByEmailAndPassword: jest.fn(),
      generateUserToken: jest.fn(),
      toDTO: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: this.mockUserService,
      }],
    }).compile();

    controller = module.get<UserController>(UserController);

    expect(Reflect.getMetadata('path', UserController)).toBe('/api/user');
  });

  describe('#authenticate', () => {
    beforeEach(() => {
      expect(Reflect.getMetadata('path', controller.authenticate)).toBe('/auth');
      expect(Reflect.getMetadata('method', controller.authenticate)).toBe(RequestMethod.POST);
    });

    it('should throw HTTP exception if no user returned', async () => {
      const emailAddress = 'test@test.com';
      const password = 'invalid-password';

      this.mockUserService.findByEmailAndPassword.mockResolvedValue(undefined);

      try {
        await controller.authenticate({
          emailAddress,
          password,
        });

        expect(true).toEqual(false);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(HttpException).toBeCalledWith('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

        expect(this.mockUserService.findByEmailAndPassword).toHaveBeenCalledTimes(1);
        expect(this.mockUserService.findByEmailAndPassword)
          .toHaveBeenCalledWith(emailAddress, password);
      }
    });

    it('should generate a token and public user data if user found', async () => {
      const emailAddress = 'valid@test.com';
      const password = 'valid-password';

      const token = {
        expiry: new Date(Date.now() + 8640000),
        token: 'some-token',
      };
      const userDto = 'userDto';

      const user = {
        emailAddress,
        password,
        id: 1,
      };

      this.mockUserService.findByEmailAndPassword.mockResolvedValue(user);
      this.mockUserService.generateUserToken.mockReturnValue(token);
      this.mockUserService.toDTO.mockReturnValue(userDto);

      const loginDTO = await controller.authenticate(({
        emailAddress,
        password,
      }));

      expect(this.mockUserService.findByEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(this.mockUserService.findByEmailAndPassword)
        .toHaveBeenCalledWith(emailAddress, password);

      expect(this.mockUserService.generateUserToken).toHaveBeenCalledTimes(1);
      expect(this.mockUserService.generateUserToken).toHaveBeenCalledWith(user);

      expect(this.mockUserService.toDTO).toHaveBeenCalledTimes(1);
      expect(this.mockUserService.toDTO).toHaveBeenCalledWith(user);

      expect(loginDTO).toEqual({
        ...token,
        user: userDto,
      });
    });
  });

  describe('#user', () => {
    beforeEach(() => {
      const guards = Reflect.getMetadata('__mockedGuards__', controller.user);
      expect(guards).toHaveLength(1);
      expect(guards[0]()).toEqual([
        'jwt',
      ]);
      expect(Reflect.getMetadata('path', controller.user)).toBe('/');
      expect(Reflect.getMetadata('method', controller.user)).toBe(RequestMethod.GET);
    });

    it('should return the user object', () => {
      const req = {
        user: 'userObj',
      };

      expect(controller.user(req)).toBe(req.user);
    });
  });
});
