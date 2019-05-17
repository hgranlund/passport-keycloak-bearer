# passport-keycloak-bearer

[![GitHub stars](https://img.shields.io/github/stars/hgranlund/passport-keycloak-bearer.svg?style=social&label=Stars)](https://github.com/hgranlund/passport-keycloak-bearer)
[![Build](https://travis-ci.org/hgranlund/passport-keycloak-bearer.png)](http://travis-ci.org/hgranlund/passport-keycloak-bearer)

> HTTP Bearer authentication strategy for [Passport](http://passportjs.org/) and [Keycloak](https://www.keycloak.org/).

This module lets you authenticate HTTP requests using bearer tokens with a Keycloak authority in your Node.js
applications. Bearer tokens are typically used protect API endpoints, and are
often issued using OAuth 2.0.

By plugging into Passport, bearer token support can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-keycloak-bearer

## Usage

KeycloakBearerStrategy uses Bearer Token protocol to protect web resource/api. It works in the following manner:
User sends a request to the protected web api which contains an access_token in either the authorization header or body. Passport extracts and validates the access_token, and propagates the claims in access_token to the `verify` callback and let the framework finish the remaining authentication procedure.

On successful authentication, passport adds the user information to `req.user` and passes it to the next middleware, which is usually the business logic of the web resource/api. In case of error, passport sends back an unauthorized response.

#### Sample usage

```js
      import KeycloakBearerStrategy from 'passport-keycloak-bearer'
      ...
      // new KeycloakBearerStrategy(options, verify)
      passport.use(new KeycloakBearerStrategy(({
          "realm": "master",
          "url": "https://keycloak.dev.com/auth"
      }, (jwtPayload, done) => {
          const user = doSomethingWithUser(jwtPayload);
          return done(null, user);
      }));
```

The JWT authentication strategy is constructed as follows:

    new KeycloakBearerStrategy(options, verify)

##### Options

- `url` (Required)

  Keycloak auth url. For instance: https://keycloak.dev.org/auth.

- `realm` (Required)

  Your realm.

- `passReqToCallback` (Optional - Default: false)

  Whether you want to use `req` as the first parameter in the verify callback. See section 5.1.1.3 for more details.

- `loggingLevel` (Optional - Default: 'warn')

  Logging level. 'debug', 'info', 'warn' or 'error'.

- `customLogger` (Optional)

  Custom logging instance. It must be able to log the following types: 'debug', 'info', 'warn' and 'error'.

- `issuer` (Optional)

  If defined the token issuer (iss) will be verified against this
  value.

- `audience` (Optional)

  If defined, the token audience (aud) will be verified against
  this value.

- `algorithms` (Optional - Default: ['HS256'])

  List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].

- `ignoreExpiration` (Optional)

  If true do not validate the expiration of the token.

- `jsonWebTokenOptions` (Optional)

  passport-keycloak-bearer is verifying the token using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).
  Pass here an options object for any other option you can pass the jsonwebtoken verifier. (i.e maxAge)

##### Verify callback

`verify` is a function with the parameters `verify(jwtPayload, done)`

- `jwtPayload` is an object literal containing the decoded JWT payload.
- `done` is a passport error first callback accepting arguments
  done(error, user, info)

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'keycloak'` strategy, to
authenticate requests. Requests containing bearer verified do not require session support, so the `session` option can be set to `false`.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get(
  '/path',
  passport.authenticate('keycloak', { session: false }),
  function(req, res) {
    res.json(req.user);
  }
);
```

## Support

Submit an [issue](https://github.com/hgranlund/passport-keycloak-bearer/issues/new)

## Contribute

[Contribute](https://github.com/hgranlund/passport-keycloak-bearer/blob/master/CONTRIBUTING.md) usage docs

## License

[MIT License](https://github.com/hgranlund/passport-keycloak-bearer/blob/master/LICENSE)

[Simen Haugerud Granlund](https://hgranlund.com) © 2018

## Credits

- [Simen Haugerud Granlund](https://hgranlund.com) - Author
