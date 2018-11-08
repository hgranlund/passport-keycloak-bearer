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
});
