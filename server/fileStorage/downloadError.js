export default class DownloadError extends Error {
    constructor(msg) {
        super(`Error occurred while downloading a file. Error was: ${msg}`);
    }
}