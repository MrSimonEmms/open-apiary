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
} from '../setup';

describe('/apiary', () => {
  let app: any;

  let token: string;

  beforeEach(async () => {
    token = (await login()).token;
  });

  describe('GET', () => {
    beforeEach(async () => {
      app = (await request())
        .get('/api/apiary');
    });

    it('should return 401 if not authenticated', () => app
      .expect(401));

    it('should return all apiaries', () => app
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Apiary 1',
            location: {
              id: 1,
              latitude: 52.3396,
              longitude: -1.52489,
            },
            image: null,
            hives: [
              expect.objectContaining({
                id: expect.any(Number),
                apiaryCount: 1,
                uuid: '26d02afd-a9a2-498d-a310-8985c7908a27',
                establishedDate: '2019-05-01',
                origin: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                inspections: [
                  expect.objectContaining({
                    id: 1,
                    date: '2019-02-01T00:00:00.000Z',
                    stores: 2,
                    room: 1,
                    temper: 10,
                    supers: -1,
                    varroa: 'L',
                    notes: 'Here is some notes in **markdown**.\n\nAnd on _another_ line.',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  }),
                ],
              }),
              expect.objectContaining({
                id: expect.any(Number),
                apiaryCount: 2,
                uuid: '1b18e796-0d20-4c62-adc5-b7308dbcac7c',
                establishedDate: '2020-01-20',
                origin: 'Some origin detail',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                inspections: [],
              }),
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Apiary 2',
            location: {
              id: 2,
              latitude: 52.78022,
              longitude: -2.42895,
            },
            image: null,
            hives: [
              expect.objectContaining({
                id: expect.any(Number),
                apiaryCount: 1,
                uuid: 'a16a4258-ce84-4138-9a3c-801be9add796',
                establishedDate: '2020-01-20',
                origin: 'Some multiline origin\n\nThis is the multiline bit',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                inspections: [],
              }),
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]);
      }));
  });

  describe('POST', () => {
    beforeEach(async () => {
      app = (await request())
        .post('/api/apiary');
    });

    it('should return 401 if not authenticated', () => app
      .expect(401));

    it('should return 400 if invalid data', () => app
      .set('authorization', `bearer ${token}`)
      .expect(400, {
        statusCode: 400,
        message: [
          'name must be shorter than or equal to 200 characters',
          'name must be a string',
          'name should not be empty',
          'location should not be empty',
        ],
        error: 'Bad Request',
      }));

    it('should create a valid ', () => app
      .set('authorization', `bearer ${token}`)
      .send({
        name: 'Apiary Name',
        location: {
          latitude: 1.234,
          longitude: 2.34,
        },
        image: 1,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          name: 'Apiary Name',
          location: expect.objectContaining({
            id: expect.any(Number),
            latitude: 1.234,
            longitude: 2.34,
          }),
          image: {
            id: 1,
          },
        }));
      }));
  });

  describe('/:id', () => {
    describe('/weather', () => {
      describe('GET', () => {
        it('should return 401 if not authenticated', async () => (await request())
          .get('/api/apiary/1/weather')
          .expect(401));

        it('should get the apiary weather', async () => (await request())
          .get('/api/apiary/1/weather')
          .set('authorization', `bearer ${token}`)
          .expect(200, {
            desc: 'FAIR',
            temp: 12,
          }));
      });
    });

    describe('DELETE', () => {
      it('should return 401 if not authenticated', async () => (await request())
        .delete('/api/apiary/1')
        .expect(401));

      it('should return 404 if apiary not found', async () => (await request())
        .delete('/api/apiary/100')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should fail to delete an apiary with hives', async () => (await request())
        .delete('/api/apiary/1')
        .set('authorization', `bearer ${token}`)
        .expect(400, {
          statusCode: 400,
          message: 'DELETE_ALL_HIVES_FIRST',
        }));

      it('should delete an apiary', async () => {
        const apiaryId = 1;

        /* Get the hive IDs */
        const { body: hives } = await (await request())
          .get(`/api/apiary/${apiaryId}/hive`)
          .set('authorization', `bearer ${token}`)
          .expect(200);

        await destroyApp();

        const hiveIds = hives.map(({ id }) => id);

        /* Delete the hives sequentially */
        await hiveIds.reduce((thenable, hiveId) => thenable
          .then(async () => {
            await (await request())
              .delete(`/api/apiary/${apiaryId}/hive/${hiveId}`)
              .set('authorization', `bearer ${token}`)
              .expect(200);

            await destroyApp();
          }), Promise.resolve());

        await (await request())
          .delete(`/api/apiary/${apiaryId}`)
          .set('authorization', `bearer ${token}`)
          .expect(200);
      });
    });

    describe('GET', () => {

      it('should return 401 if not authenticated', async () => (await request())
        .get('/api/apiary/1')
        .expect(401));

      it('should return 404 if not found', async () => (await request())
        .get('/api/apiary/22222')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should return the apiary', async () => (await request())
        .get('/api/apiary/1')
        .set('authorization', `bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            id: 1,
            name: 'Apiary 1',
            location: { id: 1, latitude: 52.3396, longitude: -1.52489 },
            image: null,
            hives: [
              expect.objectContaining({
                id: expect.any(Number),
                apiaryCount: 1,
                uuid: '26d02afd-a9a2-498d-a310-8985c7908a27',
                establishedDate: '2019-05-01',
                origin: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                inspections: [
                  expect.objectContaining({
                    id: 1,
                    date: '2019-02-01T00:00:00.000Z',
                    stores: 2,
                    room: 1,
                    temper: 10,
                    supers: -1,
                    varroa: 'L',
                    notes: 'Here is some notes in **markdown**.\n\nAnd on _another_ line.',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  }),
                ],
              }),
              expect.objectContaining({
                id: expect.any(Number),
                apiaryCount: 2,
                uuid: '1b18e796-0d20-4c62-adc5-b7308dbcac7c',
                establishedDate: '2020-01-20',
                origin: 'Some origin detail',
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                inspections: [],
              }),
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }));
        }));
    });

    describe('PUT', () => {
      it('should return 401 if not authenticated', async () => (await request())
        .put('/api/apiary/1')
        .expect(401));

      it('should insert if doesn\'t exist', async () => (await request())
        .put('/api/apiary/22222')
        .send({
          name: 'Some apiary',
          location: {
            latitude: -90,
            longitude: -180,
          },
        })
        .set('authorization', `bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: 'Some apiary',
            location: expect.objectContaining({
              id: expect.any(Number),
              latitude: -90,
              longitude: -180,
            }),
          }));
        }));

      it('should up if does exist', async () => (await request())
        .put('/api/apiary/1')
        .send({
          name: 'hello world',
          location: {
            latitude: 90,
            longitude: 180,
          },
        })
        .set('authorization', `bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            id: 1,
            location: expect.objectContaining({
              id: expect.any(Number),
              latitude: 90,
              longitude: 180,
            }),
          }));
        }));
    });
  });
});
