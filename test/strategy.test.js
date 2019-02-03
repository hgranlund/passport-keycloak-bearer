/* eslint-disable no-new */
const { expect } = require('chai')
const KeycloakBearerStrategy = require('../src')

describe('KeycloakBearerStrategy', () => {
  it('should be named keycloak', () => {
    const strategy = new KeycloakBearerStrategy({
      realm: 'realm',
      host: 'host',
      clientId: 'clientId'
    })
    expect(strategy.name).to.equal('keycloak')
  })

  it('should throw if constructed without options', () => {
    expect(() => {
      new KeycloakBearerStrategy()
    }).to.throw(TypeError, 'KeycloakBearerStrategy: options is required')
  })

  it('should throw if constructed with options without host', () => {
    expect(() => {
      new KeycloakBearerStrategy({ realm: 'realm', clientId: 'clientId' })
    }).to.throw(TypeError, 'KeycloakBearerStrategy: host cannot be empty')
  })

  it('should throw if constructed with options without realm', () => {
    expect(() => {
      new KeycloakBearerStrategy({ host: 'host', clientId: 'clientId' })
    }).to.throw(TypeError, 'KeycloakBearerStrategy: realm cannot be empty')
  })
})
