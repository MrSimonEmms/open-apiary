/**
 * inspection.e2e-spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import {
  login,
  request,
} from '../../../../setup';

describe('/apiary/:id/hive/:id/inspection', () => {
  let token: string;

  beforeEach(async () => {
    token = (await login()).token;
  });

  describe('GET', () => {

    it('should return 401 if not authenticated', async () => (await request())
      .get('/api/apiary/1/hive/1/inspection')
      .expect(401));

    it('should list all inspections for a hive', async () => (await request())
      .get('/api/apiary/1/hive/1/inspection')
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
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
            queen: {
              id: 1,
              clipped: true,
              marked: 'red',
              seen: true,
            },
            queenCell: {
              id: 1,
              left: 1,
              removed: 2,
            },
            brood: {
              id: 1,
              eggs: true,
              frames: 2,
              pattern: true,
            },
            feed: [{
              id: 1,
              quantity: 0,
              type: 'Light Syrup',
            }],
            health: {
              id: 1,
              ok: false,
              diseases: [
                'American Foul Brood',
                'Nosema',
              ],
            },
            weather: {
              id: 1,
              temp: 12,
              desc: 'SUN',
            },
          }),
        ]);
      }));

  });

  describe('POST', () => {

    it('should return 401 if not authenticated', async () => (await request())
      .post('/api/apiary/1/hive/1/inspection')
      .expect(401));

    it('should return 400 if invalid data', async () => (await request())
      .post('/api/apiary/1/hive/1/inspection')
      .set('authorization', `bearer ${token}`)
      .expect(400, {
        statusCode: 400,
        message: [
          'date must be a valid ISO 8601 date string',
          'date should not be empty',
          'stores must not be less than 0',
          'stores must be an integer number',
          'stores should not be empty',
          'room must not be less than 0',
          'room must be an integer number',
          'room should not be empty',
          'temper must not be greater than 10',
          'temper must not be less than 0',
          'temper must be an integer number',
          'temper should not be empty',
          'supers must be an integer number',
          'supers should not be empty',
          'varroa must be one of the following values: L,M,H',
          'varroa should not be empty',
          'notes must be a string',
          'queen should not be empty',
          'queenCell should not be empty',
          'brood should not be empty',
          'health should not be empty',
          'weather should not be empty',
          'feed must contain at least 1 elements',
          'feed must be an array',
          'feed should not be empty',
        ],
        error: 'Bad Request',
      }));

    it('should create a new inspection', async () => (await request())
      .post('/api/apiary/1/hive/1/inspection')
      .set('authorization', `bearer ${token}`)
      .send({
        date: '2020-01-02',
        stores: 1,
        room: 1,
        temper: 9,
        supers: 0,
        varroa: 'M',
        notes: 'this is some notes',
        feed: [{
          quantity: 1,
          type: 'syrup',
        }],
        queen: {
          clipped: false,
          marked: true,
          seen: true,
        },
        queenCell: {
          left: 0,
          removed: 1,
        },
        brood: {
          eggs: true,
          frames: 1,
          pattern: true,
        },
        health: {
          ok: true,
          diseases: [
            'varroa',
          ],
        },
        weather: {
          temp: 14,
          desc: 'SUN',
        },
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          date: '2020-01-02T00:00:00.000Z',
          stores: 1,
          room: 1,
          temper: 9,
          supers: 0,
          varroa: 'M',
          notes: 'this is some notes',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          queen: {
            id: expect.any(Number),
            clipped: false,
            marked: true,
            seen: true,
          },
          queenCell: {
            id: expect.any(Number),
            left: 0,
            removed: 1,
          },
          brood: {
            id: expect.any(Number),
            eggs: true,
            frames: 1,
            pattern: true,
          },
          feed: [{
            id: expect.any(Number),
            quantity: 1,
            type: 'syrup',
          }],
          health: {
            id: expect.any(Number),
            ok: true,
            diseases: [
              'varroa',
            ],
          },
          weather: {
            id: expect.any(Number),
            temp: 14,
            desc: 'SUN',
          },
        }));
      }));

  });

  describe('/:id', () => {

    describe('DELETE', () => {

      it('should return 401 if not authenticated', async () => (await request())
        .delete('/api/apiary/1/hive/1/inspection/1')
        .expect(401));

      it('should return 404 if trying to delete an inspection that doesn\'t exist', async () => (await request())
        .delete('/api/apiary/1/hive/1/inspection/1000')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should delete an inspection', async () => (await request())
        .delete('/api/apiary/1/hive/1/inspection/1')
        .set('authorization', `bearer ${token}`)
        .expect(200));

    });

  });

});
