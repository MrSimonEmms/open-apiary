/**
 * index.e2e-spec
 */

/* Node modules */

/* Third-party modules */

/* Files */
import {
  destroyApp,
  login,
  getConnection,
  request,
} from '../setup';

describe('/user', () => {
  let app: any;

  describe('GET', () => {
    let token: string;

    beforeEach(async () => {
      token = (await login()).token;

      app = (await request())
        .get('/api/user');
    });

    it('should return 401 if no auth', () => app
      .expect(401));

    it('should return a different user to the logged in one', () => app
      .set('authorization', `bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          emailAddress: 'test@test.com',
        }));
      }));
  });

  describe('DELETE', () => {
    let token: string;

    beforeEach(async () => {
      token = (await login()).token;

      app = (await request())
        .delete('/api/user');
    });

    it('should return 401 if no auth', () => {
      app.url += '/1';

      return app
        .expect(401);
    });

    it('should delete a different user to the logged in one', async () => {
      /* Append the user id */
      const userId = 2;
      app.url += `/${userId}`;

      await app
        .set('authorization', `bearer ${token}`)
        .expect(200, {});

      await destroyApp();

      const { body } = await (await request())
        .get('/api/user/list')
        .set('authorization', `bearer ${token}`)
        .expect(200);

      expect(body.find(({ id }) => id === userId)).toBeUndefined();
    });

    it('should error if trying to delete the logged in one', async () => {
      /* Append the user id */
      const userId = 1;
      app.url += `/${userId}`;

      await app
        .set('authorization', `bearer ${token}`)
        .expect(403);

      await destroyApp();

      const { body } = await (await request())
        .get('/api/user/list')
        .set('authorization', `bearer ${token}`)
        .expect(200);

      expect(body.find(({ id }) => id === userId)).not.toBeUndefined();
    });
  });

  describe('POST', () => {

    describe('no users', () => {
      beforeEach(async () => {
        /* Remove all the users */
        const connection = await getConnection();
        await connection.truncate('user');
        await connection.close();

        app = (await request())
          .post('/api/user');
      });

      it('should create a user with no auth', () => app
        .send({
          name: 'user name',
          emailAddress: 'test@test.com',
          password: 'some-password',
        })
        .expect(201));
    });

    describe('users', () => {
      let token: string;

      beforeEach(async () => {
        token = (await login()).token;

        app = (await request())
          .post('/api/user');
      });

      it('should return 401 if not authorized', () => app
        .expect(401));

      it('should create a user if authorized', () => app
        .set('authorization', `bearer ${token}`)
        .send({
          name: 'new user',
          emailAddress: 'newuser@test.com',
          password: 'some-password',
        })
        .expect(201));

      it('should error if emailAddress repeated', () => app
        .set('authorization', `bearer ${token}`)
        .send({
          name: 'new user',
          emailAddress: 'other-user@test.com',
          password: 'some-password',
        })
        .expect(400));
    });
  });

  describe('UPDATE', () => {
    let token: string;

    beforeEach(async () => {
      token = (await login()).token;

      app = (await request())
        .put('/api/user');
    });

    it('should return 401 if not authorized', () => app
      .expect(401));

    it('should update a user - all details', () => app
      .set('authorization', `bearer ${token}`)
      .send({
        name: 'new user',
        emailAddress: 'newuser@test.com',
        password: 'some-password',
      })
      .expect(200));

    it('should update a user - email only', () => app
      .set('authorization', `bearer ${token}`)
      .send({
        emailAddress: 'changeduser@test.com',
      })
      .expect(200));

    it('should error if using an existing email address', () => app
      .set('authorization', `bearer ${token}`)
      .send({
        emailAddress: 'other-user@test.com',
      })
      .expect(400));
  });

  describe('/auth', () => {
    describe('POST', () => {
      beforeEach(async () => {
        app = (await request())
          .post('/api/user/auth');
      });

      it('should test successful login', () => app
        .send({
          emailAddress: 'test@test.com',
          password: 'q1w2e3r4',
        })
        .expect(201)
        .then(({ body }) => {
          expect(body).toEqual(expect.objectContaining({
            expires: expect.any(String),
            token: expect.any(String),
            user: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              emailAddress: 'test@test.com',
            }),
          }));
        }));

      it('should test unsuccessful login - wrong username', () => app
        .send({
          emailAddress: 'te5t@test.com',
          password: 'q1w2e3r4',
        })
        .expect(401));

      it('should test unsuccessful login - wrong password', () => app
        .send({
          emailAddress: 'test@test.com',
          password: 'q1w2e3r4t5',
        })
        .expect(401));

      it('should test unsuccessful login - wrong username and password', () => app
        .send({
          emailAddress: 'test',
          password: 'pa55word',
        })
        .expect(401));
    });
  });

  describe('/list', () => {
    describe('GET', () => {
      let token: string;

      beforeEach(async () => {
        token = (await login()).token;

        app = (await request())
          .get('/api/user/list');
      });

      it('should return 401 if not authorized', () => app
        .expect(401));

      it('should return the list of users', async () => {
        const { body } = await app
          .set('authorization', `bearer ${token}`)
          .expect(200);

        expect(body).toEqual([{
          id: expect.any(Number),
          name: 'Test',
          emailAddress: 'test@test.com',
          changeOnLogin: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }, {
          id: expect.any(Number),
          name: 'Other User',
          emailAddress: 'other-user@test.com',
          changeOnLogin: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }]);
      });
    });

  });

  describe('/setup', () => {
    describe('GET', () => {
      beforeEach(async () => {
        app = (await request())
          .get('/api/user/setup');
      });

      it('should check that the setup endpoint returns false if no users', async () => {
        /* Remove all the users */
        const connection = await getConnection();
        await connection.truncate('user');
        await connection.close();

        return app
          .expect(200, {
            isSetup: false,
          });
      });

      it('should check that the setup endpoint returns true', () => app
        .expect(200)
        .expect({
          isSetup: true,
        }));
    });
  });
});
