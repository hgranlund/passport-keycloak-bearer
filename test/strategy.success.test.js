const { expect } = require('chai')
const passport = require('chai-passport-strategy')
const nock = require('nock')
const KeycloakBearerStrategy = require('../src')
const { validToken, jwksResponse } = require('./testData')
const options = {
  realm: 'realm',
  host: 'https://host.com',
  clientId: 'clientId'
}

describe('KeycloakBearerStrategy', () => {
  nock(options.host)
    .get(`/auth/realms/${options.realm}/protocol/openid-connect/certs`)
    .reply(200, jwksResponse)
    .persist()

  const strategy = new KeycloakBearerStrategy(options, (verifidToken, done) => {
    if (verifidToken) {
      return done(null, verifidToken, { scope: 'read' })
    }
    return done(null, false)
  })

  describe('handling a request with valid token in header', () => {
    let user
    let info

    before(done => {
      passport
        .use(strategy)
        .success((u, i) => {
          user = u
          info = i
          done()
        })
        .req(req => {
          req.headers.authorization = `Bearer ${validToken}`
        })
        .authenticate()
    })

    it('should supply user', () => {
      expect(user).to.be.an('object')
      expect(user.name).to.equal('Simen Granlund')
    })

    it('should supply info', () => {
      expect(info).to.be.an('object')
      expect(info.scope).to.equal('read')
    })
  })
})
