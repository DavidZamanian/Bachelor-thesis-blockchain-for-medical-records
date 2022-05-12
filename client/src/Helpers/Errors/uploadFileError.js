/**
 * Error to be used when the attempted file upload failed
 * The @msg parameter specifies the error that was thrown by Web3Storage class.
 *
 * @author @Chrimle
 */
export default class UploadFileError extends Error {
  /**
   *
   * @param {String} msg - error message thrown by Web3Storage
   */
  constructor(msg) {
    super(`Error while uploading the File Object: ${msg}`);
  }
}
