/**
 * db-reset.spec
 */

/* Node modules */

/* Third-party modules */
import supertest from 'supertest'; // eslint-disable-line import/no-extraneous-dependencies
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing'; // eslint-disable-line import/no-extraneous-dependencies

/* Files */
import AppModule from '../../app.module';

const dataIngester = require('../../../data/init');

let app : INestApplication;

export const destroyApp = async () => {
  if (app) {
    await app.close();

    /* Remove definition to prevent being run again */
    app = undefined;
  }
};

export const getConnection = () => dataIngester.getConnection();

export const request = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  return supertest(app.getHttpServer());
};

export const login = async (emailAddress: string = 'test@test.com', password: string = 'q1w2e3r4') : Promise<any> => {
  const { body } = await (await request())
    .post('/api/user/auth')
    .send({
      emailAddress,
      password,
    });

  await destroyApp();

  return body;
};

export {
  supertest,
};

beforeEach(() => dataIngester(false));

afterEach(() => destroyApp());
