import {use, expect} from 'chai';
import passport from 'chai-passport-strategy';

use(passport);

global.expect = expect;
