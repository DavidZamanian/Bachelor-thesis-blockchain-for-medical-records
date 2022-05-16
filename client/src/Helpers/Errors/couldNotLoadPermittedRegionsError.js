/**
 * Error to be used upon failure to load a patient's permission settings.
 * @author Hampus Jenkrook
 */
export default class CouldNotLoadPermittedRegionsError extends Error {
  constructor(msg) {
    super(msg);
  }
}
