/**单条回答信息 */
interface IMessageItem {
  /**回答的ID,随机字符串,用作列表的key */
  id: string;
  /**角色类型,user:用户, assistant:AI*/
  role: 'user' | 'assistant';
  /**问题和回答的内容 */
  content: string;
}
