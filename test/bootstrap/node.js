const { use, expect } = require('chai')
const passport = require('chai-passport-strategy')

use(passport)

global.expect = expect
