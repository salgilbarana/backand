const { OAuth2Client } = require('google-auth-library');

class OAuthModule {
  constructor(clientId) {
    this.clientId = clientId;
    this.client = new OAuth2Client(clientId);
  }

  async verify(token) {
    let result;
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });
      const payload = ticket.getPayload();
      result = {
        email: payload.email,
        email_verified: payload.email_verified,
        name: payload.name,
        profile_img: payload.picture,
        locale: payload.locale,
      };
    } catch (err) {
      console.error(err);
    }

    return result;
  }
}

module.exports = OAuthModule;
