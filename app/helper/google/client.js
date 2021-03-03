const OAuthModule = require('./module/oauth');
const YoutubeModule = require('./module/youtube');

class GoogleClient {
  constructor(config) {
    this.oauth = new OAuthModule(config.client_id);
    this.youtube = new YoutubeModule();
  }

  async verifyToken(token) {
    return this.oauth.verify(token);
  }

  async getPlaylists(params) {
    return this.youtube.getPlaylists(params);
  }

  async getPlaylistItems(params) {
    return this.youtube.getPlaylistItems(params);
  }

  async getVideos(params) {
    return this.youtube.getVideos(params);
  }

  async searchVideo(params) {
    return this.youtube.searchVideo(params);
  }

  async getComments(params) {
    return this.youtube.getComments(params);
  }
}

module.exports = GoogleClient;
