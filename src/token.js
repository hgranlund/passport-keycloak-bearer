export default class Token {
  constructor(token) {
    this.token = token;
    const [headerPart, contentPat, signaturePart] = token.split('.');
    this.header = JSON.parse(Buffer.from(headerPart, 'base64').toString());
    this.content = JSON.parse(Buffer.from(contentPat, 'base64').toString());
    this.signature = Buffer.from(signaturePart, 'base64');
    this.signed = `${headerPart}.${contentPat}`;
  }

  isExpired() {
    return !(this.content.exp * 1000 > Date.now());
  }

  hasApplicationRole(appName, roleName) {
    const appRoles = this.content.resource_access[appName];

    if (!appRoles) {
      return false;
    }

    return appRoles.roles.indexOf(roleName) >= 0;
  }

  hasRealmRole(roleName) {
    return this.content.realm_access.roles.indexOf(roleName) >= 0;
  }
}
