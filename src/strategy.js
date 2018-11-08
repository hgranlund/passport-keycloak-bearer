import { Strategy, ExtractJwt } from 'passport-jwt';
import { verifyOptions, setDefaults } from './options';
import pemKeyProvider from './pemKeyProvider';

const defaultVerify = ((verifidToken, done) => {
  if (verifidToken) {
    return done(null, verifidToken);
  }
  return done(null, false);
});

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    verifyOptions(options);
    const opts = setDefaults(options);
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // opts.secretOrKey = 'secret';
    opts.secretOrKeyProvider = pemKeyProvider('http://localhost:8080/auth/realms/master/protocol/openid-connect/certs');
    super(opts, verify || defaultVerify);
    this.log = opts.log;
    this.name = opts.name;
    this.log.debug('KeycloakBearerStrategy created');
  }
}
