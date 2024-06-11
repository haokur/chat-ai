import './App.scss';

import { useEffect, useRef, useState } from 'react';

import ChatInputKeyModal, { IChatInputKeyModalMethods } from './components/ChatInputKeyModal';
import ChatMessageItem from './components/ChatMessageItem';
import ChatQuestionInput from './components/ChatQuestionInput';
import {
  MY_SITE_NAME,
  MY_SITE_URL,
  OPENROUTER_REQUSET_URL,
  SearchInputStatus,
} from './configs/const.config';
import { STORAGE_API_KEY } from './configs/storage.config';
import { fetchStream } from './utils/fetch.util';
import { generateRandomString } from './utils/string.util';

export default function App() {
  // 不可用(没有key),可用,等待
  const [status, setStatus] = useState<SearchInputStatus>(SearchInputStatus.Unavailable);
  const [messageList, setMessageList] = useState<IMessageItem[]>([]);
  const [apiKey, setApiKey] = useState('');

  const inputApiKeyRef = useRef<IChatInputKeyModalMethods>(null);

  useEffect(() => {
    const localApiKey = localStorage.getItem(STORAGE_API_KEY);
    if (localApiKey) {
      setStatus(SearchInputStatus.Active);
      setApiKey(localApiKey);
    }
  }, []);

  useEffect(() => {
    window.scroll(0, 100000);
  }, [messageList]);

  const handleQuestion = function (question: string) {
    sendQuestion(question);
  };

  // 更新最新一条信息内容(回答信息,可能流式数据,一点一点更新)
  const updateLatestMessageInfo = function (answerData: string) {
    if (!answerData) return;
    setMessageList((messageList) => {
      const _prevMesages = messageList.slice(0, -1);
      const _latestMessage = messageList[messageList.length - 1];
      return [..._prevMesages, { ..._latestMessage, content: answerData }];
    });
  };

  const sendQuestion = async (question: string) => {
    setStatus(SearchInputStatus.Disabled);
    setMessageList([
      ...messageList,
      { role: 'user', content: question, id: generateRandomString() },
    ]);
    setMessageList((messageList) => {
      return [
        ...messageList,
        { role: 'assistant', content: `AI思考中...`, id: generateRandomString() },
      ];
    });
    let answerResult = '';
    await fetchStream(
      OPENROUTER_REQUSET_URL,
      {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': `${MY_SITE_URL}`,
          'X-Title': `${MY_SITE_NAME}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stream: true,
          model: 'openai/gpt-3.5-turbo',
          messages: [
            ...messageList
              .filter(
                (item) => !['请求错误', 'apiKey失效,请输入正确的apiKey'].includes(item.content)
              )
              .map((item) => {
                return {
                  role: item.role,
                  content: item.content,
                };
              }),
            { role: 'user', content: `${question}` },
          ],
        }),
      },
      (streamData: string) => {
        if (streamData.startsWith('data:')) {
          let dataArr = streamData.split('data:');
          dataArr = dataArr.filter((item) => item !== '');
          dataArr.forEach((item) => {
            if (!item.includes('[DONE]')) {
              item = item.replace(': OPENROUTER PROCESSING', '');
              try {
                const jsonItem = JSON.parse(item);
                answerResult += jsonItem.choices[0].delta.content;
              } catch (error) {
                // console.log(error, 'App.tsx::87行');
              }
            }
          });

          updateLatestMessageInfo(answerResult);
        }
      }
    )
      .then(() => {
        setStatus(SearchInputStatus.Active);
      })
      .catch((err) => {
        const error = err.toString();
        if (error.includes('401 no auth')) {
          localStorage.removeItem(STORAGE_API_KEY);
          setStatus(SearchInputStatus.Unavailable);
          updateLatestMessageInfo('apiKey失效,请输入正确的apiKey');
          showInputApiKeyModal();
        } else if (error.includes('Failed to fetch')) {
          setStatus(SearchInputStatus.Active);
          updateLatestMessageInfo('请求错误');
        }
      });
  };

  const showInputApiKeyModal = () => {
    inputApiKeyRef?.current?.openApiKeyInputModal();
  };

  const handleApiKeyUpdate = (apiKey: string) => {
    setStatus(SearchInputStatus.Active);
    setApiKey(apiKey);
  };

  return (
    <div className="qa-wrap">
      {/* 填写key的面板 */}
      <ChatInputKeyModal
        ref={inputApiKeyRef}
        onUpdateApiKey={handleApiKeyUpdate}
      ></ChatInputKeyModal>

      {/* 信息列表 */}
      <ul className="qa-list">
        {messageList.map((messageItem) => {
          return (
            <li className="qa-item" key={messageItem.id}>
              <ChatMessageItem config={messageItem}></ChatMessageItem>
            </li>
          );
        })}
      </ul>

      {/* 问题操作面板 */}
      <div className="qa-search">
        <ChatQuestionInput
          status={status}
          onQuestion={handleQuestion}
          onInputApiKey={showInputApiKeyModal}
        ></ChatQuestionInput>
      </div>
    </div>
  );
}
