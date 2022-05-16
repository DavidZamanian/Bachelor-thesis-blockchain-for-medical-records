/**
 * Error to be used when the reading of a Web3Storage-file failed.
 * The @msg parameter specifies the error that was thrown by fetch().
 *
 * @author @Chrimle
 */
export default class FetchFileContentError extends Error {
  /**
   *
   * @param {String} msg - error message thrown by fetch()
   */
  constructor(msg) {
    super(`Error while attempting to access the Web3Storage file: ${msg}`);
  }
}
