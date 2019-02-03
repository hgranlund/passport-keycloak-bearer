const chai = require('chai')
const passport = require('chai-passport-strategy')
const { validToken, validPem } = require('../testData')
const rewiremock = require('rewiremock').default

chai.use(require('chai-passport-strategy'))

rewiremock('jsonwebtoken').with({
  verify: (token, secretOrKey, _verifOpts, callback) => {
    if (token === validToken && secretOrKey === validPem) {
      callback(null, { name: 'Simen Granlund' })
    } else {
      callback(new Error('Token is not valid'))
    }
  }
})
rewiremock.enable()
chai.use(passport)

global.expect = chai.expect
