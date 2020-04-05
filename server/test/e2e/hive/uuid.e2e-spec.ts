/**
 * uuid.e2e-spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import {
  login,
  request,
} from '../setup';

describe('/hive/uuid', () => {
  describe('/:uuid', () => {
    describe('GET', () => {
      let token: string;

      beforeEach(async () => {
        token = (await login()).token;
      });

      it('should return 401 if no auth', async () => (await request())
        .get('/api/hive/uuid/26d02afd-a9a2-498d-a310-8985c7908a27')
        .expect(401));

      it('should return 404 if unknown uuid', async () => (await request())
        .get('/api/hive/uuid/ssss')
        .set('authorization', `bearer ${token}`)
        .expect(404));

      it('should return the hive model', async () => (await request())
        .get('/api/hive/uuid/26d02afd-a9a2-498d-a310-8985c7908a27')
        .set('authorization', `bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            apiaryCount: 1,
            uuid: '26d02afd-a9a2-498d-a310-8985c7908a27',
            establishedDate: '2019-05-01',
            origin: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            apiary: {
              id: expect.any(Number),
              name: 'Apiary 1',
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          }));
        }));
    });
  });
});
