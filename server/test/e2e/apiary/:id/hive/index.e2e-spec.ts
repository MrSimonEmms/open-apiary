/**
 * index.e2e-spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import {
  destroyApp,
  login,
  request,
} from '../../../setup';

describe('/apiary/:id/hive', () => {
  let token: string;

  beforeEach(async () => {
    token = (await login()).token;
  });

  describe('GET', () => {

    it('should return 401 if not authenticated', async () => (await request())
      .get('/api/apiary/1/hive')
      .expect(401));

    it('should list all hives in an apiary', async () => (await request())
      .get('/api/apiary/1/hive')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          expect.objectContaining({
            id: expect.any(Number),
            apiaryCount: 1,
            uuid: '26d02afd-a9a2-498d-a310-8985c7908a27',
            establishedDate: '2019-05-01',
            origin: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(Number),
            apiaryCount: 2,
            uuid: '1b18e796-0d20-4c62-adc5-b7308dbcac7c',
            establishedDate: '2020-01-20',
            origin: 'Some origin detail',
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]);
      }));
  });

  describe('POST', () => {

    it('should return 401 if not authenticated', async () => (await request())
      .post('/api/apiary/1/hive')
      .expect(401));

    it('should return 400 if invalid data', async () => (await request())
      .post('/api/apiary/1/hive')
      .set('authorization', `bearer ${token}`)
      .expect(400, {
        statusCode: 400,
        message: [
          'establishedDate must be a valid ISO 8601 date string',
          'establishedDate should not be empty',
        ],
        error: 'Bad Request',
      }));

    it('should create a new hive', async () => (await request())
      .post('/api/apiary/1/hive')
      .set('authorization', `bearer ${token}`)
      .send({
        uuid: '22',
        establishedDate: '2019-02-01',
        origin: 'hive origin',
      })
      .expect(201)
      .then(async ({ body }) => {
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          apiaryCount: 3,
          uuid: expect.any(String),
          establishedDate: '2019-02-01',
          origin: 'hive origin',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }));

        await destroyApp();

        /* Check it's in apiary object */
        const { body: apiary } = await (await request())
          .get('/api/apiary/1')
          .set('authorization', `bearer ${token}`)
          .expect(200);

        const hive = apiary.hives.find(({ id }) => id === body.id);

        expect(hive).toEqual(expect.objectContaining(body));
      }));

    it('should create a new hive and set apiaryCount', async () => (await request())
      .post('/api/apiary/1/hive')
      .set('authorization', `bearer ${token}`)
      .send({
        apiaryCount: 200,
        uuid: '22',
        establishedDate: '2018-03-02',
        apiary: 2,
      })
      .expect(201)
      .then(async ({ body }) => {
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          apiaryCount: 200,
          uuid: expect.any(String),
          establishedDate: '2018-03-02',
          origin: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }));

        await destroyApp();

        /* Check it's in apiary object */
        const { body: apiary } = await (await request())
          .get('/api/apiary/1')
          .set('authorization', `bearer ${token}`)
          .expect(200);

        const hive = apiary.hives.find(({ id }) => id === body.id);

        expect(hive).toEqual(expect.objectContaining(body));
      }));

    it('should create a new hive and error with duplicate apiaryCount', async () => (await request())
      .post('/api/apiary/1/hive')
      .set('authorization', `bearer ${token}`)
      .send({
        apiaryCount: 2,
        uuid: '22',
        establishedDate: '2019-02-01',
        origin: 'hive origin',
        apiary: 2,
      })
      .expect(400, {
        statusCode: 400,
        message: 'APIARY_COUNT_MUST_BE_UNIQUE',
      }));

  });

  describe('/:id', () => {

    describe('DELETE', () => {

      it('should return 401 if not authenticated', async () => (await request())
        .delete('/api/apiary/1/hive/1')
        .expect(401));

      it('should return 404 if apiary not found', async () => (await request())
        .delete('/api/apiary/100/hive/1')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should return 404 if hive not found', async () => (await request())
        .delete('/api/apiary/1/hive/100')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should return 404 if hive not found in apiary', async () => (await request())
        .delete('/api/apiary/1/hive/2')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should delete a hive from an apiary', async () => (await request())
        .delete('/api/apiary/1/hive/1')
        .set('authorization', `bearer ${token}`)
        .expect(200));

    });

    describe('PUT', () => {

      it('should return 401 if not authenticated', async () => (await request())
        .put('/api/apiary/1/hive/1')
        .expect(401));

      it('should return 404 if putting into an apiary that doesn\'t exist', async () => (await request())
        .put('/api/apiary/100/hive/10')
        .set('authorization', `bearer ${token}`)
        .expect(404, {
          statusCode: 404,
          message: 'UNKNOWN_APIARY',
        }));

      it('should return 400 if editing a hive not in the apiary', async () => (await request())
        .put('/api/apiary/2/hive/1')
        .set('authorization', `bearer ${token}`)
        .send({
          apiaryCount: 200,
          uuid: '22',
          establishedDate: '2018-03-02',
        })
        .expect(400));

      it('should insert if doesn\'t exist', async () => (await request())
        .put('/api/apiary/1/hive/20')
        .set('authorization', `bearer ${token}`)
        .send({
          apiaryCount: 200,
          uuid: '22',
          establishedDate: '2018-03-02',
          apiary: 2,
        })
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            id: 20,
            apiaryCount: 200,
            uuid: expect.any(String),
            establishedDate: '2018-03-02',
            origin: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }));

          await destroyApp();

          /* Check it's in apiary object */
          const { body: apiary } = await (await request())
            .get('/api/apiary/1')
            .set('authorization', `bearer ${token}`)
            .expect(200);

          const hive = apiary.hives.find(({ id }) => id === body.id);

          expect(hive).toEqual(expect.objectContaining(body));
        }));

      it('should update if does exist', async () => (await request())
        .put('/api/apiary/1/hive/1')
        .set('authorization', `bearer ${token}`)
        .send({
          establishedDate: '2019-03-02',
          apiary: 2,
        })
        .expect(200)
        .then(async ({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            id: 1,
            apiaryCount: 1,
            uuid: expect.any(String),
            establishedDate: '2019-03-02',
            origin: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }));

          await destroyApp();

          /* Check it's in apiary object */
          const { body: apiary } = await (await request())
            .get('/api/apiary/1')
            .set('authorization', `bearer ${token}`)
            .expect(200);

          const hive = apiary.hives.find(({ id }) => id === body.id);

          expect(hive).toEqual(expect.objectContaining(body));
        }));

    });
  });

});
