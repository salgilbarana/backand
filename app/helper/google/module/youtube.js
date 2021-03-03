/* eslint-disable class-methods-use-this */
const request = require('request-promise');

const STRICT_SSL = false;

class YoutubeModule {
  constructor() {
    this.apiUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async get(method, params) {
    let result;
    try {
      result = await request({
        uri: `${this.apiUrl}/${method}`,
        qs: params,
        strictSSL: STRICT_SSL,
      });

      return JSON.parse(result);
    } catch (err) {
      console.log(err);
    }

    return null;
  }

  async getPlaylists(params) {
    return this.get('playlists', params);
  }

  async getPlaylistItems(params) {
    return this.get('playlistItems', params);
  }

  async getVideos(params) {
    return this.get('videos', params);
  }

  async searchVideo(params) {
    return this.get('search', params);
  }

  async getComments(params) {
    return this.get('commentThreads', params);
  }
}

module.exports = YoutubeModule;
