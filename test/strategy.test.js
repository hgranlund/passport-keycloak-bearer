/* eslint-disable no-new */
const { expect } = require('chai')
const KeycloakBearerStrategy = require('../src')
const nock = require('nock')
const { oidcMetadata } = require('./testData')

describe('KeycloakBearerStrategy', () => {
  it('should be named keycloak', () => {
    const options = {
      realm: 'master',
      url: 'http://localhost:8080/auth',
      clientId: 'clientId'
    }
    nock(options.url)
      .get(`/realms/${options.realm}/.well-known/openid-configuration`)
      .reply(200, oidcMetadata)
      .persist()

    const strategy = new KeycloakBearerStrategy(options)
    expect(strategy.name).to.equal('keycloak')
  })

  it('should throw if constructed without options', () => {
    expect(() => {
      new KeycloakBearerStrategy()
    }).to.throw(TypeError, 'KeycloakBearerStrategy: options is required')
  })

  it('should throw if constructed with options without url', () => {
    expect(() => {
      new KeycloakBearerStrategy({ realm: 'realm', clientId: 'clientId' })
    }).to.throw(TypeError, 'KeycloakBearerStrategy: url cannot be empty')
  })

  it('should throw if constructed with options without realm', () => {
    expect(() => {
      new KeycloakBearerStrategy({ url: 'url', clientId: 'clientId' })
    }).to.throw(TypeError, 'KeycloakBearerStrategy: realm cannot be empty')
  })
})
