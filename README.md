# passport-keycloak-bearer

[![GitHub stars](https://img.shields.io/github/stars/hgranlund/passport-keycloak-bearer.svg?style=social&label=Stars)](https://github.com/hgranlund/passport-keycloak-bearer)

> HTTP Bearer authentication strategy for [Passport](http://passportjs.org/) and [Keycloak](https://www.keycloak.org/).

This module lets you authenticate HTTP requests using bearer tokens with a Keycloak authority, in your Node.js
applications.  Bearer tokens are typically used protect API endpoints, and are
often issued using OAuth 2.0.

By plugging into Passport, bearer token support can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).


## Install

    $ npm install passport-keycloak-bearer

## Usage


#### Configure Strategy

The HTTP Bearer authentication strategy authenticates users using a bearer
token.  The strategy has a optional `verify` callback, which accepts that
credential and calls `done` providing a user.  Optional `info` can be passed,
typically including associated scope, which will be set by Passport at
`req.authInfo` to be used by later middleware for authorization and access
control.

      import KeycloakBearerStrategy from 'passport-keycloak-bearer'
      ...

      passport.use(new KeycloakBearerStrategy(({
          "realm": "master",
          "host": "https://keycloak.dev.com",
          "clientId": "test-test"
      }),
        function(token, done) {
          const user = createUser(token);
          return done(null, user);
        }));



#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'keycloak'` strategy, to
authenticate requests.  Requests containing bearer verifidT do not require session
support, so the `session` option can be set to `false`.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/profile', 
      passport.authenticate('keycloak', { session: false }),
      function(req, res) {
        res.json(req.user);
      });


## Support

Submit an [issue](https://github.com/hgranlund/passport-keycloak-bearer/issues/new)

## Contribute

[Contribute](https://github.com/hgranlund/passport-keycloak-bearer/blob/master/CONTRIBUTING.md) usage docs

## License

[MIT License](https://github.com/hgranlund/passport-keycloak-bearer/blob/master/LICENSE)

[Simen Haugerud Granlund](https://hgranlund.com) © 2018


## Credits

* [Simen Haugerud Granlund](https://hgranlund.com) - Author
