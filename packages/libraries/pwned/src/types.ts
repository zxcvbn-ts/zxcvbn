export type FetchApi = WindowOrWorkerGlobalScope['fetch']

export type NetworkErrorHandler = (error: Error | Response) => false

export interface MatcherPwnedFactoryConfig {
  /**
   * @description The url to an haveIBeenPwned api database. If empty the original url will be used.
   */
  url?: string
  /**
   * @description An error handler to handle network request. By default this function will just return false to silently ignore the pwned matcher.
   */
  networkErrorHandler?: NetworkErrorHandler
}
export interface HaveIBeenPwnedConfig extends MatcherPwnedFactoryConfig {
  universalFetch: FetchApi
}
