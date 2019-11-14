const request = require('request-promise-native')
const rsaPublicKeyPem = require('./rsaPemDecoder')
const Token = require('./token')

class OIDCMatadata {
  constructor (url, realm, log) {
    this.log = log
    this.url = url
    this.discoveryUrl = `${url}/realms/${realm}/.well-known/openid-configuration`
    this.getPemKeys().catch(err => {
      this.log.warn(err.message)
    })
  }

  getKeysFromResponse (body) {
    if (!body.keys || body.keys.length === 0) {
      throw new Error('We got no AAD signing Keys')
    }
    return body.keys.map(key => ({
      ...key,
      pemKey: rsaPublicKeyPem(key.n, key.e)
    }))
  }

  async getJwksUri () {
    try {
      const discoverUrls = await request.get(this.discoveryUrl, { json: true })
      if (!discoverUrls.jwks_uri) {
        throw new Error(`Unable to get OIDC metadata from ${this.discoveryUrl}`)
      }
      return discoverUrls.jwks_uri
    } catch (error) {
      throw new Error(
        `Unable to get OIDC metadata from ${this.discoveryUrl}: ${
          error.message
        }`
      )
    }
  }

  async getPemKeys () {
    if (Array.isArray(this.keys) && this.keys.length > 0) {
      return this.keys
    }
    const jwksUri = await this.getJwksUri()
    try {
      const response = await request.get(jwksUri, { json: true })
      this.keys = this.getKeysFromResponse(response)
      return this.keys
    } catch (error) {
      const errorMsg = `Cannot get AAD signing Keys from url ${jwksUri}. We got a  ${
        error.statusCode
      }: ${error.message} `
      throw new Error(errorMsg)
    }
  }

  async pemKeyFromToken (rawToken, done) {
    const token = new Token(rawToken)
    if (token.isExpired()) {
      this.log.info('The access token has expired')
    }
    this.log.debug(`Got token with kid: ${token.header.kid}`)

    const keys = await this.getPemKeys()
    const keyforToken = keys.find(key => key.kid === token.header.kid)
    if (!keyforToken) throw Error(`No key matching kid ${token.header.kid}`)

    return keyforToken.pemKey
  }
}

module.exports = OIDCMatadata
