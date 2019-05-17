const { Strategy, ExtractJwt } = require('passport-jwt')
const { verifyOptions, setDefaults } = require('./options')
const OIDCManager = require('./oidcMatadata')

const defaultVerify = (jwtPayload, done) => {
  if (jwtPayload) {
    return done(null, jwtPayload)
  }
  return done(null, false)
}

class KeycloakBearerStrategy extends Strategy {
  constructor (options, verify) {
    verifyOptions(options)
    const opts = setDefaults(options)
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    const oidcManager = new OIDCManager(opts.url, opts.realm, opts.log)
    opts.secretOrKeyProvider = (req, token, done) => {
      oidcManager
        .pemKeyFromToken(token)
        .then(key => done(null, key))
        .catch(err => {
          opts.log.warn(err)
          done(err)
        })
    }
    super(opts, verify || defaultVerify)
    this.name = opts.name
    opts.log.debug('Strategy created')
  }
}

module.exports = KeycloakBearerStrategy
