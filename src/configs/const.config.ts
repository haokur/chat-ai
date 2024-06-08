export const OPENROUTER_REQUSET_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const MY_SITE_NAME = 'simple-ai';
export const MY_SITE_URL = 'https://simple-ai.com';

export enum SearchInputStatus {
  /**不可用状态,即localstorage中未找到apiKey */
  Unavailable = 1,
  /**可用状态,可输入问题 */
  Active = 2,
  /**禁用状态,即AI正在回答中时 */
  Disabled = 3,
}
