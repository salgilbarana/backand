const GoogleClient = require('./client');

let googleModule;

async function initGoogleClient(googleConfig) {
    if(!googleConfig) return;

    googleModule = new GoogleClient( googleConfig);
}

function getHelper() {
    if (!googleModule) {
        throw Error('google module load fail');
    }

}

module.exports = {
    GoogleClient: getHelper,
    initGoogleClient,
}