const request = require('request')
const rsaPublicKeyPem = require('./rsaPemDecoder')
const Token = require('./token')

class OIDCMatadata {
  constructor (host, realm, log) {
    this.log = log
    this.jwksUrl = `${host}/auth/realms/${realm}/protocol/openid-connect/certs`
    this.keys = this.getPemKeys().catch(err => {
      this.log.warn(err.message)
    })
  }

  getPemKeys () {
    return new Promise((resolve, reject) => {
      if (Array.isArray(this.keys) && this.keys.length > 0) {
        return resolve(this.keys)
      }
      return request.get(
        this.jwksUrl,
        { json: true },
        (err, response, body) => {
          if (err) {
            return reject(err)
          }
          if (response.statusCode !== 200) {
            return reject(
              new Error(
                `Cannot get AAD signing Keys from url ${
                  this.jwksUrl
                }. We got a  ${response.statusCode}: ${response.message} `
              )
            )
          }
          if (!body.keys || body.keys.lenght === 0) {
            return reject(new Error('We got no AAD signing Keys'))
          }
          this.keys = body.keys.map(key => ({
            ...key,
            pemKey: rsaPublicKeyPem(key.n, key.e)
          }))
          this.log.debug(
            `Found keys: [${this.keys.map(key => `'${key.kid}'`).join(', ')}]`
          )
          return this.keys
        }
      )
    })
  }

  pemKeyFromToken (rawToken, done) {
    try {
      const token = new Token(rawToken)
      if (token.isExpired()) {
        this.log.info('The access token has expired')
      }
      this.log.debug(`Got token with kid: ${token.header.kid}`)
      return this.getPemKeys().then(keys => {
        const keyforToken = keys.find(key => key.kid === token.header.kid)
        if (!keyforToken) {
          const err = new Error(`No key matching kid ${token.header.kid}`)
          this.log.warn(err)
          done(err)
        } else {
          done(null, keyforToken.pemKey)
        }
      })
    } catch (error) {
      this.log.warn(error.message)
      return done(error)
    }
  }
}

module.exports = OIDCMatadata
