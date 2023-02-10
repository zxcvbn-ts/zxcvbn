export type FetchApi = WindowOrWorkerGlobalScope['fetch']

export type NetworkErrorHandler = (error: Error | Response) => false

export interface MatcherPwnedFactoryConfig {
  url?: string
  networkErrorHandler?: NetworkErrorHandler
}
export interface HaveIBeenPwnedConfig {
  universalFetch: FetchApi
  url?: string
  networkErrorHandler?: NetworkErrorHandler
}
