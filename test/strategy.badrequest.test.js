import { passport, expect } from 'chai';
import KeycloakBearerStrategy from '../src';

const options = { realm: 'realm', host: 'host', clientId: 'clientId' };
xdescribe('KeycloakBearerStrategy', () => {
  const strategy = new KeycloakBearerStrategy(options, ((token, done) => {
    if (token) {
      return done(null, { id: '1234' }, { scope: 'read' });
    }
    return done(null, false);
  }));

  describe('handling a request with token included in more than one way', () => {
    let statusCode;

    before((done) => {
      passport.use(strategy)
        .fail((s, code) => {
          statusCode = code;
          done();
        })
        .req((req) => {
          req.headers.authorization = 'BEARER vF9dft4qmT';
          req.query = {};
          req.query.access_token = 'vF9dft4qmT';
        })
        .authenticate();
    });

    it('should fail with status', () => {
      expect(statusCode);
      expect(statusCode).to.equal(400);
    });
  });
});
